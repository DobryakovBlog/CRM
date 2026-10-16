/** Paw print: four toes and a pad. */
export function PawIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <ellipse cx="6" cy="9.5" rx="2.1" ry="2.6" transform="rotate(-18 6 9.5)" />
      <ellipse cx="10" cy="5.8" rx="2.1" ry="2.7" transform="rotate(-6 10 5.8)" />
      <ellipse cx="14.4" cy="5.8" rx="2.1" ry="2.7" transform="rotate(6 14.4 5.8)" />
      <ellipse cx="18.3" cy="9.5" rx="2.1" ry="2.6" transform="rotate(18 18.3 9.5)" />
      <path d="M12.2 11.2c-2.4 0-5.6 3.6-5.6 6.2 0 1.7 1.2 2.6 2.7 2.6 1.1 0 1.8-.6 2.9-.6s1.8.6 2.9.6c1.5 0 2.7-.9 2.7-2.6 0-2.6-3.2-6.2-5.6-6.2z" />
    </svg>
  );
}

/** "Pet friendly" switch at the end of the salon and restaurant forms. */
export function PetFriendlyToggle({ label, hint, defaultChecked }: { label: string; hint: string; defaultChecked?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-md border border-line bg-white p-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-gold-deep">
        <PawIcon />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <input type="checkbox" name="petFriendly" defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-mist transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-ink peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-gold"
      />
    </label>
  );
}

/** Badge on public pages and cards. */
export function PetFriendlyBadge({ label, onDark = false }: { label: string; onDark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
        onDark ? "border-gold/40 text-gold-soft" : "border-gold-soft bg-sand text-gold-deep"
      }`}
    >
      <PawIcon className="h-4 w-4" />
      {label}
    </span>
  );
}
