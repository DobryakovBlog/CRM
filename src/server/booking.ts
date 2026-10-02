import { randomBytes } from "node:crypto";
import { and, eq, gt, inArray, lt, sql } from "drizzle-orm";
import type { Db } from "@/db";
import {
  bookings,
  clients,
  reviews,
  salons,
  services,
  staff,
  staffServices,
  timeOff,
  workingHours,
} from "@/db/schema";
import { availableSlots, localMinuteToDate, overlaps, type Interval } from "@/lib/availability";

export class BookingError extends Error {
  constructor(public code: "slot_taken" | "not_found" | "not_allowed" | "invalid") {
    super(code);
  }
}

const BLOCKING_STATUSES = ["confirmed", "completed"] as const;

/** Busy intervals of one staff member between two instants. */
async function busyIntervals(db: Db, staffId: string, from: Date, to: Date): Promise<Interval[]> {
  const [booked, off] = await Promise.all([
    db
      .select({ start: bookings.startsAt, end: bookings.endsAt })
      .from(bookings)
      .where(
        and(
          eq(bookings.staffId, staffId),
          inArray(bookings.status, [...BLOCKING_STATUSES]),
          lt(bookings.startsAt, to),
          gt(bookings.endsAt, from),
        ),
      ),
    db
      .select({ start: timeOff.startsAt, end: timeOff.endsAt })
      .from(timeOff)
      .where(and(eq(timeOff.staffId, staffId), lt(timeOff.startsAt, to), gt(timeOff.endsAt, from))),
  ]);
  return [...booked, ...off];
}

/** Active staff of a salon who perform a given service. */
export async function staffForService(db: Db, salonId: string, serviceId: string) {
  return db
    .select({ id: staff.id, name: staff.name, title: staff.title, photoUrl: staff.photoUrl })
    .from(staff)
    .innerJoin(staffServices, eq(staffServices.staffId, staff.id))
    .where(
      and(eq(staff.salonId, salonId), eq(staff.isActive, true), eq(staffServices.serviceId, serviceId)),
    );
}

export type Slot = { startsAt: Date; staffId: string };

/**
 * Free start times for a service on a local date. With staffId = null the client
 * is happy with any master, and each time is offered once (first free master wins).
 */
export async function slotsForDate(
  db: Db,
  params: { salonId: string; serviceId: string; staffId: string | null; date: string; now?: Date },
): Promise<Slot[]> {
  const [salon] = await db.select().from(salons).where(eq(salons.id, params.salonId));
  const [service] = await db
    .select()
    .from(services)
    .where(and(eq(services.id, params.serviceId), eq(services.salonId, params.salonId)));
  if (!salon || !service || !service.isActive) return [];

  let candidates = await staffForService(db, salon.id, service.id);
  if (params.staffId) candidates = candidates.filter((s) => s.id === params.staffId);

  const dayStart = localMinuteToDate(params.date, 0, salon.timezone);
  const dayEnd = localMinuteToDate(params.date, 24 * 60, salon.timezone);
  const bySlot = new Map<number, Slot>();

  for (const member of candidates) {
    const [hours, busy] = await Promise.all([
      db.select().from(workingHours).where(eq(workingHours.staffId, member.id)),
      busyIntervals(db, member.id, dayStart, dayEnd),
    ]);
    const slots = availableSlots({
      date: params.date,
      timezone: salon.timezone,
      durationMinutes: service.durationMinutes,
      workingHours: hours,
      busy,
      now: params.now ?? new Date(),
    });
    for (const start of slots) {
      if (!bySlot.has(start.getTime())) bySlot.set(start.getTime(), { startsAt: start, staffId: member.id });
    }
  }
  return [...bySlot.values()].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export type NewBooking = {
  salonId: string;
  serviceId: string;
  staffId: string;
  startsAt: Date;
  client: { name: string; email: string; phone: string };
  note?: string;
  locale?: string;
  source?: "marketplace" | "manual";
  now?: Date;
};

/** Creates a booking. Serialises on the staff row so two clients cannot take the same time. */
export async function createBooking(db: Db, input: NewBooking) {
  return db.transaction(async (tx) => {
    const [member] = await tx
      .select()
      .from(staff)
      .where(and(eq(staff.id, input.staffId), eq(staff.salonId, input.salonId), eq(staff.isActive, true)))
      .for("update");
    const [service] = await tx
      .select()
      .from(services)
      .where(and(eq(services.id, input.serviceId), eq(services.salonId, input.salonId), eq(services.isActive, true)));
    if (!member || !service) throw new BookingError("not_found");

    const [link] = await tx
      .select()
      .from(staffServices)
      .where(and(eq(staffServices.staffId, member.id), eq(staffServices.serviceId, service.id)));
    if (!link) throw new BookingError("not_allowed");

    const startsAt = input.startsAt;
    const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000);

    // Marketplace bookings must land on an offered slot (working hours, lead time).
    // Manual bookings from the cabinet only need to avoid collisions.
    if (input.source !== "manual") {
      const [salon] = await tx.select().from(salons).where(eq(salons.id, input.salonId));
      const date = new Intl.DateTimeFormat("en-CA", { timeZone: salon.timezone }).format(startsAt);
      const slots = await slotsForDate(tx as unknown as Db, {
        salonId: input.salonId,
        serviceId: service.id,
        staffId: member.id,
        date,
        now: input.now,
      });
      if (!slots.some((s) => s.startsAt.getTime() === startsAt.getTime())) {
        throw new BookingError("slot_taken");
      }
    } else {
      const busy = await busyIntervals(tx as unknown as Db, member.id, startsAt, endsAt);
      if (busy.some((b) => overlaps(b, { start: startsAt, end: endsAt }))) {
        throw new BookingError("slot_taken");
      }
    }

    const email = input.client.email.trim().toLowerCase();
    const phone = input.client.phone.trim();
    let [client] = email
      ? await tx.select().from(clients).where(and(eq(clients.salonId, input.salonId), eq(clients.email, email)))
      : [];
    if (!client) {
      [client] = await tx
        .insert(clients)
        .values({ salonId: input.salonId, name: input.client.name.trim(), email, phone })
        .returning();
    }

    const [booking] = await tx
      .insert(bookings)
      .values({
        salonId: input.salonId,
        staffId: member.id,
        serviceId: service.id,
        clientId: client.id,
        startsAt,
        endsAt,
        priceCents: service.priceCents,
        manageToken: randomBytes(24).toString("base64url"),
        clientNote: input.note ?? "",
        locale: input.locale ?? "pt",
        source: input.source ?? "marketplace",
      })
      .returning();
    return booking;
  });
}

export async function bookingByToken(db: Db, token: string) {
  const [row] = await db
    .select({
      booking: bookings,
      salon: { id: salons.id, name: salons.name, slug: salons.slug, address: salons.address, timezone: salons.timezone },
      service: { name: services.name, durationMinutes: services.durationMinutes },
      staff: { id: staff.id, name: staff.name },
      client: { name: clients.name, email: clients.email },
      review: { id: reviews.id },
    })
    .from(bookings)
    .innerJoin(salons, eq(salons.id, bookings.salonId))
    .innerJoin(services, eq(services.id, bookings.serviceId))
    .innerJoin(staff, eq(staff.id, bookings.staffId))
    .innerJoin(clients, eq(clients.id, bookings.clientId))
    .leftJoin(reviews, eq(reviews.bookingId, bookings.id))
    .where(eq(bookings.manageToken, token));
  return row ?? null;
}

/** Client-side cancellation through the link in the confirmation e-mail. */
export async function cancelByClient(db: Db, token: string, now = new Date()) {
  const row = await bookingByToken(db, token);
  if (!row) throw new BookingError("not_found");
  if (row.booking.status !== "confirmed" || row.booking.startsAt <= now) throw new BookingError("not_allowed");
  await db.update(bookings).set({ status: "cancelled" }).where(eq(bookings.id, row.booking.id));
}

/** Salon marks the outcome of a visit. A no-show is counted on the client card. */
export async function setBookingStatus(
  db: Db,
  salonId: string,
  bookingId: string,
  status: "completed" | "no_show" | "cancelled" | "confirmed",
) {
  await db.transaction(async (tx) => {
    const [b] = await tx
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, bookingId), eq(bookings.salonId, salonId)))
      .for("update");
    if (!b) throw new BookingError("not_found");
    if (b.status === status) return;
    await tx.update(bookings).set({ status }).where(eq(bookings.id, b.id));
    const delta = (status === "no_show" ? 1 : 0) - (b.status === "no_show" ? 1 : 0);
    if (delta !== 0) {
      await tx
        .update(clients)
        .set({ noShowCount: sql`greatest(${clients.noShowCount} + ${delta}, 0)` })
        .where(eq(clients.id, b.clientId));
    }
  });
}
