import { getTranslations, setRequestLocale } from "next-intl/server";
import { CityCombobox } from "@/components/CityCombobox";
import { cityOptions } from "@/lib/cities";
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
  const sp = await searchParams;
  const error = sp.error;
  const kind = sp.kind === "restaurant" ? "restaurant" : sp.kind === "barbershop" ? "barbershop" : "salon";
  const t = await getTranslations("business.register");
  const ts = await getTranslations("search");
  return (
    <form action={registerAction} className="card mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl">{t("title")}</h1>
      {typeof error === "string" && (
        <p className="notice-error">{t(`errors.${error}` as never)}</p>
      )}
      <fieldset>
        <legend className="label">{t("kind")}</legend>
        <div className="grid grid-cols-3 gap-2">
          {(["salon", "barbershop", "restaurant"] as const).map((k) => (
            <label key={k} className="cursor-pointer">
              <input type="radio" name="kind" value={k} defaultChecked={k === kind} className="peer sr-only" />
              <span className="block rounded-[3px] border border-line px-2 py-2.5 text-center text-sm transition-colors peer-checked:border-gold peer-checked:bg-sand peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
                {t(`kinds.${k}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {FIELDS.map(([name, type, auto]) => (
        <div key={name}>
          <label className="label" htmlFor={name}>
            {t(`fields.${name}`)}
          </label>
          {name === "city" ? (
            <CityCombobox
              id="city"
              name="city"
              options={cityOptions([])}
              searchUrl="/api/places"
              defaultSlug="lisboa"
              label={t("fields.city")}
              placeholder={ts("cityPlaceholder")}
              noMatch={ts("cityNoMatch")}
            />
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
