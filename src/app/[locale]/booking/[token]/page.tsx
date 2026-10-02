import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { SalonCard } from "@/components/SalonCard";
import { Link } from "@/i18n/navigation";
import { formatDateTime, formatPrice } from "@/lib/format";
import { cityName } from "@/lib/slug";
import { bookingByToken } from "@/server/booking";
import { searchSalons } from "@/server/catalog";
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
  // Visits recorded by the salon for a review invitation have a date but no exact time.
  const invited = booking.source === "invitation";
  // After reviewing, show the client what else their city has to offer.
  const more =
    sp.reviewed === "1"
      ? (await searchSalons(db, { city: row.city })).filter((x) => x.id !== salon.id).slice(0, 3)
      : [];

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {sp.new === "1" && <p className="notice">{t("created")}</p>}
      {sp.reviewed === "1" && <p className="notice">{t("reviewThanks")}</p>}
      {typeof sp.error === "string" && <p className="notice-error">{t("error")}</p>}

      <div className="card space-y-2">
        <p className="eyebrow">{t(`status.${booking.status}`)}</p>
        <h1 className="font-display text-3xl">{service.name}</h1>
        <p>
          {invited
            ? t("visitOn", { date: formatDateTime(booking.startsAt, salon.timezone, locale, { dateStyle: "full" }) })
            : formatDateTime(booking.startsAt, salon.timezone, locale)}
        </p>
        <p className="text-muted">
          {t("with", { name: staff.name })} ·{" "}
          <Link href={`/salon/${salon.slug}`} className="underline">
            {salon.name}
          </Link>
        </p>
        <p className="text-muted">{salon.address}</p>
        {!invited && (
          <p className="text-muted">
            {formatPrice(booking.priceCents, locale)} · {t("payOnSite")}
          </p>
        )}
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

      {more.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-2xl">{t("moreTitle", { city: cityName(row.city) })}</h2>
          <ul className="grid gap-4">
            {more.map((x) => (
              <li key={x.id}>
                <SalonCard salon={x} />
              </li>
            ))}
          </ul>
          <Link href={`/search?city=${row.city}`} className="btn-outline inline-block">
            {t("moreLink")}
          </Link>
        </section>
      )}
    </div>
  );
}
