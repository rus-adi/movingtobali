import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PartnerBadge from "@/components/PartnerBadge";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Disclosure",
  description: "How partner links work, how we label partners, and our editorial independence.",
  alternates: { canonical: "/disclosure" },
};

const LAST_UPDATED = "2026-02-22";

export default function DisclosurePage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/disclosure", name: "Disclosure", description: "Partner disclosure and editorial policy." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 18px 0" }}>
        <div className="container">
          <div className="badge">Disclosure</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Partner links & editorial independence</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Transparency builds trust. Here’s exactly how partner links work on this site.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container" style={{ display: "grid", gap: 18 }}>
          <div className="card">
            <strong>Partner links</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                Some links on this site may be partner links. If you choose to contact a partner through our site,
                we may receive a referral fee at no extra cost to you.
              </p>
              <p>
                We aim to recommend partners only when we believe they’re aligned with families, but you should always do your own due diligence.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>How we label partners</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>We use simple labels to make status obvious:</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <PartnerBadge status="owned" /> <span style={{ color: "var(--muted)" }}>Owned or operated by Empathy School.</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <PartnerBadge status="verified" /> <span style={{ color: "var(--muted)" }}>Vetted and approved to be shown publicly.</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <PartnerBadge status="check" /> <span style={{ color: "var(--muted)" }}>Still under review — hidden on the public site.</span>
              </div>
              <p style={{ marginTop: 12 }}>
                You can see the public list on <a href="/partners">Partners</a>.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Editorial policy</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <ul>
                <li>We write content to help families first.</li>
                <li>We link to official sources when accuracy matters (especially visas).</li>
                <li>We do not guarantee outcomes (visas approvals, rental availability, pricing, etc.).</li>
                <li>Partners do not control our editorial decisions.</li>
              </ul>
              <p>
                If you’d like to suggest a partner or report a bad experience, contact us via <a href="/contact?topic=Partner%20feedback">Contact</a>.
              </p>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Last updated: {LAST_UPDATED}
          </div>
        </div>
      </section>
    </main>
  );
}
