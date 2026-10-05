import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { formatPrice } from "@/lib/format";
import { cityName } from "@/lib/slug";
import { restaurantBySlug } from "@/server/menu";

export async function generateMetadata({ params }: PageProps<"/[locale]/restaurant/[slug]">): Promise<Metadata> {
  const data = await restaurantBySlug(db, (await params).slug);
  if (!data) return {};
  const t = await getTranslations("restaurant");
  return { title: `${data.restaurant.name} · ${t("menu")}`, description: data.restaurant.description || data.restaurant.cuisine };
}

export default async function RestaurantPage({ params }: PageProps<"/[locale]/restaurant/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const data = await restaurantBySlug(db, slug);
  if (!data) notFound();
  const { restaurant: r, sections } = data;
  const t = await getTranslations("restaurant");
  const ta = await getTranslations("allergens");
  const tt = await getTranslations("dishTags");
  // English names are optional; fall back to Portuguese.
  const en = locale === "en";
  const pick = (pt: string, eng: string) => (en && eng ? eng : pt);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="-mx-4 -mt-10 bg-plum px-6 pb-10 pt-12 text-center text-white sm:mx-0 sm:rounded-b-md sm:px-12">
        <p className="eyebrow text-gold">{[r.cuisine, r.district, cityName(r.city)].filter(Boolean).join(" · ")}</p>
        <h1 className="font-display mt-4 text-4xl leading-tight sm:text-5xl">{r.name}</h1>
        {r.description && <p className="mx-auto mt-4 max-w-xl text-gold-soft/85">{r.description}</p>}
        <p className="mt-5 text-sm text-gold-soft/70">
          {r.address}
          {r.phone && (
            <>
              {" · "}
              <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="underline decoration-gold/50 underline-offset-4 hover:text-white">
                {r.phone}
              </a>
            </>
          )}
        </p>
      </header>

      {sections.length > 1 && (
        <nav aria-label={t("menu")} className="z-10 -mx-4 overflow-x-auto border-b border-line bg-porcelain/95 px-4 backdrop-blur md:sticky md:top-[81px]">
          <ul className="flex gap-1 py-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#s-${s.id}`} className="block whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:bg-sand hover:text-ink">
                  {pick(s.name, s.nameEn)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {sections.map((s) => (
        <section key={s.id} id={`s-${s.id}`} className="scroll-mt-36">
          <h2 className="font-display flex items-center gap-4 text-2xl sm:text-3xl">
            {pick(s.name, s.nameEn)}
            <span className="h-px flex-1 bg-gold/40" aria-hidden />
          </h2>
          <ul className="mt-4 space-y-5">
            {s.items.map((d) => (
              <li key={d.id}>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-medium text-ink">{pick(d.name, d.nameEn)}</h3>
                  <span className="mb-1 flex-1 border-b border-dotted border-line" aria-hidden />
                  <span className="font-semibold tabular-nums text-ink">{formatPrice(d.priceCents, locale)}</span>
                </div>
                {(d.description || d.portion) && (
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {pick(d.description, d.descriptionEn)}
                    {d.portion && <span className="whitespace-nowrap">{d.description ? " · " : ""}{d.portion}</span>}
                  </p>
                )}
                {(d.tags.length > 0 || d.allergens.length > 0) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                    {d.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-gold-soft px-2 py-0.5 text-gold-deep">
                        {tt(tag as never)}
                      </span>
                    ))}
                    {d.allergens.length > 0 && (
                      <span className="text-muted">
                        {t("allergens")}: {d.allergens.map((a) => ta(a as never)).join(", ")}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <footer className="space-y-1 border-t border-line pt-6 text-center text-xs text-muted">
        <p>{t("vatIncluded")}</p>
        <p>{t("allergyNote")}</p>
      </footer>
    </div>
  );
}
