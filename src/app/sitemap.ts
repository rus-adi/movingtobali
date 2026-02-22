import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getAllCategories, getAllContent, getAllTags, encodeParam } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl().replace(/\/$/, "");

  const staticPaths = [
    "/",
    "/start-here",
    "/visas",
    "/housing",
    "/schools",
    "/camps",
    "/family-life",
    "/costs",
    "/areas",
    "/guides",
    "/blog",
    "/resources",
    "/faq",
    "/official-links",
    "/partners",
    "/search",
    "/contact",
    "/about",
    "/privacy",
    "/terms",
    "/disclosure",
  ];

  const staticSet = new Set(staticPaths);

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: new Date(),
  }));


// Pillars (only add if not already in staticPaths)
getAllContent("pillars").forEach((p) => {
  const path = `/${p.slug}`;
  if (staticSet.has(path)) return;
  entries.push({ url: `${siteUrl}${path}`, lastModified: new Date(p.updated || p.date || Date.now()) });
});


  const addKind = (kind: "blog" | "guides" | "resources" | "areas") => {
    getAllContent(kind).forEach((p) => {
      entries.push({ url: `${siteUrl}/${kind}/${p.slug}`, lastModified: new Date(p.updated || p.date || Date.now()) });
    });

    getAllTags(kind).forEach((t) => {
      entries.push({ url: `${siteUrl}/${kind}/tag/${encodeParam(t)}`, lastModified: new Date() });
    });

    getAllCategories(kind).forEach((c) => {
      entries.push({ url: `${siteUrl}/${kind}/category/${encodeParam(c)}`, lastModified: new Date() });
    });
  };

  addKind("blog");
  addKind("guides");
  addKind("resources");
  addKind("areas");

  return entries;
}
