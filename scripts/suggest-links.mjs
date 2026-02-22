#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const KINDS = ["pillars", "guides", "areas", "blog", "resources"];

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f));
}

function slugFromFile(fp) {
  return path.basename(fp).replace(/\.md$/, "");
}

function pathFor(kind, slug) {
  if (kind === "pillars") return `/${slug}`;
  return `/${kind}/${slug}`;
}

function asArray(v) {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  return [];
}

function loadAll() {
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
        title: String(parsed.data?.title || slug),
        category: parsed.data?.category ? String(parsed.data.category) : "",
        tags: asArray(parsed.data?.tags),
        date: parsed.data?.date ? String(parsed.data.date) : "",
        updated: parsed.data?.updated ? String(parsed.data.updated) : "",
        draft: Boolean(parsed.data?.draft),
        noindex: Boolean(parsed.data?.noindex),
      });
    }
  }
  return items;
}

function overlapCount(a, b) {
  const setB = new Set(b);
  let n = 0;
  for (const x of a) if (setB.has(x)) n++;
  return n;
}

function score(a, b) {
  // a is source, b is candidate
  if (a.kind === b.kind && a.slug === b.slug) return -999;

  const tagOverlap = overlapCount(a.tags || [], b.tags || []);
  let s = tagOverlap * 2;

  if (a.category && b.category && a.category === b.category) s += 3;
  if (b.kind === "pillars") s += 5;
  if (a.kind === b.kind) s += 0.5;

  return s;
}

function pickPrimaryPillar(source, items) {
  if (source.kind === "pillars") return source;

  const pillars = items.filter((i) => i.kind === "pillars");
  let best = pillars.find((p) => p.slug === "start-here") || pillars[0];
  let bestScore = -Infinity;
  for (const p of pillars) {
    const s = score(source, p);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }
  return best;
}

function diversifyTop(source, items, limit) {
  const scored = items
    .map((i) => ({ i, s: score(source, i) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  const out = [];
  const kindCounts = {};
  for (const { i } of scored) {
    if (out.length >= limit) break;
    const k = i.kind;
    kindCounts[k] = kindCounts[k] || 0;
    // light diversity: no more than half from one kind
    if (kindCounts[k] >= Math.ceil(limit / 2)) continue;
    out.push(i);
    kindCounts[k] += 1;
  }
  return out;
}

const args = process.argv.slice(2);
const kind = args[0];
const slug = args[1];

const jsonOut = args.includes("--json");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=", 2)[1]) : 6;

if (!kind || !slug) {
  console.log("Usage: npm run suggest:links -- <pillars|guides|areas|blog|resources> <slug> [--limit=6] [--json]");
  process.exit(1);
}

const items = loadAll();
const source = items.find((i) => i.kind === kind && i.slug === slug);
if (!source) {
  console.error("Not found:", kind, slug);
  process.exit(1);
}

const pillar = pickPrimaryPillar(source, items);
const recommended = diversifyTop(source, items.filter((i) => i.kind !== "pillars"), limit);

const result = { source, primaryPillar: pillar, recommended };

if (jsonOut) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

console.log("\nSuggested internal links (copy/paste)\n");
console.log("## Next steps\n");
console.log(`- [Start here](/start-here)`);
console.log(`- [Pillar: ${pillar.title}](${pillar.path})`);
for (const r of recommended) {
  console.log(`- [${r.title}](${r.path})`);
}
console.log(`- [Ask a question](/contact)\n`);
