"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { db } from "@/db";
import { BookingError, createBooking, setBookingStatus } from "@/server/booking";
import { requireOwner } from "@/server/auth";
import {
  addService,
  resolveReport,
  saveStaff,
  setSalonStatus,
  setServiceActive,
  setStaffActive,
  submitForReview,
  updateSalonProfile,
} from "@/server/cabinet";
import { CATEGORIES } from "@/server/catalog";
import { inviteReview } from "@/server/invitations";
import {
  addDish,
  addSection,
  deleteDish,
  deleteSection,
  type DishInput,
  moveEntry,
  setDishAvailable,
  updateDish,
  updateSection,
} from "@/server/menu";
import { sendReviewInvitation } from "@/server/notify";
import { replyToReview, setReviewStatus } from "@/server/reviews";
import { localMinuteToDate } from "@/lib/availability";

async function owner() {
  const locale = await getLocale();
  return { ...(await requireOwner(locale)), locale };
}
const s = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const toMinute = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};

// --- Calendar -------------------------------------------------------------

export async function setStatusAction(form: FormData) {
  const { salon } = await owner();
  const status = z.enum(["completed", "no_show", "cancelled", "confirmed"]).parse(s(form, "status"));
  try {
    await setBookingStatus(db, salon.id, s(form, "bookingId"), status);
  } catch (e) {
    // e.g. marking a future visit as attended; the button is hidden for those anyway
    if (!(e instanceof BookingError)) throw e;
  }
  revalidatePath("/[locale]/business/calendar", "page");
}

export async function manualBookingAction(form: FormData) {
  const { salon, locale } = await owner();
  const date = s(form, "date");
  const back = `/${locale}/business/calendar?date=${date}`;
  const minute = toMinute(s(form, "time"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(minute)) redirect(`${back}&error=invalid`);
  try {
    await createBooking(db, {
      salonId: salon.id,
      serviceId: s(form, "serviceId"),
      staffId: s(form, "staffId"),
      startsAt: localMinuteToDate(date, minute, salon.timezone),
      client: { name: s(form, "clientName"), email: s(form, "clientEmail"), phone: s(form, "clientPhone") },
      source: "manual",
      locale,
    });
  } catch (e) {
    if (e instanceof BookingError) redirect(`${back}&error=${e.code}`);
    throw e;
  }
  redirect(back);
}

// --- Services -------------------------------------------------------------

const ServiceInput = z.object({
  category: z.enum(CATEGORIES),
  name: z.string().trim().min(2).max(100),
  durationMinutes: z.coerce.number().int().min(5).max(600),
  price: z.coerce.number().min(0).max(10000),
});

export async function addServiceAction(form: FormData) {
  const { salon } = await owner();
  const input = ServiceInput.parse(Object.fromEntries(form));
  await addService(db, salon.id, {
    category: input.category,
    name: input.name,
    durationMinutes: input.durationMinutes,
    priceCents: Math.round(input.price * 100),
  });
  revalidatePath("/[locale]/business/services", "page");
}

export async function toggleServiceAction(form: FormData) {
  const { salon } = await owner();
  await setServiceActive(db, salon.id, s(form, "serviceId"), s(form, "active") === "1");
  revalidatePath("/[locale]/business/services", "page");
}

// --- Team -----------------------------------------------------------------

export async function saveStaffAction(form: FormData) {
  const { salon, locale } = await owner();
  const week = [0, 1, 2, 3, 4, 5, 6].map((d) => {
    if (form.get(`day${d}`) !== "on") return null;
    const start = toMinute(s(form, `start${d}`));
    const end = toMinute(s(form, `end${d}`));
    return Number.isNaN(start) || Number.isNaN(end) ? null : { startMinute: start, endMinute: end };
  });
  const name = s(form, "name");
  if (name.length < 2) redirect(`/${locale}/business/team?error=invalid`);
  await saveStaff(db, salon.id, s(form, "staffId") || null, {
    name,
    title: s(form, "title"),
    languages: form.getAll("languages").map(String),
    serviceIds: form.getAll("serviceIds").map(String),
    week,
  });
  redirect(`/${locale}/business/team`);
}

export async function toggleStaffAction(form: FormData) {
  const { salon } = await owner();
  await setStaffActive(db, salon.id, s(form, "staffId"), s(form, "active") === "1");
  revalidatePath("/[locale]/business/team", "page");
}

// --- Profile --------------------------------------------------------------

export async function saveProfileAction(form: FormData) {
  const { salon, locale } = await owner();
  await updateSalonProfile(db, salon.id, {
    name: s(form, "name") || salon.name,
    description: s(form, "description").slice(0, 2000),
    district: s(form, "district"),
    address: s(form, "address") || salon.address,
    postalCode: s(form, "postalCode"),
    phone: s(form, "phone"),
    nif: s(form, "nif"),
    ...(salon.kind === "restaurant" ? { cuisine: s(form, "cuisine").slice(0, 80) } : {}),
  });
  redirect(`/${locale}/business/profile?saved=1`);
}

export async function submitForReviewAction() {
  const { salon, locale } = await owner();
  try {
    await submitForReview(db, salon.id);
  } catch {
    redirect(`/${locale}/business/profile?error=not_ready`);
  }
  redirect(`/${locale}/business/profile?submitted=1`);
}

// --- Reviews --------------------------------------------------------------

export async function replyAction(form: FormData) {
  const { salon } = await owner();
  await replyToReview(db, salon.id, s(form, "reviewId"), s(form, "reply"));
  revalidatePath("/[locale]/business/reviews", "page");
}

export async function inviteAction(form: FormData) {
  const { salon, locale } = await owner();
  const back = `/${locale}/business/reviews`;
  const [staffId = "", serviceId = ""] = s(form, "pair").split("|");
  let bookingId: string;
  try {
    const booking = await inviteReview(db, salon.id, {
      staffId,
      serviceId,
      visitDate: s(form, "visitDate"),
      client: { name: s(form, "clientName"), email: s(form, "clientEmail"), phone: s(form, "clientPhone") },
      locale: s(form, "clientLocale"),
    });
    bookingId = booking.id;
  } catch (e) {
    if (e instanceof BookingError) redirect(`${back}?error=${e.code}`);
    throw e;
  }
  await sendReviewInvitation(db, bookingId);
  redirect(`${back}?invited=1`);
}

// --- Platform admin -------------------------------------------------------

async function admin() {
  const o = await owner();
  if (!o.user.isAdmin) redirect(`/${o.locale}/business/calendar`);
  return o;
}

export async function approveSalonAction(form: FormData) {
  await admin();
  await setSalonStatus(db, s(form, "salonId"), s(form, "decision") === "approve" ? "active" : "draft");
  revalidatePath("/[locale]/business/admin", "page");
}

export async function moderateReportAction(form: FormData) {
  await admin();
  if (s(form, "decision") === "hide") await setReviewStatus(db, s(form, "reviewId"), "hidden");
  await resolveReport(db, s(form, "reportId"));
  revalidatePath("/[locale]/business/admin", "page");
}

// --- Restaurant menu --------------------------------------------------------

async function restaurantOwner() {
  const locale = await getLocale();
  return { ...(await requireOwner(locale, "restaurant")), locale };
}

/** "12,50" or "12.5" -> 1250; NaN when not a sensible price. */
const toCents = (v: string) => {
  const n = Number(v.replace(/\s|€/g, "").replace(",", "."));
  return Number.isFinite(n) && n >= 0 && n < 100_000 ? Math.round(n * 100) : NaN;
};

function dishFromForm(form: FormData): DishInput {
  return {
    name: s(form, "name").slice(0, 120),
    nameEn: s(form, "nameEn").slice(0, 120),
    description: s(form, "description").slice(0, 500),
    descriptionEn: s(form, "descriptionEn").slice(0, 500),
    priceCents: toCents(s(form, "price")),
    portion: s(form, "portion").slice(0, 40),
    allergens: form.getAll("allergens").map(String),
    tags: form.getAll("tags").map(String),
  };
}

const menuPage = (locale: string, anchor = "", error = "") =>
  `/${locale}/business/menu${error ? `?error=${error}` : ""}${anchor ? `#${anchor}` : ""}`;

export async function addSectionAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  const name = s(form, "name").slice(0, 80);
  if (!name) redirect(menuPage(locale, "", "invalid"));
  const section = await addSection(db, salon.id, { name, nameEn: s(form, "nameEn").slice(0, 80) });
  redirect(menuPage(locale, `s-${section.id}`));
}

export async function updateSectionAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  const id = s(form, "sectionId");
  const name = s(form, "name").slice(0, 80);
  if (name) await updateSection(db, salon.id, id, { name, nameEn: s(form, "nameEn").slice(0, 80) });
  redirect(menuPage(locale, `s-${id}`));
}

export async function deleteSectionAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  await deleteSection(db, salon.id, s(form, "sectionId"));
  redirect(menuPage(locale));
}

export async function addDishAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  const sectionId = s(form, "sectionId");
  const dish = dishFromForm(form);
  if (!dish.name || Number.isNaN(dish.priceCents)) redirect(menuPage(locale, `s-${sectionId}`, "invalid"));
  await addDish(db, salon.id, sectionId, dish);
  redirect(menuPage(locale, `s-${sectionId}`));
}

export async function updateDishAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  const id = s(form, "dishId");
  const dish = dishFromForm(form);
  if (!dish.name || Number.isNaN(dish.priceCents)) redirect(menuPage(locale, `d-${id}`, "invalid"));
  await updateDish(db, salon.id, id, dish);
  redirect(menuPage(locale, `d-${id}`));
}

export async function toggleDishAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  const id = s(form, "dishId");
  await setDishAvailable(db, salon.id, id, s(form, "available") === "1");
  redirect(menuPage(locale, `d-${id}`));
}

export async function deleteDishAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  await deleteDish(db, salon.id, s(form, "dishId"));
  redirect(menuPage(locale, s(form, "sectionId") ? `s-${s(form, "sectionId")}` : ""));
}

export async function moveMenuEntryAction(form: FormData) {
  const { salon, locale } = await restaurantOwner();
  const kind = s(form, "kind") === "section" ? "section" : "dish";
  const id = s(form, "id");
  await moveEntry(db, salon.id, kind, id, s(form, "dir") === "up" ? -1 : 1);
  redirect(menuPage(locale, `${kind === "section" ? "s" : "d"}-${id}`));
}
