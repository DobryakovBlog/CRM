import { describe, expect, it } from "vitest";
import { cityFieldSetup, cityName, cityOptions, isPlace, placeBySlug, placeTimezone, placesIn, searchPlaces } from "./cities";

// Slugs salons were registered with before the full list existed.
const OLD_SLUGS = [
  "lisboa", "porto", "vila-nova-de-gaia", "braga", "coimbra", "aveiro", "faro", "albufeira", "loule", "lagos",
  "portimao", "setubal", "almada", "cascais", "oeiras", "sintra", "amadora", "matosinhos", "maia", "guimaraes",
  "viana-do-castelo", "viseu", "leiria", "santarem", "evora", "beja", "portalegre", "castelo-branco", "guarda",
  "vila-real", "braganca", "funchal", "ponta-delgada", "angra-do-heroismo",
];

describe("Portuguese places", () => {
  it("keeps every city slug used before", () => {
    for (const s of OLD_SLUGS) expect(isPlace(s), s).toBe(true);
    expect(cityName("evora")).toBe("Évora");
  });

  it("covers all municipalities and their localities", () => {
    expect(cityOptions([]).length).toBe(308);
    expect(placeBySlug("lagoa-algarve")).toMatchObject({ name: "Lagoa", area: "Faro" });
    expect(placeBySlug("lagoa-sao-miguel")).toMatchObject({ name: "Lagoa", area: "Açores" });
    const quarteira = searchPlaces("quarteira").find((p) => p.slug === "quarteira-loule");
    expect(quarteira).toMatchObject({ name: "Quarteira", area: "Loulé, Faro" });
    expect(placesIn("loule")).toContain("quarteira-loule");
    expect(placesIn("quarteira-loule")).toEqual(["quarteira-loule"]);
  });

  it("ranks the municipality first and ignores accents", () => {
    expect(searchPlaces("evora")[0].slug).toBe("evora");
    expect(searchPlaces("Sint")[0].slug).toBe("sintra");
    expect(searchPlaces("x")).not.toHaveLength(0);
    expect(searchPlaces("")).toEqual([]);
  });

  it("puts places with salons first and marks their municipality", () => {
    const [first] = searchPlaces("qu", ["quarteira-loule"]);
    expect(first).toMatchObject({ slug: "quarteira-loule", hasSalons: true });
    const options = cityOptions(["quarteira-loule"]);
    expect(options[0].slug).toBe("loule");
    expect(options.find((o) => o.slug === "loule")?.hasSalons).toBe(true);
  });
});

describe("Spanish places", () => {
  it("covers every municipality with readable names", () => {
    expect(placeBySlug("madrid")).toMatchObject({ name: "Madrid", area: "Madrid", country: "es" });
    expect(placeBySlug("a-coruna")).toMatchObject({ name: "A Coruña", area: "A Coruña" });
    expect(placeBySlug("las-palmas-de-gran-canaria")).toMatchObject({ country: "es", area: "Las Palmas" });
    expect(cityName("alacant-alicante")).toBe("Alacant/Alicante");
    // Portuguese slugs stay as they were.
    expect(placeBySlug("lisboa")?.country).toBe("pt");
  });

  it("finds big cities first and only in the chosen country", () => {
    expect(searchPlaces("madrid", [], 30, "es")[0].slug).toBe("madrid");
    expect(searchPlaces("valen", [], 30, "es")[0].name).toBe("València");
    expect(searchPlaces("alicante", [], 30, "es")[0].slug).toBe("alacant-alicante");
    expect(searchPlaces("san sebastian", [], 30, "es")[0].slug).toBe("donostia-san-sebastian");
    expect(searchPlaces("lisboa", [], 30, "es")).toEqual([]);
    expect(searchPlaces("madrid", [], 30, "pt")).toEqual([]);
  });

  it("starts with the bigger cities, not all 8,000 municipalities", () => {
    const options = cityOptions([], undefined, "es");
    expect(options.length).toBeGreaterThan(50);
    expect(options.length).toBeLessThan(200);
    expect(options.some((o) => o.slug === "barcelona")).toBe(true);
    expect(cityOptions([], undefined, "pt").length).toBe(308);
  });

  it("gives every name a unique slug", () => {
    const castejon = searchPlaces("castejon", [], 30, "es").map((p) => p.slug);
    expect(new Set(castejon).size).toBe(castejon.length);
  });

  it("uses Madrid time, or Atlantic time on the Canaries", () => {
    expect(placeTimezone("madrid")).toBe("Europe/Madrid");
    expect(placeTimezone("las-palmas-de-gran-canaria")).toBe("Atlantic/Canary");
    expect(placeTimezone("lisboa")).toBe("Europe/Lisbon");
  });

  it("starts Spanish visitors in Spain and keeps the current city's country", () => {
    expect(cityFieldSetup([], undefined, "es")).toMatchObject({ defaultCountry: "es", defaultSlugs: { pt: "lisboa", es: "madrid" } });
    expect(cityFieldSetup([], undefined, "en").defaultCountry).toBe("pt");
    expect(cityFieldSetup(["porto", "sevilla"], "sevilla", "pt")).toMatchObject({
      defaultCountry: "es",
      defaultSlugs: { pt: "porto", es: "sevilla" },
    });
  });
});
