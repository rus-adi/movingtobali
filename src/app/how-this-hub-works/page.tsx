import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import HubMetricsStrip from "@/components/HubMetricsStrip";
import MovePhasesBand from "@/components/MovePhasesBand";
import BundleStrip from "@/components/BundleStrip";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import { buildContactHref } from "@/lib/contact";
import { getHubBundles, getHubCounts, getMovePhases } from "@/lib/hub";
import {
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
} from "@/lib/schema";
import {
  badgeAccent,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  grid2,
} from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "How this hub works",
  description:
    "A guide to how the Move to Bali hub is structured: planning order, trust rules, and how Empathy School and Gaia Group fit into the system.",
  alternates: { canonical: "/how-this-hub-works" },
};

export default function HowThisHubWorksPage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({
      pathname: "/how-this-hub-works",
      name: "How this hub works",
      description:
        "A guide to how the Move to Bali hub is structured for families.",
    }),
  ];

  const metrics = getHubCounts();
  const phases = getMovePhases();
  const bundles = getHubBundles();

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Orientation page</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            A bigger hub only helps if it still feels calm.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            This page explains the logic behind the site: the order of
            decisions, the trust rules, and why Empathy School and Gaia Group
            sit inside the hub the way they do.
          </p>
          <div className={btnRow + " mt-8"}>
            <a
              className={buttonPrimary}
              href="/plan-your-move"
              data-track="hub_works_hero_plan"
            >
              Plan your move
            </a>
            <a
              className={buttonSecondary}
              href={buildContactHref("General move planning", {
                from: "/how-this-hub-works",
              })}
              data-track="hub_works_hero_contact"
            >
              Ask a planning question
            </a>
          </div>
        </div>
      </section>

      <Section
        id="counts"
        title="What sits inside the hub now"
        lead="The point is not to feel vast for the sake of it. The point is to have enough depth that a family can move from curiosity to action without feeling dropped into a maze."
        tone="default"
      >
        <HubMetricsStrip
          metrics={metrics}
          title="The size is now real — and more structured"
          lead="This build pass focused on making the whole site feel richer, more coherent, and more premium without drifting into generic Bali-blog sprawl."
        />
      </Section>

      <Section
        id="sequence"
        title="How the site wants families to move through it"
        lead="The site works best when each page makes the next decision clearer. It works worst when every page feels equally urgent."
        tone="muted"
      >
        <MovePhasesBand phases={phases} />
      </Section>

      <Section
        id="bundles"
        title="The strongest page bundles"
        lead="Most families do not use one page at a time. They use a few pages together until the decision sharpens."
        tone="default"
      >
        <BundleStrip bundles={bundles} />
      </Section>

      <Section
        id="rules"
        title="The trust rules behind the build"
        lead="These rules keep the site from becoming thin, noisy, or overconfident as it grows."
        tone="muted"
      >
        <div className={grid2}>
          {[
            [
              "Empathy School stays the only school anchor",
              "We can talk about schooling and school-fit decisions, but this hub does not turn into a generic school directory or a broad school-comparison site.",
            ],
            [
              "Gaia Group stays the only public housing partner",
              "The housing lane is intentionally narrow so the site feels guided and trustworthy, not like a crowded referral marketplace.",
            ],
            [
              "Composite proof beats fake testimonials",
              "When we do not have approved parent quotes, we use clearly labeled composite family scenarios instead of pretending a voice is direct when it is not.",
            ],
            [
              "Utility beats filler",
              "Every new page, tool, resource, or recap should reduce uncertainty, increase trust, or make the next step more obvious for a real family.",
            ],
          ].map(([title, body]) => (
            <div key={title} className={cardCls}>
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="anchors"
        title="Why Empathy School and Gaia Group matter here"
        lead="These are not random promotions. They are the two most grounded anchors in the system."
        tone="default"
      >
        <div className={grid2}>
          <div className={cardCls}>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Empathy School
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              The school is not just another page. It is one of the strongest
              variables in the move because it can change area choice, weekly
              rhythm, commute tolerance, and what the first month feels like.
            </p>
            <div className={btnRow}>
              <a
                className={buttonPrimary}
                href="/schools"
                data-track="hub_works_school"
              >
                Open school planning guide
              </a>
              <a
                className={buttonSecondary}
                href="/empathy-school-fit"
                data-track="hub_works_school_fit"
              >
                Use school-fit tool
              </a>
            </div>
          </div>

          <div className={cardCls}>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Gaia Group
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Housing becomes much more useful once the family has a real brief.
              Gaia Group belongs later in the decision order, when the move
              shape is clear enough for a shortlist to actually help.
            </p>
            <div className={btnRow}>
              <a
                className={buttonPrimary}
                href="/gaia-group"
                data-track="hub_works_gaia"
              >
                Open Gaia Group page
              </a>
              <a
                className={buttonSecondary}
                href="/housing-intro-readiness"
                data-track="hub_works_gaia_readiness"
              >
                Check housing readiness
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="trust-meta"
        title="A premium feel without fake polish"
        lead="The site should feel thoughtful, calm, and high-trust. That comes from better structure and cleaner judgment, not from empty luxury language."
        tone="muted"
      >
        <TrustMetaStrip
          updated="2026-03-22"
          title="Why this page exists"
          body="As the hub gets bigger, orientation matters more. This page exists so the growth still feels coherent, human, and intentional instead of sprawling."
          links={[
            { href: "/editorial-standards", label: "Editorial standards" },
            { href: "/content-health", label: "Content health" },
          ]}
        />
      </Section>
    </main>
  );
}
