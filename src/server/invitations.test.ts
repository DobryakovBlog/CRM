import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { salons, services, staff, staffServices, workingHours } from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner } from "./auth";
import { BookingError, slotsForDate } from "./booking";
import { dayAgenda } from "./cabinet";
import { INVITE_DAILY_LIMIT, inviteReview, salonInvitations } from "./invitations";
import { createReview, publishedReviews } from "./reviews";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/astrabela_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

// Tuesday 6 Oct 2026 in Lisbon; the regular client came on Monday.
const NOW = new Date("2026-10-06T15:00:00Z");
const MONDAY = "2026-10-05";
const client = { name: "Marta Lopes", email: "marta@example.com", phone: "" };

let salonId: string, serviceId: string, anaId: string, otherServiceId: string;

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate users, salons cascade`);
  const { salon } = await registerSalonOwner(
    db,
    { name: "Owner", email: "owner@test.pt", password: "secret123", salonName: "Salão Teste", city: "Lisboa", address: "Rua 1", phone: "" },
    NOW,
  );
  salonId = salon.id;
  await db.update(salons).set({ status: "active" }).where(eq(salons.id, salonId));
  const [svc, other] = await db
    .insert(services)
    .values([
      { salonId, category: "hair", name: "Corte", durationMinutes: 60, priceCents: 3500 },
      { salonId, category: "nails", name: "Manicure", durationMinutes: 45, priceCents: 2000 },
    ])
    .returning();
  serviceId = svc.id;
  otherServiceId = other.id;
  const [ana] = await db.insert(staff).values({ salonId, name: "Ana" }).returning();
  anaId = ana.id;
  await db.insert(staffServices).values({ staffId: anaId, serviceId });
  await db.insert(workingHours).values({ staffId: anaId, weekday: 2, startMinute: 540, endMinute: 900 });
});

afterAll(async () => {
  await pool.end();
});

const invite = (over: Partial<Parameters<typeof inviteReview>[2]> = {}, now = NOW) =>
  inviteReview(db, salonId, { staffId: anaId, serviceId, visitDate: MONDAY, client, ...over }, now);

const code = (p: Promise<unknown>) =>
  p.then(
    () => "ok",
    (e) => (e instanceof BookingError ? e.code : Promise.reject(e)),
  );

describe("review invitations", () => {
  it("gives the client a one-time link, and the review is labelled as confirmed by the salon", async () => {
    const visit = await invite();
    expect(visit.status).toBe("completed");
    expect(visit.source).toBe("invitation");

    await createReview(db, visit.manageToken, { rating: 5, text: "Sempre impecável", authorName: "Marta" });
    expect(await code(createReview(db, visit.manageToken, { rating: 1, text: "", authorName: "" }))).toBe("not_allowed");

    const [review] = await publishedReviews(db, salonId);
    expect(review.source).toBe("invitation");
    const [s] = await db.select().from(salons).where(eq(salons.id, salonId));
    expect(s.ratingCount).toBe(1);
    const [inv] = await salonInvitations(db, salonId);
    expect(inv.reviewId).toBe(review.id);
  });

  it("only accepts past visits from the last 90 days", async () => {
    expect(await code(invite({ visitDate: "2026-10-07" }))).toBe("invalid");
    expect(await code(invite({ visitDate: "2026-06-01" }))).toBe("invalid");
    expect(await code(invite({ visitDate: "2026-10-06" }))).toBe("ok");
  });

  it("needs a real e-mail and a service the master does", async () => {
    expect(await code(invite({ client: { ...client, email: "nope" } }))).toBe("invalid");
    expect(await code(invite({ serviceId: otherServiceId }))).toBe("not_allowed");
  });

  it("does not let the owner invite themselves", async () => {
    expect(await code(invite({ client: { ...client, email: "Owner@test.pt" } }))).toBe("not_allowed");
  });

  it("asks the same client about the same master at most once in 30 days", async () => {
    await invite();
    expect(await code(invite({ visitDate: "2026-10-01" }))).toBe("duplicate");
    expect(await code(invite({}, new Date("2026-11-06T15:00:00Z")))).toBe("ok");
  });

  it("caps invitations per salon per day", async () => {
    for (let i = 0; i < INVITE_DAILY_LIMIT; i++) {
      await invite({ client: { ...client, email: `c${i}@example.com` } });
    }
    expect(await code(invite({ client: { ...client, email: "one-more@example.com" } }))).toBe("limit");
  });

  it("stays out of the calendar and never blocks booking slots", async () => {
    await invite({ visitDate: "2026-10-06" });
    expect(await dayAgenda(db, salonId, "Europe/Lisbon", "2026-10-06")).toHaveLength(0);
    // The invited visit is stored at noon; Ana's real noon slot that Tuesday stays bookable.
    const morning = new Date("2026-10-06T07:00:00Z");
    const slots = await slotsForDate(db, { salonId, serviceId, staffId: anaId, date: "2026-10-06", now: morning });
    expect(slots.map((s) => s.startsAt.toISOString())).toContain("2026-10-06T11:00:00.000Z");
  });
});
