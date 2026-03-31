import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import BudgetCalculator from "@/components/BudgetCalculator";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { buildContactHref } from "@/lib/contact";
import { schoolPlanningGuideHref, schoolPlanningGuideLabel } from "@/lib/schoolLinks";
import { badge, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Budget calculator",
  description: "A working low / mid / high budget range builder for families planning a move to Bali.",
  alternates: { canonical: "/budget-calculator" },
};

export default function BudgetCalculatorPage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({
      pathname: "/budget-calculator",
      name: "Budget calculator",
      description: "A working low / mid / high budget range builder for families planning a move to Bali.",
    }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Budget calculator</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Build a realistic Bali move budget range
          </h1>
          <p className="mt-4 max-w-3xl text-base text-gray-700 sm:text-lg">
            This tool is meant to turn vague planning into a workable range. Start broad, then tighten the numbers
            after you have a stronger area shortlist, a housing style, and a clearer learning plan.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <BudgetCalculator />

          <div className={`${grid2} mt-12`}>
            <div className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">What improves the estimate fastest</h2>
              <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
                <li>Choosing your top two areas instead of pricing all of Bali at once.</li>
                <li>Knowing whether you want a short stay, trial term, or longer move.</li>
                <li>Being honest about transport and convenience spending.</li>
                <li>Using Empathy School as a real commute anchor if it is part of the plan.</li>
              </ul>
            </div>

            <div className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">Next steps</h2>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                Once the range feels plausible, move on to the pages that remove the biggest unknowns.
              </p>
              <div className={btnRow}>
                <a className={buttonPrimary} href={buildContactHref("Area + budget question", { from: "/budget-calculator" })} data-track="budget_next_contact">
                  Ask an area + budget question
                </a>
                <a className={buttonSecondary} href="/housing" data-track="budget_next_housing">
                  Housing guide
                </a>
                <a className={buttonSecondary} href={schoolPlanningGuideHref} data-track="budget_next_school_guide">
                  {schoolPlanningGuideLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SourceConversationPanel
        sourcePath="/budget-calculator"
        title="Need a reply that matches this tool?"
        lead="The site should help families route themselves. This keeps the next conversation tied to the decision you are already making here."
      />

    </main>
  );
}
