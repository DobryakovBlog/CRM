/** A "return to" path on this site only: never another host. */
export function safeNext(value: unknown) {
  const v = typeof value === "string" ? value : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") ? v : "";
}
