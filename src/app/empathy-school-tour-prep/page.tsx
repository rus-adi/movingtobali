import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import SchoolTourPrepPlanner from "@/components/SchoolTourPrepPlanner";
import { buildWebPageSchema } from "@/lib/schema";
import { badgeAccent, cardCls, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Empathy School tour prep",
  description: "Plan an Empathy School visit that still gives your family a real signal: timing, route, questions, commute, and what to protect on the day.",
  alternates: { canonical: "/empathy-school-tour-prep" },
};

export default function EmpathySchoolTourPrepPage() {
  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/empathy-school-tour-prep",
          name: "Empathy School tour prep",
          description: "A practical planner for getting a more honest signal from an Empathy School tour day.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Tour planner</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Plan an Empathy School visit that still tells the truth.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            The value of a school visit often comes from everything around it: where you started, how much you stacked into the day, whether the child joined, and whether the drive still feels workable afterwards. Use this page to protect the signal.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <SchoolTourPrepPlanner />
        </div>
      </section>

      <Section
        id="why-tours-fail"
        title="Why school tour days sometimes fail families"
        lead="The tour itself is usually not the problem. The schedule around it is."
        tone="muted"
      >
        <div className={grid3}>
          {[
            {
              title: "Too compressed",
              body: "When the visit sits between airport recovery, property viewings, and errands, families often leave with almost no usable signal.",
            },
            {
              title: "Commute ignored",
              body: "A school can look beautiful on campus while the day around it already feels too stretched.",
            },
            {
              title: "No notes afterwards",
              body: "If nobody writes one honest sentence before moving on, the family often remembers only the polished parts.",
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
        id="next-tools"
        title="Use these pages around the tour"
        lead="These are the pages that usually make a school visit more useful before and after the day itself."
        tone="default"
      >
        <div className={grid3}>
          {[
            ["/schools", "Empathy School", "Get the broader picture first if you still need the overview."],
            ["/empathy-school-fit", "Empathy School fit", "Use this if the bigger question is whether school should anchor the move at all."],
            ["/guides/how-to-use-an-empathy-school-tour-to-test-your-week", "Use a tour to test your week", "Connect the school day to the real family week."],
            ["/guides/how-to-plan-an-empathy-school-tour-during-a-test-stay", "Plan the tour during a test stay", "Best for families who want the cleanest, most grounded read."],
            ["/resources/school-tour-question-list", "School tour question list", "Bring sharper questions without turning the visit into an interview."],
            ["/resources/empathy-school-fit-notes-sheet", "Fit notes sheet", "Capture the answer before the day gets rewritten in hindsight."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </Section>

      <SourceConversationPanel
        sourcePath="/empathy-school-tour-prep"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
