import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import PartnerBadge from "@/components/PartnerBadge";
import RichTextBlock from "@/components/RichTextBlock";
import { getPartners } from "@/lib/partners";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2 } from "@/components/ui/styles";

export function generateMetadata(): Metadata {
  const items = getPartners();
  // If we don’t have any verified/owned partners yet, keep this page out of search until it’s useful.
  const noindex = process.env.NODE_ENV === "production" && items.length === 0;

  return {
    title: "Partners",
    description: "Preferred services we can introduce families to (only verified partners are shown publicly).",
    alternates: { canonical: "/partners" },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

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

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Partners</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Preferred partners & services</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
            We only show <strong>✔ VERIFIED</strong> partners publicly. If a partner is still “★ CHECK”, it stays hidden until agreements, vetting, and tracking are in place.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <DisclosureNotice />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">How to choose a visa agent safely</strong>
              <RichTextBlock className="mt-4">
                <ul>
                  <li>Ask for a written checklist + written fee breakdown.</li>
                  <li>Avoid “guaranteed approval” language.</li>
                  <li>Request receipts + proof of submission.</li>
                  <li>Confirm anything changeable via our <a href="/official-links">Official links</a> page.</li>
                </ul>
              </RichTextBlock>
              <div className={btnRow}>
                <Link className={buttonPrimary} href="/guides/how-to-choose-a-visa-agent" data-track="partners_safe_visas_guide">
                  Read: choose an agent
                </Link>
                <Link className={buttonSecondary} href="/resources/visa-agent-comparison-template" data-track="partners_safe_visas_template">
                  Copy: comparison template
                </Link>
              </div>
            </div>

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">How to rent safely (deposits + contracts)</strong>
              <RichTextBlock className="mt-4">
                <ul>
                  <li>Do a short stay first if you can, then view in person.</li>
                  <li>Verify who owns the property (or who legally represents the owner).</li>
                  <li>Clarify what’s included (electricity, internet, cleaning, maintenance).</li>
                  <li>Never let urgency override verification.</li>
                </ul>
              </RichTextBlock>
              <div className={btnRow}>
                <Link className={buttonPrimary} href="/guides/renting-safely-in-bali" data-track="partners_safe_housing_guide">
                  Read: renting safely
                </Link>
                <Link className={buttonSecondary} href="/resources/lease-deposit-checklist" data-track="partners_safe_housing_checklist">
                  Copy: lease checklist
                </Link>
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className={`${cardCls} mt-10`}>
              <strong className="text-sm font-semibold text-gray-900">Partners directory is being built</strong>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                We’re intentionally slow here. For visas and housing especially, we only publish partners once vetting and tracking are in place.
                If you need help now, request an introduction and we’ll point you to the best option we know for your situation.
              </p>
              <div className={btnRow}>
                <a
                  className={buttonPrimary}
                  href={`/contact?topic=${encodeURIComponent("Partner intro")}&from=${encodeURIComponent("/partners")}`}
                  data-track="partners_request_intro_empty"
                >
                  Request an intro
                </a>
                <Link className={buttonSecondary} href="/disclosure" data-track="partners_disclosure">
                  Disclosure
                </Link>
              </div>
            </div>
          ) : (
            <div className={`${grid2} mt-10`}>
              {items.map((p) => (
                <div key={p.slug} className={cardCls}>
                  <div className="flex flex-wrap items-center gap-2">
                    <PartnerBadge status={p.status} />
                    <span className={badgeAccent}>{p.category}</span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">{p.name}</h3>

                  {p.bestFor ? (
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      <strong className="font-semibold text-gray-900">Best for:</strong> {p.bestFor}
                    </p>
                  ) : null}

                  {p.services?.length ? (
                    <div className="mt-3 text-sm leading-6 text-gray-600">
                      <strong className="font-semibold text-gray-900">Services:</strong> {p.services.join(", ")}
                    </div>
                  ) : null}

                  {p.languages?.length ? (
                    <div className="mt-3 text-sm leading-6 text-gray-600">
                      <strong className="font-semibold text-gray-900">Languages:</strong> {p.languages.join(", ")}
                    </div>
                  ) : null}

                  <div className={btnRow}>
                    <a
                      className={buttonPrimary}
                      href={`/go/${p.slug}?from=${encodeURIComponent("/partners")}`}
                      data-track="partner_go"
                      data-partner={p.slug}
                    >
                      Visit (tracked)
                    </a>
                    <a
                      className={buttonSecondary}
                      href={`/contact?topic=${encodeURIComponent(p.category)}%20intro&partner=${encodeURIComponent(p.slug)}&from=${encodeURIComponent("/partners")}`}
                      data-track="partner_intro"
                      data-partner={p.slug}
                    >
                      Request intro
                    </a>
                  </div>

                  {p.note ? <div className="mt-4 text-xs leading-5 text-gray-600">{p.note}</div> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
