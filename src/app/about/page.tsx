import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description: "What this site is, how we write, and how to get help moving to Bali with kids.",
  alternates: { canonical: "/about" },
};

const LAST_UPDATED = "2026-02-22";

export default function AboutPage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/about", name: "About", description: "About Moving to Bali with Kids — by Empathy School." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 18px 0" }}>
        <div className="container">
          <div className="badge">About</div>
          <h1 className="h1" style={{ marginTop: 12 }}>About this guide</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            <strong>Moving to Bali with Kids</strong> is a practical, parent-first content hub—built to reduce overwhelm and help families make good decisions.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container" style={{ display: "grid", gap: 18 }}>
          <div className="card">
            <strong>What you’ll find here</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <ul>
                <li><strong>Pillars</strong> that map the big topics (visas, housing, areas, costs, family life).</li>
                <li><strong>Guides</strong> for the decisions that usually block families from moving forward.</li>
                <li><strong>Resources</strong> you can copy/paste and reuse (checklists, templates, planners).</li>
                <li><strong>Official links</strong> so you can verify anything that matters.</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <strong>How we write (editorial policy)</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <ul>
                <li>We write for parents and long-term families (not “digital nomad hype”).</li>
                <li>We prefer concrete steps, trade-offs, and checklists over generic advice.</li>
                <li>When something is time-sensitive (especially visas), we point you to official sources.</li>
                <li>This site is not immigration, legal, medical, or tax advice.</li>
              </ul>
              <p style={{ marginTop: 12 }}>
                If you spot something outdated, please <a href="/contact?topic=Correction">message us</a> and include the page URL.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Connection to Empathy School</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                This guide is published by <a href="https://empathy.school" target="_blank" rel="noreferrer">Empathy School</a>.
                We built it because many families considering Bali have the same questions—especially around learning, community, and day-to-day logistics.
              </p>
              <p>
                You can explore the school here: <a href="https://empathy.school" target="_blank" rel="noreferrer">empathy.school</a>.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Partner links & intros</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                Some pages include partner links (for example: visa agents, housing support, or services families often need).
                If you contact a partner through our site, we may receive a referral fee at no extra cost to you.
              </p>
              <p>
                Read the full policy on the <a href="/disclosure">Disclosure</a> page, or browse the public list on <a href="/partners">Partners</a>.
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
