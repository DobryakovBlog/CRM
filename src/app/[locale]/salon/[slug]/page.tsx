import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Monogram } from "@/components/SalonCard";
import { Stars } from "@/components/Stars";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { formatDateTime, formatPrice } from "@/lib/format";
import { cityName } from "@/lib/slug";
import { salonBySlug } from "@/server/catalog";
import { publishedReviews } from "@/server/reviews";
import { reportReviewAction } from "./actions";

export async function generateMetadata({ params }: PageProps<"/[locale]/salon/[slug]">): Promise<Metadata> {
  const data = await salonBySlug(db, (await params).slug);
  return data ? { title: data.salon.name, description: data.salon.description } : {};
}

export default async function SalonPage({ params, searchParams }: PageProps<"/[locale]/salon/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const data = await salonBySlug(db, slug);
  if (!data) notFound();
  const { salon, services, staff } = data;
  const reviews = await publishedReviews(db, salon.id);
  const reported = (await searchParams).reported === "1";
  const t = await getTranslations("salon");
  const tc = await getTranslations("categories");
  const tl = await getTranslations("languages");
  const ts = await getTranslations("search");

  const byCategory = Object.groupBy(services, (s) => s.category);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-8">
        <header className="space-y-4">
          <Monogram name={salon.name} className="aspect-[21/9] w-full rounded-md" />
          <p className="eyebrow pt-2">{[salon.district, cityName(salon.city)].filter(Boolean).join(" · ")}</p>
          <h1 className="font-display text-4xl sm:text-5xl">{salon.name}</h1>
          <p className="text-muted">{salon.address}</p>
          <div>
            <Stars x100={salon.ratingAvg} count={salon.ratingCount} newLabel={ts("new")} />
            {salon.ratingCount > 0 && <span className="ml-2 text-xs text-muted">{t("verifiedNote")}</span>}
          </div>
          {salon.description && <p className="max-w-2xl text-lg leading-relaxed text-ink">{salon.description}</p>}
        </header>

        <section>
          <h2 className="font-display mb-4 text-2xl">{t("services")}</h2>
          <div className="space-y-5">
            {Object.entries(byCategory).map(([category, items]) => (
              <div key={category}>
                <h3 className="eyebrow mb-3">
                  {tc(category as never)}
                </h3>
                <ul className="divide-y divide-line rounded-xl border border-line bg-white">
                  {items!.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted">
                          {t("minutes", { n: s.durationMinutes })} · {formatPrice(s.priceCents, locale)}
                        </p>
                      </div>
                      <Link href={`/salon/${salon.slug}/book?service=${s.id}`} className="btn">
                        {t("book")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display mb-4 text-2xl">{t("reviews")}</h2>
          {reported && <p className="mb-3 notice">{t("reportThanks")}</p>}
          {reviews.length === 0 && <p className="text-muted">{t("noReviews")}</p>}
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="card">
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {r.authorName} <span className="font-normal text-muted">· {t("withMaster", { name: r.staffName })}</span>
                  </p>
                  <span className="text-gold" aria-label={`${r.rating}/5`}>
                    {"★".repeat(r.rating)}
                    <span className="text-line">{"★".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {formatDateTime(r.createdAt, salon.timezone, locale, { dateStyle: "medium" })} ·{" "}
                  {r.source === "marketplace" ? t("viaAstrabela") : t("viaSalon")}
                </p>
                {r.text && <p className="mt-2 whitespace-pre-line text-ink">{r.text}</p>}
                {r.reply && (
                  <div className="mt-3 rounded-lg bg-sand p-3 text-sm">
                    <p className="font-medium">{t("salonReply")}</p>
                    <p className="whitespace-pre-line">{r.reply}</p>
                  </div>
                )}
                <details className="mt-2 text-xs text-muted">
                  <summary className="cursor-pointer">{t("report")}</summary>
                  <form action={reportReviewAction} className="mt-2 flex gap-2">
                    <input type="hidden" name="reviewId" value={r.id} />
                    <input type="hidden" name="slug" value={salon.slug} />
                    <input name="reason" required maxLength={1000} placeholder={t("reportReason")} className="input" />
                    <button className="btn-outline">{t("send")}</button>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="card">
          <h2 className="font-display mb-4 text-xl">{t("team")}</h2>
          <ul className="space-y-3">
            {staff.map((m) => (
              <li key={m.id}>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{m.name}</p>
                  <Stars x100={m.ratingAvg} count={m.ratingCount} newLabel={ts("new")} />
                </div>
                <p className="text-sm text-muted">
                  {[m.title, m.languages.map((l) => tl(l as never)).join(", ")].filter(Boolean).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card text-sm text-ink">
          <p>{salon.address}</p>
          {salon.phone && <p className="mt-1">{salon.phone}</p>}
          <p className="mt-3 text-xs text-muted">{t("payOnSite")}</p>
        </div>
      </aside>
    </div>
  );
}
