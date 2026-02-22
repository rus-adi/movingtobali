import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import officialLinks from "@/content/official-links.json";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

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

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Reference</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Official links we reference</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Visa and entry procedures can change. This page is the “bookmark list” we keep pointing families to when details shift.
          </p>

          {newest ? (
            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="badge">Last reviewed: {newest}</span>
              <span className="badge">Tip: revisit monthly for visas/entry</span>
            </div>
          ) : null}
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          <div className="card" style={{ marginBottom: 18 }}>
            <strong>Important</strong>
            <p style={{ marginTop: 8, color: "var(--muted)" }}>
              We write from experience, not as legal advice. When you’re unsure, confirm through official portals or a qualified agent.
            </p>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            {grouped.map((g) => (
              <div key={g.category} className="card">
                <h2 style={{ marginTop: 0 }}>{g.category}</h2>

                <div className="grid2" style={{ marginTop: 12 }}>
                  {g.items.map((l) => {
                    const ago = daysAgo(l.lastVerified);
                    const cadence = l.reviewCadenceDays ? `${l.reviewCadenceDays} days` : null;

                    return (
                      <div key={l.url} className="card" style={{ padding: 16 }}>
                        <strong>{l.title}</strong>
                        {l.note ? <p style={{ marginTop: 8, color: "var(--muted)" }}>{l.note}</p> : null}

                        <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {l.lastVerified ? <span className="badge">Verified: {l.lastVerified}</span> : <span className="badge warn">Needs verification</span>}
                          {typeof ago === "number" ? <span className="badge">{ago} days ago</span> : null}
                          {cadence ? <span className="badge">Review: every {cadence}</span> : null}
                        </div>

                        <div className="btnRow" style={{ marginTop: 12 }}>
                          <a
                            className="button primary"
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
