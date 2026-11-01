/** "Salão Bela Vista, Lisboa" -> "salao-bela-vista-lisboa" */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // Nordic letters that do not decompose ("København" -> "kobenhavn"). Polish ł and Croatian đ are left out on
    // purpose: places and salons there already have slugs without them.
    .replace(/ø/g, "o")
    .replace(/æ/g, "ae")
    .replace(/ð/g, "d")
    .replace(/þ/g, "th")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export { cityName } from "./cities";
