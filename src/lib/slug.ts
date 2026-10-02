/** "Salão Bela Vista, Lisboa" -> "salao-bela-vista-lisboa" */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const CITY_NAMES: Record<string, string> = {
  lisboa: "Lisboa",
  porto: "Porto",
  faro: "Faro",
  braga: "Braga",
  coimbra: "Coimbra",
  cascais: "Cascais",
};

export function cityName(slug: string): string {
  return CITY_NAMES[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
