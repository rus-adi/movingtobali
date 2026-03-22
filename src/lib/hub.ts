import { getAllContent } from "@/lib/content";

export type HubLink = {
  label: string;
  href: string;
};

export type HubPhase = {
  kicker: string;
  title: string;
  body: string;
  links: HubLink[];
};

export type HubBundle = {
  title: string;
  body: string;
  links: HubLink[];
};

export type HubMetric = {
  value: string;
  label: string;
  detail: string;
  href?: string;
};

export function getHubToolLinks(): HubLink[] {
  return [
    { label: "Plan your move", href: "/plan-your-move" },
    { label: "Move timeline", href: "/move-timeline" },
    { label: "Decision checklists", href: "/decision-checklists" },
    { label: "Conversation paths", href: "/conversation-paths" },
    { label: "Family Path Match", href: "/family-path-match" },
    { label: "Area Match", href: "/area-match" },
    { label: "Compare areas", href: "/compare-areas" },
    { label: "Commute reality", href: "/commute-reality" },
    { label: "Budget calculator", href: "/budget-calculator" },
    { label: "First month planner", href: "/first-month-planner" },
    { label: "Weekday reality", href: "/weekday-reality" },
    { label: "Empathy School fit", href: "/empathy-school-fit" },
    { label: "Empathy School tour prep", href: "/empathy-school-tour-prep" },
    { label: "Housing intro readiness", href: "/housing-intro-readiness" },
    { label: "Housing brief builder", href: "/housing-brief-builder" },
    { label: "Test stay vs full move", href: "/test-stay-vs-full-move" },
    { label: "Housing style compare", href: "/housing-style-compare" },
    { label: "Video recaps", href: "/video-recaps" },
  ];
}

export function getHubCounts(): HubMetric[] {
  const pillars = getAllContent("pillars").length;
  const guides = getAllContent("guides").length;
  const resources = getAllContent("resources").length;
  const areas = getAllContent("areas").length;
  const blog = getAllContent("blog").length;
  const tools = getHubToolLinks().length;

  return [
    {
      value: String(tools),
      label: "planning tools",
      detail: "Interactive pages and structured decision hubs.",
      href: "/plan-your-move",
    },
    {
      value: String(pillars),
      label: "pillar sections",
      detail: "The core family relocation lanes across the site.",
      href: "/start-here",
    },
    {
      value: String(guides),
      label: "evergreen guides",
      detail: "Long-form practical pages with real next steps.",
      href: "/guides",
    },
    {
      value: String(resources),
      label: "resources",
      detail: "Worksheets, scorecards, planners, and checklists.",
      href: "/resources",
    },
    {
      value: String(areas),
      label: "area guides",
      detail: "Neighborhood pages to help families choose calmly.",
      href: "/areas",
    },
    {
      value: String(blog),
      label: "stories and recaps",
      detail: "Composite scenarios, recap posts, and lived patterns.",
      href: "/what-families-notice",
    },
  ];
}

export function getMovePhases(): HubPhase[] {
  return [
    {
      kicker: "Phase 01",
      title: "Explore without pretending you already know the answer",
      body: "Start with readiness, child stage, family bandwidth, and whether this should begin as a test stay instead of a full move.",
      links: [
        { label: "Start Here", href: "/start-here" },
        { label: "Should we move?", href: "/guides/should-we-move-to-bali-with-kids" },
        { label: "Family Path Match", href: "/family-path-match" },
      ],
    },
    {
      kicker: "Phase 02",
      title: "Test the version of Bali you are actually considering",
      body: "Let a short stay, a school tour, or a weekday-reality pass show you what the move feels like once ordinary life enters the picture.",
      links: [
        { label: "Test Stay", href: "/test-stay" },
        { label: "Weekday Reality", href: "/weekday-reality" },
        { label: "Tour Prep", href: "/empathy-school-tour-prep" },
      ],
    },
    {
      kicker: "Phase 03",
      title: "Narrow the shortlist until the tradeoffs are visible",
      body: "Area, budget, commute, and school-fit questions get much easier once you are only comparing a few realistic versions of the move.",
      links: [
        { label: "Area Match", href: "/area-match" },
        { label: "Compare Areas", href: "/compare-areas" },
        { label: "Budget Calculator", href: "/budget-calculator" },
      ],
    },
    {
      kicker: "Phase 04",
      title: "Commit only after the plan is grounded enough",
      body: "Use Gaia Group, Empathy School conversations, and the contact flow once your move shape is clear enough to make those conversations useful.",
      links: [
        { label: "Housing readiness", href: "/housing-intro-readiness" },
        { label: "Gaia Group", href: "/gaia-group" },
        { label: "Conversation paths", href: "/conversation-paths" },
      ],
    },
  ];
}

export function getHubBundles(): HubBundle[] {
  return [
    {
      title: "School-first bundle",
      body: "Best when Empathy School may genuinely shape area, commute, and the weekly rhythm early in the move.",
      links: [
        { label: "Empathy School fit", href: "/empathy-school-fit" },
        { label: "Tour prep", href: "/empathy-school-tour-prep" },
        { label: "Commute reality", href: "/commute-reality" },
      ],
    },
    {
      title: "Area-first bundle",
      body: "Best when you are still deciding which family rhythm you want Bali to carry: calmer, busier, closer, or more spread out.",
      links: [
        { label: "Area Match", href: "/area-match" },
        { label: "Compare Areas", href: "/compare-areas" },
        { label: "Budget Calculator", href: "/budget-calculator" },
      ],
    },
    {
      title: "Test-stay bundle",
      body: "Best when you want a real signal without overcommitting. Use the stay to test week shape, school relevance, and family energy.",
      links: [
        { label: "Test Stay", href: "/test-stay" },
        { label: "Weekday Reality", href: "/weekday-reality" },
        { label: "First Month Planner", href: "/first-month-planner" },
      ],
    },
    {
      title: "Housing-ready bundle",
      body: "Best when the move is grounded enough that a shortlist, budget band, and home brief are all strong enough to support a useful intro.",
      links: [
        { label: "Housing readiness", href: "/housing-intro-readiness" },
        { label: "Housing brief", href: "/housing-brief-builder" },
        { label: "Gaia Group", href: "/gaia-group" },
      ],
    },
  ];
}
