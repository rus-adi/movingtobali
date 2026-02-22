#!/usr/bin/env node
/**
 * Link checker (official links + optional full outbound link scan)
 *
 * Usage:
 *   node scripts/check-links.mjs                 # checks official links only
 *   node scripts/check-links.mjs --all           # checks all outbound links (markdown + json)
 *   node scripts/check-links.mjs --official      # checks official links only
 *   node scripts/check-links.mjs --write         # updates official-links.json lastVerified for OK links
 *
 * Notes:
 * - Uses fetch() (Node 18+). Some sites block HEAD; we fallback to GET.
 * - Keep concurrency low to avoid rate limiting.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OFFICIAL_PATH = path.join(ROOT, "src", "content", "official-links.json");
const PARTNERS_PATH = path.join(ROOT, "src", "content", "partners.json");

const args = new Set(process.argv.slice(2));
const MODE_ALL = args.has("--all");
const MODE_OFFICIAL = args.has("--official") || !MODE_ALL;
const DO_WRITE = args.has("--write");
const CONCURRENCY = Number((process.argv.find((x) => x.startsWith("--concurrency=")) || "").split("=")[1] || 6);
const TIMEOUT_MS = Number((process.argv.find((x) => x.startsWith("--timeout=")) || "").split("=")[1] || 12000);

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function listMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function walkValue(v, fn, currentPath = "") {
  if (Array.isArray(v)) {
    v.forEach((x, i) => walkValue(x, fn, currentPath ? `${currentPath}.${i}` : String(i)));
    return;
  }
  if (v && typeof v === "object") {
    Object.entries(v).forEach(([k, x]) => walkValue(x, fn, currentPath ? `${currentPath}.${k}` : k));
    return;
  }
  fn(v, currentPath);
}

function extractUrlsFromText(text) {
  const s = String(text || "");
  const urls = [];
  // markdown links: ](https://...)
  const md = /\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = md.exec(s))) urls.push(m[1]);
  // bare URLs (avoid trailing punctuation)
  const bare = /(https?:\/\/[^\s)\]]+)/g;
  while ((m = bare.exec(s))) {
    const u = m[1].replace(/[\.,;!\)\]]+$/g, "");
    urls.push(u);
  }
  return urls;
}

function unique(list) {
  return Array.from(new Set(list));
}

function isHttpUrl(u) {
  return /^https?:\/\//i.test(u);
}

function normalizeUrl(u) {
  try {
    const url = new URL(u);
    url.hash = "";
    return url.toString();
  } catch {
    return u;
  }
}

async function fetchWithTimeout(url, opts) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...opts, redirect: "follow", signal: controller.signal, headers: { "user-agent": "EmpathySchoolLinkChecker/1.0" } });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function checkOne(url) {
  const start = Date.now();
  try {
    let res = await fetchWithTimeout(url, { method: "HEAD" });
    // Some servers reject HEAD or require GET.
    if (res.status === 405 || res.status === 403 || res.status === 400) {
      res = await fetchWithTimeout(url, { method: "GET" });
    }
    const ms = Date.now() - start;
    return {
      url,
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || url,
      ms,
    };
  } catch (e) {
    const ms = Date.now() - start;
    return { url, ok: false, status: 0, finalUrl: url, ms, error: e?.name === "AbortError" ? "timeout" : String(e?.message || e) };
  }
}

async function runQueue(urls) {
  const out = [];
  let idx = 0;

  async function worker() {
    while (idx < urls.length) {
      const current = urls[idx++];
      const r = await checkOne(current);
      out.push(r);
      const status = r.ok ? "OK" : "FAIL";
      process.stdout.write(`${status} ${r.status || ""}  ${current}\n`);
    }
  }

  const workers = Array.from({ length: Math.max(1, Math.min(CONCURRENCY, urls.length)) }, () => worker());
  await Promise.all(workers);
  return out;
}

function collectOfficialUrls() {
  const list = readJson(OFFICIAL_PATH);
  return list.map((x) => x.url).filter(isHttpUrl).map(normalizeUrl);
}

function collectPartnerUrls() {
  if (!fs.existsSync(PARTNERS_PATH)) return [];
  const data = readJson(PARTNERS_PATH);
  const list = Array.isArray(data) ? data : (data.partners || []);
  const urls = [];
  for (const p of list) {
    if (p.website && isHttpUrl(p.website)) urls.push(p.website);
    if (p.social?.website && isHttpUrl(p.social.website)) urls.push(p.social.website);
  }
  return urls.map(normalizeUrl);
}

function collectMarkdownUrls() {
  const kinds = ["pillars", "guides", "areas", "blog", "resources"];
  const urls = [];
  for (const kind of kinds) {
    const dir = path.join(CONTENT_DIR, kind);
    for (const fp of listMarkdown(dir)) {
      const raw = fs.readFileSync(fp, "utf8");
      const parsed = matter(raw);
      urls.push(...extractUrlsFromText(parsed.content || ""));
      // Also scan front matter values for URLs
      walkValue(parsed.data || {}, (val) => {
        if (typeof val === "string") urls.push(...extractUrlsFromText(val));
      });
    }
  }
  return urls.filter(isHttpUrl).map(normalizeUrl);
}

function writeReport(results) {
  const now = new Date().toISOString();
  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;

  const report = {
    generatedAt: now,
    total: results.length,
    ok,
    fail,
    results: results.slice().sort((a, b) => (a.ok === b.ok ? a.url.localeCompare(b.url) : a.ok ? -1 : 1)),
  };

  const outPath = path.join(ROOT, "planning", "link-check-report.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  const md = [];
  md.push(`# Link check report\n`);
  md.push(`Generated: ${now}\n`);
  md.push(`Total: **${results.length}**  |  OK: **${ok}**  |  Fail: **${fail}**\n`);
  md.push(`## Failures\n`);
  for (const r of report.results.filter((x) => !x.ok)) {
    md.push(`- ${r.url} — ${r.error ? r.error : `HTTP ${r.status}`}`);
  }
  md.push(`\n## Notes\n`);
  md.push(`- Some official portals block HEAD requests; the checker falls back to GET.\n`);
  md.push(`- If you see timeouts, re-run with lower concurrency: \`--concurrency=2\`.\n`);

  fs.writeFileSync(path.join(ROOT, "planning", "link-check-report.md"), md.join("\n"));
}

function maybeUpdateOfficialVerified(results) {
  if (!DO_WRITE) return;
  const today = new Date().toISOString().slice(0, 10);

  const okSet = new Set(results.filter((r) => r.ok).map((r) => r.url));
  const list = readJson(OFFICIAL_PATH);
  let changed = 0;

  for (const item of list) {
    const u = normalizeUrl(item.url);
    if (okSet.has(u)) {
      if (item.lastVerified !== today) {
        item.lastVerified = today;
        changed++;
      }
    }
  }

  fs.writeFileSync(OFFICIAL_PATH, JSON.stringify(list, null, 2));
  console.log(`\nUpdated official-links.json lastVerified on ${changed} link(s).`);
}

async function main() {
  console.log(`\n=== Link checker ===`);
  console.log(`Mode: ${MODE_ALL ? "ALL outbound links" : "Official links only"}`);
  console.log(`Concurrency: ${CONCURRENCY}  Timeout: ${TIMEOUT_MS}ms\n`);

  const urls = [];
  if (MODE_OFFICIAL) urls.push(...collectOfficialUrls());
  if (MODE_ALL) {
    urls.push(...collectPartnerUrls());
    urls.push(...collectMarkdownUrls());
  }

  const uniqueUrls = unique(urls).filter(isHttpUrl);

  if (!uniqueUrls.length) {
    console.log("No URLs found.");
    process.exit(0);
  }

  const results = await runQueue(uniqueUrls);
  writeReport(results);
  if (MODE_OFFICIAL) maybeUpdateOfficialVerified(results);

  const ok = results.filter((r) => r.ok).length;
  const fail = results.length - ok;

  console.log(`\nDone. OK: ${ok}  Fail: ${fail}`);
  console.log(`Report: planning/link-check-report.json`);
  console.log(`Markdown summary: planning/link-check-report.md\n`);

  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
