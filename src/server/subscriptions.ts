import { and, asc, eq, ilike, or } from "drizzle-orm";
import type { Db } from "@/db";
import { salons, subscriptions } from "@/db/schema";
import { addMonths } from "./auth";

// Platform admin tools for salon subscriptions: free periods, end dates, cancelling.
// Restaurants have no subscription (their menus are free), so only salons appear here.

export const FREE_PERIODS = [3, 6, 12, 24, 36, 60] as const;

export async function listSubscriptions(db: Db, q?: string) {
  const conds = [eq(salons.kind, "salon")];
  if (q) {
    const like = `%${q}%`;
    conds.push(or(ilike(salons.name, like), ilike(salons.city, like), ilike(salons.nif, like))!);
  }
  return db
    .select({
      salonId: salons.id,
      name: salons.name,
      city: salons.city,
      salonStatus: salons.status,
      status: subscriptions.status,
      plan: subscriptions.plan,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      note: subscriptions.note,
    })
    .from(salons)
    .leftJoin(subscriptions, eq(subscriptions.salonId, salons.id))
    .where(and(...conds))
    .orderBy(asc(salons.name))
    .limit(100);
}

async function upsert(db: Db, salonId: string, values: { status: "complimentary" | "cancelled"; currentPeriodEnd: Date; note?: string }) {
  const [salon] = await db.select({ kind: salons.kind }).from(salons).where(eq(salons.id, salonId));
  if (salon?.kind !== "salon") throw new Error("not_a_salon");
  await db
    .insert(subscriptions)
    .values({ salonId, ...values })
    .onConflictDoUpdate({ target: subscriptions.salonId, set: values });
}

/**
 * Gives a salon free months. They start when the time already paid for or
 * granted runs out, so a gift never shortens what the salon has.
 */
export async function grantFreeMonths(db: Db, salonId: string, months: number, note = "", now = new Date()) {
  if (!Number.isInteger(months) || months < 1 || months > 120) throw new Error("invalid_months");
  const [cur] = await db.select().from(subscriptions).where(eq(subscriptions.salonId, salonId));
  const running = cur && cur.status !== "cancelled" && cur.currentPeriodEnd > now;
  const from = running ? cur.currentPeriodEnd : now;
  await upsert(db, salonId, { status: "complimentary", currentPeriodEnd: addMonths(from, months), note: note.trim() });
}

/** Free until an exact date (end of that day, Lisbon is UTC+0/+1 so 23:59 UTC is safe). */
export async function setFreeUntil(db: Db, salonId: string, date: string, note = "", now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("invalid_date");
  const end = new Date(`${date}T23:59:59Z`);
  if (Number.isNaN(end.getTime()) || end <= now) throw new Error("invalid_date");
  await upsert(db, salonId, { status: "complimentary", currentPeriodEnd: end, note: note.trim() });
}

/** Ends the subscription now; the salon leaves search until it subscribes again. */
export async function cancelSubscription(db: Db, salonId: string, now = new Date()) {
  await upsert(db, salonId, { status: "cancelled", currentPeriodEnd: now });
}
