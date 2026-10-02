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
