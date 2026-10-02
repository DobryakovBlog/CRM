import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SalonCard } from "@/components/SalonCard";
import { SearchForm } from "@/components/SearchForm";
import { db } from "@/db";
import { listedCities, searchSalons } from "@/server/catalog";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  await connection(); // cities and salons come from the database on every request
  const t = await getTranslations("home");
  const cities = await listedCities(db);
  const featured = (await searchSalons(db, { city: cities[0] })).slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="-mt-10 overflow-hidden rounded-b-md bg-plum px-6 pb-10 pt-14 text-white sm:px-12 sm:pb-12 sm:pt-20">
        <p className="eyebrow text-gold">{t("eyebrow")}</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl leading-[1.08] sm:text-6xl">{t("title")}</h1>
        <p className="mt-5 max-w-xl text-base text-gold-soft/85 sm:text-lg">{t("subtitle")}</p>
        <div className="mt-10">
          <SearchForm cities={cities} />
        </div>
      </section>

      <section className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
        {(["verified", "masters", "direct"] as const).map((k) => (
          <div key={k} className="bg-white p-7">
            <h2 className="font-display text-xl">{t(`why.${k}.title`)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t(`why.${k}.text`)}</p>
          </div>
        ))}
      </section>

      {featured.length > 0 && (
        <section className="space-y-6">
          <div>
            <p className="eyebrow">{t("featuredEyebrow")}</p>
            <h2 className="font-display mt-2 text-3xl">{t("featuredTitle")}</h2>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <li key={s.id}>
                <SalonCard salon={s} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
