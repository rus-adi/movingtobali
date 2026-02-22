#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OFFICIAL_PATH = path.join(ROOT, "src", "content", "official-links.json");

const KINDS = ["pillars", "guides", "areas", "blog", "resources"];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function slugFromFile(fp) {
  return path.basename(fp).replace(/\.md$/, "");
}

function wordCount(s) {
  return String(s || "").trim().split(/\s+/).filter(Boolean).length;
}


function isPlaceholder(v) {
  if (typeof v !== "string") return false;
  const s = v.toLowerCase();
  if (
    s.includes("write a 1–2 sentence description") ||
    s.includes("write a 1-2 sentence description") ||
    s.includes("replace this with") ||
    s.includes("placeholder") ||
    s.includes("todo") ||
    s.includes("tbd")
  ) return true;

  if (/\[(needs input|add faq|define|set price|optional|write)\b/i.test(s)) return true;
  if (s.includes("example.com") || s.includes("hello@example.com")) return true;

  return false;
}

function extractInternalLinks(markdown) {
  const out = [];
  const re = /\]\((\/[^)\s]+)\)/g;
  let m;
  while ((m = re.exec(String(markdown || "")))) out.push(m[1]);
  return out;
}

function normalizePath(p) {
  const q = String(p || "").split("?")[0].split("#")[0];
  return q.endsWith("/") && q !== "/" ? q.slice(0, -1) : q;
}

function isVisaOrHousingKey(key) {
  const k = String(key).toLowerCase();
  return k.includes("visa") || k.includes("visas") || k.includes("housing") || k.includes("rent");
}

function pathFor(kind, slug) {
  if (kind === "pillars") return `/${slug}`;
  return `/${kind}/${slug}`;
}

const strict = process.argv.includes("--strict");

const staticPaths = new Set([
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
].map(normalizePath));

const items = [];
for (const kind of KINDS) {
  const dir = path.join(CONTENT_DIR, kind);
  for (const fp of listMarkdown(dir)) {
    const slug = slugFromFile(fp);
    const raw = fs.readFileSync(fp, "utf8");
    const parsed = matter(raw);
    items.push({
      kind,
      slug,
      path: pathFor(kind, slug),
      title: parsed.data?.title || slug,
      description: parsed.data?.description || "",
      date: parsed.data?.date || "",
      updated: parsed.data?.updated || "",
      draft: Boolean(parsed.data?.draft),
      noindex: Boolean(parsed.data?.noindex),
      area: parsed.data?.area || null,
      faqs: Array.isArray(parsed.data?.faqs) ? parsed.data.faqs.length : 0,
      video: Boolean(parsed.data?.video?.youtubeId || parsed.data?.video),
      body: String(parsed.content || ""),
    });
  }
}

const knownPaths = new Set([...staticPaths]);
for (const it of items) knownPaths.add(normalizePath(it.path));

const now = Date.now();
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000;

const flagged = [];

for (const it of items) {
  const key = `${it.kind}:${it.slug}`;
  const issues = [];

  if (it.draft) issues.push("DRAFT");
  if (it.noindex) issues.push("NOINDEX");

  if (!it.description || isPlaceholder(String(it.description))) issues.push("Missing/placeholder description");
  if (isPlaceholder(String(it.body || ""))) issues.push("Placeholder content");

  const updated = it.updated || it.date;
  if (!updated && isVisaOrHousingKey(key)) issues.push("Missing updated date (visa/housing)");
  if (updated) {
    const ts = new Date(updated).getTime();
    if (Number.isFinite(ts)) {
      const age = now - ts;
      if (isVisaOrHousingKey(key) && age > THIRTY_DAYS) issues.push("Stale (visa/housing > 30 days)");
      if (!isVisaOrHousingKey(key) && age > SIX_MONTHS) issues.push("Stale (> 6 months)");
    }
  }

  const wc = wordCount(it.body);
  if (!it.video && it.faqs < 3 && wc < 350) issues.push("Thin page (no video, <3 FAQs, <350 words)");
  if (it.kind === "areas") {
    const meta = it.area || {};
    const missing = ["pace","traffic","walkability","familyFit"].filter((k) => !String(meta[k] || "").trim());
    if (missing.length) issues.push(`Area meta missing: ${missing.join(", ")}`);
  }
  if (it.faqs === 0) issues.push("No FAQs");
  if (it.faqs > 0 && it.faqs < 3) issues.push("Few FAQs (<3)");

  const links = extractInternalLinks(it.body).map(normalizePath);
  const meaningfulLinks = links.filter((p) => {
    if (!p.startsWith("/")) return false;
    if (p.startsWith("/go/")) return false;
    return true;
  });
  if (meaningfulLinks.length < 2) issues.push("Few internal links (<2)");
  const broken = links.filter((p) => {
    if (!p.startsWith("/")) return false;
    if (p.startsWith("/go/")) return false;
    if (p.startsWith("/blog/tag/") || p.startsWith("/blog/category/")) return false;
    if (p.startsWith("/guides/tag/") || p.startsWith("/guides/category/")) return false;
    if (p.startsWith("/areas/tag/") || p.startsWith("/areas/category/")) return false;
    if (p.startsWith("/resources/tag/") || p.startsWith("/resources/category/")) return false;
    return !knownPaths.has(p);
  });
  if (broken.length) issues.push(`Broken links: ${broken.slice(0,3).join(", ")}${broken.length>3 ? "…" : ""}`);

  if (issues.length) flagged.push({ ...it, issues });
}


const officialIssues = [];
try {
  const links = readJson(OFFICIAL_PATH);
  const nowMs = Date.now();
  for (const l of links) {
    const title = l.title || l.url;
    const cadence = Number(l.reviewCadenceDays || 30);
    const last = String(l.lastVerified || "").trim();

    if (!last) {
      officialIssues.push({ title, url: l.url, issue: "Missing lastVerified" });
      continue;
    }

    const ts = new Date(last).getTime();
    if (!Number.isFinite(ts)) {
      officialIssues.push({ title, url: l.url, issue: `Invalid lastVerified: ${last}` });
      continue;
    }

    const ageDays = Math.round((nowMs - ts) / (24 * 60 * 60 * 1000));
    if (ageDays > cadence) {
      officialIssues.push({ title, url: l.url, issue: `Stale (>${cadence} days): ${ageDays} days since lastVerified` });
    }
  }
} catch (e) {
  officialIssues.push({ title: "official-links.json", url: "/official-links", issue: `Could not read OFFICIAL_PATH: ${e.message}` });
}

const byKind = Object.fromEntries(KINDS.map((k) => [k, { total: items.filter((x) => x.kind === k).length, flagged: flagged.filter((x) => x.kind === k).length }]));

console.log("\n=== Content Audit (review) ===\n");
for (const k of KINDS) {
  const r = byKind[k];
  console.log(`${k.padEnd(10)}  total: ${String(r.total).padStart(2)}   flagged: ${String(r.flagged).padStart(2)}`);
}
console.log("");

if (officialIssues.length) {
  console.log("=== Official links audit ===\n");
  for (const i of officialIssues) {
    console.log(`- ${i.title}: ${i.issue}`);
    console.log(`  ${i.url}`);
  }
  console.log("");
}

if (!flagged.length && !officialIssues.length) {
  console.log("No issues flagged. ✅\n");
  process.exit(0);
}

for (const it of flagged.sort((a,b)=> (a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title)))) {
  console.log(`- ${it.title}  (${it.path})`);
  console.log(`  ${it.issues.join(" | ")}`);
}
console.log("");

if (strict) {
  const total = flagged.length + officialIssues.length;
  console.error(`Strict mode: failing because ${total} item(s) were flagged.`);
  process.exit(1);
}
