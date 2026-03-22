"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type TimingKey = "exploring" | "three-plus" | "one-to-three" | "booked";
type AreasKey = "wide-open" | "rough" | "shortlist" | "micro";
type BudgetKey = "unclear" | "rough" | "working";
type HomeKey = "unsure" | "rough" | "clear";
type SchoolKey = "no" | "maybe" | "yes";
type TestStayKey = "none" | "likely" | "booked";
type VerifyKey = "rush" | "mixed" | "careful";

type StepLink = { title: string; href: string };

type Verdict = {
  tone: "ready" | "almost" | "early";
  title: string;
  body: string;
  actions: StepLink[];
};

const timingOptions: Record<TimingKey, { label: string; score: number }> = {
  exploring: { label: "We are still broadly exploring", score: 0 },
  "three-plus": { label: "Move is likely 3+ months away", score: 8 },
  "one-to-three": { label: "Move or test stay is 1–3 months away", score: 12 },
  booked: { label: "Dates are booked or basically set", score: 14 },
};

const areasOptions: Record<AreasKey, { label: string; score: number }> = {
  "wide-open": { label: "We have not really narrowed Bali yet", score: 0 },
  rough: { label: "We have a vague side of Bali in mind", score: 6 },
  shortlist: { label: "We have 2–3 serious areas", score: 14 },
  micro: { label: "We are down to a real shortlist and micro-areas", score: 18 },
};

const budgetOptions: Record<BudgetKey, { label: string; score: number }> = {
  unclear: { label: "Budget is still mostly a guess", score: 0 },
  rough: { label: "We have a working range", score: 10 },
  working: { label: "We know our comfort band and stretch ceiling", score: 14 },
};

const homeOptions: Record<HomeKey, { label: string; score: number }> = {
  unsure: { label: "We still do not know the home shape", score: 0 },
  rough: { label: "We know rough bedroom count and basics", score: 8 },
  clear: { label: "We know bedrooms, work needs, and dealbreakers", score: 12 },
};

const schoolOptions: Record<SchoolKey, { label: string; score: number }> = {
  no: { label: "Empathy School is not shaping housing", score: 4 },
  maybe: { label: "Empathy School might shape the shortlist", score: 6 },
  yes: { label: "Empathy School is one of the anchors", score: 10 },
};

const testStayOptions: Record<TestStayKey, { label: string; score: number }> = {
  none: { label: "No test stay or scouting plan yet", score: 2 },
  likely: { label: "A test stay or scouting trip is likely", score: 8 },
  booked: { label: "A test stay or scouting trip is booked", score: 10 },
};

const verifyOptions: Record<VerifyKey, { label: string; score: number }> = {
  rush: { label: "We are worried we may rush if we see something pretty", score: 0 },
  mixed: { label: "We know verification matters, but we need a checklist", score: 8 },
  careful: { label: "We will verify the property, terms, and payment flow before money moves", score: 12 },
};

const MAX_SCORE = 90;

function makeVerdict(score: number, gaps: string[]): Verdict {
  if (score >= 68) {
    return {
      tone: "ready",
      title: "You are ready enough for a Gaia Group intro.",
      body: "Your housing thinking is specific enough that an intro is likely to produce a calmer shortlist instead of a scatter of mismatched listings.",
      actions: [
        { title: "Request a housing intro", href: buildContactHref("Housing intro", { from: "/housing-intro-readiness", partner: "gaia-group-bali" }) },
        { title: "Build the housing brief", href: "/housing-brief-builder" },
        { title: "Open Gaia Group profile", href: "/gaia-group" },
      ],
    };
  }

  if (score >= 44) {
    const actions: StepLink[] = [{ title: "Build the housing brief", href: "/housing-brief-builder" }];
    if (gaps.includes("areas")) actions.push({ title: "Use Area Match", href: "/area-match" });
    if (gaps.includes("budget")) actions.push({ title: "Open budget calculator", href: "/budget-calculator" });
    if (gaps.includes("home")) actions.push({ title: "Read family housing styles", href: "/guides/family-housing-styles-in-bali" });
    if (!actions.find((item) => item.href === "/housing")) actions.push({ title: "Open housing guide", href: "/housing" });

    return {
      tone: "almost",
      title: "You are close, but one or two things should harden first.",
      body: "You do not need perfect clarity. You do need enough structure that the housing conversation starts with real family constraints instead of hopeful browsing.",
      actions: actions.slice(0, 4),
    };
  }

  return {
    tone: "early",
    title: "It is probably too early for a housing intro.",
    body: "That is not a problem. It usually means the next win is area clarity, budget range, or a test-stay plan before partner introductions become worth your energy.",
    actions: [
      { title: "Open Plan Your Move", href: "/plan-your-move" },
      { title: "Use Area Match", href: "/area-match" },
      { title: "Open budget calculator", href: "/budget-calculator" },
      { title: "Read the housing guide", href: "/housing" },
    ],
  };
}

export default function HousingIntroReadiness() {
  const [timing, setTiming] = useState<TimingKey>("one-to-three");
  const [areas, setAreas] = useState<AreasKey>("rough");
  const [budget, setBudget] = useState<BudgetKey>("rough");
  const [home, setHome] = useState<HomeKey>("rough");
  const [school, setSchool] = useState<SchoolKey>("maybe");
  const [testStay, setTestStay] = useState<TestStayKey>("likely");
  const [verify, setVerify] = useState<VerifyKey>("mixed");

  const result = useMemo(() => {
    const score =
      timingOptions[timing].score +
      areasOptions[areas].score +
      budgetOptions[budget].score +
      homeOptions[home].score +
      schoolOptions[school].score +
      testStayOptions[testStay].score +
      verifyOptions[verify].score;

    const strengths: string[] = [];
    const gaps: string[] = [];

    if (areasOptions[areas].score >= 14) strengths.push("a real area shortlist");
    else gaps.push("areas");

    if (budgetOptions[budget].score >= 10) strengths.push("a working housing budget");
    else gaps.push("budget");

    if (homeOptions[home].score >= 8) strengths.push("clearer home shape and dealbreakers");
    else gaps.push("home");

    if (timingOptions[timing].score >= 12) strengths.push("real timing");
    if (testStayOptions[testStay].score >= 8) strengths.push("a scouting / test-stay plan");
    if (verifyOptions[verify].score >= 8) strengths.push("good verification posture");
    else gaps.push("verify");

    const verdict = makeVerdict(score, gaps);
    return {
      score,
      percent: Math.round((score / MAX_SCORE) * 100),
      strengths,
      gaps,
      verdict,
    };
  }, [areas, budget, home, school, testStay, timing, verify]);

  const panelTone =
    result.verdict.tone === "ready"
      ? "border-blue-200 bg-blue-50"
      : result.verdict.tone === "almost"
      ? "border-amber-200 bg-amber-50"
      : "border-gray-200 bg-gray-50";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Gaia Group filter</span>
          <span className={badge}>Use this before you request an intro</span>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Timing</span>
            <select className={inputBase} value={timing} onChange={(e) => setTiming(e.target.value as TimingKey)}>
              {Object.entries(timingOptions).map(([key, option]) => (
                <option key={key} value={key}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Area clarity</span>
            <select className={inputBase} value={areas} onChange={(e) => setAreas(e.target.value as AreasKey)}>
              {Object.entries(areasOptions).map(([key, option]) => (
                <option key={key} value={key}>{option.label}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Budget clarity</span>
              <select className={inputBase} value={budget} onChange={(e) => setBudget(e.target.value as BudgetKey)}>
                {Object.entries(budgetOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Home shape clarity</span>
              <select className={inputBase} value={home} onChange={(e) => setHome(e.target.value as HomeKey)}>
                {Object.entries(homeOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Empathy School role</span>
              <select className={inputBase} value={school} onChange={(e) => setSchool(e.target.value as SchoolKey)}>
                {Object.entries(schoolOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-gray-900">Scouting / test-stay plan</span>
              <select className={inputBase} value={testStay} onChange={(e) => setTestStay(e.target.value as TestStayKey)}>
                {Object.entries(testStayOptions).map(([key, option]) => (
                  <option key={key} value={key}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Verification posture</span>
            <select className={inputBase} value={verify} onChange={(e) => setVerify(e.target.value as VerifyKey)}>
              {Object.entries(verifyOptions).map(([key, option]) => (
                <option key={key} value={key}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6">
        <div className={`${cardCls} ${panelTone}`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={badgeAccent}>Readiness score</span>
            <span className={badge}>{result.percent}%</span>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">{result.verdict.title}</h2>
          <p className="mt-3 text-sm leading-6 text-gray-700">{result.verdict.body}</p>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/80">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${result.percent}%` }} />
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <strong className="text-sm font-semibold text-gray-900">Already helping</strong>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-700">
                {(result.strengths.length ? result.strengths : ["You have started turning the move into real decisions."]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-sm font-semibold text-gray-900">Still worth tightening</strong>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-700">
                {(result.gaps.length
                  ? result.gaps.map((gap) => {
                      if (gap === "areas") return "Narrow the shortlist down to two or three real areas.";
                      if (gap === "budget") return "Get to a working housing budget band, not one magic number.";
                      if (gap === "home") return "Clarify bedrooms, work needs, and the dealbreakers that matter on tired days.";
                      return "Use the checklists so verification is stronger than urgency.";
                    })
                  : ["You are in a good place to move into brief + intro mode."]
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={btnRow}>
            {result.verdict.actions.map((action, index) => (
              <a
                key={action.href}
                className={index === 0 ? buttonPrimary : buttonSecondary}
                href={action.href}
                data-track="housing_readiness_action"
              >
                {action.title}
              </a>
            ))}
          </div>
        </div>

        <div className={cardCls}>
          <strong className="text-sm font-semibold text-gray-900">What this tool is really doing</strong>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Gaia Group is most helpful once the family has moved past “show us anything nice” and into something closer to: timing,
            shortlist, budget band, home shape, and what daily life actually has to do.
          </p>
          <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
            <li>It is fine if you are not ready yet.</li>
            <li>A short delay now often saves much more stress later.</li>
            <li>The goal is a better first housing conversation, not a higher score for its own sake.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
