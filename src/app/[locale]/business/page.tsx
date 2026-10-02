import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { currentOwner, TRIAL_DAYS } from "@/server/auth";

const PLANS = [
  { key: "monthly", price: "12,99 €" },
  { key: "semiannual", price: "10,99 €" },
  { key: "annual", price: "9,99 €" },
] as const;

export default async function BusinessLanding({ params }: PageProps<"/[locale]/business">) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (await currentOwner()) redirect({ href: "/business/calendar", locale });
  const t = await getTranslations("business");

  return (
    <div className="space-y-10">
      <section className="-mt-10 rounded-b-md bg-plum px-6 pb-14 pt-16 text-center text-white sm:px-12">
        <p className="eyebrow text-gold">Beauty Advisor Business</p>
        <h1 className="font-display mx-auto mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">{t("landing.title")}</h1>
        <p className="mx-auto mt-4 max-w-xl text-gold-soft/85">{t("landing.subtitle")}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/business/register" className="btn-gold">
            {t("landing.start", { days: TRIAL_DAYS })}
          </Link>
          <Link href="/business/login" className="btn-outline border-white/30 bg-transparent text-white hover:border-white">
            {t("login.title")}
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.key} className="card text-center">
            <p className="eyebrow">{t(`plans.${p.key}`)}</p>
            <p className="font-display mt-3 text-4xl">{p.price}</p>
            <p className="text-sm text-muted">{t("plans.perMonth")}</p>
          </div>
        ))}
      </section>
      <ul className="mx-auto grid max-w-3xl gap-2 text-ink sm:grid-cols-2">
        {(["noCommission", "unlimitedStaff", "calendar", "reminders", "verifiedReviews", "ownClients"] as const).map((k) => (
          <li key={k} className="flex gap-3"><span className="text-gold" aria-hidden>✓</span>{t(`landing.features.${k}`)}</li>
        ))}
      </ul>
    </div>
  );
}
