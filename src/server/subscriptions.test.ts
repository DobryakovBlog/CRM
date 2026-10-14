import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner } from "./auth";
import { salonSubscription } from "./cabinet";
import { cancelSubscription, grantFreeMonths, listSubscriptions, setFreeUntil } from "./subscriptions";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/astrabela_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

const signUp = new Date("2026-10-01T10:00:00Z"); // trial runs to 2027-01-01
const owner = { name: "Owner", password: "secret123", address: "Rua 1", phone: "", city: "lisboa" };
let salonId: string, restaurantId: string;

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate users, salons cascade`);
  salonId = (await registerSalonOwner(db, { ...owner, email: "s@test.pt", salonName: "Salão Azul" }, signUp)).salon.id;
  restaurantId = (await registerSalonOwner(db, { ...owner, email: "r@test.pt", salonName: "Taberna", kind: "restaurant" })).salon.id;
});

afterAll(async () => {
  await pool.end();
});

describe("admin subscription tools", () => {
  it("adds free months after the time the salon already has", async () => {
    await grantFreeMonths(db, salonId, 12, "parceiro fundador", new Date("2026-10-14T12:00:00Z"));
    const sub = await salonSubscription(db, salonId);
    expect(sub).toMatchObject({ status: "complimentary", note: "parceiro fundador" });
    expect(sub?.currentPeriodEnd.toISOString()).toBe("2028-01-01T10:00:00.000Z");
  });

  it("starts from today once the subscription has ended", async () => {
    await cancelSubscription(db, salonId, new Date("2026-10-14T12:00:00Z"));
    await grantFreeMonths(db, salonId, 24, "", new Date("2026-10-20T12:00:00Z"));
    expect((await salonSubscription(db, salonId))?.currentPeriodEnd.toISOString()).toBe("2028-10-20T12:00:00.000Z");
  });

  it("sets an exact end date and refuses past dates and restaurants", async () => {
    const now = new Date("2026-10-14T12:00:00Z");
    await setFreeUntil(db, salonId, "2030-12-31", "", now);
    expect((await salonSubscription(db, salonId))?.currentPeriodEnd.toISOString()).toBe("2030-12-31T23:59:59.000Z");
    await expect(setFreeUntil(db, salonId, "2026-10-01", "", now)).rejects.toThrow("invalid_date");
    await expect(grantFreeMonths(db, restaurantId, 12)).rejects.toThrow("not_a_salon");
    await expect(grantFreeMonths(db, salonId, 0)).rejects.toThrow("invalid_months");
  });

  it("lists salons only and finds them by name", async () => {
    const all = await listSubscriptions(db);
    expect(all.map((r) => r.name)).toEqual(["Salão Azul"]);
    expect(await listSubscriptions(db, "azul")).toHaveLength(1);
    expect(await listSubscriptions(db, "nada")).toHaveLength(0);
  });
});
