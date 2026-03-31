"use client";

import { useMemo, useState } from "react";
import { schoolPlanningGuideHref, schoolPlanningGuideLabel } from "@/lib/schoolLinks";
import { buildContactHref } from "@/lib/contact";
import { badge, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type KidsKey = "toddlers" | "primary" | "teens" | "mixed";
type WorkKey = "flexible" | "remote-calls" | "two-working" | "one-parent-leading";
type CommuteKey = "low" | "medium" | "high";
type WeatherKey = "dry" | "rainy";
type AnchorKey = "empathy" | "camp-class" | "not-yet";

type LinkItem = { title: string; href: string };
type Plan = {
  headline: string;
  summary: string;
  anchors: string[];
  watchouts: string[];
  tests: string[];
  nextLinks: LinkItem[];
};

const kidsLabels: Record<KidsKey, string> = {
  toddlers: "Toddlers / preschool age",
  primary: "Primary-age kids",
  teens: "Pre-teens / teens",
  mixed: "Mixed ages",
};

const workLabels: Record<WorkKey, string> = {
  flexible: "Flexible work days",
  "remote-calls": "Remote work with calls / meetings",
  "two-working": "Two adults trying to work",
  "one-parent-leading": "One adult mostly holding the week",
};

const commuteLabels: Record<CommuteKey, string> = {
  low: "Low commute tolerance",
  medium: "Medium commute tolerance",
  high: "High commute tolerance",
};

const weatherLabels: Record<WeatherKey, string> = {
  dry: "Dry-season style week",
  rainy: "Rainy-season style week",
};

const anchorLabels: Record<AnchorKey, string> = {
  empathy: "Empathy School is part of the test",
  "camp-class": "Camp / class / lighter child anchor",
  "not-yet": "No fixed child anchor yet",
};

function buildPlan(kids: KidsKey, work: WorkKey, commute: CommuteKey, weather: WeatherKey, anchor: AnchorKey): Plan {
  const anchors: string[] = [];
  const watchouts: string[] = [];
  const tests: string[] = [];
  const nextLinks: LinkItem[] = [
    { title: "Daily life guide", href: "/daily-life" },
    { title: "Weekday reality planner", href: "/resources/weekday-reality-planner" },
    { title: "First month planner", href: "/first-month-planner" },
  ];

  let headline = "Build the week around fewer transitions.";
  let summary = "The calmer version of Bali usually comes from a smaller, more repeatable week rather than a bigger, more exciting one.";

  if (kids === "toddlers") {
    headline = "Protect naps, food, and the shortest possible loops.";
    anchors.push(
      "Choose the nearest useful rhythm, not the most aspirational one.",
      "Keep one food-and-rest reset available every afternoon.",
      "Avoid turning errands into family outings in the first month."
    );
    watchouts.push(
      "A beautiful home is not enough if the child unravels on the drive.",
      "Late naps, heat, and hunger can make evenings look harder than the move really is."
    );
    tests.push(
      "Can you get through a morning, one outing, and the afternoon without the adults feeling fried?",
      "Is there an easy retreat path when the child is done?"
    );
  }

  if (kids === "primary") {
    anchors.push(
      "Use one repeating child anchor so the week does not start from zero every day.",
      "Treat the first 45 minutes after pickup like part of the plan, not dead space."
    );
    watchouts.push("Overfilling the week too early can make a good move feel noisy.");
    tests.push("Does your child look more settled after three repeated days, not just one exciting day?");
  }

  if (kids === "teens") {
    headline = "Test buy-in, independence, and whether the area still works when the novelty drops.";
    anchors.push(
      "Let older kids help judge whether the week feels too isolated, too busy, or just right.",
      "Keep one social or movement anchor in the week so everything does not depend on family mood."
    );
    watchouts.push(
      "A long commute can feel much heavier to a teen by week two than it did on day one.",
      "Do not confuse scenic quiet with a good fit if the child feels cut off."
    );
    tests.push("Does the child still like the area after a normal afternoon, not only the best-looking moments?");
    nextLinks.splice(1, 0, { title: "Moving with pre-teens and teens", href: "/guides/moving-to-bali-with-pre-teens-and-teens" });
  }

  if (kids === "mixed") {
    headline = "Build around the most sensitive transition, not the most confident family member.";
    anchors.push(
      "Choose a weekly rhythm the youngest and most tired person can still handle.",
      "Separate the must-haves from the nice-to-haves early."
    );
    watchouts.push("Mixed-age families often feel fine until the afternoon demands start colliding.");
    tests.push("Which sibling gets stretched first, and what does that reveal about the setup?");
  }

  if (work === "remote-calls") {
    anchors.push(
      "Protect the handoff moments: morning departure, pickup, and the first snack window.",
      "Decide in advance where meetings happen and where noisy kid energy can land."
    );
    watchouts.push("A week that depends on perfect timing is usually too fragile for real family life.");
    tests.push("Can work still function if traffic, rain, or a tired child shifts the plan by 30 minutes?");
    nextLinks.push({ title: "Area Match", href: "/area-match" });
  }

  if (work === "two-working") {
    headline = "The move needs stronger systems because both adults are still carrying load.";
    summary = "When two adults are trying to work, unclear transport, vague food plans, and long afternoons show up faster.";
    anchors.push(
      "Choose who owns which transition before the day starts.",
      "Use easier food and transport defaults than you think you should need."
    );
    watchouts.push("If both adults are improvising, the children often absorb the stress immediately.");
    tests.push("Does the week still work when one adult is fully unavailable for half a day?");
  }

  if (work === "one-parent-leading") {
    anchors.push(
      "Make the house and local routine do more work for you.",
      "Protect one adult reset point so the week does not become pure output."
    );
    watchouts.push("Trying to make every day productive usually backfires for the lead parent first.");
    tests.push("Can the lead parent still hold the day when rain, illness, or one extra errand appears?");
  }

  if (commute === "low") {
    anchors.push("Let area choice and school timing serve a shorter, simpler week.");
    watchouts.push("If you already know your family hates driving, believe that information early.");
    tests.push("Which part of the week would feel instantly better if the drive were 15 minutes shorter?");
  }

  if (commute === "high") {
    summary = "Your family may tolerate more driving, but it is still worth checking whether the extra movement is buying something genuinely useful.";
    watchouts.push("Longer drives can still drain the after-school window even when adults think they are coping fine.");
  }

  if (weather === "rainy") {
    anchors.push(
      "Give rainy days their own defaults: indoor option, easier food, easier transport, quieter evening.",
      "Treat wet-weather commutes as truth, not as a bad exception."
    );
    watchouts.push("Rain changes regulation and logistics at the same time.");
    tests.push("What becomes hardest when the day gets wetter, slower, and more indoor?");
    nextLinks.splice(1, 0, { title: "Rainy day defaults", href: "/resources/rainy-day-defaults-list" });
  }

  if (anchor === "empathy") {
    anchors.push(
      "Use Empathy School as a real rhythm test: mornings, pickup, area fit, and the child’s energy after the day.",
      "Let the school day influence the housing and area conversation earlier."
    );
    watchouts.push("Do not leave school as a vague maybe if it is strong enough to change the whole week.");
    tests.push("Does the family still like the area after drop-off and pickup are real?");
    nextLinks.splice(1, 0, { title: schoolPlanningGuideLabel, href: schoolPlanningGuideHref });
    nextLinks.push({ title: "After-school rhythm guide", href: "/guides/after-school-rhythm-in-bali-for-families" });
  }

  if (anchor === "camp-class") {
    anchors.push("One lighter child anchor can reveal a lot without forcing the whole move to harden too early.");
    tests.push("Does the child settle faster once there is one repeating outside-the-house rhythm?");
    nextLinks.splice(1, 0, { title: "Camps", href: "/camps" });
  }

  if (anchor === "not-yet") {
    watchouts.push("Without a repeating child anchor, every day can start to feel like a one-off.");
    tests.push("What would give the child repetition fastest without overcommitting the family?");
  }

  if (kids !== "teens") {
    nextLinks.push({ title: "How to build a calm weekday rhythm", href: "/guides/how-to-build-a-calm-weekday-rhythm-in-bali" });
  }

  return {
    headline,
    summary,
    anchors: Array.from(new Set(anchors)).slice(0, 5),
    watchouts: Array.from(new Set(watchouts)).slice(0, 5),
    tests: Array.from(new Set(tests)).slice(0, 4),
    nextLinks: Array.from(new Map(nextLinks.map((item) => [item.href, item])).values()).slice(0, 5),
  };
}

export default function WeekdayRealityBuilder() {
  const [kids, setKids] = useState<KidsKey>("primary");
  const [work, setWork] = useState<WorkKey>("flexible");
  const [commute, setCommute] = useState<CommuteKey>("medium");
  const [weather, setWeather] = useState<WeatherKey>("dry");
  const [anchor, setAnchor] = useState<AnchorKey>("empathy");

  const plan = useMemo(() => buildPlan(kids, work, commute, weather, anchor), [kids, work, commute, weather, anchor]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className={cardCls}>
        <div className={badge}>Reality builder</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Pressure-test the ordinary week</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Choose the family shape that feels closest to real life right now. This tool does not predict the move. It helps you notice which parts of the weekday need more honesty.
        </p>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Children's stage</span>
            <select className={inputBase} value={kids} onChange={(e) => setKids(e.target.value as KidsKey)}>
              {Object.entries(kidsLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Adult work shape</span>
            <select className={inputBase} value={work} onChange={(e) => setWork(e.target.value as WorkKey)}>
              {Object.entries(workLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Commute tolerance</span>
            <select className={inputBase} value={commute} onChange={(e) => setCommute(e.target.value as CommuteKey)}>
              {Object.entries(commuteLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Week you want to test</span>
            <select className={inputBase} value={weather} onChange={(e) => setWeather(e.target.value as WeatherKey)}>
              {Object.entries(weatherLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Child anchor</span>
            <select className={inputBase} value={anchor} onChange={(e) => setAnchor(e.target.value as AnchorKey)}>
              {Object.entries(anchorLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Week summary</div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{plan.headline}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-600">{plan.summary}</p>
          <div className={btnRow}>
            <a className={buttonPrimary} href="/resources/weekday-reality-planner" data-track="weekday_reality_planner">
              Open the planner
            </a>
            <a className={buttonSecondary} href={buildContactHref("General move planning", { from: "/weekday-reality" })} data-track="weekday_reality_contact">
              Ask a planning question
            </a>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className={cardCls}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Build around these anchors</div>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
              {plan.anchors.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={cardCls}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Watch these pressure points</div>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
              {plan.watchouts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className={cardCls}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Questions worth testing this week</div>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-600">
              {plan.tests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={cardCls}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Best next pages</div>
            <div className="mt-4 grid gap-3">
              {plan.nextLinks.map((item) => (
                <a key={item.href} href={item.href} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white">
                  {item.title} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
