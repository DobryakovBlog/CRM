// Builds src/data/pt-places.json, the list of Portuguese places offered in the city field.
// Source: CTT postal-code tables published at github.com/centraldedados/codigos_postais
// (distritos.csv, concelhos.csv, codigos_postais.csv). Usage:
//   npx tsx scripts/build-places.ts <dir-with-the-three-csv-files>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === "," || ch === "\n") {
      row.push(field);
      field = "";
      if (ch === "\n") {
        rows.push(row);
        row = [];
      }
    } else if (ch !== "\r") field += ch;
  }
  if (field || row.length) rows.push([...row, field]);
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-places.ts <csv dir>");
const read = (f: string) => parseCsv(readFileSync(join(dir, f), "utf8"));

// Islands are listed as separate "districts"; group them as Madeira and Açores.
const regionOf = (code: string, name: string) =>
  Number(code) >= 41 ? "Açores" : Number(code) >= 31 ? "Madeira" : name;

const districts = new Map(read("distritos.csv").map((r) => [r.cod_distrito, regionOf(r.cod_distrito, r.nome_distrito)]));
const regions = [...new Set(districts.values())];

const munRows = read("concelhos.csv").sort((a, b) => a.nome_concelho.localeCompare(b.nome_concelho, "pt"));
const munIndex = new Map(munRows.map((r, i) => [`${r.cod_distrito}-${r.cod_concelho}`, i]));
const municipalities = munRows.map((r) => [r.nome_concelho, regions.indexOf(districts.get(r.cod_distrito)!)]);

// [name, municipality index, postal-code count]. The count stands in for size:
// a town has hundreds of street codes, a hamlet one or two.
const byKey = new Map<string, [string, number, number]>();
for (const r of read("codigos_postais.csv")) {
  const m = munIndex.get(`${r.cod_distrito}-${r.cod_concelho}`);
  const name = r.nome_localidade;
  if (m === undefined || !name) continue;
  const key = `${m}|${name.toLocaleLowerCase("pt")}`;
  const entry = byKey.get(key);
  if (entry) entry[2]++;
  else byKey.set(key, [name, m, 1]);
}
const localities = [...byKey.values()];
localities.sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0], "pt"));

const out = { source: "CTT postal codes via github.com/centraldedados/codigos_postais", regions, municipalities, localities };
writeFileSync(new URL("../src/data/pt-places.json", import.meta.url), JSON.stringify(out));
console.log(`${regions.length} regions, ${municipalities.length} municipalities, ${localities.length} localities`);
