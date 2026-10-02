import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireOwner } from "@/server/auth";
import { logoutAction } from "../actions";

const TABS = ["calendar", "services", "team", "reviews", "profile"] as const;

export default async function CabinetLayout({ children, params }: LayoutProps<"/[locale]/business">) {
  const { locale } = await params;
  const { user, salon } = await requireOwner(locale);
  const t = await getTranslations("business");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{t(`salonStatus.${salon.status}`)}</p>
          <h1 className="font-display text-3xl">{salon.name}</h1>
        </div>
        <form action={logoutAction}>
          <button className="text-sm text-muted hover:underline">{t("logout")}</button>
        </form>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-b border-line text-sm">
        {[...TABS, ...(user.isAdmin ? (["admin"] as const) : [])].map((tab) => (
          <Link key={tab} href={`/business/${tab}`} className="whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-muted transition-colors hover:border-gold hover:text-ink">
            {t(`tabs.${tab}`)}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
