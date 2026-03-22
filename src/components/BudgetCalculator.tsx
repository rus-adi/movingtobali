"use client";

import { useMemo, useState } from "react";
import { badge, cardCls, inputBase } from "@/components/ui/styles";

type Range = { low: number; mid: number; high: number };

const areaOptions = {
  ubudSide: { label: "Ubud side / calmer rhythm", housingAdjust: { low: 0, mid: 0, high: 2 } },
  sanurEasy: { label: "Sanur / easier family routines", housingAdjust: { low: 3, mid: 5, high: 8 } },
  cangguConvenience: { label: "Canggu / more convenience, usually pricier", housingAdjust: { low: 6, mid: 10, high: 16 } },
  flexible: { label: "Still open on area", housingAdjust: { low: 2, mid: 4, high: 7 } },
} as const;

const housingOptions = {
  simple2br: { label: "Simple 2BR setup", range: { low: 18, mid: 24, high: 32 } },
  comfortable3br: { label: "Comfortable 3BR family home", range: { low: 28, mid: 36, high: 48 } },
  premiumVilla: { label: "Premium villa lifestyle", range: { low: 45, mid: 60, high: 85 } },
} as const;

const learningOptions = {
  noneYet: { label: "No school costs yet", perChild: { low: 0, mid: 0, high: 0 } },
  campOrWeekly: { label: "Camp / weekly program", perChild: { low: 2, mid: 4, high: 7 } },
  empathyPartTime: { label: "Empathy School lighter / partial commitment", perChild: { low: 3, mid: 6, high: 9 } },
  empathyFullTime: { label: "Empathy School as the main learning anchor", perChild: { low: 6, mid: 10, high: 16 } },
} as const;

const transportOptions = {
  scooterMix: { label: "Scooters + occasional driver", range: { low: 2, mid: 4, high: 6 } },
  driverMostDays: { label: "Driver most days", range: { low: 4, mid: 7, high: 11 } },
  carAndDriver: { label: "Car + driver heavier setup", range: { low: 8, mid: 12, high: 18 } },
} as const;

const lifestyleOptions = {
  homeBased: { label: "Mostly home meals / lower convenience spend", range: { low: 5, mid: 8, high: 12 } },
  balanced: { label: "Balanced family routine", range: { low: 8, mid: 12, high: 18 } },
  convenienceHeavy: { label: "Higher convenience / eating out / extra outings", range: { low: 14, mid: 22, high: 32 } },
} as const;

const bufferOptions = {
  lean: { label: "Lean buffer", range: { low: 2, mid: 3, high: 5 } },
  steady: { label: "Steady buffer", range: { low: 4, mid: 6, high: 9 } },
  extra: { label: "Extra breathing room", range: { low: 7, mid: 10, high: 15 } },
} as const;

const stayOptions = {
  testStay: { label: "Test stay / short arrival phase", housingMultiplier: 1.35, setup: { low: 8, mid: 15, high: 25 } },
  trialTerm: { label: "Trial term / 3–6 months", housingMultiplier: 1.15, setup: { low: 12, mid: 20, high: 35 } },
  longerMove: { label: "Longer move / settling in", housingMultiplier: 1.0, setup: { low: 20, mid: 35, high: 60 } },
} as const;

function add(a: Range, b: Range): Range {
  return { low: a.low + b.low, mid: a.mid + b.mid, high: a.high + b.high };
}

function scale(a: Range, factor: number): Range {
  return { low: a.low * factor, mid: a.mid * factor, high: a.high * factor };
}

function formatMillions(n: number): string {
  return `Rp ${n.toFixed(1)}m`;
}

export default function BudgetCalculator() {
  const [area, setArea] = useState<keyof typeof areaOptions>("ubudSide");
  const [housing, setHousing] = useState<keyof typeof housingOptions>("comfortable3br");
  const [learning, setLearning] = useState<keyof typeof learningOptions>("empathyFullTime");
  const [transport, setTransport] = useState<keyof typeof transportOptions>("driverMostDays");
  const [lifestyle, setLifestyle] = useState<keyof typeof lifestyleOptions>("balanced");
  const [buffer, setBuffer] = useState<keyof typeof bufferOptions>("steady");
  const [stayType, setStayType] = useState<keyof typeof stayOptions>("trialTerm");
  const [kids, setKids] = useState(2);

  const result = useMemo(() => {
    const housingBase = housingOptions[housing].range;
    const housingRange = add(scale(housingBase, stayOptions[stayType].housingMultiplier), areaOptions[area].housingAdjust);

    const learningRange = scale(learningOptions[learning].perChild, kids);
    const transportRange = transportOptions[transport].range;
    const lifestyleRange = add(lifestyleOptions[lifestyle].range, {
      low: Math.max(kids - 1, 0) * 1,
      mid: Math.max(kids - 1, 0) * 1.5,
      high: Math.max(kids - 1, 0) * 2,
    });
    const bufferRange = add(bufferOptions[buffer].range, {
      low: Math.max(kids - 1, 0) * 0.5,
      mid: Math.max(kids - 1, 0) * 0.75,
      high: Math.max(kids - 1, 0) * 1,
    });

    const monthly = [housingRange, learningRange, transportRange, lifestyleRange, bufferRange].reduce(add, {
      low: 0,
      mid: 0,
      high: 0,
    });

    const setup = stayOptions[stayType].setup;

    return {
      categories: {
        Housing: housingRange,
        Learning: learningRange,
        Transport: transportRange,
        "Food + daily life": lifestyleRange,
        "Health + buffer": bufferRange,
      },
      monthly,
      setup,
      runwayThreeMonths: add(scale(monthly, 3), setup),
      runwayTwelveMonths: scale(monthly, 12),
    };
  }, [area, housing, learning, transport, lifestyle, buffer, stayType, kids]);

  const note =
    stayType === "testStay"
      ? "Short stays usually cost more per month because temporary housing is less efficient."
      : stayType === "trialTerm"
        ? "This is often the most honest range for families who want to try Bali before signing a long lease."
        : "Longer stays usually reduce housing pressure, but they increase the importance of getting areas and routines right.";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className={cardCls}>
        <div className={badge}>Range builder</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Shape a working monthly range</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          These are planning ranges, not quotes. The point is to get to a usable first-pass budget faster, then adjust
          once your areas, housing style, and learning plan become more real.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Stay type</span>
            <select className={inputBase} value={stayType} onChange={(e) => setStayType(e.target.value as keyof typeof stayOptions)}>
              {Object.entries(stayOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Area direction</span>
            <select className={inputBase} value={area} onChange={(e) => setArea(e.target.value as keyof typeof areaOptions)}>
              {Object.entries(areaOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Housing style</span>
            <select className={inputBase} value={housing} onChange={(e) => setHousing(e.target.value as keyof typeof housingOptions)}>
              {Object.entries(housingOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Learning plan</span>
            <select className={inputBase} value={learning} onChange={(e) => setLearning(e.target.value as keyof typeof learningOptions)}>
              {Object.entries(learningOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Transport</span>
            <select className={inputBase} value={transport} onChange={(e) => setTransport(e.target.value as keyof typeof transportOptions)}>
              {Object.entries(transportOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Lifestyle</span>
            <select className={inputBase} value={lifestyle} onChange={(e) => setLifestyle(e.target.value as keyof typeof lifestyleOptions)}>
              {Object.entries(lifestyleOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Buffer</span>
            <select className={inputBase} value={buffer} onChange={(e) => setBuffer(e.target.value as keyof typeof bufferOptions)}>
              {Object.entries(bufferOptions).map(([value, opt]) => (
                <option key={value} value={value}>{opt.label}</option>
              ))}
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
          {note}
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Low</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{formatMillions(result.monthly.low)}</div>
              <div className="mt-1 text-xs text-gray-500">per month</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mid</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{formatMillions(result.monthly.mid)}</div>
              <div className="mt-1 text-xs text-gray-500">per month</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">High</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">{formatMillions(result.monthly.high)}</div>
              <div className="mt-1 text-xs text-gray-500">per month</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="text-sm font-semibold text-gray-900">First month / setup cushion</div>
            <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
              <div>{formatMillions(result.setup.low)}</div>
              <div>{formatMillions(result.setup.mid)}</div>
              <div>{formatMillions(result.setup.high)}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-gray-900">Three-month runway</div>
              <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
                <div>{formatMillions(result.runwayThreeMonths.low)}</div>
                <div>{formatMillions(result.runwayThreeMonths.mid)}</div>
                <div>{formatMillions(result.runwayThreeMonths.high)}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-gray-900">Twelve-month view</div>
              <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
                <div>{formatMillions(result.runwayTwelveMonths.low)}</div>
                <div>{formatMillions(result.runwayTwelveMonths.mid)}</div>
                <div>{formatMillions(result.runwayTwelveMonths.high)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">Category breakdown</h3>
          <div className="mt-4 space-y-4">
            {Object.entries(result.categories).map(([label, range]) => (
              <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-sm font-semibold text-gray-900">{label}</div>
                <div className="mt-2 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                  <div>{formatMillions(range.low)}</div>
                  <div>{formatMillions(range.mid)}</div>
                  <div>{formatMillions(range.high)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cardCls}>
          <h3 className="text-lg font-semibold tracking-tight text-gray-900">How to use this well</h3>
          <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
            <li>Use this to decide whether the move feels plausible, not to “win” at precision.</li>
            <li>Once your area shortlist is real, revisit housing and transport first.</li>
            <li>If Empathy School is central to the move, test the school commute before trusting any budget too much.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
