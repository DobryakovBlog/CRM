/** Digits people type to get past a phone field: 999999, 123456789 and the like. */
export function looksMadeUp(nationalNumber: string) {
  const d = nationalNumber.replace(/\D/g, "");
  if (/(\d)\1{5,}/.test(d)) return true;
  return ["0123456789", "9876543210"].some((run) => {
    for (let i = 0; i + 6 <= run.length; i++) if (d.includes(run.slice(i, i + 6))) return true;
    return false;
  });
}

export const DEFAULT_PHONE_COUNTRY = "PT";
