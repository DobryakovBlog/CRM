import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "es", "fr", "it"],
  defaultLocale: "pt",
});

export type Locale = (typeof routing.locales)[number];

/** A supported locale, or Portuguese for anything else. */
export const toLocale = (value: string | null | undefined): Locale =>
  (routing.locales as readonly string[]).includes(value ?? "") ? (value as Locale) : routing.defaultLocale;

/** Locale names in their own language, for language pickers. */
export const LOCALE_NAMES: Record<Locale, string> = { pt: "Português", en: "English", es: "Español", fr: "Français", it: "Italiano" };
