export function formatPrice(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "pt-PT", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
}

/** Ratings are stored ×100 (e.g. 467 = 4.67). */
export function formatRating(x100: number) {
  return (x100 / 100).toFixed(1);
}

export function formatDateTime(date: Date, timezone: string, locale: string, opts?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "pt-PT", {
    timeZone: timezone,
    ...(opts ?? { dateStyle: "full", timeStyle: "short" }),
  }).format(date);
}

export function formatTime(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("pt-PT", { timeZone: timezone, hour: "2-digit", minute: "2-digit" }).format(date);
}

/** YYYY-MM-DD of an instant in a timezone. */
export function localDate(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(date);
}
