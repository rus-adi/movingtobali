import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { decodeParam, encodeParam, getAllCategories, getAllContent } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export function generateStaticParams() {
  const categories = getAllCategories("blog");
  return categories.map((c) => ({ category: encodeParam(c) }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = decodeParam(params.category);
  return {
    title: `Category: ${category}`,
    description: `Blog posts in the “${category}” category.`,
    alternates: { canonical: `/blog/category/${encodeParam(category)}` },
  };
}

export default function BlogCategoryPage({ params, searchParams }: { params: { category: string }; searchParams?: { page?: string } }) {
  const category = decodeParam(params.category);
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("blog").filter((p) => p.category === category);
  if (!all.length) notFound();

  const { total, items } = paginate(all, page, pageSize);

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: `/blog/category/${encodeParam(category)}`, name: `Blog category: ${category}`, description: `Blog posts in “${category}”.` }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />
      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Blog category</div>
          <h1 className="h1" style={{ marginTop: 12 }}>{category}</h1>
          <div className="btnRow">
            <Link className="button secondary" href="/blog">Back to blog</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          <div className="grid2">
            {items.map((p) => <PostCard key={p.slug} item={p} />)}
          </div>
          <Pagination basePath={`/blog/category/${encodeParam(category)}`} page={page} pageSize={pageSize} total={total} />
        </div>
      </section>
    </main>
  );
}
