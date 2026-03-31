import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import MoveTimelinePlanner from "@/components/MoveTimelinePlanner";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Move timeline",
  description: "Build a smarter sequence for moving to Bali with kids: what to decide now, later, and only after the family has real signal.",
  alternates: { canonical: "/move-timeline" },
};

export default function MoveTimelinePage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/move-timeline",
          name: "Move timeline",
          description: "A planning tool for sequencing a family move to Bali.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Build a timeline that keeps the move calm.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            A lot of Bali stress comes from solving the right decisions in the wrong order. Use this page to create a sequence that matches your timeline, your children’s needs, and whether Empathy School is part of the move.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <MoveTimelinePlanner />
        </div>
      </section>

      <Section
        id="why-it-works"
        title="What this timeline is trying to prevent"
        lead="Families do better when the move behaves like a sequence instead of a giant, emotional to-do list."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Research overload",
              body: "Looking at visas, schools, housing, neighborhoods, and routines all at once creates motion without much clarity.",
            },
            {
              title: "Early hard commitments",
              body: "The move gets riskier when deposits or long-term decisions happen before the family has tested how the week actually feels.",
            },
            {
              title: "School and commute left too vague",
              body: "If Empathy School matters, commute reality should shape the move earlier. If it does not, something else should anchor the weekly rhythm just as clearly.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <SourceConversationPanel
        sourcePath="/move-timeline"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
