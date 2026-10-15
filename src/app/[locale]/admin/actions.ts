"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { db } from "@/db";
import { requireAdmin } from "@/server/admin";
import { resolveReport, setSalonStatus } from "@/server/cabinet";
import { setReviewStatus } from "@/server/reviews";
import { cancelSubscription, grantFreeMonths, setFreeUntil } from "@/server/subscriptions";

const s = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

async function admin() {
  const locale = await getLocale();
  await requireAdmin(locale);
  return { locale };
}

export async function approveSalonAction(form: FormData) {
  await admin();
  await setSalonStatus(db, s(form, "salonId"), s(form, "decision") === "approve" ? "active" : "draft");
  revalidatePath("/[locale]/admin", "page");
}

export async function moderateReportAction(form: FormData) {
  await admin();
  if (s(form, "decision") === "hide") await setReviewStatus(db, s(form, "reviewId"), "hidden");
  await resolveReport(db, s(form, "reportId"));
  revalidatePath("/[locale]/admin", "page");
}

async function adminBack(form: FormData, done: string) {
  const { locale } = await admin();
  revalidatePath("/[locale]/admin", "page");
  const q = s(form, "q");
  redirect(`/${locale}/admin?${new URLSearchParams({ ...(q && { q }), sub: done })}#subs`);
}

export async function grantFreeAction(form: FormData) {
  await admin();
  await grantFreeMonths(db, s(form, "salonId"), Number(s(form, "months")), s(form, "note"));
  await adminBack(form, "saved");
}

export async function freeUntilAction(form: FormData) {
  await admin();
  try {
    await setFreeUntil(db, s(form, "salonId"), s(form, "until"), s(form, "note"));
  } catch {
    return adminBack(form, "invalid");
  }
  await adminBack(form, "saved");
}

export async function cancelSubscriptionAction(form: FormData) {
  await admin();
  await cancelSubscription(db, s(form, "salonId"));
  await adminBack(form, "saved");
}
