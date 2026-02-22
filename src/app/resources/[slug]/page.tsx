import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ContentLayout from "@/components/ContentLayout";
import { getAllContent, getContentBySlug, getRecommendedFor } from "@/lib/content";
import { extractToc, markdownToHtml } from "@/lib/markdown";
import { buildSchemasForContentPage } from "@/lib/schema";

export function generateStaticParams() {
  const items = getAllContent("resources");
  return items.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const item = getContentBySlug("resources", params.slug);
  if (!item) return { title: "Not found" };

  return {
    title: item.title,
    description: item.description,
    keywords: item.keywords || item.tags,
    alternates: { canonical: `/resources/${item.slug}` },
    robots: item.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function ResourcePage({ params }: { params: { slug: string } }) {
  const item = getContentBySlug("resources", params.slug);
  if (!item) notFound();

  const [html, toc] = await Promise.all([markdownToHtml(item.body), extractToc(item.body)]);
  const { primaryPillar, items: related } = getRecommendedFor(item, 4);

  const pathname = `/resources/${item.slug}`;
  const schemas = buildSchemasForContentPage(item, pathname);

  return (
    <>
      <JsonLd data={schemas} />
      <ContentLayout item={item} toc={toc} html={html} related={related} primaryPillar={primaryPillar} />
    </>
  );
}
