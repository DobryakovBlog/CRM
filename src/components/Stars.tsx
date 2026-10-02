import { formatRating } from "@/lib/format";

export function Stars({ x100, count, newLabel }: { x100: number; count?: number; newLabel?: string }) {
  if (count === 0) return <span className="text-sm text-stone-500">{newLabel}</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-amber-500" aria-hidden>
        ★
      </span>
      <span className="font-semibold">{formatRating(x100)}</span>
      {count !== undefined && <span className="text-stone-500">({count})</span>}
    </span>
  );
}
