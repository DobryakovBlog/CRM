import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GoogleButton } from "@/components/GoogleButton";
import { Link } from "@/i18n/navigation";
import { safeNext } from "@/lib/next-path";
import { googleConfigured } from "@/server/google";
import { registerCustomerAction } from "../actions";

export async function generateMetadata({ params }: PageProps<"/[locale]/account/register">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "account" });
  return { title: t("registerTitle") };
}

export default async function RegisterClientPage({ params, searchParams }: PageProps<"/[locale]/account/register">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const next = safeNext(sp.next);
  const t = await getTranslations("account");
  const q = next ? `?next=${encodeURIComponent(next)}` : "";
  return (
    <form action={registerCustomerAction} className="card mx-auto max-w-sm space-y-4">
      <h1 className="font-display text-3xl">{t("registerTitle")}</h1>
      {(sp.error === "invalid" || sp.error === "email_taken") && (
        <p className="notice-error">{t(`registerErrors.${sp.error}`)}</p>
      )}
      {googleConfigured() && (
        <>
          <GoogleButton href={`/api/auth/google/start?as=client&locale=${locale}${next ? `&next=${encodeURIComponent(next)}` : ""}`} label={t("google")} />
          <p className="text-center text-xs uppercase tracking-widest text-muted">{t("or")}</p>
        </>
      )}
      <input type="hidden" name="next" value={next} />
      <div>
        <label className="label" htmlFor="name">{t("name")}</label>
        <input id="name" name="name" required minLength={2} maxLength={80} autoComplete="name" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">{t("email")}</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">{t("password")}</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="input" />
        <p className="mt-1 text-xs text-muted">{t("passwordHint")}</p>
      </div>
      <label className="flex items-start gap-2 text-xs text-muted">
        <input type="checkbox" required className="mt-0.5" />
        <span>
          {t.rich("terms", {
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
          })}
        </span>
      </label>
      <button className="btn w-full">{t("registerSubmit")}</button>
      <p className="border-t border-line pt-4 text-center text-sm">
        {t("haveAccount")}{" "}
        <Link href={`/account${q}`} className="font-medium text-gold-deep underline">
          {t("submit")}
        </Link>
      </p>
    </form>
  );
}
