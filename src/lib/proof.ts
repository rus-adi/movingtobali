export type ProofTheme = "planning" | "test-stay" | "areas" | "housing" | "daily-life" | "schools";

export type ScenarioVoice = {
  familyType: string;
  title: string;
  note: string;
  learn: string;
  href?: string;
};

export type HardLesson = {
  title: string;
  body: string;
};

const scenarioVoices: Record<ProofTheme, ScenarioVoice[]> = {
  planning: [
    {
      familyType: "Composite family scenario — two working parents, kids 5 and 8",
      title: "They stopped trying to solve the whole island at once.",
      note: "What helped most was not more research. It was choosing a move shape, two realistic areas, and a budget band before opening more tabs.",
      learn: "A smaller decision stack made the whole move feel more possible.",
      href: "/blog/a-10-day-test-stay-what-a-composite-family-learned",
    },
    {
      familyType: "Composite family scenario — cautious first move",
      title: "The question changed from ‘Can Bali work?’ to ‘What would Thursday feel like?’",
      note: "Once they started testing ordinary weekdays instead of holiday energy, the right next steps became much clearer.",
      learn: "Ordinary-week questions create better decisions than inspirational ones.",
      href: "/guides/questions-parents-actually-ask-before-moving-to-bali",
    },
    {
      familyType: "Composite family scenario — family with an older child",
      title: "They needed buy-in more than certainty.",
      note: "Planning got easier once the adults stopped trying to force a perfect answer and started collecting signal from the child, the school day, and the commute.",
      learn: "A move can stay staged without feeling indecisive.",
      href: "/guides/moving-to-bali-with-pre-teens-and-teens",
    },
  ],
  "test-stay": [
    {
      familyType: "Composite family scenario — 10-day test stay",
      title: "The biggest surprise was how helpful one unplanned afternoon became.",
      note: "The family learned more from a slower school-run day, a grocery stop, and one tired evening than from packing the stay with activities.",
      learn: "A useful test stay needs breathing room, not a perfect itinerary.",
      href: "/blog/a-10-day-test-stay-what-a-composite-family-learned",
    },
    {
      familyType: "Composite family scenario — school-curious family",
      title: "The tour mattered because the rest of the day was protected.",
      note: "The school visit only became meaningful once they could feel the route, the pickup energy, and how everyone felt afterwards.",
      learn: "School fit becomes clearer when the day around the tour still feels real.",
      href: "/guides/how-to-plan-an-empathy-school-tour-during-a-test-stay",
    },
    {
      familyType: "Composite family scenario — short-stay remote-working family",
      title: "They treated Bali like a real week, not a reward trip.",
      note: "That meant working normal hours, testing transport, and noticing where everyone felt stretched by the middle of the week.",
      learn: "A test stay gets better when it protects normal family friction instead of hiding it.",
      href: "/guides/one-to-three-month-family-stay-in-bali",
    },
  ],
  areas: [
    {
      familyType: "Composite family scenario — family comparing Sanur and Ubud",
      title: "One school run changed the shortlist.",
      note: "The family liked both areas online, but the route, timing, and end-of-day energy made one option feel sustainable and the other feel harder than expected.",
      learn: "Area fit often reveals itself through the school run, not the café list.",
      href: "/blog/the-school-run-that-changed-an-area-shortlist",
    },
    {
      familyType: "Composite family scenario — highly active child",
      title: "They chose the smaller radius over the more famous area.",
      note: "Having easier movement, faster defaults, and less traffic gave the child and the adults a calmer week.",
      learn: "Choosing a family radius often matters more than choosing the ‘best’ Bali area in the abstract.",
      href: "/guides/moving-to-bali-with-a-highly-active-outdoor-child",
    },
    {
      familyType: "Composite family scenario — quieter family",
      title: "They needed less stimulation, not more options.",
      note: "The winning area was the one that felt okay on a tired Wednesday, not the one that looked richest on paper.",
      learn: "The calmer choice often looks less exciting online and better in real life.",
      href: "/guides/quiet-nature-areas-in-bali",
    },
  ],
  housing: [
    {
      familyType: "Composite family scenario — first Bali rental",
      title: "Pretty photos stopped mattering once commute and maintenance entered the picture.",
      note: "The family started choosing homes by where the week felt lighter, not by which villa looked best in a listing.",
      learn: "Housing is a weekly-systems decision before it is an aesthetic one.",
      href: "/blog/when-housing-stopped-being-about-pretty-photos",
    },
    {
      familyType: "Composite family scenario — budget-sensitive move",
      title: "The ‘cheaper’ house only looked cheaper before the real week arrived.",
      note: "Longer drives, extra help, and friction costs changed the picture once school, food, and tired evenings became part of the calculation.",
      learn: "A lower rent can still create a heavier family budget overall.",
      href: "/guides/how-to-know-if-a-bali-rental-will-work-for-your-real-week",
    },
    {
      familyType: "Composite family scenario — housing intro through Gaia Group",
      title: "The best first step was a stronger brief, not more listings.",
      note: "Once the family clarified area, timing, budget band, and non-negotiables, the search got much more useful.",
      learn: "Good housing help starts with sharper signal, not wider browsing.",
      href: "/housing-brief-builder",
    },
  ],
  "daily-life": [
    {
      familyType: "Composite family scenario — first rainy week",
      title: "Rain made the family design defaults instead of improvising every day.",
      note: "The move got easier once they had indoor backups, simpler after-school plans, and a less ambitious weekday rhythm.",
      learn: "A workable rainy-week default can calm the whole move.",
      href: "/blog/what-a-rainy-week-taught-one-family-about-routine",
    },
    {
      familyType: "Composite family scenario — sick-day reality",
      title: "The hardest day was not dramatic. It was ordinary and underplanned.",
      note: "A child getting sick forced the family to notice what information, transport, and support they needed within one hour.",
      learn: "Prepared families usually feel calmer because they already decided the first three moves.",
      href: "/guides/getting-sick-in-bali-with-kids",
    },
    {
      familyType: "Composite family scenario — after-school energy dip",
      title: "The week improved when the family stopped over-scheduling afternoons.",
      note: "A calmer after-school rhythm mattered more than adding more activities in the first month.",
      learn: "In Bali, less can feel more sustainable faster than families expect.",
      href: "/guides/after-school-rhythm-in-bali-for-families",
    },
  ],
  schools: [
    {
      familyType: "Composite family scenario — school-first move",
      title: "The school question changed the area question.",
      note: "Once Empathy School became a real option, the family started judging areas by school-day energy and pickup reality instead of general vibe.",
      learn: "School fit can reshape the whole move earlier than parents expect.",
      href: "/guides/how-to-know-if-empathy-school-should-anchor-your-move",
    },
    {
      familyType: "Composite family scenario — cautious test-stay family",
      title: "The tour mattered most because it made the family imagine a normal week.",
      note: "The question stopped being ‘Do we like the campus?’ and became ‘Do we like our lives around this campus?’",
      learn: "A good school tour connects back to commute, energy, and rhythm.",
      href: "/blog/the-school-run-that-changed-an-area-shortlist",
    },
    {
      familyType: "Composite family scenario — family using camp to test fit",
      title: "Camp created signal without pretending it answered everything.",
      note: "The family left with better questions, calmer expectations, and a clearer sense of whether Empathy School deserved a deeper look.",
      learn: "Sometimes school fit becomes visible through smaller, lower-pressure contact points first.",
      href: "/camps",
    },
  ],
};

const hardLessons: Record<ProofTheme, HardLesson[]> = {
  planning: [
    {
      title: "Do not solve the whole island at once.",
      body: "The move usually gets better when you decide the move shape, two or three areas, and a realistic budget band before you chase more information.",
    },
    {
      title: "A staged move is not a weak move.",
      body: "Families often feel calmer when they let the move become more real in layers instead of demanding full certainty up front.",
    },
    {
      title: "Ordinary life is the real test.",
      body: "The right questions are often about a tired Thursday, a school pickup, or a rainy morning — not the best-case holiday version of Bali.",
    },
  ],
  "test-stay": [
    {
      title: "Do not overschedule the stay.",
      body: "A useful test stay needs enough ordinary space to show how your family regulates, travels, rests, and resets.",
    },
    {
      title: "Protect one normal weekday.",
      body: "Families learn more when at least one day includes groceries, transport, a slower lunch, tired children, and less polished energy.",
    },
    {
      title: "Leave with a decision, not just a feeling.",
      body: "A test stay works better when you name what you are trying to prove or disprove before you arrive.",
    },
  ],
  areas: [
    {
      title: "A famous area can still be the wrong family radius.",
      body: "The family-friendly win is often the area that reduces friction, not the one with the strongest online reputation.",
    },
    {
      title: "Test the school run at a real time.",
      body: "Traffic, tiredness, and pickup energy often reveal more than midday impressions ever do.",
    },
    {
      title: "Choose the week, not the aesthetic.",
      body: "Parents usually feel the right area in the rhythm of normal life before they can fully explain it in words.",
    },
  ],
  housing: [
    {
      title: "Photos are not proof.",
      body: "A beautiful listing still needs verification, contract clarity, utility detail, and a location that fits the real week.",
    },
    {
      title: "Fast deposits can create slow regret.",
      body: "Families usually do better when they slow down just enough to verify who they are paying and what the agreement really includes.",
    },
    {
      title: "The house is part of the system.",
      body: "Rent, commute, school, groceries, and end-of-day energy all touch each other. Treat them like one decision cluster.",
    },
  ],
  "daily-life": [
    {
      title: "Rain exposes weak defaults quickly.",
      body: "A gentler rainy-week plan often lowers stress more than finding the perfect indoor activity list.",
    },
    {
      title: "Sick days need a script.",
      body: "Families feel more settled when they already know who to contact, how to travel, and what information they want in one place.",
    },
    {
      title: "Adult energy matters too.",
      body: "Many Bali plans fail because they only optimize for the children. A sustainable week has to work for the adults carrying it as well.",
    },
  ],
  schools: [
    {
      title: "School fit changes more than the school question.",
      body: "Once Empathy School becomes real, area, commute, daily timing, and even housing brief decisions often need a second look.",
    },
    {
      title: "A good tour needs margin around it.",
      body: "Families usually get clearer signal when the school day is not squeezed between too many other logistics.",
    },
    {
      title: "One visit should open better questions.",
      body: "A useful school visit rarely answers everything. It should help you decide the next decision more honestly.",
    },
  ],
};

export function getScenarioVoices(theme: ProofTheme): ScenarioVoice[] {
  return scenarioVoices[theme] || scenarioVoices.planning;
}

export function getHardLessons(theme: ProofTheme): HardLesson[] {
  return hardLessons[theme] || hardLessons.planning;
}

export function inferProofTheme(input: { kind?: string; slug?: string; tags?: string[]; category?: string }): ProofTheme {
  const slug = String(input.slug || "").toLowerCase();
  const category = String(input.category || "").toLowerCase();
  const tags = (input.tags || []).map((tag) => String(tag).toLowerCase());
  const text = `${slug} ${category} ${tags.join(" ")}`;

  if (text.includes("test-stay") || text.includes("trial") || text.includes("tour")) return "test-stay";
  if (text.includes("school") || text.includes("camp") || text.includes("empathy")) return "schools";
  if (text.includes("housing") || text.includes("rent") || text.includes("lease") || text.includes("gaia")) return "housing";
  if (text.includes("area") || text.includes("commute") || input.kind === "areas") return "areas";
  if (
    text.includes("daily-life") ||
    text.includes("weekday") ||
    text.includes("rain") ||
    text.includes("sick") ||
    text.includes("health") ||
    text.includes("routine") ||
    text.includes("transport")
  ) {
    return "daily-life";
  }

  return "planning";
}
