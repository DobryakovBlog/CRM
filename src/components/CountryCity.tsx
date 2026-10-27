"use client";

import { useState } from "react";
import { CityCombobox, type CityOption } from "./CityCombobox";

type Country = { code: string; label: string; open: boolean };

/**
 * Country picker plus the city field for that country. Changing the country swaps
 * the city list and asks the server only for that country's places.
 */
export function CountryCity({
  countries,
  options,
  defaultCountry,
  defaultSlugs,
  searchUrl,
  countryLabel,
  cityLabel,
  placeholder,
  noMatch,
  soonLabel,
  id,
}: {
  countries: Country[];
  /** Starting city options for each open country. */
  options: Record<string, CityOption[]>;
  defaultCountry: string;
  defaultSlugs: Record<string, string>;
  /** Endpoint answering ?q=; the country is added to it. */
  searchUrl: string;
  countryLabel: string;
  cityLabel: string;
  placeholder: string;
  noMatch: string;
  soonLabel?: string;
  id?: string;
}) {
  const [country, setCountry] = useState(defaultCountry);
  return (
    <>
      <select
        name="country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="input"
        aria-label={countryLabel}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code} disabled={!c.open}>
            {c.label}
          </option>
        ))}
      </select>
      <CityCombobox
        key={country}
        id={id}
        name="city"
        options={options[country] ?? []}
        searchUrl={`${searchUrl}${searchUrl.includes("?") ? "&" : "?"}country=${country}`}
        defaultSlug={defaultSlugs[country] ?? ""}
        label={cityLabel}
        placeholder={placeholder}
        noMatch={noMatch}
        soonLabel={soonLabel}
      />
    </>
  );
}
