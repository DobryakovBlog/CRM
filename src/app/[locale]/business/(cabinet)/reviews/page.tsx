import { getTranslations, setRequestLocale } from "next-intl/server";
import { db } from "@/db";
import { formatDateTime } from "@/lib/format";
import { requireOwner } from "@/server/auth";
import { salonReviews } from "@/server/cabinet";
import { replyAction } from "../actions";

export default async function ReviewsPage({ params }: PageProps<"/[locale]/business/reviews">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { salon } = await requireOwner(locale);
  const t = await getTranslations("business.reviews");
  const list = await salonReviews(db, salon.id);

  return (
    <div className="space-y-4">
      {list.length === 0 && <p className="text-stone-600">{t("empty")}</p>}
      {list.map((r) => (
        <div key={r.id} className={`card space-y-2 ${r.status === "hidden" ? "opacity-60" : ""}`}>
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {r.authorName} · {r.staffName}
            </span>
            <span className="text-amber-500">{"★".repeat(r.rating)}</span>
          </div>
          <p className="text-xs text-stone-500">
            {formatDateTime(r.createdAt, salon.timezone, locale, { dateStyle: "medium" })}
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
    </div>
  );
}
