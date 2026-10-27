"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { DEFAULT_PHONE_COUNTRY, looksMadeUp } from "@/lib/phone-rules";

/**
 * Country code picker (the salon's country first) plus the rest of the number. Posts the full number
 * as `name`; the server checks it again against the complete numbering plan.
 */
const noop = () => () => {};

export function PhoneInput({
  name,
  id,
  locale,
  label,
  invalidText,
  required = true,
  defaultCountry = DEFAULT_PHONE_COUNTRY,
}: {
  name: string;
  id: string;
  locale: string;
  label: string;
  invalidText: string;
  required?: boolean;
  /** Country the picker starts on and lists first: the salon's country. */
  defaultCountry?: CountryCode;
}) {
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [rest, setRest] = useState("");
  const [touched, setTouched] = useState(false);

  // Country names come from the browser's Intl data, which differs from the server's,
  // so the full list is only drawn after hydration.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const countries = useMemo(() => {
    if (!mounted) return [{ code: country, label: "" }];
    const names = new Intl.DisplayNames([locale], { type: "region" });
    const all = getCountries()
      .map((code) => ({ code, label: `${names.of(code) ?? code} +${getCountryCallingCode(code)}` }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
    const first = all.find((c) => c.code === defaultCountry)!;
    return [first, ...all.filter((c) => c !== first)];
  }, [locale, mounted, country, defaultCountry]);

  const digits = rest.replace(/[^\d+]/g, "");
  // A number pasted with its own +code wins over the picker.
  const full = digits.startsWith("+") ? digits : digits ? `+${getCountryCallingCode(country)}${digits.replace(/^0+/, "")}` : "";
  const parsed = full ? parsePhoneNumberFromString(full) : undefined;
  const valid = !!parsed?.isValid() && !looksMadeUp(parsed.nationalNumber);
  const showError = touched && rest !== "" && !valid;

  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <div className="flex gap-2">
        <select
          aria-label={label}
          value={country}
          onChange={(e) => setCountry(e.target.value as CountryCode)}
          className="input w-28 shrink-0 px-2"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code === country ? `${c.code} +${getCountryCallingCode(c.code)}` : c.label}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          value={rest}
          onChange={(e) => setRest(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={showError || undefined}
          className="input min-w-0 flex-1"
          ref={(el) => el?.setCustomValidity(rest && !valid ? invalidText : "")}
        />
      </div>
      <input type="hidden" name={name} value={full} />
      <input type="hidden" name={`${name}Country`} value={country} />
      {showError && <p className="mt-1 text-xs text-red-700">{invalidText}</p>}
    </div>
  );
}
