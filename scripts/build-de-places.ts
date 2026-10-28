// Builds src/data/de-places.json, the list of German Gemeinden offered in the city field.
// Source: Destatis Gemeindeverzeichnis (31 March 2017) with population, as published in the
// npm package gemeindeverzeichnis (gemeinden.ndjson, kreise.ndjson). It is the newest complete
// list reachable from here; later mergers of small villages are not in it.
// Usage:
//   npm pack gemeindeverzeichnis && tar xzf gemeindeverzeichnis-*.tgz
//   npx tsx scripts/build-de-places.ts package
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-de-places.ts <package dir>");
const read = <T>(f: string): T[] =>
  readFileSync(join(dir, f), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l));

type Key = { land: string; regierungsbezirk: string; kreis: string };
type Gemeinde = { name: string; typ: { name: string }; schlüssel: Key; bevölkerung?: number };
const kreisKey = (k: Key) => k.land + k.regierungsbezirk + k.kreis;
// "München, Landeshauptstadt" -> "München": the official suffix is not part of the name people use.
const plain = (name: string) => name.split(", ")[0];

const kreise = read<{ name: string; schlüssel: Key }>("kreise.ndjson").sort((a, b) =>
  kreisKey(a.schlüssel).localeCompare(kreisKey(b.schlüssel)),
);
const index = new Map(kreise.map((k, i) => [kreisKey(k.schlüssel), i]));

const rows = read<Gemeinde>("gemeinden.ndjson")
  .filter((g) => !g.typ.name.startsWith("gemeindefreies-gebiet")) // forests and lakes, nobody lives there
  .map((g) => {
    const kreis = index.get(kreisKey(g.schlüssel));
    if (kreis === undefined) throw new Error(`unknown Kreis for ${g.name}`);
    // Population in thousands, at least 1, so big cities come first when names match.
    return [plain(g.name), kreis, Math.max(1, Math.round((g.bevölkerung ?? 0) / 1000))] as const;
  })
  .sort((a, b) => a[0].localeCompare(b[0], "de"));

writeFileSync(
  "src/data/de-places.json",
  JSON.stringify({
    source: "Destatis Gemeindeverzeichnis 2017 with population via npm gemeindeverzeichnis",
    areas: kreise.map((k) => plain(k.name)),
    municipalities: rows,
  }),
);
console.log(`${rows.length} Gemeinden in ${kreise.length} Kreise`);
