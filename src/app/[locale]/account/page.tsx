import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GoogleButton } from "@/components/GoogleButton";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { formatDateTime } from "@/lib/format";
import { currentOwner } from "@/server/auth";
import { safeNext } from "@/lib/next-path";
import { currentCustomer, customerBookings, isAdminCustomer } from "@/server/customers";
import { googleConfigured } from "@/server/google";
import { customerLogoutAction, deleteCustomerAction, signInAction } from "./actions";

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
  const [customer, owner] = await Promise.all([currentCustomer(), currentOwner()]);
  const google = googleConfigured();
  const next = safeNext(sp.next);

  if (customer) {
    const list = await customerBookings(db, customer);
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
          <div className="flex gap-2">
            {isAdminCustomer(customer) && (
              <Link href="/admin" className="btn text-sm">
                {t("adminPanel")}
              </Link>
            )}
            <form action={customerLogoutAction}>
              <button className="btn-outline text-sm">{t("logout")}</button>
            </form>
          </div>
        </div>
        {sp.welcome === "1" && <p className="notice">{t("welcome")}</p>}
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
        <p className="text-xs text-muted">{t(customer.googleId ? "bookingsHintGoogle" : "bookingsHint")}</p>
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

  const googleHref = `/api/auth/google/start?as=client&locale=${locale}${next ? `&next=${encodeURIComponent(next)}` : ""}`;
  return (
    <div className="mx-auto max-w-sm space-y-5">
      {sp.deleted === "1" && <p className="notice">{t("deleted")}</p>}
      {owner && (
        <div className="card space-y-3 text-sm">
          <p>{t("signedInBusiness", { name: owner.salon.name })}</p>
          <div className="flex gap-2">
            <Link href="/business/calendar" className="btn flex-1 text-center">
              {t("openCabinet")}
            </Link>
            {owner.user.isAdmin && (
              <Link href="/admin" className="btn-outline flex-1 text-center">
                {t("adminPanel")}
              </Link>
            )}
          </div>
        </div>
      )}
      <form action={signInAction} className="card space-y-4">
        <h1 className="font-display text-3xl">{t("title")}</h1>
        {sp.error === "login" && <p className="notice-error">{t("loginError")}</p>}
        {sp.error === "google" && <p className="notice-error">{t("googleError")}</p>}
        <input type="hidden" name="next" value={next} />
        <div>
          <label className="label" htmlFor="email">{t("email")}</label>
          <input id="email" name="email" type="email" required autoComplete="email" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">{t("password")}</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        <button className="btn w-full">{t("submit")}</button>
        {google && (
          <>
            <p className="text-center text-xs uppercase tracking-widest text-muted">{t("or")}</p>
            <GoogleButton href={googleHref} label={t("google")} />
          </>
        )}
        <p className="border-t border-line pt-4 text-center text-sm">
          {t("noAccount")}{" "}
          <Link href={`/account/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-gold-deep underline">
            {t("createAccount")}
          </Link>
        </p>
      </form>
      <p className="text-center text-sm text-muted">
        {t("businessQuestion")}{" "}
        <Link href="/business" className="text-gold-deep underline">
          {t("businessLink")}
        </Link>
      </p>
    </div>
  );
}
