import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { nextDate } from "@/lib/availability";
import { formatDateTime, formatPrice, formatTime, localDate } from "@/lib/format";
import { requireOwner } from "@/server/auth";
import { dayAgenda, salonServices, salonTeam } from "@/server/cabinet";
import { manualBookingAction, setStatusAction } from "../actions";

function prevDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
}

export default async function CalendarPage({ params, searchParams }: PageProps<"/[locale]/business/calendar">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const { salon } = await requireOwner(locale);
  const t = await getTranslations("business.calendar");
  const tb = await getTranslations("booking.status");

  const today = localDate(new Date(), salon.timezone);
  const date = typeof sp.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : today;
  const [agenda, team, services] = await Promise.all([
    dayAgenda(db, salon.id, salon.timezone, date),
    salonTeam(db, salon.id),
    salonServices(db, salon.id),
  ]);
  const active = team.filter((m) => m.isActive);
  const now = new Date();
  const heading = formatDateTime(new Date(`${date}T12:00:00Z`), "UTC", locale, { dateStyle: "full" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/business/calendar?date=${prevDate(date)}`} className="btn-outline">←</Link>
        <Link href={`/business/calendar?date=${today}`} className="btn-outline">{t("today")}</Link>
        <Link href={`/business/calendar?date=${nextDate(date)}`} className="btn-outline">→</Link>
        <h2 className="ml-2 font-semibold capitalize">{heading}</h2>
      </div>
      {typeof sp.error === "string" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{t(`errors.${sp.error}` as never)}</p>
      )}

      {active.length === 0 && <p className="text-stone-600">{t("noTeam")}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {active.map((m) => {
          const items = agenda.filter((b) => b.staffId === m.id);
          return (
            <section key={m.id} className="card">
              <h3 className="mb-3 font-semibold">{m.name}</h3>
              {items.length === 0 && <p className="text-sm text-stone-500">{t("free")}</p>}
              <ul className="space-y-3">
                {items.map((b) => (
                  <li
                    key={b.id}
                    className={`rounded-lg border p-3 text-sm ${b.status === "cancelled" ? "border-stone-200 opacity-50" : "border-brand-100 bg-brand-50"}`}
                  >
                    <div className="flex justify-between gap-2">
                      <span className="font-semibold">
                        {formatTime(b.startsAt, salon.timezone)}–{formatTime(b.endsAt, salon.timezone)}
                      </span>
                      <span className="text-xs uppercase text-stone-500">{tb(b.status)}</span>
                    </div>
                    <p>
                      {b.serviceName} · {formatPrice(b.priceCents, locale)}
                    </p>
                    <p className="text-stone-600">
                      {b.clientName} · {b.clientPhone}
                      {b.clientNoShows > 0 && (
                        <span className="ml-1 text-red-700">({t("noShows", { n: b.clientNoShows })})</span>
                      )}
                    </p>
                    {b.clientNote && <p className="mt-1 italic text-stone-600">“{b.clientNote}”</p>}
                    {b.status === "confirmed" && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(b.startsAt <= now ? (["completed", "no_show", "cancelled"] as const) : (["cancelled"] as const)).map((st) => (
                          <form key={st} action={setStatusAction}>
                            <input type="hidden" name="bookingId" value={b.id} />
                            <input type="hidden" name="status" value={st} />
                            <button className="btn-outline px-2 py-1 text-xs">{t(`mark.${st}`)}</button>
                          </form>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {active.length > 0 && services.length > 0 && (
        <form action={manualBookingAction} className="card grid gap-3 sm:grid-cols-3">
          <h3 className="font-semibold sm:col-span-3">{t("manualTitle")}</h3>
          <input type="hidden" name="date" value={date} />
          <select name="staffId" className="input" aria-label={t("master")}>
            {active.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select name="serviceId" className="input" aria-label={t("service")}>
            {services.filter((s) => s.isActive).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input name="time" type="time" required step={300} className="input" aria-label={t("time")} />
          <input name="clientName" required placeholder={t("clientName")} className="input" />
          <input name="clientPhone" placeholder={t("clientPhone")} className="input" />
          <input name="clientEmail" type="email" placeholder={t("clientEmail")} className="input" />
          <button className="btn sm:col-span-3">{t("add")}</button>
        </form>
      )}
    </div>
  );
}
