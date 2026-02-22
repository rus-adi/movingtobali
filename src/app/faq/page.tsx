import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import { asInt, paginate } from "@/lib/pagination";
import { getAllContent } from "@/lib/content";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about moving to Bali with kids, with links to the deeper guides.",
  alternates: { canonical: "/faq" },
};

type FAQItem = {
  q: string;
  a: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceKind: string;
};

type Props = { searchParams?: { q?: string; page?: string } };

function routeFor(kind: string, slug: string) {
  return kind === "pillars" ? `/${slug}` : `/${kind}/${slug}`;
}

export default function FaqPage({ searchParams }: Props) {
  const q = (searchParams?.q || "").trim().toLowerCase();
  const page = asInt(searchParams?.page, 1);
  const pageSize = 20;

  const sources = [
    ...getAllContent("pillars"),
    ...getAllContent("guides"),
  ];

  const all: FAQItem[] = [];
  sources.forEach((s) => {
    (s.faqs || []).forEach((f) => {
      all.push({
        q: f.q,
        a: f.a,
        sourceTitle: s.title,
        sourceUrl: routeFor(s.kind, s.slug),
        sourceKind: s.kind,
      });
    });
  });

  const filtered = q
    ? all.filter((f) => `${f.q} ${f.a} ${f.sourceTitle}`.toLowerCase().includes(q))
    : all;

  const { total, items } = paginate(filtered, page, pageSize);

  const siteUrl = getSiteUrl();
  const schemas: any[] = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/faq", name: "FAQ", description: "Frequently asked questions about moving to Bali with kids." }),
    buildBreadcrumbSchema([
      { name: "Home", url: `${siteUrl}/` },
      { name: "FAQ", url: `${siteUrl}/faq` },
    ]),
  ];

  // FAQPage schema: keep this reasonably sized
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.slice(0, 10).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  if (faqSchema.mainEntity.length) schemas.push(faqSchema);

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">FAQ</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Questions parents ask</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Short answers here, then links to the deeper guide so you can act on it.
          </p>

          <div style={{ marginTop: 18 }}>
            <SearchBoxUrl placeholder="Search FAQs… (e.g., eVOA, deposit, school tour, Sanur)" />
          </div>

          <div style={{ marginTop: 14, color: "var(--muted)" }}>
            {total} question{total === 1 ? "" : "s"} found
          </div>

          <div className="btnRow">
            <Link className="button secondary" href="/start-here">Start here</Link>
            <Link className="button secondary" href="/guides">Browse guides</Link>
            <Link className="button secondary" href="/official-links">Official links</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((f, idx) => (
              <div key={`${f.sourceUrl}-${idx}`} className="card">
                <strong>{f.q}</strong>
                <p style={{ marginTop: 10, color: "var(--muted)" }}>{f.a}</p>
                <div style={{ marginTop: 10 }}>
                  <span className="badge">From</span>{" "}
                  <Link href={f.sourceUrl} style={{ color: "rgba(205,240,255,0.95)" }} data-track="faq_source_open" data-url={f.sourceUrl}>
                    {f.sourceTitle}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 18 }}>
            {/* simple pagination reuse */}
            {/* We reuse Pagination but its UI is a bit bigger; for FAQ, keep minimal */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
              {page > 1 ? (
                <Link className="button secondary" href={`/faq?${new URLSearchParams({ q: q || "", page: String(page - 1) }).toString()}`}>Prev</Link>
              ) : (
                <span className="button secondary disabled">Prev</span>
              )}
              <span className="badge">Page {page}</span>
              {(page * pageSize) < total ? (
                <Link className="button secondary" href={`/faq?${new URLSearchParams({ q: q || "", page: String(page + 1) }).toString()}`}>Next</Link>
              ) : (
                <span className="button secondary disabled">Next</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
