import { describe, expect, it } from "vitest";
import { cityFieldSetup, cityName, cityOptions, fold, isPlace, placeBySlug, phoneCountry, placeTimezone, placesIn, searchPlaces } from "./cities";

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

describe("Finnish places", () => {
  it("lists GeoNames towns by region, with both names for Swedish-speaking towns", () => {
    expect(placeBySlug("helsinki")).toMatchObject({ name: "Helsinki", country: "fi", area: "Uusimaa" });
    expect(searchPlaces("jyvaskyla", [], 30, "fi")[0]).toMatchObject({ name: "Jyväskylä", area: "Keski-Suomi" });
    expect(searchPlaces("pietarsaari", [], 30, "fi")[0].name).toBe("Jakobstad/Pietarsaari");
    expect(searchPlaces("hyvinkaa", [], 30, "fi")[0].name).toBe("Hyvinkää");
  });

  it("uses Helsinki time and starts Finnish visitors in Helsinki", () => {
    expect(placeTimezone("tampere")).toBe("Europe/Helsinki");
    expect(cityFieldSetup([], undefined, "fi")).toMatchObject({ defaultCountry: "fi", defaultSlugs: { fi: "helsinki" } });
    expect(phoneCountry("turku")).toBe("FI");
  });
});

describe("Estonian places", () => {
  it("lists GeoNames towns by county", () => {
    expect(placeBySlug("tallinn")).toMatchObject({ name: "Tallinn", country: "ee", area: "Harjumaa" });
    expect(searchPlaces("tartu", [], 30, "ee")[0]).toMatchObject({ name: "Tartu", area: "Tartumaa" });
    expect(searchPlaces("parnu", [], 30, "ee")[0].name).toBe("Pärnu");
  });

  it("uses Tallinn time and starts Estonian visitors in Tallinn", () => {
    expect(placeTimezone("narva")).toBe("Europe/Tallinn");
    expect(cityFieldSetup([], undefined, "et")).toMatchObject({ defaultCountry: "ee", defaultSlugs: { ee: "tallinn" } });
    expect(phoneCountry("viljandi")).toBe("EE");
  });
});

describe("Latvian places", () => {
  it("lists GeoNames towns by historical region", () => {
    expect(placeBySlug("riga")).toMatchObject({ name: "Rīga", country: "lv", area: "Rīga" });
    expect(searchPlaces("liepaja", [], 30, "lv")[0]).toMatchObject({ name: "Liepāja", area: "Kurzeme" });
    expect(searchPlaces("daugavpils", [], 30, "lv")[0]).toMatchObject({ name: "Daugavpils", area: "Latgale" });
  });

  it("uses Riga time and starts Latvian visitors in Riga", () => {
    expect(placeTimezone("jelgava")).toBe("Europe/Riga");
    expect(cityFieldSetup([], undefined, "lv")).toMatchObject({ defaultCountry: "lv", defaultSlugs: { lv: "riga" } });
    expect(phoneCountry("valmiera")).toBe("LV");
  });
});

describe("Lithuanian places", () => {
  it("lists GeoNames towns by county", () => {
    expect(placeBySlug("vilnius")).toMatchObject({ name: "Vilnius", country: "lt", area: "Vilniaus apskritis" });
    expect(searchPlaces("klaipeda", [], 30, "lt")[0]).toMatchObject({ name: "Klaipėda", area: "Klaipėdos apskritis" });
    expect(searchPlaces("mazeikiai", [], 30, "lt")[0].name).toBe("Mažeikiai");
  });

  it("uses Vilnius time and starts Lithuanian visitors in Vilnius", () => {
    expect(placeTimezone("kaunas")).toBe("Europe/Vilnius");
    expect(cityFieldSetup([], undefined, "lt")).toMatchObject({ defaultCountry: "lt", defaultSlugs: { lt: "vilnius" } });
    expect(phoneCountry("siauliai")).toBe("LT");
  });
});

describe("Greek places", () => {
  it("lists GeoNames towns by region in ELOT 743", () => {
    expect(placeBySlug("athina")).toMatchObject({ name: "Athína", country: "gr", area: "Attikí" });
    expect(searchPlaces("chalandri", [], 30, "gr")[0]).toMatchObject({ name: "Chalándri", area: "Attikí" });
  });

  it("finds towns typed in Greek", () => {
    expect(fold("Θεσσαλονίκη")).toBe("thessaloniki");
    expect(fold("Λευκάδα")).toBe("lefkada");
    expect(fold("Αυλώνας")).toBe("avlonas");
    expect(searchPlaces("Ηράκλειο", [], 30, "gr").map((p) => p.area)).toContain("Kríti");
    expect(searchPlaces("Πειραιάς", [], 30, "gr")[0].name).toBe("Peiraiás");
  });

  it("uses Athens time and starts Greek visitors in Athens", () => {
    expect(placeTimezone("thessaloniki")).toBe("Europe/Athens");
    expect(cityFieldSetup([], undefined, "el")).toMatchObject({ defaultCountry: "gr", defaultSlugs: { gr: "athina" } });
    expect(phoneCountry("patra")).toBe("GR");
  });
});

describe("Cypriot places", () => {
  it("lists towns by district, findable in English and Greek", () => {
    expect(placeBySlug("lefkosia-nicosia")).toMatchObject({ country: "cy", area: "Lefkosía" });
    expect(searchPlaces("limassol", [], 30, "cy")[0].name).toBe("Lemesós/Limassol");
    expect(searchPlaces("Λεμεσός", [], 30, "cy")[0].name).toBe("Lemesós/Limassol");
    expect(searchPlaces("agia napa", [], 30, "cy")[0].area).toBe("Ammóchostos");
  });

  it("uses Nicosia time and +357 phones", () => {
    expect(placeTimezone("larnaka")).toBe("Asia/Nicosia");
    expect(phoneCountry("larnaka")).toBe("CY");
  });
});

describe("Maltese places", () => {
  it("lists local councils by island and finds them without Maltese letters", () => {
    expect(placeBySlug("valletta")).toMatchObject({ country: "mt", area: "Malta" });
    expect(searchPlaces("hamrun", [], 30, "mt")[0].name).toBe("Ħamrun");
    expect(searchPlaces("victoria", [], 30, "mt")[0]).toMatchObject({ name: "Rabat/Victoria", area: "Għawdex (Gozo)" });
    expect(placeBySlug("hamrun")?.name).toBe("Ħamrun");
  });

  it("uses Malta time and +356 phones", () => {
    expect(placeTimezone("sliema")).toBe("Europe/Malta");
    expect(phoneCountry("sliema")).toBe("MT");
  });
});

describe("Icelandic places", () => {
  it("lists GeoNames towns by region", () => {
    expect(placeBySlug("reykjavik")).toMatchObject({ name: "Reykjavík", country: "is", area: "Höfuðborgarsvæðið" });
    expect(searchPlaces("hafnarfjordur", [], 30, "is")[0].name).toBe("Hafnarfjörður");
    expect(searchPlaces("thorlakshofn", [], 30, "is")[0].name).toBe("Þorlákshöfn");
  });

  it("uses Reykjavik time and starts Icelandic visitors in Reykjavík", () => {
    expect(placeTimezone("akureyri")).toBe("Atlantic/Reykjavik");
    expect(cityFieldSetup([], undefined, "is")).toMatchObject({ defaultCountry: "is", defaultSlugs: { is: "reykjavik" } });
    expect(phoneCountry("akureyri")).toBe("IS");
  });
});

describe("Serbian places", () => {
  it("lists GeoNames towns in Vojvodina and Central Serbia", () => {
    expect(placeBySlug("beograd")).toMatchObject({ name: "Beograd", country: "rs", area: "Centralna Srbija" });
    expect(placeBySlug("novi-sad")).toMatchObject({ country: "rs", area: "Vojvodina" });
    expect(searchPlaces("cacak", [], 30, "rs")[0].name).toBe("Čačak");
  });

  it("finds Serbian towns typed in Cyrillic or with dj for đ", () => {
    expect(searchPlaces("Ниш", [], 30, "rs")[0].name).toBe("Niš");
    expect(searchPlaces("Чачак", [], 30, "rs")[0].name).toBe("Čačak");
    expect(searchPlaces("Аранђеловац", [], 30, "rs")[0].name).toBe("Aranđelovac");
    expect(searchPlaces("arandjelovac", [], 30, "rs")[0].name).toBe("Aranđelovac");
    expect(searchPlaces("София", [], 30, "bg")[0].name).toBe("Sofia");
  });

  it("uses Belgrade time and starts Serbian visitors in Beograd", () => {
    expect(placeTimezone("kragujevac")).toBe("Europe/Belgrade");
    expect(cityFieldSetup([], undefined, "sr")).toMatchObject({ defaultCountry: "rs", defaultSlugs: { rs: "beograd" } });
    expect(phoneCountry("kragujevac")).toBe("RS");
  });
});

describe("Bosnian places", () => {
  it("lists GeoNames towns by entity", () => {
    expect(placeBySlug("sarajevo")).toMatchObject({ name: "Sarajevo", country: "ba", area: "Federacija Bosne i Hercegovine" });
    expect(placeBySlug("banja-luka")).toMatchObject({ country: "ba", area: "Republika Srpska" });
    expect(searchPlaces("brcko", [], 30, "ba")[0]).toMatchObject({ name: "Brčko", area: "Brčko distrikt" });
    expect(searchPlaces("Бања Лука", [], 30, "ba")[0].name).toBe("Banja Luka");
  });

  it("uses Sarajevo time and starts in Sarajevo", () => {
    expect(placeTimezone("mostar")).toBe("Europe/Sarajevo");
    expect(cityFieldSetup([], undefined, "en", "ba")).toMatchObject({ defaultCountry: "ba", defaultSlugs: { ba: "sarajevo" } });
    expect(phoneCountry("mostar")).toBe("BA");
  });
});

describe("Montenegrin places", () => {
  it("lists GeoNames towns by municipality", () => {
    expect(placeBySlug("podgorica")).toMatchObject({ name: "Podgorica", country: "me", area: "Podgorica" });
    expect(searchPlaces("niksic", [], 30, "me")[0]).toMatchObject({ name: "Nikšić", area: "Nikšić" });
    expect(searchPlaces("Будва", [], 30, "me")[0].name).toBe("Budva");
  });

  it("uses Podgorica time and starts in Podgorica", () => {
    expect(placeTimezone("budva")).toBe("Europe/Podgorica");
    expect(cityFieldSetup([], undefined, "sr", "me")).toMatchObject({ defaultCountry: "me", defaultSlugs: { me: "podgorica" } });
    expect(phoneCountry("budva")).toBe("ME");
  });
});

describe("Macedonian places", () => {
  it("lists GeoNames towns by municipality in one Latin spelling", () => {
    expect(placeBySlug("skopje")).toMatchObject({ name: "Skopje", country: "mk", area: "Skopje" });
    expect(searchPlaces("stip", [], 30, "mk")[0]).toMatchObject({ name: "Štip", area: "Štip" });
    expect(searchPlaces("shtip", [], 30, "mk")[0].name).toBe("Štip");
    expect(searchPlaces("Штип", [], 30, "mk")[0].name).toBe("Štip");
    expect(searchPlaces("Ѓорче", [], 30, "mk")[0].name).toBe("Gjorče Petrov");
  });

  it("uses Skopje time and starts Macedonian visitors in Skopje", () => {
    expect(placeTimezone("ohrid")).toBe("Europe/Skopje");
    expect(cityFieldSetup([], undefined, "mk")).toMatchObject({ defaultCountry: "mk", defaultSlugs: { mk: "skopje" } });
    expect(phoneCountry("ohrid")).toBe("MK");
  });
});

describe("Albanian places", () => {
  it("lists GeoNames towns by county", () => {
    expect(placeBySlug("tirana")).toMatchObject({ name: "Tirana", country: "al", area: "Tiranë" });
    expect(searchPlaces("durres", [], 30, "al")[0]).toMatchObject({ name: "Durrës", area: "Durrës" });
    expect(searchPlaces("korce", [], 30, "al")[0].name).toBe("Korçë");
  });

  it("uses Tirana time and starts Albanian visitors in Tirana", () => {
    expect(placeTimezone("vlore")).toBe("Europe/Tirane");
    expect(cityFieldSetup([], undefined, "sq")).toMatchObject({ defaultCountry: "al", defaultSlugs: { al: "tirana" } });
    expect(phoneCountry("vlore")).toBe("AL");
  });
});

describe("Kosovo places", () => {
  it("lists GeoNames towns by district under both official names", () => {
    expect(placeBySlug("prishtine-pristina")).toMatchObject({ name: "Prishtinë/Priština", country: "xk", area: "Prishtinë/Priština" });
    expect(searchPlaces("pristina", [], 30, "xk")[0].name).toBe("Prishtinë/Priština");
    expect(searchPlaces("prishtine", [], 30, "xk")[0].name).toBe("Prishtinë/Priština");
    expect(searchPlaces("pec", [], 30, "xk")[0].name).toBe("Pejë/Peć");
  });

  it("uses Belgrade time and starts in Prishtinë", () => {
    expect(placeTimezone("prizren")).toBe("Europe/Belgrade");
    expect(cityFieldSetup([], undefined, "sq", "xk")).toMatchObject({ defaultCountry: "xk", defaultSlugs: { xk: "prishtine-pristina" } });
    expect(phoneCountry("prizren")).toBe("XK");
  });
});

describe("Moldovan places", () => {
  it("lists GeoNames towns by district with Romanian comma-below letters", () => {
    expect(placeBySlug("chisinau")).toMatchObject({ name: "Chișinău", country: "md", area: "Municipiul Chișinău" });
    expect(searchPlaces("balti", [], 30, "md")[0]).toMatchObject({ name: "Bălți", area: "Municipiul Bălți" });
    expect(searchPlaces("comrat", [], 30, "md")[0].area).toBe("UTA Găgăuzia");
  });

  it("uses Chisinau time and starts in Chișinău", () => {
    expect(placeTimezone("cahul")).toBe("Europe/Chisinau");
    expect(cityFieldSetup([], undefined, "ro", "md")).toMatchObject({ defaultCountry: "md", defaultSlugs: { md: "chisinau" } });
    expect(phoneCountry("cahul")).toBe("MD");
  });
});

describe("Ukrainian places", () => {
  it("lists GeoNames towns by oblast in the national Latin spelling", () => {
    expect(placeBySlug("kyiv")).toMatchObject({ name: "Kyiv", country: "ua", area: "Kyiv" });
    expect(searchPlaces("odesa", [], 30, "ua")[0]).toMatchObject({ name: "Odesa", area: "Odeska oblast" });
    expect(searchPlaces("kramatorsk", [], 30, "ua")[0].name).toBe("Kramatorsk");
    expect(searchPlaces("makiivka", [], 30, "ua")[0].name).toBe("Makiivka");
  });

  it("finds Ukrainian towns typed in Cyrillic", () => {
    expect(searchPlaces("Харків", [], 30, "ua")[0].name).toBe("Kharkiv");
    expect(searchPlaces("Запоріжжя", [], 30, "ua")[0].name).toBe("Zaporizhzhia");
    expect(searchPlaces("Львів", [], 30, "ua")[0].name).toBe("Lviv");
    expect(searchPlaces("Івано-Франківськ", [], 30, "ua")[0].name).toBe("Ivano-Frankivsk");
  });

  it("uses Kyiv time and starts Ukrainian visitors in Kyiv", () => {
    expect(placeTimezone("lviv")).toBe("Europe/Kyiv");
    expect(cityFieldSetup([], undefined, "uk")).toMatchObject({ defaultCountry: "ua", defaultSlugs: { ua: "kyiv" } });
    expect(phoneCountry("lviv")).toBe("UA");
  });
});

describe("Andorran places", () => {
  it("lists towns by parish and starts in Andorra la Vella", () => {
    expect(placeBySlug("andorra-la-vella")).toMatchObject({ name: "Andorra la Vella", country: "ad", area: "Andorra la Vella" });
    expect(searchPlaces("escaldes", [], 30, "ad")[0].name).toBe("Escaldes-Engordany");
    expect(placeTimezone("andorra-la-vella")).toBe("Europe/Andorra");
    expect(cityFieldSetup([], undefined, "es", "ad")).toMatchObject({ defaultCountry: "ad", defaultSlugs: { ad: "andorra-la-vella" } });
    expect(phoneCountry("andorra-la-vella")).toBe("AD");
  });
});

describe("Monegasque places", () => {
  it("lists the quarters and starts in Monaco", () => {
    expect(placeBySlug("monaco")).toMatchObject({ name: "Monaco", country: "mc", area: "Monaco" });
    expect(searchPlaces("monte", [], 30, "mc")[0].name).toBe("Monte-Carlo");
    expect(placeTimezone("monaco")).toBe("Europe/Monaco");
    expect(cityFieldSetup([], undefined, "fr", "mc")).toMatchObject({ defaultCountry: "mc", defaultSlugs: { mc: "monaco" } });
    expect(phoneCountry("monaco")).toBe("MC");
  });
});

describe("San Marino places", () => {
  it("lists towns by castello and starts in San Marino", () => {
    expect(placeBySlug("san-marino")).toMatchObject({ name: "San Marino", country: "sm", area: "Città di San Marino" });
    expect(searchPlaces("serravalle", [], 30, "sm")[0].name).toBe("Serravalle");
    expect(placeTimezone("san-marino")).toBe("Europe/San_Marino");
    expect(cityFieldSetup([], undefined, "it", "sm")).toMatchObject({ defaultCountry: "sm", defaultSlugs: { sm: "san-marino" } });
    expect(phoneCountry("san-marino")).toBe("SM");
  });
});

describe("Liechtenstein places", () => {
  it("lists the municipalities and starts in Vaduz", () => {
    expect(placeBySlug("vaduz")).toMatchObject({ name: "Vaduz", country: "li", area: "Vaduz" });
    expect(searchPlaces("schaan", [], 30, "li")[0].name).toBe("Schaan");
    expect(placeTimezone("vaduz")).toBe("Europe/Vaduz");
    expect(cityFieldSetup([], undefined, "de", "li")).toMatchObject({ defaultCountry: "li", defaultSlugs: { li: "vaduz" } });
    expect(phoneCountry("vaduz")).toBe("LI");
  });
});

describe("United Kingdom places", () => {
  it("lists GeoNames towns by nation and starts in London", () => {
    expect(placeBySlug("london")).toMatchObject({ name: "London", country: "gb", area: "England" });
    expect(searchPlaces("edinburgh", [], 30, "gb")[0]).toMatchObject({ name: "Edinburgh", area: "Scotland" });
    expect(searchPlaces("belfast", [], 30, "gb")[0].area).toBe("Northern Ireland");
    expect(placeTimezone("cardiff")).toBe("Europe/London");
    expect(cityFieldSetup([], undefined, "en", "gb")).toMatchObject({ defaultCountry: "gb", defaultSlugs: { gb: "london" } });
    expect(phoneCountry("cardiff")).toBe("GB");
  });
});
