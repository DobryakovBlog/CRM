import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { cityName } from "@/lib/slug";
import type { searchRestaurants } from "@/server/menu";
import { Monogram } from "./SalonCard";

type Restaurant = Awaited<ReturnType<typeof searchRestaurants>>[number];

export async function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  const t = await getTranslations("restaurants");
  const locale = await getLocale();
  return (
    <Link
      href={`/restaurant/${r.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-white transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(28_26_31/0.45)]"
    >
      <Monogram name={r.name} className="aspect-[16/9] w-full" />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-xl leading-tight group-hover:text-gold-deep">{r.name}</h2>
        {r.cuisine && <p className="text-sm text-ink">{r.cuisine}</p>}
        <p className="text-sm text-muted">{[r.district, cityName(r.city)].filter(Boolean).join(" · ")}</p>
        <p className="mt-auto flex justify-between pt-3 text-sm">
          <span>{t("dishes", { count: r.dishes })}</span>
          <span>{t("from", { price: formatPrice(r.minPriceCents, locale) })}</span>
        </p>
      </div>
    </Link>
  );
}
