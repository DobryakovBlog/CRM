import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { bookings, clients, reviewReports, reviews, services, staff } from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner } from "./auth";
import { registerCustomer } from "./customers";
import { ANONYMOUS_CLIENT_NAME, anonymiseInactiveClients } from "./retention";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/astrabela_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

const now = new Date("2026-10-23T12:00:00Z");
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000);
let salonId: string, staffId: string, serviceId: string;

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate users, salons, customers cascade`);
  const owner = { name: "Owner", password: "secret123", address: "Rua 1", phone: "", city: "lisboa" };
  salonId = (await registerSalonOwner(db, { ...owner, email: "s@test.pt", salonName: "Salão Azul" })).salon.id;
  [{ id: staffId }] = await db.insert(staff).values({ salonId, name: "Ana" }).returning();
  [{ id: serviceId }] = await db
    .insert(services)
    .values({ salonId, category: "hair", name: "Corte", durationMinutes: 30, priceCents: 2000 })
    .returning();
});

afterAll(() => pool.end());

async function clientWithVisit(name: string, visit: Date, customerId?: string) {
  const [client] = await db
    .insert(clients)
    .values({ salonId, name, email: `${name}@mail.pt`, phone: "+351912345678", notes: "alergia", createdAt: visit })
    .returning();
  const [booking] = await db
    .insert(bookings)
    .values({
      salonId,
      staffId,
      serviceId,
      clientId: client.id,
      customerId,
      startsAt: visit,
      endsAt: new Date(visit.getTime() + 30 * 60_000),
      manageToken: `token-${name}`,
      priceCents: 2000,
      clientNote: "janela",
      status: "completed",
    })
    .returning();
  return { client, booking };
}

describe("anonymiseInactiveClients", () => {
  it("erases contacts 2 years after the last visit and keeps bookings and reviews", async () => {
    const customer = await registerCustomer(db, { name: "Rita Silva", email: "rita@mail.pt", password: "secret123" });
    const old = await clientWithVisit("rita", daysAgo(800), customer.id);
    const recent = await clientWithVisit("joana", daysAgo(100));
    await db.insert(reviews).values({ bookingId: old.booking.id, salonId, staffId, rating: 5, authorName: "Rita" });

    expect(await anonymiseInactiveClients(db, now)).toEqual({ clients: 1, reports: 0 });

    const [c] = await db.select().from(clients).where(eq(clients.id, old.client.id));
    expect(c).toMatchObject({ name: ANONYMOUS_CLIENT_NAME, email: "", phone: "", notes: "" });
    expect(c.anonymisedAt).toEqual(now);
    const [b] = await db.select().from(bookings).where(eq(bookings.id, old.booking.id));
    expect(b).toMatchObject({ clientNote: "", customerId: null, priceCents: 2000, status: "completed" });
    expect(b.manageToken).not.toBe("token-rita");
    const [r] = await db.select().from(reviews).where(eq(reviews.bookingId, old.booking.id));
    expect(r.authorName).toBe("Rita");

    const [kept] = await db.select().from(clients).where(eq(clients.id, recent.client.id));
    expect(kept).toMatchObject({ name: "joana", email: "joana@mail.pt", phone: "+351912345678", anonymisedAt: null });

    // Second run has nothing left to do.
    expect(await anonymiseInactiveClients(db, now)).toEqual({ clients: 0, reports: 0 });
  });

  it("counts the latest visit, including a future booking", async () => {
    const { client } = await clientWithVisit("marta", daysAgo(900));
    await db.insert(bookings).values({
      salonId,
      staffId,
      serviceId,
      clientId: client.id,
      startsAt: daysAgo(-3),
      endsAt: daysAgo(-3),
      manageToken: "token-future",
      priceCents: 2000,
    });
    expect((await anonymiseInactiveClients(db, now)).clients).toBe(0);
  });

  it("clears reporter e-mails on old review reports", async () => {
    const { booking } = await clientWithVisit("eva", daysAgo(10));
    const [review] = await db
      .insert(reviews)
      .values({ bookingId: booking.id, salonId, staffId, rating: 1, authorName: "Eva" })
      .returning();
    await db.insert(reviewReports).values([
      { reviewId: review.id, reason: "x", reporterEmail: "a@mail.pt", createdAt: daysAgo(800) },
      { reviewId: review.id, reason: "y", reporterEmail: "b@mail.pt", createdAt: daysAgo(5) },
    ]);
    expect((await anonymiseInactiveClients(db, now)).reports).toBe(1);
    const emails = (await db.select().from(reviewReports)).map((r) => r.reporterEmail).sort();
    expect(emails).toEqual(["", "b@mail.pt"]);
  });
});
