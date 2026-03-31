import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import AreaCompareTool from "@/components/AreaCompareTool";
import { getAllContent } from "@/lib/content";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Compare areas",
  description: "Compare two Bali areas side by side for family rhythm, commute, budget posture, and whether Empathy School is part of the move.",
  alternates: { canonical: "/compare-areas" },
};

export default function CompareAreasPage() {
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
          pathname: "/compare-areas",
          name: "Compare areas",
          description: "A side-by-side Bali area comparison tool for families.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Comparison tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Compare two Bali areas before the shortlist gets emotional.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            This is the moment after Area Match has done its job. You are no longer asking “Which area is best?” You are asking which tradeoff better protects your real week.
          </p>
          <div className={btnRow + " mt-8"}>
            <a className={buttonPrimary} href="/area-match" data-track="compare_page_area_match">Use Area Match first</a>
            <a className={buttonSecondary} href="/commute-reality" data-track="compare_page_commute">Test commute reality</a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <AreaCompareTool areas={areas} />
        </div>
      </section>

      <Section
        id="how-to-read"
        title="How to read the comparison well"
        lead="A good comparison changes what you test next. It does not let you skip the lived reality of Bali streets, school-time traffic, or tired-child afternoons."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Compare the week, not the vibe",
              body: "The better question is what the area does to mornings, groceries, pickups, adult work, and whether the family still likes each other by dinner.",
            },
            {
              title: "Let school affect the shortlist early",
              body: "If Empathy School may matter, let that commute influence the comparison before you grow attached to a prettier but harder radius.",
            },
            {
              title: "Use the winning area to narrow housing",
              body: "Once one area clearly protects the week better, the housing conversation gets sharper and Gaia Group becomes much more useful.",
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
        sourcePath="/compare-areas"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
