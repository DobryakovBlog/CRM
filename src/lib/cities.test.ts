import { describe, expect, it } from "vitest";
import { cityFieldSetup, cityName, cityOptions, isPlace, placeBySlug, phoneCountry, placeTimezone, placesIn, searchPlaces } from "./cities";

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
    expect(searchPlaces("Sint", [], 30, "pt")[0].slug).toBe("sintra");
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
    // The visitor's country (from the IP) wins over the language when we are open there.
    expect(cityFieldSetup([], undefined, "en", "es").defaultCountry).toBe("es");
    expect(cityFieldSetup([], undefined, "es", "pt").defaultCountry).toBe("pt");
    expect(cityFieldSetup([], undefined, "es", "pl").defaultCountry).toBe("es");
    expect(cityFieldSetup([], "porto", "en", "es").defaultCountry).toBe("pt");
    expect(cityFieldSetup(["porto", "sevilla"], "sevilla", "pt")).toMatchObject({
      defaultCountry: "es",
      defaultSlugs: { pt: "porto", es: "sevilla" },
    });
  });
});

describe("French places", () => {
  it("covers every commune, with the department when a name repeats", () => {
    expect(placeBySlug("paris")).toMatchObject({ name: "Paris", area: "Paris", country: "fr" });
    expect(placeBySlug("marseille")).toMatchObject({ area: "Bouches-du-Rhône" });
    expect(placeBySlug("saint-denis-la-reunion")).toMatchObject({ name: "Saint-Denis", area: "La Réunion" });
    // Spanish and Portuguese slugs stay as they were.
    expect(placeBySlug("madrid")?.country).toBe("es");
    expect(placeBySlug("lisboa")?.country).toBe("pt");
  });

  it("finds big cities first, accents optional", () => {
    expect(searchPlaces("lyon", [], 30, "fr")[0].slug).toBe("lyon");
    expect(searchPlaces("nimes", [], 30, "fr")[0].name).toBe("Nîmes");
    expect(searchPlaces("saint-denis", [], 30, "fr")[0].area).toBe("La Réunion");
    expect(searchPlaces("paris", [], 30, "es")).toEqual([]);
  });

  it("starts with the biggest cities", () => {
    const options = cityOptions([], undefined, "fr");
    expect(options.length).toBe(120);
    expect(options.some((o) => o.slug === "bordeaux")).toBe(true);
  });

  it("uses Paris time, or the overseas department's own", () => {
    expect(placeTimezone("paris")).toBe("Europe/Paris");
    expect(placeTimezone("saint-denis-la-reunion")).toBe("Indian/Reunion");
    expect(placeTimezone("fort-de-france")).toBe("America/Martinique");
    expect(placeTimezone("ponta-delgada")).toBe("Atlantic/Azores");
  });

  it("starts French visitors in Paris", () => {
    expect(cityFieldSetup([], undefined, "fr")).toMatchObject({ defaultCountry: "fr", defaultSlugs: { fr: "paris" } });
    expect(phoneCountry("lyon")).toBe("FR");
  });
});

describe("Italian places", () => {
  it("covers every comune, with the province when a name repeats", () => {
    expect(placeBySlug("roma")).toMatchObject({ name: "Roma", area: "Roma", country: "it" });
    expect(placeBySlug("milano")?.country).toBe("it");
    expect(searchPlaces("bolzano", [], 30, "it")[0]).toMatchObject({ slug: "bolzano", area: "Bolzano/Bozen" });
    const castro = searchPlaces("castro", [], 30, "it").filter((p) => p.name === "Castro").map((p) => p.slug);
    expect(castro.length).toBe(2);
    expect(new Set(castro).size).toBe(2);
  });

  it("finds big cities first and uses Rome time", () => {
    expect(searchPlaces("napo", [], 30, "it")[0].slug).toBe("napoli");
    expect(placeTimezone("firenze")).toBe("Europe/Rome");
    expect(cityFieldSetup([], undefined, "it")).toMatchObject({ defaultCountry: "it", defaultSlugs: { it: "roma" } });
    expect(phoneCountry("torino")).toBe("IT");
  });
});

describe("German places", () => {
  it("covers every Gemeinde under the name people use", () => {
    expect(placeBySlug("berlin")).toMatchObject({ name: "Berlin", country: "de" });
    expect(placeBySlug("munchen")).toMatchObject({ name: "München" });
    expect(searchPlaces("frankfurt", [], 30, "de")[0].name).toBe("Frankfurt am Main");
    expect(searchPlaces("muenchen", [], 30, "de")[0].name).toBe("München");
    expect(searchPlaces("giessen", [], 30, "de")[0].name).toBe("Gießen");
    const hausen = searchPlaces("hausen", [], 50, "de").filter((p) => p.name === "Hausen").map((p) => p.slug);
    expect(hausen.length).toBeGreaterThan(1);
    expect(new Set(hausen).size).toBe(hausen.length);
  });

  it("uses Berlin time and starts German visitors in Berlin", () => {
    expect(placeTimezone("berlin")).toBe("Europe/Berlin");
    expect(cityFieldSetup([], undefined, "de")).toMatchObject({ defaultCountry: "de", defaultSlugs: { de: "berlin" } });
    expect(phoneCountry("hamburg")).toBe("DE");
  });
});

describe("Dutch places", () => {
  it("covers every gemeente under its official name", () => {
    expect(placeBySlug("amsterdam")).toMatchObject({ name: "Amsterdam", country: "nl", area: "Noord-Holland" });
    expect(searchPlaces("den haag", [], 30, "nl")[0].name).toBe("Den Haag");
    expect(searchPlaces("hertogenbosch", [], 30, "nl")[0].name).toBe("'s-Hertogenbosch");
    expect(searchPlaces("sudwest", [], 30, "nl")[0].name).toBe("Súdwest-Fryslân");
    const bergen = searchPlaces("bergen", [], 50, "nl").filter((p) => p.name === "Bergen").map((p) => p.slug);
    expect(bergen.length).toBe(2);
    expect(new Set(bergen).size).toBe(2);
  });

  it("uses Amsterdam time and starts Dutch visitors in Amsterdam", () => {
    expect(placeTimezone("rotterdam")).toBe("Europe/Amsterdam");
    expect(cityFieldSetup([], undefined, "nl")).toMatchObject({ defaultCountry: "nl", defaultSlugs: { nl: "amsterdam" } });
    expect(phoneCountry("utrecht")).toBe("NL");
  });
});

describe("Belgian places", () => {
  it("covers every municipality in its region's language, with the other name too", () => {
    expect(placeBySlug("bruxelles-brussel")).toMatchObject({ name: "Bruxelles/Brussel", country: "be" });
    expect(searchPlaces("anvers", [], 30, "be")[0].name).toBe("Antwerpen/Anvers");
    expect(searchPlaces("luik", [], 30, "be")[0].name).toBe("Liège/Luik");
    expect(searchPlaces("ixelles", [], 30, "be")[0].area).toBe("Bruxelles-Capitale/Brussel-Hoofdstad");
    expect(searchPlaces("sankt", [], 30, "be")[0].name).toBe("Sankt Vith/Saint-Vith");
    expect(searchPlaces("hasselt", [], 30, "be")[0].area).toBe("Limburg");
  });

  it("uses Brussels time and starts Belgian visitors in Brussels", () => {
    expect(placeTimezone("gent-gand")).toBe("Europe/Brussels");
    expect(cityFieldSetup([], undefined, "nl", "be")).toMatchObject({ defaultCountry: "be", defaultSlugs: { be: "bruxelles-brussel" } });
    expect(phoneCountry("charleroi")).toBe("BE");
  });
});

describe("Irish places", () => {
  it("lists towns by county under their English names", () => {
    expect(placeBySlug("dublin")).toMatchObject({ name: "Dublin", country: "ie", area: "Dublin" });
    expect(searchPlaces("mullingar", [], 30, "ie")[0]).toMatchObject({ name: "Mullingar", area: "Westmeath" });
    expect(searchPlaces("tallaght", [], 30, "ie")[0].area).toBe("Dublin");
    const ballina = searchPlaces("ballina", [], 30, "ie").filter((p) => p.name === "Ballina").map((p) => p.area);
    expect(ballina.sort()).toEqual(["Mayo", "Tipperary"]);
  });

  it("uses Dublin time and starts Irish visitors in Dublin", () => {
    expect(placeTimezone("cork")).toBe("Europe/Dublin");
    expect(cityFieldSetup([], undefined, "en", "ie")).toMatchObject({ defaultCountry: "ie", defaultSlugs: { ie: "dublin" } });
    expect(phoneCountry("galway")).toBe("IE");
  });
});
