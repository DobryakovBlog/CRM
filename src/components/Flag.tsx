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
  if (locale === "da") {
    return (
      <svg viewBox="0 0 37 28" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="37" height="28" fill="#C8102E" />
        <rect x="12" width="4" height="28" fill="#fff" />
        <rect y="12" width="37" height="4" fill="#fff" />
      </svg>
    );
  }
  if (locale === "bg") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#D62612" />
        <rect width="30" height="13.33" fill="#00966E" />
        <rect width="30" height="6.67" fill="#fff" />
      </svg>
    );
  }
  if (locale === "ro") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="10" height="20" fill="#002B7F" />
        <rect x="10" width="10" height="20" fill="#FCD116" />
        <rect x="20" width="10" height="20" fill="#CE1126" />
      </svg>
    );
  }
  if (locale === "hr") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#171796" />
        <rect width="30" height="13.33" fill="#fff" />
        <rect width="30" height="6.67" fill="#FF0000" />
        <path d="M12 5h6v6c0 2.2-1.5 3.5-3 4.2-1.5-.7-3-2-3-4.2z" fill="#fff" stroke="#FF0000" strokeWidth="0.4" />
        <path d="M12 5h2v2h-2zM16 5h2v2h-2zM14 7h2v2h-2zM12 9h2v2h-2zM16 9h2v2h-2zM14 11h2v2h-2z" fill="#FF0000" />
      </svg>
    );
  }
  if (locale === "sl") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#ED1C24" />
        <rect width="30" height="13.33" fill="#005DA4" />
        <rect width="30" height="6.67" fill="#fff" />
        <path d="M6 3.5h6v5.5c0 2.2-1.4 3.4-3 4.2-1.6-.8-3-2-3-4.2z" fill="#005DA4" stroke="#ED1C24" strokeWidth="0.6" />
        <path d="M6.4 9.6l1.4-2 1.2 1.5 1.2-1.5 1.4 2z" fill="#fff" />
        <circle cx="7.6" cy="5.2" r="0.45" fill="#FFDD00" />
        <circle cx="9" cy="4.6" r="0.45" fill="#FFDD00" />
        <circle cx="10.4" cy="5.2" r="0.45" fill="#FFDD00" />
      </svg>
    );
  }
  if (locale === "hu") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#436F4D" />
        <rect width="30" height="13.33" fill="#fff" />
        <rect width="30" height="6.67" fill="#CD2A3E" />
      </svg>
    );
  }
  if (locale === "sk") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#EE1C25" />
        <rect width="30" height="13.33" fill="#0B4EA2" />
        <rect width="30" height="6.67" fill="#fff" />
        <path d="M6.5 4.5h7v6.5c0 2.6-1.6 4.1-3.5 5-1.9-.9-3.5-2.4-3.5-5z" fill="#EE1C25" stroke="#fff" strokeWidth="0.6" />
        <path d="M9.6 6h0.8v7.5h-0.8zM8.2 7.6h3.6v0.8h-3.6zM8.6 9.6h2.8v0.8h-2.8z" fill="#fff" />
        <path d="M6.9 13.2c1-.9 2.1-.9 3.1 0 1-.9 2.1-.9 3.1 0-.6 1.3-1.7 2.1-3.1 2.8-1.4-.7-2.5-1.5-3.1-2.8z" fill="#0B4EA2" />
      </svg>
    );
  }
  if (locale === "cs") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#D7141A" />
        <rect width="30" height="10" fill="#fff" />
        <path d="M0 0 L15 10 L0 20 Z" fill="#11457E" />
      </svg>
    );
  }
  if (locale === "pl") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#DC143C" />
        <rect width="30" height="10" fill="#fff" />
      </svg>
    );
  }
  if (locale === "nl") {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="20" fill="#21468B" />
        <rect width="30" height="13.34" fill="#fff" />
        <rect width="30" height="6.67" fill="#AE1C28" />
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
