import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { Link } from "@/i18n/navigation";
import { nextDate } from "@/lib/availability";
import { formatDateTime, formatPrice, formatTime, localDate } from "@/lib/format";
import { slotsForDate } from "@/server/booking";
import { salonBySlug } from "@/server/catalog";
import { bookAction } from "./actions";

const DAYS_AHEAD = 14;
const str = (v: string | string[] | undefined) => (typeof v === "string" && v ? v : undefined);

export default async function BookPage({ params, searchParams }: PageProps<"/[locale]/salon/[slug]/book">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const data = await salonBySlug(db, slug);
  if (!data) notFound();
  const { salon } = data;
  const t = await getTranslations("book");

  const service = data.services.find((s) => s.id === str(sp.service));
  if (!service) notFound();
  const masters = data.staff.filter((m) =>
    data.links.some((l) => l.staffId === m.id && l.serviceId === service.id),
  );
  const staffId = masters.some((m) => m.id === str(sp.staff)) ? str(sp.staff)! : null;

  const today = localDate(new Date(), salon.timezone);
  const days = [today];
  while (days.length < DAYS_AHEAD) days.push(nextDate(days.at(-1)!));
  const date = days.includes(str(sp.date) ?? "") ? str(sp.date)! : today;

  const slots = await slotsForDate(db, { salonId: salon.id, serviceId: service.id, staffId, date });
  const chosen = str(sp.time) ? slots.find((s) => s.startsAt.toISOString() === sp.time) : undefined;
  const error = str(sp.error);

  const href = (over: Record<string, string | null>) => {
    const q = new URLSearchParams({ service: service.id, date, ...(staffId ? { staff: staffId } : {}) });
    for (const [k, v] of Object.entries(over)) {
      if (v === null) q.delete(k);
      else q.set(k, v);
    }
    return `/salon/${salon.slug}/book?${q}`;
  };
  const dayLabel = (d: string) =>
    formatDateTime(new Date(`${d}T12:00:00Z`), "UTC", locale, { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href={`/salon/${salon.slug}`} className="text-sm text-stone-500 hover:underline">
          ← {salon.name}
        </Link>
        <h1 className="mt-1 text-2xl font-bold">{service.name}</h1>
        <p className="text-stone-600">
          {t("minutes", { n: service.durationMinutes })} · {formatPrice(service.priceCents, locale)} · {t("payOnSite")}
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{t(`errors.${error}` as never)}</p>}

      <section className="card space-y-3">
        <h2 className="font-semibold">{t("master")}</h2>
        <div className="flex flex-wrap gap-2">
          <Link href={href({ staff: null, time: null })} className={staffId ? "btn-outline" : "btn"}>
            {t("anyMaster")}
          </Link>
          {masters.map((m) => (
            <Link key={m.id} href={href({ staff: m.id, time: null })} className={staffId === m.id ? "btn" : "btn-outline"}>
              {m.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">{t("day")}</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((d) => (
            <Link key={d} href={href({ date: d, time: null })} className={`${d === date ? "btn" : "btn-outline"} shrink-0`}>
              {dayLabel(d)}
            </Link>
          ))}
        </div>
        <h2 className="pt-2 font-semibold">{t("time")}</h2>
        {slots.length === 0 ? (
          <p className="text-sm text-stone-600">{t("noSlots")}</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {slots.map((s) => {
              const iso = s.startsAt.toISOString();
              return (
                <Link
                  key={iso}
                  href={href({ time: iso })}
                  className={chosen?.startsAt.toISOString() === iso ? "btn" : "btn-outline"}
                >
                  {formatTime(s.startsAt, salon.timezone)}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {chosen && (
        <section className="card space-y-4" id="details">
          <h2 className="font-semibold">{t("yourDetails")}</h2>
          <p className="text-sm text-stone-700">
            {formatDateTime(chosen.startsAt, salon.timezone, locale)} ·{" "}
            {masters.find((m) => m.id === chosen.staffId)?.name}
          </p>
          <form action={bookAction} className="space-y-3">
            <input type="hidden" name="slug" value={salon.slug} />
            <input type="hidden" name="serviceId" value={service.id} />
            <input type="hidden" name="staffId" value={chosen.staffId} />
            <input type="hidden" name="startsAt" value={chosen.startsAt.toISOString()} />
            <input type="hidden" name="back" value={href({})} />
            <div>
              <label className="label" htmlFor="name">{t("name")}</label>
              <input id="name" name="name" required maxLength={80} autoComplete="name" className="input" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="email">{t("email")}</label>
                <input id="email" name="email" type="email" required autoComplete="email" className="input" />
              </div>
              <div>
                <label className="label" htmlFor="phone">{t("phone")}</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" className="input" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="note">{t("note")}</label>
              <textarea id="note" name="note" maxLength={500} rows={2} className="input" />
            </div>
            <label className="flex items-start gap-2 text-xs text-stone-600">
              <input type="checkbox" name="privacy" required className="mt-0.5" />
              {t("privacy")}
            </label>
            <button className="btn w-full">{t("confirm")}</button>
          </form>
        </section>
      )}
    </div>
  );
}
