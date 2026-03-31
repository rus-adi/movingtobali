import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import DisclosureNotice from "@/components/DisclosureNotice";
import ParentVoiceStrip from "@/components/ParentVoiceStrip";
import LearnedHardWay from "@/components/LearnedHardWay";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import PartnerBadge from "@/components/PartnerBadge";
import { buildContactHref } from "@/lib/contact";
import { getHardLessons, getScenarioVoices } from "@/lib/proof";
import { getPartnerBySlug } from "@/lib/partners";
import { buildWebPageSchema } from "@/lib/schema";
import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Gaia Group",
  description: "A clearer profile of Gaia Group, the preferred public housing partner in the Move to Bali by Empathy School hub.",
  alternates: { canonical: "/gaia-group" },
};

export default function GaiaGroupPage() {
  const partner = getPartnerBySlug("gaia-group-bali");
  if (!partner) notFound();

  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/gaia-group",
          name: "Gaia Group",
          description: "Profile, fit, and process for the preferred housing partner featured by Empathy School.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className={cardCls}>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <Image src={partner.image || "/images/partners/pali-gaia-standin.svg"} alt={partner.contactName ? `${partner.contactName} from ${partner.name}` : partner.name} width={960} height={960} className="h-auto w-full" />
              </div>
            </div>

            <div className={cardCls}>
              <div className="flex flex-wrap items-center gap-2">
                <PartnerBadge status={partner.status} />
                <span className={badgeAccent}>Preferred housing partner</span>
                {partner.contactName ? <span className={badge}>Contact: {partner.contactName}</span> : null}
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Gaia Group for calmer family housing decisions</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
                This is the narrow housing lane inside the hub. Not a giant property portal. Not pressure to commit fast. A smaller,
                more grounded housing path once your timing, shortlist, and family brief are strong enough to make the conversation useful.
              </p>
              <p className="mt-4 text-sm leading-6 text-gray-700">{partner.bestFor}</p>
              <div className={btnRow}>
                <a className={buttonPrimary} href="/housing-intro-readiness" data-track="gaia_hero_readiness">
                  Check intro readiness
                </a>
                <a className={buttonSecondary} href="/housing-brief-builder" data-track="gaia_hero_brief">
                  Build the housing brief
                </a>
                <a className={buttonSecondary} href={buildContactHref("Housing intro", { from: "/gaia-group", partner: partner.slug })} data-track="gaia_hero_contact">
                  Request a housing intro
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="fit"
        title="Is Gaia Group the right lane for your family?"
        lead="The answer is usually yes only when your move has enough structure to produce a useful shortlist. That is what keeps the route premium rather than noisy."
        tone="default"
      >
        <div className={grid3}>
          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Best fit</strong>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
              {(partner.goodFit || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">What Gaia Group tends to help with</strong>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
              {(partner.services || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {partner.areas?.length ? (
              <p className="mt-4 text-sm leading-6 text-gray-700">
                <strong className="font-semibold text-gray-900">Usually strongest around:</strong> {partner.areas.join(", ")}
              </p>
            ) : null}
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Probably not the right fit yet</strong>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
              {(partner.notFor || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="before-intro"
        title="Use this order before you ask for an intro"
        lead="The site gets more useful when the housing conversation starts with signal instead of wish-list energy."
        tone="muted"
      >
        <div className={grid2}>
          {[
            ["/housing-intro-readiness", "Housing intro readiness", "Check whether your timing, area clarity, budget range, and verification posture are already strong enough."],
            ["/housing-brief-builder", "Housing brief builder", "Create the message you can actually send to Gaia Group once the move is grounded enough."],
            ["/guides/family-housing-styles-in-bali", "Family housing styles in Bali", "Choose the type of home that supports your week instead of defaulting to villa photos."],
            ["/resources/gaia-group-intro-checklist", "Gaia Group intro checklist", "Use a short checklist before you hit send so the first housing conversation starts well."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="process"
        title="How the Gaia Group path usually works"
        lead="The process should feel smaller, calmer, and more specific than normal Bali property hunting."
        tone="default"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(partner.process || []).map((step, index) => (
            <div key={step} className={cardCls}>
              <div className={badgeAccent}>Step {index + 1}</div>
              <p className="mt-4 text-sm leading-6 text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="why-narrow"
        title="Why this route stays narrow"
        lead="A broader partner marketplace would make the site bigger in the wrong way. This route is intentionally tighter so it keeps working for families."
        tone="muted"
      >
        <div className={grid2}>
          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">What this route is</strong>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
              {(partner.trustPoints || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">What this route is not</strong>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
              <li>It is not a public listings portal.</li>
              <li>It is not a promise that every property question disappears.</li>
              <li>It is not a substitute for reading contracts, verifying identity, or slowing down deposits.</li>
              <li>It is not a reason to skip area, budget, and weekday-rhythm thinking.</li>
            </ul>
          </div>
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/housing" data-track="gaia_housing_guide">
            Open housing guide
          </a>
          <a className={buttonSecondary} href="/guides/how-gaia-group-housing-support-works" data-track="gaia_process_guide">
            Read the process guide
          </a>
          <a className={buttonSecondary} href={buildContactHref("Housing intro", { from: "/gaia-group", partner: partner.slug })} data-track="gaia_bottom_contact">
            Request the intro
          </a>
        </div>
      </Section>

      <Section
        id="proof"
        title="What families notice in the housing lane"
        lead="This proof layer uses composite scenarios and recurring lessons so the page feels more grounded without inventing testimonials."
        tone="default"
      >
        <div className="grid gap-10">
          <TrustMetaStrip
            updated="2026-03-22"
            title="Why this housing route stays narrow"
            body="We would rather offer one clearer, more trustworthy housing lane than create a noisy partner marketplace. The point is a better intro, not more property browsing."
            links={[
              { href: "/disclosure", label: "Disclosure" },
              { href: "/housing-brief-builder", label: "Housing brief builder" },
            ]}
          />
          <ParentVoiceStrip
            title="What families notice once housing becomes real"
            lead="These composite scenarios reflect the move from listings and aesthetics into commute, budget, and real weekly use."
            voices={getScenarioVoices("housing")}
            ctaHref="/what-families-notice"
            ctaLabel="Browse the proof hub"
          />
          <LearnedHardWay
            title="What housing taught us the hard way"
            lead="Most housing mistakes happen when speed outruns verification."
            items={getHardLessons("housing")}
          />
        </div>
      </Section>

      <section className="pb-16 md:pb-24">
        <div className="container">
          <DisclosureNotice />
        </div>
      </section>
    </main>
  );
}
