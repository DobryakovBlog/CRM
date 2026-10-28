import data from "@/data/pt-places.json";
import esData from "@/data/es-places.json";
import frData from "@/data/fr-places.json";
import itData from "@/data/it-places.json";
import { slugify } from "./slug";

// Portugal: every municipality (308) and every locality in the CTT postal tables
// (about 33,000), built by scripts/build-places.ts. A municipality's slug is its
// name ("lisboa"); a locality's slug adds its municipality ("alfama-lisboa").
// Other countries: every municipality, built by scripts/build-<country>-places.ts
// (Spain 8,132, France 34,875 communes, Italy 7,904 comuni). Its slug is its name ("madrid"), with the
// province or department added when the name is taken ("castejon-navarra").

export type Country = "pt" | "es" | "fr" | "it";

type MunicipalData = { areas: string[]; municipalities: unknown };
// Order matters: a name already taken by an earlier country gets its area added.
const MUNICIPAL: [Exclude<Country, "pt">, MunicipalData][] = [
  ["es", esData],
  ["fr", frData],
  ["it", itData],
];

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
  const byCountry = { pt: municipalities } as Record<Country, Place[]>;
  for (const [country, data] of MUNICIPAL) {
    const rows = data.municipalities as [string, number, number][];
    const taken = new Map<string, number>();
    for (const [name] of rows) taken.set(slugify(name), (taken.get(slugify(name)) ?? 0) + 1);
    byCountry[country] = rows.map(([name, a, size], i) => {
      const area = data.areas[a];
      let slug = slugify(name);
      if (taken.get(slug)! > 1 || bySlug.has(slug)) slug = slugify(`${name} ${area.split("/")[0]}`);
      if (bySlug.has(slug)) slug = `${slug}-${i}`; // same name twice in one area
      const p: Place = { slug, country, name, municipality: slug, area, isMunicipality: true, size, folded: fold(name) };
      bySlug.set(slug, p);
      members.set(slug, [slug]);
      return p;
    });
  }
  return { bySlug, municipalities: byCountry, all: [...bySlug.values()], members };
}

const places = () => (index ??= build());

export const isPlace = (slug: string) => places().bySlug.has(slug);
export const placeBySlug = (slug: string) => places().bySlug.get(slug);
export const placeCountry = (slug: string): Country => placeBySlug(slug)?.country ?? "pt";

const TIMEZONES: Record<Country, string> = { pt: "Europe/Lisbon", es: "Europe/Madrid", fr: "Europe/Paris", it: "Europe/Rome" };
// Areas on another clock than their country's capital.
const AREA_TIMEZONES: Record<string, string> = {
  "Açores": "Atlantic/Azores",
  "Las Palmas": "Atlantic/Canary",
  "Santa Cruz de Tenerife": "Atlantic/Canary",
  Guadeloupe: "America/Guadeloupe",
  Martinique: "America/Martinique",
  Guyane: "America/Cayenne",
  "La Réunion": "Indian/Reunion",
  Mayotte: "Indian/Mayotte",
};

/** Time zone for a business in this place: the Azores, Canaries and French overseas departments keep their own. */
export function placeTimezone(slug: string) {
  const p = placeBySlug(slug);
  if (!p) return TIMEZONES.pt;
  return AREA_TIMEZONES[placeBySlug(p.municipality)?.area ?? p.area] ?? TIMEZONES[p.country];
}

/** City a country's search starts with when nothing else is known. */
export const DEFAULT_CITY: Record<Country, string> = { pt: "lisboa", es: "madrid", fr: "paris", it: "roma" };

/** Country a visitor reading this language most likely searches in; Portugal otherwise. */
const LOCALE_COUNTRY: Record<string, Country> = { es: "es", fr: "fr", it: "it" };
export const localeCountry = (locale: string): Country => LOCALE_COUNTRY[locale] ?? "pt";

export function cityName(slug: string): string {
  return placeBySlug(slug)?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Slugs a city search covers: a municipality includes all its localities. */
export function placesIn(slug: string): string[] {
  return places().members.get(slug) ?? [slug];
}

// Countries shown in search. Portugal, Spain, France and Italy are open; the rest tell visitors where we are heading.
export const COUNTRIES = [
  { code: "pt", open: true },
  { code: "es", open: true },
  { code: "fr", open: true },
  { code: "it", open: true },
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
 * Portuguese municipality, or another country's biggest cities (thousands of
 * municipalities are too many to send), by name. The rest come from
 * searchPlaces as the visitor types.
 */
export function cityOptions(listed: string[], current?: string, country: Country = "pt"): CityOption[] {
  const has = withSalons(listed);
  const byName = (a: Place, b: Place) => a.name.localeCompare(b.name, country);
  const first = [...has, ...(current ? [current] : [])]
    .map(placeBySlug)
    .filter((p): p is Place => p?.country === country);
  const all = places().municipalities[country];
  const base = country === "pt" ? all : all.filter((p) => p.size > 1).sort((a, b) => b.size - a.size).slice(0, 120);
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
export const isOpenCountry = (code: string | null | undefined): code is Country =>
  (OPEN_COUNTRIES as string[]).includes(code ?? "");

/**
 * Everything the country + city fields start with: the country of the current city, else
 * the country the visitor is in (from their IP, when we are open there), else their
 * language's country; and for each open country its city list and the city picked first
 * (the current one, one with businesses, or the capital).
 */
export function cityFieldSetup(listed: string[], current: string | undefined, locale: string, visitorCountry?: string) {
  const defaultCountry: Country =
    current && isPlace(current)
      ? placeCountry(current)
      : isOpenCountry(visitorCountry)
        ? visitorCountry
        : localeCountry(locale);
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
export const phoneCountry = (slug: string) => placeCountry(slug).toUpperCase() as "PT" | "ES" | "FR" | "IT";
