import { getLocale, getTranslations } from "next-intl/server";
import { COUNTRIES, cityOptions } from "@/lib/cities";
import { CityCombobox } from "./CityCombobox";
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
  const tn = await getTranslations("countries");
  return (
    <form action={`/${locale}/search`} className="grid gap-3 rounded-md border border-line bg-white p-3 text-ink shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] sm:grid-cols-2 lg:grid-cols-[0.8fr_1.2fr_1fr_1fr_auto] sm:p-4">
      <select name="country" defaultValue="pt" className="input" aria-label={t("country")}>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code} disabled={!c.open}>
            {tn(c.code)}
            {c.open ? "" : ` · ${t("comingSoon")}`}
          </option>
        ))}
      </select>
      <CityCombobox
        name="city"
        options={cityOptions(listed, current.city)}
        searchUrl="/api/places"
        defaultSlug={current.city ?? listed[0] ?? "lisboa"}
        label={t("city")}
        placeholder={t("cityPlaceholder")}
        noMatch={t("cityNoMatch")}
        soonLabel={t("comingSoon")}
      />
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
