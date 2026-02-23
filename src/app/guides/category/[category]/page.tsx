import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Pagination from "@/components/Pagination";
import PostCard from "@/components/PostCard";
import { decodeParam, encodeParam, getAllCategories, getAllContent } from "@/lib/content";
import { asInt, paginate } from "@/lib/pagination";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, btnRow, buttonSecondary, grid2 } from "@/components/ui/styles";

export function generateStaticParams() {
  const categories = getAllCategories("guides");
  return categories.map((c) => ({ category: encodeParam(c) }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const category = decodeParam(params.category);
  return {
    title: `Guide category: ${category}`,
    description: `Guides in the “${category}” category.`,
    alternates: { canonical: `/guides/category/${encodeParam(category)}` },
  };
}

export default function GuidesCategoryPage({ params, searchParams }: { params: { category: string }; searchParams?: { page?: string } }) {
  const category = decodeParam(params.category);
  const page = asInt(searchParams?.page, 1);
  const pageSize = 12;

  const all = getAllContent("guides").filter((p) => p.category === category);
  if (!all.length) notFound();

  const { total, items } = paginate(all, page, pageSize);

  const pathname = `/guides/category/${encodeParam(category)}`;
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname, name: `Guides category: ${category}`, description: `Guides in “${category}”.` }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Guides category</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{category}</h1>
          <div className={btnRow}>
            <Link className={buttonSecondary} href="/guides">Back to guides</Link>
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
