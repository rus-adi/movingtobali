import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import PartnerBadge from "@/components/PartnerBadge";
import RichTextBlock from "@/components/RichTextBlock";
import { getPartners } from "@/lib/partners";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { buildContactHref } from "@/lib/contact";
import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

export function generateMetadata(): Metadata {
  const items = getPartners();
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
  const featured = items[0] || null;

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
            We keep the public partner list intentionally narrow. Right now the featured public partner is Gaia Group for housing support.
          </p>

          {featured ? (
            <div className={`${cardCls} mt-8`}>
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <PartnerBadge status={featured.status} />
                    <span className={badgeAccent}>{featured.category}</span>
                    {featured.contactName ? <span className={badge}>Contact: {featured.contactName}</span> : null}
                  </div>

                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900">{featured.name}</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">{featured.bestFor}</p>

                  {featured.services?.length ? (
                    <div className="mt-5 text-sm leading-6 text-gray-600">
                      <strong className="font-semibold text-gray-900">Services:</strong> {featured.services.join(", ")}
                    </div>
                  ) : null}

                  {featured.areas?.length ? (
                    <div className="mt-3 text-sm leading-6 text-gray-600">
                      <strong className="font-semibold text-gray-900">Areas:</strong> {featured.areas.join(", ")}
                    </div>
                  ) : null}

                  <div className={btnRow}>
                    <a
                      className={buttonPrimary}
                      href={buildContactHref("Housing intro", { from: "/partners", partner: featured.slug })}
                      data-track="partners_featured_intro"
                    >
                      Request a housing intro
                    </a>
                    <Link className={buttonSecondary} href="/gaia-group" data-track="partners_featured_profile">
                      Open Gaia Group page
                    </Link>
                    <Link className={buttonSecondary} href="/guides/how-gaia-group-housing-support-works" data-track="partners_featured_process">
                      How the process works
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {featured.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.image}
                      alt={featured.contactName ? `${featured.contactName} from ${featured.name}` : featured.name}
                      className="h-64 w-full rounded-2xl border border-gray-200 bg-white object-cover"
                    />
                  ) : null}

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm leading-6 text-gray-600">
                    <strong className="font-semibold text-gray-900">What this is for</strong>
                    <p className="mt-3">
                      A calmer housing start. Not a giant directory, not pressure to commit fast, and not a replacement for your own due diligence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10">

          <TrustMetaStrip
            updated="2026-03-22"
            title="Why the public partner list stays intentionally narrow"
            body="This page is designed to build trust, not volume. Right now the site publicly features Gaia Group for housing because we would rather keep the partner layer selective and usable than let it become a vague directory."
            links={[
              { href: "/disclosure", label: "Disclosure" },
              { href: "/gaia-group", label: "Open Gaia Group" },
            ]}
          />

          {featured ? (
            <>
              <div className={grid3}>
                <div className={cardCls}>
                  <strong className="text-sm font-semibold text-gray-900">Why families use Gaia Group</strong>
                  <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
                    {(featured.trustPoints || []).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className={cardCls}>
                  <strong className="text-sm font-semibold text-gray-900">Good fit</strong>
                  <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
                    {(featured.goodFit || []).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className={cardCls}>
                  <strong className="text-sm font-semibold text-gray-900">Probably not the right fit</strong>
                  <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
                    {(featured.notFor || []).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={grid2}>
                <Link className={cardCls} href="/housing-intro-readiness" data-track="partners_readiness_tool">
                  <h3 className="text-xl font-semibold tracking-tight text-gray-900">Housing intro readiness</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">Use the filter before you request an intro so Gaia Group starts with a real shortlist instead of a wide-open wish list.</p>
                  <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
                </Link>
                <Link className={cardCls} href="/housing-brief-builder" data-track="partners_brief_tool">
                  <h3 className="text-xl font-semibold tracking-tight text-gray-900">Housing brief builder</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">Create the first housing message around budget band, bedrooms, shortlist, commute, and dealbreakers.</p>
                  <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
                </Link>
              </div>

              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">How the intro usually works</strong>
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {(featured.process || []).map((step, index) => (
                    <div key={step} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <div className={badgeAccent}>Step {index + 1}</div>
                      <p className="mt-4 text-sm leading-6 text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
                <div className={btnRow}>
                  <Link className={buttonSecondary} href="/housing-brief-builder" data-track="partners_housing_brief_builder">
                    Open the housing brief builder
                  </Link>
                  <a
                    className={buttonPrimary}
                    href={buildContactHref("Housing intro", { from: "/partners", partner: featured.slug })}
                    data-track="partners_housing_intro_process"
                  >
                    Send the intro request
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">Partners directory is being built</strong>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                We’re intentionally slow here. For visas and housing especially, we only publish partners once vetting and tracking are in place.
              </p>
              <div className={btnRow}>
                <a className={buttonPrimary} href={buildContactHref("General move planning", { from: "/partners" })} data-track="partners_request_intro_empty">
                  Ask a question
                </a>
                <Link className={buttonSecondary} href="/disclosure" data-track="partners_disclosure">
                  Disclosure
                </Link>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
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

          <div className="mt-2">
            <DisclosureNotice />
          </div>
        </div>
      </section>
    </main>
  );
}
