import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import AreasCompareTable from "@/components/AreasCompareTable";
import { getAllCategories, getAllContent, getAllTags, encodeParam } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export function generateMetadata(): Metadata {
  return {
    title: "Areas",
    description: "Family-focused guides to Bali neighborhoods and regions: what daily life is like, tradeoffs, and who it fits.",
    alternates: { canonical: "/areas" },
  };
}

type Props = { searchParams?: { q?: string; page?: string } };

export default function AreasIndexPage({ searchParams }: Props) {
  const q = (searchParams?.q || "").trim().toLowerCase();
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("areas");
  const filtered = q
    ? all.filter((p) => {
        const areaMeta = Object.values((p as any).area || {}).join(" ");
        const hay = [p.title, p.description, p.category, p.tags.join(" "), areaMeta].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      })
    : all;

  const { total, items } = paginate(filtered, page, pageSize);

  const tags = getAllTags("areas").filter((t) => !["areas","neighborhoods"].includes(String(t))).slice(0, 20);
  const categories = getAllCategories("areas").slice(0, 12);

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/areas", name: "Bali areas", description: "Family-focused guides to Bali neighborhoods and regions." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Areas</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Bali areas for families</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Short, honest guides to help you choose where to live. Use these to shortlist 2–3 areas before your first visit.
          </p>

          <div style={{ marginTop: 18 }}>
            <SearchBoxUrl placeholder="Search areas… (e.g., Ubud, Canggu, calm, walkable)" />
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <Link key={c} className="pill" href={`/areas/category/${encodeParam(c)}`}>{c}</Link>
            ))}
            {tags.map((t) => (
              <Link key={t} className="pill" href={`/areas/tag/${encodeParam(t)}`}>#{t}</Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          {q ? (
            <div className="card" style={{ marginBottom: 16 }}>
              Showing results for <strong>{q}</strong> ({total} area{total === 1 ? "" : "s"})
              <div className="btnRow">
                <Link className="button secondary" href="/areas">Clear search</Link>
              </div>
            </div>
          ) : null}


<div className="card" style={{ marginBottom: 16 }}>
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
    <div style={{ minWidth: 240 }}>
      <strong>Quick compare (rough signals)</strong>
      <div style={{ marginTop: 8, color: "var(--muted)" }}>
        These are subjective, “good enough to shortlist” signals — they can change street-by-street.
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <Link className="button secondary" href="/guides/bali-areas-for-toddlers">Toddlers</Link>
      <Link className="button secondary" href="/guides/bali-areas-for-teens">Teens</Link>
      <Link className="button secondary" href="/guides/quiet-nature-areas-in-bali">Quiet + nature</Link>
    </div>
  </div>
  <div style={{ marginTop: 14 }}>
    <AreasCompareTable areas={items} />
  </div>
</div>

          <div className="grid2">
            {items.map((p) => (
              <PostCard key={p.slug} item={p} />
            ))}
          </div>

          <Pagination basePath="/areas" page={page} pageSize={pageSize} total={total} query={{ q: q || undefined }} />
        </div>
      </section>
    </main>
  );
}
