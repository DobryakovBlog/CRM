import { formatRating } from "@/lib/format";

export function Stars({ x100, count, newLabel }: { x100: number; count?: number; newLabel?: string }) {
  if (count === 0) {
    return (
      <span className="shrink-0 rounded-full border border-gold-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-deep">
        {newLabel}
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-sm tabular-nums">
      <span className="text-gold" aria-hidden>
        ★
      </span>
      <span className="font-semibold">{formatRating(x100)}</span>
      {count !== undefined && <span className="text-muted">({count})</span>}
    </span>
  );
}
