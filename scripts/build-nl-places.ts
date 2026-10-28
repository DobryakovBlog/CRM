// Builds src/data/nl-places.json, the list of Dutch gemeenten offered in the city field.
// Source: GeoNames second-level divisions (the 342 gemeenten) as published in the npm package
// cities.json (admin1.json, admin2.json). The data has no population, so the bigger cities
// get their rough size (CBS 2024, thousands) from the table below; every other gemeente counts as 1.
// Usage:
//   npm pack cities.json && tar xzf cities.json-*.tgz
//   npx tsx scripts/build-nl-places.ts package
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-nl-places.ts <package dir>");
const read = <T>(f: string): T => JSON.parse(readFileSync(join(dir, f), "utf8"));

type Division = { code: string; name: string };
// GeoNames writes some provinces in English.
const DUTCH: Record<string, string> = {
  "North Holland": "Noord-Holland",
  "South Holland": "Zuid-Holland",
  "North Brabant": "Noord-Brabant",
};
// GeoNames spelling -> the gemeente's official name.
const OFFICIAL: Record<string, string> = { "Sûdwest Fryslân": "Súdwest-Fryslân" };
const provinces = read<Division[]>("admin1.json")
  .filter((p) => p.code.startsWith("NL."))
  .sort((a, b) => a.code.localeCompare(b.code));
const index = new Map(provinces.map((p, i) => [p.code, i]));

const POPULATION: Record<string, number> = {
  Amsterdam: 930, Rotterdam: 670, "Den Haag": 560, Utrecht: 375, Eindhoven: 245, Groningen: 240,
  Tilburg: 228, Almere: 225, Breda: 187, Nijmegen: 182, Apeldoorn: 168, Arnhem: 166, Haarlem: 164,
  Amersfoort: 161, Haarlemmermeer: 160, Zaanstad: 160, Enschede: 160, "'s-Hertogenbosch": 160,
  Zwolle: 133, Leiden: 127, Zoetermeer: 127, Leeuwarden: 126, Ede: 122, Maastricht: 122,
  Dordrecht: 121, "Alphen aan den Rijn": 115, Westland: 113, Alkmaar: 111, Emmen: 108, Delft: 104,
  Venlo: 102, Deventer: 102, Purmerend: 94, Helmond: 94, Oss: 94, Amstelveen: 92, Hilversum: 92,
  "Súdwest-Fryslân": 92, "Sittard-Geleen": 91, "Dijk en Waard": 88, Heerlen: 87, Hengelo: 82,
  Schiedam: 80, Lelystad: 80, "Leidschendam-Voorburg": 78, Roosendaal: 78, Gouda: 75, Vlaardingen: 75,
  Assen: 70, Veenendaal: 68, "Capelle aan den IJssel": 67, Katwijk: 67, Zeist: 66, Nieuwegein: 64,
};

const rows = read<Division[]>("admin2.json")
  .filter((g) => g.code.startsWith("NL."))
  .map((g) => {
    const bare = g.name.replace(/^Gemeente /, "");
    const name = OFFICIAL[bare] ?? bare;
    const province = index.get(g.code.split(".").slice(0, 2).join("."));
    if (province === undefined) throw new Error(`unknown province for ${g.name}`);
    return [name, province, POPULATION[name] ?? 1] as const;
  })
  .sort((a, b) => a[0].localeCompare(b[0], "nl"));

const missing = Object.keys(POPULATION).filter((n) => !rows.some((r) => r[0] === n));
if (missing.length) throw new Error(`population names not found: ${missing.join(", ")}`);

writeFileSync(
  "src/data/nl-places.json",
  JSON.stringify({
    source: "GeoNames gemeenten via npm cities.json",
    areas: provinces.map((p) => DUTCH[p.name] ?? p.name),
    municipalities: rows,
  }),
);
console.log(`${rows.length} gemeenten in ${provinces.length} provinces`);
