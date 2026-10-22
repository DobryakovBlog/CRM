import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { formatDateTime, localDate } from "@/lib/format";
import { requireOwner } from "@/server/auth";
import { salonReviews, salonServices, salonTeam } from "@/server/cabinet";
import { INVITE_MAX_AGE_DAYS, salonInvitations } from "@/server/invitations";
import { invitationMessage } from "@/server/notify";
import { normalizeSocial } from "@/lib/social";
import { ShareInvite } from "@/components/ShareInvite";
import { PhoneInput } from "@/components/PhoneInput";
import { inviteAction, replyAction } from "../actions";

export default async function ReviewsPage({ params, searchParams }: PageProps<"/[locale]/business/reviews">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const { salon } = await requireOwner(locale, "salon");
  const t = await getTranslations("business.reviews");
  const [list, team, services, invitations] = await Promise.all([
    salonReviews(db, salon.id),
    salonTeam(db, salon.id),
    salonServices(db, salon.id),
    salonInvitations(db, salon.id),
  ]);
  const pairs = team
    .filter((m) => m.isActive)
    .flatMap((m) =>
      services.filter((sv) => m.serviceIds.includes(sv.id)).map((sv) => ({ value: `${m.id}|${sv.id}`, label: `${m.name} · ${sv.name}` })),
    );
  const now = new Date();
  const today = localDate(now, salon.timezone);
  const oldest = localDate(new Date(now.getTime() - INVITE_MAX_AGE_DAYS * 86_400_000), salon.timezone);
  const day = (d: Date) => formatDateTime(d, salon.timezone, locale, { dateStyle: "medium" });

  return (
    <div className="space-y-8">
      <section className="card space-y-4">
        <div>
          <h2 className="font-display text-2xl">{t("inviteTitle")}</h2>
          <p className="mt-1 text-sm text-muted">{t("inviteHint")}</p>
        </div>
        {typeof sp.invited === "string" && <p className="notice">{t("invited")}</p>}
        {typeof sp.error === "string" && <p className="notice-error">{t(`inviteErrors.${sp.error}` as never)}</p>}
        {pairs.length === 0 ? (
          <p className="text-sm text-muted">{t("inviteNoTeam")}</p>
        ) : (
          <form action={inviteAction} className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="pair">{t("inviteMasterService")}</label>
              <select id="pair" name="pair" required className="input">
                {pairs.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="visitDate">{t("inviteDate")}</label>
              <input id="visitDate" name="visitDate" type="date" required min={oldest} max={today} defaultValue={today} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="clientName">{t("inviteClientName")}</label>
              <input id="clientName" name="clientName" required maxLength={80} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="clientEmail">{t("inviteClientEmail")}</label>
              <input id="clientEmail" name="clientEmail" type="email" maxLength={120} className="input" />
            </div>
            <div>
              <PhoneInput name="clientPhone" id="clientPhone" locale={locale} label={t("inviteClientPhone")} invalidText={t("inviteErrors.phone")} required={false} />
            </div>
            <div>
              <label className="label" htmlFor="clientLocale">{t("inviteLanguage")}</label>
              <select id="clientLocale" name="clientLocale" defaultValue={locale} className="input">
                <option value="pt">Português</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="btn-gold w-full">{t("inviteSend")}</button>
            </div>
            <p className="text-xs text-muted sm:col-span-2">{t("inviteRules")}</p>
          </form>
        )}
        {invitations.length > 0 && (
          <div className="border-t border-line pt-4">
            <h3 className="mb-2 text-sm font-semibold">{t("invitationsTitle")}</h3>
            <ul className="divide-y divide-line text-sm">
              {invitations.map((i) => (
                <li
                  key={i.id}
                  id={`invite-${i.id}`}
                  className={`scroll-mt-40 space-y-2 py-2 ${sp.invited === i.id ? "-mx-2 rounded bg-sand px-2" : ""}`}
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <span>
                      {i.clientName} <span className="text-muted">· {i.staffName} · {i.serviceName} · {day(i.startsAt)}</span>
                    </span>
                    <span className={i.reviewId ? "text-gold-deep" : "text-muted"}>
                      {i.reviewId ? t("invitationReviewed") : t("invitationWaiting")}
                    </span>
                  </div>
                  {!i.reviewId && (
                    <ShareInvite
                      text={invitationMessage(i).text}
                      whatsapp={i.clientPhone ? normalizeSocial("whatsapp", i.clientPhone) : null}
                      phone={i.clientPhone}
                      labels={{ copy: t("shareCopy"), copied: t("shareCopied"), whatsapp: t("shareWhatsapp"), sms: t("shareSms") }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl">{t("listTitle")}</h2>
        {list.length === 0 && <p className="text-muted">{t("empty")}</p>}
        {list.map((r) => (
          <div key={r.id} className={`card space-y-2 ${r.status === "hidden" ? "opacity-60" : ""}`}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {r.authorName} · {r.staffName}
              </span>
              <span className="text-gold">{"★".repeat(r.rating)}</span>
            </div>
            <p className="text-xs text-muted">
              {day(r.createdAt)} · {!r.source ? t("viaClient") : r.source === "marketplace" ? t("viaAstrabela") : t("viaSalon")}
              {r.status === "hidden" && ` · ${t("hidden")}`}
            </p>
            {r.text && <p className="whitespace-pre-line">{r.text}</p>}
            <form action={replyAction} className="space-y-2">
              <input type="hidden" name="reviewId" value={r.id} />
              <textarea name="reply" rows={2} defaultValue={r.reply ?? ""} placeholder={t("replyPlaceholder")} className="input" />
              <button className="btn-outline text-xs">{r.reply ? t("updateReply") : t("reply")}</button>
            </form>
          </div>
        ))}
        <p className="text-xs text-muted">{t("cannotDelete")}</p>
      </section>
    </div>
  );
}
