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
      <section className="rounded-2xl bg-brand-50 px-6 py-12 text-center">
        <h1 className="text-3xl font-bold">{t("landing.title")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">{t("landing.subtitle")}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/business/register" className="btn">
            {t("landing.start", { days: TRIAL_DAYS })}
          </Link>
          <Link href="/business/login" className="btn-outline">
            {t("login.title")}
          </Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.key} className="card text-center">
            <p className="text-sm text-stone-500">{t(`plans.${p.key}`)}</p>
            <p className="mt-2 text-3xl font-bold">{p.price}</p>
            <p className="text-sm text-stone-500">{t("plans.perMonth")}</p>
          </div>
        ))}
      </section>
      <ul className="mx-auto grid max-w-3xl gap-2 text-stone-700 sm:grid-cols-2">
        {(["noCommission", "unlimitedStaff", "calendar", "reminders", "verifiedReviews", "ownClients"] as const).map((k) => (
          <li key={k}>✓ {t(`landing.features.${k}`)}</li>
        ))}
      </ul>
    </div>
  );
}
