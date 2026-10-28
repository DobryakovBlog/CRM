// Builds src/data/fr-places.json, the list of French communes offered in the city field.
// Source: official commune list (COG 2025) with population, as published by Etalab in the
// npm package @etalab/decoupage-administratif (data/communes.json, data/departements.json).
// Usage:
//   npm pack @etalab/decoupage-administratif && tar xzf etalab-*.tgz
//   npx tsx scripts/build-fr-places.ts package/data
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-fr-places.ts <data dir>");
const read = <T>(f: string): T => JSON.parse(readFileSync(join(dir, f), "utf8"));

type Commune = { nom: string; type: string; zone: string; departement: string; population?: number };
// Current communes of mainland France, Corsica and the five overseas departments (the EU part
// of France): not the former communes merged into new ones, Paris, Lyon and Marseille's
// arrondissements, nor the overseas collectivities.
const communes = read<Commune[]>("communes.json").filter(
  (c) => c.type === "commune-actuelle" && (c.zone === "metro" || c.zone === "drom"),
);
const used = new Set(communes.map((c) => c.departement));
const departments = read<{ code: string; nom: string }[]>("departements.json")
  .filter((d) => used.has(d.code))
  .sort((a, b) => a.code.localeCompare(b.code));

const rows = communes
  .map((c) => {
    const department = departments.findIndex((d) => d.code === c.departement);
    if (department < 0) throw new Error(`unknown department ${c.departement}`);
    // Population in thousands, at least 1, so big cities come first when names match.
    return [c.nom, department, Math.max(1, Math.round((c.population ?? 0) / 1000))] as const;
  })
  .sort((a, b) => a[0].localeCompare(b[0], "fr"));

writeFileSync(
  "src/data/fr-places.json",
  JSON.stringify({
    source: "COG communes with population via npm @etalab/decoupage-administratif",
    areas: departments.map((d) => d.nom),
    municipalities: rows,
  }),
);
console.log(`${rows.length} communes in ${departments.length} departments`);
