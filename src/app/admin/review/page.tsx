import type { Metadata } from "next";
import { getAllContent, type ContentItem } from "@/lib/content";
import officialLinks from "@/content/official-links.json";
import { badge, badgeWarn, btnRow, buttonPrimary, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Review dashboard",
  description: "Internal content QA dashboard (noindex).",
  robots: { index: false, follow: false },
};

type OfficialLink = { title: string; url: string; category?: string; lastVerified?: string; reviewCadenceDays?: number };

type Issue = {
  key: string;
  title: string;
  path: string;
  kind: string;
  updated?: string;
  issues: string[];
};

function pathFor(item: ContentItem): string {
  if (item.kind === "pillars") return `/${item.slug}`;
  return `/${item.kind}/${item.slug}`;
}

function wordCount(s: string): number {
  return (s || "").trim().split(/\s+/).filter(Boolean).length;
}

function extractInternalLinks(markdown: string): string[] {
  const out: string[] = [];
  const re = /\]\((\/[^)\s]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) {
    out.push(m[1]);
  }
  return out;
}

function normalizePath(p: string): string {
  const q = p.split("?")[0].split("#")[0];
  return q.endsWith("/") && q !== "/" ? q.slice(0, -1) : q;
}

function isVisaOrHousingKey(key: string) {
  const k = key.toLowerCase();
  return k.includes("visa") || k.includes("visas") || k.includes("housing") || k.includes("rent");
}

function checkOfficialLinks(list: OfficialLink[]) {
  const out: { title: string; url: string; issue: string }[] = [];
  const now = Date.now();
  for (const l of list) {
    const cadence = Number(l.reviewCadenceDays || 30);
    const last = String(l.lastVerified || "").trim();
    if (!last) {
      out.push({ title: l.title || l.url, url: l.url, issue: "Missing lastVerified" });
      continue;
    }
    const ts = new Date(last).getTime();
    if (!Number.isFinite(ts)) {
      out.push({ title: l.title || l.url, url: l.url, issue: `Invalid lastVerified: ${last}` });
      continue;
    }
    const ageDays = Math.round((now - ts) / (24 * 60 * 60 * 1000));
    if (ageDays > cadence) {
      out.push({ title: l.title || l.url, url: l.url, issue: `Stale (>${cadence} days): ${ageDays} days ago` });
    }
  }
  return out;
}

export default function AdminReviewPage() {
  const kinds: ContentItem["kind"][] = ["pillars", "guides", "areas", "blog", "resources"];
  const all = kinds.flatMap((k) => getAllContent(k).map((x) => x));

  const staticPaths = new Set(
    [
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
    ].map(normalizePath)
  );

  const knownPaths = new Set<string>([...staticPaths]);
  all.forEach((item) => knownPaths.add(normalizePath(pathFor(item))));

  const now = Date.now();
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
  const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000;

  const issues: Issue[] = [];

  for (const item of all) {
    const key = `${item.kind}:${item.slug}`;
    const i: string[] = [];

    // Content hygiene
    if ((item as any).draft) i.push("DRAFT (should not ship)");
    if ((item as any).noindex) i.push("NOINDEX (double-check intent)");

    // Recency: stricter for visas/housing-related pages
    const updated = item.updated || item.date;
    if (!updated && isVisaOrHousingKey(key)) i.push("Missing updated date (visa/housing)");
    if (updated) {
      const ts = new Date(updated).getTime();
      if (Number.isFinite(ts)) {
        const age = now - ts;
        if (isVisaOrHousingKey(key) && age > THIRTY_DAYS) i.push("Update likely stale (visa/housing > 30 days)");
        if (!isVisaOrHousingKey(key) && age > SIX_MONTHS) i.push("Update likely stale (> 6 months)");
      }
    }

    // Substance checks
    const wc = wordCount(item.body || "");
    const faqCount = (item.faqs || []).length;
    const hasVideo = Boolean(item.video);

    if (!hasVideo && faqCount < 3 && wc < 350) i.push("Thin page (no video, <3 FAQs, <350 words)");

    // Areas: comparison metadata
    if (item.kind === "areas") {
      const meta = (item as any).area || {};
      const missing = ["pace", "traffic", "walkability", "familyFit"].filter((k) => !String(meta[k] || "").trim());
      if (missing.length) i.push(`Area meta missing: ${missing.join(", ")}`);
    }

    if (faqCount > 0 && faqCount < 3) i.push("Few FAQs (<3) — consider expanding");
    if (faqCount === 0) i.push("No FAQs — consider adding 3–7 common questions");

    // Internal link checks (basic)
    const links = extractInternalLinks(item.body || "").map(normalizePath);
    const meaningfulLinks = links.filter((p) => {
      if (!p.startsWith("/")) return false;
      if (p.startsWith("/go/")) return false;
      return true;
    });
    if (meaningfulLinks.length < 2) i.push("Few internal links (<2) — add links to pillars/guides/resources");
    const broken = links.filter((p) => {
      if (!p.startsWith("/")) return false;
      if (p.startsWith("/go/")) return false;
      // allow tag/category/search params without strict checks
      if (p.startsWith("/blog/tag/") || p.startsWith("/blog/category/")) return false;
      if (p.startsWith("/guides/tag/") || p.startsWith("/guides/category/")) return false;
      if (p.startsWith("/areas/tag/") || p.startsWith("/areas/category/")) return false;
      if (p.startsWith("/resources/tag/") || p.startsWith("/resources/category/")) return false;
      return !knownPaths.has(p);
    });
    if (broken.length) i.push(`Broken internal links: ${broken.slice(0, 3).join(", ")}${broken.length > 3 ? "…" : ""}`);

    if (i.length) {
      issues.push({
        key,
        title: item.title,
        path: pathFor(item),
        kind: item.kind,
        updated: item.updated || item.date,
        issues: i,
      });
    }
  }

  const officialIssues = checkOfficialLinks(officialLinks as unknown as OfficialLink[]);

  const byKind = kinds.map((k) => ({
    kind: k,
    count: all.filter((x) => x.kind === k).length,
    flagged: issues.filter((x) => x.kind === k).length,
  }));

  return (
    <main>
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeWarn}>Internal</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Content review dashboard</h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            This page is <strong>noindex</strong>. It exists to help you ship cleaner content (freshness, FAQs, internal links).
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6">
          {officialIssues.length ? (
            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">Official links need review</strong>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                These are the “source-of-truth” portals referenced in visa/entry guides. Update <code>lastVerified</code> after checking.
              </p>
              <div className="mt-6 grid gap-3">
                {officialIssues.slice(0, 12).map((o) => (
                  <div key={o.url} className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-gray-600">{o.title}</span>
                    <span className={badgeWarn}>{o.issue}</span>
                  </div>
                ))}
              </div>
              <div className={btnRow}>
                <a className={buttonPrimary} href="/official-links">Open official links page</a>
              </div>
            </div>
          ) : null}

          <div className={grid3}>
            {byKind.map((r) => (
              <div key={r.kind} className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900 capitalize">{r.kind}</strong>
                <div className="mt-4 text-sm text-gray-600">
                  Total: <strong className="text-gray-900">{r.count}</strong> · Flagged: <strong className="text-gray-900">{r.flagged}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Flagged pages ({issues.length})</strong>
            <div className="mt-6 grid gap-6">
              {issues.length ? (
                issues
                  .sort((a, b) => a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title))
                  .map((it) => (
                    <div key={it.key} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <a href={it.path} className="font-semibold text-gray-900 transition-colors hover:text-blue-600">
                          {it.title}
                        </a>
                        <span className={badge}>{it.kind}</span>
                        {it.updated ? <span className="text-xs text-gray-500">Updated: {it.updated}</span> : null}
                      </div>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-600">
                        {it.issues.map((m, idx) => (
                          <li key={idx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ))
              ) : (
                <div className="text-sm text-gray-600">Nothing flagged. (Still do a human read-through before launch.)</div>
              )}
            </div>
          </div>

          <div className={cardCls}>
            <div className="text-sm text-gray-600">
              Tip: run <code>npm run validate:strict</code> and <code>npm run audit:review</code> before launching.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
