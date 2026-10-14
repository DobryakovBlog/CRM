"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { db } from "@/db";
import { reportReview } from "@/server/reviews";

export async function reportReviewAction(form: FormData) {
  const reviewId = String(form.get("reviewId") ?? "");
  const reason = String(form.get("reason") ?? "").trim();
  const slug = String(form.get("slug") ?? "");
  if (reviewId && reason) await reportReview(db, reviewId, reason);
  redirect(`/${await getLocale()}/salon/${slug}?reported=1`);
}
