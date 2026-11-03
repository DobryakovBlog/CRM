import { getLocale, getTranslations } from "next-intl/server";
import type { menuItems } from "@/db/schema";
import { languageName, textDirection } from "@/lib/menu-languages";
import { ALLERGENS, DISH_TAGS } from "@/server/menu";

type Dish = typeof menuItems.$inferSelect;

const euros = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

/** Collapsible name (and description) fields for each language the menu is translated into. */
export async function TranslationFields({
  langs,
  values = {},
  description = false,
}: {
  langs: readonly string[];
  values?: Partial<Record<string, { name: string; description?: string }>>;
  description?: boolean;
}) {
  if (langs.length === 0) return null;
  const t = await getTranslations("business.menu");
  const locale = await getLocale();
  return (
    <div className="space-y-2">
      {langs.map((lang) => {
        const v = values[lang];
        const filled = Boolean(v?.name);
        return (
          <details key={lang} className="rounded-md border border-line bg-white px-3 py-2">
            <summary className="cursor-pointer text-sm">
              {t("translationIn", { language: languageName(lang, locale) })}
              <span className={`ml-2 text-xs ${filled ? "text-gold-deep" : "text-muted"}`}>{filled ? "✓" : t("notTranslated")}</span>
            </summary>
            <div className="mt-2 grid gap-2 sm:grid-cols-2" lang={lang} dir={textDirection(lang)}>
              <input name={`tr-${lang}-name`} maxLength={description ? 120 : 80} defaultValue={v?.name} aria-label={t("translatedName")} placeholder={t("translatedName")} className="input" />
              {description && (
                <textarea name={`tr-${lang}-description`} rows={2} maxLength={500} defaultValue={v?.description} aria-label={t("description")} placeholder={t("description")} className="input" />
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}

/** Fields shared by the "add dish" and "edit dish" forms. */
export async function DishFields({ dish, langs }: { dish?: Dish; langs: readonly string[] }) {
  const t = await getTranslations("business.menu");
  const ta = await getTranslations("allergens");
  const tt = await getTranslations("dishTags");
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="label">{t("dishName")}</label>
        <input name="name" required maxLength={120} defaultValue={dish?.name} className="input" />
      </div>
      <div>
        <label className="label">{t("description")}</label>
        <textarea name="description" rows={2} maxLength={500} defaultValue={dish?.description} className="input" />
      </div>
      <div className="sm:col-span-2">
        <TranslationFields langs={langs} values={dish?.translations} description />
      </div>
      <div>
        <label className="label">{t("price")}</label>
        <input
          name="price"
          required
          inputMode="decimal"
          pattern="\d{1,5}([.,]\d{1,2})?"
          placeholder="12,50"
          defaultValue={dish ? euros(dish.priceCents) : undefined}
          className="input"
        />
      </div>
      <div>
        <label className="label">{t("portion")}</label>
        <input name="portion" maxLength={40} placeholder={t("portionPlaceholder")} defaultValue={dish?.portion} className="input" />
      </div>
      <fieldset className="sm:col-span-2">
        <legend className="label">{t("allergens")}</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          {ALLERGENS.map((a) => (
            <label key={a} className="flex items-center gap-1.5">
              <input type="checkbox" name="allergens" value={a} defaultChecked={dish?.allergens.includes(a)} />
              {ta(a)}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="sm:col-span-2">
        <legend className="label">{t("tags")}</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          {DISH_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-1.5">
              <input type="checkbox" name="tags" value={tag} defaultChecked={dish?.tags.includes(tag)} />
              {tt(tag)}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
