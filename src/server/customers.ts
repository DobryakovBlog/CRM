import { randomBytes } from "node:crypto";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { db, type Db } from "@/db";
import { bookings, clients, customerSessions, customers, salons, services, staff } from "@/db/schema";
import { hashToken, setWhoCookie, WHO_COOKIE } from "./auth";

const COOKIE = "ba_client";
const SESSION_DAYS = 90;

export type GoogleProfile = { sub: string; email: string; name: string };

/** Finds or creates the client account for a verified Google profile. */
export async function upsertGoogleCustomer(database: Db, profile: GoogleProfile) {
  const email = profile.email.trim().toLowerCase();
  const name = profile.name.trim() || email.split("@")[0];
  const [byGoogle] = await database.select().from(customers).where(eq(customers.googleId, profile.sub));
  if (byGoogle) return byGoogle;
  const [byEmail] = await database.select().from(customers).where(eq(customers.email, email));
  if (byEmail) {
    const [linked] = await database
      .update(customers)
      .set({ googleId: profile.sub })
      .where(eq(customers.id, byEmail.id))
      .returning();
    return linked;
  }
  const [created] = await database.insert(customers).values({ email, name, googleId: profile.sub }).returning();
  return created;
}

export async function startCustomerSession(customerId: string, name: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(customerSessions).values({ id: hashToken(token), customerId, expiresAt });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
  await setWhoCookie(name, expiresAt);
}

export async function currentCustomer() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({ customer: customers })
    .from(customerSessions)
    .innerJoin(customers, eq(customers.id, customerSessions.customerId))
    .where(and(eq(customerSessions.id, hashToken(token)), gt(customerSessions.expiresAt, new Date())));
  return row?.customer ?? null;
}

export async function endCustomerSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.delete(customerSessions).where(eq(customerSessions.id, hashToken(token)));
  jar.delete(COOKIE);
  jar.delete(WHO_COOKIE);
}

/** Deletes the account and its sessions; bookings stay with the salons that hold them. */
export async function deleteCustomer(database: Db, customerId: string) {
  await database.delete(customers).where(eq(customers.id, customerId));
}

/** The client's bookings in every salon, found by the e-mail Google verified. */
export async function customerBookings(database: Db, email: string, limit = 50) {
  return database
    .select({
      id: bookings.id,
      startsAt: bookings.startsAt,
      status: bookings.status,
      manageToken: bookings.manageToken,
      salonName: salons.name,
      salonSlug: salons.slug,
      timezone: salons.timezone,
      serviceName: services.name,
      staffName: staff.name,
    })
    .from(bookings)
    .innerJoin(clients, eq(clients.id, bookings.clientId))
    .innerJoin(salons, eq(salons.id, bookings.salonId))
    .innerJoin(services, eq(services.id, bookings.serviceId))
    .innerJoin(staff, eq(staff.id, bookings.staffId))
    .where(eq(sql`lower(${clients.email})`, email.toLowerCase()))
    .orderBy(desc(bookings.startsAt))
    .limit(limit);
}
