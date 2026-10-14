"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { db } from "@/db";
import { BookingError, createBooking } from "@/server/booking";
import { salonBySlug } from "@/server/catalog";
import { sendBookingConfirmation } from "@/server/notify";

const Input = z.object({
  slug: z.string().min(1),
  serviceId: z.uuid(),
  staffId: z.uuid(),
  startsAt: z.iso.datetime(),
  back: z.string().startsWith("/salon/"),
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  phone: z.string().trim().min(6).max(30),
  note: z.string().max(500).optional().default(""),
});

export async function bookAction(form: FormData) {
  const locale = await getLocale();
  const parsed = Input.safeParse(Object.fromEntries(form));
  const back = typeof form.get("back") === "string" ? String(form.get("back")) : "/";
  if (!parsed.success) redirect(`/${locale}${back}&error=invalid`);
  const input = parsed.data;

  const data = await salonBySlug(db, input.slug);
  if (!data) redirect(`/${locale}`);

  let token: string;
  try {
    const booking = await createBooking(db, {
      salonId: data.salon.id,
      serviceId: input.serviceId,
      staffId: input.staffId,
      startsAt: new Date(input.startsAt),
      client: { name: input.name, email: input.email, phone: input.phone },
      note: input.note,
      locale,
    });
    await sendBookingConfirmation(db, booking.id);
    token = booking.manageToken;
  } catch (e) {
    if (e instanceof BookingError) redirect(`/${locale}${back}&error=${e.code}`);
    throw e;
  }
  redirect(`/${locale}/booking/${token}?new=1`);
}
