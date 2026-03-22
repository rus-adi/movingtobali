"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import {
  AreaItem,
  cleanAreaTitle,
  clamp,
  getAreaProfile,
  inverseLevelValue,
  levelValue,
} from "@/lib/areaDecision";
import { badge, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type SchoolKey = "yes" | "maybe" | "no";
type KidsKey = "toddlers" | "primary" | "teens" | "mixed";
type WorkKey = "light" | "normal" | "heavy";
type TripsKey = "one" | "two" | "many";
type ToleranceKey = "low" | "medium" | "high";
type EnergyKey = "fragile" | "mixed" | "steady";
type MoveKey = "test" | "move";

type LensCard = { title: string; body: string; tone: string };

function commuteScore(area: AreaItem, opts: {
  school: SchoolKey;
  kids: KidsKey;
  work: WorkKey;
  trips: TripsKey;
  tolerance: ToleranceKey;
  energy: EnergyKey;
  move: MoveKey;
}): number {
  const meta = area.area;
  const profile = getAreaProfile(area.slug);

  let score = levelValue(meta?.traffic) * 10;

  if (opts.school === "yes") score += (6 - profile.empathy) * 7;
  if (opts.school === "maybe") score += (6 - profile.empathy) * 3;

  if (opts.kids === "toddlers") score += 10;
  if (opts.kids === "primary") score += opts.school === "no" ? 7 : 11;
  if (opts.kids === "teens") score += 4;
  if (opts.kids === "mixed") score += 9;

  if (opts.work === "normal") score += 7;
  if (opts.work === "heavy") score += 14;

  if (opts.trips === "two") score += 6;
  if (opts.trips === "many") score += 12;

  if (opts.tolerance === "medium") score += 6;
  if (opts.tolerance === "low") score += 14;

  if (opts.energy === "mixed") score += 6;
  if (opts.energy === "fragile") score += 12;

  if (opts.move === "test") score += 4;

  score -= inverseLevelValue(meta?.traffic) * 2;
  score -= levelValue(meta?.walkability);
  score -= Math.round(levelValue(meta?.familyFit) * 0.5);

  return clamp(Math.round(score), 18, 95);
}

function scoreLabel(score: number): { label: string; note: string } {
  if (score >= 75) return { label: "High friction", note: "This setup can quietly drain the whole family unless you deliberately shorten the radius." };
  if (score >= 58) return { label: "Watch carefully", note: "Still possible, but the commute needs real testing before housing becomes a commitment." };
  if (score >= 42) return { label: "Manageable", note: "Viable if the area keeps earning its place during school-time tests and tired-afternoon tests." };
  return { label: "Relatively protected", note: "The commute is less likely to become the hidden reason the move feels heavy." };
}

function buildLenses(area: AreaItem, opts: {
  school: SchoolKey;
  kids: KidsKey;
  work: WorkKey;
  trips: TripsKey;
  tolerance: ToleranceKey;
  energy: EnergyKey;
}, score: number): LensCard[] {
  const meta = area.area;
  const profile = getAreaProfile(area.slug);
  const lenses: LensCard[] = [];

  const morning = score >= 58
    ? "Mornings need more margin than you think. One small delay can spill into everyone’s day if the route is already tight."
    : "Morning rhythm has a better chance of staying readable, which matters more than a glamorous address.";

  const afterSchool = score >= 58 || opts.energy === "fragile"
    ? "After-school energy is the first place this setup will complain. Protect pickup, snacks, and the route home before adding extras."
    : "After-school life is more likely to stay usable, which gives the family a better chance of enjoying Bali beyond logistics.";

  const housing = opts.school !== "no" && profile.empathy <= 2
    ? "If Empathy School matters, commute needs to outrank beautiful housing details here. Otherwise the house can become the most expensive compromise in the plan."
    : levelValue(meta?.traffic) >= 4
      ? "Pick housing for route quality and repeatability, not only for villa aesthetics or map-pin optimism."
      : "Housing can carry a little more personality here because the weekly route is less likely to dominate every other decision.";

  lenses.push({ title: "Morning buffer", body: morning, tone: score >= 58 ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white" });
  lenses.push({ title: "After-school drag", body: afterSchool, tone: score >= 58 ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white" });
  lenses.push({ title: "What housing should optimize for", body: housing, tone: "border-gray-200 bg-white" });

  return lenses;
}

function buildNextSteps(area: AreaItem, opts: { school: SchoolKey; score: number }): string[] {
  const profile = getAreaProfile(area.slug);
  const steps: string[] = [];

  if (opts.score >= 58) {
    steps.push("Do one school-time drive and one late-afternoon return before treating this area as settled.");
  } else {
    steps.push("Keep the area in the shortlist, but still test it at the exact hours your real week will use.");
  }

  if (opts.school !== "no" && profile.empathy <= 2) {
    steps.push("Let the Empathy School question influence the shortlist earlier instead of hoping the commute works itself out.");
  }

  steps.push("Use the housing brief builder only after you know which radius the family can live with on an ordinary week.");
  return steps;
}

export default function CommuteRealityChecker({ areas }: { areas: AreaItem[] }) {
  const [areaSlug, setAreaSlug] = useState("sanur");
  const [school, setSchool] = useState<SchoolKey>("maybe");
  const [kids, setKids] = useState<KidsKey>("primary");
  const [work, setWork] = useState<WorkKey>("normal");
  const [trips, setTrips] = useState<TripsKey>("two");
  const [tolerance, setTolerance] = useState<ToleranceKey>("medium");
  const [energy, setEnergy] = useState<EnergyKey>("mixed");
  const [move, setMove] = useState<MoveKey>("move");

  const area = areas.find((item) => item.slug === areaSlug) || areas[0];

  const result = useMemo(() => {
    const score = commuteScore(area, { school, kids, work, trips, tolerance, energy, move });
    const label = scoreLabel(score);
    return {
      score,
      ...label,
      lenses: buildLenses(area, { school, kids, work, trips, tolerance, energy }, score),
      nextSteps: buildNextSteps(area, { school, score }),
    };
  }, [area, energy, kids, move, school, tolerance, trips, work]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className={cardCls}>
        <div className={badge}>Commute reality</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Test the route before it quietly shapes the whole move.</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          A commute can look survivable on a map and still flatten mornings, school pickup, or adult work windows. Use this before you romanticize an area.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-gray-700 md:col-span-2">
            Likely home area
            <select className={inputBase} value={areaSlug} onChange={(e) => setAreaSlug(e.target.value)}>
              {areas.map((item) => (
                <option key={item.slug} value={item.slug}>{cleanAreaTitle(item.title)}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Is Empathy School in the picture?
            <select className={inputBase} value={school} onChange={(e) => setSchool(e.target.value as SchoolKey)}>
              <option value="yes">Yes, likely</option>
              <option value="maybe">Maybe</option>
              <option value="no">No</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Child stage
            <select className={inputBase} value={kids} onChange={(e) => setKids(e.target.value as KidsKey)}>
              <option value="toddlers">Toddlers</option>
              <option value="primary">Primary-age kids</option>
              <option value="teens">Pre-teens / teens</option>
              <option value="mixed">Mixed ages</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Adult work pressure
            <select className={inputBase} value={work} onChange={(e) => setWork(e.target.value as WorkKey)}>
              <option value="light">Light</option>
              <option value="normal">Normal</option>
              <option value="heavy">Heavy</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            How many daily loops?
            <select className={inputBase} value={trips} onChange={(e) => setTrips(e.target.value as TripsKey)}>
              <option value="one">Mostly one anchor trip</option>
              <option value="two">Two main loops</option>
              <option value="many">Lots of moving parts</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Family commute tolerance
            <select className={inputBase} value={tolerance} onChange={(e) => setTolerance(e.target.value as ToleranceKey)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700">
            After-school energy
            <select className={inputBase} value={energy} onChange={(e) => setEnergy(e.target.value as EnergyKey)}>
              <option value="fragile">Fragile</option>
              <option value="mixed">Mixed</option>
              <option value="steady">Steady</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium text-gray-700 md:col-span-2">
            Move shape
            <select className={inputBase} value={move} onChange={(e) => setMove(e.target.value as MoveKey)}>
              <option value="test">Testing Bali first</option>
              <option value="move">Longer move / settling</option>
            </select>
          </label>
        </div>

        <div className={btnRow}>
          <a className={buttonPrimary} href="/compare-areas" data-track="commute_compare_areas">Compare two areas</a>
          <a className={buttonSecondary} href="/resources/empathy-school-commute-decision-grid" data-track="commute_grid">Open commute decision grid</a>
        </div>
      </div>

      <div className={cardCls}>
        <div className={badge}>{result.label}</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
          {cleanAreaTitle(area.title)}: {result.score}/100 commute pressure
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{result.note}</p>

        <div className="mt-5 h-3 rounded-full bg-gray-100">
          <div className="h-3 rounded-full bg-blue-600" style={{ width: `${result.score}%` }} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {result.lenses.map((item) => (
            <div key={item.title} className={`rounded-2xl border p-5 ${item.tone}`}>
              <div className="text-sm font-semibold text-gray-900">{item.title}</div>
              <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="text-sm font-semibold text-gray-900">What to do next</div>
          <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-600">
            {result.nextSteps.map((step) => <li key={step}>{step}</li>)}
          </ul>
        </div>
      </div>

      <div className="lg:col-span-2 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Short commute",
            body: "Gives mornings, pickups, and work windows more room to survive imperfect days. It also makes test stays more honest because less of the trip disappears into transport.",
          },
          {
            title: "Medium commute",
            body: "Can work if the route is predictable and the family is not already overloaded. The question is less distance than whether the margin still exists on a tired Wednesday.",
          },
          {
            title: "Long / fragile commute",
            body: "Usually means housing needs to serve the route, not the other way around. It can still work, but the house and the area have to earn that cost in daily energy.",
          },
        ].map((item) => (
          <div key={item.title} className={cardCls}>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className={badge}>School + housing reality</div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Do not separate the commute from the housing brief.</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              If the commute is already heavy, the housing search should optimize for radius, repeatability, and calmer mornings before it optimizes for a dream listing.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <a className={buttonPrimary} href={buildContactHref("Area + budget question", { from: "/commute-reality" })} data-track="commute_contact">
              Ask about area + commute
            </a>
            <a className={buttonSecondary} href="/housing-brief-builder" data-track="commute_housing_brief">
              Build the housing brief
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
