import type { MetadataRoute } from "next";
import { siteIsPublic } from "@/lib/indexing";
import { siteOrigin } from "@/lib/origin";

// Closed until launch: crawlers are turned away unless SITE_PUBLIC=1.
export default async function robots(): Promise<MetadataRoute.Robots> {
  if (!siteIsPublic()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/pt/business/", "/en/business/", "/pt/booking/", "/en/booking/"] },
    sitemap: `${await siteOrigin()}/sitemap.xml`,
  };
}
