import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import HousingBriefBuilder from "@/components/HousingBriefBuilder";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Housing brief builder",
  description: "Build a cleaner first message for Gaia Group or any Bali housing conversation that needs real family constraints.",
  alternates: { canonical: "/housing-brief-builder" },
};

export default function HousingBriefBuilderPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/housing-brief-builder",
          name: "Housing brief builder",
          description: "A copyable housing brief builder for families moving to Bali.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Tool</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Build the housing message before you start browsing harder.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            The first housing brief does not need to be beautiful. It needs to be specific enough that Gaia Group — or any agent — understands your real timing, shortlist, budget band, and what the family week actually needs from the home.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <HousingBriefBuilder />
        </div>
      </section>

      <Section
        id="why-it-helps"
        title="Why this is worth doing"
        lead="A better brief usually saves more stress than another hour of listing research."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "You stop leading with aesthetics",
              body: "The brief pushes the conversation toward routines, roads, bedrooms, budget posture, and how the family actually lives.",
            },
            {
              title: "The shortlist gets smaller faster",
              body: "Agents and partners can be more useful when you are not asking them to solve every version of Bali at once.",
            },
            {
              title: "It surfaces the hidden choices",
              body: "Commute, work needs, dealbreakers, and whether Empathy School matters usually become clearer while you are writing the message.",
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
        sourcePath="/housing-brief-builder"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
