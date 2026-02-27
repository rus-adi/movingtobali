import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Build-time content index generator.
 *
 * Why: On Vercel/serverless, runtime `fs` access to the `content/` folder can be unreliable
 * depending on output tracing. Generating a JSON index at build time guarantees that
 * dynamic pages (those using searchParams) can render lists consistently.
 */

const ROOT = process.cwd();

const CONTENT_DIRS = {
  pillars: "content/pillars",
  areas: "content/areas",
  guides: "content/guides",
  blog: "content/blog",
  resources: "content/resources",
};

function listMarkdownFiles(dirAbs) {
  if (!fs.existsSync(dirAbs)) return [];
  return fs
    .readdirSync(dirAbs)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dirAbs, f));
}

function estimateReadingTimeMinutes(markdown, wordsPerMinute = 220) {
  if (!markdown || typeof markdown !== "string") return 1;

  // Remove fenced code blocks and inline code.
  const noCode = markdown.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ");

  // Replace markdown links with link text.
  const noLinks = noCode.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  // Strip basic HTML tags (for embedded blocks).
  const noHtml = noLinks.replace(/<[^>]+>/g, " ");

  // Remove common markdown punctuation that can inflate tokenization.
  const normalized = noHtml.replace(/[#>*_~\-]+/g, " ");

  const words = normalized
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const count = words.length;
  if (count <= 0) return 1;

  const wpm = Math.max(120, Math.min(400, wordsPerMinute));
  return Math.max(1, Math.ceil(count / wpm));
}

function parseFaqs(data) {
  if (!Array.isArray(data?.faqs)) return undefined;
  const out = data.faqs
    .map((f) => ({
      q: String(f?.q || f?.question || ""),
      a: String(f?.a || f?.answer || ""),
    }))
    .filter((f) => f.q && f.a);
  return out.length ? out : undefined;
}

function parse(kind, fp) {
  const raw = fs.readFileSync(fp, "utf8");
  const { data, content } = matter(raw);

  const slug = path.basename(fp).replace(/\.md$/, "");

  const title = String(data.title || slug);
  const description = String(data.description || "");
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const category = data.category ? String(data.category) : undefined;

  const item = {
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
    area: data.area ? data.area : undefined,
    video: data.video ? data.video : undefined,
    social: data.social ? data.social : undefined,
    faqs: parseFaqs(data),
    readingTimeMinutes: estimateReadingTimeMinutes(content),
    body: content,
  };

  // Keep order for pillar sorting only.
  const order = Number(data.order || 999);

  return { item, order };
}

function sortItems(kind, parsed) {
  // Filter out drafts by default (production behavior).
  const filtered = parsed.filter((x) => !x.item.draft);

  if (kind === "pillars") {
    return filtered
      .sort((a, b) => a.order - b.order || a.item.title.localeCompare(b.item.title))
      .map((x) => x.item);
  }

  return filtered
    .sort((a, b) => {
      const ad = a.item.date ? new Date(a.item.date).getTime() : 0;
      const bd = b.item.date ? new Date(b.item.date).getTime() : 0;
      if (bd !== ad) return bd - ad;
      return a.item.title.localeCompare(b.item.title);
    })
    .map((x) => x.item);
}

const out = {};
for (const [kind, dirRel] of Object.entries(CONTENT_DIRS)) {
  const dirAbs = path.join(ROOT, dirRel);
  const files = listMarkdownFiles(dirAbs);
  const parsed = files.map((fp) => parse(kind, fp));
  out[kind] = sortItems(kind, parsed);
}

const outDir = path.join(ROOT, "src/generated");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "contentIndex.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");

const counts = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0]));
console.log(`Content index generated -> ${path.relative(ROOT, outPath)}`);
console.log(counts);
