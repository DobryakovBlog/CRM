import { and, asc, desc, eq, gte, inArray, isNull, lt } from "drizzle-orm";
import type { Db } from "@/db";
import {
  bookings,
  clients,
  reviewReports,
  reviews,
  salons,
  services,
  staff,
  staffServices,
  subscriptions,
  workingHours,
} from "@/db/schema";
import { localMinuteToDate, nextDate } from "@/lib/availability";
import type { Category } from "./catalog";

/** All bookings of a salon on a local date, for the day calendar. */
export async function dayAgenda(db: Db, salonId: string, timezone: string, date: string) {
  const from = localMinuteToDate(date, 0, timezone);
  const to = localMinuteToDate(nextDate(date), 0, timezone);
  return db
    .select({
      id: bookings.id,
      startsAt: bookings.startsAt,
      endsAt: bookings.endsAt,
      status: bookings.status,
      source: bookings.source,
      clientNote: bookings.clientNote,
      priceCents: bookings.priceCents,
      staffId: bookings.staffId,
      serviceName: services.name,
      clientName: clients.name,
      clientPhone: clients.phone,
      clientNoShows: clients.noShowCount,
    })
    .from(bookings)
    .innerJoin(services, eq(services.id, bookings.serviceId))
    .innerJoin(clients, eq(clients.id, bookings.clientId))
    .where(and(eq(bookings.salonId, salonId), gte(bookings.startsAt, from), lt(bookings.startsAt, to)))
    .orderBy(asc(bookings.startsAt));
}

export async function salonServices(db: Db, salonId: string) {
  return db.select().from(services).where(eq(services.salonId, salonId)).orderBy(asc(services.category), asc(services.name));
}

export async function addService(
  db: Db,
  salonId: string,
  input: { category: Category; name: string; durationMinutes: number; priceCents: number; description?: string },
) {
  const [s] = await db.insert(services).values({ salonId, ...input }).returning();
  return s;
}

export async function setServiceActive(db: Db, salonId: string, serviceId: string, isActive: boolean) {
  await db.update(services).set({ isActive }).where(and(eq(services.id, serviceId), eq(services.salonId, salonId)));
}

export async function salonTeam(db: Db, salonId: string) {
  const members = await db.select().from(staff).where(eq(staff.salonId, salonId)).orderBy(asc(staff.name));
  const ids = members.map((m) => m.id);
  const [hours, links] = ids.length
    ? await Promise.all([
        db.select().from(workingHours).where(inArray(workingHours.staffId, ids)),
        db.select().from(staffServices).where(inArray(staffServices.staffId, ids)),
      ])
    : [[], []];
  return members.map((m) => ({
    ...m,
    hours: hours.filter((h) => h.staffId === m.id).sort((a, b) => a.weekday - b.weekday || a.startMinute - b.startMinute),
    serviceIds: links.filter((l) => l.staffId === m.id).map((l) => l.serviceId),
  }));
}

export type StaffInput = {
  name: string;
  title: string;
  languages: string[];
  serviceIds: string[];
  // One shift per weekday; null = day off.
  week: ({ startMinute: number; endMinute: number } | null)[];
};

/** Creates or replaces a master with their services and weekly schedule. */
export async function saveStaff(db: Db, salonId: string, staffId: string | null, input: StaffInput) {
  return db.transaction(async (tx) => {
    let id = staffId;
    if (id) {
      const [m] = await tx
        .update(staff)
        .set({ name: input.name, title: input.title, languages: input.languages })
        .where(and(eq(staff.id, id), eq(staff.salonId, salonId)))
        .returning();
      if (!m) throw new Error("not_found");
    } else {
      const [m] = await tx
        .insert(staff)
        .values({ salonId, name: input.name, title: input.title, languages: input.languages })
        .returning();
      id = m.id;
    }

    // Only link services that belong to this salon.
    const own = input.serviceIds.length
      ? await tx
          .select({ id: services.id })
          .from(services)
          .where(and(eq(services.salonId, salonId), inArray(services.id, input.serviceIds)))
      : [];
    await tx.delete(staffServices).where(eq(staffServices.staffId, id));
    if (own.length) await tx.insert(staffServices).values(own.map((s) => ({ staffId: id!, serviceId: s.id })));

    await tx.delete(workingHours).where(eq(workingHours.staffId, id));
    const shifts = input.week.flatMap((s, weekday) =>
      s && s.endMinute > s.startMinute ? [{ staffId: id!, weekday, ...s }] : [],
    );
    if (shifts.length) await tx.insert(workingHours).values(shifts);
    return id;
  });
}

export async function setStaffActive(db: Db, salonId: string, staffId: string, isActive: boolean) {
  await db.update(staff).set({ isActive }).where(and(eq(staff.id, staffId), eq(staff.salonId, salonId)));
}

export async function updateSalonProfile(
  db: Db,
  salonId: string,
  input: { name: string; description: string; district: string; address: string; postalCode: string; phone: string; nif: string },
) {
  await db.update(salons).set(input).where(eq(salons.id, salonId));
}

/** Owner asks us to list the salon. Needs at least one bookable service. */
export async function submitForReview(db: Db, salonId: string) {
  const team = await salonTeam(db, salonId);
  const ready = team.some((m) => m.isActive && m.serviceIds.length > 0 && m.hours.length > 0);
  if (!ready) throw new Error("not_ready");
  await db
    .update(salons)
    .set({ status: "pending" })
    .where(and(eq(salons.id, salonId), eq(salons.status, "draft")));
}

export async function salonSubscription(db: Db, salonId: string) {
  const [s] = await db.select().from(subscriptions).where(eq(subscriptions.salonId, salonId));
  return s ?? null;
}

export async function salonReviews(db: Db, salonId: string) {
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      text: reviews.text,
      authorName: reviews.authorName,
      reply: reviews.reply,
      status: reviews.status,
      createdAt: reviews.createdAt,
      staffName: staff.name,
    })
    .from(reviews)
    .innerJoin(staff, eq(staff.id, reviews.staffId))
    .where(eq(reviews.salonId, salonId))
    .orderBy(desc(reviews.createdAt));
}

// --- Platform moderation -------------------------------------------------

export async function pendingSalons(db: Db) {
  return db.select().from(salons).where(eq(salons.status, "pending")).orderBy(asc(salons.createdAt));
}

export async function setSalonStatus(db: Db, salonId: string, status: "active" | "suspended" | "draft") {
  await db.update(salons).set({ status }).where(eq(salons.id, salonId));
}

export async function openReports(db: Db) {
  return db
    .select({
      id: reviewReports.id,
      reason: reviewReports.reason,
      createdAt: reviewReports.createdAt,
      reviewId: reviews.id,
      reviewText: reviews.text,
      rating: reviews.rating,
      reviewStatus: reviews.status,
      salonName: salons.name,
    })
    .from(reviewReports)
    .innerJoin(reviews, eq(reviews.id, reviewReports.reviewId))
    .innerJoin(salons, eq(salons.id, reviews.salonId))
    .where(isNull(reviewReports.resolvedAt))
    .orderBy(asc(reviewReports.createdAt));
}

export async function resolveReport(db: Db, reportId: string) {
  await db.update(reviewReports).set({ resolvedAt: new Date() }).where(eq(reviewReports.id, reportId));
}
