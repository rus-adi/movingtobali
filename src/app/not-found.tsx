import Link from "next/link";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import { badgeWarn, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2 } from "@/components/ui/styles";

const quickLinks = [
  {
    href: "/start-here",
    title: "Start here",
    body: "Use the main orientation page if you want the order of decisions before you browse anything else.",
  },
  {
    href: "/plan-your-move",
    title: "Plan your move",
    body: "Open the planning hub when you want the shortest path back into the site.",
  },
  {
    href: "/areas",
    title: "Bali areas",
    body: "Browse area guides if the missing page was probably part of your location shortlist.",
  },
  {
    href: "/schools",
    title: "Empathy School",
    body: "Jump into the Empathy School lane if school fit is the real thing you were looking for.",
  },
];

export default function NotFound() {
  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="container grid gap-8">
          <div className={cardCls}>
            <div className={badgeWarn}>404</div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
            <p className="mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
              The page may have moved, the link may be old, or the route may never have existed. Search the hub or jump back into one of the main decision paths below.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchBoxUrl
                basePath="/search"
                placeholder="Search the hub…"
                suggestions={[
                  { label: "Ubud", value: "Ubud" },
                  { label: "school tour", value: "school tour" },
                  { label: "Gaia Group", value: "Gaia Group" },
                  { label: "budget", value: "budget" },
                ]}
              />
            </div>
            <div className={btnRow}>
              <Link className={buttonPrimary} href="/start-here">Start here</Link>
              <Link className={buttonSecondary} href="/plan-your-move">Plan your move</Link>
              <Link className={buttonSecondary} href="/search">Search</Link>
              <Link className={buttonSecondary} href="/contact">Ask a question</Link>
            </div>
          </div>

          <div className={grid2}>
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} className={cardCls}>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
                <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
