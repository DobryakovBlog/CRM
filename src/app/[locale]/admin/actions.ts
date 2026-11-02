"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { db } from "@/db";
import { requireAdmin } from "@/server/admin";
import { resolveReport, setSalonStatus } from "@/server/cabinet";
import { setReviewStatus } from "@/server/reviews";

const s = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

async function admin() {
  const locale = await getLocale();
  await requireAdmin(locale);
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
