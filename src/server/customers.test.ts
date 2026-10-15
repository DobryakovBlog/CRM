import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import * as schema from "@/db/schema";
import { bookings, clients, customers, salons, services, staff } from "@/db/schema";
import type { Db } from "@/db";
import { registerSalonOwner, verifyCredentials } from "./auth";
import {
  customerBookings,
  deleteCustomer,
  isAdminCustomer,
  registerCustomer,
  upsertGoogleCustomer,
  verifyCustomer,
} from "./customers";

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

  it("lists a Google client's bookings in every salon by e-mail, and only theirs", async () => {
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
    const google = await upsertGoogleCustomer(db, { sub: "g-r", email: "rita@example.com", name: "Rita" });
    const list = await customerBookings(db, google);
    expect(list.map((b) => b.salonName).sort()).toEqual(["Dois", "Um"]);
  });

  it("a password account (e-mail not verified) only sees bookings made while signed in", async () => {
    const owner = await registerSalonOwner(db, {
      name: "O", email: "o@test.pt", password: "secret123", salonName: "Tres", city: "lisboa", address: "Rua 1", phone: "",
    });
    const [svc] = await db.insert(services).values({ salonId: owner.salon.id, category: "hair", name: "Corte", durationMinutes: 30, priceCents: 1000 }).returning();
    const [ana] = await db.insert(staff).values({ salonId: owner.salon.id, name: "Ana" }).returning();
    const [client] = await db.insert(clients).values({ salonId: owner.salon.id, name: "Rita", email: "rita@example.com" }).returning();
    const me = await registerCustomer(db, { name: "Rita", email: "rita@example.com", password: "password1" });
    const base = { salonId: owner.salon.id, staffId: ana.id, serviceId: svc.id, clientId: client.id, priceCents: 1000 };
    const at = (h: number) => ({ startsAt: new Date(Date.UTC(2026, 10, 2, h)), endsAt: new Date(Date.UTC(2026, 10, 2, h, 30)) });
    await db.insert(bookings).values({ ...base, ...at(10), manageToken: "guest" });
    await db.insert(bookings).values({ ...base, ...at(11), manageToken: "mine", customerId: me.id });
    expect((await customerBookings(db, me)).map((b) => b.manageToken)).toEqual(["mine"]);
  });

  it("registers clients with a password; Google later takes over the unverified password", async () => {
    const c = await registerCustomer(db, { name: "Ana Silva", email: "Ana@Example.com", password: "password1" });
    await expect(registerCustomer(db, { name: "X", email: "ana@example.com", password: "password2" })).rejects.toThrow("email_taken");
    expect(await verifyCustomer(db, "ana@example.com", "wrong-pass")).toBeNull();
    expect((await verifyCustomer(db, "ANA@example.com", "password1"))?.id).toBe(c.id);
    const linked = await upsertGoogleCustomer(db, { sub: "g-a", email: "ana@example.com", name: "Ana" });
    expect(linked.id).toBe(c.id);
    expect(await verifyCustomer(db, "ana@example.com", "password1")).toBeNull();
  });

  it("makes admins from ADMIN_EMAILS without a salon", async () => {
    process.env.ADMIN_EMAILS = "boss@example.com, other@x.pt";
    const boss = await registerCustomer(db, { name: "Boss", email: "Boss@example.com", password: "password1" });
    const guest = await registerCustomer(db, { name: "Guest", email: "guest@example.com", password: "password1" });
    expect(isAdminCustomer(boss)).toBe(true);
    expect(isAdminCustomer(guest)).toBe(false);
    delete process.env.ADMIN_EMAILS;
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
