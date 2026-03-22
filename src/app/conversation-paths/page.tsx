import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Section from "@/components/Section";
import ConversationPathCard from "@/components/ConversationPathCard";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";
import { buildWebPageSchema } from "@/lib/schema";
import { getAllConversationRouteDetails, getSourceConversationContext } from "@/lib/conversion";

export const metadata: Metadata = {
  title: "Conversation paths",
  description: "Choose the right next conversation for your Bali move: planning, test stay, areas + budget, housing intro, or Empathy School fit.",
  alternates: { canonical: "/conversation-paths" },
};

const sourceCards = [
  {
    href: "/move-timeline",
    title: "Move timeline",
    body: "Best for families who still need the next decision to come into focus.",
  },
  {
    href: "/budget-calculator",
    title: "Budget calculator",
    body: "Best for families who are starting to connect spending, geography, and routine.",
  },
  {
    href: "/housing-brief-builder",
    title: "Housing brief builder",
    body: "Best for families who are close to needing Gaia Group, but want the first conversation to start cleaner.",
  },
  {
    href: "/empathy-school-fit",
    title: "Empathy School fit",
    body: "Best for families whose school question may now change the whole move.",
  },
  {
    href: "/test-stay",
    title: "Test stay",
    body: "Best for families who want Bali to answer real questions before heavier commitments begin.",
  },
  {
    href: "/weekday-reality",
    title: "Weekday reality",
    body: "Best for families trying to figure out whether the ordinary week still works.",
  },
] as const;

export default function ConversationPathsPage() {
  const routes = getAllConversationRouteDetails();

  return (
    <main>
      <JsonLd
        data={buildWebPageSchema({
          pathname: "/conversation-paths",
          name: "Conversation paths",
          description: "A practical routing hub for choosing the right next conversation inside the Move to Bali system.",
        })}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="container">
          <div className={badgeAccent}>Routing hub</div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right conversation before you hit contact.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
            A bigger site only helps if it routes families well. This page turns the contact path into part of the planning system: broad planning questions, test-stay questions, areas + budget, housing intro, or Empathy School fit.
          </p>
          <div className={btnRow + " mt-8"}>
            <a className={buttonPrimary} href="/contact" data-track="conversation_paths_contact">
              Open contact
            </a>
            <a className={buttonSecondary} href="/plan-your-move" data-track="conversation_paths_plan">
              Back to plan your move
            </a>
          </div>
        </div>
      </section>

      <Section
        id="five-routes"
        title="The five conversation routes"
        lead="Each route exists for a reason. Pick the one that matches the question your family is actually trying to solve now."
        tone="default"
      >
        <div className={grid2}>
          {routes.map((route) => (
            <ConversationPathCard key={route.id} routeId={route.id} from="/conversation-paths" />
          ))}
        </div>
      </Section>

      <Section
        id="from-tools"
        title="If you just used a tool, here is the likely next conversation"
        lead="These cards translate tool use into the next useful contact instead of making every contact button identical."
        tone="muted"
      >
        <div className={grid3}>
          {sourceCards.map((item) => {
            const context = getSourceConversationContext(item.href);
            const topic = routes.find((route) => route.id === context.recommendedRouteId)?.topic || "General move planning";
            return (
              <div key={item.href} className={cardCls}>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">From {item.title}</div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">{context.sourceLabel}</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  <strong className="text-gray-900">Likely next conversation</strong>
                  <p className="mt-1">{context.reason}</p>
                </div>
                <div className={btnRow}>
                  <a className={buttonPrimary} href={item.href} data-track="conversation_paths_return_to_tool">
                    Reopen tool
                  </a>
                  <a
                    className={buttonSecondary}
                    href={`/contact?from=${encodeURIComponent(item.href)}&route=${encodeURIComponent(context.recommendedRouteId)}&topic=${encodeURIComponent(topic)}`}
                    data-track="conversation_paths_from_tool"
                  >
                    Ask that question
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        id="prep-well"
        title="What improves any conversation"
        lead="The goal is not to write a long email. It is to arrive with the right information already in hand."
        tone="default"
      >
        <div className={grid3}>
          {[
            ["/resources/contact-prep-notes-sheet", "Contact prep notes sheet", "Use one short note to keep timing, kids, shortlist, and the sticking point in the same place."],
            ["/guides/which-conversation-should-you-start-with-for-your-bali-move", "Which conversation should you start with?", "Use this guide when two routes still sound plausible and you want to choose the cleaner one."],
            ["/guides/when-to-ask-for-a-gaia-group-intro", "When to ask for a Gaia Group intro", "Useful when housing feels urgent but you do not want to approach Gaia Group too early."],
            ["/guides/what-to-prepare-before-an-empathy-school-fit-conversation", "Prepare for an Empathy School fit conversation", "Useful when the school question is no longer casual and could change area or timing."],
            ["/resources/family-housing-brief-template", "Housing brief template", "Have the family brief ready before you request the housing intro."],
            ["/resources/empathy-school-fit-notes-sheet", "School fit notes sheet", "Keep the school question grounded in the real family week."],
          ].map(([href, title, body]) => (
            <a key={href} href={href} className={cardCls}>
              <h3 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{body}</p>
              <div className="mt-6 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </Section>
    </main>
  );
}
