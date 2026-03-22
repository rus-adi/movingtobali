import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CONTENT_INDEX_PATH = path.join(ROOT, "src", "generated", "contentIndex.json");
const OUT_PATH = path.join(ROOT, "src", "generated", "governanceReport.json");

function readJson(fp) {
  return JSON.parse(fs.readFileSync(fp, "utf8"));
}

function toDate(value) {
  if (!value) return null;
  const dt = new Date(value);
  if (!Number.isFinite(dt.getTime())) return null;
  return dt;
}

function toIsoDate(value) {
  if (!value) return undefined;
  return value.toISOString().slice(0, 10);
}

function addDays(base, days) {
  const copy = new Date(base.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function daysBetween(a, b) {
  return Math.max(0, Math.floor((a.getTime() - b.getTime()) / 86400000));
}

function pathFor(item) {
  return item.kind === "pillars" ? `/${item.slug}` : `/${item.kind}/${item.slug}`;
}

function keyFor(item) {
  return `${item.kind}:${item.slug} ${item.category || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
}

function includesAny(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle));
}

function inferOwner(item) {
  const explicit = item?.governance?.owner?.trim();
  if (explicit) return explicit;
  const key = keyFor(item);
  if (includesAny(key, ["visa", "official-links", "entry"])) return "Empathy School editorial";
  if (includesAny(key, ["gaia", "housing", "rent", "lease", "deposit"])) return "Empathy School + Gaia Group";
  if (includesAny(key, ["school", "empathy", "camp", "tour"])) return "Empathy School admissions";
  return "Move to Bali editorial";
}

function inferEvidenceLevel(item) {
  const explicit = item?.governance?.evidenceLevel;
  if (explicit) return explicit;
  const key = keyFor(item);
  if (includesAny(key, ["visa", "official-links", "immigration", "entry"])) return "official-links";
  if (includesAny(key, ["housing", "gaia", "school", "empathy", "camp", "cost", "budget", "partner", "area", "commute"])) return "reviewed";
  return "experience-based";
}

function inferContentState(item) {
  const explicit = item?.governance?.contentState;
  if (explicit) return explicit;
  if (item.noindex) return "experimental";
  if (item.kind === "pillars") return "core";
  if (item.kind === "resources" || item.kind === "blog") return "monitor";
  return "core";
}

function inferReviewPriority(item) {
  const explicit = item?.governance?.reviewPriority;
  if (explicit) return explicit;
  const key = keyFor(item);
  if (includesAny(key, ["visa", "official-links", "housing", "gaia", "rent", "lease", "deposit", "cost", "budget", "school", "empathy", "camp", "partner"])) return "high";
  if (item.kind === "pillars" || item.kind === "areas") return "medium";
  return "low";
}

function inferReviewCadenceDays(item) {
  const explicit = Number(item?.governance?.reviewCadenceDays || 0);
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

function inferNote(item, evidenceLevel) {
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

function summarize(item, now = new Date()) {
  const owner = inferOwner(item);
  const evidenceLevel = inferEvidenceLevel(item);
  const contentState = inferContentState(item);
  const reviewPriority = inferReviewPriority(item);
  const reviewCadenceDays = inferReviewCadenceDays(item);
  const tighterCadence = reviewCadenceDays <= 60;

  const touch = toDate(item?.governance?.lastReviewed || item.updated || item.date);
  const daysSinceTouch = touch ? daysBetween(now, touch) : undefined;
  const nextReviewBy = touch ? toIsoDate(addDays(touch, reviewCadenceDays)) : undefined;

  let freshness = "undated";
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
    title: item.title,
    slug: item.slug,
    kind: item.kind,
    category: item.category,
    route: pathFor(item),
    owner,
    evidenceLevel,
    contentState,
    reviewPriority,
    reviewCadenceDays,
    lastTouched: toIsoDate(touch),
    daysSinceTouch,
    nextReviewBy,
    freshness,
    actionLabel,
    tighterCadence,
    noindex: Boolean(item.noindex),
    note: inferNote(item, evidenceLevel),
  };
}

const index = readJson(CONTENT_INDEX_PATH);
const kinds = ["pillars", "guides", "areas", "blog", "resources"];
const items = kinds.flatMap((kind) => (Array.isArray(index[kind]) ? index[kind] : []).map((item) => ({ ...item, kind })));

const freshnessScore = { stale: 4, watch: 3, undated: 2, fresh: 1 };
const priorityScore = { high: 3, medium: 2, low: 1 };
const rows = items
  .map((item) => summarize(item))
  .sort((a, b) => {
    const freshnessDiff = freshnessScore[b.freshness] - freshnessScore[a.freshness];
    if (freshnessDiff) return freshnessDiff;
    const priorityDiff = priorityScore[b.reviewPriority] - priorityScore[a.reviewPriority];
    if (priorityDiff) return priorityDiff;
    const daysDiff = (b.daysSinceTouch || 0) - (a.daysSinceTouch || 0);
    if (daysDiff) return daysDiff;
    return a.title.localeCompare(b.title);
  });

const summary = {
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

const out = {
  generatedAt: new Date().toISOString(),
  summary,
  rows,
};

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`Governance report generated -> ${path.relative(ROOT, OUT_PATH)}`);
console.log(summary);
