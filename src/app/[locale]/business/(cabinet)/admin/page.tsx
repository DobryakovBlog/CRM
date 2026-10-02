import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { requireOwner } from "@/server/auth";
import { openReports, pendingSalons } from "@/server/cabinet";
import { approveSalonAction, moderateReportAction } from "../actions";

export default async function AdminPage({ params }: PageProps<"/[locale]/business/admin">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { user } = await requireOwner(locale);
  if (!user.isAdmin) notFound();
  const t = await getTranslations("business.admin");
  const [salons, reports] = await Promise.all([pendingSalons(db), openReports(db)]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="font-semibold">{t("pending")}</h2>
        {salons.length === 0 && <p className="text-sm text-stone-500">{t("none")}</p>}
        {salons.map((s) => (
          <div key={s.id} className="card flex items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-medium">{s.name}</p>
              <p className="text-stone-500">{s.address} · {s.phone} · NIF {s.nif || "—"}</p>
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
        {reports.length === 0 && <p className="text-sm text-stone-500">{t("none")}</p>}
        {reports.map((r) => (
          <div key={r.id} className="card space-y-2 text-sm">
            <p className="text-stone-500">{r.salonName} · {"★".repeat(r.rating)}</p>
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
    </div>
  );
}
