import { buildContactHref, getContactPresetById, type ContactTopicPresetId } from "@/lib/contact";
import { schoolPlanningGuideHref, schoolPlanningGuideLabel } from "@/lib/schoolLinks";

export type ConversationRouteId = ContactTopicPresetId;

export type ConversionLink = {
  href: string;
  label: string;
};

export type ConversationRouteDetail = {
  id: ConversationRouteId;
  label: string;
  topic: string;
  summary: string;
  bestWhen: string;
  notYet: string;
  prepLinks: ConversionLink[];
  ctaLabel: string;
  analyticsKey: string;
};

export type SourceConversationContext = {
  sourcePath: string;
  sourceLabel: string;
  recommendedRouteId: ConversationRouteId;
  reason: string;
  prepLinks: ConversionLink[];
  alternativeRouteIds: ConversationRouteId[];
};

export const CONVERSATION_ROUTE_DETAILS: Record<ConversationRouteId, ConversationRouteDetail> = {
  planning: {
    id: "planning",
    label: "Plan the move",
    topic: "General move planning",
    summary: "Best when the family still needs help sequencing the move, narrowing priorities, or deciding what deserves attention now versus later.",
    bestWhen: "Use this when the move still feels broad, emotional, or hard to sequence.",
    notYet: "Do not use this as a way to skip the tools. It works best after you have at least a rough move shape or one concrete sticking point.",
    prepLinks: [
      { href: "/start-here", label: "Start here" },
      { href: "/move-timeline", label: "Move timeline" },
      { href: "/resources/family-readiness-checklist", label: "Family readiness checklist" },
      { href: "/resources/contact-prep-notes-sheet", label: "Contact prep notes sheet" },
    ],
    ctaLabel: "Ask a planning question",
    analyticsKey: "planning",
  },
  "test-stay": {
    id: "test-stay",
    label: "Plan a test stay",
    topic: "Test stay plan",
    summary: "Best when the family is serious enough to test Bali, but not ready for a heavier commitment yet.",
    bestWhen: "Use this when the move would benefit from a real-world test around area fit, school relevance, and weekday rhythm.",
    notYet: "Do not use it like a holiday planner. The best test stays are built around a real question the family wants to answer.",
    prepLinks: [
      { href: "/test-stay", label: "Test stay hub" },
      { href: "/first-month-planner", label: "First month planner" },
      { href: "/guides/trial-move-vs-full-move-in-bali", label: "Trial move vs full move" },
      { href: "/resources/test-stay-decision-scorecard", label: "Test-stay decision scorecard" },
    ],
    ctaLabel: "Ask about a test stay",
    analyticsKey: "test_stay",
  },
  "areas-budget": {
    id: "areas-budget",
    label: "Areas + budget",
    topic: "Area + budget question",
    summary: "Best when the move is narrowing into real geography and a monthly range, but the shortlist still needs help becoming practical.",
    bestWhen: "Use this when area choice, commute, and spending are starting to affect each other.",
    notYet: "Do not try to price all of Bali at once. This conversation works best after two or three realistic areas exist.",
    prepLinks: [
      { href: "/area-match", label: "Area Match" },
      { href: "/compare-areas", label: "Compare areas" },
      { href: "/commute-reality", label: "Commute reality" },
      { href: "/budget-calculator", label: "Budget calculator" },
    ],
    ctaLabel: "Ask an area + budget question",
    analyticsKey: "areas_budget",
  },
  "housing-intro": {
    id: "housing-intro",
    label: "Housing intro",
    topic: "Housing intro",
    summary: "Best when the family is ready to use Gaia Group with a real shortlist, timing, budget band, and weekday needs.",
    bestWhen: "Use this when the area direction is real enough that a housing intro can narrow options instead of widening them.",
    notYet: "Do not lead with listings. This works best after area, budget posture, and family constraints are already clearer.",
    prepLinks: [
      { href: "/housing-intro-readiness", label: "Housing intro readiness" },
      { href: "/housing-brief-builder", label: "Housing brief builder" },
      { href: "/gaia-group", label: "Gaia Group" },
      { href: "/resources/family-housing-brief-template", label: "Housing brief template" },
    ],
    ctaLabel: "Request a housing intro",
    analyticsKey: "housing_intro",
  },
  "empathy-school": {
    id: "empathy-school",
    label: "Empathy School fit",
    topic: "Empathy School fit",
    summary: "Best when the school question is becoming important enough to shape area choice, commute reality, or the family week.",
    bestWhen: "Use this when a tour, a fit question, or a school-first move could change bigger decisions.",
    notYet: "Do not use it as a vague info request. It works best when you can say what you want school to clarify for the family.",
    prepLinks: [
      { href: schoolPlanningGuideHref, label: schoolPlanningGuideLabel },
      { href: "/empathy-school-fit", label: "School fit tool" },
      { href: "/empathy-school-tour-prep", label: "Tour prep" },
      { href: "/resources/empathy-school-fit-notes-sheet", label: "Fit notes sheet" },
    ],
    ctaLabel: "Ask about Empathy School fit",
    analyticsKey: "empathy_school_fit",
  },
};

function normalizePath(value?: string): string {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  const qless = trimmed.split("?")[0].split("#")[0] || "";
  if (!qless) return "";
  return qless !== "/" && qless.endsWith("/") ? qless.slice(0, -1) : qless;
}

function matches(path: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(path));
}

const EXPLICIT_SOURCE_RULES: Array<{
  patterns: RegExp[];
  sourceLabel: string;
  recommendedRouteId: ConversationRouteId;
  reason: string;
  alternativeRouteIds: ConversationRouteId[];
}> = [
  {
    patterns: [/^\/budget-calculator$/, /^\/area-match$/, /^\/compare-areas$/, /^\/commute-reality$/],
    sourceLabel: "area, budget, and commute decisions",
    recommendedRouteId: "areas-budget",
    reason: "You are already turning Bali into a shortlist and a monthly range. The most useful reply from here is one that helps make those tradeoffs more real.",
    alternativeRouteIds: ["planning", "empathy-school"],
  },
  {
    patterns: [/^\/housing-intro-readiness$/, /^\/housing-brief-builder$/, /^\/gaia-group$/, /^\/housing$/, /^\/housing-style-compare$/],
    sourceLabel: "the housing path",
    recommendedRouteId: "housing-intro",
    reason: "This page sits inside the Gaia Group housing sequence, so the strongest next conversation is the one that uses your timing, shortlist, and family brief directly.",
    alternativeRouteIds: ["areas-budget", "planning"],
  },
  {
    patterns: [/^\/empathy-school-fit$/, /^\/empathy-school-tour-prep$/, /^\/schools$/, /^\/camps$/],
    sourceLabel: "the Empathy School path",
    recommendedRouteId: "empathy-school",
    reason: "You are already evaluating whether school should influence the move, so a focused fit conversation is usually more useful than a broad relocation question here.",
    alternativeRouteIds: ["test-stay", "areas-budget"],
  },
  {
    patterns: [/^\/test-stay$/, /^\/test-stay-vs-full-move$/, /^\/first-month-planner$/],
    sourceLabel: "a test-stay decision",
    recommendedRouteId: "test-stay",
    reason: "This part of the site is about using Bali as a real-world test. The most useful reply is the one that protects the questions your short stay is meant to answer.",
    alternativeRouteIds: ["planning", "empathy-school"],
  },
  {
    patterns: [/^\/plan-your-move$/, /^\/move-timeline$/, /^\/decision-checklists$/, /^\/family-path-match$/, /^\/weekday-reality$/, /^\/daily-life$/, /^\/start-here$/, /^\/conversation-paths$/],
    sourceLabel: "the planning system",
    recommendedRouteId: "planning",
    reason: "You are in the part of the site that helps sequence the move, so the strongest next conversation is usually the one that narrows the next decision instead of jumping ahead.",
    alternativeRouteIds: ["areas-budget", "test-stay"],
  },
];

function inferRouteFromPath(path: string): ConversationRouteId {
  if (!path) return "planning";
  if (/school|empathy|tour|camp/.test(path)) return "empathy-school";
  if (/housing|gaia|rent|lease/.test(path)) return "housing-intro";
  if (/area|budget|commute/.test(path)) return "areas-budget";
  if (/test-stay|first-month/.test(path)) return "test-stay";
  return "planning";
}

function titleCasePath(path: string): string {
  const clean = normalizePath(path).replace(/^\//, "");
  if (!clean) return "this page";
  return clean
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " "))
    .join(" → ");
}

export function getConversationRouteDetail(routeId: ConversationRouteId): ConversationRouteDetail {
  return CONVERSATION_ROUTE_DETAILS[routeId];
}

export function getAllConversationRouteDetails(): ConversationRouteDetail[] {
  return Object.values(CONVERSATION_ROUTE_DETAILS);
}

export function getSourceConversationContext(sourcePath?: string): SourceConversationContext {
  const path = normalizePath(sourcePath);
  const explicit = EXPLICIT_SOURCE_RULES.find((rule) => matches(path, rule.patterns));
  if (explicit) {
    return {
      sourcePath: path,
      sourceLabel: explicit.sourceLabel,
      recommendedRouteId: explicit.recommendedRouteId,
      reason: explicit.reason,
      prepLinks: getConversationRouteDetail(explicit.recommendedRouteId).prepLinks,
      alternativeRouteIds: explicit.alternativeRouteIds,
    };
  }

  const inferred = inferRouteFromPath(path);
  const detail = getConversationRouteDetail(inferred);
  const alternatives: Record<ConversationRouteId, ConversationRouteId[]> = {
    planning: ["areas-budget", "test-stay"],
    "test-stay": ["planning", "empathy-school"],
    "areas-budget": ["planning", "housing-intro"],
    "housing-intro": ["areas-budget", "planning"],
    "empathy-school": ["test-stay", "areas-budget"],
  };

  return {
    sourcePath: path,
    sourceLabel: titleCasePath(path),
    recommendedRouteId: inferred,
    reason: `${detail.label} is the cleanest next conversation from here because this page already sits close to that decision lane.`,
    prepLinks: detail.prepLinks,
    alternativeRouteIds: alternatives[inferred],
  };
}

export function buildConversationContactHref(routeId: ConversationRouteId, opts?: { from?: string; partner?: string }): string {
  const preset = getContactPresetById(routeId);
  return buildContactHref(preset.topic, { from: opts?.from, partner: opts?.partner, routeId });
}
