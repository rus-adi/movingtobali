import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import CommuteRealityChecker from "@/components/CommuteRealityChecker";
import { getAllContent } from "@/lib/content";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Commute reality",
  description: "See how traffic, school, work pressure, and after-school energy can change whether a Bali area still works for your family.",
  alternates: { canonical: "/commute-reality" },
};

export default function CommuteRealityPage() {
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
          pathname: "/commute-reality",
          name: "Commute reality",
          description: "A practical commute-friction checker for families planning Bali by area and school reality.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Decision tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Test the commute before it becomes the hidden cost of the move.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            Family moves rarely break because the house is ugly. They break because the route quietly eats the margin out of mornings, pickups, and adult energy.
          </p>
          <div className={btnRow + " mt-8"}>
            <a className={buttonPrimary} href="/compare-areas" data-track="commute_page_compare">Compare areas</a>
            <a className={buttonSecondary} href="/empathy-school-fit" data-track="commute_page_school_fit">Check school fit</a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <CommuteRealityChecker areas={areas} />
        </div>
      </section>

      <Section
        id="why-it-matters"
        title="Why commute reality changes bigger decisions"
        lead="This is one of the most common hidden pivots in the whole move. The commute question changes area shortlist, housing, after-school energy, and whether Empathy School still feels like a helpful anchor."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Area choice",
              body: "An area can sound perfect until the route reveals how much planning, buffer, and driver dependence it quietly demands.",
            },
            {
              title: "School fit",
              body: "Even a good school fit can feel shaky if the family has to pay for it through a route that everyone begins to dread.",
            },
            {
              title: "Housing brief",
              body: "Once commute pressure is visible, housing priorities often simplify fast: radius, reliability, and calmer mornings start outranking prettier details.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <SourceConversationPanel
        sourcePath="/commute-reality"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
