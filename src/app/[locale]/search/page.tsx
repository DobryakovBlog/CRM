import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SearchForm } from "@/components/SearchForm";
import { SalonCard } from "@/components/SalonCard";
import { Link } from "@/i18n/navigation";
import { db } from "@/db";
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
    <div className="space-y-8">
      <SearchForm listed={cities} current={query} />
      <h1 className="font-display text-3xl">
        {t("resultsTitle", { count: results.length, city: query.city ? cityName(query.city) : "" })}
      </h1>
      {results.length === 0 &&
        (query.city && !cities.includes(query.city) ? (
          <div className="card space-y-3">
            <p>{t("cityEmpty", { city: cityName(query.city) })}</p>
            <Link href="/business" className="btn-outline inline-block">
              {t("cityEmptyCta")}
            </Link>
          </div>
        ) : (
          <p className="text-muted">{t("empty")}</p>
        ))}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s) => (
          <li key={s.id}>
            <SalonCard salon={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}
