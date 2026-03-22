export type ContactTopicPresetId = "planning" | "test-stay" | "areas-budget" | "housing-intro" | "empathy-school";

export type ContactTopicPreset = {
  id: ContactTopicPresetId;
  topic: string;
  label: string;
  description: string;
  bullets: string[];
  messagePlaceholder: string;
  timelinePlaceholder: string;
  partnerSlug?: string;
};

export const CONTACT_TOPIC_PRESETS: ContactTopicPreset[] = [
  {
    id: "planning",
    topic: "General move planning",
    label: "Plan the move",
    description: "Timeline, kids' ages, order of decisions, and what to solve now versus later.",
    bullets: [
      "Your likely arrival window or test-stay dates.",
      "Kids' ages and whether they need routine quickly.",
      "What is still uncertain: visa, area, housing, or school.",
      "The one decision that feels most stuck right now.",
    ],
    messagePlaceholder:
      "We are thinking about Bali for our family. Our children are __ and __. The part that feels most unclear right now is __. We are hoping to decide __ in the next __ weeks.",
    timelinePlaceholder: "e.g., testing Bali in June and deciding by August",
  },
  {
    id: "test-stay",
    topic: "Test stay plan",
    label: "Plan a test stay",
    description: "Use a short stay to answer the right questions before you commit to a bigger move.",
    bullets: [
      "How long you can realistically stay.",
      "Whether you want more structure, more flexibility, or both.",
      "Which areas are already on your shortlist.",
      "Whether you want to tour Empathy School during the stay.",
    ],
    messagePlaceholder:
      "We want to use a Bali test stay to make a real decision. We can stay for __ weeks. We are thinking about __ and __ areas. We want to leave the trip knowing __.",
    timelinePlaceholder: "e.g., 3-week test stay in July",
  },
  {
    id: "areas-budget",
    topic: "Area + budget question",
    label: "Areas + budget",
    description: "Get help turning vague ideas into an area shortlist and a working monthly range.",
    bullets: [
      "Your current monthly budget range, even if it is rough.",
      "Whether Empathy School is part of the plan or just a possibility.",
      "What pace you want: calmer, easier routines, or more convenience.",
      "How much commute friction your family can realistically handle.",
    ],
    messagePlaceholder:
      "We are trying to narrow Bali down to the right area and budget. Right now we think we can spend about __ per month. We care most about __, and we want to avoid __.",
    timelinePlaceholder: "e.g., planning now for a move later this year",
  },
  {
    id: "housing-intro",
    topic: "Housing intro",
    label: "Housing intro",
    description: "Request a warm intro to Gaia Group once your timing and area direction are real enough to be useful.",
    bullets: [
      "Your move or test-stay dates.",
      "The two or three areas you are actually considering.",
      "Budget band, bedroom needs, and non-negotiables.",
      "Whether Empathy School is shaping the area shortlist.",
    ],
    messagePlaceholder:
      "We would like a housing intro. We are looking for __ bedrooms around __ budget. Our likely areas are __. The biggest non-negotiables for our family are __.",
    timelinePlaceholder: "e.g., arriving for viewings in early August",
    partnerSlug: "gaia-group-bali",
  },
  {
    id: "empathy-school",
    topic: "Empathy School fit",
    label: "Empathy School fit",
    description: "Ask about touring, age fit, or whether Empathy School should anchor your move planning.",
    bullets: [
      "Your children's ages and what kind of learning rhythm tends to suit them.",
      "Whether you want a tour, a first conversation, or help judging fit.",
      "What areas you are considering so commute reality is part of the answer.",
      "What you are hoping school would solve for your family routine.",
    ],
    messagePlaceholder:
      "We are exploring whether Empathy School could be the right fit for our family. Our children are __. We are especially trying to understand __. We would like help with __.",
    timelinePlaceholder: "e.g., hoping to tour during a 2-week stay next month",
  },
];

function normalize(value?: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function getContactPresetById(id?: string): ContactTopicPreset {
  const preset = CONTACT_TOPIC_PRESETS.find((item) => item.id === id);
  return preset || CONTACT_TOPIC_PRESETS.find((item) => item.id === "planning")!;
}

export function getContactPreset(topic?: string, partnerSlug?: string): ContactTopicPreset {
  const raw = normalize(topic);
  const partner = normalize(partnerSlug);

  if (partner === "gaia-group-bali") {
    return getContactPresetById("housing-intro");
  }

  if (raw.includes("housing") || raw.includes("rent") || raw.includes("gaia")) {
    return getContactPresetById("housing-intro");
  }
  if (raw.includes("test stay") || raw.includes("short stay")) {
    return getContactPresetById("test-stay");
  }
  if (raw.includes("area") || raw.includes("budget")) {
    return getContactPresetById("areas-budget");
  }
  if (raw.includes("school") || raw.includes("tour") || raw.includes("empathy")) {
    return getContactPresetById("empathy-school");
  }
  return getContactPresetById("planning");
}

export function buildContactHref(
  topic: string,
  opts?: {
    from?: string;
    partner?: string;
    routeId?: ContactTopicPresetId;
  }
): string {
  const params = new URLSearchParams();
  params.set("topic", topic);
  if (opts?.from) params.set("from", opts.from);
  if (opts?.partner) params.set("partner", opts.partner);
  if (opts?.routeId) params.set("route", opts.routeId);
  const qs = params.toString();
  return qs ? `/contact?${qs}` : "/contact";
}
