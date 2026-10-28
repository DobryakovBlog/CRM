import { and, eq, gt, isNull, lt } from "drizzle-orm";
import type { Db } from "@/db";
import { toLocale } from "@/i18n/routing";
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
  return new Intl.DateTimeFormat({ pt: "pt-PT", en: "en-GB", es: "es-ES", fr: "fr-FR", it: "it-IT" }[toLocale(locale)], {
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
    invite: (r: Row, _when: string, link: string) => ({
      subject: `${r.staff.name} pede a sua opinião`,
      text: `Olá ${r.client.name},\n\n${r.staff.name}, do salão ${r.salon.name}, agradece a sua visita (${r.service.name}) e gostava de saber a sua opinião na Astrabela. Leva um minuto e não precisa de criar conta.\nEste link é pessoal e serve para uma avaliação: ${link}`,
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
    invite: (r: Row, _when: string, link: string) => ({
      subject: `${r.staff.name} would love your feedback`,
      text: `Hi ${r.client.name},\n\n${r.staff.name} at ${r.salon.name} thanks you for your visit (${r.service.name}) and would love your review on Astrabela. It takes a minute, no account needed.\nThis link is personal and works for one review: ${link}`,
    }),
  },
  es: {
    confirmed: (r: Row, when: string, link: string) => ({
      subject: `Cita confirmada: ${r.salon.name}`,
      text: `Hola, ${r.client.name}:\n\n${r.service.name} con ${r.staff.name}\n${when}\n${r.salon.address}\n\nGestionar o cancelar: ${link}`,
    }),
    reminder: (r: Row, when: string, link: string) => ({
      subject: `Recordatorio: mañana en ${r.salon.name}`,
      text: `Hola, ${r.client.name}:\n\nTe recordamos tu cita: ${r.service.name} con ${r.staff.name}, ${when}.\nSi no puedes venir, cancélala aquí: ${link}`,
    }),
    review: (r: Row, _when: string, link: string) => ({
      subject: `¿Qué tal en ${r.salon.name}?`,
      text: `Hola, ${r.client.name}:\n\nDeja tu valoración de ${r.staff.name}. Solo los clientes con visita confirmada pueden valorar.\n${link}`,
    }),
    invite: (r: Row, _when: string, link: string) => ({
      subject: `${r.staff.name} quiere saber tu opinión`,
      text: `Hola, ${r.client.name}:\n\n${r.staff.name}, de ${r.salon.name}, te agradece tu visita (${r.service.name}) y le gustaría conocer tu opinión en Astrabela. Es un minuto y no hace falta crear una cuenta.\nEste enlace es personal y sirve para una valoración: ${link}`,
    }),
  },
  fr: {
    confirmed: (r: Row, when: string, link: string) => ({
      subject: `Rendez-vous confirmé : ${r.salon.name}`,
      text: `Bonjour ${r.client.name},\n\n${r.service.name} avec ${r.staff.name}\n${when}\n${r.salon.address}\n\nGérer ou annuler : ${link}`,
    }),
    reminder: (r: Row, when: string, link: string) => ({
      subject: `Rappel : demain chez ${r.salon.name}`,
      text: `Bonjour ${r.client.name},\n\nNous vous rappelons votre rendez-vous : ${r.service.name} avec ${r.staff.name}, ${when}.\nVous ne pouvez pas venir ? Annulez ici : ${link}`,
    }),
    review: (r: Row, _when: string, link: string) => ({
      subject: `Comment s'est passée votre visite chez ${r.salon.name} ?`,
      text: `Bonjour ${r.client.name},\n\nNotez ${r.staff.name}. Seuls les clients dont la visite est confirmée peuvent laisser un avis.\n${link}`,
    }),
    invite: (r: Row, _when: string, link: string) => ({
      subject: `${r.staff.name} aimerait avoir votre avis`,
      text: `Bonjour ${r.client.name},\n\n${r.staff.name}, de ${r.salon.name}, vous remercie de votre visite (${r.service.name}) et aimerait connaître votre avis sur Astrabela. Cela prend une minute, sans créer de compte.\nCe lien est personnel et sert pour un seul avis : ${link}`,
    }),
  },
  it: {
    confirmed: (r: Row, when: string, link: string) => ({
      subject: `Prenotazione confermata: ${r.salon.name}`,
      text: `Ciao ${r.client.name},\n\n${r.service.name} con ${r.staff.name}\n${when}\n${r.salon.address}\n\nGestisci o annulla: ${link}`,
    }),
    reminder: (r: Row, when: string, link: string) => ({
      subject: `Promemoria: domani da ${r.salon.name}`,
      text: `Ciao ${r.client.name},\n\nTi ricordiamo la tua prenotazione: ${r.service.name} con ${r.staff.name}, ${when}.\nNon puoi venire? Annulla qui: ${link}`,
    }),
    review: (r: Row, _when: string, link: string) => ({
      subject: `Com'è andata da ${r.salon.name}?`,
      text: `Ciao ${r.client.name},\n\nLascia la tua recensione di ${r.staff.name}. Solo i clienti con una visita confermata possono recensire.\n${link}`,
    }),
    invite: (r: Row, _when: string, link: string) => ({
      subject: `${r.staff.name} vorrebbe la tua opinione`,
      text: `Ciao ${r.client.name},\n\n${r.staff.name}, di ${r.salon.name}, ti ringrazia per la visita (${r.service.name}) e vorrebbe conoscere la tua opinione su Astrabela. Ci vuole un minuto e non serve creare un account.\nQuesto link è personale e vale per una recensione: ${link}`,
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

/** The client's personal page for a booking: manage it, or review it after the visit. */
export const bookingLink = (manageToken: string, locale: string) => `${appUrl()}/${locale}/booking/${manageToken}`;

/** Review invitation as text the salon can send itself (WhatsApp, SMS), with its link. */
export function invitationMessage(i: {
  locale: string;
  manageToken: string;
  clientName: string;
  staffName: string;
  salonName: string;
  serviceName: string;
}) {
  const locale = toLocale(i.locale);
  const link = bookingLink(i.manageToken, locale);
  const row = {
    client: { name: i.clientName },
    staff: { name: i.staffName },
    salon: { name: i.salonName },
    service: { name: i.serviceName },
  } as Row;
  return { link, text: texts[locale].invite(row, "", link).text };
}

function render(kind: keyof (typeof texts)["pt"], r: Row) {
  const locale = toLocale(r.booking.locale);
  const link = bookingLink(r.booking.manageToken, locale);
  const msg = texts[locale][kind](r, formatWhen(r.booking.startsAt, r.salon.timezone, locale), link);
  return { to: r.client.email, ...msg };
}

export async function sendBookingConfirmation(db: Db, bookingId: string) {
  const [row] = await loadRows(db, and(eq(bookings.id, bookingId)));
  if (row) await sendEmail(render("confirmed", row));
}

/** Personal review link a master sends to a regular client. */
export async function sendReviewInvitation(db: Db, bookingId: string) {
  const [row] = await loadRows(db, and(eq(bookings.id, bookingId)));
  if (row) await sendEmail(render("invite", row));
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
