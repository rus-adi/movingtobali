import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { getAllCategories, getAllContent, getAllTags, encodeParam } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { getSite } from "@/lib/site";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, btnRow, buttonSecondary, cardCls, grid2, pill } from "@/components/ui/styles";

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    title: `Blog`,
    description: `Daily posts about moving to Bali with kids: practical tips, checklists, and what to expect.`,
    alternates: { canonical: "/blog" },
  };
}

type Props = { searchParams?: { q?: string; page?: string } };

export default function BlogIndexPage({ searchParams }: Props) {
  const q = (searchParams?.q || "").trim().toLowerCase();
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("blog");
  const filtered = q
    ? all.filter((p) => {
        const hay = [p.title, p.description, p.category, p.tags.join(" ")].filter(Boolean).join(" ").toLowerCase();
        return hay.includes(q);
      })
    : all;

  const { total, items } = paginate(filtered, page, pageSize);

  const tags = getAllTags("blog").slice(0, 20);
  const categories = getAllCategories("blog").slice(0, 12);

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/blog", name: "Blog", description: "Daily posts about moving to Bali with kids." }),
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Moving to Bali with Kids Blog",
      url: "/blog",
      description: "Daily posts about moving to Bali with kids.",
    },
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className={badge}>Blog</div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Daily posts</h1>
              <p className="text-base text-gray-600 sm:text-lg">
                Short, practical posts that answer one question at a time. For deeper guides, see the Guides section.
              </p>
            </div>

            <div className={cardCls}>
              <SearchBoxUrl placeholder="Search posts… (e.g., visa, Ubud, budgeting, routines)" />

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link key={c} className={pill} href={`/blog/category/${encodeParam(c)}`}>{c}</Link>
                ))}
                {tags.map((t) => (
                  <Link key={t} className={pill} href={`/blog/tag/${encodeParam(t)}`}>#{t}</Link>
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
              Showing results for <strong>{q}</strong> ({total} post{total === 1 ? "" : "s"})
              <div className={btnRow}>
                <Link className={buttonSecondary} href="/blog">Clear search</Link>
              </div>
            </div>
          ) : null}

          <div className={grid2}>
            {items.map((p) => (
              <PostCard key={p.slug} item={p} />
            ))}
          </div>

          <Pagination basePath="/blog" page={page} pageSize={pageSize} total={total} query={{ q: q || undefined }} />
        </div>
      </section>
    </main>
  );
}
