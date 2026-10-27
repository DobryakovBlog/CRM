import { randomBytes } from "node:crypto";
import { and, count, desc, eq, gte } from "drizzle-orm";
import type { Db } from "@/db";
import { toLocale } from "@/i18n/routing";
import { bookings, clients, reviews, salons, services, staff, staffServices, users } from "@/db/schema";
import { normalizePhone } from "@/lib/phone";
import { localDate } from "@/lib/format";
import { localMinuteToDate } from "@/lib/availability";
import { BookingError } from "./booking";

/** How far back a visit can be to ask for a review about it. */
export const INVITE_MAX_AGE_DAYS = 90;
/** One invitation per client and master in this window. */
export const INVITE_REPEAT_DAYS = 30;
/** Cap per salon per day, so a salon cannot flood itself with reviews. */
export const INVITE_DAILY_LIMIT = 30;

export type Invitation = {
  staffId: string;
  serviceId: string;
  visitDate: string; // local YYYY-MM-DD
  client: { name: string; email: string; phone: string };
  locale?: string;
};

const DAY = 86_400_000;

/**
 * A master asks a regular client to review a visit that happened outside the site.
 * The visit is stored as a completed booking with source "invitation"; its manage
 * token is the client's one-time review link, so the usual rule holds: one review
 * per visit, and only through the personal link.
 */
export async function inviteReview(db: Db, salonId: string, input: Invitation, now = new Date()) {
  return db.transaction(async (tx) => {
    const [salon] = await tx.select().from(salons).where(eq(salons.id, salonId)).for("update");
    if (!salon) throw new BookingError("not_found");

    const [member] = await tx
      .select()
      .from(staff)
      .where(and(eq(staff.id, input.staffId), eq(staff.salonId, salonId), eq(staff.isActive, true)));
    const [service] = await tx
      .select()
      .from(services)
      .where(and(eq(services.id, input.serviceId), eq(services.salonId, salonId)));
    if (!member || !service) throw new BookingError("not_found");
    const [link] = await tx
      .select()
      .from(staffServices)
      .where(and(eq(staffServices.staffId, member.id), eq(staffServices.serviceId, service.id)));
    if (!link) throw new BookingError("not_allowed");

    // The salon can send the link itself (WhatsApp, SMS), so the e-mail is optional.
    const email = input.client.email.trim().toLowerCase();
    const rawPhone = input.client.phone.trim();
    const phone = rawPhone ? normalizePhone(rawPhone) : "";
    if (phone === null) throw new BookingError("phone");
    const name = input.client.name.trim();
    if (!name || (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))) throw new BookingError("invalid");

    // The visit must have happened, and not too long ago.
    const today = localDate(now, salon.timezone);
    const oldest = localDate(new Date(now.getTime() - INVITE_MAX_AGE_DAYS * DAY), salon.timezone);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.visitDate) || input.visitDate > today || input.visitDate < oldest) {
      throw new BookingError("invalid");
    }

    // The salon owner cannot invite themselves.
    const [owner] = await tx.select({ email: users.email }).from(users).where(eq(users.id, salon.ownerId));
    if (email && owner && owner.email.toLowerCase() === email) throw new BookingError("not_allowed");

    const dayAgo = new Date(now.getTime() - DAY);
    const [{ n }] = await tx
      .select({ n: count() })
      .from(bookings)
      .where(and(eq(bookings.salonId, salonId), eq(bookings.source, "invitation"), gte(bookings.createdAt, dayAgo)));
    if (n >= INVITE_DAILY_LIMIT) throw new BookingError("limit");

    // Same client again: matched by e-mail, or by phone when there is no e-mail.
    let [client] =
      email || phone
        ? await tx
            .select()
            .from(clients)
            .where(and(eq(clients.salonId, salonId), email ? eq(clients.email, email) : eq(clients.phone, phone)))
        : [];
    if (client) {
      const since = new Date(now.getTime() - INVITE_REPEAT_DAYS * DAY);
      const [recent] = await tx
        .select({ id: bookings.id })
        .from(bookings)
        .where(
          and(
            eq(bookings.clientId, client.id),
            eq(bookings.staffId, member.id),
            eq(bookings.source, "invitation"),
            gte(bookings.createdAt, since),
          ),
        );
      if (recent) throw new BookingError("duplicate");
    } else {
      [client] = await tx
        .insert(clients)
        .values({ salonId, name, email, phone })
        .returning();
    }

    // Visits outside the site have no exact time; noon keeps the local date stable.
    const startsAt = localMinuteToDate(input.visitDate, 12 * 60, salon.timezone);
    const [booking] = await tx
      .insert(bookings)
      .values({
        salonId,
        staffId: member.id,
        serviceId: service.id,
        clientId: client.id,
        startsAt,
        endsAt: new Date(startsAt.getTime() + service.durationMinutes * 60_000),
        priceCents: service.priceCents,
        status: "completed",
        source: "invitation",
        manageToken: randomBytes(24).toString("base64url"),
        locale: toLocale(input.locale),
        reviewRequestSentAt: now,
        createdAt: now,
      })
      .returning();
    return booking;
  });
}

/** Recent invitations for the cabinet, with whether the client has reviewed. */
export async function salonInvitations(db: Db, salonId: string, limit = 20) {
  return db
    .select({
      id: bookings.id,
      startsAt: bookings.startsAt,
      createdAt: bookings.createdAt,
      clientName: clients.name,
      clientEmail: clients.email,
      clientPhone: clients.phone,
      manageToken: bookings.manageToken,
      locale: bookings.locale,
      salonName: salons.name,
      staffName: staff.name,
      serviceName: services.name,
      reviewId: reviews.id,
    })
    .from(bookings)
    .innerJoin(clients, eq(clients.id, bookings.clientId))
    .innerJoin(staff, eq(staff.id, bookings.staffId))
    .innerJoin(services, eq(services.id, bookings.serviceId))
    .innerJoin(salons, eq(salons.id, bookings.salonId))
    .leftJoin(reviews, eq(reviews.bookingId, bookings.id))
    .where(and(eq(bookings.salonId, salonId), eq(bookings.source, "invitation")))
    .orderBy(desc(bookings.createdAt))
    .limit(limit);
}
