import { createHash, randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { telegramChats, telegramRelays, telegramSettings } from "@/db/schema";

/**
 * Support bot (@astrabela_bot). Clients pick a language, write, and their messages are
 * forwarded into the support chat; a reply there goes back to the client from the bot.
 */

export type Lang = "pt" | "en";
export type TgApi = (method: string, body: Record<string, unknown>) => Promise<Record<string, unknown> | undefined>;

const ACK_EVERY_MS = 6 * 3600_000;
const LINK_CODE_TTL_MS = 3600_000;

export const TEXTS = {
  picker: "Olá! 👋 Escolha o idioma.\nHi! 👋 Choose your language.",
  welcome: {
    pt: "Bem-vindo ao suporte da Astrabela ✨\n\nEscreva a sua pergunta sobre marcações, a sua conta, salões ou restaurantes e respondemos aqui mesmo.\n\n🌐 astrabela.com",
    en: "Welcome to Astrabela support ✨\n\nWrite your question about bookings, your account, salons or restaurants and we will reply right here.\n\n🌐 astrabela.com",
  },
  startChat: { pt: "💬 Iniciar conversa", en: "💬 Start chat" },
  prompt: {
    pt: "Escreva a sua mensagem aqui em baixo 👇 Pode enviar texto, fotos ou mensagens de voz.",
    en: "Type your message below 👇 You can send text, photos or voice messages.",
  },
  ack: {
    pt: "Recebemos a sua mensagem ✅ Respondemos em breve.",
    en: "We got your message ✅ We'll reply soon.",
  },
  description: {
    pt: "Olá! Este é o suporte da Astrabela.\nEscreva a sua pergunta sobre marcações, a sua conta, salões ou restaurantes e respondemos o mais breve possível.\n\n🌐 astrabela.com",
    en: "Hi! This is Astrabela support.\nWrite your question about bookings, your account, salons or restaurants and we will reply as soon as we can.\n\n🌐 astrabela.com",
  },
  about: {
    pt: "Suporte Astrabela: marcações, salões e restaurantes.",
    en: "Astrabela support: bookings, salons and restaurants.",
  },
  commands: {
    pt: [
      { command: "start", description: "Começar" },
      { command: "idioma", description: "Mudar o idioma" },
    ],
    en: [
      { command: "start", description: "Start" },
      { command: "language", description: "Change language" },
    ],
  },
} as const;

const LANG_BUTTONS = {
  inline_keyboard: [
    [
      { text: "🇵🇹 Português", callback_data: "lang:pt" },
      { text: "🇬🇧 English", callback_data: "lang:en" },
    ],
  ],
};

export function botToken() {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || null;
}

/** Secret Telegram echoes in a header on every webhook call; derived from the token so no extra setting is needed. */
export function webhookSecret(token: string) {
  return createHash("sha256").update(`astrabela-webhook:${token}`).digest("hex").slice(0, 48);
}

export function telegramApi(token: string): TgApi {
  return async (method, body) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; result?: unknown; description?: string } | null;
    if (!json?.ok) {
      console.error(`[telegram] ${method} failed: ${json?.description ?? res.status}`);
      return undefined;
    }
    return (typeof json.result === "object" && json.result ? json.result : {}) as Record<string, unknown>;
  };
}

async function getSetting(db: Db, key: string) {
  const [row] = await db.select().from(telegramSettings).where(eq(telegramSettings.key, key));
  return row ?? null;
}

async function setSetting(db: Db, key: string, value: string) {
  await db
    .insert(telegramSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: telegramSettings.key, set: { value, updatedAt: new Date() } });
}

export async function supportChatId(db: Db) {
  const row = await getSetting(db, "support_chat_id");
  return row ? Number(row.value) : null;
}

/** New one-time code; the admin sends "/link CODE" to the bot to make that chat the support chat. */
export async function newLinkCode(db: Db) {
  const code = randomBytes(4).toString("hex").toUpperCase();
  await setSetting(db, "link_code", code);
  return code;
}

type TgUser = { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string };
type TgMessage = {
  message_id: number;
  chat: { id: number; type: string };
  from?: TgUser;
  text?: string;
  reply_to_message?: { message_id: number };
};
export type TgUpdate = {
  message?: TgMessage;
  callback_query?: { id: string; from: TgUser; data?: string; message?: { chat: { id: number } } };
};

const fullName = (u?: TgUser) => [u?.first_name, u?.last_name].filter(Boolean).join(" ");

async function rememberChat(db: Db, from: TgUser, patch: Partial<typeof telegramChats.$inferInsert> = {}) {
  const values = { chatId: from.id, name: fullName(from), username: from.username ?? "", ...patch };
  const [row] = await db
    .insert(telegramChats)
    .values(values)
    .onConflictDoUpdate({ target: telegramChats.chatId, set: { name: values.name, username: values.username, ...patch } })
    .returning();
  return row;
}

export async function handleUpdate(db: Db, update: TgUpdate, api: TgApi, now = new Date()) {
  const cb = update.callback_query;
  if (cb) {
    await api("answerCallbackQuery", { callback_query_id: cb.id });
    const lang = cb.data === "lang:pt" ? "pt" : cb.data === "lang:en" ? "en" : null;
    if (lang) {
      await rememberChat(db, cb.from, { lang });
      await api("sendMessage", {
        chat_id: cb.from.id,
        text: TEXTS.welcome[lang],
        reply_markup: { inline_keyboard: [[{ text: TEXTS.startChat[lang], callback_data: "chat:start" }]] },
      });
    } else if (cb.data === "chat:start") {
      const chat = await rememberChat(db, cb.from);
      await api("sendMessage", { chat_id: cb.from.id, text: TEXTS.prompt[(chat.lang as Lang | null) ?? "pt"] });
    }
    return;
  }

  const msg = update.message;
  if (!msg || msg.chat.type !== "private" || !msg.from) return;
  const text = msg.text?.trim() ?? "";
  const supportId = await supportChatId(db);

  const link = /^\/link\s+(\S+)$/i.exec(text);
  if (link) {
    const saved = await getSetting(db, "link_code");
    const fresh = saved && now.getTime() - saved.updatedAt.getTime() < LINK_CODE_TTL_MS;
    if (fresh && saved.value === link[1].toUpperCase()) {
      await setSetting(db, "support_chat_id", String(msg.chat.id));
      await setSetting(db, "link_code", "");
      await api("sendMessage", {
        chat_id: msg.chat.id,
        text: "✅ Este chat recebe agora as mensagens de suporte. Para responder a um cliente, use «Responder» na mensagem dele.",
      });
    } else {
      await api("sendMessage", { chat_id: msg.chat.id, text: "❌ Código inválido ou expirado." });
    }
    return;
  }

  if (supportId === msg.chat.id) {
    const replyTo = msg.reply_to_message?.message_id;
    const [relay] = replyTo
      ? await db.select().from(telegramRelays).where(eq(telegramRelays.supportMessageId, replyTo))
      : [];
    if (!relay) {
      await api("sendMessage", {
        chat_id: msg.chat.id,
        text: "ℹ️ Para responder a um cliente, toque na mensagem dele e escolha «Responder».",
      });
      return;
    }
    const sent = await api("copyMessage", { chat_id: relay.userChatId, from_chat_id: msg.chat.id, message_id: msg.message_id });
    if (!sent) await api("sendMessage", { chat_id: msg.chat.id, text: "❌ Não foi possível entregar (o cliente bloqueou o bot?)." });
    return;
  }

  if (/^\/(start|idioma|language)\b/i.test(text)) {
    await rememberChat(db, msg.from);
    await api("sendMessage", { chat_id: msg.chat.id, text: TEXTS.picker, reply_markup: LANG_BUTTONS });
    return;
  }

  const chat = await rememberChat(db, msg.from);
  if (supportId) {
    const header = await api("sendMessage", {
      chat_id: supportId,
      text: `👤 ${chat.name || "—"}${chat.username ? ` (@${chat.username})` : ""} · ${(chat.lang ?? "?").toUpperCase()} · id ${chat.chatId}`,
    });
    const fwd = await api("forwardMessage", { chat_id: supportId, from_chat_id: msg.chat.id, message_id: msg.message_id });
    const ids = [header?.message_id, fwd?.message_id].filter((v): v is number => typeof v === "number");
    if (ids.length) {
      await db
        .insert(telegramRelays)
        .values(ids.map((supportMessageId) => ({ supportMessageId, userChatId: chat.chatId })))
        .onConflictDoNothing();
    }
  } else {
    console.error("[telegram] support chat is not linked; message not forwarded");
  }

  if (!chat.lang) {
    await api("sendMessage", { chat_id: msg.chat.id, text: TEXTS.picker, reply_markup: LANG_BUTTONS });
    return;
  }
  if (!chat.lastAckAt || now.getTime() - chat.lastAckAt.getTime() > ACK_EVERY_MS) {
    await db.update(telegramChats).set({ lastAckAt: now }).where(eq(telegramChats.chatId, chat.chatId));
    await api("sendMessage", { chat_id: msg.chat.id, text: TEXTS.ack[chat.lang as Lang] });
  }
}

/** Points Telegram at our webhook and sets the bot's texts and commands in both languages. */
export async function connectBot(api: TgApi, appUrl: string, token: string) {
  const hook = await api("setWebhook", {
    url: `${appUrl.replace(/\/$/, "")}/api/telegram/webhook`,
    secret_token: webhookSecret(token),
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false,
  });
  if (!hook) return null;
  for (const lang of ["pt", "en"] as const) {
    const code = lang === "pt" ? { language_code: "pt" } : {};
    await api("setMyDescription", { description: TEXTS.description[lang], ...code });
    await api("setMyShortDescription", { short_description: TEXTS.about[lang], ...code });
    await api("setMyCommands", { commands: TEXTS.commands[lang], ...code });
  }
  const me = await api("getMe", {});
  return { username: typeof me?.username === "string" ? me.username : null };
}
