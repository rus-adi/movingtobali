import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Build-time search index generator.
 *
 * Why: On Vercel/Serverless, runtime `fs` file access to non-imported files can be unreliable
 * depending on bundling/output tracing. Generating a JSON index at build time guarantees
 * search works everywhere.
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

function compactText(s, max = 700) {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max) : t;
}

function routeFor(kind, slug) {
  return kind === "pillars" ? `/${slug}` : `/${kind}/${slug}`;
}

function parse(kind, fp) {
  const raw = fs.readFileSync(fp, "utf8");
  const { data, content } = matter(raw);
  const slug = path.basename(fp).replace(/\.md$/, "");
  const title = String(data.title || slug);
  const description = String(data.description || "");
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const category = data.category ? String(data.category) : undefined;
  const draft = Boolean(data.draft);
  const areaMeta = kind === "areas" && data.area && typeof data.area === "object" ? Object.values(data.area).join(" ") : "";
  const excerpt = compactText(content || "");

  const searchText = [title, description, category, tags.join(" "), areaMeta, excerpt]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return {
    kind,
    slug,
    title,
    description,
    category,
    tags,
    path: routeFor(kind, slug),
    searchText,
    draft,
  };
}

const entries = Object.entries(CONTENT_DIRS).flatMap(([kind, dirRel]) => {
  const dirAbs = path.join(ROOT, dirRel);
  const files = listMarkdownFiles(dirAbs);
  return files.map((fp) => parse(kind, fp));
});

// Drop drafts for production-like behavior.
const filtered = entries.filter((e) => !e.draft).map(({ draft, ...rest }) => rest);

const outDir = path.join(ROOT, "src/generated");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "searchIndex.json");
fs.writeFileSync(outPath, JSON.stringify(filtered, null, 2) + "\n", "utf8");

console.log(`Search index generated: ${filtered.length} entries -> ${path.relative(ROOT, outPath)}`);
