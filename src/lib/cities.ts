import data from "@/data/pt-places.json";
import esData from "@/data/es-places.json";
import { slugify } from "./slug";

// Portugal: every municipality (308) and every locality in the CTT postal tables
// (about 33,000), built by scripts/build-places.ts. A municipality's slug is its
// name ("lisboa"); a locality's slug adds its municipality ("alfama-lisboa").
// Spain: every municipality (8,132), built by scripts/build-es-places.ts. Its slug is
// its name ("madrid"), with the province added when the name is taken ("castejon-navarra").

export type Country = "pt" | "es";

export type Place = {
  slug: string;
  country: Country;
  name: string;
  /** Municipality slug; equal to slug for a municipality. */
  municipality: string;
  /** "Lisboa" for a municipality (its district or province), "Sintra, Lisboa" for a locality. */
  area: string;
  isMunicipality: boolean;
  /** Postal codes in the place, a rough measure of its size. */
  size: number;
  folded: string;
};

export type CityOption = { slug: string; name: string; area: string; hasSalons: boolean };

export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

type Index = {
  bySlug: Map<string, Place>;
  municipalities: Record<Country, Place[]>;
  all: Place[];
  members: Map<string, string[]>;
};
let index: Index | undefined;

function build(): Index {
  const bySlug = new Map<string, Place>();
  const members = new Map<string, string[]>();
  const municipalities = data.municipalities.map(([full, region]) => {
    const name = String(full).replace(/\s*\(.*\)$/, ""); // "Lagoa (Algarve)" -> "Lagoa"
    const p: Place = {
      slug: slugify(String(full)),
      country: "pt",
      name,
      municipality: "",
      area: data.regions[Number(region)],
      isMunicipality: true,
      size: 0,
      folded: fold(name),
    };
    p.municipality = p.slug;
    bySlug.set(p.slug, p);
    members.set(p.slug, [p.slug]);
    return p;
  });
  for (const [name, m, size] of data.localities as [string, number, number][]) {
    const mun = municipalities[m];
    if (fold(name) === mun.folded) continue; // the town that gives the municipality its name
    const slug = `${slugify(name)}-${mun.slug}`;
    if (bySlug.has(slug)) continue;
    bySlug.set(slug, {
      slug,
      country: "pt",
      name,
      municipality: mun.slug,
      area: `${mun.name}, ${mun.area}`,
      isMunicipality: false,
      size,
      folded: fold(name),
    });
    members.get(mun.slug)!.push(slug);
  }
  const rows = esData.municipalities as [string, number, number][];
  const taken = new Map<string, number>();
  for (const [name] of rows) taken.set(slugify(name), (taken.get(slugify(name)) ?? 0) + 1);
  const spain = rows.map(([name, province, size]) => {
    const area = esData.provinces[province];
    let slug = slugify(name);
    if (taken.get(slug)! > 1 || bySlug.has(slug)) slug = slugify(`${name} ${area.split("/")[0]}`);
    const p: Place = { slug, country: "es", name, municipality: slug, area, isMunicipality: true, size, folded: fold(name) };
    bySlug.set(slug, p);
    members.set(slug, [slug]);
    return p;
  });
  return { bySlug, municipalities: { pt: municipalities, es: spain }, all: [...bySlug.values()], members };
}

const places = () => (index ??= build());

export const isPlace = (slug: string) => places().bySlug.has(slug);
export const placeBySlug = (slug: string) => places().bySlug.get(slug);
export const placeCountry = (slug: string): Country => placeBySlug(slug)?.country ?? "pt";

/** Time zone for a business in this place: the Canaries keep Atlantic time. */
export function placeTimezone(slug: string) {
  const p = placeBySlug(slug);
  if (p?.country !== "es") return "Europe/Lisbon";
  return /^(Las Palmas|Santa Cruz de Tenerife)$/.test(p.area) ? "Atlantic/Canary" : "Europe/Madrid";
}

/** City a country's search starts with when nothing else is known. */
export const DEFAULT_CITY: Record<Country, string> = { pt: "lisboa", es: "madrid" };

export function cityName(slug: string): string {
  return placeBySlug(slug)?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Slugs a city search covers: a municipality includes all its localities. */
export function placesIn(slug: string): string[] {
  return places().members.get(slug) ?? [slug];
}

// Countries shown in search. Portugal and Spain are open; the rest tell visitors where we are heading.
export const COUNTRIES = [
  { code: "pt", open: true },
  { code: "es", open: true },
  { code: "fr", open: false },
  { code: "it", open: false },
  { code: "de", open: false },
  { code: "nl", open: false },
  { code: "be", open: false },
  { code: "ie", open: false },
  { code: "lu", open: false },
] as const;

function withSalons(listed: string[]) {
  const set = new Set(listed);
  for (const s of listed) {
    const m = placeBySlug(s)?.municipality;
    if (m) set.add(m);
  }
  return set;
}

const option = (p: Place, has: Set<string>): CityOption => ({
  slug: p.slug,
  name: p.name,
  area: p.area,
  hasSalons: has.has(p.slug),
});

/**
 * Options the city field starts with: places with salons first, then every
 * Portuguese municipality, or Spain's bigger cities and provincial capitals
 * (8,000 municipalities are too many to send), by name. The rest come from
 * searchPlaces as the visitor types.
 */
export function cityOptions(listed: string[], current?: string, country: Country = "pt"): CityOption[] {
  const has = withSalons(listed);
  const byName = (a: Place, b: Place) => a.name.localeCompare(b.name, country);
  const first = [...has, ...(current ? [current] : [])]
    .map(placeBySlug)
    .filter((p): p is Place => p?.country === country);
  const base = places().municipalities[country].filter((p) => country === "pt" || p.size > 1);
  const seen = new Set<string>();
  return [...first.sort(byName), ...base.slice().sort(byName)]
    .filter((p) => !seen.has(p.slug) && seen.add(p.slug))
    .map((p) => option(p, has));
}

/**
 * Places matching what the visitor typed (accents optional): names that start
 * with it, then names with a word that starts with it, then names containing it.
 * Within each group places with salons come first, then municipalities, then
 * bigger towns before villages.
 */
export function searchPlaces(query: string, listed: string[] = [], limit = 30, country?: Country): CityOption[] {
  const q = fold(query);
  if (!q) return [];
  const has = withSalons(listed);
  const hits: { p: Place; r: number }[] = [];
  for (const p of places().all) {
    if (country && p.country !== country) continue;
    let r = -1;
    // "Donostia/San Sebastián": either official name counts as the start.
    if (p.folded.split("/").some((n) => n.startsWith(q))) r = 0;
    else if (p.folded.split(/[\s/'-]+/).some((w) => w.startsWith(q))) r = 1;
    else if (q.length >= 3 && p.folded.includes(q)) r = 2;
    if (r >= 0) hits.push({ p, r: r * 4 + (has.has(p.slug) ? 0 : 2) + (p.isMunicipality ? 0 : 1) });
  }
  return hits
    .sort((a, b) => a.r - b.r || b.p.size - a.p.size || a.p.name.localeCompare(b.p.name, "pt"))
    .slice(0, limit)
    .map((h) => option(h.p, has));
}

export const OPEN_COUNTRIES = COUNTRIES.filter((c) => c.open).map((c) => c.code as Country);

/**
 * Everything the country + city fields start with: the country of the current city
 * (or Spain for Spanish visitors), and for each open country its city list and the
 * city picked first (the current one, one with businesses, or the capital).
 */
export function cityFieldSetup(listed: string[], current: string | undefined, locale: string) {
  const defaultCountry: Country = current && isPlace(current) ? placeCountry(current) : locale === "es" ? "es" : "pt";
  const options = {} as Record<Country, CityOption[]>;
  const defaultSlugs = {} as Record<Country, string>;
  for (const c of OPEN_COUNTRIES) {
    options[c] = cityOptions(listed, current, c);
    defaultSlugs[c] =
      (current && placeCountry(current) === c ? current : listed.find((s) => placeCountry(s) === c)) ?? DEFAULT_CITY[c];
  }
  return { defaultCountry, options, defaultSlugs };
}

/** Phone country code a business in this place most likely shares with its clients. */
export const phoneCountry = (slug: string) => (placeCountry(slug) === "es" ? "ES" : "PT");
