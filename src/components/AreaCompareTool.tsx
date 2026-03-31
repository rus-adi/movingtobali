"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import {
  AreaItem,
  cleanAreaTitle,
  getAreaProfile,
  inverseLevelValue,
  levelValue,
  toPercentFromFive,
  weightedAverage,
} from "@/lib/areaDecision";
import { badge, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type FocusKey = "calm" | "easy" | "school" | "balanced";
type KidsKey = "toddlers" | "primary" | "teens" | "mixed";
type SchoolKey = "yes" | "maybe" | "no";
type StayKey = "test" | "move";
type BudgetKey = "value" | "flexible" | "premium";

type Signal = {
  key: string;
  label: string;
  description: string;
  left: number;
  right: number;
};

function childFit(slug: string, kids: KidsKey): number {
  const profile = getAreaProfile(slug);
  if (kids === "toddlers") return toPercentFromFive(profile.toddler);
  if (kids === "primary") return toPercentFromFive(profile.primary);
  if (kids === "teens") return toPercentFromFive(profile.teen);
  return toPercentFromFive((profile.toddler + profile.primary + profile.teen) / 3);
}

function signalSet(area: AreaItem, kids: KidsKey): Signal[] {
  const meta = area.area;
  const profile = getAreaProfile(area.slug);

  const calm = Math.round(
    weightedAverage([
      [profile.calm, 3],
      [inverseLevelValue(meta?.traffic), 2],
      [inverseLevelValue(meta?.noise), 2],
      [levelValue(meta?.natureAccess), 1],
    ]) * 20
  );

  const easyWeek = Math.round(
    weightedAverage([
      [profile.easy, 2],
      [profile.practical, 2],
      [inverseLevelValue(meta?.traffic), 2],
      [levelValue(meta?.walkability), 1],
      [levelValue(meta?.familyFit), 1],
    ]) * 20
  );

  const schoolAnchor = Math.round(
    weightedAverage([
      [profile.empathy, 4],
      [inverseLevelValue(meta?.traffic), 2],
      [profile.primary, 1],
    ]) * 20
  );

  const shortStay = Math.round(
    weightedAverage([
      [profile.shortStay, 3],
      [profile.easy, 1],
      [inverseLevelValue(meta?.traffic), 1],
    ]) * 20
  );

  const budgetEase = Math.round(
    weightedAverage([
      [inverseLevelValue(meta?.costTier), 3],
      [inverseLevelValue(meta?.traffic), 1],
    ]) * 20
  );

  const social = Math.round(
    weightedAverage([
      [profile.social, 2],
      [levelValue(meta?.beachAccess), 1],
      [levelValue(meta?.walkability), 1],
    ]) * 20
  );

  return [
    { key: "calm", label: "Calmer week", description: "Lower drag, softer pace, and easier regulation.", left: calm, right: 0 },
    { key: "easy", label: "Weekday ease", description: "Errands, movement, and family logistics.", left: easyWeek, right: 0 },
    { key: "school", label: "Empathy School anchor", description: "How naturally the school question can sit inside the week.", left: schoolAnchor, right: 0 },
    { key: "kids", label: "Child-stage fit", description: "How well the area tends to fit your current age mix.", left: childFit(area.slug, kids), right: 0 },
    { key: "budget", label: "Budget ease", description: "How likely the area is to keep costs from escalating too quickly.", left: budgetEase, right: 0 },
    { key: "short", label: "Short-stay friendliness", description: "How easy it is to learn something useful during a shorter test.", left: shortStay, right: 0 },
    { key: "social", label: "Social / convenience energy", description: "How much activity and convenience sit nearby.", left: social, right: 0 },
  ];
}

function weightForSignal(signal: string, focus: FocusKey, school: SchoolKey, stay: StayKey, budget: BudgetKey): number {
  if (focus === "calm") {
    if (signal === "calm") return 4;
    if (signal === "easy") return 3;
    if (signal === "kids") return 2;
    if (signal === "budget") return budget === "value" ? 2 : 1;
    if (signal === "school") return school === "yes" ? 2 : 1;
    if (signal === "short") return stay === "test" ? 2 : 1;
    return 1;
  }
  if (focus === "easy") {
    if (signal === "easy") return 4;
    if (signal === "budget") return 2;
    if (signal === "kids") return 2;
    if (signal === "school") return school === "yes" ? 2 : 1;
    if (signal === "calm") return 2;
    return 1;
  }
  if (focus === "school") {
    if (signal === "school") return school === "no" ? 2 : 5;
    if (signal === "easy") return 3;
    if (signal === "kids") return 2;
    if (signal === "calm") return 2;
    if (signal === "budget") return budget === "value" ? 2 : 1;
    return 1;
  }
  if (signal === "easy") return 3;
  if (signal === "calm") return 2;
  if (signal === "kids") return 2;
  if (signal === "school") return school === "yes" ? 2 : 1;
  if (signal === "short") return stay === "test" ? 2 : 1;
  if (signal === "budget") return budget === "value" ? 2 : 1;
  return 1;
}

function chooseIfBullets(area: AreaItem, opts: { school: SchoolKey; focus: FocusKey; budget: BudgetKey; stay: StayKey }): string[] {
  const meta = area.area;
  const profile = getAreaProfile(area.slug);
  const bullets: string[] = [];

  if (opts.focus === "calm" && profile.calm >= 4) bullets.push("you want the week to feel slower, softer, and less reactive");
  if (opts.focus === "easy" && profile.easy >= 4) bullets.push("weekday logistics matter more than chasing the most exciting Bali version");
  if (opts.focus === "school" && profile.empathy >= 4) bullets.push("Empathy School may need to anchor area choice rather than stay abstract");
  if (opts.stay === "test" && profile.shortStay >= 4) bullets.push("you want a shorter stay to teach you something useful quickly");
  if (opts.budget === "value" && inverseLevelValue(meta?.costTier) >= 4) bullets.push("you want a shortlist that is less likely to force a premium housing range early");
  if (levelValue(meta?.natureAccess) >= 4) bullets.push("nature access helps the family regulate better than more activity does");
  if (levelValue(meta?.walkability) >= 4) bullets.push("walkable errands would noticeably improve the week");
  if (!bullets.length && meta?.note) bullets.push(meta.note);
  return bullets.slice(0, 3);
}

function whatChangesBullets(area: AreaItem, school: SchoolKey): string[] {
  const meta = area.area;
  const profile = getAreaProfile(area.slug);
  const bullets: string[] = [];

  if (school !== "no" && profile.empathy >= 4) {
    bullets.push("School can stay inside the move conversation instead of becoming a separate long-drive problem.");
  }
  if (school !== "no" && profile.empathy <= 2) {
    bullets.push("If Empathy School becomes real, the commute question gets heavier much faster here.");
  }
  if (levelValue(meta?.traffic) >= 4) {
    bullets.push("Morning buffer, driver planning, and saying no to extra loops matter more than the area’s online vibe.");
  }
  if (levelValue(meta?.walkability) <= 2) {
    bullets.push("More of daily life becomes car-based, so convenience depends on route quality rather than map distance.");
  }
  if (levelValue(meta?.noise) >= 4) {
    bullets.push("Street choice matters as much as the area label because the wrong lane can make evenings feel louder than expected.");
  }
  if (levelValue(meta?.natureAccess) >= 4) {
    bullets.push("It becomes easier to use outdoor reset time as part of the family rhythm instead of a special outing.");
  }
  if (levelValue(meta?.costTier) >= 4) {
    bullets.push("Housing and convenience spending tend to climb faster, so the budget needs more margin to stay calm.");
  }
  if (!bullets.length && meta?.note) bullets.push(meta.note);
  return bullets.slice(0, 3);
}

function signalScore(signals: Signal[], focus: FocusKey, school: SchoolKey, stay: StayKey, budget: BudgetKey): number {
  const weighted = signals.reduce(
    (sum, signal) => sum + signal.left * weightForSignal(signal.key, focus, school, stay, budget),
    0
  );
  const weights = signals.reduce((sum, signal) => sum + weightForSignal(signal.key, focus, school, stay, budget), 0);
  return Math.round(weighted / Math.max(weights, 1));
}

export default function AreaCompareTool({ areas }: { areas: AreaItem[] }) {
  const [left, setLeft] = useState("sanur");
  const [right, setRight] = useState("ubud");
  const [focus, setFocus] = useState<FocusKey>("balanced");
  const [kids, setKids] = useState<KidsKey>("primary");
  const [school, setSchool] = useState<SchoolKey>("maybe");
  const [stay, setStay] = useState<StayKey>("test");
  const [budget, setBudget] = useState<BudgetKey>("flexible");

  const leftArea = areas.find((item) => item.slug === left) || areas[0];
  const rightArea = areas.find((item) => item.slug === right) || areas[1] || areas[0];

  const compared = useMemo(() => {
    const leftSignals = signalSet(leftArea, kids);
    const rightSignalsBase = signalSet(rightArea, kids);
    const signals = leftSignals.map((signal, index) => ({ ...signal, right: rightSignalsBase[index]?.left || 0 }));

    const leftScore = signalScore(signals.map((signal) => ({ ...signal, right: 0 })), focus, school, stay, budget);
    const rightScore = signalScore(signals.map((signal) => ({ ...signal, left: signal.right, right: 0 })), focus, school, stay, budget);

    const diff = Math.abs(leftScore - rightScore);
    const winner = diff < 5 ? "tie" : leftScore > rightScore ? "left" : "right";
    const reasonSignals = [...signals]
      .map((signal) => ({
        ...signal,
        delta: winner === "right" ? signal.right - signal.left : signal.left - signal.right,
        weight: weightForSignal(signal.key, focus, school, stay, budget),
      }))
      .sort((a, b) => b.delta * b.weight - a.delta * a.weight)
      .filter((signal) => signal.delta > 0)
      .slice(0, 2);

    return { signals, leftScore, rightScore, winner, diff, reasonSignals };
  }, [budget, focus, kids, leftArea, rightArea, school, stay]);

  const summary = useMemo(() => {
    if (compared.winner === "tie") {
      return `Both ${cleanAreaTitle(leftArea.title)} and ${cleanAreaTitle(rightArea.title)} can work. The real choice is which tradeoff you want to carry into the week.`;
    }

    const winnerArea = compared.winner === "left" ? leftArea : rightArea;
    const loserArea = compared.winner === "left" ? rightArea : leftArea;
    const reasonText = compared.reasonSignals.length
      ? compared.reasonSignals.map((signal) => signal.label.toLowerCase()).join(" and ")
      : "the overall weekly fit";

    return `${cleanAreaTitle(winnerArea.title)} edges ${cleanAreaTitle(loserArea.title)} for this setup, mostly because of ${reasonText}.`;
  }, [compared, leftArea, rightArea]);

  const areaOptions = areas.map((area) => ({ value: area.slug, label: cleanAreaTitle(area.title) }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <div className={cardCls}>
        <div className={badge}>Compare areas</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Put two good options side by side.</h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          This is for the moment when both areas sound good on paper and you need to see which version of family life each one actually creates.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Area A
            <select className={inputBase} value={left} onChange={(e) => setLeft(e.target.value)}>
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Area B
            <select className={inputBase} value={right} onChange={(e) => setRight(e.target.value)}>
              {areaOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            What matters most?
            <select className={inputBase} value={focus} onChange={(e) => setFocus(e.target.value as FocusKey)}>
              <option value="balanced">Balanced family fit</option>
              <option value="calm">A calmer week</option>
              <option value="easy">Easier logistics</option>
              <option value="school">Let Empathy School shape the choice</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Child stage right now
            <select className={inputBase} value={kids} onChange={(e) => setKids(e.target.value as KidsKey)}>
              <option value="toddlers">Toddlers</option>
              <option value="primary">Primary-age kids</option>
              <option value="teens">Pre-teens / teens</option>
              <option value="mixed">Mixed ages</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Is Empathy School part of it?
            <select className={inputBase} value={school} onChange={(e) => setSchool(e.target.value as SchoolKey)}>
              <option value="yes">Yes, likely</option>
              <option value="maybe">Maybe</option>
              <option value="no">Not really</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Move shape
            <select className={inputBase} value={stay} onChange={(e) => setStay(e.target.value as StayKey)}>
              <option value="test">Short test stay first</option>
              <option value="move">Longer move / settling</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700 md:col-span-2">
            Budget posture
            <select className={inputBase} value={budget} onChange={(e) => setBudget(e.target.value as BudgetKey)}>
              <option value="value">Keep it value-conscious</option>
              <option value="flexible">Some flexibility</option>
              <option value="premium">Willing to pay more for convenience</option>
            </select>
          </label>
        </div>

        <div className={btnRow}>
          <a className={buttonPrimary} href="/commute-reality" data-track="compare_areas_commute">
            Test commute reality
          </a>
          <a className={buttonSecondary} href="/resources/two-area-comparison-sheet" data-track="compare_areas_sheet">
            Two-area comparison sheet
          </a>
        </div>
      </div>

      <div className={cardCls}>
        <div className={badge}>{compared.winner === "tie" ? "Near tie" : "Comparison result"}</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{summary}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          Use this to decide what to test next, not to crown a perfect winner from your laptop.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            {
              area: leftArea,
              score: compared.leftScore,
              active: compared.winner === "left",
              chooseIf: chooseIfBullets(leftArea, { school, focus, budget, stay }),
              changes: whatChangesBullets(leftArea, school),
            },
            {
              area: rightArea,
              score: compared.rightScore,
              active: compared.winner === "right",
              chooseIf: chooseIfBullets(rightArea, { school, focus, budget, stay }),
              changes: whatChangesBullets(rightArea, school),
            },
          ].map((card) => (
            <div key={card.area.slug} className={`rounded-2xl border p-5 ${card.active ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">{card.area.category || "Area"}</div>
                  <div className="mt-2 text-xl font-semibold tracking-tight text-gray-900">{cleanAreaTitle(card.area.title)}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900">{card.score}/100</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-700">{card.area.description}</p>
              <div className="mt-4 text-sm font-semibold text-gray-900">Choose this if…</div>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-700">
                {card.chooseIf.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="mt-4 text-sm font-semibold text-gray-900">What changes if you choose it</div>
              <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-700">
                {card.changes.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="mt-5 text-sm font-semibold text-gray-900">
                <a href={`/areas/${card.area.slug}`}>Open area guide →</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 grid gap-4">
        {compared.signals.map((signal) => {
          const leftLeading = signal.left > signal.right;
          const rightLeading = signal.right > signal.left;
          return (
            <div key={signal.key} className={cardCls}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900">{signal.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{signal.description}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                  What changes if you choose this
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div>
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-900">
                    <span>{cleanAreaTitle(leftArea.title)}</span>
                    <span>{signal.left}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-gray-100">
                    <div className={`h-3 rounded-full ${leftLeading ? "bg-blue-600" : "bg-gray-300"}`} style={{ width: `${signal.left}%` }} />
                  </div>
                </div>
                <div className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">vs</div>
                <div>
                  <div className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-900">
                    <span>{cleanAreaTitle(rightArea.title)}</span>
                    <span>{signal.right}</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-gray-100">
                    <div className={`h-3 rounded-full ${rightLeading ? "bg-blue-600" : "bg-gray-300"}`} style={{ width: `${signal.right}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lg:col-span-2 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "If the result is close",
            body: "Treat both areas as live options. Do one school-time drive, one grocery run, and one late-afternoon visit in each before acting like one is obviously better.",
          },
          {
            title: "If Empathy School still feels vague",
            body: "Use the commute question anyway. Even a maybe-school can change which side of Bali deserves your time.",
          },
          {
            title: "If housing feels urgent",
            body: "Do not let pretty listings break the shortlist. Compare areas first, then let Gaia Group help once the radius is real enough to be useful.",
          },
        ].map((item) => (
          <div key={item.title} className={cardCls}>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className={badge}>Still stuck?</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Use the comparison to ask a sharper question.</h3>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              When families compare areas well, the next question is rarely “Which Bali area is best?” It becomes “Which tradeoff is better for our actual week?”
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <a className={buttonPrimary} href={buildContactHref("Area + budget question", { from: "/compare-areas" })} data-track="compare_areas_contact">
              Ask an area question
            </a>
            <a className={buttonSecondary} href="/housing-intro-readiness" data-track="compare_areas_housing">
              Housing readiness
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
