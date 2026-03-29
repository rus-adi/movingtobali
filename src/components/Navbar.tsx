"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { getSite } from "@/lib/site";
import { cn } from "@/lib/cn";
import { buttonPrimary } from "@/components/ui/styles";

type NavItem = {
  href: string;
  label: string;
  track: string;
  match?: (path: string) => boolean;
};

type NavGroup = {
  label: string;
  track: string;
  items: NavItem[];
};

function MenuIcon({ className }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-6 w-6 items-center justify-center ${className || ""}`}
      aria-hidden="true"
    >
      <span className="absolute h-0.5 w-5 rounded-full bg-current" style={{ transform: "translateY(-6px)" }} />
      <span className="absolute h-0.5 w-5 rounded-full bg-current" />
      <span className="absolute h-0.5 w-5 rounded-full bg-current" style={{ transform: "translateY(6px)" }} />
    </span>
  );
}

export default function Navbar() {
  const site = getSite();
  const pathname = usePathname();

  const topLevelItems: NavItem[] = useMemo(
    () => [
      { href: "/", label: "Home", track: "nav_home_top" },
      { href: "/start-here", label: "Start Here", track: "nav_start" },
    ],
    [],
  );

  const groupedItems: NavGroup[] = useMemo(
    () => [
      {
        label: "Plan",
        track: "nav_group_plan",
        items: [
          { href: "/plan-your-move", label: "Plan Your Move", track: "nav_plan" },
          { href: "/move-timeline", label: "Move Timeline", track: "nav_timeline" },
          { href: "/decision-checklists", label: "Decision Checklists", track: "nav_checklists" },
          { href: "/family-path-match", label: "Family Path Match", track: "nav_family_path_match" },
          { href: "/budget-calculator", label: "Budget Calculator", track: "nav_budget" },
        ],
      },
      {
        label: "Explore",
        track: "nav_group_explore",
        items: [
          { href: "/areas", label: "Areas", track: "nav_areas", match: (path) => path === "/areas" || path.startsWith("/areas/") || path === "/area-match" || path === "/compare-areas" || path === "/commute-reality" },
          { href: "/daily-life", label: "Daily Life", track: "nav_daily_life", match: (path) => path === "/daily-life" || path === "/weekday-reality" || path === "/settling-in" },
          { href: "/guides", label: "Guides", track: "nav_guides", match: (path) => path === "/guides" || path.startsWith("/guides/") },
          { href: "/resources", label: "Resources", track: "nav_resources", match: (path) => path === "/resources" || path.startsWith("/resources/") },
          { href: "/blog", label: "Blog", track: "nav_blog", match: (path) => path === "/blog" || path.startsWith("/blog/") },
        ],
      },
      {
        label: "School & Housing",
        track: "nav_group_school_housing",
        items: [
          { href: "/schools", label: "Empathy School", track: "nav_empathy_school", match: (path) => path === "/schools" || path === "/empathy-school-fit" || path === "/empathy-school-tour-prep" },
          { href: "/housing", label: "Housing", track: "nav_housing", match: (path) => path === "/housing" || path === "/gaia-group" || path === "/housing-intro-readiness" || path === "/housing-brief-builder" },
          { href: "/partners", label: "Partners", track: "nav_partners" },
        ],
      },
      {
        label: "Home sections",
        track: "nav_group_home_sections",
        items: [
          { href: "/#starting-points", label: "Starting points", track: "nav_home_starting_points" },
          { href: "/#move-system", label: "Tools", track: "nav_home_tools" },
          { href: "/#family-setups", label: "Family setups", track: "nav_home_family_setups" },
          { href: "/#comparison-tools", label: "Comparison tools", track: "nav_home_comparison" },
          { href: "/#watch-before-you-decide", label: "Video recaps", track: "nav_home_video_recaps" },
        ],
      },
    ],
    [],
  );

  const contactItem: NavItem = useMemo(
    () => ({ href: "/contact", label: "Contact", track: "nav_contact" }),
    []
  );

  const searchItem: NavItem = useMemo(
    () => ({ href: "/search", label: "Search", track: "nav_search" }),
    []
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpenGroup, setDesktopOpenGroup] = useState<string | null>(null);
  const [mobileOpenGroups, setMobileOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMobileOpen(false);
    setDesktopOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (item: NavItem) => item.match ? item.match(pathname) : pathname === item.href;
  const isGroupActive = (group: NavGroup) => group.items.some((item) => isActive(item));
  const groupId = (groupLabel: string) => groupLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const toggleMobileGroup = (label: string) => {
    setMobileOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const linkCls = (item: NavItem) =>
    cn(
      "rounded-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ease-out hover:bg-emerald-50 hover:text-gray-900 lg:text-sm",
      isActive(item) && "active bg-emerald-50 text-emerald-800 shadow-sm",
    );

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="border-b border-stone-200 bg-gradient-to-r from-amber-50 via-white to-emerald-50">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-2 text-[11px] font-medium text-gray-600 sm:text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a href={site.brand.publisherUrl} target="_blank" rel="noreferrer" className="transition hover:text-gray-900" data-track="nav_utility_empathy">
              Built by Empathy School
            </a>
            <span className="text-stone-300" aria-hidden>•</span>
            <Link href="/gaia-group" className="transition hover:text-gray-900" data-track="nav_utility_gaia">
              Housing partner: Gaia Group
            </Link>
            <span className="text-stone-300" aria-hidden>•</span>
            <Link href="/editorial-standards" className="transition hover:text-gray-900" data-track="nav_utility_editorial">
              Editorial standards
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/search" className="font-medium text-gray-700 transition hover:text-gray-900" data-track="nav_utility_search">
              Search the hub
            </Link>
            <Link href="/how-this-hub-works" className="font-semibold text-gray-900 transition hover:text-emerald-800" data-track="nav_utility_hub">
              How this hub works →
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link className="flex items-center gap-3 font-semibold tracking-tight text-gray-900" href="/" data-track="nav_home">
            <span
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-amber-400 to-emerald-700 shadow-sm"
              aria-hidden
            />
            <span>{site.brand.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="Primary navigation">
              {topLevelItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkCls(item)}
                  data-track={item.track}
                  aria-current={isActive(item) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
              {groupedItems.map((group) => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setDesktopOpenGroup(group.label)}
                  onMouseLeave={() => setDesktopOpenGroup(null)}
                >
                  <button
                    type="button"
                    className={cn(
                      "rounded-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ease-out hover:bg-emerald-50 hover:text-gray-900 lg:text-sm",
                      isGroupActive(group) && "active bg-emerald-50 text-emerald-800 shadow-sm",
                    )}
                    aria-expanded={desktopOpenGroup === group.label}
                    aria-haspopup="menu"
                    aria-controls={`desktop-nav-${groupId(group.label)}`}
                    onClick={() => setDesktopOpenGroup((prev) => (prev === group.label ? null : group.label))}
                    data-track={group.track}
                  >
                    {group.label}
                  </button>
                  {desktopOpenGroup === group.label ? (
                    <div
                      id={`desktop-nav-${groupId(group.label)}`}
                      role="menu"
                      aria-label={`${group.label} links`}
                      className="absolute left-0 top-full z-50 mt-2 min-w-56 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg"
                    >
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          className={cn(
                            "block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900",
                            isActive(item) && "active bg-emerald-50 text-emerald-800",
                          )}
                          data-track={item.track}
                          aria-current={isActive(item) ? "page" : undefined}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <Link
              href={searchItem.href}
              data-track={searchItem.track}
              aria-current={pathname === searchItem.href ? "page" : undefined}
              className={cn("!hidden md:!inline-flex items-center justify-center", "rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-gray-900 lg:text-sm")}
            >
              {searchItem.label}
            </Link>

            <Link
              href={contactItem.href}
              data-track={contactItem.track}
              aria-current={pathname === contactItem.href ? "page" : undefined}
              className={cn("!hidden md:!inline-flex items-center justify-center", buttonPrimary)}
            >
              {contactItem.label}
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white p-2.5 text-gray-700 shadow-sm transition hover:bg-emerald-50 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              data-track="nav_mobile_toggle"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden transition-all duration-200 md:hidden",
            mobileOpen ? "max-h-[80vh] opacity-100 pb-6" : "max-h-0 opacity-0"
          )}
        >
          <nav className="grid gap-1 pt-2" aria-label="Mobile navigation">
            <Link
              href="/how-this-hub-works"
              className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900"
              data-track="nav_mobile_hub"
              onClick={() => setMobileOpen(false)}
            >
              How this hub works
            </Link>

            <Link
              href={searchItem.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900"
              data-track={searchItem.track}
              aria-current={pathname === searchItem.href ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {searchItem.label}
            </Link>

            {topLevelItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900",
                  isActive(item) && "active bg-emerald-50 text-emerald-800",
                )}
                data-track={item.track}
                aria-current={isActive(item) ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {groupedItems.map((group) => (
              <div key={group.label} className="rounded-xl border border-stone-200">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-gray-800 transition hover:bg-emerald-50",
                    isGroupActive(group) && "active bg-emerald-50 text-emerald-800",
                  )}
                  aria-expanded={Boolean(mobileOpenGroups[group.label])}
                  aria-controls={`mobile-nav-${groupId(group.label)}`}
                  onClick={() => toggleMobileGroup(group.label)}
                  data-track={group.track}
                >
                  {group.label}
                  <span aria-hidden>{mobileOpenGroups[group.label] ? "−" : "+"}</span>
                </button>
                {mobileOpenGroups[group.label] ? (
                  <div id={`mobile-nav-${groupId(group.label)}`} className="grid gap-1 px-2 pb-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900",
                          isActive(item) && "active bg-emerald-50 text-emerald-800",
                        )}
                        data-track={item.track}
                        aria-current={isActive(item) ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            <Link
              href={contactItem.href}
              className={cn("mt-2", buttonPrimary)}
              data-track={contactItem.track}
              aria-current={pathname === contactItem.href ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {contactItem.label}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
