import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getAllCategories, getAllContent, getAllTags, encodeParam } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, btnRow, buttonSecondary, cardCls, pill, grid2 } from "@/components/ui/styles";

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

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className={badge}>Guides</div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Evergreen guides</h1>
              <p className="max-w-3xl text-base text-gray-600 sm:text-lg">
                Longer than blog posts, more structured, with copy/paste checklists you can actually use.
              </p>
            </div>

            <div className={cardCls}>
              <SearchBoxUrl placeholder="Search guides… (e.g., agent, rent, checklist, safety)" />

              <div className="mt-6 flex flex-wrap gap-2">
                <a className={pill} href="/start-here">Start here</a>
                <a className={pill} href="/visas">Visas</a>
                <a className={pill} href="/housing">Housing</a>
                <a className={pill} href="/areas">Areas</a>
                <a className={pill} href="/costs">Costs</a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link key={c} className={pill} href={`/guides/category/${encodeParam(c)}`}>{c}</Link>
                ))}
                {tags.map((t) => (
                  <Link key={t} className={pill} href={`/guides/tag/${encodeParam(t)}`}>#{t}</Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {q ? (
            <div className={`${cardCls} mb-8`}>
              Showing results for <strong>{q}</strong> ({total} guide{total === 1 ? "" : "s"})
              <div className={btnRow}>
                <Link className={buttonSecondary} href="/guides">Clear search</Link>
              </div>
            </div>
          ) : null}

          <div className={grid2}>
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
