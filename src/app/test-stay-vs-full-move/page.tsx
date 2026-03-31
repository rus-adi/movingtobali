import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid3 } from "@/components/ui/styles";

const shapes = [
  {
    title: "Test stay",
    kicker: "Lowest commitment",
    bestFor: "Families who want signal before they want certainty.",
    solves: [
      "Whether Bali feels good on ordinary days, not just on holiday energy.",
      "Which areas are even worth deeper attention.",
      "Whether Empathy School should move from ‘maybe’ to ‘real question’.",
    ],
    watchouts: [
      "A short stay can still lie if you only live the best hours of the day.",
      "Temporary housing can make an area look easier or harder than it really is.",
    ],
    school: "Use Empathy School as a test of commute, family rhythm, and what kind of week you would actually be building.",
    housing: "Use housing to learn, not to commit. This is not the stage for romantic long leases.",
  },
  {
    title: "Trial term / semi-settled stretch",
    kicker: "Middle path",
    bestFor: "Families who need more than a quick test but still want review points before they harden the move.",
    solves: [
      "What a more realistic month or term feels like.",
      "Whether the first routines survive once novelty wears off.",
      "Whether the area, school question, and budget still cooperate after the first few weeks.",
    ],
    watchouts: [
      "You can drift into a semi-permanent setup without making the key decisions cleaner.",
      "Families sometimes overspend here because they are paying for both flexibility and convenience at once.",
    ],
    school: "This is often the best stage for tours, camp, or a more grounded school-fit conversation.",
    housing: "Housing can get more serious here, but only after the route and rhythm keep proving themselves.",
  },
  {
    title: "Full move",
    kicker: "Highest commitment",
    bestFor: "Families who already have strong signal, a clear reason for timing, or less appetite for prolonged uncertainty.",
    solves: [
      "Lets the family build real systems immediately instead of hovering in test mode.",
      "Can reduce the emotional drag of a half-move if timing is already decided.",
      "Makes school, housing, and weekly rhythm decisions more concrete from day one.",
    ],
    watchouts: [
      "The hidden cost is optionality. Wrong assumptions get expensive faster.",
      "Families sometimes lock housing and routine before the child or commute truth has surfaced.",
    ],
    school: "Only let school anchor a full move when the fit question has been treated seriously, not romantically.",
    housing: "Housing needs stronger verification and a more honest brief because it becomes harder to unwind mistakes.",
  },
] as const;

export const metadata: Metadata = {
  title: "Test stay vs full move",
  description: "Compare the main move shapes families use when deciding whether and how to relocate to Bali with kids.",
  alternates: { canonical: "/test-stay-vs-full-move" },
};

export default function TestStayVsFullMovePage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/test-stay-vs-full-move",
          name: "Test stay vs full move",
          description: "A side-by-side comparison of move shapes for families exploring Bali.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Move-shape comparison</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Compare move shapes before you overcommit.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            The question is not “What is the bravest move?” It is which move shape gives your family the best signal with the least avoidable damage.
          </p>
          <div className={btnRow + " mt-8"}>
            <a className={buttonPrimary} href="/move-timeline" data-track="move_shape_timeline">Build the timeline</a>
            <a className={buttonSecondary} href="/test-stay" data-track="move_shape_test_stay">Open test-stay hub</a>
          </div>
        </div>
      </section>

      <Section
        id="compare"
        title="The main move shapes side by side"
        lead="Most families do not need more courage. They need a move shape that matches their current uncertainty, energy, and how reversible the next step should be."
        tone="default"
      >
        <div className={grid3}>
          {shapes.map((shape) => (
            <div key={shape.title} className={cardCls}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">{shape.kicker}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{shape.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700"><strong>Best for:</strong> {shape.bestFor}</p>
              <div className="mt-4 text-sm font-semibold text-gray-900">What it solves</div>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-700">
                {shape.solves.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="mt-4 text-sm font-semibold text-gray-900">Watchouts</div>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-700">
                {shape.watchouts.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="mt-4 text-sm font-semibold text-gray-900">How school enters</div>
              <p className="mt-2 text-sm leading-6 text-gray-700">{shape.school}</p>
              <div className="mt-4 text-sm font-semibold text-gray-900">How housing changes</div>
              <p className="mt-2 text-sm leading-6 text-gray-700">{shape.housing}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="what-changes"
        title="What changes if you choose the lower-commitment path first"
        lead="A test stay or trial stretch does not only reduce risk. It changes the quality of the later housing, area, and school decisions."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Area choice gets cleaner",
              body: "You stop arguing about Bali as a fantasy and start comparing places based on actual route, mood, and family energy.",
            },
            {
              title: "Empathy School becomes less abstract",
              body: "You can test commute, campus feel, and whether school would calm the move or complicate it before acting like the decision is already made.",
            },
            {
              title: "Housing becomes narrower",
              body: "A better move shape usually means fewer useless listings, a better brief, and less chance that urgency overrides verification.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h3 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-700">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
