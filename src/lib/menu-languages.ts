import { LOCALE_NAMES, routing } from "@/i18n/routing";

/**
 * Languages a restaurant can write or translate its menu in: every site language plus the ones
 * tourists in Europe often read. Names come from the browser's own language data (Intl), so no
 * list of names has to be kept in the message files.
 */
export const MENU_LANGUAGES = [
  ...routing.locales,
  "ca",
  "gl",
  "eu",
  "ga",
  "lb",
  "mt",
  "bs",
  "tr",
  "ru",
  "ar",
  "he",
  "hi",
  "zh",
  "ja",
  "ko",
] as const;
export type MenuLanguage = (typeof MENU_LANGUAGES)[number];

export const isMenuLanguage = (v: string): v is MenuLanguage => (MENU_LANGUAGES as readonly string[]).includes(v);

/** The usual language of menus in each country the site covers, for restaurants that have not chosen one. */
export const COUNTRY_MENU_LANGUAGE: Record<string, MenuLanguage> = {
  pt: "pt", es: "es", fr: "fr", it: "it", de: "de", nl: "nl", be: "nl", ie: "en", lu: "fr", at: "de", ch: "de",
  pl: "pl", cz: "cs", sk: "sk", hu: "hu", si: "sl", hr: "hr", ro: "ro", bg: "bg", dk: "da", se: "sv", no: "nb",
  fi: "fi", ee: "et", lv: "lv", lt: "lt", gr: "el", cy: "el", mt: "en", is: "is", rs: "sr", ba: "bs", me: "sr",
  mk: "mk", al: "sq", xk: "sq", md: "ro", ua: "uk", ad: "ca", mc: "fr", sm: "it", li: "de", gb: "en",
};

const RTL = new Set(["ar", "he"]);
export const textDirection = (lang: string) => (RTL.has(lang) ? "rtl" : "ltr");

const capitalise = (s: string, lang: string) => s.charAt(0).toLocaleUpperCase(lang) + s.slice(1);

/** "Inglês" for an owner reading Portuguese. */
export function languageName(code: string, inLocale: string) {
  try {
    return capitalise(new Intl.DisplayNames([inLocale], { type: "language" }).of(code) ?? code, inLocale);
  } catch {
    return code;
  }
}

/** The language's own name, "Deutsch", for the guest's language switch. */
export const endonym = (code: string) => LOCALE_NAMES[code as keyof typeof LOCALE_NAMES] ?? languageName(code, code);

export type SectionTranslations = Partial<Record<string, { name: string }>>;
export type DishTranslations = Partial<Record<string, { name: string; description: string }>>;

/** Translations sent by a cabinet form as fields like `tr-en-name`, for the restaurant's languages. */
export function translationsFromForm(form: FormData, langs: readonly string[], fields: { name: number; description?: number }) {
  const out: Record<string, { name: string; description: string }> = {};
  const get = (lang: string, f: string) => String(form.get(`tr-${lang}-${f}`) ?? "").trim();
  for (const lang of langs) {
    if (!isMenuLanguage(lang)) continue;
    out[lang] = {
      name: get(lang, "name").slice(0, fields.name),
      description: fields.description ? get(lang, "description").slice(0, fields.description) : "",
    };
  }
  return out;
}

/**
 * Merges a form's translations into the stored ones. Languages the form did not carry (ones the
 * restaurant switched off) are kept, so switching a language back on restores its texts; emptied
 * translations are removed.
 */
export function mergeTranslations<T extends { name: string; description?: string }>(
  stored: Partial<Record<string, T>>,
  incoming: Record<string, T>,
): Partial<Record<string, T>> {
  const merged: Partial<Record<string, T>> = { ...stored, ...incoming };
  for (const [lang, v] of Object.entries(merged)) {
    if (!v || (!v.name && !v.description)) delete merged[lang];
  }
  return merged;
}

/**
 * The language a guest sees the menu in: the one they picked, else the site language when the
 * menu has it, else the menu's own language.
 */
export function menuLanguageFor(p: { requested?: string; locale: string; original: string; translations: readonly string[] }) {
  const offered = [p.original, ...p.translations].filter(Boolean);
  if (p.requested && offered.includes(p.requested)) return p.requested;
  if (offered.includes(p.locale)) return p.locale;
  return p.original;
}
