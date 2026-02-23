import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import RichTextBlock from "@/components/RichTextBlock";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, cardCls } from "@/components/ui/styles";

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

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>About</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">About this guide</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
            <strong>Moving to Bali with Kids</strong> is a practical, parent-first content hub—built to reduce overwhelm and help families make good decisions.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6">
          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">What you’ll find here</strong>
            <RichTextBlock className="mt-4">
              <ul>
                <li><strong>Pillars</strong> that map the big topics (visas, housing, areas, costs, family life).</li>
                <li><strong>Guides</strong> for the decisions that usually block families from moving forward.</li>
                <li><strong>Resources</strong> you can copy/paste and reuse (checklists, templates, planners).</li>
                <li><strong>Official links</strong> so you can verify anything that matters.</li>
              </ul>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">How we write (editorial policy)</strong>
            <RichTextBlock className="mt-4">
              <ul>
                <li>We write for parents and long-term families (not “digital nomad hype”).</li>
                <li>We prefer concrete steps, trade-offs, and checklists over generic advice.</li>
                <li>When something is time-sensitive (especially visas), we point you to official sources.</li>
                <li>This site is not immigration, legal, medical, or tax advice.</li>
              </ul>
              <p>
                If you spot something outdated, please <a href="/contact?topic=Correction">message us</a> and include the page URL.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Connection to Empathy School</strong>
            <RichTextBlock className="mt-4">
              <p>
                This guide is published by <a href="https://empathy.school" target="_blank" rel="noreferrer">Empathy School</a>.
                We built it because many families considering Bali have the same questions—especially around learning, community, and day-to-day logistics.
              </p>
              <p>
                You can explore the school here: <a href="https://empathy.school" target="_blank" rel="noreferrer">empathy.school</a>.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Partner links & intros</strong>
            <RichTextBlock className="mt-4">
              <p>
                Some pages include partner links (for example: visa agents, housing support, or services families often need).
                If you contact a partner through our site, we may receive a referral fee at no extra cost to you.
              </p>
              <p>
                Read the full policy on the <a href="/disclosure">Disclosure</a> page, or browse the public list on <a href="/partners">Partners</a>.
              </p>
            </RichTextBlock>
          </div>

          <div className="text-xs text-gray-500">Last updated: {LAST_UPDATED}</div>
        </div>
      </section>
    </main>
  );
}
