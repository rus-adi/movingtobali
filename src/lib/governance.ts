import type { ContentItem } from "@/lib/content";

export type EvidenceLevel = "experience-based" | "reviewed" | "official-links";
export type ContentState = "core" | "monitor" | "experimental";
export type ReviewPriority = "high" | "medium" | "low";
export type FreshnessState = "fresh" | "watch" | "stale" | "undated";

export type GovernanceSummary = {
  owner: string;
  evidenceLevel: EvidenceLevel;
  contentState: ContentState;
  reviewPriority: ReviewPriority;
  reviewCadenceDays: number;
  lastTouched?: string;
  daysSinceTouch?: number;
  nextReviewBy?: string;
  freshness: FreshnessState;
  actionLabel: string;
  note: string;
  route: string;
  tighterCadence: boolean;
};

export type GovernanceRow = GovernanceSummary & {
  title: string;
  kind: ContentItem["kind"];
  category?: string;
  slug: string;
  noindex: boolean;
};

function toDate(value?: string): Date | null {
  if (!value) return null;
  const dt = new Date(value);
  if (!Number.isFinite(dt.getTime())) return null;
  return dt;
}

function toIsoDate(value: Date | null): string | undefined {
  if (!value) return undefined;
  return value.toISOString().slice(0, 10);
}

function daysBetween(a: Date, b: Date): number {
  const ms = a.getTime() - b.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function addDays(base: Date, days: number): Date {
  const copy = new Date(base.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function pathFor(item: ContentItem): string {
  return item.kind === "pillars" ? `/${item.slug}` : `/${item.kind}/${item.slug}`;
}

function keyFor(item: ContentItem): string {
  return `${item.kind}:${item.slug} ${item.category || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

function inferOwner(item: ContentItem): string {
  const explicit = item.governance?.owner?.trim();
  if (explicit) return explicit;

  const key = keyFor(item);
  if (includesAny(key, ["visa", "official-links", "entry"])) return "Empathy School editorial";
  if (includesAny(key, ["gaia", "housing", "rent", "lease", "deposit"])) return "Empathy School + Gaia Group";
  if (includesAny(key, ["school", "empathy", "camp", "tour"])) return "Empathy School admissions";
  if (includesAny(key, ["cost", "budget", "money"])) return "Move to Bali editorial";
  return "Move to Bali editorial";
}

function inferEvidenceLevel(item: ContentItem): EvidenceLevel {
  const explicit = item.governance?.evidenceLevel;
  if (explicit) return explicit;

  const key = keyFor(item);
  if (includesAny(key, ["visa", "official-links", "immigration", "entry"])) return "official-links";
  if (includesAny(key, ["housing", "gaia", "school", "empathy", "camp", "cost", "partner", "area", "commute"])) {
    return "reviewed";
  }
  return "experience-based";
}

function inferContentState(item: ContentItem): ContentState {
  const explicit = item.governance?.contentState;
  if (explicit) return explicit;

  if (item.noindex) return "experimental";
  if (item.kind === "pillars") return "core";
  if (item.kind === "resources") return "monitor";
  if (item.kind === "blog") return "monitor";
  return "core";
}

function inferReviewPriority(item: ContentItem): ReviewPriority {
  const explicit = item.governance?.reviewPriority;
  if (explicit) return explicit;

  const key = keyFor(item);
  if (includesAny(key, ["visa", "official-links", "housing", "gaia", "rent", "lease", "cost", "budget", "school", "empathy", "camp", "partner"])) {
    return "high";
  }
  if (item.kind === "pillars" || item.kind === "areas") return "medium";
  return "low";
}

function inferReviewCadenceDays(item: ContentItem): number {
  const explicit = Number(item.governance?.reviewCadenceDays || 0);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;

  const key = keyFor(item);
  if (includesAny(key, ["visa", "official-links", "immigration", "entry"])) return 30;
  if (includesAny(key, ["housing", "gaia", "rent", "lease", "deposit", "partner", "cost", "budget"])) return 45;
  if (includesAny(key, ["school", "empathy", "camp", "tour"])) return 60;
  if (item.kind === "pillars") return 90;
  if (item.kind === "areas") return 120;
  if (item.kind === "guides") return 120;
  if (item.kind === "resources") return 180;
  return 180;
}

function inferNote(item: ContentItem, evidenceLevel: EvidenceLevel): string {
  const key = keyFor(item);
  if (evidenceLevel === "official-links") {
    return "This page sits on a tight review cycle because rules can change. Use it to orient yourself, then confirm changing details through official sources before you act.";
  }
  if (includesAny(key, ["housing", "gaia", "rent", "lease", "deposit"])) {
    return "Housing pages are reviewed more tightly because deposits, contracts, and expectations can create expensive mistakes if the page drifts.";
  }
  if (includesAny(key, ["school", "empathy", "camp", "tour"])) {
    return "School pages are reviewed around current fit, process, and practical family questions so they stay honest rather than over-promising.";
  }
  if (evidenceLevel === "reviewed") {
    return "This page is reviewed on a regular cadence because families use it to make real decisions, not just browse inspiration.";
  }
  return "This page is primarily experience-based. It should make the move clearer and calmer, but it is not a substitute for official advice where rules or contracts are involved.";
}

export function summarizeGovernance(item: ContentItem, now = new Date()): GovernanceSummary {
  const owner = inferOwner(item);
  const evidenceLevel = inferEvidenceLevel(item);
  const contentState = inferContentState(item);
  const reviewPriority = inferReviewPriority(item);
  const reviewCadenceDays = inferReviewCadenceDays(item);
  const tighterCadence = reviewCadenceDays <= 60;

  const touch = toDate(item.governance?.lastReviewed || item.updated || item.date);
  const daysSinceTouch = touch ? daysBetween(now, touch) : undefined;
  const nextReview = touch ? addDays(touch, reviewCadenceDays) : null;

  let freshness: FreshnessState = "undated";
  if (touch && typeof daysSinceTouch === "number") {
    if (daysSinceTouch > reviewCadenceDays) freshness = "stale";
    else if (daysSinceTouch >= Math.max(7, Math.floor(reviewCadenceDays * 0.8))) freshness = "watch";
    else freshness = "fresh";
  }

  let actionLabel = "Keep live";
  if (freshness === "watch") actionLabel = "Review soon";
  if (freshness === "stale") actionLabel = "Review now";
  if (freshness === "undated") actionLabel = "Add review date";

  return {
    owner,
    evidenceLevel,
    contentState,
    reviewPriority,
    reviewCadenceDays,
    lastTouched: toIsoDate(touch),
    daysSinceTouch,
    nextReviewBy: toIsoDate(nextReview),
    freshness,
    actionLabel,
    note: inferNote(item, evidenceLevel),
    route: pathFor(item),
    tighterCadence,
  };
}

export function buildGovernanceRows(items: ContentItem[], now = new Date()): GovernanceRow[] {
  const rows = items.map((item) => {
    const summary = summarizeGovernance(item, now);
    return {
      ...summary,
      title: item.title,
      kind: item.kind,
      category: item.category,
      slug: item.slug,
      noindex: Boolean(item.noindex),
    };
  });

  const freshnessScore: Record<FreshnessState, number> = {
    stale: 4,
    watch: 3,
    undated: 2,
    fresh: 1,
  };

  const priorityScore: Record<ReviewPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return rows.sort((a, b) => {
    const diff = freshnessScore[b.freshness] - freshnessScore[a.freshness];
    if (diff) return diff;
    const priorityDiff = priorityScore[b.reviewPriority] - priorityScore[a.reviewPriority];
    if (priorityDiff) return priorityDiff;
    const daysDiff = (b.daysSinceTouch || 0) - (a.daysSinceTouch || 0);
    if (daysDiff) return daysDiff;
    return a.title.localeCompare(b.title);
  });
}

export function getGovernanceTotals(items: ContentItem[], now = new Date()) {
  const rows = buildGovernanceRows(items, now);
  return {
    totalPages: rows.length,
    fresh: rows.filter((row) => row.freshness === "fresh").length,
    watch: rows.filter((row) => row.freshness === "watch").length,
    stale: rows.filter((row) => row.freshness === "stale").length,
    undated: rows.filter((row) => row.freshness === "undated").length,
    tighterCadence: rows.filter((row) => row.tighterCadence).length,
    noindex: rows.filter((row) => row.noindex).length,
    core: rows.filter((row) => row.contentState === "core").length,
    monitor: rows.filter((row) => row.contentState === "monitor").length,
    experimental: rows.filter((row) => row.contentState === "experimental").length,
  };
}
