import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import officialLinks from "@/content/official-links.json";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, badgeWarn, buttonPrimary, card, cardCls, grid2, btnRow } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Official links",
  description: "Source-of-truth links we reference for visas and entry procedures—use these when details change.",
  alternates: { canonical: "/official-links" },
};

type OfficialLink = {
  title: string;
  url: string;
  note?: string;
  category?: string;
  lastVerified?: string;
  reviewCadenceDays?: number;
};

function groupByCategory(list: OfficialLink[]) {
  const out = new Map<string, OfficialLink[]>();
  for (const item of list) {
    const cat = item.category || "Official";
    if (!out.has(cat)) out.set(cat, []);
    out.get(cat)!.push(item);
  }
  return Array.from(out.entries()).map(([category, items]) => ({
    category,
    items: items.slice().sort((a, b) => String(a.title).localeCompare(String(b.title))),
  }));
}

function daysAgo(dateIso?: string) {
  if (!dateIso) return null;
  const ts = new Date(dateIso).getTime();
  if (!Number.isFinite(ts)) return null;
  const diff = Date.now() - ts;
  return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
}

export default function OfficialLinksPage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/official-links", name: "Official links", description: "Source-of-truth links for visa and entry updates." }),
  ];

  const grouped = groupByCategory(officialLinks as unknown as OfficialLink[]);
  const allLast = (officialLinks as unknown as OfficialLink[]).map((l) => l.lastVerified).filter(Boolean) as string[];
  const newest = allLast.length ? allLast.slice().sort().reverse()[0] : null;

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Reference</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Official links we reference</h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Visa and entry procedures can change. This page is the “bookmark list” we keep pointing families to when details shift.
          </p>

          {newest ? (
            <div className="mt-6 flex flex-wrap gap-2">
              <span className={badge}>Last reviewed: {newest}</span>
              <span className={badge}>Tip: revisit monthly for visas/entry</span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className={`${cardCls} mb-10`}>
            <strong className="text-sm font-semibold text-gray-900">Important</strong>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              We write from experience, not as legal advice. When you’re unsure, confirm through official portals or a qualified agent.
            </p>
          </div>

          <div className="grid gap-8">
            {grouped.map((g) => (
              <div key={g.category} className={cardCls}>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">{g.category}</h2>

                <div className={`${grid2} mt-8`}>
                  {g.items.map((l) => {
                    const ago = daysAgo(l.lastVerified);
                    const cadence = l.reviewCadenceDays ? `${l.reviewCadenceDays} days` : null;

                    return (
                      <div key={l.url} className={`${card} p-5`}>
                        <strong className="text-sm font-semibold text-gray-900">{l.title}</strong>
                        {l.note ? <p className="mt-3 text-sm leading-6 text-gray-600">{l.note}</p> : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {l.lastVerified ? <span className={badge}>Verified: {l.lastVerified}</span> : <span className={badgeWarn}>Needs verification</span>}
                          {typeof ago === "number" ? <span className={badge}>{ago} days ago</span> : null}
                          {cadence ? <span className={badge}>Review: every {cadence}</span> : null}
                        </div>

                        <div className={btnRow}>
                          <a
                            className={buttonPrimary}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            data-track="official_open"
                            data-url={l.url}
                          >
                            Open official page
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
