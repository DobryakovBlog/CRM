import { describe, expect, it } from "vitest";
import { endonym, languageName, menuLanguageFor, mergeTranslations, translationsFromForm } from "./menu-languages";

describe("menu languages", () => {
  it("names languages in the reader's language and in their own", () => {
    expect(languageName("en", "pt")).toBe("Inglês");
    expect(endonym("de")).toBe("Deutsch");
    expect(endonym("uk")).toBe("Українська");
  });

  it("shows the guest's pick, else the site language when translated, else the original", () => {
    const base = { original: "pt", translations: ["en", "de"] };
    expect(menuLanguageFor({ ...base, requested: "de", locale: "en" })).toBe("de");
    expect(menuLanguageFor({ ...base, requested: "fr", locale: "en" })).toBe("en");
    expect(menuLanguageFor({ ...base, locale: "fr" })).toBe("pt");
    expect(menuLanguageFor({ ...base, requested: "pt", locale: "en" })).toBe("pt");
  });

  it("reads only the restaurant's languages from a form and keeps switched-off ones", () => {
    const form = new FormData();
    form.set("tr-en-name", " Sardines ");
    form.set("tr-en-description", "Grilled");
    form.set("tr-xx-name", "ignored");
    form.set("tr-de-name", "");
    const incoming = translationsFromForm(form, ["en", "de", "xx"], { name: 80, description: 500 });
    expect(incoming).toEqual({ en: { name: "Sardines", description: "Grilled" }, de: { name: "", description: "" } });
    const merged = mergeTranslations({ de: { name: "Sardinen", description: "" }, fr: { name: "Sardines", description: "" } }, incoming);
    expect(merged).toEqual({ en: { name: "Sardines", description: "Grilled" }, fr: { name: "Sardines", description: "" } });
  });
});
