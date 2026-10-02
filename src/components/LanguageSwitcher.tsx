"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Flag } from "./Flag";

const NAMES: Record<string, string> = { pt: "Português", en: "English" };

export function LanguageSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  function choose(next: string) {
    setOpen(false);
    if (next === locale) return;
    const query = search.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { locale: next }));
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-[3px] border border-line bg-white px-3 py-1.5 text-sm text-ink transition-colors hover:border-ink ${pending ? "opacity-60" : ""}`}
      >
        <Flag locale={locale} />
        <span className="hidden sm:inline">{NAMES[locale]}</span>
        <span className="sm:hidden uppercase">{locale}</span>
        <svg viewBox="0 0 12 12" className={`h-3 w-3 text-muted transition-transform ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-md border border-line bg-white py-1 shadow-[0_12px_32px_-12px_rgb(28_26_31/0.35)]"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => choose(l)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-ink hover:bg-sand"
              >
                <Flag locale={l} />
                <span className="flex-1">{NAMES[l]}</span>
                {l === locale && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-gold" aria-hidden>
                    <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
