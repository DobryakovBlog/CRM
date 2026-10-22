"use client";

import { useState, useTransition } from "react";

type State = { liked: boolean; count: number };

/** Heart with a counter under a dish; the server keeps one like per visitor. */
export function LikeButton({
  initial,
  label,
  onToggle,
}: {
  initial: State;
  label: string;
  onToggle: () => Promise<State | null>;
}) {
  const [state, setState] = useState(initial);
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      aria-pressed={state.liked}
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={() => {
        const before = state;
        setState({ liked: !before.liked, count: Math.max(0, before.count + (before.liked ? -1 : 1)) });
        start(async () => setState((await onToggle().catch(() => null)) ?? before));
      }}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
        state.liked ? "text-red-700" : "text-muted hover:text-ink"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill={state.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
      {state.count > 0 && <span className="tabular-nums">{state.count}</span>}
    </button>
  );
}
