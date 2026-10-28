// Builds src/data/it-places.json, the list of Italian comuni offered in the city field.
// Source: ISTAT comuni with population, as published by github.com/matteocontrini/comuni-json.
// Usage:
//   curl -O https://raw.githubusercontent.com/matteocontrini/comuni-json/master/comuni.json
//   npx tsx scripts/build-it-places.ts comuni.json
import { readFileSync, writeFileSync } from "node:fs";

const file = process.argv[2];
if (!file) throw new Error("usage: build-it-places.ts <comuni.json>");

type Comune = { nome: string; provincia: { codice: string; nome: string }; popolazione?: number };
const comuni: Comune[] = JSON.parse(readFileSync(file, "utf8"));

const provinces = [...new Map(comuni.map((c) => [c.provincia.codice, c.provincia.nome])).entries()].sort((a, b) =>
  a[0].localeCompare(b[0]),
);
const index = new Map(provinces.map(([code], i) => [code, i]));

const rows = comuni
  // Population in thousands, at least 1, so big cities come first when names match.
  .map((c) => [c.nome, index.get(c.provincia.codice)!, Math.max(1, Math.round((c.popolazione ?? 0) / 1000))] as const)
  .sort((a, b) => a[0].localeCompare(b[0], "it"));

writeFileSync(
  "src/data/it-places.json",
  JSON.stringify({
    source: "ISTAT comuni with population via github.com/matteocontrini/comuni-json",
    areas: provinces.map(([, name]) => name),
    municipalities: rows,
  }),
);
console.log(`${rows.length} comuni in ${provinces.length} provinces`);
