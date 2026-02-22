import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ContentLayout from "@/components/ContentLayout";
import { getAllContent, getContentBySlug, getRecommendedFor } from "@/lib/content";
import { extractToc, markdownToHtml } from "@/lib/markdown";
import { buildSchemasForContentPage } from "@/lib/schema";

export function generateStaticParams() {
  const posts = getAllContent("blog");
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getContentBySlug("blog", params.slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords || post.tags,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: post.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getContentBySlug("blog", params.slug);
  if (!post) notFound();

  const [html, toc] = await Promise.all([markdownToHtml(post.body), extractToc(post.body)]);
  const { primaryPillar, items: related } = getRecommendedFor(post, 4);

  const pathname = `/blog/${post.slug}`;
  const schemas = buildSchemasForContentPage(post, pathname);

  return (
    <>
      <JsonLd data={schemas} />
      <ContentLayout item={post} toc={toc} html={html} related={related} primaryPillar={primaryPillar} />
    </>
  );
}
