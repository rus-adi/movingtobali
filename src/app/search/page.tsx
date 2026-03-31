import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import { getSearchIndex } from "@/lib/searchIndex";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, badgeAccent, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across pillars, areas, guides, blog posts, and resources.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

type Props = { searchParams?: { q?: string } };

function routeFor(kind: string, slug: string) {
  return kind === "pillars" ? `/${slug}` : `/${kind}/${slug}`;
}

const searchSuggestions = [
  { label: "Ubud", value: "Ubud" },
  { label: "rent deposit", value: "rent deposit" },
  { label: "school tour", value: "school tour" },
  { label: "budget", value: "budget" },
  { label: "rainy season", value: "rainy season" },
  { label: "Gaia Group", value: "Gaia Group" },
  { label: "Empathy School", value: "Empathy School" },
  { label: "Search areas", href: "/areas" },
];

const browseCards = [
  {
    href: "/plan-your-move",
    title: "Plan Your Move",
    body: "Use the planning hub when your query is broad and what you really need is the order of decisions.",
  },
  {
    href: "/areas",
    title: "Bali areas",
    body: "Browse the area hub if you are comparing Ubud-side calm, Canggu convenience, Sanur ease, or commute reality.",
  },
  {
    href: "/schools",
    title: "School planning guide",
    body: "Go straight to the Empathy School lane when school fit may shape your move, your commute, or your area shortlist.",
  },
  {
    href: "/housing",
    title: "Housing",
    body: "Use the housing lane for Gaia Group readiness, housing briefs, lease questions, and family-home tradeoffs.",
  },
  {
    href: "/daily-life",
    title: "Daily Life",
    body: "Open the daily-life lane if the real question is whether the week still feels calm once ordinary life starts.",
  },
  {
    href: "/guides",
    title: "Guides",
    body: "Browse evergreen decision guides when you want a deeper, checklist-heavy explanation instead of a single keyword result.",
  },
];

export default function SearchPage({ searchParams }: Props) {
  const q = decodeURIComponent(searchParams?.q || "")
    .trim()
    .toLowerCase()
    .replace(/^#/, "");

  const kinds = ["pillars", "areas", "guides", "blog", "resources"] as const;
  const index = getSearchIndex();
  const results = q ? index.filter((e) => e.searchText.includes(q)).slice(0, 200) : [];

  const grouped = kinds.map((k) => ({
    kind: k,
    items: results.filter((r) => r.kind === k).slice(0, 10),
  }));
  const nonEmpty = grouped.filter((g) => g.items.length > 0);

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/search", name: "Search", description: "Search across the content hub." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Search</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Search the hub</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-700 sm:text-lg">
            Search across pillars, areas, guides, blog posts, and resources. If your question is broad, use the browse cards below instead of forcing the perfect keyword.
          </p>

          <div className="mt-8">
            <SearchBoxUrl
              placeholder="Search everything…"
              submitLabel="Search"
              suggestions={searchSuggestions}
              helperText="Popular searches: Ubud, rent deposit, school tour, budget, rainy season, Gaia Group, Empathy School."
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10">
          {!q ? (
            <>
              <div className={cardCls}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badgeAccent}>Browse instead</span>
                  <span className={badge}>Best when your question is still fuzzy</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-700">
                  Search works well for specific terms. If the move still feels broad, go straight to the right hub and let the site narrow the question for you.
                </p>
              </div>
              <div className={grid3}>
                {browseCards.map((card) => (
                  <Link key={card.href} href={card.href} className={cardCls} data-track="search_browse_card">
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-gray-700">{card.body}</p>
                    <div className="mt-6 text-sm font-semibold text-gray-900">Open hub →</div>
                  </Link>
                ))}
              </div>
            </>
          ) : nonEmpty.length ? (
            <>
              <div className={cardCls}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badgeAccent}>Results</span>
                  <span className={badge}>Query: {q}</span>
                  <span className={badge}>{results.length} matches</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-700">
                  Matches are grouped by content type so you can decide whether you want a hub, a guide, a daily-life post, or a resource.
                </p>
              </div>

              <div className="grid gap-6">
                {nonEmpty.map((g) => (
                  <div key={g.kind} className={cardCls}>
                    <strong className="text-sm font-semibold text-gray-900 capitalize">{g.kind}</strong>
                    <div className="mt-6 grid gap-4">
                      {g.items.map((r) => (
                        <div key={`${r.kind}:${r.slug}`} className="grid gap-1">
                          <Link
                            href={routeFor(r.kind, r.slug)}
                            className="font-semibold text-emerald-800 underline underline-offset-4 transition-colors hover:text-emerald-900"
                            data-track="search_open"
                            data-kind={r.kind}
                            data-slug={r.slug}
                          >
                            {r.title}
                          </Link>
                          <div className="text-sm text-gray-700">{r.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={cardCls}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badgeAccent}>No exact matches</span>
                  <span className={badge}>Query: {q}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-700">
                  Try a broader phrase, drop brand-specific wording, or jump into one of the core hubs below. Many families get farther by starting with a tool or pillar instead of a narrow keyword.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link className={buttonSecondary} href="/plan-your-move">Plan your move</Link>
                  <Link className={buttonSecondary} href="/areas">Browse areas</Link>
                  <Link className={buttonSecondary} href="/schools">School planning guide</Link>
                  <Link className={buttonSecondary} href="/contact">Ask a question</Link>
                </div>
              </div>
              <div className={grid2}>
                {browseCards.slice(0, 4).map((card) => (
                  <Link key={card.href} href={card.href} className={cardCls} data-track="search_no_results_browse">
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-gray-700">{card.body}</p>
                    <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
