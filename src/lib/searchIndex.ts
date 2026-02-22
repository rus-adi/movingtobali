import { getAllContent, type ContentKind } from "@/lib/content";

export type SearchEntry = {
  kind: ContentKind;
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  path: string;
  // Lowercased search text (fast includes check)
  searchText: string;
};

function routeFor(kind: ContentKind, slug: string) {
  return kind === "pillars" ? `/${slug}` : `/${kind}/${slug}`;
}

function compactText(s: string, max = 700) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max) : t;
}

// Cached in production for speed (daily blog scale).
let CACHE: SearchEntry[] | null = null;

export function getSearchIndex(): SearchEntry[] {
  const env = process.env.NODE_ENV;
  if (env === "production" && CACHE) return CACHE;

  const kinds: ContentKind[] = ["pillars", "areas", "guides", "blog", "resources"];

  const entries: SearchEntry[] = kinds.flatMap((kind) =>
    getAllContent(kind).map((p) => {
      const excerpt = compactText(p.body || "");
      const areaMeta = kind === "areas" ? Object.values((p as any).area || {}).join(" ") : "";
      const combined = [p.title, p.description, p.category, (p.tags || []).join(" "), areaMeta, excerpt].filter(Boolean).join(" ").toLowerCase();

      return {
        kind,
        slug: p.slug,
        title: p.title,
        description: p.description,
        category: p.category,
        tags: p.tags || [],
        path: routeFor(kind, p.slug),
        searchText: combined,
      };
    })
  );

  if (env === "production") CACHE = entries;
  return entries;
}
