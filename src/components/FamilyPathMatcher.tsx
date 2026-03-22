"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, inputBase } from "@/components/ui/styles";

type StageKey = "toddlers" | "primary" | "preteens-teens" | "mixed-younger" | "mixed-wide";
type PatternKey = "general" | "remote-work" | "single-parent" | "slower-warmup" | "outdoor-energy" | "structure-first";
type MoveKey = "test-stay" | "one-to-three-months" | "longer-move" | "slower-relocation";
type NeedKey = "routine" | "belonging" | "simplicity" | "flexibility" | "school-anchor";
type BandwidthKey = "low" | "medium" | "high";

type PathKey =
  | "toddlers"
  | "primary"
  | "preteens-teens"
  | "short-stay"
  | "remote-work"
  | "single-parent"
  | "slower-warmup"
  | "outdoor-energy"
  | "structure-first"
  | "slower-relocation";

type LinkItem = { title: string; href: string };
type PathDef = {
  key: PathKey;
  title: string;
  href: string;
  summary: string;
  resourceHref?: string;
};

type MatchResult = {
  primary: PathDef;
  secondary: PathDef | null;
  signals: string[];
  watchouts: string[];
  nextLinks: LinkItem[];
};

const stageLabels: Record<StageKey, string> = {
  toddlers: "We’re moving with toddlers",
  primary: "We’re moving with primary-age kids",
  "preteens-teens": "We’re moving with pre-teens or teens",
  "mixed-younger": "We have mixed younger ages",
  "mixed-wide": "We have a wide age spread",
};

const patternLabels: Record<PatternKey, string> = {
  general: "No single special pattern — we just want the cleanest path",
  "remote-work": "At least one adult needs the week to support real remote work",
  "single-parent": "One parent is carrying most of the logistics",
  "slower-warmup": "One child takes time to warm up to new places and people",
  "outdoor-energy": "One child has a lot of physical energy and does best outdoors",
  "structure-first": "Our family does better with predictability and stronger structure",
};

const moveLabels: Record<MoveKey, string> = {
  "test-stay": "We want a test stay first",
  "one-to-three-months": "We’re considering a 1–3 month stay",
  "longer-move": "We may make a longer move if it feels right",
  "slower-relocation": "We want the slowest, lowest-pressure relocation path",
};

const needLabels: Record<NeedKey, string> = {
  routine: "A calmer routine is the main goal",
  belonging: "Belonging and child confidence matter most",
  simplicity: "We mostly need the move to feel simpler and lighter",
  flexibility: "We want freedom and enough flexibility to test things",
  "school-anchor": "Empathy School may need to anchor the move",
};

const bandwidthLabels: Record<BandwidthKey, string> = {
  low: "Adult bandwidth is low right now",
  medium: "We have some bandwidth, but not endless margin",
  high: "We can absorb some experimentation and complexity",
};

const PATHS: Record<PathKey, PathDef> = {
  toddlers: {
    key: "toddlers",
    title: "Moving to Bali with toddlers",
    href: "/guides/moving-to-bali-with-toddlers",
    summary: "Best when naps, short loops, calmer housing, and repeatable days matter more than trying to do everything.",
    resourceHref: "/resources/family-path-decision-sheet",
  },
  primary: {
    key: "primary",
    title: "Moving to Bali with primary-age kids",
    href: "/guides/moving-to-bali-with-primary-age-kids",
    summary: "Best when the week needs anchors, community, and enough rhythm that children know what the day is for.",
    resourceHref: "/resources/family-path-decision-sheet",
  },
  "preteens-teens": {
    key: "preteens-teens",
    title: "Moving to Bali with pre-teens and teens",
    href: "/guides/moving-to-bali-with-pre-teens-and-teens",
    summary: "Best when buy-in, independence, social fit, and whether the teenager can picture real life here are central.",
    resourceHref: "/resources/family-path-decision-sheet",
  },
  "short-stay": {
    key: "short-stay",
    title: "A 1–3 month family stay in Bali",
    href: "/guides/one-to-three-month-family-stay-in-bali",
    summary: "Best when you want Bali to behave like a real trial without forcing a full relocation too early.",
    resourceHref: "/resources/family-path-decision-sheet",
  },
  "remote-work": {
    key: "remote-work",
    title: "Moving to Bali as a remote-working family",
    href: "/guides/moving-to-bali-as-a-remote-working-family",
    summary: "Best when adult work bandwidth, meeting windows, and child rhythm all need to hold at the same time.",
    resourceHref: "/resources/remote-work-family-week-grid",
  },
  "single-parent": {
    key: "single-parent",
    title: "Moving to Bali as a single parent",
    href: "/guides/moving-to-bali-as-a-single-parent",
    summary: "Best when the move has to get lighter, more local, and easier to carry without hidden complexity.",
    resourceHref: "/resources/single-parent-stability-checklist",
  },
  "slower-warmup": {
    key: "slower-warmup",
    title: "Moving to Bali with a slower-to-warm-up child",
    href: "/guides/moving-to-bali-with-a-slower-to-warm-up-child",
    summary: "Best when trust, repetition, predictability, and the pace of introduction matter more than novelty.",
    resourceHref: "/resources/family-path-decision-sheet",
  },
  "outdoor-energy": {
    key: "outdoor-energy",
    title: "Moving to Bali with a highly active outdoor child",
    href: "/guides/moving-to-bali-with-a-highly-active-outdoor-child",
    summary: "Best when the child needs movement, nature, and enough physical outlet that the rest of the family week improves too.",
    resourceHref: "/resources/family-path-decision-sheet",
  },
  "structure-first": {
    key: "structure-first",
    title: "A structure-first family move to Bali",
    href: "/guides/structure-first-family-move-to-bali",
    summary: "Best when the family does better with stronger rhythms, earlier anchors, and fewer ambiguous days.",
    resourceHref: "/resources/family-path-decision-sheet",
  },
  "slower-relocation": {
    key: "slower-relocation",
    title: "The slower relocation path to Bali",
    href: "/guides/the-slower-relocation-path-to-bali",
    summary: "Best when the move needs more checkpoints, more review moments, and fewer hard-to-undo commitments.",
    resourceHref: "/resources/slower-relocation-checkpoint-list",
  },
};

function dedupeLinks(items: LinkItem[]): LinkItem[] {
  return Array.from(new Map(items.map((item) => [item.href, item])).values());
}

function topPaths(scores: Record<PathKey, number>): PathDef[] {
  return Object.entries(scores)
    .map(([key, score]) => ({ key: key as PathKey, score, def: PATHS[key as PathKey] }))
    .sort((a, b) => b.score - a.score || a.def.title.localeCompare(b.def.title))
    .map((item) => item.def);
}

function buildMatch(
  stage: StageKey,
  pattern: PatternKey,
  move: MoveKey,
  need: NeedKey,
  bandwidth: BandwidthKey
): MatchResult {
  const scores: Record<PathKey, number> = {
    toddlers: 0,
    primary: 0,
    "preteens-teens": 0,
    "short-stay": 0,
    "remote-work": 0,
    "single-parent": 0,
    "slower-warmup": 0,
    "outdoor-energy": 0,
    "structure-first": 0,
    "slower-relocation": 0,
  };

  const signals: string[] = [];
  const watchouts: string[] = [];
  const nextLinks: LinkItem[] = [
    { title: "Family paths hub", href: "/family-paths" },
    { title: "Plan your move", href: "/plan-your-move" },
    { title: "Family path decision sheet", href: "/resources/family-path-decision-sheet" },
  ];

  const add = (key: PathKey, value: number) => {
    scores[key] += value;
  };

  if (stage === "toddlers") {
    add("toddlers", 15);
    add("structure-first", 5);
    signals.push(
      "With toddlers, the strongest version of Bali is usually the one with the shortest daily loop, the easiest house, and the fewest moving parts.",
      "When the youngest child still needs naps and regulation, adults often need the move to get smaller before it gets exciting."
    );
  }

  if (stage === "primary") {
    add("primary", 15);
    add("structure-first", 7);
    signals.push(
      "Primary-age children usually do best when the week has one or two dependable anchors instead of open-ended novelty."
    );
  }

  if (stage === "preteens-teens") {
    add("preteens-teens", 16);
    signals.push(
      "With older kids, buy-in and whether they can picture a real social life here become part of the move, not side issues."
    );
  }

  if (stage === "mixed-younger") {
    add("toddlers", 7);
    add("primary", 7);
    add("structure-first", 8);
    signals.push(
      "Mixed younger ages usually reward the family that builds a strong middle-of-the-road rhythm rather than optimizing for only one child."
    );
  }

  if (stage === "mixed-wide") {
    add("slower-relocation", 10);
    add("structure-first", 8);
    add("preteens-teens", 5);
    signals.push(
      "A wider age spread often makes the move easier when you leave room for different children to adapt at different speeds."
    );
  }

  if (pattern === "remote-work") {
    add("remote-work", 18);
    add("structure-first", 8);
    signals.push(
      "Because adult work still has to function, housing, internet reliability, meeting windows, and child anchors need to be solved together rather than one by one."
    );
    nextLinks.push({ title: "Remote-work family week grid", href: "/resources/remote-work-family-week-grid" });
  }

  if (pattern === "single-parent") {
    add("single-parent", 20);
    add("slower-relocation", 8);
    add("structure-first", 6);
    signals.push(
      "When one adult is carrying most of the logistics, the move usually works better when every daily step is lighter than it looks on Instagram."
    );
    watchouts.push(
      "Do not design a Bali life that depends on constant flexibility from one already-full adult.",
      "If a route, house, or activity setup feels tiring on paper, it often feels heavier in week two."
    );
    nextLinks.push({ title: "Single-parent stability checklist", href: "/resources/single-parent-stability-checklist" });
  }

  if (pattern === "slower-warmup") {
    add("slower-warmup", 18);
    add("slower-relocation", 7);
    add("structure-first", 5);
    signals.push(
      "A child who warms up slowly usually gives a cleaner signal when Bali is introduced through repetition and predictability instead of pressure to love it quickly."
    );
  }

  if (pattern === "outdoor-energy") {
    add("outdoor-energy", 18);
    add("primary", 4);
    signals.push(
      "When a child needs movement, the question is not only where you live. It is whether the everyday environment gives enough safe outlet that the whole week gets easier."
    );
  }

  if (pattern === "structure-first") {
    add("structure-first", 18);
    add("primary", 4);
    add("slower-relocation", 4);
    signals.push(
      "Some families enjoy Bali more once they stop trying to keep things open-ended and start building a stronger weekly scaffold."
    );
  }

  if (pattern === "general") {
    add("short-stay", 6);
    signals.push(
      "Because there is no single special pattern dominating the move, it may help to start with the path that reduces uncertainty fastest rather than the one that sounds most exciting."
    );
  }

  if (move === "test-stay") {
    add("short-stay", 14);
    add("slower-relocation", 6);
    signals.push(
      "A test stay usually becomes more useful when it is treated as a family systems check, not just a taste of Bali."
    );
    nextLinks.push({ title: "Test stay", href: "/test-stay" });
  }

  if (move === "one-to-three-months") {
    add("short-stay", 18);
    add("remote-work", 5);
    signals.push(
      "A 1–3 month stay is often the cleanest way to test the week without locking the family into the wrong long-term version of Bali."
    );
  }

  if (move === "longer-move") {
    add("structure-first", 5);
    add("slower-relocation", 5);
    signals.push(
      "Longer moves still get easier when the first version is simple enough to revise instead of pretending the family already knows the perfect setup."
    );
  }

  if (move === "slower-relocation") {
    add("slower-relocation", 20);
    add("short-stay", 8);
    signals.push(
      "Wanting a slower path is not hesitation. It is often a sign that your family will make better decisions with checkpoints and fewer irreversible steps."
    );
    nextLinks.push({ title: "Slower relocation checkpoint list", href: "/resources/slower-relocation-checkpoint-list" });
  }

  if (need === "routine") {
    add("structure-first", 10);
    add("primary", 4);
    add("toddlers", 3);
    signals.push(
      "If a calmer routine is the main goal, your best path is usually the one that reduces decision fatigue earliest."
    );
  }

  if (need === "belonging") {
    add("slower-warmup", 8);
    add("primary", 5);
    add("preteens-teens", 5);
    signals.push(
      "Belonging tends to come faster when the family is not reintroducing itself to a new setup every few days."
    );
  }

  if (need === "simplicity") {
    add("single-parent", 7);
    add("slower-relocation", 7);
    add("toddlers", 4);
    signals.push(
      "Needing simplicity is a strong sign that the first version of Bali should be easier to carry, not more ambitious."
    );
  }

  if (need === "flexibility") {
    add("short-stay", 8);
    add("remote-work", 3);
    add("outdoor-energy", 3);
    signals.push(
      "Flexibility works best when it is still sitting on top of a few repeatable defaults."
    );
  }

  if (need === "school-anchor") {
    add("structure-first", 8);
    add("primary", 5);
    add("remote-work", 4);
    signals.push(
      "If Empathy School may anchor the move, your path should leave enough structure for school rhythm and commute reality to change the plan early."
    );
    nextLinks.push({ title: "Empathy School fit", href: "/empathy-school-fit" });
  }

  if (bandwidth === "low") {
    add("slower-relocation", 12);
    add("single-parent", 6);
    add("structure-first", 6);
    watchouts.push(
      "Low adult bandwidth usually means the wrong Bali setup feels expensive in energy before it feels expensive in money.",
      "This is a strong reason to favor checklists, shorter loops, and fewer parallel decisions."
    );
  }

  if (bandwidth === "medium") {
    add("structure-first", 5);
    add("short-stay", 4);
  }

  if (bandwidth === "high") {
    add("outdoor-energy", 4);
    add("remote-work", 3);
    add("short-stay", 3);
    signals.push(
      "Because you have a little more margin, you can test slightly more of Bali — but only if the basics still stay readable."
    );
  }

  watchouts.push(
    "Do not treat every family path as content you must read. The goal is to choose one primary lens and one secondary lens.",
    "If two paths both feel true, that usually means one describes the child and the other describes the adults. Use both."
  );

  const ranked = topPaths(scores);
  const primary = ranked[0];
  const secondary = ranked.find((item) => item.key !== primary.key) || null;

  if (primary.resourceHref) nextLinks.unshift({ title: `${primary.title} resource`, href: primary.resourceHref });
  if (secondary?.resourceHref) nextLinks.push({ title: `${secondary.title} resource`, href: secondary.resourceHref });
  nextLinks.push({ title: primary.title, href: primary.href });
  if (secondary) nextLinks.push({ title: secondary.title, href: secondary.href });
  nextLinks.push({ title: "Ask a planning question", href: buildContactHref("General move planning", { from: "/family-path-match" }) });

  return {
    primary,
    secondary,
    signals: Array.from(new Set(signals)).slice(0, 6),
    watchouts: Array.from(new Set(watchouts)).slice(0, 6),
    nextLinks: dedupeLinks(nextLinks).slice(0, 7),
  };
}

export default function FamilyPathMatcher() {
  const [stage, setStage] = useState<StageKey>("primary");
  const [pattern, setPattern] = useState<PatternKey>("general");
  const [move, setMove] = useState<MoveKey>("test-stay");
  const [need, setNeed] = useState<NeedKey>("routine");
  const [bandwidth, setBandwidth] = useState<BandwidthKey>("medium");

  const result = useMemo(() => buildMatch(stage, pattern, move, need, bandwidth), [stage, pattern, move, need, bandwidth]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className={cardCls}>
        <div className={badge}>Path matcher</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Find the family lens that should guide the move first</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Families do better when they stop reading every Bali page equally. Pick the pattern that sounds most like your real family, then use the recommended path as your main lens for the next set of decisions.
        </p>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Which child stage is most shaping the move?</span>
            <select className={inputBase} value={stage} onChange={(e) => setStage(e.target.value as StageKey)}>
              {Object.entries(stageLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">Which family pattern feels most true right now?</span>
            <select className={inputBase} value={pattern} onChange={(e) => setPattern(e.target.value as PatternKey)}>
              {Object.entries(patternLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">What shape is the move taking?</span>
            <select className={inputBase} value={move} onChange={(e) => setMove(e.target.value as MoveKey)}>
              {Object.entries(moveLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">What do you most need Bali to improve?</span>
            <select className={inputBase} value={need} onChange={(e) => setNeed(e.target.value as NeedKey)}>
              {Object.entries(needLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">How much adult bandwidth do you realistically have?</span>
            <select className={inputBase} value={bandwidth} onChange={(e) => setBandwidth(e.target.value as BandwidthKey)}>
              {Object.entries(bandwidthLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={badgeAccent}>Primary path</span>
            <span className={badge}>{result.primary.title}</span>
            {result.secondary ? <span className={badge}>Secondary lens: {result.secondary.title}</span> : null}
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">Start with {result.primary.title.toLowerCase()}.</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">{result.primary.summary}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a href={result.primary.href} className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-gray-900 transition hover:border-blue-300 hover:bg-white">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Primary guide</div>
              <div className="mt-3 text-lg font-semibold tracking-tight">{result.primary.title}</div>
              <p className="mt-2 leading-6 text-gray-700">Open the page that best matches your family’s current shape.</p>
            </a>
            {result.secondary ? (
              <a href={result.secondary.href} className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-900 transition hover:border-gray-300 hover:bg-white">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Secondary lens</div>
                <div className="mt-3 text-lg font-semibold tracking-tight">{result.secondary.title}</div>
                <p className="mt-2 leading-6 text-gray-700">Use this page next if the child pattern and the adult pattern are both shaping the move.</p>
              </a>
            ) : null}
          </div>

          <div className={btnRow}>
            <a className={buttonPrimary} href={result.primary.href}>Open primary path</a>
            {result.secondary ? <a className={buttonSecondary} href={result.secondary.href}>Open secondary path</a> : null}
            <a className={buttonSecondary} href="/family-paths">Browse all family paths</a>
          </div>
        </div>

        <div className={cardCls}>
          <strong className="text-sm font-semibold text-gray-900">Why this path matches</strong>
          <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
            {result.signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>

        <div className={cardCls}>
          <strong className="text-sm font-semibold text-gray-900">Watchouts</strong>
          <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
            {result.watchouts.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={cardCls}>
          <strong className="text-sm font-semibold text-gray-900">Next pages to open</strong>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {result.nextLinks.map((item) => (
              <a key={item.href} href={item.href} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white">
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
