import { and, eq, inArray, isNull, lt, sql } from "drizzle-orm";
import type { Db } from "@/db";
import { bookings, clients, reviewReports } from "@/db/schema";

/** Privacy policy, section 6: client data is kept at most 2 years after the last visit. */
export const RETENTION_YEARS = 2;
export const ANONYMOUS_CLIENT_NAME = "Cliente anónimo";

export function retentionCutoff(now: Date) {
  const cutoff = new Date(now);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - RETENTION_YEARS);
  return cutoff;
}

/**
 * Erases the name, phone, e-mail and notes of every salon client whose last visit
 * (or, with no visits, the record itself) is older than 2 years. Bookings stay for the
 * salon's statistics without contacts; reviews keep only the first name they already show.
 * Safe to run any number of times. Runs daily from Vercel Cron (/api/cron/retention).
 */
export async function anonymiseInactiveClients(db: Db, now = new Date()) {
  const cutoff = retentionCutoff(now);
  const lastVisit = db
    .select({ clientId: bookings.clientId, last: sql<Date>`max(${bookings.startsAt})`.as("last") })
    .from(bookings)
    .groupBy(bookings.clientId)
    .as("last_visit");
  const due = await db
    .select({ id: clients.id })
    .from(clients)
    .leftJoin(lastVisit, eq(lastVisit.clientId, clients.id))
    .where(and(isNull(clients.anonymisedAt), lt(sql`coalesce(${lastVisit.last}, ${clients.createdAt})`, cutoff)));
  const ids = due.map((c) => c.id);

  if (ids.length) {
    await db.transaction(async (tx) => {
      await tx
        .update(clients)
        .set({ name: ANONYMOUS_CLIENT_NAME, email: "", phone: "", notes: "", marketingConsent: false, anonymisedAt: now })
        .where(inArray(clients.id, ids));
      // Old confirmation links stop working and the booking no longer points at a person.
      await tx
        .update(bookings)
        .set({
          clientNote: "",
          customerId: null,
          manageToken: sql`replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')`,
        })
        .where(inArray(bookings.clientId, ids));
    });
  }

  // E-mails left with review reports are contacts too.
  const reports = await db
    .update(reviewReports)
    .set({ reporterEmail: "" })
    .where(and(lt(reviewReports.createdAt, cutoff), sql`${reviewReports.reporterEmail} <> ''`))
    .returning({ id: reviewReports.id });

  return { clients: ids.length, reports: reports.length };
}
