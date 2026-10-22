"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { db } from "@/db";
import { BookingError } from "@/server/booking";
import { currentCustomer } from "@/server/customers";
import { createOpenReview, reportReview } from "@/server/reviews";

export async function reportReviewAction(form: FormData) {
  const reviewId = String(form.get("reviewId") ?? "");
  const reason = String(form.get("reason") ?? "").trim();
  const slug = String(form.get("slug") ?? "");
  if (reviewId && reason) await reportReview(db, reviewId, reason);
  redirect(`/${await getLocale()}/salon/${slug}?reported=1`);
}

export async function openReviewAction(form: FormData) {
  const locale = await getLocale();
  const slug = String(form.get("slug") ?? "");
  const back = (q: string) => redirect(`/${locale}/salon/${slug}?${q}#reviews`);
  const customer = await currentCustomer();
  if (!customer) redirect(`/${locale}/account?next=${encodeURIComponent(`/salon/${slug}#reviews`)}`);
  try {
    await createOpenReview(db, customer, {
      salonId: String(form.get("salonId") ?? ""),
      staffId: String(form.get("staffId") ?? ""),
      rating: Number(form.get("rating")),
      text: String(form.get("text") ?? ""),
    });
  } catch (e) {
    if (e instanceof BookingError) return back(`review=${e.code === "too_soon" ? "too_soon" : "invalid"}`);
    throw e;
  }
  back("review=ok");
}
