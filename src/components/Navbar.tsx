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
};

type NavGroup = {
  label: string;
  track: string;
  items: NavItem[];
  activePaths: string[];
};

function MenuIcon({ className }: { className?: string }) {
  return (
    <span className={`relative inline-flex h-6 w-6 items-center justify-center ${className || ""}`} aria-hidden="true">
      <span className="absolute h-0.5 w-5 rounded-full bg-current" style={{ transform: "translateY(-6px)" }} />
      <span className="absolute h-0.5 w-5 rounded-full bg-current" />
      <span className="absolute h-0.5 w-5 rounded-full bg-current" style={{ transform: "translateY(6px)" }} />
    </span>
  );
}

export default function Navbar() {
  const site = getSite();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);

  const homeSections: NavItem[] = useMemo(
    () => [
      { href: "/#starting-points", label: "Start here", track: "nav_home_start" },
      { href: "/#move-system", label: "Tools", track: "nav_home_tools" },
      { href: "/#family-setups", label: "Family setups", track: "nav_home_family" },
      { href: "/#daily-life", label: "Daily life", track: "nav_home_daily" },
      { href: "/#comparison-tools", label: "Compare", track: "nav_home_compare" },
      { href: "/#watch-before-you-decide", label: "Video recaps", track: "nav_home_video" },
      { href: "/#areas", label: "Areas", track: "nav_home_areas" },
      { href: "/#guides", label: "Guides", track: "nav_home_guides" },
    ],
    []
  );

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        label: "Move Planning",
        track: "nav_group_planning",
        activePaths: ["/plan-your-move", "/move-timeline", "/decision-checklists", "/family-path-match", "/test-stay-vs-full-move", "/housing-style-compare", "/video-recaps", "/conversation-paths", "/how-this-hub-works", "/first-month-planner"],
        items: [
          { href: "/plan-your-move", label: "Plan your move", track: "nav_plan" },
          { href: "/move-timeline", label: "Move timeline", track: "nav_timeline" },
          { href: "/decision-checklists", label: "Decision checklists", track: "nav_checklists" },
          { href: "/first-month-planner", label: "First month planner", track: "nav_first_month" },
        ],
      },
      {
        label: "Places & Housing",
        track: "nav_group_places_housing",
        activePaths: ["/areas", "/area-match", "/compare-areas", "/commute-reality", "/housing", "/gaia-group", "/housing-intro-readiness", "/housing-brief-builder"],
        items: [
          { href: "/areas", label: "Areas", track: "nav_areas" },
          { href: "/area-match", label: "Area match", track: "nav_area_match" },
          { href: "/compare-areas", label: "Compare areas", track: "nav_compare_areas" },
          { href: "/housing", label: "Housing", track: "nav_housing" },
        ],
      },
      {
        label: "Family Life",
        track: "nav_group_family",
        activePaths: ["/daily-life", "/weekday-reality", "/family-life", "/resources", "/guides", "/blog"],
        items: [
          { href: "/daily-life", label: "Daily life", track: "nav_daily_life" },
          { href: "/weekday-reality", label: "Weekday reality", track: "nav_weekday_reality" },
          { href: "/resources", label: "Resources", track: "nav_resources" },
          { href: "/guides", label: "Guides", track: "nav_guides" },
        ],
      },
      {
        label: "Empathy School",
        track: "nav_group_empathy",
        activePaths: ["/schools", "/empathy-school-fit", "/empathy-school-tour-prep", "/partners"],
        items: [
          { href: "/schools", label: "School overview", track: "nav_empathy_school" },
          { href: "/empathy-school-fit", label: "School fit tool", track: "nav_school_fit" },
          { href: "/empathy-school-tour-prep", label: "Tour prep", track: "nav_tour_prep" },
          { href: "/partners", label: "Partners", track: "nav_partners" },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    setMobileOpen(false);
    setOpenDesktopDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setOpenDesktopDropdown(null);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const isPathInGroup = (group: NavGroup) =>
    group.activePaths.some((basePath) => pathname === basePath || pathname.startsWith(`${basePath}/`));

  const isHomeActive = pathname === "/";

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
          <Link className="flex items-center gap-3 font-semibold tracking-tight text-gray-900" href="/" data-track="nav_home_brand">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-amber-400 to-emerald-700 shadow-sm" aria-hidden />
            <span>{site.brand.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
              <div
                className="relative"
                onMouseEnter={() => setOpenDesktopDropdown("home")}
                onMouseLeave={() => setOpenDesktopDropdown((value) => (value === "home" ? null : value))}
              >
                <button
                  type="button"
                  className={cn(
                    "rounded-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ease-out hover:bg-emerald-50 hover:text-gray-900 lg:text-sm",
                    isHomeActive && "active bg-emerald-50 text-emerald-800 shadow-sm"
                  )}
                  aria-expanded={openDesktopDropdown === "home"}
                  aria-haspopup="true"
                  aria-controls="desktop-home-dropdown"
                  onClick={() => setOpenDesktopDropdown((value) => (value === "home" ? null : "home"))}
                  data-track="nav_home_menu"
                >
                  Home
                </button>
                <div
                  id="desktop-home-dropdown"
                  className={cn(
                    "absolute left-0 top-full mt-2 w-60 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl",
                    openDesktopDropdown === "home" ? "block" : "hidden"
                  )}
                  role="menu"
                  aria-label="Home sections"
                >
                  {homeSections.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900"
                      data-track={item.track}
                      onClick={() => setOpenDesktopDropdown(null)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {navGroups.map((group) => {
                const isActive = isPathInGroup(group);
                const dropdownId = `desktop-${group.track}-dropdown`;

                return (
                  <div
                    key={group.label}
                    className="relative"
                    onMouseEnter={() => setOpenDesktopDropdown(group.label)}
                    onMouseLeave={() => setOpenDesktopDropdown((value) => (value === group.label ? null : value))}
                  >
                    <button
                      type="button"
                      className={cn(
                        "rounded-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ease-out hover:bg-emerald-50 hover:text-gray-900 lg:text-sm",
                        isActive && "active bg-emerald-50 text-emerald-800 shadow-sm"
                      )}
                      aria-expanded={openDesktopDropdown === group.label}
                      aria-haspopup="true"
                      aria-controls={dropdownId}
                      onClick={() => setOpenDesktopDropdown((value) => (value === group.label ? null : group.label))}
                      data-track={group.track}
                    >
                      {group.label}
                    </button>
                    <div
                      id={dropdownId}
                      className={cn(
                        "absolute left-0 top-full mt-2 w-64 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl",
                        openDesktopDropdown === group.label ? "block" : "hidden"
                      )}
                      role="menu"
                      aria-label={`${group.label} pages`}
                    >
                      {group.items.map((item) => {
                        const itemActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900",
                              itemActive && "active bg-emerald-50 text-emerald-800"
                            )}
                            data-track={item.track}
                            aria-current={itemActive ? "page" : undefined}
                            onClick={() => setOpenDesktopDropdown(null)}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            <Link
              href="/search"
              data-track="nav_search"
              aria-current={pathname === "/search" ? "page" : undefined}
              className={cn("!hidden md:!inline-flex items-center justify-center", "rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-gray-900 lg:text-sm", pathname === "/search" && "active bg-emerald-50 text-emerald-800")}
            >
              Search
            </Link>

            <Link
              href="/contact"
              data-track="nav_contact"
              aria-current={pathname === "/contact" ? "page" : undefined}
              className={cn("!hidden md:!inline-flex items-center justify-center", buttonPrimary, pathname === "/contact" && "active")}
            >
              Contact
            </Link>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white p-2.5 text-gray-700 shadow-sm transition hover:bg-emerald-50 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileOpen((v) => !v)}
              data-track="nav_mobile_toggle"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          id="mobile-navigation"
          className={cn("overflow-hidden transition-all duration-200 md:hidden", mobileOpen ? "max-h-[85vh] opacity-100 pb-6" : "max-h-0 opacity-0")}
        >
          <nav className="grid gap-2 pt-2" aria-label="Mobile navigation">
            <details className="rounded-xl border border-stone-200 bg-white/80 px-2 py-1">
              <summary className={cn("cursor-pointer list-none rounded-lg px-2 py-2 text-sm font-semibold text-gray-800", isHomeActive && "active bg-emerald-50 text-emerald-800")}>Home sections</summary>
              <div className="grid gap-1 px-1 pb-2">
                {homeSections.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900"
                    data-track={item.track}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>

            {navGroups.map((group) => {
              const groupActive = isPathInGroup(group);
              return (
                <details key={group.label} className="rounded-xl border border-stone-200 bg-white/80 px-2 py-1">
                  <summary className={cn("cursor-pointer list-none rounded-lg px-2 py-2 text-sm font-semibold text-gray-800", groupActive && "active bg-emerald-50 text-emerald-800")}>
                    {group.label}
                  </summary>
                  <div className="grid gap-1 px-1 pb-2">
                    {group.items.map((item) => {
                      const itemActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn("rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900", itemActive && "active bg-emerald-50 text-emerald-800")}
                          data-track={item.track}
                          aria-current={itemActive ? "page" : undefined}
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </details>
              );
            })}

            <div className="grid gap-2 pt-1">
              <Link href="/search" className={cn("rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900", pathname === "/search" && "active bg-emerald-50 text-emerald-800")} data-track="nav_search" onClick={() => setMobileOpen(false)}>
                Search
              </Link>
              <Link href="/contact" className={cn(buttonPrimary, pathname === "/contact" && "active")} data-track="nav_contact" onClick={() => setMobileOpen(false)}>
                Contact
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
