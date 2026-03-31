import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import AreaMatcher from "@/components/AreaMatcher";
import { getAllContent } from "@/lib/content";
import { buildWebPageSchema } from "@/lib/schema";
import {
  badgeAccent,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  grid3,
} from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Area Match",
  description:
    "Narrow Bali down by family rhythm, commute tolerance, budget posture, and whether Empathy School is part of the move.",
  alternates: { canonical: "/area-match" },
};

export default function AreaMatchPage() {
  const areas = getAllContent("areas").map((item) => ({
    slug: item.slug,
    title: item.title,
    description: item.description,
    category: item.category,
    area: item.area,
  }));

  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/area-match",
          name: "Area Match",
          description:
            "A practical area-shortlisting tool for families moving to Bali.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Choose the Bali area that fits the week you actually want to live.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            Families do better when they shortlist areas by rhythm, commute, and
            daily friction instead of trying to pick a winner from Bali’s whole
            personality at once.
          </p>
          <div className={btnRow + " mt-8"}>
            <a
              className={buttonPrimary}
              href="/areas"
              data-track="area_match_hero_open_areas"
            >
              Browse all area guides
            </a>
            <a
              className={buttonSecondary}
              href="/compare-areas"
              data-track="area_match_hero_compare"
            >
              Compare two areas
            </a>
            <a
              className={buttonSecondary}
              href="/schools"
              data-track="area_match_hero_school"
            >
              Open school planning guide
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <AreaMatcher areas={areas} />
        </div>
      </section>

      <Section
        id="use-it-well"
        title="How to use the results well"
        lead="A shortlist becomes useful when it changes what you test next, not when it gives you one magic answer."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Test the route, not just the map pin",
              body: "The area only matters if the real route to groceries, activities, and Empathy School still feels sane when everyone is tired.",
            },
            {
              title: "Let the shortlist shape the budget",
              body: "Different areas quietly pull the housing and convenience budget in different directions. Use the shortlist before you lock the numbers.",
            },
            {
              title: "Only then move into housing mode",
              body: "Gaia Group is most useful once the area conversation has become specific enough to produce a real shortlist instead of a scatter of listings.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="next-reads"
        title="Useful next steps"
        lead="These pages help once the shortlist is down to two or three realistic options."
        tone="default"
      >
        <div className={grid3}>
          {[
            [
              "/guides/how-to-shortlist-bali-areas-with-kids",
              "How to shortlist Bali areas with kids",
            ],
            [
              "/guides/how-to-use-empathy-school-to-test-area-fit",
              "Use Empathy School to test area fit",
            ],
            ["/resources/area-shortlist-scorecard", "Area shortlist scorecard"],
            ["/resources/area-visit-notes-sheet", "Area visit notes sheet"],
            ["/compare-areas", "Compare two areas"],
            ["/commute-reality", "Commute reality"],
            ["/budget-calculator", "Budget calculator"],
            ["/housing", "Housing guide"],
          ].map(([href, title]) => (
            <a key={href} href={href} className={cardCls}>
              <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                {title}
              </h3>
              <div className="mt-6 text-sm font-semibold text-gray-900">
                Open →
              </div>
            </a>
          ))}
        </div>
      </Section>

      <SourceConversationPanel
        sourcePath="/area-match"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />
    </main>
  );
}
