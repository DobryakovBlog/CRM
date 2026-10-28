import { headers } from "next/headers";

/**
 * Country the visitor is browsing from, as Vercel reads it from the IP address
 * (x-vercel-ip-country), in lower case. Used only to preselect the search country;
 * neither the IP nor the country is stored.
 */
export async function visitorCountry(): Promise<string | undefined> {
  return (await headers()).get("x-vercel-ip-country")?.toLowerCase() || undefined;
}
