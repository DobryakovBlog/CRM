import { getTranslations } from "next-intl/server";
import type { menuItems } from "@/db/schema";
import { ALLERGENS, DISH_TAGS } from "@/server/menu";

type Dish = typeof menuItems.$inferSelect;

const euros = (cents: number) => (cents / 100).toFixed(2).replace(".", ",");

/** Fields shared by the "add dish" and "edit dish" forms. */
export async function DishFields({ dish }: { dish?: Dish }) {
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
        <label className="label">{t("dishNameEn")}</label>
        <input name="nameEn" maxLength={120} defaultValue={dish?.nameEn} className="input" />
      </div>
      <div>
        <label className="label">{t("description")}</label>
        <textarea name="description" rows={2} maxLength={500} defaultValue={dish?.description} className="input" />
      </div>
      <div>
        <label className="label">{t("descriptionEn")}</label>
        <textarea name="descriptionEn" rows={2} maxLength={500} defaultValue={dish?.descriptionEn} className="input" />
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
