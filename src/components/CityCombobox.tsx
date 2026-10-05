"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type CityOption = { slug: string; name: string; area?: string; hasSalons: boolean };

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/** Rank: name starts with the query, then a word starts with it, then it appears anywhere. */
function match(options: CityOption[], query: string) {
  const q = fold(query);
  if (!q) return options;
  const rank = (o: CityOption) => {
    const n = fold(o.name);
    if (n.startsWith(q)) return 0;
    if (n.split(/[\s-]+/).some((w) => w.startsWith(q))) return 1;
    return n.includes(q) ? 2 : -1;
  };
  return options
    .map((o) => ({ o, r: rank(o) }))
    .filter((x) => x.r >= 0)
    .sort((a, b) => a.r - b.r)
    .map((x) => x.o);
}

/**
 * City field you can type into: suggestions narrow with each letter (accents
 * optional, "evora" finds Évora). It starts with the given options; with
 * searchUrl it also asks the server, which knows every town and village.
 * Submits the place slug in a hidden input.
 */
export function CityCombobox({
  name,
  options,
  defaultSlug,
  label,
  placeholder,
  noMatch,
  soonLabel,
  searchUrl,
  id,
}: {
  name: string;
  options: CityOption[];
  defaultSlug: string;
  label: string;
  placeholder: string;
  noMatch: string;
  soonLabel?: string;
  /** Endpoint answering ?q= with CityOption[]. */
  searchUrl?: string;
  id?: string;
}) {
  const byslug = useMemo(() => new Map(options.map((o) => [o.slug, o])), [options]);
  const [chosen, setChosen] = useState<CityOption | undefined>(byslug.get(defaultSlug) ?? options[0]);
  const slug = chosen?.slug ?? "";
  const [text, setText] = useState(chosen?.name ?? "");
  const [remote, setRemote] = useState<{ q: string; list: CityOption[] }>({ q: "", list: [] });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  // While the field shows the chosen city, offer the whole list.
  const typing = text !== chosen?.name;
  const local = typing ? match(options, text) : options;
  const list = typing && searchUrl && remote.q === text.trim() ? remote.list : local;

  useEffect(() => {
    const q = text.trim();
    if (!searchUrl || !typing || q.length < 2) return;
    const ctl = new AbortController();
    const timer = setTimeout(() => {
      fetch(`${searchUrl}${searchUrl.includes("?") ? "&" : "?"}q=${encodeURIComponent(q)}`, { signal: ctl.signal })
        .then((r) => (r.ok ? r.json() : []))
        .then((found: CityOption[]) => setRemote({ q, list: found }))
        .catch(() => {});
    }, 120);
    return () => {
      clearTimeout(timer);
      ctl.abort();
    };
  }, [text, typing, searchUrl]);

  function choose(o: CityOption) {
    setChosen(o);
    setText(o.name);
    setOpen(false);
  }

  // Leaving the field keeps a valid city: the best match, or the previous choice.
  function settle() {
    setOpen(false);
    if (!typing) return;
    const best = list[0];
    if (best && text.trim()) choose(best);
    else setText(chosen?.name ?? "");
  }

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) settle();
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  });

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return setOpen(true);
      const d = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (list.length ? (i + d + list.length) % list.length : 0));
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      if (list[active]) choose(list[active]);
    } else if (e.key === "Escape") {
      settle();
    } else if (e.key === "Tab") {
      settle();
    }
  }

  return (
    <div ref={root} className="relative">
      <input type="hidden" name={name} value={slug} />
      <input
        ref={input}
        id={id}
        type="text"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && list[active] ? `${listId}-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={(e) => {
          e.target.select();
          setOpen(true);
        }}
        onClick={() => setOpen(true)}
        onKeyDown={onKey}
        className="input pr-9"
      />
      <svg viewBox="0 0 12 12" className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted" aria-hidden>
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 z-30 mt-1 max-h-72 overflow-auto rounded-md border border-line bg-white py-1 text-ink shadow-[0_12px_32px_-12px_rgb(28_26_31/0.35)]"
        >
          {list.length === 0 && <li className="px-4 py-2.5 text-sm text-muted">{noMatch}</li>}
          {list.map((o, i) => (
            <li
              key={o.slug}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o.slug === slug}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-1.5 text-sm ${i === active ? "bg-sand" : ""}`}
            >
              <span className="min-w-0">
                <span className={o.slug === slug ? "font-semibold" : ""}>{o.name}</span>
                {o.area && <span className="block truncate text-xs text-muted">{o.area}</span>}
              </span>
              {soonLabel && !o.hasSalons && <span className="shrink-0 text-xs text-muted">{soonLabel}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
