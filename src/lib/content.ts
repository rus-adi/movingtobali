import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { estimateReadingTimeMinutes } from "@/lib/markdown";

export type VideoBlock = {
  youtubeId: string;
  title?: string;
  summary: string;
  transcript?: string;
  transcriptFile?: string;
  uploadDate?: string;
  permission: "owned" | "licensed" | "permission";
  childrenVisible?: boolean;
  consentConfirmed?: boolean;
  ctaText?: string;
  ctaHref?: string;
};

export type SocialBlock = {
  instagramUrl?: string;
  youtubeUrl?: string;
};


export type AreaMeta = {
  /** Rough pace of daily life (subjective). Examples: Slow, Moderate, Fast */
  pace?: string;
  /** How heavy traffic tends to feel in the area (subjective). */
  traffic?: string;
  /** How walkable it is for day-to-day (subjective). */
  walkability?: string;
  /** Overall family fit signal (subjective). */
  familyFit?: string;
  /** Beach access / beach vibe signal (subjective). */
  beachAccess?: string;
  /** Nature / rice field / forest access signal (subjective). */
  natureAccess?: string;
  /** Typical noise level signal (subjective). */
  noise?: string;
  /** Rough cost tier vs other areas (subjective). */
  costTier?: string;
  /** A short note shown in the comparison table. Keep it brief. */
  note?: string;
};


export type ContentKind = "pillars" | "guides" | "areas" | "blog" | "resources";

export type ContentItem = {
  kind: ContentKind;
  slug: string;
  title: string;
  description: string;
  date?: string;
  updated?: string;
  tags: string[];
  category?: string;
  keywords?: string[];
  draft?: boolean;
  noindex?: boolean;
  coverImage?: string;
  resourceType?: string;

  // Area-specific metadata (only used for kind === "areas")
  area?: AreaMeta;

  video?: VideoBlock;
  social?: SocialBlock;
  faqs?: { q: string; a: string }[];

  // computed
  readingTimeMinutes: number;
  body: string;
};

const DIRS: Record<ContentKind, string> = {
  pillars: "content/pillars",
  guides: "content/guides",
  areas: "content/areas",
  blog: "content/blog",
  resources: "content/resources",
};

function getRoot(): string {
  return process.cwd();
}

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function parseFile(kind: ContentKind, filePath: string): ContentItem {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const slug = path.basename(filePath).replace(/\.md$/, "");
  const title = String(data.title || slug);
  const description = String(data.description || "");
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const category = data.category ? String(data.category) : undefined;

  const item: ContentItem = {
    kind,
    slug,
    title,
    description,
    date: data.date ? String(data.date) : undefined,
    updated: data.updated ? String(data.updated) : undefined,
    tags,
    category,
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : undefined,
    draft: Boolean(data.draft),
    noindex: Boolean(data.noindex),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    resourceType: data.resourceType ? String(data.resourceType) : undefined,
    area: data.area ? (data.area as any) : undefined,
    video: data.video ? (data.video as any) : undefined,
    social: data.social ? (data.social as any) : undefined,
    faqs: Array.isArray(data.faqs)
      ? data.faqs
          .map((f: any) => ({ q: String(f.q || f.question || ""), a: String(f.a || f.answer || "") }))
          .filter((f: any) => f.q && f.a)
      : undefined,
    readingTimeMinutes: estimateReadingTimeMinutes(content),
    body: content,
  };

  return item;
}

// Production cache (helps when you have lots of daily posts).
const CACHE: Partial<Record<ContentKind, ContentItem[]>> = {};

export function getAllContent(kind: ContentKind): ContentItem[] {
  const env = process.env.NODE_ENV;
  if (env === "production" && CACHE[kind]) return CACHE[kind]!;

  const dir = path.join(getRoot(), DIRS[kind]);
  const files = listMarkdownFiles(dir);
  const items = files.map((fp) => parseFile(kind, fp));

  // Hide drafts in production builds, but keep them in dev if needed.
  const filtered = env === "production" ? items.filter((i) => !i.draft) : items;

  let out: ContentItem[];

  if (kind === "pillars") {
    // order by optional front matter `order`, then title
    const withOrder = filtered.map((i) => {
      const raw = fs.readFileSync(path.join(dir, `${i.slug}.md`), "utf8");
      const { data } = matter(raw);
      const order = Number(data.order || 999);
      return { i, order };
    });
    out = withOrder.sort((a, b) => a.order - b.order || a.i.title.localeCompare(b.i.title)).map((x) => x.i);
  } else {
    // sort by date desc when available
    out = filtered.sort((a, b) => {
      const ad = a.date ? new Date(a.date).getTime() : 0;
      const bd = b.date ? new Date(b.date).getTime() : 0;
      if (bd !== ad) return bd - ad;
      return a.title.localeCompare(b.title);
    });
  }

  if (env === "production") CACHE[kind] = out;
  return out;
}

export function getContentBySlug(kind: ContentKind, slug: string): ContentItem | null {
  const dir = path.join(getRoot(), DIRS[kind]);
  const fp = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const item = parseFile(kind, fp);
  const env = process.env.NODE_ENV;
  if (env === "production" && item.draft) return null;
  return item;
}

export function getAllTags(kind: ContentKind): string[] {
  const set = new Set<string>();
  getAllContent(kind).forEach((i) => i.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function getAllCategories(kind: ContentKind): string[] {
  const set = new Set<string>();
  getAllContent(kind).forEach((i) => {
    if (i.category) set.add(i.category);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/**
 * Same-kind “related” (fast + predictable).
 */
export function getRelated(kind: ContentKind, slug: string, limit = 4): ContentItem[] {
  const all = getAllContent(kind);
  const current = all.find((i) => i.slug === slug);
  if (!current) return [];

  const scored = all
    .filter((i) => i.slug !== slug)
    .map((i) => {
      let score = 0;
      if (current.category && i.category === current.category) score += 3;
      const tagOverlap = i.tags.filter((t) => current.tags.includes(t)).length;
      score += tagOverlap;
      return { i, score };
    })
    .sort((a, b) => b.score - a.score || a.i.title.localeCompare(b.i.title))
    .slice(0, limit)
    .map((x) => x.i);

  return scored;
}

function overlapCount(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const set = new Set(a);
  let n = 0;
  for (const t of b) if (set.has(t)) n += 1;
  return n;
}



const GENERIC_TAGS = new Set(["areas", "neighborhoods"]);

function filterGeneric(tags: string[]): string[] {
  return (tags || []).filter((t) => t && !GENERIC_TAGS.has(String(t)));
}


function similarityScore(current: ContentItem, candidate: ContentItem): number {
  // Base similarity: tags + category match
  const tagScore = overlapCount(filterGeneric(current.tags || []), filterGeneric(candidate.tags || []));
  const catScore = current.category && candidate.category && current.category === candidate.category ? 3 : 0;

  // Kind bias: for SEO + navigation we tend to prefer pillars + guides.
  const kindBonus =
    candidate.kind === "pillars" ? 2 :
    candidate.kind === "guides" ? 3 :
    candidate.kind === "areas" ? 2 :
    candidate.kind === "resources" ? 2 :
    1;

  // Slight bonus if titles contain shared keywords
  const titleBonus = (() => {
    const a = (current.title || "").toLowerCase();
    const b = (candidate.title || "").toLowerCase();
    let bonus = 0;
    for (const t of (current.tags || []).slice(0, 6)) {
      if (t.length < 3) continue;
      if (b.includes(t)) bonus += 0.25;
    }
    return bonus;
  })();

  return tagScore * 2 + catScore + kindBonus + titleBonus;
}

/**
 * Best-matching pillar for a given item (based on tags/category).
 * Useful for consistent internal linking.
 */
export function getPrimaryPillarFor(item: ContentItem): ContentItem | null {
  if (item.kind === "pillars") return null;
  const pillars = getAllContent("pillars");

  // Exclude any pillar slug that collides with a static route we already use (e.g., /areas).
  const blocked = new Set(["areas", "blog", "guides", "resources", "partners", "faq", "search", "contact", "about", "privacy", "terms", "disclosure"]);

  const scored = pillars
    .filter((p) => !blocked.has(p.slug))
    .map((p) => ({ p, score: similarityScore(item, p) }))
    .sort((a, b) => b.score - a.score || a.p.title.localeCompare(b.p.title));

  return scored.length ? scored[0].p : null;
}

/**
 * Cross-kind recommended reading.
 * Keeps variety (pillar + cluster pages) so internal linking stays strong as the site scales.
 */
export function getRecommendedFor(item: ContentItem, limit = 4): { primaryPillar: ContentItem | null; items: ContentItem[] } {
  const kinds: ContentKind[] = ["pillars", "guides", "areas", "resources", "blog"];
  const all = kinds.flatMap((k) => getAllContent(k));

  const candidates = all.filter((c) => !(c.kind === item.kind && c.slug === item.slug));

  const scored = candidates
    .map((c) => ({ c, score: similarityScore(item, c) }))
    .sort((a, b) => b.score - a.score || a.c.title.localeCompare(b.c.title));

  const primaryPillar = getPrimaryPillarFor(item);

  const quotasByKind: Record<ContentKind, number> = (() => {
    switch (item.kind) {
      case "pillars":
        return { pillars: 0, guides: 2, areas: 1, resources: 1, blog: 0 };
      case "areas":
        return { pillars: 1, guides: 1, areas: 2, resources: 0, blog: 0 };
      case "guides":
        return { pillars: 1, guides: 2, areas: 0, resources: 1, blog: 0 };
      case "blog":
        return { pillars: 1, guides: 1, areas: 1, resources: 1, blog: 0 };
      case "resources":
      default:
        return { pillars: 1, guides: 2, areas: 1, resources: 0, blog: 0 };
    }
  })();

  const picked: ContentItem[] = [];
  const counts: Record<ContentKind, number> = { pillars: 0, guides: 0, areas: 0, blog: 0, resources: 0 };

  // Prefer primary pillar first (for internal linking consistency)
  if (primaryPillar) {
    picked.push(primaryPillar);
    counts.pillars += 1;
  }

  for (const { c } of scored) {
    if (picked.length >= limit) break;

    // Avoid duplicating the primary pillar
    if (primaryPillar && c.kind === "pillars" && c.slug === primaryPillar.slug) continue;

    const quota = quotasByKind[c.kind] ?? 0;
    if (quota > 0 && counts[c.kind] >= quota) continue;

    picked.push(c);
    counts[c.kind] += 1;
  }

  // If we still don't have enough, fill without quotas (still avoid duplicates).
  if (picked.length < limit) {
    for (const { c } of scored) {
      if (picked.length >= limit) break;
      if (picked.some((p) => p.kind === c.kind && p.slug === c.slug)) continue;
      if (primaryPillar && c.kind === "pillars" && c.slug === primaryPillar.slug) continue;
      picked.push(c);
    }
  }

  return { primaryPillar, items: picked.slice(0, limit) };
}

export function encodeParam(v: string): string {
  return encodeURIComponent(v);
}
export function decodeParam(v: string): string {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}
