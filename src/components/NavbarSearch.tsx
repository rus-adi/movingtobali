"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SearchEntry } from "@/lib/searchIndex";
import prebuilt from "@/generated/searchIndex.json";
import { cn } from "@/lib/cn";
import {
  badge,
  badgeAccent,
  buttonSecondary,
  inputBase,
  pill,
} from "@/components/ui/styles";
import {
  schoolPlanningGuideHref,
  schoolPlanningGuideLabel,
} from "@/lib/schoolLinks";

const SEARCH_INDEX = prebuilt as SearchEntry[];

const suggestions = [
  "Ubud",
  "rent deposit",
  "school tour",
  "budget",
  "rainy season",
  "Gaia Group",
  "Empathy School",
];

const browseLinks = [
  { href: "/plan-your-move", label: "Plan your move" },
  { href: "/areas", label: "Browse areas" },
  { href: schoolPlanningGuideHref, label: schoolPlanningGuideLabel },
  { href: "/contact", label: "Ask a question" },
];

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8.5" cy="8.5" r="5.75" />
      <path d="M13 13l4 4" strokeLinecap="round" />
    </svg>
  );
}

function kindLabel(kind: SearchEntry["kind"]) {
  if (kind === "pillars") return "Hub";
  if (kind === "areas") return "Area";
  if (kind === "guides") return "Guide";
  if (kind === "resources") return "Resource";
  return "Blog";
}

function scoreEntry(entry: SearchEntry, query: string) {
  const title = entry.title.toLowerCase();
  const description = entry.description.toLowerCase();
  let score = 0;

  if (title === query) score += 80;
  if (title.startsWith(query)) score += 40;
  if (title.includes(query)) score += 24;
  if (description.includes(query)) score += 8;
  if ((entry.tags || []).some((tag) => tag.toLowerCase().includes(query)))
    score += 6;
  if ((entry.category || "").toLowerCase().includes(query)) score += 4;
  if (entry.searchText.includes(query)) score += 2;

  return score;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    target.isContentEditable
  );
}

export default function NavbarSearch({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    return SEARCH_INDEX.filter((entry) =>
      entry.searchText.includes(normalizedQuery),
    )
      .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery) }))
      .sort(
        (a, b) =>
          b.score - a.score || a.entry.title.localeCompare(b.entry.title),
      )
      .slice(0, 8)
      .map((item) => item.entry);
  }, [normalizedQuery]);

  const fullSearchHref = normalizedQuery
    ? `/search?q=${encodeURIComponent(query.trim())}`
    : "/search";

  useEffect(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setActiveIndex(-1);
        triggerRef.current?.focus();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }

      if (event.key === "/" && !isEditableTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!results.length) {
      setActiveIndex(-1);
      return;
    }
    setActiveIndex((prev) => (prev >= results.length ? 0 : prev));
  }, [results.length]);

  function openPanel() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closePanel() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function navigateToResult(href: string) {
    closePanel();
    setQuery("");
    router.push(href);
  }

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1 + results.length) % results.length);
      return;
    }

    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (results.length && activeIndex >= 0) {
        navigateToResult(results[activeIndex].path);
        return;
      }
      router.push(fullSearchHref);
      closePanel();
      return;
    }
  }

  const panelId = "navbar-search-panel";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-gray-900 lg:px-4 lg:text-sm"
        aria-label="Search the hub"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? closePanel() : openPanel())}
        data-track="nav_search_toggle"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute right-0 top-full z-[70] mt-3 w-[min(92vw,34rem)] overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl"
        >
          <div className="border-b border-stone-200 bg-stone-50/80 p-4">
            <label
              htmlFor="navbar-search-input"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500"
            >
              Search the hub
            </label>
            <input
              id="navbar-search-input"
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search guides, areas, tools, and resources…"
              className={cn(inputBase, "mt-3")}
              autoComplete="off"
            />
            <p className="mt-3 text-xs leading-5 text-gray-500">
              Start typing for instant results. Press Enter to open the full
              search page if you want every match.
            </p>
          </div>

          <div className="max-h-[65vh] overflow-y-auto p-4">
            {!normalizedQuery ? (
              <div className="grid gap-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Popular searches
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={pill}
                        onClick={() => {
                          setQuery(item);
                          requestAnimationFrame(() =>
                            inputRef.current?.focus(),
                          );
                        }}
                        data-track="nav_search_suggestion"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                    Browse instead
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {browseLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:border-emerald-200 hover:bg-emerald-50"
                        onClick={() => closePanel()}
                        data-track="nav_search_browse"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length ? (
              <div className="grid gap-3">
                {results.map((item, index) => (
                  <Link
                    key={`${item.kind}:${item.slug}`}
                    href={item.path}
                    className={cn(
                      "rounded-2xl border border-stone-200 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50",
                      index === activeIndex &&
                        "border-emerald-200 bg-emerald-50",
                    )}
                    onClick={() => closePanel()}
                    data-track="nav_search_result"
                    data-kind={item.kind}
                    data-slug={item.slug}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badgeAccent}>
                        {kindLabel(item.kind)}
                      </span>
                      {item.category ? (
                        <span className={badge}>{item.category}</span>
                      ) : null}
                    </div>
                    <div className="mt-3 text-sm font-semibold text-gray-900">
                      {item.title}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm leading-6 text-gray-600">
                  <strong className="font-semibold text-gray-900">
                    No exact matches.
                  </strong>
                  <p className="mt-2">
                    Try a broader phrase or jump into one of the calmer starting
                    points below.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {browseLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={pill}
                      onClick={() => closePanel()}
                      data-track="nav_search_no_results_browse"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 border-t border-stone-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={fullSearchHref}
              className={buttonSecondary}
              onClick={() => closePanel()}
              data-track="nav_search_open_full"
            >
              View all results
            </Link>
            <Link
              href="/contact"
              className={buttonSecondary}
              onClick={() => closePanel()}
              data-track="nav_search_contact"
            >
              Ask a question
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
