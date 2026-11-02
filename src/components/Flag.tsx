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
  if (locale === "sq") {
    return (
      <svg viewBox="0 0 14 10" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="14" height="10" fill="#E41E20" />
        <g fill="#000">
          <path d="M7 2.2 L8.4 4 L11.6 2.6 L10.6 4.6 L12 4.8 L9.4 6 L8 6.2 L8.6 8.4 L7 7.4 L5.4 8.4 L6 6.2 L4.6 6 L2 4.8 L3.4 4.6 L2.4 2.6 L5.6 4 Z" />
          <circle cx="6.1" cy="2.4" r="0.7" />
          <circle cx="7.9" cy="2.4" r="0.7" />
        </g>
      </svg>
    );
  }
  if (locale === "mk") {
    return (
      <svg viewBox="0 0 20 10" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="20" height="10" fill="#D20000" />
        <g fill="#FFE600">
          <polygon points="9,0 11,0 10,5" />
          <polygon points="9,10 11,10 10,5" />
          <polygon points="0,4 0,6 10,5" />
          <polygon points="20,4 20,6 10,5" />
          <polygon points="0,0 3,0 10,5 0,1.5" />
          <polygon points="20,0 17,0 10,5 20,1.5" />
          <polygon points="0,10 3,10 10,5 0,8.5" />
          <polygon points="20,10 17,10 10,5 20,8.5" />
        </g>
        <circle cx="10" cy="5" r="2" fill="#D20000" />
        <circle cx="10" cy="5" r="1.6" fill="#FFE600" />
      </svg>
    );
  }
  if (locale === "sr") {
    return (
      <svg viewBox="0 0 3 2" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="3" height="2" fill="#fff" />
        <rect width="3" height="0.667" fill="#C6363C" />
        <rect y="0.667" width="3" height="0.667" fill="#0C4076" />
      </svg>
    );
  }
  if (locale === "is") {
    return (
      <svg viewBox="0 0 25 18" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="25" height="18" fill="#02529C" />
        <rect x="7" width="4" height="18" fill="#fff" />
        <rect y="7" width="25" height="4" fill="#fff" />
        <rect x="8" width="2" height="18" fill="#DC1E35" />
        <rect y="8" width="25" height="2" fill="#DC1E35" />
      </svg>
    );
  }
  if (locale === "el") {
    return (
      <svg viewBox="0 0 27 18" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="27" height="18" fill="#0D5EAF" />
        {[2, 6, 10, 14].map((y) => (
          <rect key={y} y={y} width="27" height="2" fill="#fff" />
        ))}
        <rect width="10" height="10" fill="#0D5EAF" />
        <rect y="4" width="10" height="2" fill="#fff" />
        <rect x="4" width="2" height="10" fill="#fff" />
      </svg>
    );
  }
  if (locale === "lt") {
    return (
      <svg viewBox="0 0 30 18" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="30" height="18" fill="#C1272D" />
        <rect width="30" height="12" fill="#006A44" />
        <rect width="30" height="6" fill="#FDB913" />
      </svg>
    );
  }
  if (locale === "lv") {
    return (
      <svg viewBox="0 0 20 10" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="20" height="10" fill="#9E3039" />
        <rect y="4" width="20" height="2" fill="#fff" />
      </svg>
    );
  }
  if (locale === "et") {
    return (
      <svg viewBox="0 0 33 21" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="33" height="21" fill="#fff" />
        <rect width="33" height="14" fill="#000" />
        <rect width="33" height="7" fill="#0072CE" />
      </svg>
    );
  }
  if (locale === "fi") {
    return (
      <svg viewBox="0 0 18 11" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="18" height="11" fill="#fff" />
        <rect x="5" width="3" height="11" fill="#002F6C" />
        <rect y="4" width="18" height="3" fill="#002F6C" />
      </svg>
    );
  }
  if (locale === "nb") {
    return (
      <svg viewBox="0 0 22 16" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="22" height="16" fill="#BA0C2F" />
        <rect x="6" width="4" height="16" fill="#fff" />
        <rect y="6" width="22" height="4" fill="#fff" />
        <rect x="7" width="2" height="16" fill="#00205B" />
        <rect y="7" width="22" height="2" fill="#00205B" />
      </svg>
    );
  }
  if (locale === "sv") {
    return (
      <svg viewBox="0 0 16 10" className={`${className} shrink-0 rounded-[2px] ring-1 ring-black/10`} aria-hidden>
        <rect width="16" height="10" fill="#006AA7" />
        <rect x="5" width="2" height="10" fill="#FECC02" />
        <rect y="4" width="16" height="2" fill="#FECC02" />
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
