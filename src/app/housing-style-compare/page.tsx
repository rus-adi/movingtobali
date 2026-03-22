import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid3 } from "@/components/ui/styles";

const styles = [
  {
    title: "Temporary / landing stay",
    kicker: "Best first stage",
    bestFor: "Families still testing area fit, routine, or whether Empathy School should shape the radius.",
    wins: [
      "Keeps optionality high while you learn the real week.",
      "Lets you test route, noise, groceries, and sleep without pretending the first house must be forever.",
    ],
    watchouts: [
      "Can hide true cost or route friction if it is too convenient or too detached from real life.",
      "Needs a clear end date so the family does not drift into expensive uncertainty.",
    ],
  },
  {
    title: "Standalone villa / family house",
    kicker: "More autonomy",
    bestFor: "Families who already understand the area and want more control over rhythm, storage, work corners, and how the house runs.",
    wins: [
      "Can support a stronger family routine once the area choice is genuinely clear.",
      "Often better for making the house behave like a real home instead of a travel stop.",
    ],
    watchouts: [
      "Beauty can hide route problems, noise, or maintenance issues that only show up after move-in.",
      "Verification, receipts, contract clarity, and who fixes what matter much more here.",
    ],
  },
  {
    title: "Managed / serviced home",
    kicker: "Convenience-biased",
    bestFor: "Families willing to pay more to reduce setup friction during a shorter stay or a demanding first stage.",
    wins: [
      "Can reduce admin load when bandwidth is already stretched.",
      "Useful when the family values a smoother first month more than optimizing every cost line.",
    ],
    watchouts: [
      "Convenience can mask the fact that the area itself is not right for your longer week.",
      "The cost often climbs faster, so it is important not to mistake comfort for long-term fit.",
    ],
  },
] as const;

export const metadata: Metadata = {
  title: "Housing style compare",
  description: "Compare common family housing styles in Bali before the search gets driven by pretty listings instead of your actual week.",
  alternates: { canonical: "/housing-style-compare" },
};

export default function HousingStyleComparePage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/housing-style-compare",
          name: "Housing style compare",
          description: "A side-by-side comparison of family housing styles in Bali.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Housing comparison</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Choose the housing style that fits the stage of the move.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            Families often compare individual listings too early. Start by deciding what kind of housing should carry this stage of the move at all.
          </p>
          <div className={btnRow + " mt-8"}>
            <a className={buttonPrimary} href="/housing-brief-builder" data-track="housing_style_brief">Build the housing brief</a>
            <a className={buttonSecondary} href="/gaia-group" data-track="housing_style_gaia">Open Gaia Group</a>
          </div>
        </div>
      </section>

      <Section
        id="styles"
        title="The main family housing styles"
        lead="The right question is not just what the house looks like. It is what the house needs to do for the family at this exact stage."
        tone="default"
      >
        <div className={grid3}>
          {styles.map((style) => (
            <div key={style.title} className={cardCls}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{style.kicker}</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{style.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600"><strong>Best for:</strong> {style.bestFor}</p>
              <div className="mt-4 text-sm font-semibold text-gray-900">What it gives you</div>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-600">
                {style.wins.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="mt-4 text-sm font-semibold text-gray-900">Watchouts</div>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-600">
                {style.watchouts.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="what-changes"
        title="What changes if you choose the wrong style too early"
        lead="This is where the search often gets expensive. The wrong style can force the family into extra admin, false confidence, or a level of commitment the move has not yet earned."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Too much house, not enough certainty",
              body: "A full villa only helps if the area and commute are already good enough to support it. Otherwise the house becomes a polished version of the wrong week.",
            },
            {
              title: "Too much convenience, not enough signal",
              body: "A managed stay can make the move feel easier while hiding whether the family would still like the area once ordinary life starts asking more of it.",
            },
            {
              title: "Better sequence, calmer search",
              body: "Once the move stage is clear, Gaia Group can help more efficiently because the brief becomes narrower, more honest, and less driven by random listing excitement.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h3 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
