import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/max";
import { DEFAULT_PHONE_COUNTRY, looksMadeUp } from "./phone-rules";

/**
 * Checks a phone number against the real numbering plan of its country (full metadata)
 * and returns it in international form (+351912000111), or null when it cannot exist.
 */
export function normalizePhone(raw: string, country: string = DEFAULT_PHONE_COUNTRY): string | null {
  const value = raw.trim();
  if (!value) return null;
  const phone = parsePhoneNumberFromString(value, country.toUpperCase() as CountryCode);
  if (!phone || !phone.isValid() || looksMadeUp(phone.nationalNumber)) return null;
  return phone.number;
}

/** "+351912000111" → "+351 912 000 111", for showing in the cabinet. */
export function formatPhone(value: string) {
  const phone = value.startsWith("+") ? parsePhoneNumberFromString(value) : undefined;
  return phone?.isValid() ? phone.formatInternational() : value;
}
