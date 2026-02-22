import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import PartnerBadge from "@/components/PartnerBadge";
import { getPartners } from "@/lib/partners";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Partners",
  description: "Preferred services we can introduce families to (only verified partners are shown publicly).",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  const items = getPartners();

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/partners", name: "Partners", description: "Preferred services we can introduce families to." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Partners</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Preferred partners & services</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            We only show <strong>✔ VERIFIED</strong> partners publicly. If a partner is still “★ CHECK”, it stays hidden until agreements, vetting, and tracking are in place.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          <DisclosureNotice />

          <div style={{ marginTop: 18 }} className="grid2">
            {items.map((p) => (
              <div key={p.slug} className="card">
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <PartnerBadge status={p.status} />
                  <span className="badge accent">{p.category}</span>
                </div>
                <h3 style={{ marginTop: 12, marginBottom: 8 }}>{p.name}</h3>
                {p.bestFor ? <p style={{ marginTop: 0, color: "var(--muted)" }}><strong>Best for:</strong> {p.bestFor}</p> : null}
                {p.services?.length ? (
                  <div style={{ marginTop: 10, color: "var(--muted)" }}>
                    <strong>Services:</strong> {p.services.join(", ")}
                  </div>
                ) : null}
                {p.languages?.length ? (
                  <div style={{ marginTop: 10, color: "var(--muted)" }}>
                    <strong>Languages:</strong> {p.languages.join(", ")}
                  </div>
                ) : null}

                <div className="btnRow">
                  <a className="button primary" href={`/go/${p.slug}?from=${encodeURIComponent("/partners")}`} data-track="partner_go" data-partner={p.slug}>
                    Visit (tracked)
                  </a>
                  <a className="button secondary" href={`/contact?topic=${encodeURIComponent(p.category)}%20intro&partner=${encodeURIComponent(p.slug)}&from=${encodeURIComponent("/partners")}`} data-track="partner_intro" data-partner={p.slug}>
                    Request intro
                  </a>
                </div>

                {p.note ? <div style={{ marginTop: 12, fontSize: 13, color: "var(--muted)" }}>{p.note}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
