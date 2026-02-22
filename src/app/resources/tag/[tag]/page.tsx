import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { decodeParam, encodeParam, getAllContent, getAllTags } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export function generateStaticParams() {
  const tags = getAllTags("resources");
  return tags.map((t) => ({ tag: encodeParam(t) }));
}

export function generateMetadata({ params }: { params: { tag: string } }): Metadata {
  const tag = decodeParam(params.tag);
  return {
    title: `Resource tag: ${tag}`,
    description: `Resources tagged “${tag}”.`,
    alternates: { canonical: `/resources/tag/${encodeParam(tag)}` },
  };
}

export default function ResourcesTagPage({ params, searchParams }: { params: { tag: string }; searchParams?: { page?: string } }) {
  const tag = decodeParam(params.tag);
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("resources").filter((p) => p.tags.includes(tag));
  if (!all.length) notFound();

  const { total, items } = paginate(all, page, pageSize);

  const pathname = `/resources/tag/${encodeParam(tag)}`;
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname, name: `Resources tag: ${tag}`, description: `Resources tagged “${tag}”.` }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />
      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Resources tag</div>
          <h1 className="h1" style={{ marginTop: 12 }}>#{tag}</h1>
          <div className="btnRow">
            <Link className="button secondary" href="/resources">Back to resources</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          <div className="grid2">
            {items.map((p) => <PostCard key={p.slug} item={p} />)}
          </div>
          <Pagination basePath={pathname} page={page} pageSize={pageSize} total={total} />
        </div>
      </section>
    </main>
  );
}
