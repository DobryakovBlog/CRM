import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { formatPrice } from "@/lib/format";
import { requireOwner } from "@/server/auth";
import { salonServices } from "@/server/cabinet";
import { CATEGORIES } from "@/server/catalog";
import { addServiceAction, toggleServiceAction } from "../actions";

export default async function ServicesPage({ params }: PageProps<"/[locale]/business/services">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { salon } = await requireOwner(locale);
  const t = await getTranslations("business.services");
  const tc = await getTranslations("categories");
  const services = await salonServices(db, salon.id);

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        {services.length === 0 && <li className="p-4 text-stone-500">{t("empty")}</li>}
        {services.map((s) => (
          <li key={s.id} className={`flex items-center justify-between gap-3 p-4 ${s.isActive ? "" : "opacity-50"}`}>
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-stone-500">
                {tc(s.category)} · {s.durationMinutes} min · {formatPrice(s.priceCents, locale)}
              </p>
            </div>
            <form action={toggleServiceAction}>
              <input type="hidden" name="serviceId" value={s.id} />
              <input type="hidden" name="active" value={s.isActive ? "0" : "1"} />
              <button className="btn-outline text-xs">{s.isActive ? t("disable") : t("enable")}</button>
            </form>
          </li>
        ))}
      </ul>

      <form action={addServiceAction} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">{t("addTitle")}</h2>
        <div>
          <label className="label" htmlFor="name">{t("name")}</label>
          <input id="name" name="name" required minLength={2} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="category">{t("category")}</label>
          <select id="category" name="category" className="input">
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{tc(c)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="durationMinutes">{t("duration")}</label>
          <input id="durationMinutes" name="durationMinutes" type="number" min={5} step={5} defaultValue={60} required className="input" />
        </div>
        <div>
          <label className="label" htmlFor="price">{t("price")}</label>
          <input id="price" name="price" type="number" min={0} step="0.5" required className="input" />
        </div>
        <button className="btn sm:col-span-2">{t("add")}</button>
      </form>
    </div>
  );
}
