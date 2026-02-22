import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ContentLayout from "@/components/ContentLayout";
import { getAllContent, getContentBySlug, getRecommendedFor } from "@/lib/content";
import { extractToc, markdownToHtml } from "@/lib/markdown";
import { buildSchemasForContentPage } from "@/lib/schema";

export function generateStaticParams() {
  const items = getAllContent("areas");
  return items.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getContentBySlug("areas", params.slug);
  if (!item) return { title: "Not found" };

  return {
    title: item.title,
    description: item.description,
    keywords: item.keywords || item.tags,
    alternates: { canonical: `/areas/${item.slug}` },
    robots: item.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function AreaPage({ params }: { params: { slug: string } }) {
  const item = getContentBySlug("areas", params.slug);
  if (!item) notFound();

  const [html, toc] = await Promise.all([markdownToHtml(item.body), extractToc(item.body)]);
  const { primaryPillar, items: related } = getRecommendedFor(item, 4);

  const pathname = `/areas/${item.slug}`;
  const schemas = buildSchemasForContentPage(item, pathname);

  return (
    <>
      <JsonLd data={schemas} />
      <ContentLayout item={item} toc={toc} html={html} related={related} primaryPillar={primaryPillar} />
    </>
  );
}
