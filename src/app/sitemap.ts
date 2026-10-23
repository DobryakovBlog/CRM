import type { MetadataRoute } from "next";
import { or } from "drizzle-orm";
import { db } from "@/db";
import { salons } from "@/db/schema";
import { routing } from "@/i18n/routing";
import { siteIsPublic } from "@/lib/indexing";
import { siteOrigin } from "@/lib/origin";
import { listedCities, listedCondition } from "@/server/catalog";
import { listedRestaurantCities, restaurantListedCondition } from "@/server/menu";

// Read from the database on each request, so new salons appear without a redeploy.
export const dynamic = "force-dynamic";

const STATIC_PAGES = ["", "/restaurants", "/business", "/privacy", "/terms"];

// Closed until launch, like robots.ts: empty unless SITE_PUBLIC=1.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteIsPublic()) return [];
  const origin = await siteOrigin();
  const now = new Date();
  const [listed, salonCities, restaurantCities] = await Promise.all([
    db
      .select({ slug: salons.slug, kind: salons.kind })
      .from(salons)
      .where(or(listedCondition(now), restaurantListedCondition(now))),
    listedCities(db),
    listedRestaurantCities(db),
  ]);
  const paths = [
    ...STATIC_PAGES,
    ...salonCities.map((c) => `/search?city=${encodeURIComponent(c)}`),
    ...restaurantCities.map((c) => `/restaurants?city=${encodeURIComponent(c)}`),
    ...listed.map((s) => `/${s.kind === "restaurant" ? "restaurant" : "salon"}/${s.slug}`),
  ];
  return paths.map((path) => ({
    url: `${origin}/${routing.defaultLocale}${path}`,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${origin}/${l}${path}`])) },
  }));
}
