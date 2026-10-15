import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { requireAdmin } from "@/server/admin";
import { openReports, pendingSalons } from "@/server/cabinet";
import { cityName } from "@/lib/cities";
import { formatDateTime } from "@/lib/format";
import { FREE_PERIODS, listSubscriptions } from "@/server/subscriptions";
import {
  approveSalonAction,
  cancelSubscriptionAction,
  freeUntilAction,
  grantFreeAction,
  moderateReportAction,
} from "./actions";

const str = (v: string | string[] | undefined) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

export default async function AdminPage({ params, searchParams }: PageProps<"/[locale]/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);
  await requireAdmin(locale);
  const sp = await searchParams;
  const q = str(sp.q);
  const done = str(sp.sub);
  const t = await getTranslations("business.admin");
  const [salons, reports, subs] = await Promise.all([pendingSalons(db), openReports(db), listSubscriptions(db, q)]);
  const now = new Date();
  const date = (d: Date) => formatDateTime(d, "Europe/Lisbon", locale, { dateStyle: "medium" });
  const tomorrow = new Date(now.getTime() + 86_400_000).toISOString().slice(0, 10);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl">{t("title")}</h1>
      <section className="space-y-3">
        <h2 className="font-semibold">{t("pending")}</h2>
        {salons.length === 0 && <p className="text-sm text-muted">{t("none")}</p>}
        {salons.map((s) => (
          <div key={s.id} className="card flex items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium">{s.name}</p>
              <p className="text-muted">{s.address} · {s.phone} · NIF {s.nif || "—"}</p>
            </div>
            <div className="flex gap-2">
              {(["approve", "reject"] as const).map((d) => (
                <form key={d} action={approveSalonAction}>
                  <input type="hidden" name="salonId" value={s.id} />
                  <input type="hidden" name="decision" value={d} />
                  <button className={d === "approve" ? "btn" : "btn-outline"}>{t(d)}</button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">{t("reports")}</h2>
        {reports.length === 0 && <p className="text-sm text-muted">{t("none")}</p>}
        {reports.map((r) => (
          <div key={r.id} className="card space-y-2 text-sm">
            <p className="text-muted">{r.salonName} · {"★".repeat(r.rating)}</p>
            <p>{r.reviewText || "—"}</p>
            <p className="text-red-800">{t("reason")}: {r.reason}</p>
            <div className="flex gap-2">
              {(["hide", "keep"] as const).map((d) => (
                <form key={d} action={moderateReportAction}>
                  <input type="hidden" name="reportId" value={r.id} />
                  <input type="hidden" name="reviewId" value={r.reviewId} />
                  <input type="hidden" name="decision" value={d} />
                  <button className="btn-outline">{t(d)}</button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section id="subs" className="space-y-3">
        <div>
          <h2 className="font-semibold">{t("subs.title")}</h2>
          <p className="text-sm text-muted">{t("subs.hint")}</p>
        </div>
        {done === "saved" && <p className="notice">{t("subs.saved")}</p>}
        {done === "invalid" && <p className="notice-error">{t("subs.invalid")}</p>}
        <form className="flex gap-2" role="search">
          <input name="q" defaultValue={q} placeholder={t("subs.search")} aria-label={t("subs.search")} className="input" />
          <button className="btn-outline">{t("subs.find")}</button>
        </form>
        {subs.length === 0 && <p className="text-sm text-muted">{t("subs.empty")}</p>}
        {subs.map((r) => {
          const ended = r.currentPeriodEnd && r.currentPeriodEnd <= now;
          return (
            <div key={r.salonId} className="card space-y-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p>
                  <span className="font-medium">{r.name}</span>
                  <span className="text-muted"> · {cityName(r.city)} · {t(`subs.salonStatus.${r.salonStatus}`)}</span>
                </p>
                <p>
                  {r.status ? (
                    <>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                          ended || r.status === "cancelled" || r.status === "past_due"
                            ? "border-red-200 text-red-800"
                            : r.status === "complimentary"
                              ? "border-gold-soft text-gold-deep"
                              : "border-line text-ink"
                        }`}
                      >
                        {t(`subs.status.${r.status}`)}
                      </span>{" "}
                      <span className="text-muted">
                        {t(ended ? "subs.endedOn" : "subs.endsOn", { date: date(r.currentPeriodEnd!) })}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted">{t("subs.none")}</span>
                  )}
                </p>
              </div>
              {r.note && <p className="text-muted">{r.note}</p>}
              <details>
                <summary className="cursor-pointer text-gold-deep">{t("subs.manage")}</summary>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <form action={grantFreeAction} className="space-y-2 rounded-md bg-sand/60 p-3">
                    <input type="hidden" name="salonId" value={r.salonId} />
                    <input type="hidden" name="q" value={q ?? ""} />
                    <label className="label" htmlFor={`m-${r.salonId}`}>{t("subs.months")}</label>
                    <select id={`m-${r.salonId}`} name="months" defaultValue="12" className="input">
                      {FREE_PERIODS.map((n) => (
                        <option key={n} value={n}>{t("subs.monthsN", { n })}</option>
                      ))}
                    </select>
                    <input name="note" placeholder={t("subs.notePlaceholder")} aria-label={t("subs.note")} className="input" />
                    <button className="btn-gold w-full">{t("subs.grant")}</button>
                  </form>
                  <form action={freeUntilAction} className="space-y-2 rounded-md bg-sand/60 p-3">
                    <input type="hidden" name="salonId" value={r.salonId} />
                    <input type="hidden" name="q" value={q ?? ""} />
                    <label className="label" htmlFor={`u-${r.salonId}`}>{t("subs.until")}</label>
                    <input id={`u-${r.salonId}`} type="date" name="until" min={tomorrow} required className="input" />
                    <input name="note" placeholder={t("subs.notePlaceholder")} aria-label={t("subs.note")} className="input" />
                    <button className="btn w-full">{t("subs.set")}</button>
                  </form>
                </div>
                {r.status && !ended && (
                  <form action={cancelSubscriptionAction} className="mt-3 flex flex-wrap items-center gap-3">
                    <input type="hidden" name="salonId" value={r.salonId} />
                    <input type="hidden" name="q" value={q ?? ""} />
                    <button className="btn-outline text-red-800">{t("subs.cancel")}</button>
                    <span className="text-xs text-muted">{t("subs.cancelHint")}</span>
                  </form>
                )}
              </details>
            </div>
          );
        })}
      </section>
    </div>
  );
}
