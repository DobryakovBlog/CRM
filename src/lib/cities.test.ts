import { describe, expect, it } from "vitest";
import { cityName, cityOptions, isPlace, placeBySlug, placesIn, searchPlaces } from "./cities";

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
