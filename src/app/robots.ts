import type { MetadataRoute } from "next";
import { siteIsPublic } from "@/lib/indexing";

// Closed until launch: crawlers are turned away unless SITE_PUBLIC=1.
export default function robots(): MetadataRoute.Robots {
  return siteIsPublic()
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/pt/business/", "/en/business/", "/pt/booking/", "/en/booking/"] } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
