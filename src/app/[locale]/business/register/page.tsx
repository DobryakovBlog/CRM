import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CityCombobox } from "@/components/CityCombobox";
import { cityOptions } from "@/lib/cities";
import { registerAction } from "../actions";
import { cookies } from "next/headers";
import { GoogleButton } from "@/components/GoogleButton";
import { PetFriendlyToggle } from "@/components/PetFriendly";
import { GOOGLE_SIGNUP_COOKIE, googleConfigured, readGoogleSignup } from "@/server/google";

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
  const kind = sp.kind === "restaurant" ? "restaurant" : "salon";
  const t = await getTranslations("business.register");
  const ta = await getTranslations("account");
  const google = readGoogleSignup((await cookies()).get(GOOGLE_SIGNUP_COOKIE)?.value);
  const fields = FIELDS.filter(([name]) => !google || (name !== "email" && name !== "password"));
  const ts = await getTranslations("search");
  const tp = await getTranslations("petFriendly");
  return (
    <form action={registerAction} className="card mx-auto max-w-md space-y-4">
      <h1 className="font-display text-3xl">{t("title")}</h1>
      {typeof error === "string" && (
        <p className="notice-error">{t(`errors.${error}` as never)}</p>
      )}
      <fieldset>
        <legend className="label">{t("kind")}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["salon", "restaurant"] as const).map((k) => (
            <label key={k} className="cursor-pointer">
              <input type="radio" name="kind" value={k} defaultChecked={k === kind} className="peer sr-only" />
              <span className="block rounded-[3px] border border-line px-2 py-2.5 text-center text-sm transition-colors peer-checked:border-gold peer-checked:bg-sand peer-focus-visible:ring-2 peer-focus-visible:ring-gold">
                {t(`kinds.${k}`)}
              </span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{t("kindHint")}</p>
      </fieldset>
      {google ? (
        <p className="notice">{t("googleAs", { email: google.email })}</p>
      ) : (
        googleConfigured() && (
          <>
            <GoogleButton href={`/api/auth/google/start?as=business&locale=${locale}`} label={ta("google")} />
            <p className="text-center text-xs uppercase tracking-widest text-muted">{ta("or")}</p>
          </>
        )
      )}
      {fields.map(([name, type, auto]) => (
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
              defaultValue={name === "name" ? google?.name : undefined}
              minLength={name === "password" ? 8 : undefined}
              className="input"
            />
          )}
        </div>
      ))}
      <PetFriendlyToggle label={tp("label")} hint={tp("hint")} />
      <label className="flex items-start gap-2 text-xs text-muted">
        <input type="checkbox" required className="mt-0.5" />
        <span>{t.rich("terms", {
                privacy: (chunks) => (
                  <Link href="/privacy" target="_blank" className="underline hover:text-ink">
                    {chunks}
                  </Link>
                ),
                terms: (chunks) => (
                  <Link href="/terms" target="_blank" className="underline hover:text-ink">
                    {chunks}
                  </Link>
                ),
              })}</span>
      </label>
      <button className="btn w-full">{t("submit")}</button>
    </form>
  );
}
