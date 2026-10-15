import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GoogleButton } from "@/components/GoogleButton";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { formatDateTime } from "@/lib/format";
import { currentUser } from "@/server/auth";
import { currentCustomer, customerBookings } from "@/server/customers";
import { googleConfigured } from "@/server/google";
import { customerLogoutAction, deleteCustomerAction } from "./actions";

export async function generateMetadata({ params }: PageProps<"/[locale]/account">): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: "account" });
  return { title: t("title") };
}

export default async function AccountPage({ params, searchParams }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const t = await getTranslations("account");
  const tb = await getTranslations("booking");
  const [customer, owner] = await Promise.all([currentCustomer(), currentUser()]);
  const google = googleConfigured();

  if (customer) {
    const list = await customerBookings(db, customer.email);
    const now = new Date();
    const upcoming = list.filter((b) => b.status === "confirmed" && b.startsAt >= now).reverse();
    const past = list.filter((b) => !upcoming.includes(b));
    const row = (b: (typeof list)[number]) => (
      <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div>
          <p className="font-medium">{b.salonName}</p>
          <p className="text-sm text-muted">
            {b.serviceName} · {tb("with", { name: b.staffName })} ·{" "}
            {formatDateTime(b.startsAt, b.timezone, locale, { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">{tb(`status.${b.status}`)}</span>
          <Link href={`/booking/${b.manageToken}`} className="btn-outline text-xs">
            {t("open")}
          </Link>
        </div>
      </li>
    );
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">{t("hello", { name: customer.name.split(" ")[0] })}</h1>
            <p className="text-sm text-muted">{customer.email}</p>
          </div>
          <form action={customerLogoutAction}>
            <button className="btn-outline text-sm">{t("logout")}</button>
          </form>
        </div>
        <section className="card space-y-2">
          <h2 className="font-display text-2xl">{t("upcoming")}</h2>
          {upcoming.length ? (
            <ul className="divide-y divide-line">{upcoming.map(row)}</ul>
          ) : (
            <p className="text-sm text-muted">
              {t("noUpcoming")}{" "}
              <Link href="/" className="text-gold-deep underline">
                {t("findSalon")}
              </Link>
            </p>
          )}
        </section>
        {past.length > 0 && (
          <section className="card space-y-2">
            <h2 className="font-display text-2xl">{t("past")}</h2>
            <ul className="divide-y divide-line">{past.map(row)}</ul>
          </section>
        )}
        <p className="text-xs text-muted">{t("bookingsHint")}</p>
        <details className="text-sm">
          <summary className="cursor-pointer text-muted">{t("deleteTitle")}</summary>
          <form action={deleteCustomerAction} className="mt-3 space-y-2">
            <p className="text-muted">{t("deleteText")}</p>
            <button className="btn-outline text-xs">{t("deleteConfirm")}</button>
          </form>
        </details>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-4xl">{t("title")}</h1>
      {sp.error === "google" && <p className="notice-error">{t("googleError")}</p>}
      {sp.deleted === "1" && <p className="notice">{t("deleted")}</p>}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card space-y-4">
          <p className="eyebrow">{t("clientsEyebrow")}</p>
          <h2 className="font-display text-2xl">{t("clientsTitle")}</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>{t("clientsBenefit1")}</li>
            <li>{t("clientsBenefit2")}</li>
            <li>{t("clientsBenefit3")}</li>
          </ul>
          {google ? (
            <GoogleButton href={`/api/auth/google/start?as=client&locale=${locale}`} label={t("google")} />
          ) : (
            <p className="notice">{t("googleSoon")}</p>
          )}
          <p className="text-xs text-muted">{t("noAccountNeeded")}</p>
        </section>
        <section className="card space-y-4">
          <p className="eyebrow">{t("businessEyebrow")}</p>
          <h2 className="font-display text-2xl">{t("businessTitle")}</h2>
          <p className="text-sm text-muted">{t("businessText")}</p>
          {owner ? (
            <Link href="/business/calendar" className="btn w-full">
              {t("openCabinet")}
            </Link>
          ) : (
            <div className="space-y-3">
              {google && (
                <GoogleButton href={`/api/auth/google/start?as=business&locale=${locale}`} label={t("google")} />
              )}
              <div className="grid grid-cols-2 gap-3">
                <Link href="/business/login" className="btn-outline text-center">
                  {t("businessLogin")}
                </Link>
                <Link href="/business/register" className="btn-gold text-center">
                  {t("businessRegister")}
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
