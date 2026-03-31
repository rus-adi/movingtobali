import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, cardCls, grid2, grid3 } from "@/components/ui/styles";

const groups = [
  {
    title: "Before you say yes to Bali",
    lead: "These help when the move is still more question than plan.",
    items: [
      ["/resources/family-readiness-checklist", "Family readiness checklist"],
      ["/guides/should-we-move-to-bali-with-kids", "Should we move to Bali with kids?"],
      ["/guides/trial-move-vs-full-move-in-bali", "Trial move vs full move"],
      ["/budget-calculator", "Budget calculator"],
    ],
  },
  {
    title: "Before you plan the first trip or test stay",
    lead: "Use these to turn a short stay into a useful decision window.",
    items: [
      ["/test-stay", "Test stay"],
      ["/guides/two-week-test-stay-plan", "Two-week test stay plan"],
      ["/resources/test-stay-decision-scorecard", "Test stay decision scorecard"],
      ["/resources/30-60-90-bali-move-board", "30 / 60 / 90 move board"],
    ],
  },
  {
    title: "Before you request housing help",
    lead: "These keep the housing conversation specific enough to be useful.",
    items: [
      ["/housing", "Housing guide"],
      ["/resources/family-housing-brief-template", "Family housing brief template"],
      ["/resources/housing-viewing-scorecard", "Housing viewing scorecard"],
      ["/resources/lease-deposit-checklist", "Lease + deposit checklist"],
    ],
  },
  {
    title: "When family shape changes the whole plan",
    lead: "These help when age alone is not enough and the move needs to reflect adult bandwidth, child temperament, or a slower tempo.",
    items: [
      ["/family-path-match", "Family path match"],
      ["/resources/family-path-decision-sheet", "Family path decision sheet"],
      ["/resources/remote-work-family-week-grid", "Remote-work family week grid"],
      ["/resources/single-parent-stability-checklist", "Single-parent stability checklist"],
      ["/resources/slower-relocation-checkpoint-list", "Slower relocation checkpoint list"],
    ],
  },
  {
    title: "Before you treat school as solved",
    lead: "These help families use Empathy School as a real fit test, not a vague future note.",
    items: [
      ["/schools", "School planning guide"],
      ["/empathy-school-fit", "Empathy School fit"],
      ["/empathy-school-tour-prep", "Empathy School tour prep"],
      ["/resources/empathy-school-fit-notes-sheet", "Fit notes sheet"],
    ],
  },
  {
    title: "Before arrival week gets messy",
    lead: "These help the first days behave more like a landing than a scramble.",
    items: [
      ["/first-month-planner", "First month planner"],
      ["/resources/first-week-arrival-checklist", "First-week arrival checklist"],
      ["/resources/family-routine-reset-sheet", "Family routine reset sheet"],
      ["/guides/how-to-plan-your-first-week-in-bali-with-kids", "Plan your first week in Bali"],
    ],
  },
  {
    title: "When the real question is ordinary family life",
    lead: "These are the pages to use when Bali looks exciting, but you need the weekday to feel believable.",
    items: [
      ["/daily-life", "Daily life"],
      ["/weekday-reality", "Weekday reality tool"],
      ["/resources/weekday-reality-planner", "Weekday reality planner"],
      ["/resources/after-school-rhythm-planner", "After-school rhythm planner"],
    ],
  },
  {
    title: "When two good options need a clearer yes",
    lead: "This cluster is for comparison mode: side-by-side tools that reduce circling and make tradeoffs visible.",
    items: [
      ["/compare-areas", "Compare areas"],
      ["/commute-reality", "Commute reality"],
      ["/test-stay-vs-full-move", "Test stay vs full move"],
      ["/housing-style-compare", "Housing style compare"],
      ["/resources/two-area-comparison-sheet", "Two-area comparison sheet"],
      ["/resources/empathy-school-commute-decision-grid", "Empathy School commute decision grid"],
    ],
  },
];

export const metadata: Metadata = {
  title: "Decision checklists",
  description: "A practical hub of checklists, scorecards, and decision tools for families planning a move to Bali.",
  alternates: { canonical: "/decision-checklists" },
};

export default function DecisionChecklistsPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/decision-checklists",
          name: "Decision checklists",
          description: "A hub of practical decision checklists for families moving to Bali.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Checklist hub</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Use checklists where they change the decision.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            The goal is not to collect PDFs. It is to use the right checklist at the right moment: before a test stay, before a lease, before a school tour, and before arrival week starts filling up with avoidable friction.
          </p>
        </div>
      </section>

      <Section
        id="top-picks"
        title="The most useful checklists first"
        lead="These are the ones most likely to reduce overwhelm quickly."
        tone="default"
      >
        <div className={grid3}>
          {[
            ["/resources/family-readiness-checklist", "Family readiness checklist"],
            ["/resources/30-60-90-bali-move-board", "30 / 60 / 90 move board"],
            ["/resources/test-stay-decision-scorecard", "Test stay decision scorecard"],
            ["/resources/area-shortlist-scorecard", "Area shortlist scorecard"],
            ["/resources/family-housing-brief-template", "Family housing brief template"],
            ["/resources/first-week-arrival-checklist", "First-week arrival checklist"],
            ["/resources/weekday-reality-planner", "Weekday reality planner"],
            ["/resources/family-path-decision-sheet", "Family path decision sheet"],
            ["/resources/two-area-comparison-sheet", "Two-area comparison sheet"],
            ["/resources/empathy-school-commute-decision-grid", "Empathy School commute decision grid"],
            ["/resources/empathy-school-fit-notes-sheet", "Empathy School fit notes sheet"],
          ].map(([href, title]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </Section>

      {groups.map((group, index) => (
        <Section key={group.title} id={`group-${index}`} title={group.title} lead={group.lead} tone={index % 2 === 0 ? "muted" : "default"}>
          <div className={grid2}>
            {group.items.map(([href, title]) => (
              <a key={href} href={href} className={cardCls}>
                <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
                <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
              </a>
            ))}
          </div>
        </Section>
      ))}
    </main>
  );
}
