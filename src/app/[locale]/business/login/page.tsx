import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { loginAction } from "../actions";

export default async function LoginPage({ params, searchParams }: PageProps<"/[locale]/business/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const error = (await searchParams).error;
  const t = await getTranslations("business.login");
  return (
    <form action={loginAction} className="card mx-auto max-w-sm space-y-4">
      <h1 className="font-display text-3xl">{t("title")}</h1>
      {error && <p className="notice-error">{t("error")}</p>}
      <div>
        <label className="label" htmlFor="email">{t("email")}</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">{t("password")}</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      <button className="btn w-full">{t("submit")}</button>
      <p className="text-center text-sm">
        <Link href="/business/register" className="text-gold-deep underline">{t("noAccount")}</Link>
      </p>
    </form>
  );
}
