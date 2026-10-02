import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SearchForm } from "@/components/SearchForm";
import { Stars } from "@/components/Stars";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { cityName } from "@/lib/slug";
import { CATEGORIES, listedCities, searchSalons, type Category } from "@/server/catalog";

const str = (v: string | string[] | undefined) => (typeof v === "string" && v ? v : undefined);

export async function generateMetadata({ searchParams }: PageProps<"/[locale]/search">): Promise<Metadata> {
  const city = str((await searchParams).city);
  return { title: city ? cityName(city) : undefined };
}

export default async function SearchPage({ params, searchParams }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("search");

  const category = str(sp.category);
  const query = {
    city: str(sp.city),
    category: CATEGORIES.includes(category as Category) ? (category as Category) : undefined,
    language: str(sp.language),
    q: str(sp.q),
  };
  const [cities, results] = await Promise.all([listedCities(db), searchSalons(db, query)]);

  return (
    <div className="space-y-6">
      <SearchForm cities={cities} current={query} />
      <h1 className="text-xl font-semibold">
        {t("resultsTitle", { count: results.length, city: query.city ? cityName(query.city) : "" })}
      </h1>
      {results.length === 0 && <p className="text-stone-600">{t("empty")}</p>}
      <ul className="grid gap-4 sm:grid-cols-2">
        {results.map((s) => (
          <li key={s.id}>
            <Link href={`/salon/${s.slug}`} className="card block h-full hover:border-brand-500">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{s.name}</h2>
                <Stars x100={s.ratingAvg} count={s.ratingCount} newLabel={t("new")} />
              </div>
              <p className="mt-1 text-sm text-stone-600">
                {[s.district, cityName(s.city)].filter(Boolean).join(", ")}
              </p>
              <p className="mt-3 text-sm text-stone-700">{t("from", { price: formatPrice(s.minPriceCents, locale) })}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
