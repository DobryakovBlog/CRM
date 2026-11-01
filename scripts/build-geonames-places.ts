// Builds src/data/<cc>-places.json for a country without an official municipality list we can
// fetch: every GeoNames town of 1,000+ people, grouped by region, ordered by population.
// Sources: the npm packages all-the-cities 3.1.0 (cities.pbf: name, region code, population) and
// cities.json (admin1.json: region names). Big cities carry their English name in GeoNames, so
// NAMES gives them back their local one; REGIONS gives the regions their local name.
// Usage:
//   npm pack all-the-cities@3.1.0 cities.json && tar xzf all-the-cities-*.tgz && mkdir cj && tar xzf cities.json-*.tgz -C cj
//   npx tsx scripts/build-geonames-places.ts at package cj/package
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Config = { regions: Record<string, string>; names?: Record<string, string> };
const COUNTRIES: Record<string, Config> = {
  at: {
    regions: {
      "01": "Burgenland", "02": "Kärnten", "03": "Niederösterreich", "04": "Oberösterreich",
      "05": "Salzburg", "06": "Steiermark", "07": "Tirol", "08": "Vorarlberg", "09": "Wien",
    },
    names: { Vienna: "Wien" },
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
const known = new Set(
  (JSON.parse(readFileSync(join(cjDir, "admin1.json"), "utf8")) as { code: string }[])
    .filter((r) => r.code.startsWith(`${cc.toUpperCase()}.`))
    .map((r) => r.code.split(".")[1]),
);
const missingRegions = [...known].filter((r) => !config.regions[r]);
if (missingRegions.length) throw new Error(`no local name for regions ${missingRegions.join(", ")}`);

const areas = [...new Set(Object.values(config.regions))].sort((a, b) => a.localeCompare(b, cc));
const best = new Map<string, [string, number, number]>();
for (const c of readCities(readFileSync(join(atcDir, "cities.pbf")))) {
  if (c.country !== cc.toUpperCase()) continue;
  const area = config.regions[c.region];
  if (!area) throw new Error(`unknown region ${c.region} for ${c.name}`);
  const name = config.names?.[c.name] ?? c.name;
  const size = Math.max(1, Math.round(c.population / 1000));
  const key = `${name}|${area}`;
  if ((best.get(key)?.[2] ?? 0) < size) best.set(key, [name, areas.indexOf(area), size]);
}
const rows = [...best.values()].sort((a, b) => a[0].localeCompare(b[0], cc));

writeFileSync(
  `src/data/${cc}-places.json`,
  JSON.stringify({ source: "GeoNames towns of 1,000+ people via npm all-the-cities 3.1.0", areas, municipalities: rows }) + "\n",
);
console.log(`${rows.length} places in ${areas.length} regions`);
