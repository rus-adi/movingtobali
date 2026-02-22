import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getAllCategories, getAllContent, getAllTags, encodeParam } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export function generateMetadata(): Metadata {
  return {
    title: "Guides",
    description: "Evergreen, checklist-heavy guides supporting the pillars: visas, housing, areas, learning, and family life.",
    alternates: { canonical: "/guides" },
  };
}

type Props = { searchParams?: { q?: string; page?: string } };

export default function GuidesIndexPage({ searchParams }: Props) {
  const q = (searchParams?.q || "").trim().toLowerCase();
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("guides");
  const filtered = q
    ? all.filter((p) => {
        const hay = [p.title, p.description, p.category, p.tags.join(" ")].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      })
    : all;

  const { total, items } = paginate(filtered, page, pageSize);

  const tags = getAllTags("guides").slice(0, 20);
  const categories = getAllCategories("guides").slice(0, 12);

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/guides", name: "Guides", description: "Evergreen guides for families moving to Bali." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Guides</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Evergreen guides</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Longer than blog posts, more structured, with copy/paste checklists you can actually use.
          </p>

          <div style={{ marginTop: 18 }}>
            <SearchBoxUrl placeholder="Search guides… (e.g., agent, rent, checklist, safety)" />
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="pill" href="/start-here">Start here</a>
            <a className="pill" href="/visas">Visas</a>
            <a className="pill" href="/housing">Housing</a>
            <a className="pill" href="/areas">Areas</a>
            <a className="pill" href="/costs">Costs</a>
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <Link key={c} className="pill" href={`/guides/category/${encodeParam(c)}`}>{c}</Link>
            ))}
            {tags.map((t) => (
              <Link key={t} className="pill" href={`/guides/tag/${encodeParam(t)}`}>#{t}</Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          {q ? (
            <div className="card" style={{ marginBottom: 16 }}>
              Showing results for <strong>{q}</strong> ({total} guide{total === 1 ? "" : "s"})
              <div className="btnRow">
                <Link className="button secondary" href="/guides">Clear search</Link>
              </div>
            </div>
          ) : null}

          <div className="grid2">
            {items.map((p) => (
              <PostCard key={p.slug} item={p} />
            ))}
          </div>

          <Pagination basePath="/guides" page={page} pageSize={pageSize} total={total} query={{ q: q || undefined }} />
        </div>
      </section>
    </main>
  );
}
