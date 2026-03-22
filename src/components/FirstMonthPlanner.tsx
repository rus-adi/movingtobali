"use client";

import { useMemo, useState } from "react";
import { badge, cardCls, inputBase, buttonPrimary, buttonSecondary, btnRow } from "@/components/ui/styles";

type StayType = "test" | "trial" | "move";
type AreaFit = "still-open" | "pretty-good" | "strong-fit";
type HousingStage = "temporary" | "viewing" | "signed";
type LearningStage = "not-yet" | "touring" | "anchor-set";
type Energy = "fragile" | "mixed" | "steady";

const stayLabels: Record<StayType, string> = {
  test: "Test stay / feeling it out",
  trial: "Trial term / semi-settled",
  move: "Longer move / settling properly",
};

const weekPlans = {
  fragile: {
    title: "Protect energy first",
    bullets: [
      "Keep mornings light and only book one meaningful thing each day.",
      "Use temporary housing as a landing pad, not a forever decision.",
      "Delay extra activities until the family is sleeping well and less reactive.",
    ],
  },
  mixed: {
    title: "Build two anchors",
    bullets: [
      "Choose one family routine and one practical admin task for each week.",
      "Tour Empathy School or test your likely commute before signing a longer lease.",
      "Keep the calendar open enough that unexpected admin does not wreck the week.",
    ],
  },
  steady: {
    title: "Turn trial into routine",
    bullets: [
      "Pressure-test commute, groceries, and school rhythm as if this were a normal month.",
      "Book the conversations that help you commit with less guessing.",
      "Use the month to decide what becomes weekly, not what becomes exciting.",
    ],
  },
} as const;

function summarizeChoice({
  stayType,
  areaFit,
  housingStage,
  learningStage,
  energy,
  kids,
}: {
  stayType: StayType;
  areaFit: AreaFit;
  housingStage: HousingStage;
  learningStage: LearningStage;
  energy: Energy;
  kids: number;
}) {
  const lines: string[] = [];

  if (stayType === "test") {
    lines.push("Treat the month like a live experiment. Do not optimize for perfection yet.");
  } else if (stayType === "trial") {
    lines.push("You are far enough in to start deciding what actually belongs in the weekly routine.");
  } else {
    lines.push("Use the month to lock in repeatable systems, not just solve random admin tasks.");
  }

  if (areaFit === "still-open") {
    lines.push("Keep area choice flexible until you have tested morning and late-afternoon reality.");
  } else if (areaFit === "pretty-good") {
    lines.push("The area is promising, so now pressure-test errands, school runs, and evening calm.");
  } else {
    lines.push("Area fit looks strong. Focus on turning convenience into a stable weekly pattern.");
  }

  if (housingStage === "temporary") {
    lines.push("Temporary housing is fine. Use it to learn, not to panic-buy certainty.");
  } else if (housingStage === "viewing") {
    lines.push("View homes through the lens of weekday life: bags, shoes, weather, noise, and commute.");
  } else {
    lines.push("Signed housing means the next win is making the house support the family rhythm by week two.");
  }

  if (learningStage === "not-yet") {
    lines.push("If school is part of the move, do not leave it vague. At least test whether Empathy School fits the rhythm.");
  } else if (learningStage === "touring") {
    lines.push("Use tours and commute tests to decide whether the learning anchor reduces chaos or adds it.");
  } else {
    lines.push("Once your learning anchor is clear, protect the mornings and avoid overscheduling afternoons.");
  }

  if (kids >= 3) {
    lines.push("With three or more children, simplicity matters more than ambition. Fewer moving parts will usually win.");
  }

  if (energy === "fragile") {
    lines.push("This family needs recovery margin. Build the month around sleep, food, shade, and shorter decision loops.");
  }

  return lines;
}

export default function FirstMonthPlanner() {
  const [stayType, setStayType] = useState<StayType>("trial");
  const [areaFit, setAreaFit] = useState<AreaFit>("pretty-good");
  const [housingStage, setHousingStage] = useState<HousingStage>("viewing");
  const [learningStage, setLearningStage] = useState<LearningStage>("touring");
  const [energy, setEnergy] = useState<Energy>("mixed");
  const [kids, setKids] = useState(2);

  const summary = useMemo(
    () => summarizeChoice({ stayType, areaFit, housingStage, learningStage, energy, kids }),
    [stayType, areaFit, housingStage, learningStage, energy, kids]
  );

  const weeklyFocus = useMemo(() => {
    const base = weekPlans[energy];
    const weekOne = [
      "Get everyone sleeping, eating, and moving around the area without friction.",
      housingStage === "temporary"
        ? "Keep housing temporary while you learn what mornings and evenings feel like."
        : "Do one full weekday test run from home to your most important destination.",
      learningStage === "not-yet"
        ? "Decide whether to tour Empathy School this week so learning does not stay abstract."
        : "Notice whether the learning plan makes mornings calmer or more complicated.",
    ];

    const weekTwo = [
      areaFit === "still-open"
        ? "Compare two realistic area options based on family energy, not internet hype."
        : "Pressure-test the chosen area at the exact hours your family will use it.",
      "Choose one grocery / meal solution and one transport routine that still works when everyone is tired.",
      kids > 1 ? "Keep sibling routines simple and repeatable before adding extras." : "Protect one easy daily ritual for your child.",
    ];

    const weekThree = [
      housingStage === "viewing"
        ? "Use the viewing scorecard and stop pretending beauty matters more than weekday function."
        : "If housing is signed, set up the home so school bags, shoes, snacks, and laundry are friction-light.",
      "Do not add too many social plans. Make room for the move to still feel new.",
      "Check whether the monthly budget still matches reality.",
    ];

    const weekFour = [
      stayType === "test"
        ? "Write a yes / no / not yet conclusion before the month turns into a vague memory."
        : "Decide which parts of the trial month become normal life next month.",
      learningStage === "anchor-set"
        ? "Protect the learning rhythm and resist filling every spare hour."
        : "Make the next education decision concrete instead of endlessly researching.",
      "Ask what made the family visibly calmer. Keep that. Cut what created drag.",
    ];

    return { base, weekOne, weekTwo, weekThree, weekFour };
  }, [energy, housingStage, learningStage, areaFit, kids, stayType]);

  const copyText = useMemo(() => {
    const sections = [
      "First Month in Bali — Family Planner",
      "",
      `Stay type: ${stayLabels[stayType]}`,
      `Area fit: ${areaFit}`,
      `Housing stage: ${housingStage}`,
      `Learning stage: ${learningStage}`,
      `Family energy: ${energy}`,
      `Kids: ${kids}`,
      "",
      "What to prioritize:",
      ...summary.map((s) => `- ${s}`),
      "",
      `Weekly focus: ${weeklyFocus.base.title}`,
      ...weeklyFocus.base.bullets.map((b) => `- ${b}`),
      "",
      "Week 1:",
      ...weeklyFocus.weekOne.map((b) => `- ${b}`),
      "",
      "Week 2:",
      ...weeklyFocus.weekTwo.map((b) => `- ${b}`),
      "",
      "Week 3:",
      ...weeklyFocus.weekThree.map((b) => `- ${b}`),
      "",
      "Week 4:",
      ...weeklyFocus.weekFour.map((b) => `- ${b}`),
    ];
    return sections.join("\n");
  }, [stayType, areaFit, housingStage, learningStage, energy, kids, summary, weeklyFocus]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
    } catch {}
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className={cardCls}>
        <div className={badge}>First-month planner</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Turn the first month into a calmer test</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          This is not a strict schedule. It is a way to pressure-test the move without pretending every family should do Bali the same way.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Move stage</span>
            <select className={inputBase} value={stayType} onChange={(e) => setStayType(e.target.value as StayType)}>
              <option value="test">Test stay / feeling it out</option>
              <option value="trial">Trial term / semi-settled</option>
              <option value="move">Longer move / settling properly</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">How clear is the area fit?</span>
            <select className={inputBase} value={areaFit} onChange={(e) => setAreaFit(e.target.value as AreaFit)}>
              <option value="still-open">Still open</option>
              <option value="pretty-good">Pretty good</option>
              <option value="strong-fit">Strong fit</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Housing stage</span>
            <select className={inputBase} value={housingStage} onChange={(e) => setHousingStage(e.target.value as HousingStage)}>
              <option value="temporary">Temporary only</option>
              <option value="viewing">Viewing / deciding</option>
              <option value="signed">Signed / mostly set</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Learning stage</span>
            <select className={inputBase} value={learningStage} onChange={(e) => setLearningStage(e.target.value as LearningStage)}>
              <option value="not-yet">Not decided yet</option>
              <option value="touring">Touring / testing</option>
              <option value="anchor-set">Anchor is set</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Family energy right now</span>
            <select className={inputBase} value={energy} onChange={(e) => setEnergy(e.target.value as Energy)}>
              <option value="fragile">Fragile / tired</option>
              <option value="mixed">Mixed / manageable</option>
              <option value="steady">Steady / ready</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Kids</span>
            <select className={inputBase} value={kids} onChange={(e) => setKids(Number(e.target.value))}>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
          The goal is not to do everything in 30 days. The goal is to finish the month knowing what helps your family feel more settled — and what clearly does not.
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="text-sm font-semibold text-gray-900">What to prioritize now</div>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-gray-600">
            {summary.map((item) => (
              <li key={item} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">{item}</li>
            ))}
          </ul>
        </div>

        <div className={cardCls}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-900">Weekly focus</div>
              <div className="mt-1 text-sm text-gray-600">{weeklyFocus.base.title}</div>
            </div>
            <button type="button" className={buttonSecondary} onClick={handleCopy} data-track="first_month_copy_plan">
              Copy plan
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <ul className="grid gap-2 text-sm leading-6 text-gray-600">
              {weeklyFocus.base.bullets.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>

          {[
            { label: "Week 1", bullets: weeklyFocus.weekOne },
            { label: "Week 2", bullets: weeklyFocus.weekTwo },
            { label: "Week 3", bullets: weeklyFocus.weekThree },
            { label: "Week 4", bullets: weeklyFocus.weekFour },
          ].map(({ label, bullets }) => (
            <div key={label} className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-gray-900">{label}</div>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-gray-600">
                {bullets.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>
            </div>
          ))}

          <div className={btnRow + " mt-6"}>
            <a className={buttonPrimary} href="/contact?topic=General%20move%20planning&from=first-month-planner" data-track="first_month_contact">
              Ask about your month-one plan
            </a>
            <a className={buttonSecondary} href="/budget-calculator" data-track="first_month_budget">
              Check your budget
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
