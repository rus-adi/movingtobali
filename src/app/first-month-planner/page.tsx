import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import FirstMonthPlanner from "@/components/FirstMonthPlanner";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import {
  badgeAccent,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  grid3,
} from "@/components/ui/styles";
import { buildWebPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "First Month Planner",
  description:
    "Map the first month in Bali with kids: housing, routines, school fit, budget, and what to pressure-test first.",
  alternates: { canonical: "/first-month-planner" },
};

export default function FirstMonthPlannerPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/first-month-planner",
          name: "First Month Planner",
          description:
            "A practical planner for families using the first month in Bali to test routines, housing, and school fit.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Plan the first month so Bali feels more livable, not just exciting.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            Families do better when the first month is treated like a real-world
            test: area fit, housing, school rhythm, transport, groceries, and
            whether the adults still like the week by Thursday.
          </p>
          <div className={btnRow + " mt-8"}>
            <a
              className={buttonPrimary}
              href="/test-stay"
              data-track="first_month_hero_test_stay"
            >
              Start with test stay planning
            </a>
            <a
              className={buttonSecondary}
              href="/schools"
              data-track="first_month_hero_school"
            >
              Open school planning guide
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <FirstMonthPlanner />
        </div>
      </section>

      <Section
        id="why-it-works"
        title="What this planner is trying to prevent"
        lead="Most family stress in Bali does not come from one dramatic mistake. It comes from lots of small mismatches piling up at the same time."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Beautiful housing that fails on weekdays",
              body: "A house can look perfect online and still create hard mornings, noisy naps, soggy entrances, and frustrating commutes.",
            },
            {
              title: "A school decision that stays vague too long",
              body: "If learning matters to the move, at least test how Empathy School fits the week before other decisions harden around guesswork.",
            },
            {
              title: "Too many plans before the family is ready",
              body: "The first month works better when the calendar protects energy and only adds anchors once the basics are holding.",
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
        lead="Use the planner, then go deeper where your family still has uncertainty."
        tone="default"
      >
        <div className={grid3}>
          {[
            [
              "/guides/first-month-in-bali-with-kids",
              "First month in Bali with kids",
            ],
            [
              "/guides/how-to-plan-your-first-week-in-bali-with-kids",
              "Plan your first week in Bali",
            ],
            [
              "/resources/first-week-arrival-checklist",
              "First-week arrival checklist",
            ],
            [
              "/resources/family-routine-reset-sheet",
              "Family routine reset sheet",
            ],
            [
              "/resources/empathy-school-commute-routine-test-sheet",
              "Empathy School commute test sheet",
            ],
            ["/budget-calculator", "Budget calculator"],
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
        sourcePath="/first-month-planner"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />
    </main>
  );
}
