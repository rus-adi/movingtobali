import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import PartnerBadge from "@/components/PartnerBadge";
import RichTextBlock from "@/components/RichTextBlock";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, cardCls } from "@/components/ui/styles";

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

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Disclosure</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Partner links & editorial independence</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
            Transparency builds trust. Here’s exactly how partner links work on this site.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6">
          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Partner links</strong>
            <RichTextBlock className="mt-4">
              <p>
                Some links on this site may be partner links. If you choose to contact a partner through our site,
                we may receive a referral fee at no extra cost to you.
              </p>
              <p>
                We aim to recommend partners only when we believe they’re aligned with families, but you should always do your own due diligence.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">How we label partners</strong>
            <RichTextBlock className="mt-4">
              <p>We use simple labels to make status obvious:</p>
              <div className="flex flex-wrap items-center gap-3">
                <PartnerBadge status="owned" /> <span className="text-gray-600">Owned or operated by Empathy School.</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <PartnerBadge status="verified" /> <span className="text-gray-600">Vetted and approved to be shown publicly.</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <PartnerBadge status="check" /> <span className="text-gray-600">Still under review — hidden on the public site.</span>
              </div>
              <p>
                You can see the public list on <a href="/partners">Partners</a>.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Editorial policy</strong>
            <RichTextBlock className="mt-4">
              <ul>
                <li>We write content to help families first.</li>
                <li>We link to official sources when accuracy matters (especially visas).</li>
                <li>We do not guarantee outcomes (visas approvals, rental availability, pricing, etc.).</li>
                <li>Partners do not control our editorial decisions.</li>
              </ul>
              <p>
                If you’d like to suggest a partner or report a bad experience, contact us via <a href="/contact?topic=Partner%20feedback">Contact</a>.
              </p>
            </RichTextBlock>
          </div>

          <div className="text-xs text-gray-500">Last updated: {LAST_UPDATED}</div>
        </div>
      </section>
    </main>
  );
}
