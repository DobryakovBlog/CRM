"use client";

import { Link, usePathname } from "@/i18n/navigation";

/** Header switch between the two parts of the site. */
export function SectionNav({ salons, restaurants }: { salons: string; restaurants: string }) {
  const path = usePathname();
  const inRestaurants = path.startsWith("/restaurant");
  // The business cabinet belongs to neither section.
  const inSalons = !inRestaurants && !path.startsWith("/business");
  const item = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm transition-colors sm:px-4 ${active ? "bg-plum text-white" : "text-muted hover:text-ink"}`;
  return (
    <nav className="flex items-center rounded-full border border-line bg-white p-0.5">
      <Link href="/" className={item(inSalons)} aria-current={inSalons ? "page" : undefined}>
        {salons}
      </Link>
      <Link href="/restaurants" className={item(inRestaurants)} aria-current={inRestaurants ? "page" : undefined}>
        {restaurants}
      </Link>
    </nav>
  );
}
