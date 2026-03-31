import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import WeekdayRealityBuilder from "@/components/WeekdayRealityBuilder";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, cardCls, grid2, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Weekday reality tool",
  description: "Pressure-test a Bali move against the ordinary family week: school or camp anchor, commute, rain, work demands, after-school energy, and what daily life is really asking of you.",
  alternates: { canonical: "/weekday-reality" },
};

export default function WeekdayRealityPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/weekday-reality",
          name: "Weekday reality tool",
          description: "A practical tool for pressure-testing a Bali move against the ordinary family week.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Test the weekday, not only the dream.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            This is the page for the question underneath a lot of Bali research: what will our actual week feel like once it is not a holiday anymore? Use the tool to pressure-test commute, school or camp rhythm, food, rain, and the after-school window.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <WeekdayRealityBuilder />
        </div>
      </section>

      <Section
        id="easier-harder"
        title="What usually gets easier — and what usually gets heavier"
        lead="Families make better decisions when both halves are visible at once."
        tone="muted"
      >
        <div className={grid2}>
          <div className={cardCls}>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Often easier than expected</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-700">
              <li>Outdoor time and movement when the family finds the right rhythm.</li>
              <li>Food and errands once the same few defaults start repeating.</li>
              <li>Community once you stop searching widely and start repeating the same places.</li>
              <li>The move in general, once the family stops solving everything at once.</li>
            </ul>
          </div>
          <div className={cardCls}>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Often heavier than expected</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-700">
              <li>Longer daily drives, especially when pickup energy is already low.</li>
              <li>Wet afternoons without a backup plan.</li>
              <li>Sick days when the clinic route or household roles are still vague.</li>
              <li>Trying to make Bali feel magical every day instead of letting normal life settle in.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section
        id="next-questions"
        title="Open the next question, not twenty at once"
        lead="These are the pages that usually help once weekday reality becomes the real decision."
        tone="default"
      >
        <div className={grid3}>
          {[
            ["/daily-life", "Daily life", "Use the main daily-life hub to think about ordinary routines instead of only relocation logistics."],
            ["/guides/how-to-build-a-calm-weekday-rhythm-in-bali", "Calm weekday rhythm", "Build mornings, transport, food, child anchors, and evenings in a calmer order."],
            ["/guides/after-school-rhythm-in-bali-for-families", "After-school rhythm", "Plan the hardest and most underdesigned part of the family day."],
            ["/guides/getting-sick-in-bali-with-kids", "Getting sick in Bali", "Create a medical and household plan before the first fever or stomach bug arrives."],
            ["/guides/rainy-season-routines-in-bali-with-kids", "Rainy season routines", "Use wet weather as a planning test rather than a surprise."],
            ["/resources/weekday-reality-planner", "Weekday reality planner", "Copy the worksheet and test the real week in writing."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </Section>

      <SourceConversationPanel
        sourcePath="/weekday-reality"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
