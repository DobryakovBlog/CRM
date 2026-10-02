"use server";

import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { db } from "@/db";
import { BookingError, cancelByClient } from "@/server/booking";
import { createReview } from "@/server/reviews";

async function run(token: string, fn: () => Promise<unknown>, ok: string) {
  const base = `/${await getLocale()}/booking/${token}`;
  try {
    await fn();
  } catch (e) {
    if (e instanceof BookingError) redirect(`${base}?error=${e.code}`);
    throw e;
  }
  redirect(`${base}${ok}`);
}

export async function cancelAction(form: FormData) {
  const token = String(form.get("token") ?? "");
  await run(token, () => cancelByClient(db, token), "");
}

export async function reviewAction(form: FormData) {
  const token = String(form.get("token") ?? "");
  await run(
    token,
    () =>
      createReview(db, token, {
        rating: Number(form.get("rating")),
        text: String(form.get("text") ?? ""),
        authorName: String(form.get("authorName") ?? ""),
      }),
    "?reviewed=1",
  );
}
