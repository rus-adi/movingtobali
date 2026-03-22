import type { ContentItem } from "@/lib/content";
import { buildContactHref } from "@/lib/contact";

export type SmartAction = {
  label: string;
  href: string;
  body: string;
  variant: "primary" | "secondary";
  routeId?: string;
  slot: "primary" | "secondary" | "conversation";
};

export type SmartActionGroup = {
  title: string;
  lead: string;
  actions: SmartAction[];
};

function keyFor(item: ContentItem): string {
  return `${item.kind}:${item.slug} ${item.category || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
}

function byTag(item: ContentItem, needle: string): boolean {
  return keyFor(item).includes(needle.toLowerCase());
}

function planningHref(item: ContentItem): string {
  return buildContactHref("General move planning", { from: pathForItem(item), routeId: "planning" });
}

function testStayHref(item: ContentItem): string {
  return buildContactHref("Test stay plan", { from: pathForItem(item), routeId: "test-stay" });
}

function areasBudgetHref(item: ContentItem): string {
  return buildContactHref("Area + budget question", { from: pathForItem(item), routeId: "areas-budget" });
}

function housingHref(item: ContentItem): string {
  return buildContactHref("Housing intro", { from: pathForItem(item), partner: "gaia-group-bali", routeId: "housing-intro" });
}

function schoolHref(item: ContentItem): string {
  return buildContactHref("Empathy School fit", { from: pathForItem(item), routeId: "empathy-school" });
}

export function pathForItem(item: ContentItem): string {
  return item.kind === "pillars" ? `/${item.slug}` : `/${item.kind}/${item.slug}`;
}

export function getSmartActionGroup(item: ContentItem): SmartActionGroup {
  const key = keyFor(item);

  if (item.kind === "areas") {
    return {
      title: "Most families use an area page like this in a three-step sequence",
      lead: "Shortlist the area, compare it against one other option, then decide whether the school run and weekly radius still feel worth it.",
      actions: [
        {
          label: "Compare this area against another",
          href: "/compare-areas",
          body: "Turn vibe into a side-by-side decision: rhythm, traffic, family fit, and what the tradeoffs look like once the week starts repeating.",
          variant: "primary",
          slot: "primary",
        },
        {
          label: "Run the commute reality check",
          href: "/commute-reality",
          body: "Useful when Empathy School, work calls, or a tired pickup are likely to change how the area feels in real life.",
          variant: "secondary",
          slot: "secondary",
        },
        {
          label: "Ask an area + budget question",
          href: areasBudgetHref(item),
          body: "Best once your shortlist is down to two or three realistic areas and you want help making the tradeoffs more practical.",
          variant: "secondary",
          routeId: "areas-budget",
          slot: "conversation",
        },
      ],
    };
  }

  if (byTag(item, "housing") || byTag(item, "rent") || byTag(item, "lease") || byTag(item, "gaia")) {
    return {
      title: "Use the housing path as a sequence, not a listing hunt",
      lead: "The strongest housing decisions usually come after the brief is clear enough that Gaia Group can narrow the search instead of widening it.",
      actions: [
        {
          label: "Build the housing brief",
          href: "/housing-brief-builder",
          body: "Clarify timing, area direction, budget band, and non-negotiables before you ask for listings.",
          variant: "primary",
          slot: "primary",
        },
        {
          label: "Check housing intro readiness",
          href: "/housing-intro-readiness",
          body: "Use this when you need to know whether the shortlist is mature enough for a useful Gaia Group intro.",
          variant: "secondary",
          slot: "secondary",
        },
        {
          label: "Request a Gaia Group intro",
          href: housingHref(item),
          body: "Best when your weekly needs, likely areas, and budget posture are already grounded enough to support a real search.",
          variant: "secondary",
          routeId: "housing-intro",
          slot: "conversation",
        },
      ],
    };
  }

  if (byTag(item, "school") || byTag(item, "empathy") || byTag(item, "camp") || byTag(item, "tour")) {
    return {
      title: "The school question works best when it changes the rest of the move",
      lead: "Use the fit tool, the tour-prep lane, and then a focused conversation once Empathy School starts shaping area choice or weekly rhythm.",
      actions: [
        {
          label: "Use the school fit tool",
          href: "/empathy-school-fit",
          body: "Pressure-test whether Empathy School should anchor the move, or whether the school question still needs more signal first.",
          variant: "primary",
          slot: "primary",
        },
        {
          label: "Plan the tour like a parent",
          href: "/empathy-school-tour-prep",
          body: "Protect the questions that actually matter: fit, transitions, commute reality, and the family week around pickup time.",
          variant: "secondary",
          slot: "secondary",
        },
        {
          label: "Ask about Empathy School fit",
          href: schoolHref(item),
          body: "Most useful when you can say what you want school to clarify for your child, your mornings, or your area shortlist.",
          variant: "secondary",
          routeId: "empathy-school",
          slot: "conversation",
        },
      ],
    };
  }

  if (byTag(item, "cost") || byTag(item, "budget")) {
    return {
      title: "Use budget pages to make the move more specific, not more abstract",
      lead: "The budget becomes more useful once it is tied to an area shortlist, likely housing style, and whether Empathy School belongs in the week.",
      actions: [
        {
          label: "Open the budget calculator",
          href: "/budget-calculator",
          body: "Build a working low / mid / high range before you try to optimise tiny line items.",
          variant: "primary",
          slot: "primary",
        },
        {
          label: "Compare housing styles",
          href: "/housing-style-compare",
          body: "Useful when you need to feel how villa style, location, and commute can change the real monthly picture.",
          variant: "secondary",
          slot: "secondary",
        },
        {
          label: "Ask an area + budget question",
          href: areasBudgetHref(item),
          body: "Best once the move is concrete enough that a family budget can be matched to two or three likely areas.",
          variant: "secondary",
          routeId: "areas-budget",
          slot: "conversation",
        },
      ],
    };
  }

  if (byTag(item, "visa") || byTag(item, "official")) {
    return {
      title: "Keep the visa lane narrow and calm",
      lead: "Use visa pages to understand the lane you are in, then verify changing details through official sources before you act.",
      actions: [
        {
          label: "Open official links",
          href: "/official-links",
          body: "Use this when a rule, fee, or entry step feels time-sensitive and should be checked at the source.",
          variant: "primary",
          slot: "primary",
        },
        {
          label: "Open decision checklists",
          href: "/decision-checklists",
          body: "Bring the visa decision back into the wider move sequence instead of letting paperwork dominate everything.",
          variant: "secondary",
          slot: "secondary",
        },
        {
          label: "Ask a planning question",
          href: planningHref(item),
          body: "Most useful when the visa question is really blocking the order of the move rather than a single form field.",
          variant: "secondary",
          routeId: "planning",
          slot: "conversation",
        },
      ],
    };
  }

  if (byTag(item, "test-stay") || byTag(item, "trial") || byTag(item, "first month")) {
    return {
      title: "A good short stay should answer a real question",
      lead: "The best test stays protect weekday signal: area fit, school relevance, daily rhythm, and whether the family gets calmer or more stretched.",
      actions: [
        {
          label: "Use the weekday reality tool",
          href: "/weekday-reality",
          body: "Pressure-test the ordinary week instead of letting the stay drift into holiday energy.",
          variant: "primary",
          slot: "primary",
        },
        {
          label: "Build the first month plan",
          href: "/first-month-planner",
          body: "Useful when the stay is long enough that routines, transport, and child energy need more structure.",
          variant: "secondary",
          slot: "secondary",
        },
        {
          label: "Ask about a test stay",
          href: testStayHref(item),
          body: "Best once you know what you want the stay to prove or disprove before you arrive.",
          variant: "secondary",
          routeId: "test-stay",
          slot: "conversation",
        },
      ],
    };
  }

  if (byTag(item, "daily") || byTag(item, "routine") || byTag(item, "community") || byTag(item, "settling")) {
    return {
      title: "Daily-life pages matter most when they change the next week",
      lead: "Protect the ordinary anchors early: morning loop, food defaults, transport, one child anchor, and a calmer evening reset.",
      actions: [
        {
          label: "Build the weekday reality",
          href: "/weekday-reality",
          body: "Translate the page into a real family week with mornings, pickups, work windows, and tired-child energy.",
          variant: "primary",
          slot: "primary",
        },
        {
          label: "Use the first month planner",
          href: "/first-month-planner",
          body: "Helpful when the move is becoming real enough that you need a calmer first-month structure instead of more ideas.",
          variant: "secondary",
          slot: "secondary",
        },
        {
          label: "Ask a planning question",
          href: planningHref(item),
          body: "Use this when the week still feels broad and you want help sequencing the next decision instead of reading more pages.",
          variant: "secondary",
          routeId: "planning",
          slot: "conversation",
        },
      ],
    };
  }

  return {
    title: "Keep the next step smaller than the whole move",
    lead: "This hub works best when each page leads into one clearer decision, one useful tool, and one focused conversation when you need it.",
    actions: [
      {
        label: "Plan your move",
        href: "/plan-your-move",
        body: "Return to the planning system if the move still feels broad and you need the order of decisions again.",
        variant: "primary",
        slot: "primary",
      },
      {
        label: "Open decision checklists",
        href: "/decision-checklists",
        body: "Use the checklists when you want the fastest version of what to decide now, later, and not yet.",
        variant: "secondary",
        slot: "secondary",
      },
      {
        label: "Ask a planning question",
        href: planningHref(item),
        body: "Best when you know what feels stuck but want help choosing the strongest next move.",
        variant: "secondary",
        routeId: "planning",
        slot: "conversation",
      },
    ],
  };
}
