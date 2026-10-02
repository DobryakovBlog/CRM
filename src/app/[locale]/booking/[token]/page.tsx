import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { formatDateTime, formatPrice } from "@/lib/format";
import { bookingByToken } from "@/server/booking";
import { cancelAction, reviewAction } from "./actions";

export const metadata: Metadata = { robots: { index: false } };

export default async function BookingPage({ params, searchParams }: PageProps<"/[locale]/booking/[token]">) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const row = await bookingByToken(db, token);
  if (!row) notFound();
  const t = await getTranslations("booking");
  const { booking, salon, service, staff } = row;
  const canCancel = booking.status === "confirmed" && booking.startsAt > new Date();
  const canReview = booking.status === "completed" && !row.review?.id;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {sp.new === "1" && <p className="notice">{t("created")}</p>}
      {sp.reviewed === "1" && <p className="notice">{t("reviewThanks")}</p>}
      {typeof sp.error === "string" && <p className="notice-error">{t("error")}</p>}

      <div className="card space-y-2">
        <p className="eyebrow">{t(`status.${booking.status}`)}</p>
        <h1 className="font-display text-3xl">{service.name}</h1>
        <p>{formatDateTime(booking.startsAt, salon.timezone, locale)}</p>
        <p className="text-muted">
          {t("with", { name: staff.name })} ·{" "}
          <Link href={`/salon/${salon.slug}`} className="underline">
            {salon.name}
          </Link>
        </p>
        <p className="text-muted">{salon.address}</p>
        <p className="text-muted">
          {formatPrice(booking.priceCents, locale)} · {t("payOnSite")}
        </p>
        {canCancel && (
          <form action={cancelAction} className="pt-3">
            <input type="hidden" name="token" value={token} />
            <button className="btn-outline">{t("cancel")}</button>
          </form>
        )}
      </div>

      {canReview && (
        <form action={reviewAction} className="card space-y-3">
          <h2 className="font-display text-2xl">{t("reviewTitle", { name: staff.name })}</h2>
          <input type="hidden" name="token" value={token} />
          <fieldset className="flex gap-3">
            <legend className="label">{t("rating")}</legend>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="flex items-center gap-1 text-sm">
                <input type="radio" name="rating" value={n} required /> {n}★
              </label>
            ))}
          </fieldset>
          <div>
            <label className="label" htmlFor="text">{t("reviewText")}</label>
            <textarea id="text" name="text" rows={4} maxLength={2000} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="authorName">{t("authorName")}</label>
            <input id="authorName" name="authorName" maxLength={60} defaultValue={row.client.name.split(" ")[0]} className="input" />
          </div>
          <button className="btn">{t("submitReview")}</button>
        </form>
      )}
    </div>
  );
}
