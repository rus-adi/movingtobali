"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { getSite } from "@/lib/site";
import { cn } from "@/lib/cn";
import { buttonPrimary } from "@/components/ui/styles";

type NavItem = {
  href: string;
  label: string;
  track: string;
};

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 7H20M4 12H20M4 17H20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const site = getSite();
  const pathname = usePathname();

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/start-here", label: "Start here", track: "nav_start" },
      { href: "/visas", label: "Visas", track: "nav_visas" },
      { href: "/housing", label: "Housing", track: "nav_housing" },
      { href: "/areas", label: "Areas", track: "nav_areas" },
      { href: "/costs", label: "Costs", track: "nav_costs" },
      { href: "/family-life", label: "Family life", track: "nav_family" },
      { href: "/guides", label: "Guides", track: "nav_guides" },
      { href: "/blog", label: "Blog", track: "nav_blog" },
      { href: "/resources", label: "Resources", track: "nav_resources" },
      { href: "/partners", label: "Partners", track: "nav_partners" },
      { href: "/contact", label: "Contact", track: "nav_contact" },
      { href: "/faq", label: "FAQ", track: "nav_faq" },
      { href: "/official-links", label: "Official links", track: "nav_official" },
    ],
    []
  );

  const top = navItems.slice(0, 5);
  const other = navItems.slice(5);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);
  const otherRef = useRef<HTMLDivElement | null>(null);

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false);
    setOtherOpen(false);
  }, [pathname]);

  // Close dropdown on outside click / Escape.
  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!otherRef.current) return;
      if (!otherRef.current.contains(e.target as Node)) setOtherOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOtherOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const linkCls = (href: string) =>
    cn(
      "rounded-lg px-2 py-1 text-sm font-medium text-gray-600 transition-colors duration-200 ease-out hover:bg-gray-50 hover:text-gray-900",
      pathname === href && "text-gray-900"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="container">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link className="flex items-center gap-3 font-semibold tracking-tight text-gray-900" href="/" data-track="nav_home">
            <span
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm"
              aria-hidden
            />
            <span>{site.brand.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop navigation */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
              {top.map((item) => (
                <Link key={item.href} href={item.href} className={linkCls(item.href)} data-track={item.track}>
                  {item.label}
                </Link>
              ))}

              <div className="relative" ref={otherRef}>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-gray-600 transition-colors duration-200 ease-out hover:bg-gray-50 hover:text-gray-900",
                    otherOpen && "text-gray-900"
                  )}
                  aria-haspopup="menu"
                  aria-expanded={otherOpen}
                  onClick={() => setOtherOpen((v) => !v)}
                  data-track="nav_other_toggle"
                >
                  Other
                  <ChevronDownIcon
                    className={cn(
                      "h-4 w-4 transition-transform duration-200 ease-out",
                      otherOpen ? "rotate-180" : "rotate-0"
                    )}
                  />
                </button>

                <div
                  role="menu"
                  aria-label="Other navigation"
                  className={cn(
                    "absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-lg transition duration-200 ease-out",
                    otherOpen
                      ? "pointer-events-auto scale-100 opacity-100"
                      : "pointer-events-none scale-95 opacity-0"
                  )}
                >
                  {other.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900",
                        pathname === item.href && "bg-gray-50 text-gray-900"
                      )}
                      role="menuitem"
                      data-track={item.track}
                      onClick={() => setOtherOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Primary CTA - HIDDEN ON MOBILE */}
            <Link
              href={site.ctas.empathy.href}
              data-track="nav_empathy"
              className={cn(
                "!hidden md:!inline-flex items-center justify-center",
                buttonPrimary
              )}
            >
              Empathy School
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-sm transition hover:bg-gray-50 md:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              data-track="nav_mobile_toggle"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200",
            mobileOpen ? "max-h-[80vh] opacity-100 pb-6" : "max-h-0 opacity-0"
          )}
        >
          <nav className="grid gap-1 pt-2" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900",
                  pathname === item.href && "bg-gray-50 text-gray-900"
                )}
                data-track={item.track}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Primary CTA intentionally hidden on mobile (per design). */}
        </div>
      </div>
    </header>
  );
}
