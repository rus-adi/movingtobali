import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and disclaimers for using movingtobali.empathy.school.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "2026-02-22";

export default function TermsPage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/terms", name: "Terms of Use", description: "Terms of Use for Moving to Bali with Kids." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 18px 0" }}>
        <div className="container">
          <div className="badge">Terms</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Terms of Use</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            By using this site, you agree to the terms below.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container" style={{ display: "grid", gap: 18 }}>
          <div className="card">
            <strong>Informational use only</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                Content on this site is provided for informational purposes, based on experience and research.
                It is not immigration, legal, medical, or tax advice.
              </p>
              <p>
                Rules, pricing, and requirements can change. Always verify critical details with official sources and qualified professionals.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>No guarantees</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                We do not guarantee outcomes such as visa approval, rental availability, school admissions, pricing, or service quality.
                You are responsible for your decisions and due diligence.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Partner links</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                Some links may be partner links. If you contact a partner through our site, we may receive a referral fee at no extra cost to you.
                Read more on <a href="/disclosure">Disclosure</a>.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Copyright</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                Unless otherwise noted, site content is owned by Empathy School or its licensors.
                You may share links and short excerpts with attribution.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Contact</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                Questions? Use <a href="/contact?topic=Terms">Contact</a>.
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
