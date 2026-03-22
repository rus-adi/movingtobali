import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import FamilyPathMatcher from "@/components/FamilyPathMatcher";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Family path match",
  description: "Match your family’s child stage, move shape, and real-life constraints to the Bali path that should guide your next decisions.",
  alternates: { canonical: "/family-path-match" },
};

export default function FamilyPathMatchPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/family-path-match",
          name: "Family path match",
          description: "A practical tool for choosing the family path that should guide the next Bali move decisions.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Family path tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Choose the version of Bali your family is actually trying to build.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            This tool helps families stop treating every guide equally. Match your child stage, move tempo, adult bandwidth, and family pattern to the path that should shape the next few decisions first.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <FamilyPathMatcher />
        </div>
      </section>

      <Section
        id="what-changes"
        title="What usually changes the move most"
        lead="The biggest difference is rarely just the child’s age. It is usually the combination of child pattern, adult bandwidth, and how fast the family is trying to force clarity."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Child reality",
              body: "A slower-to-warm-up child, a very active child, and a toddler can all want completely different versions of Bali — even before area and housing enter the picture.",
            },
            {
              title: "Adult carrying capacity",
              body: "When one adult is already stretched, the wrong commute, the wrong house, or too many moving parts can make Bali feel heavier long before anything looks wrong from the outside.",
            },
            {
              title: "Move tempo",
              body: "Some families need a fast answer. Others make better decisions through a slower sequence: test stay, review, area shortlist, then stronger commitments.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="pair-with"
        title="Pair this tool with the right pages"
        lead="Use the path match first, then move into the planning, school, or daily-life pages that make the biggest questions less vague."
        tone="default"
      >
        <div className={grid3}>
          {[
            ["/family-paths", "Family paths hub", "Browse all the stage, pattern, and move-shape guides in one place."],
            ["/plan-your-move", "Plan your move", "Use the planning hub once you know which family lens should guide the move."],
            ["/resources/family-path-decision-sheet", "Family path decision sheet", "Write down the primary path, the secondary path, and the decisions they change."],
            ["/resources/remote-work-family-week-grid", "Remote-work family week grid", "Best for families who need work calls, child rhythm, and housing reality to line up."],
            ["/resources/slower-relocation-checkpoint-list", "Slower relocation checkpoint list", "Useful when you want the move to stay reversible for longer."],
            ["/empathy-school-fit", "Empathy School fit", "Use this when school may become part of the family path rather than a separate future question."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </Section>
    </main>
  );
}
