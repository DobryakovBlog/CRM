import { getTranslations, setRequestLocale } from "next-intl/server";
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

export default async function RegisterPage({ params, searchParams }: PageProps<"/[locale]/business/register">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const error = (await searchParams).error;
  const t = await getTranslations("business.register");
  return (
    <form action={registerAction} className="card mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">{t("title")}</h1>
      {typeof error === "string" && <p className="rounded bg-red-50 p-2 text-sm text-red-800">{t(`errors.${error}` as never)}</p>}
      {FIELDS.map(([name, type, auto]) => (
        <div key={name}>
          <label className="label" htmlFor={name}>{t(`fields.${name}`)}</label>
          <input
            id={name}
            name={name}
            type={type}
            required
            autoComplete={auto}
            minLength={name === "password" ? 8 : undefined}
            defaultValue={name === "city" ? "Lisboa" : undefined}
            className="input"
          />
        </div>
      ))}
      <label className="flex items-start gap-2 text-xs text-stone-600">
        <input type="checkbox" required className="mt-0.5" />
        {t("terms")}
      </label>
      <button className="btn w-full">{t("submit")}</button>
    </form>
  );
}
