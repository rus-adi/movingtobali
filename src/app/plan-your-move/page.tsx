import type { Metadata } from "next";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import ParentVoiceStrip from "@/components/ParentVoiceStrip";
import LearnedHardWay from "@/components/LearnedHardWay";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import HubMetricsStrip from "@/components/HubMetricsStrip";
import MovePhasesBand from "@/components/MovePhasesBand";
import BundleStrip from "@/components/BundleStrip";
import { buildContactHref } from "@/lib/contact";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { getHardLessons, getScenarioVoices } from "@/lib/proof";
import { getHubBundles, getHubCounts, getMovePhases } from "@/lib/hub";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

type Card = { title: string; body: string; href: string; track: string; kicker?: string };

const moveShapes: Card[] = [
  {
    title: "We are still exploring",
    body: "Use Bali like a decision, not a fantasy. Start with timeline, family readiness, two or three areas, and the simplest useful budget range.",
    href: "/start-here",
    track: "plan_shape_exploring",
    kicker: "Early-stage",
  },
  {
    title: "We want a test stay first",
    body: "This is often the cleanest route. Use a short stay to test area fit, weekday energy, Empathy School relevance, and what daily life actually costs.",
    href: "/test-stay",
    track: "plan_shape_test_stay",
    kicker: "Lower-risk",
  },
  {
    title: "School needs will shape the move",
    body: "If learning rhythm matters most, let Empathy School enter the plan early enough to change area, commute, and routine decisions.",
    href: "/empathy-school-fit",
    track: "plan_shape_school_first",
    kicker: "School-first",
  },
  {
    title: "Housing feels urgent",
    body: "Slow the process down just enough to avoid paying before your area, commute, and family needs are actually clear.",
    href: "/housing",
    track: "plan_shape_housing_first",
    kicker: "Housing",
  },
];

const tools: Card[] = [
  {
    title: "Move timeline",
    body: "Build a sequence that matches your timing and move shape so everything does not feel urgent at once.",
    href: "/move-timeline",
    track: "plan_tool_timeline",
  },
  {
    title: "Area Match",
    body: "Shortlist Bali by rhythm, commute tolerance, and the kind of family week you actually want.",
    href: "/area-match",
    track: "plan_tool_area_match",
  },
  {
    title: "Budget calculator",
    body: "Get to a usable low / mid / high range faster, then tighten it once areas and routines feel real.",
    href: "/budget-calculator",
    track: "plan_tool_budget",
  },
  {
    title: "First month planner",
    body: "Pressure-test housing, routines, transport, and school fit during the first real month instead of guessing.",
    href: "/first-month-planner",
    track: "plan_tool_first_month",
  },
  {
    title: "Decision checklists",
    body: "Keep the move grounded with checklists for readiness, leases, school tours, test stays, and arrival week.",
    href: "/decision-checklists",
    track: "plan_tool_checklists",
  },
  {
    title: "Conversation paths",
    body: "Route your family to the right next conversation instead of treating every contact like the same question.",
    href: "/conversation-paths",
    track: "plan_tool_conversation_paths",
  },
  {
    title: "Family Path Match",
    body: "Match your child stage, adult bandwidth, and move tempo to the family path that should shape the next decisions first.",
    href: "/family-path-match",
    track: "plan_tool_family_path_match",
  },
  {
    title: "Family paths",
    body: "Start from your children’s stage or your likely stay length so the advice feels closer to your real family.",
    href: "/family-paths",
    track: "plan_tool_family_paths",
  },
  {
    title: "Daily life",
    body: "Move the question from fantasy to weekday reality: food, rain, pickup energy, sick days, and what the ordinary week actually asks of you.",
    href: "/daily-life",
    track: "plan_tool_daily_life",
  },
  {
    title: "Weekday reality",
    body: "Pressure-test the family week against work, commute, child stage, and whether Empathy School is part of the plan.",
    href: "/weekday-reality",
    track: "plan_tool_weekday_reality",
  },
  {
    title: "Empathy School fit",
    body: "Decide whether Empathy School should anchor the move now, later, or only after a calmer first test.",
    href: "/empathy-school-fit",
    track: "plan_tool_school_fit",
  },
  {
    title: "Empathy School tour prep",
    body: "Protect enough space around the school day that the visit still changes real decisions.",
    href: "/empathy-school-tour-prep",
    track: "plan_tool_tour_prep",
  },
  {
    title: "Compare areas",
    body: "Put two realistic shortlist options side by side so you can see which version of weekly life you are actually choosing.",
    href: "/compare-areas",
    track: "plan_tool_compare_areas",
  },
  {
    title: "Commute reality",
    body: "Test whether traffic, school, work pressure, and after-school energy still leave enough margin for the family week.",
    href: "/commute-reality",
    track: "plan_tool_commute_reality",
  },
  {
    title: "Test stay vs full move",
    body: "Compare move shapes before you harden commitments that the family has not actually earned yet.",
    href: "/test-stay-vs-full-move",
    track: "plan_tool_move_shape_compare",
  },
  {
    title: "Housing style compare",
    body: "Choose the right housing type for this stage before random listings start dictating the plan.",
    href: "/housing-style-compare",
    track: "plan_tool_housing_style_compare",
  },
  {
    title: "Housing intro readiness",
    body: "Check whether your shortlist, budget band, and verification posture are strong enough for Gaia Group to be useful.",
    href: "/housing-intro-readiness",
    track: "plan_tool_housing_readiness",
  },
  {
    title: "Housing brief builder",
    body: "Build the first housing message around real family constraints before you ask for help with listings.",
    href: "/housing-brief-builder",
    track: "plan_tool_housing_brief",
  },
  {
    title: "Video recaps",
    body: "Use written-first tour, camp, housing, and daily-life recaps when you want media to make the next decision clearer instead of just more emotional.",
    href: "/video-recaps",
    track: "plan_tool_video_recaps",
  },
];

export const metadata: Metadata = {
  title: "Plan your move",
  description: "A practical planning hub for families moving to Bali: timeline, tools, checklists, housing strategy, and how Empathy School fits.",
  alternates: { canonical: "/plan-your-move" },
};

export default function PlanYourMovePage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({
      pathname: "/plan-your-move",
      name: "Plan your move",
      description: "A practical planning hub for families moving to Bali with kids.",
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
          <div className={badgeAccent}>Planning hub</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Plan the move in a calmer order.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            The goal is not to solve every Bali question today. It is to solve the right question next: move shape,
            area shortlist, budget reality, Empathy School fit, and only then the heavier commitments like housing.
          </p>
          <div className={btnRow + " mt-8"}>
            <a className={buttonPrimary} href="/move-timeline" data-track="plan_hero_timeline">
              Build the timeline
            </a>
            <a className={buttonSecondary} href="/decision-checklists" data-track="plan_hero_checklists">
              Open decision checklists
            </a>
            <a className={buttonSecondary} href={buildContactHref("General move planning", { from: "/plan-your-move" })} data-track="plan_hero_contact">
              Ask a planning question
            </a>
          </div>
        </div>
      </section>

      <Section
        id="hub-scale"
        title="A planning system, not just a page list"
        lead="This is the operating center of the site. Use it to stay calm about sequence, not to read everything at once."
        tone="default"
      >
        <HubMetricsStrip
          metrics={metrics}
          title="What this hub now helps families decide"
          lead="The size of the site should now feel useful: more comparison power, more planning structure, and clearer bridges to Empathy School and Gaia Group."
        />
      </Section>

      <Section
        id="phases"
        title="The strongest planning order"
        lead="When families get stuck, it is usually a sequence problem. These are the phases that keep the move from becoming noisy too early."
        tone="muted"
      >
        <MovePhasesBand phases={phases} />
      </Section>

      <Section
        id="move-shapes"
        title="Choose the move shape first"
        lead="Families usually get stuck because they are acting like they already know the shape of the move. Start there instead."
        tone="default"
      >
        <div className={grid2}>
          {moveShapes.map((item) => (
            <a key={item.href} href={item.href} className={cardCls} data-track={item.track}>
              {item.kicker ? <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{item.kicker}</div> : null}
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open path →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="bundles"
        title="Most-used planning combinations"
        lead="Use one bundle as your primary lane, then layer in only the extra pages that genuinely sharpen the decision."
        tone="default"
      >
        <BundleStrip bundles={bundles} />
      </Section>

      <Section
        id="tools"
        title="Use the tools in the right order"
        lead="This site gets more valuable when it feels like a planning system instead of a stack of articles."
        tone="muted"
      >
        <div className={grid3}>
          {tools.map((item) => (
            <a key={item.href} href={item.href} className={cardCls} data-track={item.track}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open tool →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="decision-order"
        title="What to decide now, later, and last"
        lead="A calmer Bali move usually comes from better timing, not more research."
        tone="default"
      >
        <div className={grid3}>
          {[
            {
              title: "Decide now",
              body: "Timeline, move shape, kids’ needs, budget posture, and which two or three areas are worth real attention.",
            },
            {
              title: "Decide later",
              body: "Exact housing, final routines, long-term school structure, and how much convenience spending feels normal once the family is settled.",
            },
            {
              title: "Lock last",
              body: "Deposits, leases, higher-commitment services, and any version of the move that becomes hard to unwind if the family learns something new.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="gaia"
        title="Housing stays intentionally narrow"
        lead="We are not building a giant property directory. The public housing route is deliberately centered on one preferred partner: Gaia Group."
        tone="muted"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className={cardCls}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <Image
                src="/images/partners/pali-gaia-standin.svg"
                alt="Pali from Gaia Group"
                width={640}
                height={640}
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className={cardCls}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Preferred housing partner</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">Gaia Group, once the brief is real enough</h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Gaia Group is most useful once your move timing, area direction, commute sensitivity, and bedroom needs are strong enough to create a calmer shortlist. That keeps the process useful instead of turning it into a flood of mismatched listings.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
              <li>Use the housing guide first.</li>
              <li>Check readiness before you request an intro.</li>
              <li>Build the housing brief before you ask for listings.</li>
            </ul>
            <div className={btnRow}>
              <a className={buttonPrimary} href="/gaia-group" data-track="plan_gaia_profile">
                Open Gaia Group
              </a>
              <a className={buttonSecondary} href="/housing-intro-readiness" data-track="plan_gaia_readiness">
                Check readiness
              </a>
              <a className={buttonSecondary} href="/housing-brief-builder" data-track="plan_gaia_brief_builder">
                Build the brief
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="proof"
        title="Trust the move by making it more concrete"
        lead="This batch adds a proof layer built from composite family scenarios and practical lessons rather than invented testimonials."
        tone="muted"
      >
        <div className="grid gap-10">
          <TrustMetaStrip
            updated="2026-03-22"
            title="What this planning page is trying to protect"
            body="A good plan reduces false urgency. It helps you collect the signal you actually need before housing, school, and timing harden into decisions that are hard to unwind."
            links={[
              { href: "/what-families-notice", label: "Open the proof hub" },
              { href: "/faq", label: "Browse parent questions" },
            ]}
          />
          <ParentVoiceStrip
            title="What planning-focused families tend to notice"
            lead="These composite scenarios reflect recurring move patterns around timeline, test stays, and the first real shortlist."
            voices={getScenarioVoices("planning")}
            ctaHref="/what-families-notice"
            ctaLabel="Browse all composite stories"
          />
          <LearnedHardWay
            title="What planning taught us the hard way"
            lead="Families usually need a better order of decisions more than they need more information."
            items={getHardLessons("planning")}
          />
        </div>
      </Section>

      <Section
        id="empathy"
        title="How Empathy School fits the planning system"
        lead="Empathy School should feel like a real anchor in the move, not just another page you happen to read."
        tone="default"
      >
        <div className={grid3}>
          {[
            {
              title: "Use a tour to test the week",
              body: "The school question is often really a question about mornings, commute, rhythm, and whether the rest of the move still works around it.",
              href: "/guides/how-to-use-an-empathy-school-tour-to-test-your-week",
            },
            {
              title: "Use camp to test lighter-fit decisions",
              body: "Camp can help a family experience rhythm, community, and child response before any bigger decision hardens too early.",
              href: "/camps",
            },
            {
              title: "Let school change the area conversation",
              body: "If Empathy School is seriously in the picture, let that change what counts as a workable area and commute from the start.",
              href: "/guides/how-to-use-empathy-school-to-test-area-fit",
            },
          ].map((item) => (
            <a key={item.href} href={item.href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/schools" data-track="plan_empathy_school">
            Explore Empathy School
          </a>
          <a className={buttonSecondary} href={buildContactHref("Empathy School fit", { from: "/plan-your-move" })} data-track="plan_empathy_contact">
            Ask about school fit
          </a>
        </div>
      </Section>

      <SourceConversationPanel
        sourcePath="/plan-your-move"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
