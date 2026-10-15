import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { bookings, clients, customers, salons, services, staff } from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner, verifyCredentials } from "./auth";
import { customerBookings, deleteCustomer, upsertGoogleCustomer } from "./customers";

const url = process.env.TEST_DATABASE_URL ?? "postgres://postgres@localhost:5432/astrabela_test";
const pool = new Pool({ connectionString: url });
const db = drizzle(pool, { schema }) as unknown as Db;

beforeAll(async () => {
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
});

beforeEach(async () => {
  await db.execute(sql`truncate users, salons, customers cascade`);
});

afterAll(async () => {
  await pool.end();
});

describe("client accounts", () => {
  it("creates one account per Google profile and links it again by e-mail", async () => {
    const a = await upsertGoogleCustomer(db, { sub: "g-1", email: "Rita@Example.com", name: "Rita Silva" });
    expect(a.email).toBe("rita@example.com");
    const again = await upsertGoogleCustomer(db, { sub: "g-1", email: "rita@example.com", name: "Rita" });
    expect(again.id).toBe(a.id);
    await db.update(customers).set({ googleId: null }).where(eq(customers.id, a.id));
    const relinked = await upsertGoogleCustomer(db, { sub: "g-2", email: "rita@example.com", name: "Rita" });
    expect(relinked.id).toBe(a.id);
    expect(relinked.googleId).toBe("g-2");
  });

  it("lists the client's bookings in every salon by e-mail, and only theirs", async () => {
    const add = async (salonName: string, email: string) => {
      const { salon } = await registerSalonOwner(db, {
        name: "Owner",
        email: `${salonName}@owner.pt`,
        password: "secret123",
        salonName,
        city: "Lisboa",
        address: "Rua 1",
        phone: "",
      });
      const [svc] = await db
        .insert(services)
        .values({ salonId: salon.id, category: "hair", name: "Corte", durationMinutes: 60, priceCents: 3000 })
        .returning();
      const [ana] = await db.insert(staff).values({ salonId: salon.id, name: "Ana" }).returning();
      const [client] = await db.insert(clients).values({ salonId: salon.id, name: "Rita", email }).returning();
      const startsAt = new Date("2026-11-02T10:00:00Z");
      await db.insert(bookings).values({
        salonId: salon.id,
        staffId: ana.id,
        serviceId: svc.id,
        clientId: client.id,
        startsAt,
        endsAt: new Date(startsAt.getTime() + 3_600_000),
        priceCents: 3000,
        manageToken: `t-${salonName}`,
      });
    };
    await add("Um", "rita@example.com");
    await add("Dois", "RITA@example.com");
    await add("Tres", "other@example.com");
    const list = await customerBookings(db, "rita@example.com");
    expect(list.map((b) => b.salonName).sort()).toEqual(["Dois", "Um"]);
  });

  it("deleting the account keeps the salons' bookings", async () => {
    const c = await upsertGoogleCustomer(db, { sub: "g-9", email: "x@example.com", name: "X" });
    await deleteCustomer(db, c.id);
    expect(await db.select().from(customers)).toHaveLength(0);
    expect(await db.select().from(salons)).toHaveLength(0);
  });

  it("a business signed up with Google has no password and cannot sign in with one", async () => {
    await registerSalonOwner(db, {
      name: "G",
      email: "g@owner.pt",
      salonName: "Salão G",
      city: "Lisboa",
      address: "Rua 1",
      phone: "",
    });
    expect(await verifyCredentials(db, "g@owner.pt", "")).toBeNull();
    expect(await verifyCredentials(db, "g@owner.pt", "anything123")).toBeNull();
  });
});
