import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import EmpathySchoolFitBuilder from "@/components/EmpathySchoolFitBuilder";
import ParentVoiceStrip from "@/components/ParentVoiceStrip";
import LearnedHardWay from "@/components/LearnedHardWay";
import TrustMetaStrip from "@/components/TrustMetaStrip";
import { buildWebPageSchema } from "@/lib/schema";
import { getHardLessons, getScenarioVoices } from "@/lib/proof";
import { badgeAccent, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Empathy School fit",
  description: "A practical tool for deciding whether Empathy School should anchor your Bali move, and how to test fit through tours, commute reality, and the weekly rhythm.",
  alternates: { canonical: "/empathy-school-fit" },
};

export default function EmpathySchoolFitPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/empathy-school-fit",
          name: "Empathy School fit",
          description: "A practical tool for deciding whether Empathy School should anchor a family move to Bali.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Empathy School fit</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Decide whether Empathy School should shape the move now.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">
            This page is for families who do not want school to stay vague for too long. Use it to judge whether Empathy School deserves to anchor area, commute, and weekly rhythm now — or whether the calmer next step is a tour, a test stay, or a direct conversation first.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <EmpathySchoolFitBuilder />
        </div>
      </section>

      <Section
        id="what-fit-really-means"
        title="What school fit actually means in a Bali move"
        lead="Families usually make better decisions when fit stays connected to the rest of the move instead of becoming an isolated school opinion."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Campus feel",
              body: "Notice the environment, the adult presence, and whether you can picture your child there once the novelty wears off.",
            },
            {
              title: "Commute reality",
              body: "A school can feel wonderful and still make the wider move heavier than expected if the route stretches the week too far.",
            },
            {
              title: "Family rhythm",
              body: "The real question is not only whether you like the school. It is whether the whole family day still feels workable with school inside it.",
            },
          ].map((item) => (
            <div key={item.title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="proof"
        title="What families notice when school fit becomes real"
        lead="This proof layer uses composite family scenarios so the page feels more grounded without claiming direct testimonials we have not published yet."
        tone="default"
      >
        <div className="grid gap-10">
          <TrustMetaStrip
            updated="2026-03-22"
            title="What this school-fit page is for"
            body="The purpose is not to force a yes. It is to help a family decide whether Empathy School should shape area, commute, and timing decisions now, later, or only after a calmer test."
            links={[
              { href: "/what-families-notice", label: "Open the proof hub" },
              { href: "/schools", label: "School planning guide" },
            ]}
          />
          <ParentVoiceStrip
            title="What families tend to notice around Empathy School"
            lead="These composite scenarios reflect recurring patterns around tours, school-first moves, and using school to test the weekly rhythm honestly."
            voices={getScenarioVoices("schools")}
            ctaHref="/what-families-notice"
            ctaLabel="Browse all composite stories"
          />
          <LearnedHardWay
            title="What school-fit decisions taught us the hard way"
            lead="The useful question is rarely only ‘Do we like the school?’ It is whether the family still likes life around the school."
            items={getHardLessons("schools")}
          />
        </div>
      </Section>

      <Section
        id="use-it-well"
        title="Use this tool well"
        lead="The strongest school decisions usually come from one honest observation, not a forced yes."
        tone="default"
      >
        <div className={grid3}>
          {[
            ["/schools", "School planning guide", "Start with the main school page if you want the overall picture first."],
            ["/guides/how-to-know-if-empathy-school-should-anchor-your-move", "Should Empathy School anchor the move?", "Use this when school is starting to influence housing, area, and timing."],
            ["/empathy-school-tour-prep", "Empathy School tour prep", "Plan a school day that still tells the truth once the rest of family life is included."],
            ["/guides/how-to-plan-an-empathy-school-tour-during-a-test-stay", "Plan a tour during a test stay", "Use this when the family wants the cleanest possible read."],
            ["/resources/empathy-school-fit-notes-sheet", "Fit notes sheet", "Copy the note prompts so you leave with a usable answer, not a vague good feeling."],
            ["/resources/empathy-school-tour-day-plan", "Tour day plan", "Keep the day calm enough that you can still notice the signal."],
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
        sourcePath="/empathy-school-fit"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
