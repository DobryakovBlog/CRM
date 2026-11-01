// Builds src/data/lu-places.json, the list of Luxembourg communes offered in the city field.
// Source: GeoNames second-level divisions as published in the npm package cities.json
// (admin1.json = the 12 cantons, admin2.json = the communes). GeoNames still has the 105 communes
// of 2017, so the mergers since then are applied below to get today's 100. The data has no
// population, so the bigger communes get their rough size (STATEC 2024, thousands) from the
// table below; every other commune counts as 1.
// Usage:
//   npm pack cities.json && tar xzf cities.json-*.tgz
//   npx tsx scripts/build-lu-places.ts package
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-lu-places.ts <package dir>");
const read = <T>(f: string): T => JSON.parse(readFileSync(join(dir, f), "utf8"));

type Division = { code: string; name: string };
// Communes merged in 2018 and 2023 -> the new commune.
const MERGED: Record<string, string> = {
  "Boevange-sur-Attert": "Helperknapp", Tuntange: "Helperknapp",
  Hobscheid: "Habscht", Septfontaines: "Habscht",
  Grosbous: "Groussbus-Wal", Wahl: "Groussbus-Wal",
  Rosport: "Rosport-Mompach", Mompach: "Rosport-Mompach",
  Bous: "Bous-Waldbredimus", Waldbredimus: "Bous-Waldbredimus",
};
// "Ville de Luxembourg" -> "Luxembourg", "Commune de la Vallée de l'Ernz" -> "Vallée de l'Ernz".
const tidy = (name: string) => name.replace(/^(Commune|Ville) de (la )?/, "");

const cantons = read<Division[]>("admin1.json")
  .filter((c) => c.code.startsWith("LU."))
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));
const index = new Map(cantons.map((c, i) => [c.code, i]));

const POPULATION: Record<string, number> = {
  Luxembourg: 135, "Esch-sur-Alzette": 37, Differdange: 30, Dudelange: 22, Pétange: 21, Sanem: 18,
  Hesperange: 17, Bettembourg: 11, Schifflange: 11, Käerjeng: 11, Mamer: 10, Strassen: 10, Mersch: 10,
  Ettelbruck: 9, Diekirch: 7, Wiltz: 8,
};

const rows = new Map<string, [string, number, number]>();
for (const d of read<Division[]>("admin2.json").filter((d) => d.code.startsWith("LU."))) {
  const base = tidy(d.name);
  const name = MERGED[base] ?? base;
  const canton = index.get(d.code.split(".").slice(0, 2).join("."));
  if (canton === undefined) throw new Error(`unknown canton for ${d.name}`);
  rows.set(name, [name, canton, POPULATION[name] ?? 1]);
}
const list = [...rows.values()].sort((a, b) => a[0].localeCompare(b[0], "fr"));
if (list.length !== 100) throw new Error(`expected 100 communes, got ${list.length}`);

const missing = Object.keys(POPULATION).filter((n) => !rows.has(n));
if (missing.length) throw new Error(`population names not found: ${missing.join(", ")}`);

writeFileSync(
  "src/data/lu-places.json",
  JSON.stringify({ source: "GeoNames communes via npm cities.json, mergers to 2023 applied", areas: cantons.map((c) => c.name), municipalities: list }) + "\n",
);
console.log(`${list.length} communes in ${cantons.length} cantons`);
