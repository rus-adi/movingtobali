import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { badge, badgeAccent, cardCls, grid3 } from "@/components/ui/styles";

type IntentData = {
  bestFor: string;
  pairWith: { label: string; href: string }[];
  watchFor: string;
};

function inferIntent(item: ContentItem): IntentData {
  const slug = `${item.kind}:${item.slug}`.toLowerCase();

  if (item.kind === "areas") {
    return {
      bestFor: "Families narrowing a realistic shortlist who need to compare weekday rhythm, school relevance, traffic tolerance, and what the area feels like after the first impression wears off.",
      pairWith: [
        { label: "Area Match", href: "/area-match" },
        { label: "Compare Areas", href: "/compare-areas" },
        { label: "Commute Reality", href: "/commute-reality" },
      ],
      watchFor: "Do not choose an area from daytime mood or pretty photos alone. The family week usually changes once the school run, work windows, and repeated driving enter the picture.",
    };
  }

  if (slug.includes("housing") || slug.includes("rent") || slug.includes("gaia")) {
    return {
      bestFor: "Families who are trying to slow housing down until the shortlist, budget band, and dealbreakers are specific enough to support a calmer intro.",
      pairWith: [
        { label: "Housing readiness", href: "/housing-intro-readiness" },
        { label: "Housing brief", href: "/housing-brief-builder" },
        { label: "Gaia Group", href: "/gaia-group" },
      ],
      watchFor: "Pretty listing photos can outrun a weak brief. Verify identity, payment steps, contract terms, and commute reality before money moves.",
    };
  }

  if (slug.includes("school") || slug.includes("empathy")) {
    return {
      bestFor: "Families deciding whether Empathy School should shape area, commute, and the weekly rhythm early in the move instead of sitting off to the side.",
      pairWith: [
        { label: "Empathy School fit", href: "/empathy-school-fit" },
        { label: "Tour prep", href: "/empathy-school-tour-prep" },
        { label: "Commute reality", href: "/commute-reality" },
      ],
      watchFor: "Do not evaluate school in isolation from the rest of the week. A school can still be a poor fit if the commute, energy load, or family routine collapses around it.",
    };
  }

  if (slug.includes("visa")) {
    return {
      bestFor: "Families who want experience-based guidance, sequencing, and practical questions before they move into official verification and paperwork.",
      pairWith: [
        { label: "Official links", href: "/official-links" },
        { label: "Plan your move", href: "/plan-your-move" },
        { label: "Decision checklists", href: "/decision-checklists" },
      ],
      watchFor: "Visa rules and fees can change. Use this page to understand the lane you are in, then confirm anything fast-moving through official sources before you act.",
    };
  }

  if (slug.includes("cost") || slug.includes("budget")) {
    return {
      bestFor: "Families who need the numbers to feel less dreamy and more connected to a likely area, housing style, transport pattern, and whether Empathy School belongs in the week.",
      pairWith: [
        { label: "Budget calculator", href: "/budget-calculator" },
        { label: "Area Match", href: "/area-match" },
        { label: "Housing style compare", href: "/housing-style-compare" },
      ],
      watchFor: "A budget that is not tied to area, commute, and family rhythm usually feels precise while still being too abstract to guide the move well.",
    };
  }

  if (slug.includes("daily") || slug.includes("week") || slug.includes("routine") || slug.includes("settling")) {
    return {
      bestFor: "Families asking the most useful question in the process: can we actually live like this week after week once food, rain, work, and child energy are all part of the plan?",
      pairWith: [
        { label: "Weekday reality", href: "/weekday-reality" },
        { label: "First month planner", href: "/first-month-planner" },
        { label: "Daily life", href: "/daily-life" },
      ],
      watchFor: "The move often breaks around ordinary routines, not big-ticket decisions. Treat mornings, pickups, meals, and downtime as core planning work.",
    };
  }

  if (slug.includes("test-stay") || slug.includes("trial")) {
    return {
      bestFor: "Families who want to turn a short stay into a real decision tool instead of treating it like a holiday that creates false confidence.",
      pairWith: [
        { label: "Test Stay", href: "/test-stay" },
        { label: "Weekday reality", href: "/weekday-reality" },
        { label: "Tour prep", href: "/empathy-school-tour-prep" },
      ],
      watchFor: "A short stay only helps if it pressures the right questions: area, school fit, family energy, cost, and the pace of ordinary life.",
    };
  }

  return {
    bestFor: "Families who want one calmer next step instead of trying to solve every Bali question at once.",
    pairWith: [
      { label: "Plan your move", href: "/plan-your-move" },
      { label: "How this hub works", href: "/how-this-hub-works" },
      { label: "Conversation paths", href: "/conversation-paths" },
    ],
    watchFor: "Use this page as part of a sequence. The hub works best when each page makes the next decision clearer, not when it becomes one more thing you read in isolation.",
  };
}

export default function PageIntentStrip({ item }: { item: ContentItem }) {
  const intent = inferIntent(item);

  return (
    <div className={grid3}>
      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Best for</span>
          <span className={badge}>Use this page well</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-700">{intent.bestFor}</p>
      </div>

      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Pair this with</span>
          <span className={badge}>Keep the sequence strong</span>
        </div>
        <div className="mt-4 grid gap-3">
          {intent.pairWith.map((link) => (
            <Link
              key={`${item.slug}-${link.href}`}
              href={link.href}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
              data-track="page_intent_open_link"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Watch for</span>
          <span className={badge}>Common mistake</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-700">{intent.watchFor}</p>
      </div>
    </div>
  );
}
