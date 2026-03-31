import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import PartnerBadge from "@/components/PartnerBadge";
import RichTextBlock from "@/components/RichTextBlock";
import { getPartners } from "@/lib/partners";
import {
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
} from "@/lib/schema";
import { buildContactHref } from "@/lib/contact";
import {
  badge,
  badgeAccent,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  grid2,
} from "@/components/ui/styles";

export function generateMetadata(): Metadata {
  const items = getPartners();
  const noindex = process.env.NODE_ENV === "production" && items.length === 0;

  return {
    title: "Partners",
    description:
      "A clean directory of preferred services we can introduce families to (only verified partners are shown publicly).",
    alternates: { canonical: "/partners" },
    robots: noindex ? { index: false, follow: false } : undefined,
  };
}

const introSteps = [
  "You share the timing, area direction, and question you are trying to solve now.",
  "We confirm whether the partner is the right fit and whether they have capacity for your stage of the move.",
  "You still verify contracts, fees, terms, and any property details before you commit.",
];

export default function PartnersPage() {
  const items = getPartners();

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({
      pathname: "/partners",
      name: "Partners",
      description: "Preferred services we can introduce families to.",
    }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Partners</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Preferred partners & services
          </h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
            This page stays intentionally clean. The cards below are the
            directory layer; detailed background, fit notes, and process
            guidance live on each partner’s own page.
          </p>
          <div className="mt-8 max-w-4xl">
            <DisclosureNotice compact />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10">
          {items.length ? (
            <div className={grid2}>
              {items.map((partner) => (
                <div key={partner.slug} className={cardCls}>
                  <div className="flex flex-wrap items-center gap-2">
                    <PartnerBadge status={partner.status} />
                    <span className={badgeAccent}>{partner.category}</span>
                    {partner.contactName ? (
                      <span className={badge}>
                        Contact: {partner.contactName}
                      </span>
                    ) : null}
                  </div>

                  {partner.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={partner.image}
                      alt={
                        partner.contactName
                          ? `${partner.contactName} from ${partner.name}`
                          : partner.name
                      }
                      className="mt-6 h-56 w-full rounded-2xl border border-gray-200 bg-white object-cover"
                    />
                  ) : null}

                  <h2 className="mt-6 text-2xl font-semibold tracking-tight text-gray-900">
                    {partner.name}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {partner.bestFor}
                  </p>

                  {partner.services?.length ? (
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      <strong className="font-semibold text-gray-900">
                        Services:
                      </strong>{" "}
                      {partner.services.join(", ")}
                    </p>
                  ) : null}

                  {partner.areas?.length ? (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      <strong className="font-semibold text-gray-900">
                        Areas:
                      </strong>{" "}
                      {partner.areas.join(", ")}
                    </p>
                  ) : null}

                  {partner.note ? (
                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                      {partner.note}
                    </div>
                  ) : null}

                  <div className={btnRow}>
                    <a
                      className={buttonPrimary}
                      href={buildContactHref("Housing intro", {
                        from: "/partners",
                        partner: partner.slug,
                      })}
                      data-track="partners_card_intro"
                    >
                      Request an intro
                    </a>
                    <Link
                      className={buttonSecondary}
                      href="/gaia-group"
                      data-track="partners_card_profile"
                    >
                      Open partner page
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                Partners directory is being built
              </strong>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                We publish partners slowly. For visas and housing especially,
                only verified partners appear publicly once vetting and tracking
                are in place.
              </p>
              <div className={btnRow}>
                <a
                  className={buttonPrimary}
                  href={buildContactHref("General move planning", {
                    from: "/partners",
                  })}
                  data-track="partners_request_intro_empty"
                >
                  Ask a question
                </a>
                <Link
                  className={buttonSecondary}
                  href="/disclosure"
                  data-track="partners_disclosure"
                >
                  Disclosure
                </Link>
              </div>
            </div>
          )}

          <div className={grid2}>
            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                How introductions work
              </strong>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {introSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className={badgeAccent}>Step {index + 1}</div>
                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                What this page is for
              </strong>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                The directory page helps families see the available service
                quickly, understand the category, and choose whether to open the
                detailed partner page or request a warm intro. It is not meant
                to repeat the full partner profile below the cards.
              </p>
              <div className={btnRow}>
                <Link
                  className={buttonSecondary}
                  href="/gaia-group"
                  data-track="partners_directory_open_detail"
                >
                  Open Gaia Group details
                </Link>
                <a
                  className={buttonSecondary}
                  href={buildContactHref("Housing intro", {
                    from: "/partners",
                  })}
                  data-track="partners_directory_contact"
                >
                  Ask about an intro
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                How to choose a visa agent safely
              </strong>
              <RichTextBlock className="mt-4">
                <ul>
                  <li>Ask for a written checklist + written fee breakdown.</li>
                  <li>Avoid “guaranteed approval” language.</li>
                  <li>Request receipts + proof of submission.</li>
                  <li>
                    Confirm anything changeable via our{" "}
                    <a href="/official-links">Official links</a> page.
                  </li>
                </ul>
              </RichTextBlock>
              <div className={btnRow}>
                <Link
                  className={buttonPrimary}
                  href="/guides/how-to-choose-a-visa-agent"
                  data-track="partners_safe_visas_guide"
                >
                  Read: choose an agent
                </Link>
                <Link
                  className={buttonSecondary}
                  href="/resources/visa-agent-comparison-template"
                  data-track="partners_safe_visas_template"
                >
                  Copy: comparison template
                </Link>
              </div>
            </div>

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                How to rent safely (deposits + contracts)
              </strong>
              <RichTextBlock className="mt-4">
                <ul>
                  <li>
                    Do a short stay first if you can, then view in person.
                  </li>
                  <li>
                    Verify who owns the property (or who legally represents the
                    owner).
                  </li>
                  <li>
                    Clarify what’s included (electricity, internet, cleaning,
                    maintenance).
                  </li>
                  <li>Never let urgency override verification.</li>
                </ul>
              </RichTextBlock>
              <div className={btnRow}>
                <Link
                  className={buttonPrimary}
                  href="/guides/renting-safely-in-bali"
                  data-track="partners_safe_housing_guide"
                >
                  Read: renting safely
                </Link>
                <Link
                  className={buttonSecondary}
                  href="/resources/lease-deposit-checklist"
                  data-track="partners_safe_housing_checklist"
                >
                  Copy: lease checklist
                </Link>
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">
              Need a warm intro instead of browsing alone?
            </strong>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
              Tell us the part of the move that feels stuck. If a partner
              conversation would genuinely help, we can point you to the right
              page or request the introduction without turning the directory
              into a cluttered funnel.
            </p>
            <div className={btnRow}>
              <a
                className={buttonPrimary}
                href={buildContactHref("General move planning", {
                  from: "/partners",
                })}
                data-track="partners_contact_cta"
              >
                Ask a question
              </a>
              <Link
                className={buttonSecondary}
                href="/gaia-group"
                data-track="partners_cta_profile"
              >
                Open Gaia Group page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
