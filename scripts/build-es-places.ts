// Builds src/data/es-places.json, the list of Spanish municipalities offered in the city field.
// Source: INE municipality list (1 January 2026) as published by
// github.com/codeforspain/ds-organizacion-administrativa (data/municipios.json, data/provincias.json).
// Usage:
//   npx tsx scripts/build-es-places.ts <dir-with-the-two-json-files>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) throw new Error("usage: build-es-places.ts <json dir>");
const read = <T>(f: string): T => JSON.parse(readFileSync(join(dir, f), "utf8"));

const provinces = read<{ provincia_id: string; nombre: string }[]>("provincias.json").sort((a, b) =>
  a.provincia_id.localeCompare(b.provincia_id),
);
const municipalities = read<{ provincia_id: string; nombre: string }[]>("municipios.json");

// INE writes articles last ("Coruña, A", "Alfàs del Pi, l'"); show them first, as people do.
function natural(part: string) {
  const m = part.match(/^(.*), (el|la|los|las|lo|l'|a|o|os|as|es|sa|ses|els|les|s')$/i);
  if (!m) return part;
  const art = m[2][0].toUpperCase() + m[2].slice(1).toLowerCase();
  return art.endsWith("'") ? `${art}${m[1]}` : `${art} ${m[1]}`;
}
// A few source names arrive double-encoded ("CoruÃ±a"); "Balears, Illes" is the one non-article inversion.
const fixMojibake = (s: string) => (/Ã|Â/.test(s) ? Buffer.from(s, "latin1").toString("utf8") : s);
const display = (name: string) =>
  fixMojibake(name)
    .split("/")
    .map((p) => (p === "Balears, Illes" ? "Illes Balears" : natural(p)))
    .join("/");

// Rough population in thousands (INE 2024), so big cities come first when names match.
// Every other municipality counts as 1; provincial capitals at least 50.
const POPULATION: Record<string, number> = {
  Madrid: 3400, Barcelona: 1700, "València": 810, Sevilla: 685, Zaragoza: 690, Málaga: 590, Murcia: 470,
  "Palma": 430, "Las Palmas de Gran Canaria": 380, Bilbao: 345, "Alacant/Alicante": 360, "Córdoba": 320,
  Valladolid: 300, Vigo: 295, "Gijón": 270, "L'Hospitalet de Llobregat": 280, "Vitoria-Gasteiz": 260,
  "A Coruña": 250,"Elx/Elche": 240, Granada: 230, Terrassa: 225, Badalona: 225, Sabadell: 220,
  Oviedo: 220, Cartagena: 220, "Móstoles": 210, "Jerez de la Frontera": 215, "Santa Cruz de Tenerife": 210,
  Pamplona: 205, "Pamplona/Iruña": 205, "Almería": 200, "Alcalá de Henares": 195, Fuenlabrada: 190,
  "Leganés": 190, "Donostia/San Sebastián": 190, Getafe: 185, Burgos: 175, Albacete: 175, Santander: 172,
  "Castelló de la Plana/Castellón de la Plana": 175, "Alcorcón": 172, "San Cristóbal de La Laguna": 160,
  "Logroño": 152, Badajoz: 150, Marbella: 150, Salamanca: 145, Huelva: 142, "Lleida": 140,
  Tarragona: 138, "Dos Hermanas": 138, "Torrejón de Ardoz": 135, Parla: 135, "Mataró": 130, "León": 122,
  Algeciras: 123, "Santa Coloma de Gramenet": 120, "Alcobendas": 120, "Cádiz": 112, "Jaén": 111,
  Ourense: 105, Reus: 106, Telde: 103, Barakaldo: 102, Lugo: 98, Girona: 105, "Santiago de Compostela": 98,
  "Cáceres": 96, Lorca: 98, Coslada: 82, "Talavera de la Reina": 85, "El Puerto de Santa María": 89,
  Torrevieja: 90, "Las Rozas de Madrid": 97, "Pozuelo de Alarcón": 88, Benidorm: 72, "Eivissa": 52,
  Fuengirola: 85, "Mijas": 90, "Estepona": 75, "Torremolinos": 70, "Benalmádena": 70, "Vélez-Málaga": 85,
  Palencia: 77, Ponferrada: 64, Zamora: 60, "Ávila": 58, Segovia: 52, Huesca: 54, Cuenca: 54,
  Guadalajara: 89, Toledo: 86, "Ciudad Real": 75, Pontevedra: 83, Soria: 40, Teruel: 36, Melilla: 85, Ceuta: 83,
};

const capitals = new Set(provinces.map((p) => p.nombre.split("/")[0]));
const rows = municipalities
  .map((m) => {
    const name = display(m.nombre);
    const province = provinces.findIndex((p) => p.provincia_id === m.provincia_id);
    if (province < 0) throw new Error(`unknown province ${m.provincia_id}`);
    const first = name.split("/")[0];
    const size = POPULATION[name] ?? POPULATION[first] ?? (capitals.has(first) ? 50 : 1);
    return [name, province, size] as const;
  })
  .sort((a, b) => a[0].localeCompare(b[0], "es"));

writeFileSync(
  "src/data/es-places.json",
  JSON.stringify({
    source: "INE municipalities 2026 via github.com/codeforspain/ds-organizacion-administrativa",
    areas: provinces.map((p) => display(p.nombre)),
    municipalities: rows,
  }),
);
console.log(`${rows.length} municipalities in ${provinces.length} provinces`);
