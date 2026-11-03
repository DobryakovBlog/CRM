import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { requireOwner } from "@/server/auth";
import { languageName, MENU_LANGUAGES } from "@/lib/menu-languages";
import { dishLikes, menuLanguageOf, restaurantMenu } from "@/server/menu";
import {
  addDishAction,
  addSectionAction,
  menuLanguagesAction,
  deleteDishAction,
  deleteSectionAction,
  moveMenuEntryAction,
  toggleDishAction,
  updateDishAction,
  updateSectionAction,
} from "../actions";
import { DishFields, TranslationFields } from "./DishFields";

function MoveButtons({ kind, id, first, last }: { kind: "section" | "dish"; id: string; first: boolean; last: boolean }) {
  return (
    <form action={moveMenuEntryAction} className="flex">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <button name="dir" value="up" disabled={first} aria-label="↑" className="px-1.5 text-muted hover:text-ink disabled:opacity-30">↑</button>
      <button name="dir" value="down" disabled={last} aria-label="↓" className="px-1.5 text-muted hover:text-ink disabled:opacity-30">↓</button>
    </form>
  );
}

export default async function MenuPage({ params, searchParams }: PageProps<"/[locale]/business/menu">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const { salon } = await requireOwner(locale, "restaurant");
  const t = await getTranslations("business.menu");
  const [sections, likes] = await Promise.all([restaurantMenu(db, salon.id, { publicView: false }), dishLikes(db, salon.id)]);
  const original = menuLanguageOf(salon);
  const langs = salon.menuTranslations.filter((l) => l !== original);
  const byName = (a: string, b: string) => languageName(a, locale).localeCompare(languageName(b, locale), locale);
  const choices = [...MENU_LANGUAGES].sort(byName);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-sm text-muted">{t("hint")}</p>
        {salon.status === "active" && (
          <Link href={`/restaurant/${salon.slug}`} className="text-sm text-gold-deep underline">
            {t("viewPublic")}
          </Link>
        )}
      </div>
      <details id="languages" open={langs.length === 0} className="card scroll-mt-24">
        <summary className="cursor-pointer font-display text-2xl">
          {t("languagesTitle")}
          <span className="ml-3 align-middle font-sans text-sm text-muted">
            {[original, ...langs].map((l) => languageName(l, locale)).join(" · ")}
          </span>
        </summary>
        <form action={menuLanguagesAction} className="mt-4 space-y-4">
          <p className="max-w-2xl text-sm text-muted">{t("languagesHint")}</p>
          <div className="max-w-xs">
            <label className="label" htmlFor="menuOriginal">{t("originalLanguage")}</label>
            <select id="menuOriginal" name="original" defaultValue={original} className="input">
              {choices.map((l) => (
                <option key={l} value={l}>{languageName(l, locale)}</option>
              ))}
            </select>
          </div>
          <fieldset>
            <legend className="label">{t("translationLanguages")}</legend>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-3 lg:grid-cols-4">
              {choices.map((l) => (
                <label key={l} className="flex items-center gap-1.5">
                  <input type="checkbox" name="translations" value={l} defaultChecked={langs.includes(l)} />
                  {languageName(l, locale)}
                </label>
              ))}
            </div>
          </fieldset>
          <button className="btn text-sm">{t("saveLanguages")}</button>
        </form>
      </details>

      {sp.error === "invalid" && <p className="notice-error">{t("invalid")}</p>}
      {sections.length === 0 && <p className="notice">{t("empty")}</p>}

      {sections.map((section, si) => (
        <section key={section.id} id={`s-${section.id}`} className="card scroll-mt-24 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-2xl">
              {section.name}
              {langs.map((l) => section.translations[l]?.name).filter(Boolean).length > 0 && (
                <span className="ml-2 text-base text-muted">
                  / {langs.map((l) => section.translations[l]?.name).filter(Boolean).join(" / ")}
                </span>
              )}
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <MoveButtons kind="section" id={section.id} first={si === 0} last={si === sections.length - 1} />
              <details className="relative">
                <summary className="cursor-pointer text-muted hover:text-ink">{t("editSection")}</summary>
                <div className="absolute right-0 z-10 mt-2 max-h-[70vh] w-80 space-y-3 overflow-y-auto rounded-md border border-line bg-white p-4 shadow-lg">
                  <form action={updateSectionAction} className="space-y-2">
                    <input type="hidden" name="sectionId" value={section.id} />
                    <input name="name" required defaultValue={section.name} className="input" aria-label={t("sectionName")} />
                    <TranslationFields langs={langs} values={section.translations} />
                    <button className="btn-outline w-full text-xs">{t("save")}</button>
                  </form>
                  <form action={deleteSectionAction}>
                    <input type="hidden" name="sectionId" value={section.id} />
                    <button className="w-full text-xs text-red-700 hover:underline">{t("deleteSection")}</button>
                  </form>
                </div>
              </details>
            </div>
          </div>

          <ul className="divide-y divide-line">
            {section.items.map((d, di) => (
              <li key={d.id} id={`d-${d.id}`} className="scroll-mt-24 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className={d.isAvailable ? "" : "opacity-50"}>
                    <p className="font-medium">
                      {d.name}
                      {d.portion && <span className="ml-2 text-sm font-normal text-muted">{d.portion}</span>}
                    </p>
                    {d.description && <p className="text-sm text-muted">{d.description}</p>}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {(likes.counts.get(d.id) ?? 0) > 0 && (
                      <span className="text-xs text-red-700" title={t("likes")}>♥ {likes.counts.get(d.id)}</span>
                    )}
                    <span className="font-semibold tabular-nums">{formatPrice(d.priceCents, locale)}</span>
                    <form action={toggleDishAction}>
                      <input type="hidden" name="dishId" value={d.id} />
                      <input type="hidden" name="available" value={d.isAvailable ? "0" : "1"} />
                      <button className={`rounded-full border px-2.5 py-0.5 text-xs ${d.isAvailable ? "border-gold-soft text-gold-deep" : "border-line text-muted"}`}>
                        {d.isAvailable ? t("available") : t("soldOut")}
                      </button>
                    </form>
                    <MoveButtons kind="dish" id={d.id} first={di === 0} last={di === section.items.length - 1} />
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-muted hover:text-ink">{t("editDish")}</summary>
                  <form action={updateDishAction} className="mt-3 space-y-3">
                    <input type="hidden" name="dishId" value={d.id} />
                    <DishFields dish={d} langs={langs} />
                    <div className="flex items-center justify-between">
                      <button className="btn text-sm">{t("save")}</button>
                      <button formAction={deleteDishAction} name="sectionId" value={section.id} className="text-xs text-red-700 hover:underline">
                        {t("deleteDish")}
                      </button>
                    </div>
                  </form>
                </details>
              </li>
            ))}
          </ul>

          <details open={section.items.length === 0} className="rounded-md bg-sand/60 p-4">
            <summary className="cursor-pointer text-sm font-medium">{t("addDish")}</summary>
            <form action={addDishAction} className="mt-3 space-y-3">
              <input type="hidden" name="sectionId" value={section.id} />
              <DishFields langs={langs} />
              <button className="btn-gold text-sm">{t("addDish")}</button>
            </form>
          </details>
        </section>
      ))}

      <form action={addSectionAction} className="card space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label className="label" htmlFor="sectionName">{t("sectionName")}</label>
            <input id="sectionName" name="name" required maxLength={80} placeholder={t("sectionPlaceholder")} className="input" />
          </div>
          <button className="btn">{t("addSection")}</button>
        </div>
        <TranslationFields langs={langs} />
      </form>
    </div>
  );
}
