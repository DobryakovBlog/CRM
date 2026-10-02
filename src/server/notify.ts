import { and, eq, gt, isNull, lt } from "drizzle-orm";
import type { Db } from "@/db";
import { bookings, clients, salons, services, staff } from "@/db/schema";

export type Email = { to: string; subject: string; text: string };

/**
 * Outgoing e-mail. MVP driver logs to the console; swap for Postmark / Amazon SES
 * by implementing this function (and SMS / WhatsApp senders next to it).
 */
export async function sendEmail(email: Email) {
  if (!email.to) return;
  console.log(`[email] to=${email.to} subject=${JSON.stringify(email.subject)}\n${email.text}\n`);
}

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";

type Row = {
  booking: typeof bookings.$inferSelect;
  salon: { name: string; address: string; timezone: string };
  service: { name: string };
  staff: { name: string };
  client: { name: string; email: string };
};

function formatWhen(date: Date, timezone: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "pt-PT", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: timezone,
  }).format(date);
}

const texts = {
  pt: {
    confirmed: (r: Row, when: string, link: string) => ({
      subject: `Marcação confirmada: ${r.salon.name}`,
      text: `Olá ${r.client.name},\n\n${r.service.name} com ${r.staff.name}\n${when}\n${r.salon.address}\n\nGerir ou cancelar: ${link}`,
    }),
    reminder: (r: Row, when: string, link: string) => ({
      subject: `Lembrete: amanhã em ${r.salon.name}`,
      text: `Olá ${r.client.name},\n\nLembramos a sua marcação: ${r.service.name} com ${r.staff.name}, ${when}.\nSe não puder vir, cancele aqui: ${link}`,
    }),
    review: (r: Row, _when: string, link: string) => ({
      subject: `Como correu em ${r.salon.name}?`,
      text: `Olá ${r.client.name},\n\nDeixe a sua avaliação de ${r.staff.name}. Só clientes com visita confirmada podem avaliar.\n${link}`,
    }),
  },
  en: {
    confirmed: (r: Row, when: string, link: string) => ({
      subject: `Booking confirmed: ${r.salon.name}`,
      text: `Hi ${r.client.name},\n\n${r.service.name} with ${r.staff.name}\n${when}\n${r.salon.address}\n\nManage or cancel: ${link}`,
    }),
    reminder: (r: Row, when: string, link: string) => ({
      subject: `Reminder: tomorrow at ${r.salon.name}`,
      text: `Hi ${r.client.name},\n\nA reminder of your booking: ${r.service.name} with ${r.staff.name}, ${when}.\nCan't make it? Cancel here: ${link}`,
    }),
    review: (r: Row, _when: string, link: string) => ({
      subject: `How was ${r.salon.name}?`,
      text: `Hi ${r.client.name},\n\nPlease rate ${r.staff.name}. Only clients with a confirmed visit can leave a review.\n${link}`,
    }),
  },
};

async function loadRows(db: Db, where: ReturnType<typeof and>) {
  return db
    .select({
      booking: bookings,
      salon: { name: salons.name, address: salons.address, timezone: salons.timezone },
      service: { name: services.name },
      staff: { name: staff.name },
      client: { name: clients.name, email: clients.email },
    })
    .from(bookings)
    .innerJoin(salons, eq(salons.id, bookings.salonId))
    .innerJoin(services, eq(services.id, bookings.serviceId))
    .innerJoin(staff, eq(staff.id, bookings.staffId))
    .innerJoin(clients, eq(clients.id, bookings.clientId))
    .where(where);
}

function render(kind: keyof (typeof texts)["pt"], r: Row) {
  const locale = r.booking.locale === "en" ? "en" : "pt";
  const link = `${appUrl()}/${locale}/booking/${r.booking.manageToken}`;
  const msg = texts[locale][kind](r, formatWhen(r.booking.startsAt, r.salon.timezone, locale), link);
  return { to: r.client.email, ...msg };
}

export async function sendBookingConfirmation(db: Db, bookingId: string) {
  const [row] = await loadRows(db, and(eq(bookings.id, bookingId)));
  if (row) await sendEmail(render("confirmed", row));
}

/** Periodic job: reminders ~24h ahead and review requests after completed visits. */
export async function runNotificationJobs(db: Db, now = new Date()) {
  const in24h = new Date(now.getTime() + 24 * 3_600_000);
  const due = await loadRows(
    db,
    and(eq(bookings.status, "confirmed"), isNull(bookings.reminderSentAt), gt(bookings.startsAt, now), lt(bookings.startsAt, in24h)),
  );
  for (const r of due) {
    await sendEmail(render("reminder", r));
    await db.update(bookings).set({ reminderSentAt: now }).where(eq(bookings.id, r.booking.id));
  }

  const done = await loadRows(db, and(eq(bookings.status, "completed"), isNull(bookings.reviewRequestSentAt)));
  for (const r of done) {
    await sendEmail(render("review", r));
    await db.update(bookings).set({ reviewRequestSentAt: now }).where(eq(bookings.id, r.booking.id));
  }
  return { reminders: due.length, reviewRequests: done.length };
}
