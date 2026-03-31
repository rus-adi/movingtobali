"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import { schoolPlanningGuideHref, schoolPlanningGuideLabel } from "@/lib/schoolLinks";
import { badge, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type TimelineKey = "fast" | "steady" | "roomy";
type RouteKey = "testStayFirst" | "schoolFirst" | "housingFirst" | "flexible";
type SchoolKey = "yes" | "maybe" | "notNow";
type AreaKey = "open" | "shortlist" | "decided";

type Stage = {
  title: string;
  window: string;
  body: string;
  actions: string[];
};

const timelineOptions: Record<TimelineKey, { label: string; windows: string[] }> = {
  fast: {
    label: "Arriving in 1–2 months",
    windows: ["This week", "Next 2 weeks", "Weeks 3–4", "2 weeks before arrival", "First 10 days on the ground"],
  },
  steady: {
    label: "Arriving in 3–4 months",
    windows: ["This month", "Next month", "6–8 weeks before arrival", "3–4 weeks before arrival", "Arrival month"],
  },
  roomy: {
    label: "Arriving in 5–6+ months",
    windows: ["Now", "2–3 months out", "8–10 weeks out", "4–6 weeks out", "Arrival month"],
  },
};

const routeOptions: Record<RouteKey, { label: string; mistake: string; nextTool: string; nextHref: string }> = {
  testStayFirst: {
    label: "Test stay first",
    mistake: "Turning the stay into a holiday and coming home without real answers.",
    nextTool: "Test stay planning",
    nextHref: "/test-stay",
  },
  schoolFirst: {
    label: "School-first planning",
    mistake: "Choosing an area before you know whether Empathy School should anchor the week.",
    nextTool: schoolPlanningGuideLabel,
    nextHref: schoolPlanningGuideHref,
  },
  housingFirst: {
    label: "Housing feels urgent",
    mistake: "Paying or negotiating too early, before the area shortlist is strong enough.",
    nextTool: "Housing guide",
    nextHref: "/housing",
  },
  flexible: {
    label: "Still shaping the move",
    mistake: "Researching everything at once and delaying the few decisions that would create clarity.",
    nextTool: "Plan your move",
    nextHref: "/plan-your-move",
  },
};

const schoolOptions: Record<SchoolKey, { label: string }> = {
  yes: { label: "Yes, Empathy School is likely part of the move" },
  maybe: { label: "Maybe — we want to test school fit" },
  notNow: { label: "Not yet — school is not the first decision" },
};

const areaOptions: Record<AreaKey, { label: string }> = {
  open: { label: "We are still wide open on area" },
  shortlist: { label: "We have a shortlist of 2–3 areas" },
  decided: { label: "We think we know the area" },
};

function buildStages(timeline: TimelineKey, route: RouteKey, school: SchoolKey, area: AreaKey): Stage[] {
  const windows = timelineOptions[timeline].windows;

  const stages: Stage[] = [
    {
      title: "Set the shape of the move",
      window: windows[0],
      body: "Pick the move shape before you chase details. The biggest stress reducer is knowing whether you are testing Bali, moving directly, or using Empathy School as the main anchor.",
      actions: [
        "Choose whether this is a test stay, a staged move, or a direct arrival.",
        school === "yes"
          ? "Put an Empathy School tour or fit conversation into the plan early."
          : school === "maybe"
            ? "Keep school fit as a real question, not a vague future problem."
            : "Keep the learning conversation light for now and focus on move shape first.",
        "Use the family readiness checklist to spot the one decision that still feels fuzzy.",
      ],
    },
    {
      title: "Shortlist areas and numbers",
      window: windows[1],
      body: "Most Bali decisions get easier once the family is comparing two or three real areas instead of the whole island. The same goes for budget bands.",
      actions: [
        area === "open"
          ? "Use Area Match and narrow the island down to 2–3 real options."
          : area === "shortlist"
            ? "Pressure-test your shortlist against commute, noise, groceries, and weekday energy."
            : "Sanity-check the chosen area at real family times, not only the dream version of it.",
        "Build a low / mid / high budget range before you look at too many homes.",
        route === "housingFirst"
          ? "Do not request a housing intro until the shortlist is specific enough to be useful."
          : "Let the area shortlist tell you what kind of housing search would actually help.",
      ],
    },
    {
      title: "Test the weekly rhythm",
      window: windows[2],
      body: "This is the phase where Bali stops being an idea and starts behaving like a real family week. Routines matter more than excitement here.",
      actions: [
        route === "testStayFirst"
          ? "Design the test stay around normal mornings, one or two anchors, and a few repeated routes."
          : "Even without a formal test stay, build one week that behaves like normal life instead of travel mode.",
        school !== "notNow"
          ? "Use Empathy School as a real rhythm check: tour, questions, commute, and how the family feels around it."
          : "Pick another weekly anchor that reveals how the family handles Bali once novelty settles.",
        "Keep notes on what feels easier, heavier, calmer, and more expensive than expected.",
      ],
    },
    {
      title: "Lock logistics carefully",
      window: windows[3],
      body: "Only after the move feels more real should you harden the pieces that are annoying to unwind: housing, deposits, contracts, and fixed routines.",
      actions: [
        route === "housingFirst"
          ? "Use the housing brief and lease checklist before any money moves."
          : "Use Gaia Group only once the timing, areas, and family brief are strong enough to create a useful shortlist.",
        "Confirm visas and entry details through official channels or a qualified agent before final commitments.",
        "Protect arrival week energy: transport, first groceries, internet, and the first calm routine matter more than squeezing in everything.",
      ],
    },
    {
      title: "Land, review, and decide the next layer",
      window: windows[4],
      body: "The move gets calmer when the first review is built in. Families do better when they decide what to extend, change, or pause after real weekdays rather than wishful thinking.",
      actions: [
        "Review the first 7–10 days against energy, commute, cost, and child regulation.",
        school === "yes"
          ? "If Empathy School is the anchor, decide what it changes about area, housing, and weekly rhythm."
          : "Notice whether school needs are now becoming more real than they were before arrival.",
        "Choose the next move: stay the course, change area, soften the plan, or ask for targeted help.",
      ],
    },
  ];

  return stages;
}

export default function MoveTimelinePlanner() {
  const [timeline, setTimeline] = useState<TimelineKey>("steady");
  const [route, setRoute] = useState<RouteKey>("testStayFirst");
  const [school, setSchool] = useState<SchoolKey>("maybe");
  const [area, setArea] = useState<AreaKey>("open");

  const stages = useMemo(() => buildStages(timeline, route, school, area), [timeline, route, school, area]);
  const routeMeta = routeOptions[route];

  const nextActions = useMemo(() => {
    const items = [
      { title: routeMeta.nextTool, href: routeMeta.nextHref },
      { title: "Area Match", href: "/area-match" },
      { title: "Budget calculator", href: "/budget-calculator" },
      { title: "Decision checklists", href: "/decision-checklists" },
    ];

    if (school !== "notNow") {
      items.splice(1, 0, { title: schoolPlanningGuideLabel, href: schoolPlanningGuideHref });
    }

    return items.slice(0, 4);
  }, [routeMeta, school]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className={cardCls}>
        <div className={badge}>Timeline builder</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Build a calmer sequence</h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          This does not try to predict every detail. It gives you a smarter order of operations so the family is not solving housing, school, areas, visas, and first-week logistics all in one emotional pile.
        </p>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Arrival window</span>
            <select className={inputBase} value={timeline} onChange={(e) => setTimeline(e.target.value as TimelineKey)}>
              {Object.entries(timelineOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">What feels most true right now</span>
            <select className={inputBase} value={route} onChange={(e) => setRoute(e.target.value as RouteKey)}>
              {Object.entries(routeOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Empathy School in the plan</span>
            <select className={inputBase} value={school} onChange={(e) => setSchool(e.target.value as SchoolKey)}>
              {Object.entries(schoolOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Area clarity</span>
            <select className={inputBase} value={area} onChange={(e) => setArea(e.target.value as AreaKey)}>
              {Object.entries(areaOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-900">The mistake to avoid</div>
          <p className="mt-2 text-sm leading-6 text-gray-700">{routeMeta.mistake}</p>
        </div>

        <div className={btnRow}>
          <a className={buttonPrimary} href={buildContactHref("General move planning", { from: "/move-timeline" })} data-track="timeline_contact">
            Ask a planning question
          </a>
          <a className={buttonSecondary} href="/decision-checklists" data-track="timeline_checklists">
            Open decision checklists
          </a>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          {nextActions.map((item) => (
            <a key={item.href} href={item.href} className={cardCls}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">Next tool</div>
              <div className="mt-3 text-xl font-semibold tracking-tight text-gray-900">{item.title}</div>
              <div className="mt-4 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>

        <div className="grid gap-4">
          {stages.map((stage, index) => (
            <div key={stage.title} className={cardCls}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">Stage {index + 1}</div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{stage.title}</h3>
                </div>
                <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                  {stage.window}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-700">{stage.body}</p>
              <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
                {stage.actions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
