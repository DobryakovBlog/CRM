import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { cabinetHome, currentOwner } from "@/server/auth";

export default async function BusinessLanding({ params }: PageProps<"/[locale]/business">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const owner = await currentOwner();
  if (owner) redirect({ href: cabinetHome(owner.salon.kind), locale });
  const t = await getTranslations("business");

  return (
    <div className="space-y-10">
      <section className="-mt-10 rounded-b-md bg-navy px-6 pb-14 pt-16 text-center text-white sm:px-12">
        <p className="eyebrow text-gold">Astrabela Business</p>
        <h1 className="font-display mx-auto mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">{t("landing.title")}</h1>
        <p className="mx-auto mt-4 max-w-xl text-mist">{t("landing.subtitle")}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/business/register" className="btn-gold">
            {t("landing.start")}
          </Link>
          <Link href="/account" className="btn-outline border-white/30 bg-transparent text-white hover:border-white">
            {t("login.title")}
          </Link>
        </div>
      </section>
      <section className="card mx-auto max-w-xl text-center">
        <p className="font-display text-4xl">{t("landing.freeTitle")}</p>
        <p className="mt-2 text-sm text-muted">{t("landing.freeNote")}</p>
      </section>
      <ul className="mx-auto grid max-w-3xl gap-2 text-ink sm:grid-cols-2">
        {(["noCommission", "unlimitedStaff", "calendar", "verifiedReviews", "ownClients"] as const).map((k) => (
          <li key={k} className="flex gap-3"><span className="text-gold" aria-hidden>✓</span>{t(`landing.features.${k}`)}</li>
        ))}
      </ul>
      <section className="card mx-auto max-w-3xl space-y-3">
        <p className="eyebrow">{t("landing.restaurants.eyebrow")}</p>
        <h2 className="font-display text-3xl">{t("landing.restaurants.title")}</h2>
        <p className="text-muted">{t("landing.restaurants.text")}</p>
        <Link href="/business/register?kind=restaurant" className="btn-outline inline-block">
          {t("landing.restaurants.cta")}
        </Link>
      </section>
    </div>
  );
}
