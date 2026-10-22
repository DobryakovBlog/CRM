import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { staff } from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner } from "./auth";
import { registerCustomer } from "./customers";
import { createOpenReview, publishedReviews } from "./reviews";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/astrabela_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

let salonId: string, otherSalonId: string, anaId: string;

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate users, salons, customers cascade`);
  const owner = { name: "Owner", password: "secret123", address: "Rua 1", phone: "", city: "lisboa" };
  salonId = (await registerSalonOwner(db, { ...owner, email: "s@test.pt", salonName: "Salão Azul" })).salon.id;
  otherSalonId = (await registerSalonOwner(db, { ...owner, email: "o@test.pt", salonName: "Outro" })).salon.id;
  [{ id: anaId }] = await db.insert(staff).values({ salonId, name: "Ana" }).returning();
});

afterAll(async () => {
  await pool.end();
});

describe("open reviews", () => {
  it("lets a signed-in client review a master without a booking, once per 30 days", async () => {
    const rita = await registerCustomer(db, { name: "Rita Sousa", email: "rita@example.com", password: "password1" });
    const now = new Date("2026-10-22T12:00:00Z");
    const review = await createOpenReview(db, rita, { salonId, staffId: anaId, rating: 5, text: " Ótima! " }, now);
    expect(review).toMatchObject({ authorName: "Rita", bookingId: null, text: "Ótima!" });

    const [shown] = await publishedReviews(db, salonId);
    expect(shown).toMatchObject({ staffName: "Ana", source: null });
    const [ana] = await db.select().from(staff).where(eq(staff.id, anaId));
    expect(ana.ratingCount).toBe(1);

    await expect(createOpenReview(db, rita, { salonId, staffId: anaId, rating: 4, text: "" }, now)).rejects.toThrow("too_soon");
    const later = new Date(now.getTime() + 31 * 86_400_000);
    await expect(createOpenReview(db, rita, { salonId, staffId: anaId, rating: 4, text: "" }, later)).resolves.toBeTruthy();
  });

  it("refuses a master from another salon and ratings out of range", async () => {
    const rita = await registerCustomer(db, { name: "Rita", email: "rita@example.com", password: "password1" });
    await expect(createOpenReview(db, rita, { salonId: otherSalonId, staffId: anaId, rating: 5, text: "" })).rejects.toThrow("invalid");
    await expect(createOpenReview(db, rita, { salonId, staffId: anaId, rating: 6, text: "" })).rejects.toThrow("invalid");
  });
});
