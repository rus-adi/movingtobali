import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import { getSearchIndex } from "@/lib/searchIndex";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across pillars, areas, guides, blog posts, and resources.",
  alternates: { canonical: "/search" },
};

type Props = { searchParams?: { q?: string } };

function routeFor(kind: string, slug: string) {
  return kind === "pillars" ? `/${slug}` : `/${kind}/${slug}`;
}

export default function SearchPage({ searchParams }: Props) {
  const q = (searchParams?.q || "").trim().toLowerCase();


const kinds = ["pillars", "areas", "guides", "blog", "resources"] as const;

// Precomputed search index (fast even with lots of daily posts)
const index = getSearchIndex();

// Hard cap so this page stays snappy at large scale
const results = q ? index.filter((e) => e.searchText.includes(q)).slice(0, 200) : [];

const grouped = kinds.map((k) => ({
  kind: k,
  items: results.filter((r) => r.kind === k).slice(0, 10),
}));

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/search", name: "Search", description: "Search across the content hub." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Search</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Search the hub</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Try “Ubud”, “eVOA”, “rent deposit”, “school tour”, “budgeting”, or “rainy season”.
          </p>

          <div style={{ marginTop: 18 }}>
            <SearchBoxUrl placeholder="Search everything…" />
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          {!q ? (
            <div className="card">
              Type a query above to search across pillars, guides, areas, blog posts, and resources.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 18 }}>
              {grouped.map((g) => (
                <div key={g.kind} className="card">
                  <strong style={{ textTransform: "capitalize" }}>{g.kind}</strong>
                  {g.items.length ? (
                    <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                      {g.items.map((r) => (
                        <div key={r.slug} style={{ display: "grid", gap: 4 }}>
                          <Link href={routeFor(r.kind, r.slug)} style={{ color: "rgba(205,240,255,0.95)" }} data-track="search_open" data-kind={r.kind} data-slug={r.slug}>
                            {r.title}
                          </Link>
                          <div style={{ color: "var(--muted)", fontSize: 14 }}>{r.description}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ marginTop: 10, color: "var(--muted)" }}>No matches.</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
