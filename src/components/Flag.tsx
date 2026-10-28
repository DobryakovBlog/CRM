// Inline SVG flags: emoji flags do not render on Windows.
export function Flag({ locale, className = "h-3.5 w-5" }: { locale: string; className?: string }) {
  if (locale === "pt") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#DA291C" />
        <rect width="12" height="20" fill="#046A38" />
        <circle cx="12" cy="10" r="4.2" fill="#FFE900" />
        <circle cx="12" cy="10" r="2.6" fill="#DA291C" />
        <rect x="10.6" y="8.3" width="2.8" height="3.4" rx="0.6" fill="#fff" />
      </svg>
    );
  }
  if (locale === "de") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#FFCE00" />
        <rect width="30" height="13.34" fill="#DD0000" />
        <rect width="30" height="6.67" fill="#000" />
      </svg>
    );
  }
  if (locale === "it") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#CE2B37" />
        <rect width="20" height="20" fill="#F4F5F0" />
        <rect width="10" height="20" fill="#009246" />
      </svg>
    );
  }
  if (locale === "fr") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#CE1126" />
        <rect width="20" height="20" fill="#fff" />
        <rect width="10" height="20" fill="#002654" />
      </svg>
    );
  }
  if (locale === "es") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#AA151B" />
        <rect y="5" width="30" height="10" fill="#F1BF00" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 30" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
      <clipPath id="uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
