"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import { badge, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type AreaMeta = {
  pace?: string;
  traffic?: string;
  walkability?: string;
  familyFit?: string;
  beachAccess?: string;
  natureAccess?: string;
  noise?: string;
  costTier?: string;
  note?: string;
};

type AreaItem = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  area?: AreaMeta;
};

type FitKey = "calm" | "easy" | "social" | "practical";
type KidsKey = "toddlers" | "primary" | "teens" | "mixed";
type SchoolKey = "yes" | "maybe" | "no";
type CommuteKey = "low" | "medium" | "high";
type BudgetKey = "value" | "flexible" | "premium";
type WalkKey = "important" | "nice" | "not-important";
type StayKey = "test" | "trial" | "move";

type AreaProfile = {
  calm: number;
  easy: number;
  social: number;
  practical: number;
  empathy: number;
  toddler: number;
  primary: number;
  teen: number;
  walkability: number;
  shortStay: number;
};

const AREA_PROFILES: Record<string, AreaProfile> = {
  amed: { calm: 5, easy: 1, social: 1, practical: 1, empathy: 1, toddler: 2, primary: 2, teen: 2, walkability: 1, shortStay: 2 },
  berawa: { calm: 1, easy: 2, social: 5, practical: 3, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 3, shortStay: 4 },
  canggu: { calm: 1, easy: 2, social: 5, practical: 2, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 2, shortStay: 4 },
  denpasar: { calm: 2, easy: 4, social: 2, practical: 5, empathy: 2, toddler: 3, primary: 3, teen: 2, walkability: 3, shortStay: 2 },
  jimbaran: { calm: 4, easy: 4, social: 2, practical: 3, empathy: 2, toddler: 4, primary: 4, teen: 3, walkability: 2, shortStay: 3 },
  kerobokan: { calm: 3, easy: 3, social: 3, practical: 4, empathy: 1, toddler: 3, primary: 3, teen: 3, walkability: 2, shortStay: 3 },
  "nusa-dua": { calm: 4, easy: 3, social: 1, practical: 2, empathy: 1, toddler: 4, primary: 3, teen: 3, walkability: 2, shortStay: 3 },
  pererenan: { calm: 2, easy: 2, social: 4, practical: 2, empathy: 1, toddler: 3, primary: 3, teen: 4, walkability: 1, shortStay: 4 },
  renon: { calm: 3, easy: 4, social: 2, practical: 5, empathy: 2, toddler: 4, primary: 4, teen: 3, walkability: 3, shortStay: 2 },
  sanur: { calm: 4, easy: 5, social: 3, practical: 4, empathy: 2, toddler: 5, primary: 4, teen: 3, walkability: 4, shortStay: 5 },
  seminyak: { calm: 2, easy: 4, social: 4, practical: 4, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 4, shortStay: 4 },
  seseh: { calm: 4, easy: 3, social: 2, practical: 2, empathy: 1, toddler: 4, primary: 3, teen: 2, walkability: 1, shortStay: 3 },
  sidemen: { calm: 5, easy: 1, social: 1, practical: 1, empathy: 1, toddler: 3, primary: 2, teen: 1, walkability: 1, shortStay: 2 },
  ubud: { calm: 5, easy: 3, social: 2, practical: 3, empathy: 5, toddler: 4, primary: 5, teen: 3, walkability: 2, shortStay: 4 },
  uluwatu: { calm: 3, easy: 2, social: 3, practical: 1, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 1, shortStay: 3 },
  umalas: { calm: 4, easy: 4, social: 3, practical: 4, empathy: 1, toddler: 4, primary: 4, teen: 3, walkability: 2, shortStay: 4 },
};

function clamp(num: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, num));
}

function cleanTitle(title: string): string {
  return title.replace(/\sfor families$/i, "");
}

function levelValue(value?: string): number {
  const s = String(value || "").trim().toLowerCase();
  if (!s) return 2;
  if (s === "high") return 5;
  if (s === "medium-high" || s === "moderate-fast") return 4;
  if (s === "medium" || s === "moderate") return 3;
  if (s === "low-medium" || s === "moderate-slow") return 2;
  if (s === "low" || s === "slow") return 1;
  return 3;
}

function inverseLevelValue(value?: string): number {
  return 6 - levelValue(value);
}

function budgetFit(costTier: string | undefined, budget: BudgetKey): number {
  const cost = levelValue(costTier);
  if (budget === "value") return clamp((6 - cost) * 12);
  if (budget === "premium") return clamp(cost * 12);
  const middleDistance = Math.abs(cost - 3);
  return clamp(48 - middleDistance * 8);
}

function commuteFit(traffic: string | undefined, commute: CommuteKey): number {
  const inverse = inverseLevelValue(traffic);
  if (commute === "low") return clamp(inverse * 12);
  if (commute === "medium") return clamp(30 + inverse * 6);
  return 36;
}

function walkFit(profile: AreaProfile, meta: AreaMeta | undefined, walk: WalkKey): number {
  const base = Math.round(((profile.walkability + levelValue(meta?.walkability)) / 2) * 5);
  if (walk === "important") return base;
  if (walk === "nice") return Math.round(base * 0.45);
  return 0;
}

function schoolFit(profile: AreaProfile, school: SchoolKey, category?: string): number {
  if (school === "no") return 0;
  const categoryBoost = String(category || "").toLowerCase().includes("ubud") ? 10 : 0;
  if (school === "yes") return profile.empathy * 10 + categoryBoost;
  return Math.round(profile.empathy * 4 + categoryBoost * 0.4);
}

function stayFit(profile: AreaProfile, fit: FitKey, stay: StayKey): number {
  if (stay === "test") return profile.shortStay * 8 + (fit === "social" ? 4 : 0);
  if (stay === "move") return profile.practical * 6 + profile.easy * 4;
  return profile.shortStay * 4 + profile.easy * 4;
}

function kidsFit(profile: AreaProfile, kids: KidsKey): number {
  if (kids === "toddlers") return profile.toddler * 10;
  if (kids === "primary") return profile.primary * 10;
  if (kids === "teens") return profile.teen * 10;
  return Math.round(((profile.toddler + profile.primary + profile.teen) / 3) * 8);
}

function fitWeight(profile: AreaProfile, fit: FitKey): number {
  return profile[fit] * 12;
}

function familyFit(meta: AreaMeta | undefined): number {
  return levelValue(meta?.familyFit) * 8;
}

function naturalBonus(meta: AreaMeta | undefined, fit: FitKey): number {
  if (fit !== "calm") return 0;
  return levelValue(meta?.natureAccess) * 3 + inverseLevelValue(meta?.noise) * 3;
}

function socialBonus(meta: AreaMeta | undefined, fit: FitKey): number {
  if (fit !== "social") return 0;
  return levelValue(meta?.beachAccess) * 3 + levelValue(meta?.walkability) * 2;
}

function practicalBonus(meta: AreaMeta | undefined, fit: FitKey): number {
  if (fit !== "practical") return 0;
  return inverseLevelValue(meta?.traffic) * 4 + levelValue(meta?.walkability) * 2;
}

function easyBonus(meta: AreaMeta | undefined, fit: FitKey): number {
  if (fit !== "easy") return 0;
  return inverseLevelValue(meta?.traffic) * 4 + levelValue(meta?.familyFit) * 4;
}

function buildReasons(area: AreaItem, profile: AreaProfile, params: {
  fit: FitKey;
  kids: KidsKey;
  school: SchoolKey;
  budget: BudgetKey;
  walk: WalkKey;
}): string[] {
  const reasons: string[] = [];
  const meta = area.area;

  if (params.fit === "calm" && profile.calm >= 4) reasons.push("slower pace and a calmer home rhythm");
  if (params.fit === "easy" && profile.easy >= 4) reasons.push("easier weekday logistics for families");
  if (params.fit === "social" && profile.social >= 4) reasons.push("more activity, cafes, and social energy nearby");
  if (params.fit === "practical" && profile.practical >= 4) reasons.push("more practical for errands and everyday life");

  if (params.kids === "toddlers" && profile.toddler >= 4) reasons.push("stronger fit for toddler routines and shorter loops");
  if (params.kids === "primary" && profile.primary >= 4) reasons.push("better odds of a steady primary-age rhythm");
  if (params.kids === "teens" && profile.teen >= 4) reasons.push("gives older kids a better chance of liking the week");

  if (params.school !== "no" && profile.empathy >= 4) reasons.push("makes more sense when Empathy School may anchor the move");

  if (params.budget === "value" && inverseLevelValue(meta?.costTier) >= 3) reasons.push("less likely to force a premium budget band too early");
  if (params.budget === "premium" && levelValue(meta?.costTier) >= 4) reasons.push("matches families who want more convenience or premium stock");

  if (params.walk === "important" && profile.walkability >= 4) reasons.push("better odds of easier walkable errands");
  if (params.fit === "calm" && levelValue(meta?.natureAccess) >= 4) reasons.push("stronger nature access when that matters to the family mood");

  if (!reasons.length && meta?.note) reasons.push(meta.note);
  return reasons.slice(0, 3);
}

function buildCaution(area: AreaItem, params: { fit: FitKey; school: SchoolKey; commute: CommuteKey }): string {
  const meta = area.area;
  const trafficHigh = levelValue(meta?.traffic) >= 4;
  const noiseHigh = levelValue(meta?.noise) >= 4;
  const profile = AREA_PROFILES[area.slug] || AREA_PROFILES.sanur;

  if (params.school !== "no" && profile.empathy <= 2) {
    return "If Empathy School becomes real, test the drive honestly before you get attached to the area story.";
  }
  if (params.commute === "low" && trafficHigh) {
    return "This only works if your family can absorb commute friction without it poisoning the whole week.";
  }
  if (params.fit === "calm" && noiseHigh) {
    return "Street choice matters a lot here. Visit at night before treating the area as calm.";
  }
  if (meta?.note) return meta.note;
  return "Treat this as a shortlist signal, not a verdict. Street-by-street reality still matters.";
}

export default function AreaMatcher({ areas }: { areas: AreaItem[] }) {
  const [fit, setFit] = useState<FitKey>("easy");
  const [kids, setKids] = useState<KidsKey>("primary");
  const [school, setSchool] = useState<SchoolKey>("maybe");
  const [commute, setCommute] = useState<CommuteKey>("medium");
  const [budget, setBudget] = useState<BudgetKey>("flexible");
  const [walk, setWalk] = useState<WalkKey>("nice");
  const [stay, setStay] = useState<StayKey>("trial");

  const results = useMemo(() => {
    return areas
      .map((area) => {
        const profile = AREA_PROFILES[area.slug] || AREA_PROFILES.sanur;
        const score = clamp(
          fitWeight(profile, fit)
          + kidsFit(profile, kids)
          + schoolFit(profile, school, area.category)
          + commuteFit(area.area?.traffic, commute)
          + budgetFit(area.area?.costTier, budget)
          + walkFit(profile, area.area, walk)
          + stayFit(profile, fit, stay)
          + familyFit(area.area)
          + naturalBonus(area.area, fit)
          + socialBonus(area.area, fit)
          + practicalBonus(area.area, fit)
          + easyBonus(area.area, fit),
          0,
          400
        );

        return {
          area,
          score,
          reasons: buildReasons(area, profile, { fit, kids, school, budget, walk }),
          caution: buildCaution(area, { fit, school, commute }),
        };
      })
      .sort((a, b) => b.score - a.score || cleanTitle(a.area.title).localeCompare(cleanTitle(b.area.title)))
      .slice(0, 4);
  }, [areas, budget, commute, fit, kids, school, stay, walk]);

  const summary = useMemo(() => {
    if (fit === "calm") return "You are optimizing for a softer week: less drag, more breathing room, and fewer choices that only look good online.";
    if (fit === "social") return "You are optimizing for energy: more things happening, more convenience, and a higher chance that the family actually uses the area.";
    if (fit === "practical") return "You are optimizing for usefulness: errands, routine, and a week that feels manageable even when everyone is tired.";
    return "You are optimizing for easier family rhythm: steadier mornings, less friction, and a place that helps the week hold together.";
  }, [fit]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
      <div className={cardCls}>
        <div className={badge}>Area match</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Narrow Bali down before you go all-in on housing.</h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          Pick the family rhythm you are actually trying to build. The goal is not to find one perfect area. The goal is to stop comparing places that solve different problems.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">What kind of week do you want most?</span>
            <select className={inputBase} value={fit} onChange={(e) => setFit(e.target.value as FitKey)}>
              <option value="easy">Easier routines</option>
              <option value="calm">Calmer pace</option>
              <option value="practical">Practical / errands-first</option>
              <option value="social">More energy and convenience</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Which child stage matters most right now?</span>
            <select className={inputBase} value={kids} onChange={(e) => setKids(e.target.value as KidsKey)}>
              <option value="toddlers">Toddlers</option>
              <option value="primary">Primary age</option>
              <option value="teens">Pre-teens / teens</option>
              <option value="mixed">Mixed ages</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Is Empathy School part of the move?</span>
            <select className={inputBase} value={school} onChange={(e) => setSchool(e.target.value as SchoolKey)}>
              <option value="maybe">Maybe / still testing</option>
              <option value="yes">Yes, likely</option>
              <option value="no">No, not shaping the shortlist</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">How much commute friction can you absorb?</span>
            <select className={inputBase} value={commute} onChange={(e) => setCommute(e.target.value as CommuteKey)}>
              <option value="low">Low tolerance</option>
              <option value="medium">Medium</option>
              <option value="high">High / flexible</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Budget posture</span>
            <select className={inputBase} value={budget} onChange={(e) => setBudget(e.target.value as BudgetKey)}>
              <option value="value">Value-conscious</option>
              <option value="flexible">Flexible middle band</option>
              <option value="premium">Premium convenience is fine</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Walkable errands</span>
            <select className={inputBase} value={walk} onChange={(e) => setWalk(e.target.value as WalkKey)}>
              <option value="nice">Nice to have</option>
              <option value="important">Important</option>
              <option value="not-important">Not a deciding factor</option>
            </select>
          </label>

          <label className="grid gap-2 sm:col-span-2">
            <span className="text-sm font-medium text-gray-900">What stage are you in?</span>
            <select className={inputBase} value={stay} onChange={(e) => setStay(e.target.value as StayKey)}>
              <option value="test">Test stay</option>
              <option value="trial">Trial term / 3–6 months</option>
              <option value="move">Longer move</option>
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-700">
          {summary}
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-900">Best starting points right now</div>
              <div className="mt-1 text-sm text-gray-700">Use these as a shortlist. Then test the street, the commute, and the evening rhythm.</div>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {results.map((result, index) => (
              <div key={result.area.slug} className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                      {index === 0 ? "Top fit" : `Option ${index + 1}`}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
                      <a href={`/areas/${result.area.slug}`} className="transition hover:text-emerald-800">
                        {cleanTitle(result.area.title)}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-700">{result.area.category || "Area guide"}</p>
                  </div>
                  <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                    Score {Math.round(result.score / 4)}
                  </div>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-700">{result.area.description}</p>

                <ul className="mt-4 grid gap-2 text-sm leading-6 text-gray-700">
                  {result.reasons.map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-700">
                  {result.area.area?.pace ? <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Pace: {result.area.area.pace}</span> : null}
                  {result.area.area?.traffic ? <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Traffic: {result.area.area.traffic}</span> : null}
                  {result.area.area?.costTier ? <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Cost: {result.area.area.costTier}</span> : null}
                </div>

                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                  <strong className="font-semibold text-gray-900">Watch out for:</strong> {result.caution}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cardCls}>
          <div className="text-sm font-semibold text-gray-900">What to do with the shortlist</div>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-gray-700">
            <li>• Open the top two area guides and compare the actual tradeoffs, not just the vibe.</li>
            <li>• If Empathy School is likely, test the commute before housing becomes emotional.</li>
            <li>• Request a Gaia Group intro only after your shortlist and budget band feel real.</li>
          </ul>
          <div className={btnRow}>
            <a className={buttonPrimary} href={buildContactHref("Area + budget question", { from: "/area-match" })} data-track="area_match_contact_area_budget">
              Ask about areas + budget
            </a>
            <a className={buttonSecondary} href={buildContactHref("Housing intro", { from: "/area-match", partner: "gaia-group-bali" })} data-track="area_match_contact_housing">
              Request housing intro
            </a>
            <a className={buttonSecondary} href="/schools" data-track="area_match_empathy_school">
              Open school planning guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
