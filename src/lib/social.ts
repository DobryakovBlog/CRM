// Links a salon or restaurant can show on its public page. Owners may type a
// handle ("@studio"), a bare address or a full link; we store a clean https link
// and only accept the network's own domains, so a page can't link anywhere else
// under an Instagram icon.

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

const onHost = (url: URL, hosts: string[]) =>
  hosts.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));

/** Clean link for the network, "" for an empty field, or null when the value isn't valid. */
export function normalizeSocial(network: SocialNetwork, raw: string): string | null {
  const value = raw.trim();
  if (!value) return "";
  if (network === "whatsapp") {
    const url = /wa\.me|whatsapp\.com/i.test(value) ? parseUrl(value) : null;
    let digits = (url ? url.pathname + url.search : value).replace(/\D/g, "");
    if (digits.length === 9 && /^[29]/.test(digits)) digits = `351${digits}`; // Portuguese number without +351
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
