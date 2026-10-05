import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { CityCombobox } from "@/components/CityCombobox";
import { RestaurantCard } from "@/components/RestaurantCard";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { COUNTRIES, cityName, cityOptions } from "@/lib/cities";
import { listedRestaurantCities, searchRestaurants } from "@/server/menu";

const str = (v: string | string[] | undefined) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("restaurants");
  return { title: t("metaTitle"), description: t("subtitle") };
}

export default async function RestaurantsPage({ params, searchParams }: PageProps<"/[locale]/restaurants">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("restaurants");
  const ts = await getTranslations("search");
  const tn = await getTranslations("countries");
  const cities = await listedRestaurantCities(db);
  const city = str(sp.city) ?? cities[0] ?? "lisboa";
  const q = str(sp.q);
  const results = await searchRestaurants(db, { city, q });

  return (
    <div className="space-y-12">
      <section className="-mt-10 rounded-b-md bg-plum px-6 pb-10 pt-14 text-white sm:px-12 sm:pb-12 sm:pt-16">
        <p className="eyebrow text-gold">{t("eyebrow")}</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl leading-[1.08] sm:text-5xl">{t("title")}</h1>
        <p className="mt-5 max-w-xl text-base text-gold-soft/85 sm:text-lg">{t("subtitle")}</p>
        <form
          action={`/${await getLocale()}/restaurants`}
          className="mt-8 grid gap-3 rounded-md border border-line bg-white p-3 text-ink shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] sm:grid-cols-2 sm:p-4 lg:grid-cols-[0.8fr_1.2fr_1.4fr_auto]"
        >
          <select name="country" defaultValue="pt" className="input" aria-label={ts("country")}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code} disabled={!c.open}>
                {tn(c.code)}
                {c.open ? "" : ` · ${ts("comingSoon")}`}
              </option>
            ))}
          </select>
          <CityCombobox
            name="city"
            options={cityOptions(cities, city)}
            searchUrl="/api/places?for=restaurants"
            defaultSlug={city}
            label={ts("city")}
            placeholder={ts("cityPlaceholder")}
            noMatch={ts("cityNoMatch")}
            soonLabel={ts("comingSoon")}
          />
          <input name="q" defaultValue={q} placeholder={t("searchPlaceholder")} aria-label={t("searchPlaceholder")} className="input" />
          <button className="btn-gold px-8">{ts("submit")}</button>
        </form>
      </section>

      <section className="space-y-6">
        <h2 className="font-display text-3xl">{t("resultsTitle", { count: results.length, city: cityName(city) })}</h2>
        {results.length === 0 && (
          <div className="card space-y-3">
            <p>{q ? t("noMatch") : t("cityEmpty", { city: cityName(city) })}</p>
            <Link href="/business/register?kind=restaurant" className="btn-outline inline-block">
              {t("join")}
            </Link>
          </div>
        )}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <li key={r.id}>
              <RestaurantCard restaurant={r} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
