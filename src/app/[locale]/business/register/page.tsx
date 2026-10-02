import { getTranslations, setRequestLocale } from "next-intl/server";
import { CITY_SLUGS, cityName } from "@/lib/cities";
import { registerAction } from "../actions";

const FIELDS = [
  ["salonName", "text", "organization"],
  ["city", "text", "address-level2"],
  ["address", "text", "street-address"],
  ["phone", "tel", "tel"],
  ["name", "text", "name"],
  ["email", "email", "email"],
  ["password", "password", "new-password"],
] as const;

export default async function RegisterPage({
  params,
  searchParams,
}: PageProps<"/[locale]/business/register">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const error = (await searchParams).error;
  const t = await getTranslations("business.register");
  return (
    <form action={registerAction} className="card mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl">{t("title")}</h1>
      {typeof error === "string" && (
        <p className="notice-error">{t(`errors.${error}` as never)}</p>
      )}
      {FIELDS.map(([name, type, auto]) => (
        <div key={name}>
          <label className="label" htmlFor={name}>
            {t(`fields.${name}`)}
          </label>
          {name === "city" ? (
            <select
              id="city"
              name="city"
              required
              defaultValue="lisboa"
              autoComplete={auto}
              className="input"
            >
              {[...CITY_SLUGS]
                .sort((a, b) => cityName(a).localeCompare(cityName(b), "pt"))
                .map((c) => (
                  <option key={c} value={c}>
                    {cityName(c)}
                  </option>
                ))}
            </select>
          ) : (
            <input
              id={name}
              name={name}
              type={type}
              required
              autoComplete={auto}
              minLength={name === "password" ? 8 : undefined}
              className="input"
            />
          )}
        </div>
      ))}
      <label className="flex items-start gap-2 text-xs text-muted">
        <input type="checkbox" required className="mt-0.5" />
        {t("terms")}
      </label>
      <button className="btn w-full">{t("submit")}</button>
    </form>
  );
}
