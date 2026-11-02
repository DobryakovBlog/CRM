"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { TelegramIcon } from "./SupportLink";

const icon = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
    {d}
  </svg>
);
const SEARCH = icon(<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>);
const DINING = icon(<path d="M7 3v8m-2.5-8v5a2.5 2.5 0 0 0 5 0V3M7 11v10m10-18c-2 1.5-3 4-3 7h3m0-7v18" />);
const CALENDAR = icon(<><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17M8 3v4m8-4v4" /></>);

/**
 * Phone navigation pinned to the bottom of the screen, as in booking apps: salons, restaurants,
 * the client's bookings and support. Hidden from tablet width up, where the header carries these.
 */
export function BottomTabs({
  salons,
  restaurants,
  bookings,
  support,
  supportHref,
}: {
  salons: string;
  restaurants: string;
  bookings: string;
  support: string;
  supportHref: string | null;
}) {
  const path = usePathname();
  if (path.startsWith("/business")) return null; // the business cabinet has its own menu
  const inRestaurants = path.startsWith("/restaurant");
  const inBookings = path.startsWith("/account") || path.startsWith("/booking/");
  const inSalons = !inRestaurants && !inBookings;
  const tab = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-0.5 pb-1.5 pt-2 text-[11px] font-medium ${active ? "text-navy" : "text-muted"}`;
  const current = (active: boolean) => (active ? ("page" as const) : undefined);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md">
        <Link href="/" className={tab(inSalons)} aria-current={current(inSalons)}>
          {SEARCH}
          {salons}
        </Link>
        <Link href="/restaurants" className={tab(inRestaurants)} aria-current={current(inRestaurants)}>
          {DINING}
          {restaurants}
        </Link>
        <Link href="/account" className={tab(inBookings)} aria-current={current(inBookings)}>
          {CALENDAR}
          {bookings}
        </Link>
        {supportHref && (
          <a href={supportHref} target="_blank" rel="noopener noreferrer" className={tab(false)}>
            <TelegramIcon className="h-6 w-6" />
            {support}
          </a>
        )}
      </div>
    </nav>
  );
}
