import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import ParentVoiceStrip from "@/components/ParentVoiceStrip";
import LearnedHardWay from "@/components/LearnedHardWay";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import { buildWebPageSchema } from "@/lib/schema";
import { getHardLessons, getScenarioVoices } from "@/lib/proof";
import { badgeAccent, cardCls, grid2 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "What families notice",
  description: "Composite family stories, recurring patterns, and practical lessons that make Bali move decisions feel more real.",
  alternates: { canonical: "/what-families-notice" },
};

const LAST_UPDATED = "2026-03-22";

const storyCards = [
  {
    href: "/blog/a-10-day-test-stay-what-a-composite-family-learned",
    title: "A 10-day test stay: what a composite family learned",
    body: "A slower test stay story about why one ordinary afternoon created more clarity than a packed itinerary.",
  },
  {
    href: "/blog/the-school-run-that-changed-an-area-shortlist",
    title: "The school run that changed an area shortlist",
    body: "A composite family story about how commute energy shifted an online shortlist into a real one.",
  },
  {
    href: "/blog/when-housing-stopped-being-about-pretty-photos",
    title: "When housing stopped being about pretty photos",
    body: "A composite family story about why the weekly system mattered more than the first villa impression.",
  },
  {
    href: "/blog/what-a-rainy-week-taught-one-family-about-routine",
    title: "What a rainy week taught one family about routine",
    body: "A composite story about defaults, indoor backups, and why daily life often decides the move more than the dream does.",
  },
  {
    href: "/guides/questions-parents-actually-ask-before-moving-to-bali",
    title: "Questions parents actually ask before moving to Bali",
    body: "A practical guide built around the questions families keep returning to when the move starts to feel real.",
  },
  {
    href: "/video-recaps",
    title: "Video recaps hub",
    body: "Written-first recaps of owned Empathy School media: founder story, tours, community clips, camp, culture, and budgeting shorts.",
  },
  {
    href: "/blog/video-recap-community-life-around-empathy-school",
    title: "Community life around Empathy School",
    body: "A practical proof page built from owned media: why belonging usually grows through repetition, not instant connection.",
  },
];

export default function WhatFamiliesNoticePage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/what-families-notice",
          name: "What families notice",
          description: "Composite family stories and recurring lessons for families moving to Bali with kids.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Trust & proof</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            What families tend to notice once Bali becomes a real week.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            This page is intentionally honest: these are composite family scenarios and recurring patterns, not verbatim testimonials.
            The goal is to make decisions feel more concrete without pretending certainty or inventing proof we do not have.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <TrustMetaStrip
            updated={LAST_UPDATED}
            title="Why this proof layer is built this way"
            body="We want the site to feel more lived-in and more useful, but not at the cost of honesty. Until direct parent testimonials are gathered and approved, this hub uses composite family scenarios drawn from recurring questions, move patterns, and practical lessons around Empathy School."
            links={[
              { href: "/disclosure", label: "Disclosure" },
              { href: "/start-here", label: "Start here" },
              { href: "/video-recaps", label: "Video recaps" },
            ]}
          />
        </div>
      </section>

      <Section
        id="stories"
        title="Composite family stories"
        lead="Use these like mirrors, not promises. The value is in seeing which pattern feels close to your real family."
        tone="default"
      >
        <div className={grid2}>
          {storyCards.map((card) => (
            <Link key={card.href} href={card.href} className={cardCls} data-track="families_notice_story_open">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{card.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        id="planning"
        title="Planning and test-stay patterns"
        lead="The first trust gain usually comes from making the move smaller and more testable."
        tone="muted"
      >
        <div className="grid gap-10">
          <ParentVoiceStrip voices={getScenarioVoices("planning")} />
          <ParentVoiceStrip voices={getScenarioVoices("test-stay")} title="What families notice on a useful test stay" />
          <LearnedHardWay items={getHardLessons("planning")} />
        </div>
      </Section>

      <Section
        id="areas-housing"
        title="Area and housing patterns"
        lead="This is where online certainty tends to break down — and where the right questions become more valuable than more listings."
        tone="default"
      >
        <div className="grid gap-10">
          <ParentVoiceStrip voices={getScenarioVoices("areas")} title="What families notice when areas stop being abstract" />
          <ParentVoiceStrip voices={getScenarioVoices("housing")} title="What families notice once housing joins the weekly system" />
          <LearnedHardWay items={getHardLessons("housing")} title="What housing taught us the hard way" />
        </div>
      </Section>

      <Section
        id="school-daily-life"
        title="School and daily-life patterns"
        lead="Some of the clearest proof comes from ordinary friction: school runs, rainy afternoons, and a child who is tired by pickup time."
        tone="muted"
      >
        <div className="grid gap-10">
          <ParentVoiceStrip voices={getScenarioVoices("schools")} title="What families notice when Empathy School becomes part of the decision" />
          <ParentVoiceStrip voices={getScenarioVoices("daily-life")} title="What families notice when Bali becomes daily life" />
          <LearnedHardWay items={getHardLessons("daily-life")} title="What daily life taught us the hard way" />
        </div>
      </Section>
    </main>
  );
}
