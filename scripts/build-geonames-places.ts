// Builds src/data/<cc>-places.json for a country without an official municipality list we can
// fetch: every GeoNames town of 1,000+ people, grouped by region, ordered by population.
// Sources: the npm packages all-the-cities 3.1.0 (cities.pbf: name, region code, population) and
// cities.json (admin1.json: region names). Big cities carry their English name in GeoNames, so
// NAMES gives them back their local one; REGIONS gives the regions their local name. A country whose
// GeoNames regions are already its municipalities with local names (Slovenia) uses "admin1" instead:
// the GeoNames names with "Municipality of" dropped, fixed where GeoNames lost a diacritic.
// Usage:
//   npm pack all-the-cities@3.1.0 cities.json && tar xzf all-the-cities-*.tgz && mkdir cj && tar xzf cities.json-*.tgz -C cj
//   npx tsx scripts/build-geonames-places.ts at package cj/package
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// commaBelow: GeoNames often spells Romanian ș/ț with a cedilla (ş/ţ); the builder writes the correct letters.
// byName: the region of each town by its GeoNames name, for a country whose GeoNames region codes are a tangle of old
// and new municipalities (Latvia); every town must be listed.
type Config = {
  regions: Record<string, string> | "admin1";
  regionFixes?: Record<string, string>;
  names?: Record<string, string>;
  commaBelow?: boolean;
  byName?: Record<string, string>;
  respell?: (name: string) => string;
};

// Greek GeoNames names mix the old BGN romanisation (Áyios, Khalándrion, Galaxídhion) with the modern ELOT 743 one
// used on Greek road signs (Ágios, Chalándri). The builder turns the old one into the modern one, so a Greek query
// transliterated by fold() finds them; NAMES covers the towns these rules get wrong and the English names.
const greekRespell = (name: string) =>
  name
    .replace(/Kh/g, "Ch").replace(/kh/g, "ch").replace(/Dh/g, "D").replace(/dh/g, "d")
    .replace(/Aghi/g, "Ági").replace(/y(?=[iíeé])/g, "g").replace(/Y(?=[iíeé])/g, "G")
    .replace(/\bNéon\b/g, "Néo").replace(/ion\b/g, "i");
const COUNTRIES: Record<string, Config> = {
  at: {
    regions: {
      "01": "Burgenland", "02": "Kärnten", "03": "Niederösterreich", "04": "Oberösterreich",
      "05": "Salzburg", "06": "Steiermark", "07": "Tirol", "08": "Vorarlberg", "09": "Wien",
    },
    names: { Vienna: "Wien" },
  },
  ch: {
    regions: {
      AG: "Aargau", AI: "Appenzell Innerrhoden", AR: "Appenzell Ausserrhoden", BE: "Bern", BL: "Basel-Landschaft",
      BS: "Basel-Stadt", FR: "Fribourg", GE: "Genève", GL: "Glarus", GR: "Graubünden", JU: "Jura", LU: "Luzern",
      NE: "Neuchâtel", NW: "Nidwalden", OW: "Obwalden", SG: "St. Gallen", SH: "Schaffhausen", SO: "Solothurn",
      SZ: "Schwyz", TG: "Thurgau", TI: "Ticino", UR: "Uri", VD: "Vaud", VS: "Valais", ZG: "Zug", ZH: "Zürich",
    },
    names: { Sitten: "Sion", "Sankt Gallen": "St. Gallen" },
  },
  pl: {
    regions: {
      "72": "Dolnośląskie", "73": "Kujawsko-Pomorskie", "74": "Łódzkie", "75": "Lubelskie", "76": "Lubuskie",
      "77": "Małopolskie", "78": "Mazowieckie", "79": "Opolskie", "80": "Podkarpackie", "81": "Podlaskie",
      "82": "Pomorskie", "83": "Śląskie", "84": "Świętokrzyskie", "85": "Warmińsko-Mazurskie", "86": "Wielkopolskie",
      "87": "Zachodniopomorskie",
    },
    names: { Warsaw: "Warszawa", "Bielsko-Biala": "Bielsko-Biała" },
  },
  cz: {
    regions: {
      "52": "Hlavní město Praha", "78": "Jihomoravský kraj", "79": "Jihočeský kraj", "80": "Kraj Vysočina",
      "81": "Karlovarský kraj", "82": "Královéhradecký kraj", "83": "Liberecký kraj", "84": "Olomoucký kraj",
      "85": "Moravskoslezský kraj", "86": "Pardubický kraj", "87": "Plzeňský kraj", "88": "Středočeský kraj",
      "89": "Ústecký kraj", "90": "Zlínský kraj",
    },
    names: { Prague: "Praha", Pilsen: "Plzeň", Vysehrad: "Vyšehrad" },
  },
  hr: {
    regions: {
      "01": "Bjelovarsko-bilogorska", "02": "Brodsko-posavska", "03": "Dubrovačko-neretvanska", "04": "Istarska",
      "05": "Karlovačka", "06": "Koprivničko-križevačka", "07": "Krapinsko-zagorska", "08": "Ličko-senjska",
      "09": "Međimurska", "10": "Osječko-baranjska", "11": "Požeško-slavonska", "12": "Primorsko-goranska",
      "13": "Šibensko-kninska", "14": "Sisačko-moslavačka", "15": "Splitsko-dalmatinska", "16": "Varaždinska",
      "17": "Virovitičko-podravska", "18": "Vukovarsko-srijemska", "19": "Zadarska", "20": "Zagrebačka", "21": "Grad Zagreb",
    },
    names: { "Biograd na Moru": "Biograd na moru" },
  },
  ro: {
    regions: {
      "01": "Alba", "02": "Arad", "03": "Argeș", "04": "Bacău", "05": "Bihor", "06": "Bistrița-Năsăud", "07": "Botoșani",
      "08": "Brăila", "09": "Brașov", "10": "București", "11": "Buzău", "12": "Caraș-Severin", "13": "Cluj", "14": "Constanța",
      "15": "Covasna", "16": "Dâmbovița", "17": "Dolj", "18": "Galați", "19": "Gorj", "20": "Harghita", "21": "Hunedoara",
      "22": "Ialomița", "23": "Iași", "25": "Maramureș", "26": "Mehedinți", "27": "Mureș", "28": "Neamț", "29": "Olt",
      "30": "Prahova", "31": "Sălaj", "32": "Satu Mare", "33": "Sibiu", "34": "Suceava", "35": "Teleorman", "36": "Timiș",
      "37": "Tulcea", "38": "Vaslui", "39": "Vâlcea", "40": "Vrancea", "41": "Călărași", "42": "Giurgiu", "43": "Ilfov",
    },
    names: { Bucharest: "București" },
    commaBelow: true,
  },
  bg: {
    // Official Latin spellings (Bulgarian search folds Cyrillic queries to them).
    regions: {
      "38": "Blagoevgrad", "39": "Burgas", "40": "Dobrich", "41": "Gabrovo", "42": "Sofia-grad", "43": "Haskovo",
      "44": "Kardzhali", "45": "Kyustendil", "46": "Lovech", "47": "Montana", "48": "Pazardzhik", "49": "Pernik",
      "50": "Pleven", "51": "Plovdiv", "52": "Razgrad", "53": "Ruse", "54": "Shumen", "55": "Silistra", "56": "Sliven",
      "57": "Smolyan", "58": "Sofia oblast", "59": "Stara Zagora", "60": "Targovishte", "61": "Varna",
      "62": "Veliko Tarnovo", "63": "Vidin", "64": "Vratsa", "65": "Yambol",
    },
    names: { "Veliko Tŭrnovo": "Veliko Tarnovo", "Gŭlŭbovo": "Galabovo" },
  },
  dk: {
    regions: { "17": "Region Hovedstaden", "18": "Region Midtjylland", "19": "Region Nordjylland", "20": "Region Sjælland", "21": "Region Syddanmark" },
    names: { Copenhagen: "København", Århus: "Aarhus" },
  },
  se: {
    regions: {
      "02": "Blekinge län", "03": "Gävleborgs län", "05": "Gotlands län", "06": "Hallands län", "07": "Jämtlands län",
      "08": "Jönköpings län", "09": "Kalmar län", "10": "Dalarnas län", "12": "Kronobergs län", "14": "Norrbottens län",
      "15": "Örebro län", "16": "Östergötlands län", "18": "Södermanlands län", "21": "Uppsala län", "22": "Värmlands län",
      "23": "Västerbottens län", "24": "Västernorrlands län", "25": "Västmanlands län", "26": "Stockholms län",
      "27": "Skåne län", "28": "Västra Götalands län",
    },
  },
  no: {
    // all-the-cities still has the 2020–2023 counties (Viken, Vestfold og Telemark, Troms og Finnmark), split up again in
    // 2024, so towns are grouped by the five traditional parts of the country instead, with Oslo on its own.
    regions: {
      "12": "Oslo", "01": "Østlandet", "04": "Østlandet", "13": "Østlandet", "17": "Østlandet", "20": "Østlandet",
      "30": "Østlandet", "34": "Østlandet", "38": "Østlandet", "42": "Sørlandet", "08": "Vestlandet", "14": "Vestlandet",
      "46": "Vestlandet", "21": "Trøndelag", "05": "Nord-Norge", "09": "Nord-Norge", "18": "Nord-Norge", "54": "Nord-Norge",
    },
  },
  fi: {
    regions: {
      "01": "Uusimaa", "02": "Varsinais-Suomi", "04": "Satakunta", "05": "Kanta-Häme", "06": "Pirkanmaa", "07": "Päijät-Häme",
      "08": "Kymenlaakso", "09": "Etelä-Karjala", "10": "Etelä-Savo", "11": "Pohjois-Savo", "12": "Pohjois-Karjala",
      "13": "Keski-Suomi", "14": "Etelä-Pohjanmaa", "15": "Pohjanmaa", "16": "Keski-Pohjanmaa", "17": "Pohjois-Pohjanmaa",
      "18": "Kainuu", "19": "Lappi",
    },
    // GeoNames gives some towns only their Swedish name: Finnish-majority towns get the Finnish one, Swedish-majority
    // towns both, so either finds them.
    names: {
      Hyvinge: "Hyvinkää", Lovisa: "Loviisa", Jakobstad: "Jakobstad/Pietarsaari", Korsholm: "Korsholm/Mustasaari",
      Kristinestad: "Kristinestad/Kristiinankaupunki", Ekenäs: "Ekenäs/Tammisaari", Karis: "Karis/Karjaa", Ingå: "Ingå/Inkoo",
      Nykarleby: "Nykarleby/Uusikaarlepyy", Kronoby: "Kronoby/Kruunupyy", Vörå: "Vörå/Vöyri", Pernå: "Pernå/Pernaja",
    },
  },
  ee: {
    regions: {
      "01": "Harjumaa", "02": "Hiiumaa", "03": "Ida-Virumaa", "04": "Järvamaa", "05": "Jõgevamaa", "07": "Läänemaa",
      "08": "Lääne-Virumaa", "11": "Pärnumaa", "12": "Põlvamaa", "13": "Raplamaa", "14": "Saaremaa", "18": "Tartumaa",
      "19": "Valgamaa", "20": "Viljandimaa", "21": "Võrumaa",
    },
  },
  lv: {
    regions: {},
    names: { Riga: "Rīga", Bolderaja: "Bolderāja" },
    byName: {
      // Rīga
      Riga: "Rīga", Bolderaja: "Rīga", "Berģi": "Rīga", "Daugavgrīva": "Rīga", Jaunciems: "Rīga", "Mežaparks": "Rīga",
      // Pierīga
      "Ādaži": "Pierīga", "Baloži": "Pierīga", Baldone: "Pierīga", Carnikava: "Pierīga", Garkalne: "Pierīga", "Ikšķile": "Pierīga", "Inčukalns": "Pierīga", "Jūrmala": "Pierīga", "Ķekava": "Pierīga", "Ķegums": "Pierīga", "Lielvārde": "Pierīga", Jumprava: "Pierīga", Loja: "Pierīga", "Mālpils": "Pierīga", "Mārupe": "Pierīga", Ogre: "Pierīga", Olaine: "Pierīga", "Piņķi": "Pierīga", Ragana: "Pierīga", "Ropaži": "Pierīga", Salaspils: "Pierīga", Saulkrasti: "Pierīga", Sigulda: "Pierīga", "Tīreļi": "Pierīga", Ulbroka: "Pierīga", "Vangaži": "Pierīga",
      // Kurzeme
      Aizpute: "Kurzeme", Alsunga: "Kurzeme", "Brocēni": "Kurzeme", Dundaga: "Kurzeme", Engure: "Kurzeme", "Grobiņa": "Kurzeme", Jaunpils: "Kurzeme", Kandava: "Kurzeme", Karosta: "Kurzeme", "Kuldīga": "Kurzeme", "Liepāja": "Kurzeme", "Lieģi": "Kurzeme", "Mērsrags": "Kurzeme", "Nīca": "Kurzeme", "Pāvilosta": "Kurzeme", Piltene: "Kurzeme", Priekule: "Kurzeme", Roja: "Kurzeme", Rucava: "Kurzeme", Sabile: "Kurzeme", Saldus: "Kurzeme", Skrunda: "Kurzeme", "Smārde": "Kurzeme", Stende: "Kurzeme", Talsi: "Kurzeme", Tukums: "Kurzeme", "Vaiņode": "Kurzeme", "Valdemārpils": "Kurzeme", Ventspils: "Kurzeme",
      // Zemgale
      Aizkraukle: "Zemgale", "Aknīste": "Zemgale", Auce: "Zemgale", Bauska: "Zemgale", Dobele: "Zemgale", Iecava: "Zemgale", Jaunjelgava: "Zemgale", Jelgava: "Zemgale", "Jēkabpils": "Zemgale", Krustpils: "Zemgale", Koknese: "Zemgale", Nereta: "Zemgale", Ozolnieki: "Zemgale", "Pilsrundāle": "Zemgale", "Pļaviņas": "Zemgale", Sala: "Zemgale", "Skrīveri": "Zemgale", "Tērvete": "Zemgale", Vecumnieki: "Zemgale", "Viesīte": "Zemgale", "Zelmeņi": "Zemgale",
      // Vidzeme
      "Ainaži": "Vidzeme", Aloja: "Vidzeme", "Alūksne": "Vidzeme", Ape: "Vidzeme", Cesvaine: "Vidzeme", "Cēsis": "Vidzeme", "Drabeši": "Vidzeme", "Ērgļi": "Vidzeme", Gulbene: "Vidzeme", Jaunpiebalga: "Vidzeme", "Kocēni": "Vidzeme", "Limbaži": "Vidzeme", "Līgatne": "Vidzeme", "Lubāna": "Vidzeme", Madona: "Vidzeme", "Matīši": "Vidzeme", Mazsalaca: "Vidzeme", "Mūrmuiža": "Vidzeme", "Naukšēni": "Vidzeme", "Priekuļi": "Vidzeme", Rauna: "Vidzeme", "Rūjiena": "Vidzeme", "Salacgrīva": "Vidzeme", Seda: "Vidzeme", Smiltene: "Vidzeme", Staicele: "Vidzeme", Stalbe: "Vidzeme", "Strenči": "Vidzeme", Valka: "Vidzeme", Valmiera: "Vidzeme", Vecpiebalga: "Vidzeme",
      // Latgale
      Aglona: "Latgale", Balvi: "Latgale", Baltinava: "Latgale", Cibla: "Latgale", Dagda: "Latgale", Daugavpils: "Latgale", "Ilūkste": "Latgale", Jaunaglona: "Latgale", "Kārsava": "Latgale", "Krāslava": "Latgale", "Līvāni": "Latgale", Ludza: "Latgale", "Preiļi": "Latgale", "Rēzekne": "Latgale", "Riebiņi": "Latgale", "Rugāji": "Latgale", "Varakļāni": "Latgale", "Vecvārkava": "Latgale", "Viļaka": "Latgale", "Viļāni": "Latgale", Zilupe: "Latgale",
    },
  },
  lt: {
    regions: {
      "56": "Alytaus apskritis", "57": "Kauno apskritis", "58": "Klaipėdos apskritis", "59": "Marijampolės apskritis",
      "60": "Panevėžio apskritis", "61": "Šiaulių apskritis", "62": "Tauragės apskritis", "63": "Telšių apskritis",
      "64": "Utenos apskritis", "65": "Vilniaus apskritis",
    },
    names: {
      "Akademija (Kaunas)": "Akademija", "Dainava (Kaunas)": "Dainava", Aukstadvaris: "Aukštadvaris", Birzai: "Biržai",
      Kupiskis: "Kupiškis", Mastaiciai: "Mastaičiai", Mazeikiai: "Mažeikiai", "Naujoji Akmene": "Naujoji Akmenė",
      Plunge: "Plungė", Radviliskis: "Radviliškis", Silute: "Šilutė", Taurage: "Tauragė", Telsiai: "Telšiai",
      Ukmerge: "Ukmergė", Vilkaviskis: "Vilkaviškis",
    },
  },
  gr: {
    regions: {
      ESYE11: "Anatolikí Makedonía kai Thráki", ESYE12: "Kentrikí Makedonía", ESYE13: "Dytikí Makedonía",
      ESYE14: "Thessalía", ESYE21: "Ípeiros", ESYE22: "Iónia Nisiá", ESYE23: "Dytikí Elláda", ESYE24: "Stereá Elláda",
      ESYE25: "Pelopónnisos", ESYE31: "Attikí", ESYE41: "Vóreio Aigaío", ESYE42: "Nótio Aigaío", ESYE43: "Kríti",
      "736572": "Ágio Óros",
    },
    respell: greekRespell,
    names: {
      Athens: "Athína", Piraeus: "Peiraiás", Corfu: "Kérkyra", Aegina: "Aígina", Delphi: "Delfoí", Mytilene: "Mytilíni",
      Chios: "Chíos", Rethymno: "Réthymno", Zakynthos: "Zákynthos", Mykonos: "Mýkonos", Volos: "Vólos",
      Kalamata: "Kalamáta", Alexandroupoli: "Alexandroúpoli", "Ano Arhanes": "Áno Archánes",
      "Mosynopolis, Maximianopolis, Μαξιμιανούπολις": "Mosynópoli", Ílion: "Ílio", Irákleion: "Irákleio",
      Kainoúryion: "Kainoúrgio", "Limín Khersonísou": "Liménas Chersonísou", Leondárion: "Leontári",
      Kamaterón: "Kamateró", Pappadhátai: "Papadátes",
    },
  },
  // Cyprus: the six districts, the two in the north included as the EU counts them. Greek-script names in ELOT 743
  // like Greece, with the English name kept for the district capitals people know in English.
  cy: {
    regions: { "01": "Ammóchostos", "02": "Kerýneia", "03": "Lárnaka", "04": "Lefkosía", "05": "Lemesós", "06": "Páfos" },
    respell: greekRespell,
    names: {
      Nicosia: "Lefkosía/Nicosia", Limassol: "Lemesós/Limassol", Larnaca: "Lárnaka", Paphos: "Páfos/Paphos",
      Famagusta: "Ammóchostos/Famagusta", Kyrenia: "Kerýneia/Kyrenia", Geroskipou: "Geroskípou", Emba: "Émpa",
      Kolossi: "Kolóssi", Konia: "Kóneia", Kissonerga: "Kissónerga", Psimolofou: "Psimolófou",
      Parekklisha: "Parekklisiá", Meneou: "Meneoú", Pyrgos: "Pýrgos", Xylotymbou: "Xylotýmvou",
    },
  },
  // Malta: every GeoNames region is one local council, so towns are grouped by island.
  mt: {
    regions: { "01": "Malta", "02": "Malta", "03": "Malta", "04": "Malta", "05": "Malta", "06": "Malta", "07": "Malta", "08": "Malta", "09": "Malta", "10": "Malta", "11": "Għawdex (Gozo)", "12": "Għawdex (Gozo)", "13": "Malta", "14": "Għawdex (Gozo)", "15": "Malta", "16": "Malta", "17": "Malta", "18": "Malta", "19": "Malta", "20": "Malta", "21": "Malta", "22": "Malta", "23": "Malta", "24": "Malta", "25": "Malta", "26": "Malta", "27": "Għawdex (Gozo)", "28": "Malta", "29": "Malta", "30": "Malta", "31": "Malta", "32": "Malta", "33": "Malta", "34": "Malta", "35": "Malta", "36": "Għawdex (Gozo)", "37": "Għawdex (Gozo)", "38": "Malta", "39": "Malta", "40": "Malta", "41": "Malta", "42": "Għawdex (Gozo)", "43": "Malta", "44": "Malta", "45": "Malta", "46": "Għawdex (Gozo)", "47": "Malta", "48": "Malta", "49": "Malta", "50": "Għawdex (Gozo)", "51": "Malta", "52": "Malta", "53": "Malta", "54": "Għawdex (Gozo)", "55": "Malta", "56": "Malta", "57": "Malta", "58": "Malta", "59": "Malta", "60": "Malta", "61": "Għawdex (Gozo)", "62": "Għawdex (Gozo)", "63": "Malta", "64": "Malta", "65": "Malta", "66": "Għawdex (Gozo)", "67": "Malta", "68": "Malta" },
    names: {
      "Haz-Zebbug": "Ħaż-Żebbuġ", "Hal Gharghur": "Għargħur", "Saint John": "San Ġwann", "Saint Lucia": "Santa Luċija",
      Imġarr: "Mġarr", Imtarfa: "Mtarfa", Imsida: "Msida", Imdina: "Mdina", Cospicua: "Bormla/Cospicua",
      Vittoriosa: "Birgu/Vittoriosa", Senglea: "Isla/Senglea", Victoria: "Rabat/Victoria", "L-Iklin": "Iklin",
    },
  },
  is: {
    regions: {
      "38": "Austurland", "39": "Höfuðborgarsvæðið", "40": "Norðurland eystra", "41": "Norðurland vestra",
      "42": "Suðurland", "43": "Suðurnes", "44": "Vestfirðir", "45": "Vesturland",
    },
  },
  rs: {
    regions: { VO: "Vojvodina", SE: "Centralna Srbija" },
    respell: (name) => name.replace(/\u00d0/g, "Đ"),
    names: { Belgrade: "Beograd", Knjazevac: "Knjaževac" },
  },
  si: { regions: "admin1", regionFixes: { Sentjur: "Šentjur" }, names: { "Novo Mesto": "Novo mesto" } },
  sk: {
    regions: {
      "01": "Banskobystrický kraj", "02": "Bratislavský kraj", "03": "Košický kraj", "04": "Nitriansky kraj",
      "05": "Prešovský kraj", "06": "Trenčiansky kraj", "07": "Trnavský kraj", "08": "Žilinský kraj",
    },
  },
  hu: {
    regions: {
      "01": "Bács-Kiskun", "02": "Baranya", "03": "Békés", "04": "Borsod-Abaúj-Zemplén", "05": "Budapest",
      "06": "Csongrád-Csanád", "08": "Fejér", "09": "Győr-Moson-Sopron", "10": "Hajdú-Bihar", "11": "Heves",
      "12": "Komárom-Esztergom", "14": "Nógrád", "16": "Pest", "17": "Somogy", "18": "Szabolcs-Szatmár-Bereg",
      "20": "Jász-Nagykun-Szolnok", "21": "Tolna", "22": "Vas", "23": "Veszprém", "24": "Zala",
    },
  },
};

const [cc, atcDir, cjDir] = process.argv.slice(2);
const config = COUNTRIES[cc];
if (!config || !atcDir || !cjDir) throw new Error("usage: build-geonames-places.ts <country> <all-the-cities dir> <cities.json dir>");

// cities.pbf is a stream of length-prefixed protobuf messages; fields 2 name, 3 country, 8 region, 9 population.
function* readCities(buf: Buffer) {
  let pos = 0;
  const varint = () => {
    let r = 0, mul = 1, b: number;
    do { b = buf[pos++]; r += (b & 0x7f) * mul; mul *= 128; } while (b >= 0x80);
    return r;
  };
  while (pos < buf.length) {
    const end = varint() + pos;
    const c = { name: "", country: "", region: "", population: 0 };
    while (pos < end) {
      const key = varint(), tag = Math.floor(key / 8), wire = key % 8;
      if (wire === 0) {
        const v = varint();
        if (tag === 9) c.population = v;
      } else if (wire === 2) {
        const n = varint(), s = buf.toString("utf8", pos, pos + n);
        pos += n;
        if (tag === 2) c.name = s;
        else if (tag === 3) c.country = s;
        else if (tag === 8) c.region = s;
      } else throw new Error(`unexpected wire type ${wire}`);
    }
    yield c;
  }
}

// Region names straight from GeoNames, for checking that REGIONS covers every code.
const admin1 = (JSON.parse(readFileSync(join(cjDir, "admin1.json"), "utf8")) as { code: string; name: string }[])
  .filter((r) => r.code.startsWith(`${cc.toUpperCase()}.`))
  .map((r) => [r.code.split(".")[1], r.name.replace(/^(Urban )?Municipality of /, "")] as const);
const regions: Record<string, string> = config.byName
  ? {}
  : config.regions === "admin1"
    ? Object.fromEntries(admin1.map(([code, name]) => [code, config.regionFixes?.[name] ?? name]))
    : config.regions;
const missingRegions = config.byName ? [] : admin1.map(([code]) => code).filter((r) => !regions[r]);
if (missingRegions.length) throw new Error(`no local name for regions ${missingRegions.join(", ")}`);

const areas = [...new Set(Object.values(config.byName ?? regions))].sort((a, b) => a.localeCompare(b, cc));
const best = new Map<string, [string, number, number]>();
for (const c of readCities(readFileSync(join(atcDir, "cities.pbf")))) {
  if (c.country !== cc.toUpperCase()) continue;
  const area = config.byName ? config.byName[c.name] : regions[c.region];
  if (!area) throw new Error(`unknown region ${c.region} for ${c.name}`);
  const raw = config.names?.[c.name] ?? config.respell?.(c.name) ?? c.name;
  const name = config.commaBelow ? raw.replace(/ş/g, "ș").replace(/Ş/g, "Ș").replace(/ţ/g, "ț").replace(/Ţ/g, "Ț") : raw;
  const size = Math.max(1, Math.round(c.population / 1000));
  // Romanian GeoNames lists some towns twice, with and without diacritics (Bucuresti, București): keep the bigger one.
  // Elsewhere such pairs can be two real villages (two Świętajno in Warmia), so names stay exact.
  const key = `${config.commaBelow ? name.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : name}|${area}`;
  if ((best.get(key)?.[2] ?? 0) < size) best.set(key, [name, areas.indexOf(area), size]);
}
const rows = [...best.values()].sort((a, b) => a[0].localeCompare(b[0], cc));

writeFileSync(
  `src/data/${cc}-places.json`,
  JSON.stringify({ source: "GeoNames towns of 1,000+ people via npm all-the-cities 3.1.0", areas, municipalities: rows }) + "\n",
);
console.log(`${rows.length} places in ${areas.length} regions`);
