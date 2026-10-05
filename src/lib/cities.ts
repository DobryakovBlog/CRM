import data from "@/data/pt-places.json";
import { slugify } from "./slug";

// Every Portuguese municipality (308) and every locality in the CTT postal tables
// (about 33,000), built by scripts/build-places.ts. A municipality's slug is its
// name ("lisboa"); a locality's slug adds its municipality ("alfama-lisboa").

export type Place = {
  slug: string;
  name: string;
  /** Municipality slug; equal to slug for a municipality. */
  municipality: string;
  /** "Lisboa" for a municipality (its district), "Sintra, Lisboa" for a locality. */
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

type Index = { bySlug: Map<string, Place>; municipalities: Place[]; all: Place[]; members: Map<string, string[]> };
let index: Index | undefined;

function build(): Index {
  const bySlug = new Map<string, Place>();
  const members = new Map<string, string[]>();
  const municipalities = data.municipalities.map(([full, region]) => {
    const name = String(full).replace(/\s*\(.*\)$/, ""); // "Lagoa (Algarve)" -> "Lagoa"
    const p: Place = {
      slug: slugify(String(full)),
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
      name,
      municipality: mun.slug,
      area: `${mun.name}, ${mun.area}`,
      isMunicipality: false,
      size,
      folded: fold(name),
    });
    members.get(mun.slug)!.push(slug);
  }
  return { bySlug, municipalities, all: [...bySlug.values()], members };
}

const places = () => (index ??= build());

export const isPlace = (slug: string) => places().bySlug.has(slug);
export const placeBySlug = (slug: string) => places().bySlug.get(slug);

export function cityName(slug: string): string {
  return placeBySlug(slug)?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Slugs a city search covers: a municipality includes all its localities. */
export function placesIn(slug: string): string[] {
  return places().members.get(slug) ?? [slug];
}

// Countries shown in search. Only Portugal is open; the rest tell visitors where we are heading.
export const COUNTRIES = [
  { code: "pt", open: true },
  { code: "es", open: false },
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
 * municipality by name. Localities come from searchPlaces as the visitor types.
 */
export function cityOptions(listed: string[], current?: string): CityOption[] {
  const has = withSalons(listed);
  const byName = (a: Place, b: Place) => a.name.localeCompare(b.name, "pt");
  const first = [...has, ...(current ? [current] : [])]
    .map(placeBySlug)
    .filter((p): p is Place => !!p);
  const seen = new Set<string>();
  return [...first.sort(byName), ...places().municipalities.slice().sort(byName)]
    .filter((p) => !seen.has(p.slug) && seen.add(p.slug))
    .map((p) => option(p, has));
}

/**
 * Places matching what the visitor typed (accents optional): names that start
 * with it, then names with a word that starts with it, then names containing it.
 * Within each group places with salons come first, then municipalities, then
 * bigger towns before villages.
 */
export function searchPlaces(query: string, listed: string[] = [], limit = 30): CityOption[] {
  const q = fold(query);
  if (!q) return [];
  const has = withSalons(listed);
  const hits: { p: Place; r: number }[] = [];
  for (const p of places().all) {
    let r = -1;
    if (p.folded.startsWith(q)) r = 0;
    else if (p.folded.split(/[\s-]+/).some((w) => w.startsWith(q))) r = 1;
    else if (q.length >= 3 && p.folded.includes(q)) r = 2;
    if (r >= 0) hits.push({ p, r: r * 4 + (has.has(p.slug) ? 0 : 2) + (p.isMunicipality ? 0 : 1) });
  }
  return hits
    .sort((a, b) => a.r - b.r || b.p.size - a.p.size || a.p.name.localeCompare(b.p.name, "pt"))
    .slice(0, limit)
    .map((h) => option(h.p, has));
}
