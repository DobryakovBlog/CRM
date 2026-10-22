import { supportUrl } from "@/lib/support";

// Paper plane in the site's line style, not the Telegram logo.
export function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 4 3 11.2l6.2 2.3L18 7.5l-6.8 7.4.1 5.1 3.1-3.5 4.3 3.2z" />
    </svg>
  );
}

/** Opens the support bot in Telegram; renders nothing until the bot is set. */
export function SupportLink({ label, className = "" }: { label: string; className?: string }) {
  const href = supportUrl();
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1.5 ${className}`}>
      <TelegramIcon />
      {label}
    </a>
  );
}
