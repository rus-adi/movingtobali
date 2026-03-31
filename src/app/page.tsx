import Image from "next/image";
import Section from "@/components/Section";
import PostCard from "@/components/PostCard";
import ParentVoiceStrip from "@/components/ParentVoiceStrip";
import LearnedHardWay from "@/components/LearnedHardWay";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import MovePhasesBand from "@/components/MovePhasesBand";
import BundleStrip from "@/components/BundleStrip";
import { getAllContent } from "@/lib/content";
import { getSite } from "@/lib/site";
import { getHardLessons, getScenarioVoices } from "@/lib/proof";
import { getHubBundles, getMovePhases } from "@/lib/hub";
import {
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  grid2,
  grid3,
} from "@/components/ui/styles";

type HeroPath = {
  title: string;
  href: string;
  body: string;
  track: string;
  icon: string;
  kicker: string;
};
type CardItem = {
  title: string;
  href: string;
  body: string;
  track: string;
  kicker?: string;
  external?: boolean;
};

export default function HomePage() {
  const site = getSite();
  const pillars = getAllContent("pillars");
  const latestBlog = getAllContent("blog").slice(0, 4);
  const latestGuides = getAllContent("guides").slice(0, 6);
  const featuredAreas = getAllContent("areas").slice(0, 6);
  const movePhases = getMovePhases();
  const hubBundles = getHubBundles();

  const heroPaths: HeroPath[] = [
    {
      title: "Plan Your Move",
      href: "/plan-your-move",
      body: "Build your first timeline, priorities, and next steps without having to solve the whole move today.",
      track: "home_hero_path_plan",
      icon: "🗓️",
      kicker: "Timeline & next steps",
    },
    {
      title: "Areas & Housing",
      href: "/area-match",
      body: "Shortlist the right part of Bali first so housing decisions stay grounded in the week you actually want.",
      track: "home_hero_path_areas_housing",
      icon: "🏡",
      kicker: "Area-first route",
    },
    {
      title: "Education for Your Kids",
      href: "/empathy-school-fit",
      body: "Use school fit to decide whether learning style, commute, and family rhythm should shape the move earlier.",
      track: "home_hero_path_education",
      icon: "🎒",
      kicker: "School questions",
    },
  ];

  const serviceCards: CardItem[] = [
    {
      title: "Planning & timelines",
      href: "/plan-your-move",
      body: "Start with the order of decisions, the shape of the move, and the timeline that fits your family instead of copying someone else’s path.",
      track: "home_services_planning",
      kicker: "Planning",
    },
    {
      title: "Areas & housing",
      href: "/area-match",
      body: "Narrow Bali first, then pressure-test housing choices against commute, pace, and what your normal week would actually feel like.",
      track: "home_services_areas_housing",
      kicker: "Place",
    },
    {
      title: "School fit & tours",
      href: "/empathy-school-fit",
      body: "Decide whether school should shape the move now, later, or only after a calmer test stay and a more honest tour day.",
      track: "home_services_school",
      kicker: "Learning",
    },
    {
      title: "Camps & short stays",
      href: "/camps",
      body: "Use camps and shorter stays to test family rhythm, learning fit, and whether Bali feels workable before heavier commitments harden around guesswork.",
      track: "home_services_camps",
      kicker: "Test the fit",
    },
    {
      title: "Costs & daily life",
      href: "/costs",
      body: "Build a more realistic view of budget, transport, routine, and the ordinary tradeoffs that decide whether the move stays calm after arrival.",
      track: "home_services_costs",
      kicker: "Reality check",
    },
    {
      title: "Questions & introductions",
      href: "/contact",
      body: "Ask the next practical question or request the right introduction once your move plan is specific enough for school or partner support to be genuinely useful.",
      track: "home_services_contact",
      kicker: "Support",
    },
  ];

  const startingPoints: CardItem[] = [
    {
      title: "We’re still deciding whether Bali is right",
      href: "/guides/should-we-move-to-bali-with-kids",
      body: "Start with readiness, family energy, timing, and whether this should begin as a test stay rather than a full move.",
      track: "home_start_deciding",
      kicker: "Early-stage decision",
    },
    {
      title: "We want a test stay first",
      href: "/test-stay",
      body: "Use a short stay to test rhythm, area fit, cost reality, and whether Empathy School belongs in the plan.",
      track: "home_start_test_stay",
      kicker: "Lower-risk route",
    },
    {
      title: "We need to narrow areas",
      href: "/area-match",
      body: "Shortlist Bali by weekday energy, commute tolerance, calmer family rhythm, and the kind of convenience you want.",
      track: "home_start_areas",
      kicker: "Area first",
    },
    {
      title: "Housing feels urgent",
      href: "/housing",
      body: "Slow the process down enough to avoid paying before your brief, area shortlist, and commute realities are strong enough.",
      track: "home_start_housing",
      kicker: "Housing",
    },
    {
      title: "We need the numbers to feel real",
      href: "/budget-calculator",
      body: "Build a working monthly range around housing, learning, transport, food, and family buffer.",
      track: "home_start_budget",
      kicker: "Budget",
    },
    {
      title: "School may anchor the move",
      href: "/empathy-school-fit",
      body: "If Empathy School is seriously in the picture, decide whether it should shape the area, commute, and weekly rhythm early enough to matter.",
      track: "home_start_school",
      kicker: "Empathy School",
    },
  ];

  const familySetups: CardItem[] = [
    {
      title: "We’re moving with toddlers",
      href: "/guides/moving-to-bali-with-toddlers",
      body: "Optimize for naps, calmer housing, fewer long drives, and routines the adults can actually sustain.",
      track: "home_family_toddlers",
      kicker: "Toddlers",
    },
    {
      title: "We’re moving with primary-age kids",
      href: "/guides/moving-to-bali-with-primary-age-kids",
      body: "Build the week around routine, community, one or two anchors, and whether Empathy School belongs in the picture.",
      track: "home_family_primary",
      kicker: "Primary age",
    },
    {
      title: "We’re moving with pre-teens or teens",
      href: "/guides/moving-to-bali-with-pre-teens-and-teens",
      body: "Start with buy-in, social fit, independence, and whether the area still feels good after repeated commuting.",
      track: "home_family_teens",
      kicker: "Pre-teens & teens",
    },
    {
      title: "We only want a 1–3 month stay",
      href: "/guides/one-to-three-month-family-stay-in-bali",
      body: "Use Bali as a real-life trial without pretending a short stay should behave like a holiday.",
      track: "home_family_short_stay",
      kicker: "Short stay",
    },
    {
      title: "We’re a remote-working family",
      href: "/guides/moving-to-bali-as-a-remote-working-family",
      body: "Treat work hours, child anchors, and housing layout as one weekly system instead of three separate problems.",
      track: "home_family_remote_work",
      kicker: "Remote work",
    },
    {
      title: "One parent is carrying most of the move",
      href: "/guides/moving-to-bali-as-a-single-parent",
      body: "Use a smaller radius, simpler routines, and more supportive defaults so the move stays kind to the adult carrying the load.",
      track: "home_family_single_parent",
      kicker: "Single parent",
    },
    {
      title: "Our child warms up slowly",
      href: "/guides/moving-to-bali-with-a-slower-to-warm-up-child",
      body: "Introduce Bali through repetition, trust, and calmer first impressions rather than pressure to love everything fast.",
      track: "home_family_slow_warmup",
      kicker: "Child temperament",
    },
    {
      title: "Our child needs lots of movement",
      href: "/guides/moving-to-bali-with-a-highly-active-outdoor-child",
      body: "Let movement, outdoor rhythm, and a calmer energy profile shape the area and weekly plan earlier.",
      track: "home_family_active_child",
      kicker: "Highly active child",
    },
  ];

  const trustCards: CardItem[] = [
    {
      title: "Built by Empathy School",
      href: site.brand.publisherUrl,
      body: "This hub is meant to feel like the same family-first world: warm, grounded, and practical before it is promotional.",
      track: "home_trust_empathy",
      external: true,
    },
    {
      title: "Guide-first, not pitch-first",
      href: "/how-this-hub-works",
      body: "We try to earn trust with tools, checklists, and calmer next steps before asking families to talk to a school or partner.",
      track: "home_trust_guide_first",
    },
    {
      title: "Experience-based, not overconfident",
      href: "/visas",
      body: "Where rules change, we point families back to official sources and practical due diligence instead of pretending certainty.",
      track: "home_trust_visas",
    },
    {
      title: "Use one path at a time",
      href: "/start-here",
      body: "You do not need to decode the whole hub today. Start with the most urgent decision, then expand only when you need more detail.",
      track: "home_trust_one_path",
    },
  ];

  return (
    <main>
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bali.webp"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/82 via-black/66 to-black/48" />

        <div className="relative py-16 md:py-24">
          <div className="container">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
                A practical relocation hub by Empathy School
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                A calmer way to move to Bali with kids.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/95 sm:text-lg">
                Plan your timelines, find the right neighborhood, and navigate
                family life. We help you build a transition that feels grounded
                and human.
              </p>
              <div className={btnRow}>
                <a
                  className={buttonPrimary}
                  href="/plan-your-move"
                  data-track="home_cta_start_relocation_plan"
                >
                  Start Your Relocation Plan
                </a>
              </div>
              <p className="text-sm leading-6 text-white/88">
                Start with one clear next step below. The deeper tools, area
                guides, and school pages stay available when you are ready for
                them.
              </p>
            </div>

            <div className="mt-12 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/88">
                Quick start
              </p>
              <p className="mt-3 text-sm leading-6 text-white/90">
                Choose the question that feels most urgent right now.
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {heroPaths.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-track={item.track}
                  className="group rounded-3xl border border-white/70 bg-white/95 p-6 text-gray-900 shadow-xl transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-2xl"
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                    {item.kicker}
                  </div>
                  <div className="mt-4 flex items-start gap-4">
                    <span className="mt-1 text-2xl" aria-hidden>
                      {item.icon}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-gray-700">
                        {item.body}
                      </p>
                      <div className="mt-5 text-sm font-semibold text-emerald-800">
                        Open path{" "}
                        <span className="inline-block transition group-hover:translate-x-0.5">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        id="what-we-help-with"
        title="What we help families with"
        lead="The hub is meant to answer the biggest practical questions quickly: how to plan the move, where to live, what school fit changes, and what daily life is likely to feel like once you arrive."
        tone="muted"
      >
        <div className={grid3}>
          {serviceCards.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cardCls}
              data-track={item.track}
            >
              {item.kicker ? (
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                  {item.kicker}
                </div>
              ) : null}
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {item.body}
              </p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open path →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="how-it-works"
        title="A calmer order for the big decisions"
        lead="Most families do better when they choose the shape of the move first, narrow the area second, and let school or housing support enter when the plan is concrete enough to benefit from them."
        tone="default"
      >
        <MovePhasesBand phases={movePhases} />
        <div className={btnRow}>
          <a
            className={buttonPrimary}
            href="/move-timeline"
            data-track="home_how_move_timeline"
          >
            Build the move timeline
          </a>
          <a
            className={buttonSecondary}
            href="/decision-checklists"
            data-track="home_how_decision_checklists"
          >
            Open decision checklists
          </a>
          <a
            className={buttonSecondary}
            href="/how-this-hub-works"
            data-track="home_how_hub_works"
          >
            See how the hub works
          </a>
        </div>
      </Section>

      <Section
        id="trust"
        title="Why families trust this hub"
        lead="The point is to be genuinely useful, not to behave like a thin directory or an overconfident relocation funnel."
        tone="muted"
      >
        <div className={grid2}>
          {trustCards.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cardCls}
              data-track={item.track}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
            >
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {item.body}
              </p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="starting-points"
        title="When you need a more specific starting point"
        lead="Once the first question is clear, choose the card that sounds most like your family right now."
        tone="default"
      >
        <div className={grid3}>
          {startingPoints.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cardCls}
              data-track={item.track}
            >
              {item.kicker ? (
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                  {item.kicker}
                </div>
              ) : null}
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {item.body}
              </p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open page →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="move-system"
        title="Plan the move, don’t just read about it"
        lead="When the move becomes more concrete, these tools turn uncertainty into decisions: timing, budget, area shortlist, and arrival-week structure."
        tone="muted"
      >
        <div className={grid3}>
          {[
            [
              "/plan-your-move",
              "Plan Your Move",
              "Use the planning hub to choose the move shape, what to decide now, and what to delay until reality is clearer.",
            ],
            [
              "/move-timeline",
              "Move Timeline",
              "Sequence the move around timing, school questions, area clarity, and when housing decisions should happen.",
            ],
            [
              "/decision-checklists",
              "Decision Checklists",
              "Use the right checklist before the move, before a lease, before a school tour, and before arrival week.",
            ],
            [
              "/first-month-planner",
              "First Month Planner",
              "Map the first month around routines, housing truth, transport, and whether Empathy School changes the week.",
            ],
            [
              "/housing-intro-readiness",
              "Housing intro readiness",
              "Check whether the move is grounded enough for Gaia Group to be genuinely useful instead of prematurely noisy.",
            ],
            [
              "/housing-brief-builder",
              "Housing brief builder",
              "Create the first housing message around real constraints: shortlist, budget band, bedrooms, commute, and dealbreakers.",
            ],
            [
              "/empathy-school-fit",
              "Empathy School fit",
              "Decide whether Empathy School should anchor area, commute, and weekly rhythm now or later.",
            ],
            [
              "/empathy-school-tour-prep",
              "Empathy School tour prep",
              "Plan a school day that still gives the family a useful signal instead of a rushed impression.",
            ],
            [
              "/family-path-match",
              "Family Path Match",
              "Match your child stage, adult bandwidth, and move tempo to the path that should guide your next decisions first.",
            ],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open tool →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="family-setups"
        title="Browse by family setup"
        lead="Different families need different starting points. Start from your children’s stage, your adult reality, or the tempo you want the move to follow."
        tone="default"
      >
        <div className={grid3}>
          {familySetups.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cardCls}
              data-track={item.track}
            >
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                {item.kicker}
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {item.body}
              </p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open guide →
              </div>
            </a>
          ))}
        </div>
        <div className={btnRow}>
          <a
            className={buttonPrimary}
            href="/family-path-match"
            data-track="home_family_paths_match"
          >
            Use Family Path Match
          </a>
          <a
            className={buttonSecondary}
            href="/family-paths"
            data-track="home_family_paths_hub"
          >
            Open all family paths
          </a>
          <a
            className={buttonSecondary}
            href="/settling-in"
            data-track="home_family_paths_settling"
          >
            Settling-in guide
          </a>
        </div>
      </Section>

      <Section
        id="daily-life"
        title="Can we actually live like this week after week?"
        lead="This is where the move becomes real: mornings, food, work calls, rainy afternoons, sick days, and the after-school window."
        tone="muted"
      >
        <div className={grid2}>
          {[
            [
              "/daily-life",
              "Daily life",
              "Use the main hub to think about the ordinary family week instead of only the move itself.",
            ],
            [
              "/weekday-reality",
              "Weekday reality",
              "Pressure-test your Bali plan against commute tolerance, weather, work, and child energy.",
            ],
            [
              "/guides/how-to-build-a-calm-weekday-rhythm-in-bali",
              "Build a calm weekday rhythm",
              "Start smaller than you want to so mornings, pickups, food, and evenings hold together.",
            ],
            [
              "/guides/after-school-rhythm-in-bali-for-families",
              "After-school rhythm",
              "Plan the hardest transition of the day before it becomes the hidden reason the move feels heavy.",
            ],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="bundles"
        title="Most families use these pages together"
        lead="These bundles make the site feel bigger in the right way: fewer dead ends, more useful sequences."
        tone="default"
      >
        <BundleStrip bundles={hubBundles} />
      </Section>

      <Section
        id="comparison-tools"
        title="Compare the tradeoffs side by side"
        lead="This is where the site starts feeling bigger in a useful way. Comparison tools help families stop circling and start deciding."
        tone="default"
      >
        <div className={grid3}>
          {[
            [
              "/compare-areas",
              "Compare areas",
              "Put two realistic Bali options side by side and see which one protects the actual family week better.",
            ],
            [
              "/commute-reality",
              "Commute reality",
              "Pressure-test route friction before school, work, and housing all start relying on the same fragile drive.",
            ],
            [
              "/test-stay-vs-full-move",
              "Test stay vs full move",
              "Choose the move shape that gives your family the best signal with the least avoidable damage.",
            ],
            [
              "/housing-style-compare",
              "Housing style compare",
              "Decide what kind of housing should carry this stage of the move before random listings take over.",
            ],
            [
              "/resources/two-area-comparison-sheet",
              "Two-area comparison sheet",
              "Use a simple worksheet when both areas still sound good and you need a clearer yes.",
            ],
            [
              "/resources/empathy-school-commute-decision-grid",
              "Empathy School commute grid",
              "See whether the school route keeps helping the move once normal life, pickup, and work all enter the picture.",
            ],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open comparison →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="watch-before-you-decide"
        title="Watch before you decide"
        lead="This new media lane turns tours, camp clips, and daily-life footage into written-first recap pages so families can use media as decision support instead of wishful thinking."
        tone="muted"
      >
        <div className={grid2}>
          {[
            [
              "/video-recaps",
              "Video recaps hub",
              "Open the written-first media hub for school tours, camp clips, home-base cues, and daily-life rhythm recaps.",
            ],
            [
              "/blog/video-how-we-run-a-school-tour",
              "How we run an Empathy School tour",
              "Use the tour recap to decide whether school fit should change your area shortlist, commute plan, or next test-stay step.",
            ],
            [
              "/blog/empathy-school-summer-camp-highlights-recap",
              "Summer camp highlights recap",
              "Turn the camp highlight reel into a practical question: would camp make your first Bali weeks calmer or more complicated?",
            ],
            [
              "/guides/ubud-side-family-rhythm-video-recap",
              "What an Ubud-side family rhythm can feel like",
              "Use short daily-life clips as a rhythm walkthrough for the kind of week that often forms around Empathy School and the Ubud side of Bali.",
            ],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open recap →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="proof"
        title="What families tend to notice"
        lead="This trust layer is intentionally honest. These are composite family scenarios and recurring lessons, not invented testimonials."
        tone="default"
      >
        <div className="grid gap-10">
          <TrustMetaStrip
            updated="2026-03-22"
            title="A trust layer without fake certainty"
            body="We want the site to feel more lived-in, but we are not going to pretend we have approved parent testimonials where we do not. For now, this proof system uses composite family scenarios and hard-earned lessons rooted in recurring move questions around Empathy School."
            links={[
              { href: "/what-families-notice", label: "Open the proof hub" },
              { href: "/disclosure", label: "Disclosure" },
            ]}
          />
          <ParentVoiceStrip
            title="What families notice when the move becomes real"
            lead="These examples are composites designed to help families see themselves in the right questions earlier."
            voices={getScenarioVoices("planning")}
            ctaHref="/what-families-notice"
            ctaLabel="Browse all composite stories"
          />
          <LearnedHardWay
            title="What we learned the hard way"
            lead="These patterns repeat across planning, housing, school fit, and daily life."
            items={getHardLessons("planning")}
          />
        </div>
      </Section>

      <Section
        id="gaia-and-empathy"
        title="When school or housing becomes part of the plan"
        lead="These routes work best after your timeline, area direction, and weekly reality are clear enough to make the next conversation genuinely useful."
        tone="default"
      >
        <div className={grid2}>
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
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">
              Housing support when your brief is ready
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Bring Gaia Group in once timing, area direction, budget band, and
              family brief are strong enough to create a useful shortlist. That
              keeps the housing path calmer and more specific.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
              <li>Check whether you are truly ready for a housing intro.</li>
              <li>Build the brief before you ask for listings.</li>
              <li>Keep the route shortlist-first and verification-first.</li>
            </ul>
            <div className={btnRow}>
              <a
                className={buttonPrimary}
                href="/housing-intro-readiness"
                data-track="home_gaia_readiness"
              >
                Check readiness
              </a>
              <a
                className={buttonSecondary}
                href="/housing-brief-builder"
                data-track="home_gaia_brief"
              >
                Build housing brief
              </a>
              <a
                className={buttonSecondary}
                href="/gaia-group"
                data-track="home_gaia_profile"
              >
                Open Gaia Group page
              </a>
            </div>
          </div>

          <div className={cardCls}>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Empathy School when school fit truly matters
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              School fit should not sit at the edge of the move. If Empathy
              School matters, let it influence area, commute, routine, and
              whether the week still feels good once normal life begins.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
              <li>
                Use school fit before you over-commit to an area or a long
                drive.
              </li>
              <li>
                Tour the school as part of a real family day, not only as a
                one-off visit.
              </li>
              <li>
                Let school fit change the move plan early enough to matter.
              </li>
            </ul>
            <div className={btnRow}>
              <a
                className={buttonPrimary}
                href="/empathy-school-fit"
                data-track="home_empathy_fit"
              >
                Use school fit tool
              </a>
              <a
                className={buttonSecondary}
                href="/empathy-school-tour-prep"
                data-track="home_empathy_tour_prep"
              >
                Plan the tour day
              </a>
              <a
                className={buttonSecondary}
                href={site.brand.publisherUrl}
                target="_blank"
                rel="noreferrer"
                data-track="home_empathy_school"
              >
                Visit Empathy School
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="pillars"
        title="Explore the full hub"
        lead="Start with a pillar, then follow the linked deep-dives when you want more depth."
        tone="muted"
      >
        <div className={grid3}>
          {pillars.map((p) => (
            <PostCard key={p.slug} item={p} />
          ))}
        </div>
      </Section>

      <Section
        id="areas"
        title="Explore Bali areas"
        lead="Short, honest area guides for families: where it is calm, where it is busy, and what daily life actually feels like."
        tone="default"
      >
        <div className={grid2}>
          {featuredAreas.map((a) => (
            <PostCard key={a.slug} item={a} />
          ))}
        </div>
        <div className={btnRow}>
          <a
            className={buttonPrimary}
            href="/areas"
            data-track="home_open_areas"
          >
            Browse all areas
          </a>
          <a
            className={buttonSecondary}
            href="/area-match"
            data-track="home_open_area_match"
          >
            Use Area Match
          </a>
          <a
            className={buttonSecondary}
            href="/compare-areas"
            data-track="home_open_compare_areas"
          >
            Compare two areas
          </a>
          <a
            className={buttonSecondary}
            href="/commute-reality"
            data-track="home_open_commute_reality"
          >
            Test commute reality
          </a>
        </div>
      </Section>

      <Section
        id="guides"
        title="Guides"
        lead="Evergreen, checklist-heavy guides that support the bigger decisions."
        tone="muted"
      >
        <div className={grid2}>
          {latestGuides.map((g) => (
            <PostCard key={g.slug} item={g} />
          ))}
        </div>
        <div className={btnRow}>
          <a
            className={buttonPrimary}
            href="/guides"
            data-track="home_open_guides"
          >
            Browse all guides
          </a>
          <a
            className={buttonSecondary}
            href="/resources"
            data-track="home_open_resources"
          >
            Resources
          </a>
        </div>
      </Section>

      <Section
        id="blog"
        title="Latest from the blog"
        lead="Short posts that answer one practical question at a time."
        tone="default"
      >
        <div className={grid2}>
          {latestBlog.map((p) => (
            <PostCard key={p.slug} item={p} />
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/blog" data-track="home_open_blog">
            View all posts
          </a>
        </div>
      </Section>
    </main>
  );
}
