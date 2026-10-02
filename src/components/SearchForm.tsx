import { getLocale, getTranslations } from "next-intl/server";
import { CITY_SLUGS, cityName } from "@/lib/cities";
import { CATEGORIES } from "@/server/catalog";

export const LANGUAGES = ["en", "es", "fr", "de", "it", "ru", "uk"] as const;

export async function SearchForm({
  listed,
  current = {},
}: {
  /** Cities that already have salons; they come first in the list. */
  listed: string[];
  current?: { city?: string; category?: string; language?: string; q?: string };
}) {
  const t = await getTranslations("search");
  const tc = await getTranslations("categories");
  const tl = await getTranslations("languages");
  const locale = await getLocale();
  const byName = (a: string, b: string) => cityName(a).localeCompare(cityName(b), "pt");
  const groups = [
    { label: t("citiesWithSalons"), cities: [...listed].sort(byName) },
    { label: t("citiesComingSoon"), cities: CITY_SLUGS.filter((c) => !listed.includes(c)).sort(byName) },
  ].filter((g) => g.cities.length > 0);
  return (
    <form action={`/${locale}/search`} className="grid gap-3 rounded-md border border-line bg-white p-3 text-ink shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] sm:grid-cols-[1fr_1fr_1fr_auto] sm:p-4">
      <select name="city" defaultValue={current.city ?? listed[0] ?? "lisboa"} className="input" aria-label={t("city")}>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.cities.map((c) => (
              <option key={c} value={c}>
                {cityName(c)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <select name="category" defaultValue={current.category ?? ""} className="input" aria-label={t("service")}>
        <option value="">{t("anyService")}</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {tc(c)}
          </option>
        ))}
      </select>
      <select name="language" defaultValue={current.language ?? ""} className="input" aria-label={t("language")}>
        <option value="">{t("anyLanguage")}</option>
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>
            {tl(l)}
          </option>
        ))}
      </select>
      <button className="btn-gold px-8">{t("submit")}</button>
    </form>
  );
}
