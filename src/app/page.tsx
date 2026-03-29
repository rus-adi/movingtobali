import Image from "next/image";
import Section from "@/components/Section";
import PostCard from "@/components/PostCard";
import ParentVoiceStrip from "@/components/ParentVoiceStrip";
import LearnedHardWay from "@/components/LearnedHardWay";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import HubMetricsStrip from "@/components/HubMetricsStrip";
import MovePhasesBand from "@/components/MovePhasesBand";
import BundleStrip from "@/components/BundleStrip";
import { buildContactHref } from "@/lib/contact";
import { getAllContent } from "@/lib/content";
import { getHardLessons, getScenarioVoices } from "@/lib/proof";
import { getHubBundles, getHubCounts, getMovePhases } from "@/lib/hub";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

type QuickItem = { title: string; href: string; track: string; code: string };
type CardItem = { title: string; href: string; body: string; track: string; kicker?: string };

export default function HomePage() {
  const pillars = getAllContent("pillars");
  const latestBlog = getAllContent("blog").slice(0, 4);
  const latestGuides = getAllContent("guides").slice(0, 6);
  const featuredAreas = getAllContent("areas").slice(0, 6);
  const hubCounts = getHubCounts();
  const movePhases = getMovePhases();
  const hubBundles = getHubBundles();

  const quick: QuickItem[] = [
    { title: "Plan Your Move", href: "/plan-your-move", track: "home_quick_plan", code: "PM" },
    { title: "Move Timeline", href: "/move-timeline", track: "home_quick_timeline", code: "TL" },
    { title: "Decision Checklists", href: "/decision-checklists", track: "home_quick_checklists", code: "CL" },
    { title: "Family Path Match", href: "/family-path-match", track: "home_quick_family_path_match", code: "FP" },
    { title: "Area Match", href: "/area-match", track: "home_quick_area_match", code: "AM" },
    { title: "Budget Calculator", href: "/budget-calculator", track: "home_quick_budget", code: "BU" },
    { title: "First Month Planner", href: "/first-month-planner", track: "home_quick_first_month", code: "FM" },
    { title: "Housing Readiness", href: "/housing-intro-readiness", track: "home_quick_housing_readiness", code: "HR" },
    { title: "Housing Brief", href: "/housing-brief-builder", track: "home_quick_housing_brief", code: "HB" },
    { title: "Daily Life", href: "/daily-life", track: "home_quick_daily_life", code: "DL" },
    { title: "Weekday Reality", href: "/weekday-reality", track: "home_quick_weekday_reality", code: "WR" },
    { title: "Empathy School", href: "/schools", track: "home_quick_empathy", code: "ES" },
    { title: "School Fit", href: "/empathy-school-fit", track: "home_quick_school_fit", code: "SF" },
    { title: "Tour Prep", href: "/empathy-school-tour-prep", track: "home_quick_tour_prep", code: "TP" },
    { title: "Compare Areas", href: "/compare-areas", track: "home_quick_compare_areas", code: "CA" },
    { title: "Commute Reality", href: "/commute-reality", track: "home_quick_commute_reality", code: "CR" },
    { title: "Move Shape Compare", href: "/test-stay-vs-full-move", track: "home_quick_move_shape_compare", code: "MS" },
    { title: "Video Recaps", href: "/video-recaps", track: "home_quick_video_recaps", code: "VR" },
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
      href: "/schools",
      body: "This hub is meant to feel like part of Empathy School: warm, family-first, and grounded in real campus life rather than generic relocation copy.",
      track: "home_trust_empathy",
    },
    {
      title: "Selective housing path",
      href: "/housing",
      body: "We are not building a noisy housing directory. The public housing route is intentionally centered on Gaia Group once a family brief becomes real enough to be useful.",
      track: "home_trust_gaia",
    },
    {
      title: "Experience-based, not overconfident",
      href: "/visas",
      body: "We share lived guidance, checklists, and practical next steps — while still pointing families back to official sources where rules change.",
      track: "home_trust_visas",
    },
    {
      title: "Tools over filler",
      href: "/decision-checklists",
      body: "The site gets bigger by being more useful: timeline builder, checklists, calculators, and planning tools that reduce actual family stress.",
      track: "home_trust_tools",
    },
  ];

  return (
    <main>
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-bali.webp" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/20" />

        <div className="relative py-16 md:py-24">
          <div className="container">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
              <div className="space-y-6">
                <div className={badgeAccent}>Move to Bali with Kids — by Empathy School</div>
                <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                  A calmer way to move to Bali with kids.
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                  This is a practical relocation hub for families: planning tools, area choices, budgets, housing strategy,
                  first-month routines, and how Empathy School fits into a move that still feels human.
                </p>
                <div className={btnRow}>
                  <a className={buttonPrimary} href="/plan-your-move" data-track="home_cta_plan">
                    Plan your move
                  </a>
                  <a className={buttonSecondary} href="/schools" data-track="home_cta_empathy">
                    Explore Empathy School
                  </a>
                  <a
                    className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/15 sm:w-auto"
                    href="/search"
                    data-track="home_cta_search"
                  >
                    Search the hub
                  </a>
                </div>
              </div>

              <div className={cardCls + " bg-white/10 border-white/15 backdrop-blur"}>
                <strong className="text-sm font-semibold text-white">Start with the order of decisions</strong>
                <p className="mt-4 text-sm leading-6 text-white/85">
                  Families usually do better when they decide the shape of the move first, shortlist areas second, build a budget range third, then use Empathy School and housing support in a more grounded way.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    className="group rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    href="/move-timeline"
                    data-track="home_hero_card_timeline"
                  >
                    Build the move timeline <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
                  </a>
                  <a
                    className="group rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    href="/decision-checklists"
                    data-track="home_hero_card_checklists"
                  >
                    Open decision checklists <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
                <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm leading-6 text-white/85">
                  Housing support stays intentionally narrow. The public housing route points toward Gaia Group once timing,
                  area direction, and family needs are real enough to shape a useful shortlist.
                </div>
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/20" />
                <h2 className="text-xl font-semibold tracking-tight text-white">Quick start</h2>
                <div className="h-px flex-1 bg-white/20" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7">
                {quick.map((q) => (
                  <a
                    key={q.href}
                    href={q.href}
                    data-track={q.track}
                    className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-sm backdrop-blur transition hover:bg-white/15 hover:shadow-md"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-xs font-semibold text-white" aria-hidden>
                      {q.code}
                    </span>
                    <span className="text-sm font-semibold">{q.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      <Section
        id="hub-scale"
        title="A bigger site should still feel easy to use"
        lead="This premiumization pass tightened the visual system, clarified the decision order, and made the size of the hub feel structured instead of overwhelming."
        tone="default"
      >
        <HubMetricsStrip
          metrics={hubCounts}
          title="The hub is now genuinely broad — and more coherent"
          lead="It now works more like a family relocation operating system: planning tools, comparison pages, daily-life reality checks, Empathy School decision support, and a guided housing lane with Gaia Group."
        />
      </Section>

      <Section
        id="how-it-works"
        title="How the hub works best"
        lead="Families usually do better when they move through the site in phases: explore, test, narrow, then commit."
        tone="muted"
      >
        <MovePhasesBand phases={movePhases} />
        <div className={btnRow}>
          <a className={buttonPrimary} href="/how-this-hub-works" data-track="home_how_hub_works">
            See the full orientation page
          </a>
          <a className={buttonSecondary} href="/conversation-paths" data-track="home_how_conversation_paths">
            Compare conversation paths
          </a>
        </div>
      </Section>

      <Section
        id="starting-points"
        title="Choose your starting point"
        lead="The site feels larger and more helpful when the next step is obvious. Start with the card that sounds most like your family right now."
        tone="default"
      >
        <div className={grid3}>
          {startingPoints.map((item) => (
            <a key={item.href} href={item.href} className={cardCls} data-track={item.track}>
              {item.kicker ? <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{item.kicker}</div> : null}
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open page →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="move-system"
        title="Plan the move, don’t just read about it"
        lead="The strongest additions are tools that turn uncertainty into decisions: timing, budget, area shortlist, and arrival-week structure."
        tone="muted"
      >
        <div className={grid3}>
          {[
            ["/plan-your-move", "Plan Your Move", "Use the planning hub to choose the move shape, what to decide now, and what to delay until reality is clearer."],
            ["/move-timeline", "Move Timeline", "Sequence the move around timing, school questions, area clarity, and when housing decisions should happen."],
            ["/decision-checklists", "Decision Checklists", "Use the right checklist before the move, before a lease, before a school tour, and before arrival week."],
            ["/first-month-planner", "First Month Planner", "Map the first month around routines, housing truth, transport, and whether Empathy School changes the week."],
            ["/housing-intro-readiness", "Housing intro readiness", "Check whether the move is grounded enough for Gaia Group to be genuinely useful instead of prematurely noisy."],
            ["/housing-brief-builder", "Housing brief builder", "Create the first housing message around real constraints: shortlist, budget band, bedrooms, commute, and dealbreakers."],
            ["/empathy-school-fit", "Empathy School fit", "Decide whether Empathy School should anchor area, commute, and weekly rhythm now or later."],
            ["/empathy-school-tour-prep", "Empathy School tour prep", "Plan a school day that still gives the family a useful signal instead of a rushed impression."],
            ["/family-path-match", "Family Path Match", "Match your child stage, adult bandwidth, and move tempo to the path that should guide your next decisions first."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open tool →</div>
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
            <a key={item.href} href={item.href} className={cardCls} data-track={item.track}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{item.kicker}</div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open guide →</div>
            </a>
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/family-path-match" data-track="home_family_paths_match">
            Use Family Path Match
          </a>
          <a className={buttonSecondary} href="/family-paths" data-track="home_family_paths_hub">
            Open all family paths
          </a>
          <a className={buttonSecondary} href="/settling-in" data-track="home_family_paths_settling">
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
            ["/daily-life", "Daily life", "Use the main hub to think about the ordinary family week instead of only the move itself."],
            ["/weekday-reality", "Weekday reality", "Pressure-test your Bali plan against commute tolerance, weather, work, and child energy."],
            ["/guides/how-to-build-a-calm-weekday-rhythm-in-bali", "Build a calm weekday rhythm", "Start smaller than you want to so mornings, pickups, food, and evenings hold together."],
            ["/guides/after-school-rhythm-in-bali-for-families", "After-school rhythm", "Plan the hardest transition of the day before it becomes the hidden reason the move feels heavy."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
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
            ["/compare-areas", "Compare areas", "Put two realistic Bali options side by side and see which one protects the actual family week better."],
            ["/commute-reality", "Commute reality", "Pressure-test route friction before school, work, and housing all start relying on the same fragile drive."],
            ["/test-stay-vs-full-move", "Test stay vs full move", "Choose the move shape that gives your family the best signal with the least avoidable damage."],
            ["/housing-style-compare", "Housing style compare", "Decide what kind of housing should carry this stage of the move before random listings take over."],
            ["/resources/two-area-comparison-sheet", "Two-area comparison sheet", "Use a simple worksheet when both areas still sound good and you need a clearer yes."],
            ["/resources/empathy-school-commute-decision-grid", "Empathy School commute grid", "See whether the school route keeps helping the move once normal life, pickup, and work all enter the picture."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open comparison →</div>
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
            ["/video-recaps", "Video recaps hub", "Open the written-first media hub for school tours, camp clips, home-base cues, and daily-life rhythm recaps."],
            ["/blog/video-how-we-run-a-school-tour", "How we run an Empathy School tour", "Use the tour recap to decide whether school fit should change your area shortlist, commute plan, or next test-stay step."],
            ["/blog/empathy-school-summer-camp-highlights-recap", "Summer camp highlights recap", "Turn the camp highlight reel into a practical question: would camp make your first Bali weeks calmer or more complicated?"],
            ["/guides/ubud-side-family-rhythm-video-recap", "What an Ubud-side family rhythm can feel like", "Use short daily-life clips as a rhythm walkthrough for the kind of week that often forms around Empathy School and the Ubud side of Bali."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open recap →</div>
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
        id="trust"
        title="Why families trust this site"
        lead="The point is to be genuinely useful, not to behave like a thin directory or an overconfident relocation funnel."
        tone="muted"
      >
        <div className={grid2}>
          {trustCards.map((item) => (
            <a key={item.href} href={item.href} className={cardCls} data-track={item.track}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </Section>

      <Section
        id="gaia-and-empathy"
        title="The two strongest anchors in the hub"
        lead="Empathy School and Gaia Group should feel like real, grounded parts of the planning system — not random promotions."
        tone="default"
      >
        <div className={grid2}>
          <div className={cardCls}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <Image src="/images/partners/pali-gaia-standin.svg" alt="Pali from Gaia Group" width={640} height={640} className="h-auto w-full" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight text-gray-900">Gaia Group for housing support</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Bring Gaia Group in once your timing, area direction, and family brief are strong enough to create a useful shortlist.
              That keeps the housing path calmer and more specific.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
              <li>Check whether you are truly ready for a housing intro.</li>
              <li>Build the brief before you ask for listings.</li>
              <li>Keep the route shortlist-first and verification-first.</li>
            </ul>
            <div className={btnRow}>
              <a className={buttonPrimary} href="/gaia-group" data-track="home_gaia_profile">
                Open Gaia Group page
              </a>
              <a className={buttonSecondary} href="/housing-intro-readiness" data-track="home_gaia_readiness">
                Check readiness
              </a>
              <a className={buttonSecondary} href={buildContactHref("Housing intro", { from: "/", partner: "gaia-group-bali" })} data-track="home_gaia_intro">
                Request housing intro
              </a>
            </div>
          </div>

          <div className={cardCls}>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Empathy School as a real decision anchor</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              School fit should not sit at the edge of the move. If Empathy School matters, let it influence area, commute, routine, and whether the week still feels good once normal life begins.
            </p>
            <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
              <li>Tour the school as part of a real family day, not only as a one-off visit.</li>
              <li>Use camp and commute reality to test whether the weekly rhythm still feels workable.</li>
              <li>Let school fit change the move plan early enough to matter.</li>
            </ul>
            <div className={btnRow}>
              <a className={buttonPrimary} href="/schools" data-track="home_empathy_school">
                Explore Empathy School
              </a>
              <a className={buttonSecondary} href="/empathy-school-fit" data-track="home_empathy_fit">
                Use school fit tool
              </a>
              <a className={buttonSecondary} href="/empathy-school-tour-prep" data-track="home_empathy_tour_prep">
                Plan the tour day
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section id="pillars" title="Explore the full hub" lead="Start with a pillar, then follow the linked deep-dives." tone="muted">
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
          <a className={buttonPrimary} href="/areas" data-track="home_open_areas">
            Browse all areas
          </a>
          <a className={buttonSecondary} href="/area-match" data-track="home_open_area_match">
            Use Area Match
          </a>
          <a className={buttonSecondary} href="/compare-areas" data-track="home_open_compare_areas">
            Compare two areas
          </a>
          <a className={buttonSecondary} href="/commute-reality" data-track="home_open_commute_reality">
            Test commute reality
          </a>
        </div>
      </Section>

      <Section id="guides" title="Guides" lead="Evergreen, checklist-heavy guides that support the bigger decisions." tone="muted">
        <div className={grid2}>
          {latestGuides.map((g) => (
            <PostCard key={g.slug} item={g} />
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/guides" data-track="home_open_guides">
            Browse all guides
          </a>
          <a className={buttonSecondary} href="/resources" data-track="home_open_resources">
            Resources
          </a>
        </div>
      </Section>

      <Section id="blog" title="Latest from the blog" lead="Short posts that answer one practical question at a time." tone="default">
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
