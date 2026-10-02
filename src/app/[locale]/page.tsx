import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SearchForm } from "@/components/SearchForm";
import { db } from "@/db";
import { listedCities } from "@/server/catalog";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  await connection(); // the city list comes from the database on every request
  const t = await getTranslations("home");
  const cities = await listedCities(db);

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-brand-50 px-6 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">{t("subtitle")}</p>
        <div className="mx-auto mt-8 max-w-3xl text-left">
          <SearchForm cities={cities} />
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {(["verified", "masters", "direct"] as const).map((k) => (
          <div key={k} className="card">
            <h2 className="font-semibold">{t(`why.${k}.title`)}</h2>
            <p className="mt-1 text-sm text-stone-600">{t(`why.${k}.text`)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
