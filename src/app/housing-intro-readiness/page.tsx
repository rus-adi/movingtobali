import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HousingIntroReadiness from "@/components/HousingIntroReadiness";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Housing intro readiness",
  description: "A practical filter for knowing whether your family is ready to use Gaia Group for housing support.",
  alternates: { canonical: "/housing-intro-readiness" },
};

export default function HousingIntroReadinessPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/housing-intro-readiness",
          name: "Housing intro readiness",
          description: "A housing-readiness tool for families planning a Bali move.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Check whether you are ready for a Gaia Group housing intro.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            The goal is not to make you wait forever. It is to avoid using housing support too early, when a little more clarity would make the first conversation much more useful.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <HousingIntroReadiness />
        </div>
      </section>

      <Section
        id="what-good-looks-like"
        title="What “ready enough” usually looks like"
        lead="You do not need perfect clarity. You do need enough structure that the housing conversation can narrow rather than expand."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Two or three serious areas",
              body: "Housing usually gets calmer once Bali has narrowed into a real shortlist instead of a map-wide mood board.",
            },
            {
              title: "A working range, not one dream number",
              body: "A strong intro usually includes a comfort band and a stretch ceiling so the shortlist behaves like a real family decision.",
            },
            {
              title: "Verification stronger than urgency",
              body: "If the plan still feels vulnerable to pretty photos and pressure, the timing is probably not right for housing intros yet.",
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
        sourcePath="/housing-intro-readiness"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
