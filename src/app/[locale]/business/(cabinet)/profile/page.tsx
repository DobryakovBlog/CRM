import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { formatDateTime } from "@/lib/format";
import { requireOwner } from "@/server/auth";
import { salonSubscription } from "@/server/cabinet";
import { saveProfileAction, submitForReviewAction } from "../actions";

const FIELDS = ["name", "district", "address", "postalCode", "phone", "nif"] as const;

export default async function ProfilePage({ params, searchParams }: PageProps<"/[locale]/business/profile">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const { salon } = await requireOwner(locale);
  const t = await getTranslations("business.profile");
  const sub = await salonSubscription(db, salon.id);

  return (
    <div className="space-y-6">
      {sp.welcome === "1" && <p className="rounded-lg bg-green-50 p-4 text-green-800">{t("welcome")}</p>}
      {sp.saved === "1" && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{t("saved")}</p>}
      {sp.submitted === "1" && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-800">{t("submitted")}</p>}
      {sp.error === "not_ready" && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{t("notReady")}</p>}

      <div className="card space-y-2">
        <h2 className="font-semibold">{t("listing")}</h2>
        <p className="text-sm text-stone-700">{t(`statusHelp.${salon.status}`)}</p>
        {salon.status === "draft" && (
          <form action={submitForReviewAction}>
            <button className="btn">{t("submit")}</button>
          </form>
        )}
        {salon.status === "active" && (
          <Link href={`/salon/${salon.slug}`} className="text-sm text-brand-700 underline">
            {t("viewPublic")}
          </Link>
        )}
      </div>

      {sub && (
        <div className="card text-sm">
          <h2 className="mb-1 font-semibold">{t("subscription")}</h2>
          <p>
            {t(`sub.${sub.status}`, {
              date: formatDateTime(sub.currentPeriodEnd, salon.timezone, locale, { dateStyle: "long" }),
            })}
          </p>
        </div>
      )}

      <form action={saveProfileAction} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="font-semibold sm:col-span-2">{t("details")}</h2>
        {FIELDS.map((f) => (
          <div key={f}>
            <label className="label" htmlFor={f}>{t(`fields.${f}`)}</label>
            <input id={f} name={f} defaultValue={salon[f]} className="input" />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="description">{t("fields.description")}</label>
          <textarea id="description" name="description" rows={4} defaultValue={salon.description} className="input" />
        </div>
        <button className="btn sm:col-span-2">{t("save")}</button>
      </form>
    </div>
  );
}
