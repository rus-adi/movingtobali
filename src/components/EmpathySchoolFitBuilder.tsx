"use client";

import { useMemo, useState } from "react";
import { buildContactHref } from "@/lib/contact";
import {
  badge,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  inputBase,
} from "@/components/ui/styles";

type StageKey = "earlyYears" | "primary" | "middle" | "mixed" | "older";
type PriorityKey =
  | "calm"
  | "community"
  | "gentle-structure"
  | "academic-weight"
  | "unsure";
type MoveKey = "test-stay" | "school-first" | "direct-move" | "still-exploring";
type CommuteKey = "want-short" | "can-handle-some" | "far-is-fine" | "unknown";
type SolveKey =
  | "rhythm"
  | "belonging"
  | "learning-fit"
  | "everything"
  | "not-sure";

type LinkItem = { title: string; href: string };
type Result = {
  band: string;
  headline: string;
  summary: string;
  scoreLabel: string;
  signals: string[];
  watchouts: string[];
  nextLinks: LinkItem[];
};

const stageLabels: Record<StageKey, string> = {
  earlyYears: "Early Years / younger child",
  primary: "Primary-age child",
  middle: "Middle School age",
  mixed: "Mixed younger ages",
  older: "Older child / teen beyond current public materials",
};

const priorityLabels: Record<PriorityKey, string> = {
  calm: "Calm daily rhythm matters most",
  community: "Community and belonging matter most",
  "gentle-structure": "We want warmth with enough structure",
  "academic-weight": "We are looking for a more conventional academic push",
  unsure: "We are still figuring out what kind of school rhythm fits",
};

const moveLabels: Record<MoveKey, string> = {
  "test-stay": "We want to test first",
  "school-first": "School may anchor the move",
  "direct-move": "We may move directly",
  "still-exploring": "We are still exploring Bali",
};

const commuteLabels: Record<CommuteKey, string> = {
  "want-short": "We want the school run to stay short",
  "can-handle-some": "We can handle some drive if the fit is strong",
  "far-is-fine": "We think a longer drive may be okay",
  unknown: "We do not know yet",
};

const solveLabels: Record<SolveKey, string> = {
  rhythm: "A calmer weekly rhythm",
  belonging: "Belonging and community",
  "learning-fit": "A learning environment that feels right",
  everything: "Almost everything about the move",
  "not-sure": "We are not sure yet",
};

function dedupeLinks(items: LinkItem[]): LinkItem[] {
  return Array.from(new Map(items.map((item) => [item.href, item])).values());
}

function buildResult(
  stage: StageKey,
  priority: PriorityKey,
  move: MoveKey,
  commute: CommuteKey,
  solve: SolveKey,
): Result {
  let score = 0;
  const signals: string[] = [];
  const watchouts: string[] = [];
  const nextLinks: LinkItem[] = [
    { title: "School planning guide", href: "/schools" },
    { title: "Empathy School tour prep", href: "/empathy-school-tour-prep" },
    {
      title: "Fit notes sheet",
      href: "/resources/empathy-school-fit-notes-sheet",
    },
  ];

  const add = (value: number, ...items: string[]) => {
    score += value;
    signals.push(...items);
  };

  if (stage === "earlyYears") {
    add(
      10,
      "You are judging the whole week, not only the classroom. Early-years families usually feel the school-run and regulation rhythm immediately.",
      "A warm, grounded environment can change the housing and area conversation faster than people expect.",
    );
  }

  if (stage === "primary") {
    add(
      11,
      "Primary-age children often give the clearest signal once the campus, adults, and daily rhythm start to feel real.",
      "This is a strong stage for using a tour and a test stay together.",
    );
  }

  if (stage === "middle") {
    add(
      8,
      "Middle School age can still be a strong fit question, but buy-in and daily energy matter more than polished impressions.",
      "Use the visit to watch whether the rhythm still feels good after pickup.",
    );
  }

  if (stage === "mixed") {
    add(
      9,
      "Mixed younger ages make commute, pacing, and sibling energy more important than parents first assume.",
      "Let the most sensitive transition shape the decision, not the most confident family member.",
    );
  }

  if (stage === "older") {
    add(
      2,
      "Start with a direct conversation before treating school as solved. The public materials in this hub currently focus on Early Years through Middle School.",
    );
    watchouts.push(
      "Do not let this site over-answer the question for an older child if your family needs clarity beyond the current public age-range materials.",
    );
    nextLinks.push({
      title: "Ask about school fit",
      href: buildContactHref("Empathy School fit", {
        from: "/empathy-school-fit",
      }),
    });
  }

  if (priority === "calm") {
    add(
      10,
      "Wanting a calmer rhythm is a strong reason to let Empathy School enter the move earlier.",
    );
  }

  if (priority === "community") {
    add(
      10,
      "If community matters, use the visit to notice adult presence, how people move through the day, and whether you can picture belonging rather than just attendance.",
    );
  }

  if (priority === "gentle-structure") {
    add(
      8,
      "This is a good reason to test the fit in person rather than trying to over-interpret websites.",
    );
  }

  if (priority === "academic-weight") {
    add(
      3,
      "You may still want to explore Empathy School, but do it through concrete questions rather than assumptions.",
    );
    watchouts.push(
      "If you are looking for a more conventionally high-pressure academic environment, do not force a story that the school is supposed to solve everything.",
    );
  }

  if (priority === "unsure") {
    add(
      5,
      "Being unsure is normal. It usually means a tour and a few sharper questions will help more than more generic research.",
    );
  }

  if (move === "school-first") {
    add(
      10,
      "If school may anchor the move, bring Empathy School into the area and housing logic early enough to matter.",
    );
    nextLinks.unshift({
      title: "Should Empathy School anchor the move?",
      href: "/guides/how-to-know-if-empathy-school-should-anchor-your-move",
    });
  }

  if (move === "test-stay") {
    add(
      8,
      "A test stay is often the cleanest way to judge school fit honestly, because the campus becomes part of a real week instead of a stand-alone appointment.",
    );
    nextLinks.push({
      title: "Plan a tour during a test stay",
      href: "/guides/how-to-plan-an-empathy-school-tour-during-a-test-stay",
    });
  }

  if (move === "direct-move") {
    add(
      6,
      "If you may move directly, let school fit tighten the shortlist before housing gets too far ahead.",
    );
    watchouts.push(
      "A direct move gets noisier when housing hardens before school and commute reality are grounded.",
    );
  }

  if (move === "still-exploring") {
    add(
      5,
      "You may not need a hard school answer yet, but one real visit can still tell you whether this question deserves to move forward.",
    );
  }

  if (commute === "want-short") {
    add(
      10,
      "A shorter school run usually means area choice should tighten earlier, not later.",
    );
    nextLinks.push({
      title: "How to use Empathy School to test area fit",
      href: "/guides/how-to-use-empathy-school-to-test-area-fit",
    });
  }

  if (commute === "can-handle-some") {
    add(
      7,
      "You have some flexibility, but it is still worth testing the drive on a real family day.",
    );
  }

  if (commute === "far-is-fine") {
    add(
      2,
      "Even if adults think a longer drive is fine, test how pickup energy and the rest of the day feel afterwards.",
    );
    watchouts.push(
      "Parents often tolerate the drive more easily than the child, especially by week two.",
    );
  }

  if (commute === "unknown") {
    add(5, "Treat the commute as part of the decision, not a side note.");
  }

  if (solve === "rhythm") {
    add(
      9,
      "Using school to test the weekly rhythm is one of the most practical reasons to bring Empathy School into the move early.",
    );
  }

  if (solve === "belonging") {
    add(
      9,
      "School can be a real belonging anchor, but only if the family day around it still feels sustainable.",
    );
  }

  if (solve === "learning-fit") {
    add(
      8,
      "A tour is useful when you are listening for learning fit, adult presence, and how your child might respond in the actual environment.",
    );
  }

  if (solve === "everything") {
    add(
      1,
      "It is understandable to hope school will fix the move, but that is usually too much weight for one decision to carry.",
    );
    watchouts.push(
      "Do not ask school to solve housing, friendships, adult work stress, area mismatch, and the whole emotional load of the move at once.",
    );
  }

  if (solve === "not-sure") {
    add(
      5,
      "That is a good reason to leave the visit with one honest sentence instead of a vague good feeling.",
    );
  }

  let band = "Test it during a real stay";
  let headline = "Empathy School looks worth bringing into the plan now.";
  let summary =
    "You have enough signal to use the school as a real decision anchor — especially for area, commute, and weekly rhythm — without pretending the answer is already final.";

  if (score >= 42) {
    band = "Strong anchor";
    headline = "Let Empathy School influence the move early enough to matter.";
    summary =
      "Your answers suggest school fit is not a side note. Use it to pressure-test area, commute, and whether the week still feels calm once normal life begins.";
  } else if (score >= 32) {
    band = "Test during a stay";
    headline =
      "Bring the school question forward, but keep it tied to real family days.";
    summary =
      "The fit question looks meaningful, but it will become much clearer inside a test stay, a tour, and a realistic view of the commute.";
  } else {
    band = "Conversation before commitment";
    headline =
      "Keep Empathy School in the picture, but do not make it carry the whole move yet.";
    summary =
      "Your answers suggest you need a calmer first step: a direct conversation, a sharper shortlist, or a more honest view of the week before school becomes the main anchor.";
  }

  if (stage === "older") {
    band = "Conversation first";
    headline =
      "Start with a direct fit conversation before you let school anchor the move.";
    summary =
      "Because the public materials on this site currently focus on Early Years through Middle School, the cleanest next step is a direct conversation about whether Empathy School is even the right active question for your family.";
  }

  if (watchouts.length === 0) {
    watchouts.push(
      "A school can be a beautiful fit and still ask for changes in area, timing, or how the family imagines the week.",
    );
  }

  nextLinks.push({
    title: "Ask about Empathy School fit",
    href: buildContactHref("Empathy School fit", {
      from: "/empathy-school-fit",
    }),
  });

  return {
    band,
    headline,
    summary,
    scoreLabel: `${score} / 50 fit signal`,
    signals: Array.from(new Set(signals)).slice(0, 5),
    watchouts: Array.from(new Set(watchouts)).slice(0, 5),
    nextLinks: dedupeLinks(nextLinks).slice(0, 5),
  };
}

export default function EmpathySchoolFitBuilder() {
  const [stage, setStage] = useState<StageKey>("primary");
  const [priority, setPriority] = useState<PriorityKey>("calm");
  const [move, setMove] = useState<MoveKey>("test-stay");
  const [commute, setCommute] = useState<CommuteKey>("want-short");
  const [solve, setSolve] = useState<SolveKey>("rhythm");

  const result = useMemo(
    () => buildResult(stage, priority, move, commute, solve),
    [stage, priority, move, commute, solve],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className={cardCls}>
        <div className={badge}>Fit builder</div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
          Use school fit as a real move decision
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-700">
          This tool does not tell you whether Empathy School is "the answer." It
          helps you judge whether the school question deserves to move forward
          now — and whether it should shape area, commute, and the weekly rhythm
          early enough to matter.
        </p>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">
              Child stage
            </span>
            <select
              className={inputBase}
              value={stage}
              onChange={(e) => setStage(e.target.value as StageKey)}
            >
              {Object.entries(stageLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">
              What matters most
            </span>
            <select
              className={inputBase}
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityKey)}
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">
              Move shape
            </span>
            <select
              className={inputBase}
              value={move}
              onChange={(e) => setMove(e.target.value as MoveKey)}
            >
              {Object.entries(moveLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">
              School-run tolerance
            </span>
            <select
              className={inputBase}
              value={commute}
              onChange={(e) => setCommute(e.target.value as CommuteKey)}
            >
              {Object.entries(commuteLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-gray-900">
              What you hope school will help with
            </span>
            <select
              className={inputBase}
              value={solve}
              onChange={(e) => setSolve(e.target.value as SolveKey)}
            >
              {Object.entries(solveLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm font-semibold text-gray-900">
            What this is trying to prevent
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            The common mistake is judging school as an isolated product.
            Families usually make better decisions when they judge campus feel,
            commute, area logic, and child energy as one combined reality.
          </p>
        </div>

        <div className={btnRow}>
          <a
            className={buttonPrimary}
            href="/schools"
            data-track="fit_builder_open_school"
          >
            Open school planning guide
          </a>
          <a
            className={buttonSecondary}
            href="/empathy-school-tour-prep"
            data-track="fit_builder_tour_prep"
          >
            Plan the tour day
          </a>
        </div>
      </div>

      <div className="grid gap-6">
        <div className={cardCls}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={badge}>{result.band}</span>
            <span className={badge}>{result.scoreLabel}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">
            {result.headline}
          </h3>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {result.summary}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className={cardCls}>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">
              Signals pointing toward a real fit test
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-700">
              {result.signals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={cardCls}>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">
              Watch carefully
            </h3>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-gray-700">
              {result.watchouts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {result.nextLinks.map((item) => (
            <a key={item.href} href={item.href} className={cardCls}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                Next step
              </div>
              <div className="mt-3 text-xl font-semibold tracking-tight text-gray-900">
                {item.title}
              </div>
              <div className="mt-4 text-sm font-semibold text-gray-900">
                Open →
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
