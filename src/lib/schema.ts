import type { ContentItem, VideoBlock } from "@/lib/content";
import { absoluteUrl, getSite, getSiteUrl } from "@/lib/site";
import { loadTranscript, truncateForSchema } from "@/lib/transcripts";
import { getEffectiveFaqs } from "@/lib/faqs";

export function buildOrganizationSchema() {
  const site = getSite();
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.publisherName || site.brand.name,
    url: site.brand.publisherUrl || siteUrl,
    email: site.brand.contactEmail,
    sameAs: [site.brand.social?.instagram, site.brand.social?.youtube].filter(Boolean),
  };
}

export function buildWebSiteSchema() {
  const site = getSite();
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.seo.defaultTitle,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildWebPageSchema(opts: { pathname: string; name: string; description?: string }) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: opts.name,
    description: opts.description,
    url: `${siteUrl}${opts.pathname}`,
  };
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function buildArticleSchema(item: ContentItem, pathname: string) {
  const site = getSite();
  const siteUrl = getSiteUrl();

  const type = item.kind === "blog" ? "BlogPosting" : "Article";
  const authorName = site.brand.publisherName || site.brand.name;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": type,
    headline: item.title,
    description: item.description,
    url: `${siteUrl}${pathname}`,
    datePublished: item.date,
    dateModified: item.updated || item.date,
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: site.brand.publisherName || site.brand.name,
      url: site.brand.publisherUrl || siteUrl,
    },
    keywords: (item.keywords && item.keywords.length ? item.keywords : item.tags).join(", "),
  };

  if (item.coverImage) schema.image = absoluteUrl(item.coverImage);
  return schema;
}

export function buildFaqPageSchema(
  faqs: { q: string; a: string }[],
  pathname: string,
  opts?: { name?: string; description?: string }
) {
  const siteUrl = getSiteUrl();

  const cleaned = (faqs || [])
    .map((f) => ({ q: String((f as any)?.q || "").trim(), a: String((f as any)?.a || "").trim() }))
    .filter((f) => f.q && f.a)
    .slice(0, 10);

  if (!cleaned.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: opts?.name,
    description: opts?.description,
    url: `${siteUrl}${pathname}`,
    inLanguage: "en",
    mainEntity: cleaned.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export function buildVideoObjectSchema(
  video: VideoBlock,
  pageTitle: string,
  pageDescription: string,
  pathname: string,
  fallbackUploadDate?: string
) {
  const site = getSite();
  const siteUrl = getSiteUrl();
  const transcriptText = loadTranscript(video);

  const youtubeId = video.youtubeId;
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  const thumb = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title || pageTitle,
    description: video.summary || pageDescription,
    embedUrl,
    contentUrl: watchUrl,
    thumbnailUrl: [thumb],
    uploadDate: video.uploadDate || fallbackUploadDate,
    publisher: {
      "@type": "Organization",
      name: site.brand.publisherName || site.brand.name,
      url: site.brand.publisherUrl || siteUrl,
    },
    inLanguage: "en",
    isFamilyFriendly: true,
    url: `${siteUrl}${pathname}`,
  };

  // Add transcript if available (truncate to avoid huge JSON-LD)
  if (transcriptText) {
    schema.transcript = truncateForSchema(transcriptText);
  }

  return schema;
}

export function buildSchemasForContentPage(item: ContentItem, pathname: string) {
  const siteUrl = getSiteUrl();

  const base: any[] = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname, name: item.title, description: item.description }),
    buildBreadcrumbSchema([
      { name: "Home", url: `${siteUrl}/` },
      {
        name:
          item.kind === "pillars"
            ? "Start"
            : item.kind.charAt(0).toUpperCase() + item.kind.slice(1),
        url: `${siteUrl}/${item.kind === "pillars" ? "" : item.kind}`,
      },
      { name: item.title, url: `${siteUrl}${pathname}` },
    ]),
  ];

  // FAQ schema (only if we actually have Q&A content to display)
  const faqs = getEffectiveFaqs(item);
  const faqSchema = buildFaqPageSchema(faqs, pathname, {
    name: `${item.title} FAQ`,
    description: `Frequently asked questions about ${item.title}.`,
  });
  if (faqSchema) base.push(faqSchema);

  if (item.kind !== "pillars") {
    base.push(buildArticleSchema(item, pathname));
  }

  if (item.video?.youtubeId) {
    base.push(buildVideoObjectSchema(item.video, item.title, item.description, pathname, item.updated || item.date));
  }

  return base;
}
