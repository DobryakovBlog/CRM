// Portuguese cities offered in search and at salon sign-up (slug -> display name).
// Mainland district capitals, the big metro towns and the Algarve, plus Madeira and the Azores.
export const PT_CITIES: Record<string, string> = {
  lisboa: "Lisboa",
  porto: "Porto",
  "vila-nova-de-gaia": "Vila Nova de Gaia",
  braga: "Braga",
  coimbra: "Coimbra",
  aveiro: "Aveiro",
  faro: "Faro",
  albufeira: "Albufeira",
  loule: "Loulé",
  lagos: "Lagos",
  portimao: "Portimão",
  setubal: "Setúbal",
  almada: "Almada",
  cascais: "Cascais",
  oeiras: "Oeiras",
  sintra: "Sintra",
  amadora: "Amadora",
  matosinhos: "Matosinhos",
  maia: "Maia",
  guimaraes: "Guimarães",
  "viana-do-castelo": "Viana do Castelo",
  viseu: "Viseu",
  leiria: "Leiria",
  santarem: "Santarém",
  evora: "Évora",
  beja: "Beja",
  portalegre: "Portalegre",
  "castelo-branco": "Castelo Branco",
  guarda: "Guarda",
  "vila-real": "Vila Real",
  braganca: "Bragança",
  funchal: "Funchal",
  "ponta-delgada": "Ponta Delgada",
  "angra-do-heroismo": "Angra do Heroísmo",
};

export const CITY_SLUGS = Object.keys(PT_CITIES);

export function cityName(slug: string): string {
  return PT_CITIES[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
