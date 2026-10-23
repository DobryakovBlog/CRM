import { and, avg, count, desc, eq, gt } from "drizzle-orm";
import type { Db } from "@/db";
import { bookings, customers, reviewReports, reviews, salons, staff } from "@/db/schema";
import { bookingByToken, BookingError } from "./booking";

/** Recomputes cached rating aggregates for a salon and one of its masters. */
async function refreshRatings(db: Db, salonId: string, staffId: string) {
  const published = eq(reviews.status, "published");
  const [s] = await db
    .select({ avg: avg(reviews.rating), n: count() })
    .from(reviews)
    .where(and(eq(reviews.salonId, salonId), published));
  const [m] = await db
    .select({ avg: avg(reviews.rating), n: count() })
    .from(reviews)
    .where(and(eq(reviews.staffId, staffId), published));
  const x100 = (v: string | null) => Math.round(Number(v ?? 0) * 100);
  await db.update(salons).set({ ratingAvg: x100(s.avg), ratingCount: s.n }).where(eq(salons.id, salonId));
  await db.update(staff).set({ ratingAvg: x100(m.avg), ratingCount: m.n }).where(eq(staff.id, staffId));
}

/** Only a client whose visit was marked completed can review, once per booking. */
export async function createReview(
  db: Db,
  token: string,
  input: { rating: number; text: string; authorName: string },
) {
  const row = await bookingByToken(db, token);
  if (!row) throw new BookingError("not_found");
  if (row.booking.status !== "completed" || row.review?.id) throw new BookingError("not_allowed");
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw new BookingError("invalid");

  const [review] = await db
    .insert(reviews)
    .values({
      bookingId: row.booking.id,
      salonId: row.booking.salonId,
      staffId: row.booking.staffId,
      rating: input.rating,
      text: input.text.trim().slice(0, 2000),
      authorName: input.authorName.trim().slice(0, 60) || row.client.name.split(" ")[0],
    })
    .returning();
  await refreshRatings(db, review.salonId, review.staffId);
  return review;
}

const OPEN_REVIEW_GAP_MS = 30 * 86_400_000;

/**
 * Any signed-in client can review a master of a listed salon, once every 30 days per master.
 * These reviews have no booking, so they show without the confirmed-visit label.
 */
export async function createOpenReview(
  db: Db,
  customer: typeof customers.$inferSelect,
  input: { salonId: string; staffId: string; rating: number; text: string },
  now = new Date(),
) {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) throw new BookingError("invalid");
  const [master] = await db
    .select({ id: staff.id })
    .from(staff)
    .innerJoin(salons, eq(salons.id, staff.salonId))
    .where(and(eq(staff.id, input.staffId), eq(staff.salonId, input.salonId), eq(staff.isActive, true), eq(salons.kind, "salon")));
  if (!master) throw new BookingError("invalid");
  const [recent] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(
      and(
        eq(reviews.customerId, customer.id),
        eq(reviews.staffId, input.staffId),
        gt(reviews.createdAt, new Date(now.getTime() - OPEN_REVIEW_GAP_MS)),
      ),
    );
  if (recent) throw new BookingError("too_soon");

  const [review] = await db
    .insert(reviews)
    .values({
      customerId: customer.id,
      salonId: input.salonId,
      staffId: input.staffId,
      rating: input.rating,
      text: input.text.trim().slice(0, 2000),
      createdAt: now,
      authorName: customer.name.trim().split(/\s+/)[0]?.slice(0, 60) || "Cliente",
    })
    .returning();
  await refreshRatings(db, review.salonId, review.staffId);
  return review;
}

export async function replyToReview(db: Db, salonId: string, reviewId: string, reply: string) {
  await db
    .update(reviews)
    .set({ reply: reply.trim().slice(0, 2000) || null, repliedAt: new Date() })
    .where(and(eq(reviews.id, reviewId), eq(reviews.salonId, salonId)));
}

/** Anyone can report a review (Digital Services Act notice and action). */
export async function reportReview(db: Db, reviewId: string, reason: string, reporterEmail = "") {
  await db.insert(reviewReports).values({ reviewId, reason: reason.trim().slice(0, 1000), reporterEmail });
}

/** Moderators hide or restore a review; ratings follow. */
export async function setReviewStatus(db: Db, reviewId: string, status: "published" | "hidden") {
  const [r] = await db.update(reviews).set({ status }).where(eq(reviews.id, reviewId)).returning();
  if (r) await refreshRatings(db, r.salonId, r.staffId);
}

export async function publishedReviews(db: Db, salonId: string, limit = 20) {
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      text: reviews.text,
      authorName: reviews.authorName,
      reply: reviews.reply,
      createdAt: reviews.createdAt,
      staffName: staff.name,
      source: bookings.source,
    })
    .from(reviews)
    .innerJoin(staff, eq(staff.id, reviews.staffId))
    .leftJoin(bookings, eq(bookings.id, reviews.bookingId))
    .where(and(eq(reviews.salonId, salonId), eq(reviews.status, "published")))
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}
