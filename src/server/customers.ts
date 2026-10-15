import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { and, desc, eq, gt, or, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { db, type Db } from "@/db";
import { bookings, clients, customerSessions, customers, salons, services, staff } from "@/db/schema";
import { adminEmails, hashPassword, hashToken, setWhoCookie, WHO_COOKIE } from "./auth";

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
    // Google proves the e-mail is theirs. A password set before was never verified and may
    // belong to someone who registered this address first, so it and its sessions go.
    const [linked] = await database
      .update(customers)
      .set({ googleId: profile.sub, passwordHash: null })
      .where(eq(customers.id, byEmail.id))
      .returning();
    if (byEmail.passwordHash) await database.delete(customerSessions).where(eq(customerSessions.customerId, byEmail.id));
    return linked;
  }
  const [created] = await database.insert(customers).values({ email, name, googleId: profile.sub }).returning();
  return created;
}

/** Creates a client account with e-mail and password. */
export async function registerCustomer(database: Db, input: { name: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const [taken] = await database.select({ id: customers.id }).from(customers).where(eq(customers.email, email));
  if (taken) throw new Error("email_taken");
  const [created] = await database
    .insert(customers)
    .values({ email, name: input.name.trim(), passwordHash: await hashPassword(input.password) })
    .returning();
  return created;
}

export async function verifyCustomer(database: Db, email: string, password: string) {
  const [customer] = await database.select().from(customers).where(eq(customers.email, email.trim().toLowerCase()));
  if (!customer?.passwordHash) return null; // Google-only account
  return (await bcrypt.compare(password, customer.passwordHash)) ? customer : null;
}

/** Platform admins: flagged in the database or named in ADMIN_EMAILS. */
export const isAdminCustomer = (customer: { email: string; isAdmin: boolean }) =>
  customer.isAdmin || adminEmails().includes(customer.email);

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

/**
 * The client's bookings in every salon: those made while signed in and, once Google has
 * verified the e-mail, also those made with that e-mail as a guest.
 */
export async function customerBookings(
  database: Db,
  customer: { id: string; email: string; googleId: string | null },
  limit = 50,
) {
  const mine = eq(bookings.customerId, customer.id);
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
    .where(customer.googleId ? or(mine, eq(sql`lower(${clients.email})`, customer.email.toLowerCase())) : mine)
    .orderBy(desc(bookings.startsAt))
    .limit(limit);
}
