import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getAllContent } from "@/lib/content";
import { getPartners } from "@/lib/partners";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const env = process.env.NODE_ENV;

  // NOTE:
  // - We deliberately omit internal search + tag/category archive pages to avoid thin/duplicate URLs.
  // - We also omit any content items explicitly marked `noindex: true`.

  const staticPaths = [
    "/",
    "/start-here",
    "/visas",
    "/housing",
    "/gaia-group",
    "/housing-intro-readiness",
    "/housing-brief-builder",
    "/schools",
    "/empathy-school-fit",
    "/empathy-school-tour-prep",
    "/camps",
    "/daily-life",
    "/weekday-reality",
    "/costs",
    "/plan-your-move",
    "/how-this-hub-works",
    "/move-timeline",
    "/decision-checklists",
    "/conversation-paths",
    "/family-path-match",
    "/budget-calculator",
    "/area-match",
    "/compare-areas",
    "/commute-reality",
    "/test-stay-vs-full-move",
    "/housing-style-compare",
    "/areas",
    "/guides",
    "/blog",
    "/resources",
    "/video-recaps",
    "/faq",
    "/what-families-notice",
    "/editorial-standards",
    "/content-health",
    "/official-links",
    "/partners",
    "/contact",
    "/about",
    "/privacy",
    "/terms",
    "/disclosure",
  ];

  const staticSet = new Set(staticPaths);

  const entries: MetadataRoute.Sitemap = [];

  const includePartners = () => {
    if (env !== "production") return true;
    // Production launch rule: if we don't have any verified/owned partners, don't surface /partners.
    return getPartners().length > 0;
  };

  staticPaths.forEach((p) => {
    if (p === "/partners" && !includePartners()) return;
    entries.push({ url: `${siteUrl}${p}`, lastModified: new Date() });
  });

  // Pillars (only add if not already in staticPaths)
  getAllContent("pillars")
    .filter((p) => !p.noindex)
    .forEach((p) => {
      const path = `/${p.slug}`;
      if (staticSet.has(path)) return;
      entries.push({ url: `${siteUrl}${path}`, lastModified: new Date(p.updated || p.date || Date.now()) });
    });

  const addKind = (kind: "blog" | "guides" | "resources" | "areas") => {
    getAllContent(kind)
      .filter((p) => !p.noindex)
      .forEach((p) => {
        entries.push({ url: `${siteUrl}/${kind}/${p.slug}`, lastModified: new Date(p.updated || p.date || Date.now()) });
      });
  };

  addKind("blog");
  addKind("guides");
  addKind("resources");
  addKind("areas");

  return entries;
}
