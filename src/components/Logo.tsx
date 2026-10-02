export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-start gap-1">
      <span className={`font-display text-[26px] leading-none tracking-tight ${inverted ? "text-white" : "text-ink"}`}>
        Astrabela
      </span>
      {/* "astra" = stars: a small four-point star as the mark */}
      <svg viewBox="0 0 12 12" className="mt-0.5 h-2.5 w-2.5 text-gold" aria-hidden>
        <path d="M6 0 7.1 4.9 12 6 7.1 7.1 6 12 4.9 7.1 0 6 4.9 4.9Z" fill="currentColor" />
      </svg>
    </span>
  );
}
