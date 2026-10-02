import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { clients, salons, services, staff, staffServices, workingHours } from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner } from "./auth";
import { BookingError, cancelByClient, createBooking, setBookingStatus, slotsForDate } from "./booking";
import { searchSalons } from "./catalog";
import { createReview, setReviewStatus } from "./reviews";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/beauty_advisor_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

// Monday 5 Oct 2026; Lisbon is UTC+1 that day. "now" is the Friday before.
const NOW = new Date("2026-10-02T12:00:00Z");
const AFTER_VISITS = new Date("2026-10-06T12:00:00Z");
const MONDAY = "2026-10-05";
const at = (hhmm: string) => new Date(`${MONDAY}T${hhmm}:00+01:00`);
const client = { name: "Rita Alves", email: "Rita@Example.com", phone: "+351910000000" };

let salonId: string, serviceId: string, anaId: string, joanaId: string;

async function setup() {
  const { salon } = await registerSalonOwner(
    db,
    { name: "Owner", email: "owner@test.pt", password: "secret123", salonName: "Salão Teste", city: "Lisboa", address: "Rua 1", phone: "" },
    NOW,
  );
  salonId = salon.id;
  await db.update(salons).set({ status: "active" }).where(eq(salons.id, salonId));
  const [svc] = await db
    .insert(services)
    .values({ salonId, category: "hair", name: "Corte", durationMinutes: 60, priceCents: 3500 })
    .returning();
  serviceId = svc.id;
  const [ana, joana] = await db
    .insert(staff)
    .values([
      { salonId, name: "Ana", languages: ["pt", "en"] },
      { salonId, name: "Joana" },
    ])
    .returning();
  anaId = ana.id;
  joanaId = joana.id;
  await db.insert(staffServices).values([
    { staffId: anaId, serviceId },
    { staffId: joanaId, serviceId },
  ]);
  // Ana works Monday 09:00-12:00, Joana Monday 11:00-13:00.
  await db.insert(workingHours).values([
    { staffId: anaId, weekday: 1, startMinute: 540, endMinute: 720 },
    { staffId: joanaId, weekday: 1, startMinute: 660, endMinute: 780 },
  ]);
}

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate users, salons cascade`);
  await setup();
});

afterAll(async () => {
  await pool.end();
});

const book = (staffId: string, startsAt: Date) =>
  createBooking(db, { salonId, serviceId, staffId, startsAt, client, now: NOW });

describe("slots", () => {
  it("merges masters when the client has no preference", async () => {
    const slots = await slotsForDate(db, { salonId, serviceId, staffId: null, date: MONDAY, now: NOW });
    const times = slots.map((s) => s.startsAt.getTime());
    expect(times[0]).toBe(at("09:00").getTime());
    expect(times.at(-1)).toBe(at("12:00").getTime()); // only Joana is free at 12:00
    expect(new Set(times).size).toBe(times.length);
    expect(slots.find((s) => s.startsAt.getTime() === at("12:00").getTime())?.staffId).toBe(joanaId);
  });

  it("hides a taken time for that master only", async () => {
    await book(anaId, at("11:00"));
    const ana = await slotsForDate(db, { salonId, serviceId, staffId: anaId, date: MONDAY, now: NOW });
    expect(ana.map((s) => s.startsAt.getTime())).not.toContain(at("11:00").getTime());
    const any = await slotsForDate(db, { salonId, serviceId, staffId: null, date: MONDAY, now: NOW });
    expect(any.find((s) => s.startsAt.getTime() === at("11:00").getTime())?.staffId).toBe(joanaId);
  });
});

describe("createBooking", () => {
  it("creates the booking and the salon's client card", async () => {
    const b = await book(anaId, at("09:00"));
    expect(b.status).toBe("confirmed");
    expect(b.endsAt.getTime() - b.startsAt.getTime()).toBe(3_600_000);
    const [c] = await db.select().from(clients).where(eq(clients.id, b.clientId));
    expect(c.email).toBe("rita@example.com");
  });

  it("reuses the client card on the next booking", async () => {
    const a = await book(anaId, at("09:00"));
    const b = await book(anaId, at("10:00"));
    expect(b.clientId).toBe(a.clientId);
  });

  it("rejects a double booking, even when requested at the same moment", async () => {
    const results = await Promise.allSettled([book(anaId, at("09:00")), book(anaId, at("09:30"))]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const rejected = results.find((r) => r.status === "rejected") as PromiseRejectedResult;
    expect(rejected.reason).toBeInstanceOf(BookingError);
  });

  it("rejects times outside working hours", async () => {
    await expect(book(anaId, at("12:00"))).rejects.toThrow("slot_taken");
  });

  it("frees the time again after the client cancels", async () => {
    const b = await book(anaId, at("09:00"));
    await cancelByClient(db, b.manageToken, NOW);
    await expect(book(anaId, at("09:00"))).resolves.toBeTruthy();
  });
});

describe("reviews", () => {
  it("only allows a review after a completed visit, once", async () => {
    const b = await book(anaId, at("09:00"));
    await expect(createReview(db, b.manageToken, { rating: 5, text: "Ótimo", authorName: "Rita" })).rejects.toThrow(
      "not_allowed",
    );
    await setBookingStatus(db, salonId, b.id, "completed", AFTER_VISITS);
    await createReview(db, b.manageToken, { rating: 4, text: "Ótimo", authorName: "Rita" });
    await expect(createReview(db, b.manageToken, { rating: 5, text: "", authorName: "" })).rejects.toThrow(
      "not_allowed",
    );

    const [s] = await db.select().from(salons).where(eq(salons.id, salonId));
    const [a] = await db.select().from(staff).where(eq(staff.id, anaId));
    expect([s.ratingAvg, s.ratingCount]).toEqual([400, 1]);
    expect([a.ratingAvg, a.ratingCount]).toEqual([400, 1]);
  });

  it("drops hidden reviews from the rating", async () => {
    const b = await book(anaId, at("09:00"));
    await setBookingStatus(db, salonId, b.id, "completed", AFTER_VISITS);
    const r = await createReview(db, b.manageToken, { rating: 1, text: "", authorName: "X" });
    await setReviewStatus(db, r.id, "hidden");
    const [s] = await db.select().from(salons).where(eq(salons.id, salonId));
    expect(s.ratingCount).toBe(0);
  });
});

describe("visit outcome", () => {
  it("cannot be marked before the visit starts", async () => {
    const b = await book(anaId, at("09:00"));
    await expect(setBookingStatus(db, salonId, b.id, "completed", NOW)).rejects.toThrow("not_allowed");
    await expect(setBookingStatus(db, salonId, b.id, "cancelled", NOW)).resolves.toBeUndefined();
  });
});

describe("no-shows", () => {
  it("counts no-shows on the client card and undoes the count on correction", async () => {
    const b = await book(anaId, at("09:00"));
    await setBookingStatus(db, salonId, b.id, "no_show", AFTER_VISITS);
    let [c] = await db.select().from(clients).where(eq(clients.id, b.clientId));
    expect(c.noShowCount).toBe(1);
    await setBookingStatus(db, salonId, b.id, "completed", AFTER_VISITS);
    [c] = await db.select().from(clients).where(eq(clients.id, b.clientId));
    expect(c.noShowCount).toBe(0);
  });
});

describe("catalogue", () => {
  it("lists only active salons with a bookable service and a running subscription", async () => {
    const [listed] = await searchSalons(db, { city: "lisboa" });
    expect(listed.id).toBe(salonId);
    expect(listed.minPriceCents).toBe(3500);
    expect(await searchSalons(db, { city: "lisboa", category: "nails" })).toEqual([]);
    expect(await searchSalons(db, { city: "lisboa", language: "en" })).toHaveLength(1);
    expect(await searchSalons(db, { city: "lisboa", language: "fr" })).toHaveLength(0);

    await db.update(staff).set({ isActive: false }).where(eq(staff.salonId, salonId));
    expect(await searchSalons(db, { city: "lisboa" })).toEqual([]);
  });

  it("hides draft salons", async () => {
    await db.update(salons).set({ status: "draft" }).where(eq(salons.id, salonId));
    expect(await searchSalons(db, { city: "lisboa" })).toEqual([]);
  });
});
