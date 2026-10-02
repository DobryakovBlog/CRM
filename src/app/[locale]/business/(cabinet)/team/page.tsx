import { getTranslations, setRequestLocale } from "next-intl/server";
import { LANGUAGES } from "@/components/SearchForm";
import { db } from "@/db";
import { requireOwner } from "@/server/auth";
import { salonServices, salonTeam } from "@/server/cabinet";
import { saveStaffAction, toggleStaffAction } from "../actions";

type Member = Awaited<ReturnType<typeof salonTeam>>[number];
type Service = Awaited<ReturnType<typeof salonServices>>[number];

// Monday first, as salons read their week.
const WEEK = [1, 2, 3, 4, 5, 6, 0];
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

async function StaffForm({ member, services }: { member?: Member; services: Service[] }) {
  const t = await getTranslations("business.team");
  const tl = await getTranslations("languages");
  const tw = await getTranslations("weekdays");
  const langs = member?.languages ?? ["pt"];
  return (
    <form action={saveStaffAction} className="space-y-4">
      <input type="hidden" name="staffId" value={member?.id ?? ""} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">{t("name")}</label>
          <input name="name" required minLength={2} defaultValue={member?.name} className="input" />
        </div>
        <div>
          <label className="label">{t("title")}</label>
          <input name="title" defaultValue={member?.title} placeholder={t("titlePlaceholder")} className="input" />
        </div>
      </div>
      <fieldset>
        <legend className="label">{t("languages")}</legend>
        <div className="flex flex-wrap gap-3 text-sm">
          {["pt", ...LANGUAGES].map((l) => (
            <label key={l} className="flex items-center gap-1">
              <input type="checkbox" name="languages" value={l} defaultChecked={langs.includes(l)} /> {tl(l as never)}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">{t("services")}</legend>
        {services.length === 0 && <p className="text-sm text-muted">{t("noServices")}</p>}
        <div className="grid gap-1 text-sm sm:grid-cols-2">
          {services.map((s) => (
            <label key={s.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="serviceIds"
                value={s.id}
                defaultChecked={member ? member.serviceIds.includes(s.id) : true}
              />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="label">{t("schedule")}</legend>
        <div className="space-y-1 text-sm">
          {WEEK.map((d) => {
            const shift = member?.hours.find((h) => h.weekday === d);
            const works = member ? Boolean(shift) : d >= 2 && d <= 6;
            return (
              <div key={d} className="flex items-center gap-2">
                <label className="flex w-28 items-center gap-2">
                  <input type="checkbox" name={`day${d}`} defaultChecked={works} /> {tw(String(d) as never)}
                </label>
                <input type="time" name={`start${d}`} defaultValue={hhmm(shift?.startMinute ?? 600)} className="input w-28" />
                <span>–</span>
                <input type="time" name={`end${d}`} defaultValue={hhmm(shift?.endMinute ?? 1140)} className="input w-28" />
              </div>
            );
          })}
        </div>
      </fieldset>
      <button className="btn">{t("save")}</button>
    </form>
  );
}

export default async function TeamPage({ params }: PageProps<"/[locale]/business/team">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { salon } = await requireOwner(locale);
  const t = await getTranslations("business.team");
  const [team, services] = await Promise.all([salonTeam(db, salon.id), salonServices(db, salon.id)]);
  const active = services.filter((s) => s.isActive);

  return (
    <div className="space-y-4">
      {team.map((m) => (
        <details key={m.id} className={`card ${m.isActive ? "" : "opacity-60"}`}>
          <summary className="flex cursor-pointer items-center justify-between">
            <span className="font-medium">
              {m.name} {m.title && <span className="font-normal text-muted">· {m.title}</span>}
            </span>
            <span className="text-sm text-muted">{t("servicesCount", { n: m.serviceIds.length })}</span>
          </summary>
          <div className="mt-4 space-y-4">
            <StaffForm member={m} services={active} />
            <form action={toggleStaffAction}>
              <input type="hidden" name="staffId" value={m.id} />
              <input type="hidden" name="active" value={m.isActive ? "0" : "1"} />
              <button className="text-sm text-muted underline">{m.isActive ? t("deactivate") : t("activate")}</button>
            </form>
          </div>
        </details>
      ))}
      <details className="card" open={team.length === 0}>
        <summary className="cursor-pointer font-semibold">{t("add")}</summary>
        <div className="mt-4">
          <StaffForm services={active} />
        </div>
      </details>
    </div>
  );
}
