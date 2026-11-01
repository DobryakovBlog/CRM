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
    expect(cityFieldSetup([], undefined, "es", "us").defaultCountry).toBe("es");
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

describe("Luxembourg places", () => {
  it("lists today's 100 communes by canton", () => {
    expect(placeBySlug("luxembourg")).toMatchObject({ name: "Luxembourg", country: "lu", area: "Luxembourg" });
    expect(searchPlaces("esch", [], 30, "lu")[0].name).toBe("Esch-sur-Alzette");
    expect(searchPlaces("rosport", [], 30, "lu").map((p) => p.name)).toEqual(["Rosport-Mompach"]);
    expect(searchPlaces("ernz", [], 30, "lu")[0].name).toBe("Vallée de l'Ernz");
  });

  it("uses Luxembourg time and starts visitors from Luxembourg in the capital", () => {
    expect(placeTimezone("differdange")).toBe("Europe/Luxembourg");
    expect(cityFieldSetup([], undefined, "fr", "lu")).toMatchObject({ defaultCountry: "lu", defaultSlugs: { lu: "luxembourg" } });
    expect(phoneCountry("dudelange")).toBe("LU");
  });
});

describe("Austrian places", () => {
  it("lists GeoNames towns by Bundesland under their local names", () => {
    expect(placeBySlug("wien")).toMatchObject({ name: "Wien", country: "at", area: "Wien" });
    expect(searchPlaces("graz", [], 30, "at")[0]).toMatchObject({ name: "Graz", area: "Steiermark" });
    expect(searchPlaces("klagenfurt", [], 30, "at")[0].area).toBe("Kärnten");
    expect(searchPlaces("woergl", [], 30, "at")[0].name).toBe("Wörgl");
    expect(cityOptions([], undefined, "at").map((o) => o.slug)).toContain("favoriten");
  });

  it("uses Vienna time and starts Austrian visitors in Vienna", () => {
    expect(placeTimezone("innsbruck")).toBe("Europe/Vienna");
    expect(cityFieldSetup([], undefined, "de", "at")).toMatchObject({ defaultCountry: "at", defaultSlugs: { at: "wien" } });
    expect(phoneCountry("linz")).toBe("AT");
  });
});

describe("Swiss places", () => {
  it("lists GeoNames towns by canton under their local names", () => {
    expect(placeBySlug("zurich")).toMatchObject({ name: "Zürich", country: "ch", area: "Zürich" });
    expect(searchPlaces("geneve", [], 30, "ch")[0]).toMatchObject({ name: "Genève", area: "Genève" });
    expect(searchPlaces("sion", [], 30, "ch")[0]).toMatchObject({ name: "Sion", area: "Valais" });
    expect(searchPlaces("lugano", [], 30, "ch")[0].area).toBe("Ticino");
  });

  it("uses Zurich time and starts Swiss visitors in Zurich", () => {
    expect(placeTimezone("lausanne")).toBe("Europe/Zurich");
    expect(cityFieldSetup([], undefined, "fr", "ch")).toMatchObject({ defaultCountry: "ch", defaultSlugs: { ch: "zurich" } });
    expect(phoneCountry("bern")).toBe("CH");
  });
});

describe("Polish places", () => {
  it("lists GeoNames towns by voivodeship under their Polish names", () => {
    expect(placeBySlug("warszawa")).toMatchObject({ name: "Warszawa", country: "pl", area: "Mazowieckie" });
    expect(searchPlaces("krakow", [], 30, "pl")[0]).toMatchObject({ name: "Kraków", area: "Małopolskie" });
    expect(searchPlaces("bielsko", [], 30, "pl")[0].name).toBe("Bielsko-Biała");
  });

  it("uses Warsaw time and starts Polish visitors in Warsaw", () => {
    expect(placeTimezone("gdansk")).toBe("Europe/Warsaw");
    expect(cityFieldSetup([], undefined, "pl")).toMatchObject({ defaultCountry: "pl", defaultSlugs: { pl: "warszawa" } });
    expect(phoneCountry("poznan")).toBe("PL");
  });
});

describe("Czech places", () => {
  it("lists GeoNames towns by region under their Czech names", () => {
    expect(placeBySlug("praha")).toMatchObject({ name: "Praha", country: "cz", area: "Hlavní město Praha" });
    expect(searchPlaces("plzen", [], 30, "cz")[0]).toMatchObject({ name: "Plzeň", area: "Plzeňský kraj" });
    expect(searchPlaces("usti nad labem", [], 30, "cz")[0].name).toBe("Ústí nad Labem");
  });

  it("uses Prague time and starts Czech visitors in Prague", () => {
    expect(placeTimezone("brno")).toBe("Europe/Prague");
    expect(cityFieldSetup([], undefined, "cs")).toMatchObject({ defaultCountry: "cz", defaultSlugs: { cz: "praha" } });
    expect(phoneCountry("ostrava")).toBe("CZ");
  });
});

describe("Slovak places", () => {
  it("lists GeoNames towns by region", () => {
    expect(placeBySlug("bratislava")).toMatchObject({ name: "Bratislava", country: "sk", area: "Bratislavský kraj" });
    expect(searchPlaces("kosice", [], 30, "sk")[0]).toMatchObject({ name: "Košice", area: "Košický kraj" });
    expect(searchPlaces("zilina", [], 30, "sk")[0].name).toBe("Žilina");
  });

  it("uses Bratislava time and starts Slovak visitors in Bratislava", () => {
    expect(placeTimezone("nitra")).toBe("Europe/Bratislava");
    expect(cityFieldSetup([], undefined, "sk")).toMatchObject({ defaultCountry: "sk", defaultSlugs: { sk: "bratislava" } });
    expect(phoneCountry("presov")).toBe("SK");
  });
});

describe("Hungarian places", () => {
  it("lists GeoNames towns by county", () => {
    expect(placeBySlug("budapest")).toMatchObject({ name: "Budapest", country: "hu", area: "Budapest" });
    expect(searchPlaces("szekesfehervar", [], 30, "hu")[0]).toMatchObject({ name: "Székesfehérvár", area: "Fejér" });
    expect(searchPlaces("gyor", [], 30, "hu")[0].name).toBe("Győr");
  });

  it("uses Budapest time and starts Hungarian visitors in Budapest", () => {
    expect(placeTimezone("debrecen")).toBe("Europe/Budapest");
    expect(cityFieldSetup([], undefined, "hu")).toMatchObject({ defaultCountry: "hu", defaultSlugs: { hu: "budapest" } });
    expect(phoneCountry("szeged")).toBe("HU");
  });
});

describe("Slovenian places", () => {
  it("lists GeoNames towns by municipality", () => {
    expect(placeBySlug("ljubljana")).toMatchObject({ name: "Ljubljana", country: "si", area: "Ljubljana" });
    expect(searchPlaces("sentjur", [], 30, "si")[0]).toMatchObject({ name: "Šentjur", area: "Šentjur" });
    expect(searchPlaces("novo mesto", [], 30, "si")[0].name).toBe("Novo mesto");
  });

  it("uses Ljubljana time and starts Slovenian visitors in Ljubljana", () => {
    expect(placeTimezone("maribor")).toBe("Europe/Ljubljana");
    expect(cityFieldSetup([], undefined, "sl")).toMatchObject({ defaultCountry: "si", defaultSlugs: { si: "ljubljana" } });
    expect(phoneCountry("celje")).toBe("SI");
  });
});

describe("Croatian places", () => {
  it("lists GeoNames towns by county", () => {
    expect(placeBySlug("zagreb")).toMatchObject({ name: "Zagreb", country: "hr", area: "Grad Zagreb" });
    expect(searchPlaces("split", [], 30, "hr")[0]).toMatchObject({ name: "Split", area: "Splitsko-dalmatinska" });
    expect(searchPlaces("cakovec", [], 30, "hr")[0].name).toBe("Čakovec");
  });

  it("uses Zagreb time and starts Croatian visitors in Zagreb", () => {
    expect(placeTimezone("rijeka")).toBe("Europe/Zagreb");
    expect(cityFieldSetup([], undefined, "hr")).toMatchObject({ defaultCountry: "hr", defaultSlugs: { hr: "zagreb" } });
    expect(phoneCountry("osijek")).toBe("HR");
  });
});

describe("Romanian places", () => {
  it("lists GeoNames towns by county with comma-below letters", () => {
    expect(placeBySlug("bucuresti")).toMatchObject({ name: "București", country: "ro", area: "București" });
    expect(searchPlaces("cluj", [], 30, "ro")[0]).toMatchObject({ name: "Cluj-Napoca", area: "Cluj" });
    expect(searchPlaces("timisoara", [], 30, "ro")[0].name).toBe("Timișoara");
  });

  it("uses Bucharest time and starts Romanian visitors in Bucharest", () => {
    expect(placeTimezone("iasi")).toBe("Europe/Bucharest");
    expect(cityFieldSetup([], undefined, "ro")).toMatchObject({ defaultCountry: "ro", defaultSlugs: { ro: "bucuresti" } });
    expect(phoneCountry("constanta")).toBe("RO");
  });
});

describe("Bulgarian places", () => {
  it("lists GeoNames towns by province and finds them from Cyrillic", () => {
    expect(placeBySlug("sofia")).toMatchObject({ name: "Sofia", country: "bg", area: "Sofia-grad" });
    expect(searchPlaces("софия", [], 30, "bg")[0].name).toBe("Sofia");
    expect(searchPlaces("търново", [], 30, "bg")[0].name).toBe("Veliko Tarnovo");
    expect(searchPlaces("пловдив", [], 30, "bg")[0]).toMatchObject({ name: "Plovdiv", area: "Plovdiv" });
  });

  it("uses Sofia time and starts Bulgarian visitors in Sofia", () => {
    expect(placeTimezone("plovdiv")).toBe("Europe/Sofia");
    expect(cityFieldSetup([], undefined, "bg")).toMatchObject({ defaultCountry: "bg", defaultSlugs: { bg: "sofia" } });
    expect(phoneCountry("burgas")).toBe("BG");
  });
});

describe("Danish places", () => {
  it("lists GeoNames towns by region under their Danish names", () => {
    expect(placeBySlug("kobenhavn")).toMatchObject({ name: "København", country: "dk", area: "Region Hovedstaden" });
    expect(searchPlaces("aarhus", [], 30, "dk")[0]).toMatchObject({ name: "Aarhus", area: "Region Midtjylland" });
    expect(searchPlaces("koge", [], 30, "dk")[0].name).toBe("Køge");
    expect(searchPlaces("køge", [], 30, "dk")[0].name).toBe("Køge");
  });

  it("uses Copenhagen time and starts Danish visitors in Copenhagen", () => {
    expect(placeTimezone("odense")).toBe("Europe/Copenhagen");
    expect(cityFieldSetup([], undefined, "da")).toMatchObject({ defaultCountry: "dk", defaultSlugs: { dk: "kobenhavn" } });
    expect(phoneCountry("aalborg")).toBe("DK");
  });
});

describe("Swedish places", () => {
  it("lists GeoNames towns by county", () => {
    expect(placeBySlug("stockholm")).toMatchObject({ name: "Stockholm", country: "se", area: "Stockholms län" });
    expect(searchPlaces("goteborg", [], 30, "se")[0]).toMatchObject({ name: "Göteborg", area: "Västra Götalands län" });
    expect(searchPlaces("malmo", [], 30, "se")[0].name).toBe("Malmö");
  });

  it("uses Stockholm time and starts Swedish visitors in Stockholm", () => {
    expect(placeTimezone("uppsala")).toBe("Europe/Stockholm");
    expect(cityFieldSetup([], undefined, "sv")).toMatchObject({ defaultCountry: "se", defaultSlugs: { se: "stockholm" } });
    expect(phoneCountry("orebro")).toBe("SE");
  });
});

describe("Norwegian places", () => {
  it("lists GeoNames towns by part of the country", () => {
    // German Osloß already has the slug "oslo".
    expect(placeBySlug("oslo-oslo")).toMatchObject({ name: "Oslo", country: "no", area: "Oslo" });
    expect(searchPlaces("bergen", [], 30, "no")[0]).toMatchObject({ name: "Bergen", area: "Vestlandet" });
    expect(searchPlaces("tromso", [], 30, "no")[0]).toMatchObject({ name: "Tromsø", area: "Nord-Norge" });
  });

  it("uses Oslo time and starts Norwegian visitors in Oslo", () => {
    expect(placeTimezone("trondheim")).toBe("Europe/Oslo");
    expect(cityFieldSetup([], undefined, "nb")).toMatchObject({ defaultCountry: "no", defaultSlugs: { no: "oslo-oslo" } });
    expect(phoneCountry("stavanger")).toBe("NO");
  });
});
