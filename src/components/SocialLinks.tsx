import { getTranslations } from "next-intl/server";
import { SOCIAL_NETWORKS, socialLabel, type SocialLinks as Links, type SocialNetwork } from "@/lib/social";

// Line icons drawn on a 24px grid in the site's stroke style, not brand logos.
const ICONS: Record<SocialNetwork, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M14.5 8H17V4.5h-2.5A4 4 0 0 0 10.5 8.5V11H8v3.5h2.5V21H14v-6.5h2.6L17 11h-3V9a1 1 0 0 1 1-1z" />,
  tiktok: <path d="M14 3.5v11.3a3.7 3.7 0 1 1-3.7-3.7M14 3.5c.4 2.6 2.2 4.3 4.8 4.5" />,
  whatsapp: (
    <>
      <path d="M4.5 19.5l1.2-3.6A8.2 8.2 0 1 1 8.6 19z" />
      <path d="M9.3 8.6c.2-.5.5-.5.8-.5h.5l.8 1.9-.6.8c.5 1 1.3 1.8 2.3 2.3l.8-.6 1.9.8v.5c0 .3 0 .6-.5.8-.6.3-1.7.4-3.3-.6a8 8 0 0 1-2.5-2.5c-1-1.6-.9-2.7-.6-3.3z" />
    </>
  ),
  website: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.2-3.5-8.5S9.7 5.9 12 3.5z" />
    </>
  ),
};

/** The business's own links, shown as icon chips; "onDark" for the navy page header. */
export async function SocialLinks({ links, onDark = false, className = "" }: { links: Links; onDark?: boolean; className?: string }) {
  const nets = SOCIAL_NETWORKS.filter((n) => links[n]);
  if (nets.length === 0) return null;
  const t = await getTranslations("social");
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {nets.map((n) => (
        <li key={n}>
          <a
            href={links[n]}
            target="_blank"
            rel="noopener noreferrer nofollow"
            title={`${t(n)}: ${socialLabel(n, links[n]!)}`}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              onDark
                ? "border-white/25 text-mist hover:border-gold hover:text-white"
                : "border-line bg-white text-ink hover:border-cobalt hover:text-cobalt"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {ICONS[n]}
            </svg>
            <span>{n === "website" ? socialLabel(n, links[n]!) : t(n)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
