import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import { getSearchIndex } from "@/lib/searchIndex";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, cardCls } from "@/components/ui/styles";

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

export default function SearchPage({ searchParams }: Props) {
  // Normalize query so hashtag clicks work even if the URL contains "#tag" or "%23tag".
  const q = decodeURIComponent(searchParams?.q || "")
    .trim()
    .toLowerCase()
    .replace(/^#/, "");

  const kinds = ["pillars", "areas", "guides", "blog", "resources"] as const;

  // Precomputed search index (fast even with lots of daily posts)
  const index = getSearchIndex();

  // Hard cap so this page stays snappy at large scale
  const results = q ? index.filter((e) => e.searchText.includes(q)).slice(0, 200) : [];

  const grouped = kinds.map((k) => ({
    kind: k,
    items: results.filter((r) => r.kind === k).slice(0, 10),
  }));

  // Only render sections that actually have results.
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
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Try “Ubud”, “eVOA”, “rent deposit”, “school tour”, “budgeting”, or “rainy season”.
          </p>

          <div className="mt-8">
            <SearchBoxUrl placeholder="Search everything…" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {!q ? (
            <div className={cardCls}>
              Type a query above to search across pillars, guides, areas, blog posts, and resources.
            </div>
          ) : (
            nonEmpty.length ? (
              <div className="grid gap-6">
                {nonEmpty.map((g) => (
                  <div key={g.kind} className={cardCls}>
                    <strong className="text-sm font-semibold text-gray-900 capitalize">{g.kind}</strong>
                    <div className="mt-6 grid gap-4">
                      {g.items.map((r) => (
                        <div key={`${r.kind}:${r.slug}`} className="grid gap-1">
                          <Link
                            href={routeFor(r.kind, r.slug)}
                            className="font-semibold text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-700"
                            data-track="search_open"
                            data-kind={r.kind}
                            data-slug={r.slug}
                          >
                            {r.title}
                          </Link>
                          <div className="text-sm text-gray-600">{r.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={cardCls}>Your search did not return any results.</div>
            )
          )}
        </div>
      </section>
    </main>
  );
}
