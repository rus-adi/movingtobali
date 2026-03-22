"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import { badge, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type TripShapeKey = "dedicated-day" | "test-stay-day" | "between-viewings" | "arrival-week";
type BaseKey = "ubud-side" | "sanur" | "canggu-side" | "wide-open";
type KidsKey = "yes" | "no" | "depends";
type StayKey = "one-two-days" | "three-seven-days" | "eight-fourteen-days" | "two-plus-weeks";
type GoalKey = "campus-feel" | "weekly-rhythm" | "questions-first" | "all-of-it";

type LinkItem = { title: string; href: string };
type PrepPlan = {
  posture: string;
  headline: string;
  summary: string;
  protect: string[];
  avoid: string[];
  dayPlan: string[];
  nextLinks: LinkItem[];
};

const tripShapeLabels: Record<TripShapeKey, string> = {
  "dedicated-day": "A dedicated school day",
  "test-stay-day": "Part of a longer test stay",
  "between-viewings": "Trying to fit it between housing viewings",
  "arrival-week": "Trying to do it in arrival week",
};

const baseLabels: Record<BaseKey, string> = {
  "ubud-side": "We are already staying on the Ubud side",
  sanur: "We may stay around Sanur",
  "canggu-side": "We may stay around Canggu / Pererenan",
  "wide-open": "We are still wide open on area",
};

const kidsLabels: Record<KidsKey, string> = {
  yes: "Yes, the child is joining",
  no: "No, adults only",
  depends: "Not sure yet",
};

const stayLabels: Record<StayKey, string> = {
  "one-two-days": "1–2 days in Bali",
  "three-seven-days": "3–7 days in Bali",
  "eight-fourteen-days": "8–14 days in Bali",
  "two-plus-weeks": "2+ weeks in Bali",
};

const goalLabels: Record<GoalKey, string> = {
  "campus-feel": "We mostly want campus feel",
  "weekly-rhythm": "We want to test the real family week",
  "questions-first": "We mostly need clearer questions answered",
  "all-of-it": "We want to do everything in one go",
};

function dedupeLinks(items: LinkItem[]): LinkItem[] {
  return Array.from(new Map(items.map((item) => [item.href, item])).values());
}

function buildPlan(
  tripShape: TripShapeKey,
  base: BaseKey,
  kids: KidsKey,
  stay: StayKey,
  goal: GoalKey
): PrepPlan {
  const protect: string[] = [];
  const avoid: string[] = [];
  const dayPlan: string[] = [];
  const nextLinks: LinkItem[] = [
    { title: "Empathy School", href: "/schools" },
    { title: "School tour question list", href: "/resources/school-tour-question-list" },
    { title: "Commute + routine test sheet", href: "/resources/empathy-school-commute-routine-test-sheet" },
  ];

  let posture = "Tour plus reality test";
  let headline = "Protect enough space around the visit that it still tells the truth.";
  let summary = "The most useful Empathy School visit usually has some breathing room before and after it, so the school can be judged as part of a family day instead of a squeezed-in appointment.";

  if (tripShape === "dedicated-day") {
    protect.push(
      "Keep the visit on a day that still allows you to notice the drive, the campus energy, and the family's state afterwards.",
      "Leave time for one ordinary errand or meal after the visit so the whole day feels real."
    );
    dayPlan.push(
      "Start from your actual base, not from a fantasy villa or resort that will not be part of the real move.",
      "Do the drive at a believable family time.",
      "Take the tour and use the question list sparingly enough that you can still observe.",
      "Do one normal task afterwards: groceries, lunch, or another family stop."
    );
  }

  if (tripShape === "test-stay-day") {
    posture = "Best-case setup";
    headline = "This is the strongest way to use an Empathy School tour.";
    summary = "A tour inside a test stay gives you the best chance of judging whether campus feel, commute, area logic, and daily energy all still hold together.";
    protect.push(
      "Repeat the route at least once if school may become a serious anchor.",
      "Use the visit to change the area shortlist if needed instead of treating it like a final yes-or-no only."
    );
    dayPlan.push(
      "Treat the school day as part of the stay, not as a side mission.",
      "Keep the night before and the rest of the day calm enough that everyone can still read the signal.",
      "Write one honest sentence after the visit before the family starts rewriting the memory."
    );
    nextLinks.unshift({ title: "Plan a test stay", href: "/test-stay" });
  }

  if (tripShape === "between-viewings") {
    posture = "Slow it down";
    headline = "Do not let viewings eat the value of the school day.";
    summary = "A tour squeezed between villas often gives you almost no usable signal. You leave with scattered impressions and no real sense of what the week would feel like if Empathy School became part of it.";
    protect.push("If you cannot give the school day enough space, it is often better to move the housing viewings than to rush the visit.");
    avoid.push(
      "Do not plan multiple property viewings before and after the tour and then act surprised that the school question still feels vague.",
      "Do not use a tired child and a rushed driver as your only signal."
    );
    dayPlan.push(
      "If you must combine them, do the school earlier in the day and cap the rest of the schedule hard.",
      "Keep only one housing stop afterwards, and use it to test commute reality rather than to chase listings."
    );
    nextLinks.push({ title: "Housing brief builder", href: "/housing-brief-builder" });
  }

  if (tripShape === "arrival-week") {
    posture = "Not ideal yet";
    headline = "Arrival week is usually too noisy for a meaningful school read.";
    summary = "The first few days in Bali are full of tiredness, setup friction, and emotional weather. A school visit can still happen then, but families often get a cleaner signal once the basics feel less scrambled.";
    protect.push("If the visit must happen early, lower the pressure and treat it as an introduction rather than the whole answer.");
    avoid.push(
      "Do not stack the school day onto airport recovery, SIM cards, banking, and a tired child's first week on the ground.",
      "Do not make a school decision off a day when everyone is already depleted."
    );
    dayPlan.push(
      "Use arrival week for setup unless dates force otherwise.",
      "If the tour still happens, keep the rest of the day extremely light."
    );
    nextLinks.unshift({ title: "First month planner", href: "/first-month-planner" });
  }

  if (base === "ubud-side") {
    protect.push("Because you are already closer, use the extra ease to observe more carefully instead of rushing through it.");
  }

  if (base === "sanur") {
    protect.push("Sanur can still work as a test base, but the drive is part of what you are judging, not an inconvenience to ignore.");
    dayPlan.push("Notice how the rest of the day feels after the drive back, not only how the campus felt during the visit.");
  }

  if (base === "canggu-side") {
    protect.push("A Canggu / Pererenan base can make the school-run question much more decisive. Let that truth help you, even if it narrows the shortlist faster than expected.");
    avoid.push("Do not pretend the drive is a minor detail if it already feels heavy on a test day.");
    nextLinks.push({ title: "How to use Empathy School to test area fit", href: "/guides/how-to-use-empathy-school-to-test-area-fit" });
  }

  if (base === "wide-open") {
    protect.push("Go in knowing that the tour may change your area shortlist more than your school opinion.");
    nextLinks.push({ title: "Area Match", href: "/area-match" });
  }

  if (kids === "yes") {
    protect.push("If the child is joining, watch their energy before, during, and after the visit — not only the polished tour moments.");
    dayPlan.push("Bring a snack, water, and enough margin that the child does not experience the day as an adult marathon.");
  }

  if (kids === "no") {
    protect.push("An adults-only tour can still be useful, but do not mistake your own calm reaction for your child's likely experience.");
    nextLinks.push({ title: "What kind of family thrives at Empathy School", href: "/guides/what-kind-of-family-thrives-at-empathy-school" });
  }

  if (kids === "depends") {
    protect.push("If you are unsure whether to bring the child, decide based on what you most need: campus feel, child response, or deeper adult questions.");
  }

  if (stay === "one-two-days") {
    posture = posture === "Best-case setup" ? posture : "Keep it simple";
    protect.push("With only a very short stay, use the visit to decide the next step, not to force certainty.");
    avoid.push("Do not try to decide school, area, housing, and long-term routine from one compressed visit.");
  }

  if (stay === "three-seven-days") {
    protect.push("A short week can work well if the school day is one of the main reasons the trip exists.");
  }

  if (stay === "eight-fourteen-days" || stay === "two-plus-weeks") {
    protect.push("Longer stays are your chance to repeat the route and see whether your first impression survives ordinary days.");
    nextLinks.push({ title: "How to use an Empathy School tour to test your week", href: "/guides/how-to-use-an-empathy-school-tour-to-test-your-week" });
  }

  if (goal === "campus-feel") {
    protect.push("Ask fewer questions and observe more than you think you need to.");
  }

  if (goal === "weekly-rhythm") {
    posture = posture === "Best-case setup" ? posture : "Rhythm test first";
    protect.push("Judge the entire day: leaving the house, arriving, the visit, and how everyone feels afterwards.");
    nextLinks.push({ title: "Weekday reality", href: "/weekday-reality" });
  }

  if (goal === "questions-first") {
    protect.push("Bring a sharper shortlist of questions so the visit stays specific instead of drifting into generic admiration.");
  }

  if (goal === "all-of-it") {
    avoid.push("Trying to get campus feel, admissions clarity, child reaction, area truth, and housing decisions all from one rushed day usually creates more noise than certainty.");
  }

  if (avoid.length === 0) {
    avoid.push("Do not leave without writing one honest sentence about how the week would feel if Empathy School became real.");
  }

  if (dayPlan.length < 4) {
    dayPlan.push(
      "Leave twenty quiet minutes after the visit to write notes before traffic, food, or the next appointment start editing the memory.",
      "Use the school day to change what you do next — not just to collect impressions."
    );
  }

  nextLinks.push({ title: "Ask about Empathy School fit", href: buildContactHref("Empathy School fit", { from: "/empathy-school-tour-prep" }) });

  return {
    posture,
    headline,
    summary,
    protect: Array.from(new Set(protect)).slice(0, 5),
    avoid: Array.from(new Set(avoid)).slice(0, 5),
    dayPlan: Array.from(new Set(dayPlan)).slice(0, 6),
    nextLinks: dedupeLinks(nextLinks).slice(0, 5),
  };
}

export default function SchoolTourPrepPlanner() {
  const [tripShape, setTripShape] = useState<TripShapeKey>("test-stay-day");
  const [base, setBase] = useState<BaseKey>("wide-open");
  const [kids, setKids] = useState<KidsKey>("yes");
  const [stay, setStay] = useState<StayKey>("eight-fourteen-days");
  const [goal, setGoal] = useState<GoalKey>("weekly-rhythm");

  const plan = useMemo(() => buildPlan(tripShape, base, kids, stay, goal), [tripShape, base, kids, stay, goal]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className={cardCls}>
        <div className={badge}>Tour prep</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Plan a school day that still tells the truth</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          A useful Empathy School visit is not only about the tour. It is about whether the day around it still feels believable for your family. Use this planner to protect enough space, energy, and honesty that the visit changes real decisions.
        </p>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">How the school day fits into the trip</span>
            <select className={inputBase} value={tripShape} onChange={(e) => setTripShape(e.target.value as TripShapeKey)}>
              {Object.entries(tripShapeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Where you may stay</span>
            <select className={inputBase} value={base} onChange={(e) => setBase(e.target.value as BaseKey)}>
              {Object.entries(baseLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Will the child join?</span>
            <select className={inputBase} value={kids} onChange={(e) => setKids(e.target.value as KidsKey)}>
              {Object.entries(kidsLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">How long you are in Bali</span>
            <select className={inputBase} value={stay} onChange={(e) => setStay(e.target.value as StayKey)}>
              {Object.entries(stayLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">What you most need from the visit</span>
            <select className={inputBase} value={goal} onChange={(e) => setGoal(e.target.value as GoalKey)}>
              {Object.entries(goalLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-900">The main mistake to avoid</div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Families often try to turn one school day into a tour, an admissions meeting, an area decision, and a housing strategy session. The result is usually a blur. Protect the one or two truths you most need from the visit.
          </p>
        </div>

        <div className={btnRow}>
          <a className={buttonPrimary} href="/schools" data-track="tour_prep_open_school">
            Explore Empathy School
          </a>
          <a className={buttonSecondary} href="/resources/empathy-school-tour-day-plan" data-track="tour_prep_day_plan">
            Copy the tour day plan
          </a>
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={badge}>{plan.posture}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{plan.headline}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-600">{plan.summary}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={cardCls}>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">Protect these parts of the day</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
              {plan.protect.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={cardCls}>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">Avoid these traps</h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
              {plan.avoid.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-xl font-semibold tracking-tight text-gray-900">A calmer version of the day</h3>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-gray-600">
            {plan.dayPlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plan.nextLinks.map((item) => (
            <a key={item.href} href={item.href} className={cardCls}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Next step</div>
              <div className="mt-3 text-xl font-semibold tracking-tight text-gray-900">{item.title}</div>
              <div className="mt-4 text-sm font-semibold text-gray-900">Open →</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
