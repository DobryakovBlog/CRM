export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className={`font-display text-2xl leading-none ${inverted ? "text-white" : "text-ink"}`}>Beauty</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">Advisor</span>
    </span>
  );
}
