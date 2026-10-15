"use client";

import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";

const WHO = "ba_who";
const readWho = () => {
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${WHO}=`))?.slice(WHO.length + 1);
  try {
    return raw ? decodeURIComponent(decodeURIComponent(raw)) : "";
  } catch {
    return "";
  }
};

/** Header link to the account page: "Sign in", or an initial badge and the first name once signed in. */
export function AccountLink({ label }: { label: string }) {
  const who = useSyncExternalStore(
    () => () => {},
    readWho,
    () => "",
  );
  return (
    <Link
      href="/account"
      className="inline-flex items-center gap-1.5 rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink transition-colors hover:border-gold"
    >
      {who ? (
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold uppercase text-porcelain"
        >
          {Array.from(who)[0]}
        </span>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </svg>
      )}
      <span className={`max-w-[7rem] truncate ${who ? "font-semibold" : ""}`}>{who || label}</span>
    </Link>
  );
}
