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

  // Header must contain exactly 6 items in this order:
  // Start Here, Visas, Costs, Housing, Schools, Contact (primary CTA)
  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/start-here", label: "Start Here", track: "nav_start" },
      { href: "/visas", label: "Visas", track: "nav_visas" },
      { href: "/costs", label: "Costs", track: "nav_costs" },
      { href: "/housing", label: "Housing", track: "nav_housing" },
      { href: "/schools", label: "Schools", track: "nav_schools" },
    ],
    []
  );

  const contactItem: NavItem = useMemo(
    () => ({ href: "/contact", label: "Contact", track: "nav_contact" }),
    []
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on Escape.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
          <Link
            className="flex items-center gap-3 font-semibold tracking-tight text-gray-900"
            href="/"
            data-track="nav_home"
          >
            <span
              className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm"
              aria-hidden
            />
            <span>{site.brand.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Desktop navigation */}
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkCls(item.href)}
                  data-track={item.track}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Primary CTA */}
            <Link
              href={contactItem.href}
              data-track={contactItem.track}
              aria-current={pathname === contactItem.href ? "page" : undefined}
              className={cn("!hidden md:!inline-flex items-center justify-center", buttonPrimary)}
            >
              {contactItem.label}
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
                aria-current={pathname === item.href ? "page" : undefined}
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
