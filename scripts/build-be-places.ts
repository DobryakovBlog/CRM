// Builds src/data/be-places.json, the list of Belgian communes / gemeenten offered in the city field.
// Source: the 565 municipalities of the Statbel REFNIS code (1 January 2025) as published in the npm
// package belgica (data/municipalities.json, data/provinces.json). Names follow the language of the
// region: Dutch in Flanders, French in Wallonia, German in the German-speaking municipalities, both in
// Brussels; the other language's name, when different, follows after a slash so either one finds it.
// The data has no population, so the bigger cities get their rough size (Statbel 2024, thousands)
// from the table below; every other municipality counts as 1.
// Usage:
//   npm pack belgica && tar xzf belgica-*.tgz
//   npx tsx scripts/build-be-places.ts package
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-be-places.ts <package dir>");
const read = <T>(f: string): T => JSON.parse(readFileSync(join(dir, "data", f), "utf8"));

type Names = { nl: string; fr: string; de?: string };
type Municipality = { id: string; name: Names; province: string; region: string };
type Province = { id: string; name: Names; region: string };

const FLANDERS = "02000";
const BRUSSELS = "04000";
// French name -> official German name of the German-speaking municipalities.
const GERMAN: Record<string, string> = {
  Amblève: "Amel", Bullange: "Büllingen", "Burg-Reuland": "Burg-Reuland", Butgenbach: "Bütgenbach",
  Eupen: "Eupen", "La Calamine": "Kelmis", Lontzen: "Lontzen", Raeren: "Raeren", "Saint-Vith": "Sankt Vith",
};

const both = (first: string, second: string) => (first === second ? first : `${first}/${second}`);
const local = (n: Names, region: string) => {
  if (GERMAN[n.fr]) return both(GERMAN[n.fr], n.fr);
  if (region === FLANDERS) return both(n.nl, n.fr);
  return both(n.fr, n.nl); // Wallonia, and Brussels with its French name first
};

const provinces = read<Province[]>("provinces.json").sort((a, b) => a.id.localeCompare(b.id));
const areas = [
  ...provinces.map((p) =>
    p.region === FLANDERS
      ? p.name.nl.replace(/^Provincie /, "")
      : p.name.fr.replace(/^Province (de |du |d’)/, "").replace(/^./, (c) => c.toUpperCase()),
  ),
  "Bruxelles-Capitale/Brussel-Hoofdstad",
];
const index = new Map(provinces.map((p, i) => [p.id, i]));

const POPULATION: Record<string, number> = {
  "Antwerpen/Anvers": 545, "Gent/Gand": 270, "Charleroi": 203, "Liège/Luik": 197, "Bruxelles/Brussel": 196,
  "Schaerbeek/Schaarbeek": 131, "Anderlecht": 127, "Brugge/Bruges": 119, "Namur/Namen": 113, "Leuven/Louvain": 104,
  "Molenbeek-Saint-Jean/Sint-Jans-Molenbeek": 98, "Mons/Bergen": 96, "Mechelen/Malines": 88, "Ixelles/Elsene": 87,
  "Aalst/Alost": 90, "Uccle/Ukkel": 85, "Hasselt": 80, "Sint-Niklaas": 80, "Kortrijk/Courtrai": 79,
  "Oostende/Ostende": 72, "La Louvière": 81, "Tournai/Doornik": 69, "Genk": 67, "Seraing": 64,
  "Roeselare/Roulers": 64, "Verviers": 55, "Mouscron/Moeskroen": 59, "Beveren-Kruibeke-Zwijndrecht": 70,
};

const rows = read<Municipality[]>("municipalities.json")
  .map((m) => {
    const name = local(m.name, m.region);
    const area = m.region === BRUSSELS ? areas.length - 1 : index.get(m.province);
    if (area === undefined) throw new Error(`unknown province for ${name}`);
    return [name, area, POPULATION[name] ?? 1] as const;
  })
  .sort((a, b) => a[0].localeCompare(b[0], "fr"));

const missing = Object.keys(POPULATION).filter((n) => !rows.some((r) => r[0] === n));
if (missing.length) throw new Error(`population names not found: ${missing.join(", ")}`);

writeFileSync(
  "src/data/be-places.json",
  JSON.stringify({ source: "Statbel REFNIS 2025 via npm belgica", areas, municipalities: rows }) + "\n",
);
console.log(`${rows.length} municipalities in ${areas.length} areas`);
