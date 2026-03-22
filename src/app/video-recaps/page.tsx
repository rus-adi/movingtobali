import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import { buildContactHref } from "@/lib/contact";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Video recaps",
  description: "Written-first recaps of owned videos and clips from Empathy School: tours, camps, family rhythm, and how to watch them like a parent.",
  alternates: { canonical: "/video-recaps" },
};

type Card = { href: string; title: string; body: string; kicker: string };

const schoolCards: Card[] = [
  {
    href: "/blog/video-how-we-run-a-school-tour",
    title: "How we run an Empathy School tour",
    body: "The main tour recap: campus flow, adult presence, and whether the school should change your area or commute decisions.",
    kicker: "School tours",
  },
  {
    href: "/blog/empathy-school-early-years-tour-recap",
    title: "Early Years tour recap",
    body: "A smaller-child lens: emotional temperature, transition support, sensory load, and what real fit looks like.",
    kicker: "Early Years",
  },
  {
    href: "/blog/empathy-school-primary-tour-recap",
    title: "Primary tour recap",
    body: "A parent lens on independence, adult support, and whether the school would simplify or complicate the family week.",
    kicker: "Primary",
  },
  {
    href: "/blog/empathy-school-middle-school-tour-recap",
    title: "Middle School tour recap",
    body: "A fit lens for older children: dignity, belonging, agency, and whether the wider Bali lifestyle also works.",
    kicker: "Middle School",
  },
];

const lifeCards: Card[] = [
  {
    href: "/blog/empathy-school-summer-camp-highlights-recap",
    title: "Summer camp highlights recap",
    body: "A practical recap of the camp highlight reel with a test-stay lens: pace, supervision, and whether camp would actually calm the week.",
    kicker: "Camp",
  },
  {
    href: "/blog/empathy-school-nature-camp-day-recap",
    title: "Nature camp day recap",
    body: "A more specific camp lens: outdoor rhythm, energy level, and how to judge fit for your actual child.",
    kicker: "Outdoor camp",
  },
  {
    href: "/guides/ubud-side-family-rhythm-video-recap",
    title: "What an Ubud-side family rhythm can feel like",
    body: "A rhythm walkthrough, not just an area walkthrough. Useful when families are trying to picture repeated places and a softer weekly tempo.",
    kicker: "Area rhythm",
  },
  {
    href: "/blog/video-recap-what-a-calmer-home-base-in-bali-feels-like",
    title: "What a calmer home base in Bali feels like",
    body: "A recap built around lifestyle clips that help families notice what kind of weekly radius they are actually drawn to.",
    kicker: "Home base",
  },
];


const proofCards: Card[] = [
  {
    href: "/blog/founder-story-why-bali-became-home",
    title: "Founder recap: why Bali became home",
    body: "A written-first recap of the founder story video and why calmer sequencing usually beats trying to solve the whole move in one go.",
    kicker: "Founder story",
  },
  {
    href: "/blog/video-recap-education-budgets-and-school-fees",
    title: "Education budgets and school fees",
    body: "A parent-first recap of the budget short: why education shifts the whole monthly picture once Empathy School becomes part of the week.",
    kicker: "Budget short",
  },
  {
    href: "/blog/video-recap-community-life-around-empathy-school",
    title: "Community life around Empathy School",
    body: "A practical reading of the volunteering clip and what it teaches families about anchors, repetition, and first-month belonging.",
    kicker: "Community glimpse",
  },
  {
    href: "/blog/video-recap-culture-bridges-for-kids",
    title: "A gentle culture bridge for kids",
    body: "A recap of the Cicak Cicak clip and why small cultural bridges can help children feel welcomed without pressure.",
    kicker: "Culture bridge",
  },
];

const housingCards: Card[] = [
  {
    href: "/guides/housing-clip-recap-what-pretty-bali-home-videos-dont-answer",
    title: "What pretty Bali home videos do not answer",
    body: "A housing-media guide for families who need to keep beautiful footage from outrunning clarity about radius, noise, airflow, and the real week.",
    kicker: "Housing clips",
  },
  {
    href: "/housing",
    title: "Housing pillar",
    body: "Use the main housing system once the clips have helped you see direction but not yet make a decision.",
    kicker: "Next step",
  },
];

export default function VideoRecapsPage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({
      pathname: "/video-recaps",
      name: "Video recaps",
      description: "Written-first recaps of owned videos and clips from Empathy School.",
    }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Media hub</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Video recaps for parents who need more than vibe.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            Every page here follows the same rule: written answer first, media second. The goal is to help families use tours,
            camp clips, and daily-life footage as decision tools instead of letting good footage create false certainty.
          </p>
          <div className={btnRow + " mt-8"}>
            <a className={buttonPrimary} href="/plan-your-move" data-track="video_recaps_hero_plan">
              Plan your move
            </a>
            <a className={buttonSecondary} href="/schools" data-track="video_recaps_hero_school">
              Explore Empathy School
            </a>
            <a className={buttonSecondary} href={buildContactHref("General move planning", { from: "/video-recaps" })} data-track="video_recaps_hero_contact">
              Ask a question
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <TrustMetaStrip
            updated="2026-03-22"
            title="How this media section works"
            body="These pages are intentionally written-first. Some use a full YouTube embed with a detailed recap. Others use supporting clips and still turn them into a practical answer. The point is not more content. It is better decisions."
            links={[
              { href: "/disclosure", label: "Disclosure" },
              { href: "/what-families-notice", label: "What families notice" },
            ]}
          />
        </div>
      </section>

      <Section
        id="school"
        title="Use school videos like a parent, not a browser"
        lead="The most useful school videos change your questions. They should sharpen fit, commute, and weekly-rhythm decisions."
        tone="default"
      >
        <div className={grid2}>
          {schoolCards.map((card) => (
            <Link key={card.href} href={card.href} className={cardCls} data-track="video_recaps_school_open">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{card.kicker}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{card.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open recap →</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="camp-and-rhythm"
        title="Camp, daily life, and area-rhythm recaps"
        lead="These pages help families use short media clips to picture the ordinary week more accurately."
        tone="muted"
      >
        <div className={grid2}>
          {lifeCards.map((card) => (
            <Link key={card.href} href={card.href} className={cardCls} data-track="video_recaps_life_open">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{card.kicker}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{card.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open recap →</div>
            </Link>
          ))}
        </div>
      </Section>


      <Section
        id="founder-community"
        title="Founder, budget, community, and culture clips"
        lead="These recaps widen the media lane beyond tours. They help families use owned Empathy School media as proof, context, and practical decision support."
        tone="muted"
      >
        <div className={grid2}>
          {proofCards.map((card) => (
            <Link key={card.href} href={card.href} className={cardCls} data-track="video_recaps_proof_open">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{card.kicker}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{card.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open recap →</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="housing"
        title="Housing and home-base media"
        lead="This is where families most need help separating useful direction from aesthetic overconfidence."
        tone="default"
      >
        <div className={grid2}>
          {housingCards.map((card) => (
            <Link key={card.href} href={card.href} className={cardCls} data-track="video_recaps_housing_open">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{card.kicker}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{card.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open page →</div>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
