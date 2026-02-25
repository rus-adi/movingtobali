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
import { badge, btnRow, buttonSecondary, cardCls, grid2, pill } from "@/components/ui/styles";

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
        const hay = [p.title, p.description, p.category, p.tags.join(" "), areaMeta]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
    : all;

  const { total, items } = paginate(filtered, page, pageSize);

  const tags = getAllTags("areas")
    .filter((t) => !["areas", "neighborhoods"].includes(String(t)))
    .slice(0, 20);
  const categories = getAllCategories("areas").slice(0, 12);

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/areas", name: "Bali areas", description: "Family-focused guides to Bali neighborhoods and regions." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className={badge}>Areas</div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Bali areas for families</h1>
              <p className="text-base text-gray-600 sm:text-lg">
                Short, honest guides to help you choose where to live. Use these to shortlist 2–3 areas before your first visit.
              </p>
            </div>

            <div className={cardCls}>
              <SearchBoxUrl placeholder="Search areas… (e.g., Ubud, Canggu, calm, walkable)" />

              <div className="mt-6 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link key={c} className={pill} href={`/areas/category/${encodeParam(c)}`}>
                    {c}
                  </Link>
                ))}
                {tags.map((t) => (
                  <Link key={t} className={pill} href={`/areas/tag/${encodeParam(t)}`}>
                    #{t}
                  </Link>
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
              Showing results for <strong>{q}</strong> ({total} area{total === 1 ? "" : "s"})
              <div className={btnRow}>
                <Link className={buttonSecondary} href="/areas">
                  Clear search
                </Link>
              </div>
            </div>
          ) : null}

          <div className={`${cardCls} mb-8`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-[240px]">
                <strong className="text-sm font-semibold text-gray-900">Quick compare (rough signals)</strong>
                <div className="mt-3 text-sm leading-6 text-gray-600">
                  These are subjective, “good enough to shortlist” signals — they can change street-by-street.
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link className={buttonSecondary} href="/guides/bali-areas-for-toddlers">Toddlers</Link>
                <Link className={buttonSecondary} href="/guides/bali-areas-for-teens">Teens</Link>
                <Link className={buttonSecondary} href="/guides/quiet-nature-areas-in-bali">Quiet + nature</Link>
              </div>
            </div>
            <div className="mt-6">
              <AreasCompareTable areas={items} />
            </div>
          </div>

          <div className={grid2}>
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
