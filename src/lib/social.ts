// Links a salon or restaurant can show on its public page. Owners may type a
// handle ("@studio"), a bare address or a full link; we store a clean https link
// and only accept the network's own domains, so a page can't link anywhere else
// under an Instagram icon.

import type { Country } from "./cities";

export const SOCIAL_NETWORKS = ["instagram", "facebook", "tiktok", "whatsapp", "website"] as const;
export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];
export type SocialLinks = Partial<Record<SocialNetwork, string>>;

const PROFILE: Record<"instagram" | "facebook" | "tiktok", { hosts: string[]; base: string; handle: RegExp }> = {
  instagram: { hosts: ["instagram.com"], base: "https://www.instagram.com/", handle: /^[A-Za-z0-9._]{1,30}$/ },
  facebook: { hosts: ["facebook.com", "fb.com"], base: "https://www.facebook.com/", handle: /^[A-Za-z0-9.\-]{2,80}$/ },
  tiktok: { hosts: ["tiktok.com"], base: "https://www.tiktok.com/@", handle: /^[A-Za-z0-9._]{2,24}$/ },
};

function parseUrl(input: string): URL | null {
  try {
    const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    url.protocol = "https:";
    return url;
  } catch {
    return null;
  }
}

// National numbers typed without the country code: Portuguese 9xx/2xx, Spanish 6xx-9xx,
// French 0x xx xx xx xx (the leading 0 drops after +33), Italian mobiles 3xx xxx xxxx,
// German mobiles 015x/016x/017x (the leading 0 drops after +49), Dutch mobiles 06 xxxxxxxx, Belgian mobiles 04xx xx xx xx, Irish mobiles 08x xxx xxxx, Luxembourg mobiles 6xx xxx xxx, Austrian mobiles 06xx xxxxxxx, Swiss mobiles 07x xxx xx xx, Polish mobiles xxx xxx xxx, Czech mobiles 6xx/7xx xxx xxx, Slovak mobiles 09xx xxx xxx (the leading 0 drops after +421), Hungarian mobiles 06 20/30/31/50/70 xxx xxxx (the leading 06 drops after +36), Slovenian mobiles 0xx xxx xxx (the leading 0 drops after +386), Croatian mobiles 09x xxx xxxx (the leading 0 drops after +385), Romanian mobiles 07xx xxx xxx (the leading 0 drops after +40), Bulgarian mobiles 08x xxx xxxx (the leading 0 drops after +359), Danish numbers xx xx xx xx (no trunk 0), Swedish mobiles 07x xxx xx xx (the leading 0 drops after +46), Norwegian mobiles 4xx xx xxx / 9xx xx xxx, Finnish mobiles 04x / 050 xxx xxxx (the leading 0 drops after +358), Estonian mobiles 5xxx xxxx, Latvian mobiles 2xxx xxxx.
const LOCAL_NUMBER: Record<Country, { code: string; pattern: RegExp; trunk?: RegExp }> = {
  pt: { code: "351", pattern: /^[29]\d{8}$/ },
  es: { code: "34", pattern: /^[6789]\d{8}$/ },
  fr: { code: "33", pattern: /^0[1-9]\d{8}$/ },
  it: { code: "39", pattern: /^3\d{8,9}$/ },
  de: { code: "49", pattern: /^01[5-7]\d{8,9}$/ },
  nl: { code: "31", pattern: /^06\d{8}$/ },
  be: { code: "32", pattern: /^04\d{8}$/ },
  ie: { code: "353", pattern: /^08\d{8}$/ },
  lu: { code: "352", pattern: /^6\d{8}$/ },
  at: { code: "43", pattern: /^06\d{8,11}$/ },
  ch: { code: "41", pattern: /^07[5-9]\d{7}$/ },
  pl: { code: "48", pattern: /^[4-8]\d{8}$/ },
  cz: { code: "420", pattern: /^[67]\d{8}$/ },
  sk: { code: "421", pattern: /^0?9\d{8}$/ },
  si: { code: "386", pattern: /^0?(30|31|40|41|51|6[4-9]|7[01])\d{6}$/ },
  hr: { code: "385", pattern: /^0?9[125789]\d{6,7}$/ },
  ro: { code: "40", pattern: /^0?7\d{8}$/ },
  bg: { code: "359", pattern: /^0?8[789]\d{7}$/ },
  dk: { code: "45", pattern: /^[2-9]\d{7}$/ },
  se: { code: "46", pattern: /^0?7[02369]\d{7}$/ },
  no: { code: "47", pattern: /^[49]\d{7}$/ },
  fi: { code: "358", pattern: /^0?(4\d|50)\d{5,8}$/ },
  ee: { code: "372", pattern: /^5\d{6,7}$/ },
  lv: { code: "371", pattern: /^2\d{7}$/ },
  hu: { code: "36", pattern: /^(06)?(20|30|31|50|70)\d{7}$/, trunk: /^06/ },
};

const onHost = (url: URL, hosts: string[]) =>
  hosts.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));

/** Clean link for the network, "" for an empty field, or null when the value isn't valid. */
/** country: the business's country, for WhatsApp numbers typed without their +code. */
export function normalizeSocial(network: SocialNetwork, raw: string, country: Country = "pt"): string | null {
  const value = raw.trim();
  if (!value) return "";
  if (network === "whatsapp") {
    const url = /wa\.me|whatsapp\.com/i.test(value) ? parseUrl(value) : null;
    let digits = (url ? url.pathname + url.search : value).replace(/\D/g, "");
    const local = LOCAL_NUMBER[country];
    if (local.pattern.test(digits)) digits = local.code + digits.replace(local.trunk ?? /^0/, "");
    return digits.length >= 8 && digits.length <= 15 ? `https://wa.me/${digits}` : null;
  }
  if (network === "website") {
    const url = parseUrl(value);
    return url && !url.username && !url.password ? url.toString() : null;
  }
  const p = PROFILE[network];
  const handle = value.replace(/^@/, "");
  if (p.handle.test(handle) && !handle.includes("..")) return p.base + handle;
  const url = parseUrl(value);
  if (!url || !onHost(url, p.hosts) || url.pathname.length < 2) return null;
  url.hash = "";
  return url.toString();
}

/** Short label for a stored link, e.g. "@studio" or "studio.pt". */
export function socialLabel(network: SocialNetwork, link: string): string {
  const url = new URL(link);
  if (network === "whatsapp") return `+${url.pathname.slice(1)}`;
  if (network === "website") return url.hostname.replace(/^www\./, "") + (url.pathname === "/" ? "" : url.pathname);
  const name = url.pathname.split("/").filter(Boolean)[0] ?? "";
  return name.startsWith("@") ? name : `@${name}`;
}
