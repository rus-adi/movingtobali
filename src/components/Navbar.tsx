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

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/start-here", label: "Start Here", track: "nav_start" },
      { href: "/plan-your-move", label: "Plan Your Move", track: "nav_plan" },
      { href: "/areas", label: "Areas", track: "nav_areas" },
      { href: "/housing", label: "Housing", track: "nav_housing" },
      { href: "/daily-life", label: "Daily Life", track: "nav_daily_life" },
      { href: "/costs", label: "Costs", track: "nav_costs" },
      { href: "/schools", label: "Empathy School", track: "nav_empathy_school" },
      { href: "/partners", label: "Partners", track: "nav_partners" },
    ],
    []
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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) => {
    if (href === "/plan-your-move") {
      return pathname === "/plan-your-move" || pathname === "/move-timeline" || pathname === "/decision-checklists" || pathname === "/family-path-match" || pathname === "/test-stay-vs-full-move" || pathname === "/housing-style-compare" || pathname === "/video-recaps" || pathname === "/conversation-paths" || pathname === "/how-this-hub-works";
    }
    if (href === "/areas") {
      return pathname === "/areas" || pathname === "/area-match" || pathname === "/compare-areas" || pathname === "/commute-reality" || pathname.startsWith("/areas/");
    }
    if (href === "/housing") {
      return pathname === "/housing" || pathname === "/gaia-group" || pathname === "/housing-intro-readiness" || pathname === "/housing-brief-builder";
    }
    if (href === "/daily-life") {
      return pathname === "/daily-life" || pathname === "/weekday-reality" || pathname === "/settling-in" || pathname === "/daily-life";
    }
    if (href === "/schools") {
      return pathname === "/schools" || pathname === "/empathy-school-fit" || pathname === "/empathy-school-tour-prep";
    }
    return pathname === href;
  };

  const linkCls = (href: string) =>
    cn(
      "rounded-full px-3 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ease-out hover:bg-emerald-50 hover:text-gray-900 lg:text-sm",
      isActive(href) && "bg-emerald-50 text-emerald-800 shadow-sm"
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
          <Link
            className="flex items-center gap-3 font-semibold tracking-tight text-gray-900"
            href="/"
            data-track="nav_home"
          >
            <span
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-amber-400 to-emerald-700 shadow-sm"
              aria-hidden
            />
            <span>{site.brand.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-0.5 md:flex lg:gap-1" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkCls(item.href)}
                  data-track={item.track}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
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

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-gray-900",
                  isActive(item.href) && "bg-emerald-50 text-emerald-800"
                )}
                data-track={item.track}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
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
