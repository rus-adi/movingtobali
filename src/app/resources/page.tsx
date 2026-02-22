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
    title: "Resources",
    description: "Templates and checklists for moving to Bali with kids.",
    alternates: { canonical: "/resources" },
  };
}

type Props = { searchParams?: { q?: string; page?: string } };

export default function ResourcesIndexPage({ searchParams }: Props) {
  const q = (searchParams?.q || "").trim().toLowerCase();
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("resources");
  const filtered = q
    ? all.filter((p) => {
        const hay = [p.title, p.description, p.category, p.tags.join(" "), p.resourceType].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      })
    : all;

  const { total, items } = paginate(filtered, page, pageSize);

  const tags = getAllTags("resources").slice(0, 20);
  const categories = getAllCategories("resources").slice(0, 12);

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/resources", name: "Resources", description: "Templates and checklists for families relocating to Bali." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Resources</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Templates & checklists</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Short tools you can use immediately—tour questions, decision matrices, first-week checklists, and planning prompts.
          </p>

          <div style={{ marginTop: 18 }}>
            <SearchBoxUrl placeholder="Search resources… (e.g., checklist, tour, decision)" />
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <Link key={c} className="pill" href={`/resources/category/${encodeParam(c)}`}>{c}</Link>
            ))}
            {tags.map((t) => (
              <Link key={t} className="pill" href={`/resources/tag/${encodeParam(t)}`}>#{t}</Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          {q ? (
            <div className="card" style={{ marginBottom: 16 }}>
              Showing results for <strong>{q}</strong> ({total} item{total === 1 ? "" : "s"})
              <div className="btnRow">
                <Link className="button secondary" href="/resources">Clear search</Link>
              </div>
            </div>
          ) : null}

          <div className="grid2">
            {items.map((p) => (
              <PostCard key={p.slug} item={p} />
            ))}
          </div>

          <Pagination basePath="/resources" page={page} pageSize={pageSize} total={total} query={{ q: q || undefined }} />
        </div>
      </section>
    </main>
  );
}
