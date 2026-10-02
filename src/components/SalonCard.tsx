import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { cityName } from "@/lib/slug";
import type { searchSalons } from "@/server/catalog";
import { Stars } from "./Stars";

type Salon = Awaited<ReturnType<typeof searchSalons>>[number];

export function Monogram({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-plum ${className}`} aria-hidden>
      <div className="absolute inset-3 border border-gold/40" />
      <span className="font-display text-4xl text-gold-soft">{initials}</span>
    </div>
  );
}

export async function SalonCard({ salon }: { salon: Salon }) {
  const t = await getTranslations("search");
  const locale = await getLocale();
  return (
    <Link
      href={`/salon/${salon.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(28_26_31/0.45)]"
    >
      <Monogram name={salon.name} className="aspect-[16/9] w-full" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl leading-tight group-hover:text-gold-deep">{salon.name}</h2>
          <Stars x100={salon.ratingAvg} count={salon.ratingCount} newLabel={t("new")} />
        </div>
        <p className="text-sm text-muted">{[salon.district, cityName(salon.city)].filter(Boolean).join(" · ")}</p>
        <p className="mt-auto pt-3 text-sm text-ink">{t("from", { price: formatPrice(salon.minPriceCents, locale) })}</p>
      </div>
    </Link>
  );
}
