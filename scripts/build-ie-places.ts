// Builds src/data/ie-places.json, the list of Irish towns offered in the city field.
// Ireland has no municipalities like the rest of Europe, so the list is the GeoNames towns and
// suburbs of 1,000+ people as published in the npm package cities.json (cities.json, admin2.json),
// grouped by county. GeoNames writes a few towns and counties in Irish; they get their usual English
// name below. The data has no population, so the bigger towns get their rough size (Census 2022,
// thousands) from the table below; every other town counts as 1.
// Usage:
//   npm pack cities.json && tar xzf cities.json-*.tgz
//   npx tsx scripts/build-ie-places.ts package
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-ie-places.ts <package dir>");
const read = <T>(f: string): T => JSON.parse(readFileSync(join(dir, f), "utf8"));

type Division = { code: string; name: string };
type City = { name: string; country: string; admin1: string; admin2: string };

// GeoNames name -> the name people use.
const ENGLISH: Record<string, string> = {
  "An Muileann gCearr": "Mullingar", "Cluain Meala": "Clonmel", "Droichead Nua": "Newbridge",
  Leifear: "Lifford", "Trá Mhór": "Tramore", "An Ros": "Rush",
};
// GeoNames second-level division -> county. Dublin and Cork split into several councils.
const COUNTY: Record<string, string> = {
  "Uíbh Fhailí": "Offaly", "An Longfort": "Longford", "An Cabhán": "Cavan", "Mayo County": "Mayo",
  "Fingal County": "Dublin", "Dún Laoghaire-Rathdown": "Dublin", "South Dublin": "Dublin", "Dublin City": "Dublin",
  "Galway City": "Galway", "Cork City": "Cork", "Limerick City and County Council": "Limerick",
};
const county = (name: string) => COUNTY[name] ?? name.replace(/^County /, "");
// Council names that GeoNames also lists as places.
const NOT_TOWNS = new Set(["South Dublin"]);

const divisions = new Map(
  read<Division[]>("admin2.json")
    .filter((d) => d.code.startsWith("IE."))
    .map((d) => [d.code.split(".")[2], county(d.name)]),
);
const areas = [...new Set(divisions.values())].sort();

const POPULATION: Record<string, number> = {
  Dublin: 590, Cork: 225, Limerick: 102, Galway: 86, Waterford: 60, Drogheda: 44, Swords: 40,
  Dundalk: 43, Bray: 33, Navan: 33, Kilkenny: 27, Ennis: 27, Carlow: 27, Tralee: 26, Newbridge: 24,
  Portlaoise: 23, Balbriggan: 25, Naas: 26, Athlone: 23, Mullingar: 22, Letterkenny: 22, Celbridge: 21,
  Wexford: 21, Sligo: 20, Clonmel: 18, Greystones: 22, Malahide: 18, Tallaght: 80, Lucan: 50,
  Blanchardstown: 70, Clondalkin: 45, "Dún Laoghaire": 26, Tullamore: 15, Killarney: 15,
};

const seen = new Set<string>();
const rows: [string, number, number][] = [];
for (const c of read<City[]>("cities.json")) {
  if (c.country !== "IE" || NOT_TOWNS.has(c.name)) continue;
  const name = ENGLISH[c.name] ?? c.name;
  const area = divisions.get(c.admin2);
  if (!area) throw new Error(`unknown county for ${c.name}`);
  const key = `${name}|${area}`;
  if (seen.has(key)) continue; // GeoNames lists a few towns twice
  seen.add(key);
  rows.push([name, areas.indexOf(area), POPULATION[name] ?? 1]);
}
rows.sort((a, b) => a[0].localeCompare(b[0], "en"));

const missing = Object.keys(POPULATION).filter((n) => !rows.some((r) => r[0] === n));
if (missing.length) throw new Error(`population names not found: ${missing.join(", ")}`);

writeFileSync(
  "src/data/ie-places.json",
  JSON.stringify({ source: "GeoNames towns via npm cities.json", areas, municipalities: rows }) + "\n",
);
console.log(`${rows.length} towns in ${areas.length} counties`);
