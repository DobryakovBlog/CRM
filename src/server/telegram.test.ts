import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import type { Db } from "@/db";
import { handleUpdate, newLinkCode, supportChatId, TEXTS, type TgApi, type TgUpdate } from "./telegram";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/astrabela_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

const ADMIN = 111;
const CLIENT = 222;

/** Records bot API calls and hands out increasing message ids. */
function fakeApi() {
  const calls: { method: string; body: Record<string, unknown> }[] = [];
  let nextId = 1000;
  const api: TgApi = async (method, body) => {
    calls.push({ method, body });
    return { message_id: nextId++ };
  };
  return { api, calls, sent: (chat: number) => calls.filter((c) => c.body.chat_id === chat) };
}

const message = (chat: number, text: string, extra: Record<string, unknown> = {}): TgUpdate => ({
  message: {
    message_id: Math.floor(Math.random() * 1e6),
    chat: { id: chat, type: "private" },
    from: { id: chat, first_name: chat === ADMIN ? "Admin" : "Ana", username: chat === ADMIN ? "boss" : "ana" },
    text,
    ...extra,
  },
});

async function linkAdmin(api: TgApi) {
  const code = await newLinkCode(db);
  await handleUpdate(db, message(ADMIN, `/link ${code.toLowerCase()}`), api);
}

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate telegram_chats, telegram_relays, telegram_settings`);
});

afterAll(async () => {
  await pool.end();
});

describe("telegram support bot", () => {
  it("offers the language choice on /start and greets in the chosen language", async () => {
    const { api, sent } = fakeApi();
    await handleUpdate(db, message(CLIENT, "/start"), api);
    const picker = sent(CLIENT)[0];
    expect(picker.body.text).toBe(TEXTS.picker);
    expect(JSON.stringify(picker.body.reply_markup)).toContain("lang:pt");

    await handleUpdate(db, { callback_query: { id: "cb", from: { id: CLIENT, first_name: "Ana" }, data: "lang:en" } }, api);
    const welcome = sent(CLIENT).at(-1);
    expect(welcome?.body.text).toBe(TEXTS.welcome.en);
    expect(JSON.stringify(welcome?.body.reply_markup)).toContain("chat:start");

    await handleUpdate(db, { callback_query: { id: "cb2", from: { id: CLIENT, first_name: "Ana" }, data: "chat:start" } }, api);
    expect(sent(CLIENT).at(-1)?.body.text).toBe(TEXTS.prompt.en);
  });

  it("links the support chat only with the current code", async () => {
    const { api } = fakeApi();
    await newLinkCode(db);
    await handleUpdate(db, message(ADMIN, "/link WRONG123"), api);
    expect(await supportChatId(db)).toBeNull();
    await linkAdmin(api);
    expect(await supportChatId(db)).toBe(ADMIN);
  });

  it("forwards client messages to support and sends the admin's reply back", async () => {
    const { api, calls, sent } = fakeApi();
    await linkAdmin(api);
    await handleUpdate(db, { callback_query: { id: "cb", from: { id: CLIENT, first_name: "Ana" }, data: "lang:pt" } }, api);

    await handleUpdate(db, message(CLIENT, "Olá, preciso de ajuda"), api);
    const fwd = calls.find((c) => c.method === "forwardMessage");
    expect(fwd?.body.chat_id).toBe(ADMIN);
    expect(sent(CLIENT).at(-1)?.body.text).toBe(TEXTS.ack.pt);

    // Second message within the hour: forwarded, but no second acknowledgement.
    const before = sent(CLIENT).length;
    await handleUpdate(db, message(CLIENT, "Mais uma coisa"), api);
    expect(sent(CLIENT).length).toBe(before);

    const forwardedId = 1000 + calls.findIndex((c) => c.method === "forwardMessage");
    await handleUpdate(db, message(ADMIN, "Claro!", { reply_to_message: { message_id: forwardedId } }), api);
    const copy = calls.at(-1);
    expect(copy?.method).toBe("copyMessage");
    expect(copy?.body.chat_id).toBe(CLIENT);
  });

  it("asks a client who skipped the choice to pick a language", async () => {
    const { api, sent } = fakeApi();
    await handleUpdate(db, message(CLIENT, "hello"), api);
    expect(sent(CLIENT).at(-1)?.body.text).toBe(TEXTS.picker);
  });
});
