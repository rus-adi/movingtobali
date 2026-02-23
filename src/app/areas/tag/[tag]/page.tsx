import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { decodeParam, encodeParam, getAllContent, getAllTags } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, btnRow, buttonSecondary, grid2 } from "@/components/ui/styles";

export function generateStaticParams() {
  const tags = getAllTags("areas").filter((t) => !["areas","neighborhoods"].includes(String(t)));
  return tags.map((t) => ({ tag: encodeParam(t) }));
}

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  const tag = decodeParam(params.tag);
  return {
    title: `Area tag: ${tag}`,
    description: `Area guides tagged “${tag}”.`,
    alternates: { canonical: `/areas/tag/${encodeParam(tag)}` },
  };
}

export default function AreasTagPage({ params, searchParams }: { params: { tag: string }; searchParams?: { page?: string } }) {
  const tag = decodeParam(params.tag);
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("areas").filter((p) => p.tags.includes(tag));
  if (!all.length) notFound();

  const { total, items } = paginate(all, page, pageSize);

  const pathname = `/areas/tag/${encodeParam(tag)}`;
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname, name: `Areas tag: ${tag}`, description: `Area guides tagged “${tag}”.` }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Areas tag</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">#{tag}</h1>
          <div className={btnRow}>
            <Link className={buttonSecondary} href="/areas">Back to areas</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className={grid2}>
            {items.map((p) => <PostCard key={p.slug} item={p} />)}
          </div>
          <Pagination basePath={pathname} page={page} pageSize={pageSize} total={total} />
        </div>
      </section>
    </main>
  );
}
