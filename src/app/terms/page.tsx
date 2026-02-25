import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import RichTextBlock from "@/components/RichTextBlock";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, cardCls } from "@/components/ui/styles";

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

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Terms</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Terms of Use</h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            By using this site, you agree to the terms below.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6">
          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Informational use only</strong>
            <RichTextBlock className="mt-4">
              <p>
                Content on this site is provided for informational purposes, based on experience and research.
                It is not immigration, legal, medical, or tax advice.
              </p>
              <p>
                Rules, pricing, and requirements can change. Always verify critical details with official sources and qualified professionals.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">No guarantees</strong>
            <RichTextBlock className="mt-4">
              <p>
                We do not guarantee outcomes such as visa approval, rental availability, school admissions, pricing, or service quality.
                You are responsible for your decisions and due diligence.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Partner links</strong>
            <RichTextBlock className="mt-4">
              <p>
                Some links may be partner links. If you contact a partner through our site, we may receive a referral fee at no extra cost to you.
                Read more on <a href="/disclosure">Disclosure</a>.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Copyright</strong>
            <RichTextBlock className="mt-4">
              <p>
                Unless otherwise noted, site content is owned by Empathy School or its licensors.
                You may share links and short excerpts with attribution.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Contact</strong>
            <RichTextBlock className="mt-4">
              <p>
                Questions? Use <a href="/contact?topic=Terms">Contact</a>.
              </p>
            </RichTextBlock>
          </div>

          <div className="text-xs text-gray-500">Last updated: {LAST_UPDATED}</div>
        </div>
      </section>
    </main>
  );
}
