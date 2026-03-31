import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import type { TocItem } from "@/lib/markdown";
import VideoBlock from "@/components/VideoBlock";
import SocialLinks from "@/components/SocialLinks";
import Toc from "@/components/Toc";
import RichText from "@/components/RichText";
import FaqBlock from "@/components/FaqBlock";
import DisclosureNotice from "@/components/DisclosureNotice";
import SourceConversationPanel from "@/components/SourceConversationPanel";
import SafetyNotice from "@/components/SafetyNotice";
import GovernanceMetaStrip from "@/components/GovernanceMetaStrip";
import ParentVoiceStrip from "@/components/ParentVoiceStrip";
import LearnedHardWay from "@/components/LearnedHardWay";
import PageIntentStrip from "@/components/PageIntentStrip";
import SmartNextSteps from "@/components/SmartNextSteps";
import { getHardLessons, getScenarioVoices, inferProofTheme } from "@/lib/proof";
import { buildContactHref } from "@/lib/contact";
import { getEffectiveFaqs } from "@/lib/faqs";
import {
  badge,
  badgeAccent,
  badgeGood,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  grid2,
  pill,
} from "@/components/ui/styles";

function routeFor(item: ContentItem): string {
  if (item.kind === "pillars") return `/${item.slug}`;
  return `/${item.kind}/${item.slug}`;
}

function showDisclosure(item: ContentItem): boolean {
  const key = `${item.kind}:${item.slug}`.toLowerCase();
  if (key.includes("visas") || key.includes("visa")) return true;
  if (key.includes("housing") || key.includes("rent")) return true;
  if (key.includes("partners")) return true;
  return false;
}

function showSafety(item: ContentItem): "visa" | "housing" | null {
  const key = `${item.kind}:${item.slug}`.toLowerCase();
  if (key.includes("visa") || key.includes("visas")) return "visa";
  if (key.includes("housing") || key.includes("rent")) return "housing";
  return null;
}

function hasQuickStart(body: string): boolean {
  return /^\s*##\s+Quick\s+start\b/im.test(body || "");
}


function getTrustLinks(item: ContentItem): { href: string; label: string }[] {
  const links = [{ href: "/disclosure", label: "Disclosure" }];
  if (showSafety(item) === "visa") links.unshift({ href: "/official-links", label: "Official links" });
  if (showSafety(item) === "housing") links.unshift({ href: "/partners", label: "Partners" });
  return links;
}

function getTrustNote(item: ContentItem): string {
  if (showSafety(item) === "visa") {
    return "Visa rules and fees can change. Treat this page as experience-based guidance, then verify changing details against official sources before you act.";
  }
  if (showSafety(item) === "housing") {
    return "Housing pages are here to slow the process down, not push you into a fast yes. Verify identity, contracts, inclusions, and payment terms before you send money.";
  }
  if (item.slug.includes("school") || item.slug.includes("empathy")) {
    return "School-fit pages are meant to help families self-qualify honestly. The goal is a better next decision, not a forced decision.";
  }
  return "This page is part of a larger planning system built by Empathy School. It should help you reduce uncertainty, not create artificial urgency.";
}

type ActionLink = { label: string; href: string; variant: "primary" | "secondary"; external?: boolean };
type SidebarActionCard = { title: string; body: string; actions: ActionLink[] };

function getSidebarActionCard(item: ContentItem): SidebarActionCard {
  const path = item.kind === "pillars" ? `/${item.slug}` : `/${item.kind}/${item.slug}`;

  if (item.kind === "pillars" && item.slug === "start-here") {
    return {
      title: "Need help sequencing the move?",
      body: "Tell us your kids' ages, rough timeline, and the part that feels most unclear. We’ll point you to the next calm step.",
      actions: [
        { label: "Ask a planning question", href: buildContactHref("General move planning", { from: path }), variant: "primary" },
        { label: "Browse family paths", href: "/family-paths", variant: "secondary" },
      ],
    };
  }

  if (item.kind === "pillars" && item.slug === "test-stay") {
    return {
      title: "Turn the trip into a real decision",
      body: "If you already know your likely dates, ask us what to focus on so the stay answers the biggest questions, not just the easiest ones.",
      actions: [
        { label: "Ask about a test stay", href: buildContactHref("Test stay plan", { from: path }), variant: "primary" },
        { label: "Use the decision scorecard", href: "/resources/test-stay-decision-scorecard", variant: "secondary" },
      ],
    };
  }

  if (item.kind === "pillars" && item.slug === "housing") {
    return {
      title: "Want housing help without rushing the process?",
      body: "Request a Gaia Group intro once your timing, area shortlist, and budget band are real enough to make the conversation useful.",
      actions: [
        { label: "Check intro readiness", href: "/housing-intro-readiness", variant: "primary" },
        { label: "Build the housing brief", href: "/housing-brief-builder", variant: "secondary" },
      ],
    };
  }

  if (item.kind === "pillars" && item.slug === "schools") {
    return {
      title: "Use Empathy School as a real-world anchor",
      body: "If a tour is part of your planning, test the commute, the drop-off rhythm, and whether the school changes your area shortlist.",
      actions: [
        { label: "Ask about Empathy School fit", href: buildContactHref("Empathy School fit", { from: path }), variant: "primary" },
        { label: "Use the commute test sheet", href: "/resources/empathy-school-commute-routine-test-sheet", variant: "secondary" },
      ],
    };
  }

  if (item.kind === "pillars" && item.slug === "costs") {
    return {
      title: "Get the numbers closer to real",
      body: "A budget only gets useful once it is connected to a likely area, housing style, and whether Empathy School is part of the week.",
      actions: [
        { label: "Ask an area + budget question", href: buildContactHref("Area + budget question", { from: path }), variant: "primary" },
        { label: "Open budget calculator", href: "/budget-calculator", variant: "secondary" },
      ],
    };
  }

  if (item.kind === "pillars" && item.slug === "areas") {
    return {
      title: "Shortlist areas before you overcommit",
      body: "If you are torn between a few areas, use the Area Match tool first so the shortlist reflects your real week, not just Bali mood.",
      actions: [
        { label: "Use Area Match", href: "/area-match", variant: "primary" },
        { label: "Ask about areas + budget", href: buildContactHref("Area + budget question", { from: path }), variant: "secondary" },
      ],
    };
  }

  if (item.kind === "pillars" && item.slug === "family-paths") {
    return {
      title: "Match the move to your real family setup",
      body: "Use one primary path and one secondary lens so the next decisions reflect your child stage, your adult reality, and the pace that feels sustainable.",
      actions: [
        { label: "Use Family Path Match", href: "/family-path-match", variant: "primary" },
        { label: "Ask a planning question", href: buildContactHref("General move planning", { from: path }), variant: "secondary" },
      ],
    };
  }

  if (item.kind === "guides" && item.slug === "how-gaia-group-housing-support-works") {
    return {
      title: "Ready to request the intro?",
      body: "Send your likely dates, top areas, bedroom needs, and budget band so the first housing conversation starts with something real.",
      actions: [
        { label: "Check intro readiness", href: "/housing-intro-readiness", variant: "primary" },
        { label: "Build the housing brief", href: "/housing-brief-builder", variant: "secondary" },
      ],
    };
  }

  if (item.kind === "guides" && item.slug === "how-to-use-an-empathy-school-tour-to-test-your-week") {
    return {
      title: "Test the school as part of the whole week",
      body: "The useful question is not just whether you like the tour. It is whether the commute and routine still feel workable after pickup.",
      actions: [
        { label: "Ask about Empathy School fit", href: buildContactHref("Empathy School fit", { from: path }), variant: "primary" },
        { label: "Use the commute test sheet", href: "/resources/empathy-school-commute-routine-test-sheet", variant: "secondary" },
      ],
    };
  }

  return {
    title: "Need a calmer next step?",
    body: "If you’re new to the idea, follow the roadmap. If you’re already committed, tell us what part feels stuck and we’ll point you to the next page or decision.",
    actions: [
      { label: "Ask a question", href: buildContactHref("General move planning", { from: path }), variant: "primary" },
      { label: "Start here", href: "/start-here", variant: "secondary" },
      { label: "School planning guide", href: "/schools", variant: "secondary" },
    ],
  };
}

function pathForItem(item: ContentItem): string {
  if (item.kind === "pillars") return `/${item.slug}`;
  return `/${item.kind}/${item.slug}`;
}

function kindLabel(kind: ContentItem["kind"]): string {
  return kind === "pillars" ? "Pillars" : kind.charAt(0).toUpperCase() + kind.slice(1);
}

function getBreadcrumbs(item: ContentItem, primaryPillar?: ContentItem | null) {
  const crumbs: { href?: string; label: string }[] = [{ href: "/", label: "Home" }];

  if (item.kind === "pillars") {
    crumbs.push({ label: item.title });
    return crumbs;
  }

  crumbs.push({ href: `/${item.kind}`, label: kindLabel(item.kind) });

  if (primaryPillar && primaryPillar.kind === "pillars") {
    crumbs.push({ href: `/${primaryPillar.slug}`, label: primaryPillar.title });
  }

  crumbs.push({ label: item.title });
  return crumbs;
}

function QuickStartCard({ kind }: { kind: ContentItem["kind"] }) {
  // Keep this intentionally short. The goal is to reduce overwhelm, not add more content.
  const bulletsByKind: Record<string, string[]> = {
    areas: [
      "Do a morning commute test (school-run hours) before you commit.",
      "Walk the area at night once — noise + lighting matter for families.",
      "Pick 2–3 " + "micro" + "-areas to compare, not 10.",
    ],
    guides: [
      "Skim the headings first — then read the section you need right now.",
      "Use the checklist/templates so you don’t start from scratch.",
      "If something changes fast (visas), verify via Official links.",
    ],
    resources: [
      "Copy the template/checklist and tailor it to your family.",
      "Use it once in a test-stay, then refine.",
    ],
    blog: [
      "Treat this as lived experience — confirm official details when needed.",
      "If you’re planning, follow Start here for sequencing.",
    ],
    pillars: [
      "Start with timeline + budget + a shortlist of areas.",
      "Then decide visas and housing with fewer unknowns.",
    ],
  };

  const bullets = bulletsByKind[kind] || bulletsByKind.guides;
  return (
    <div className={cardCls}>
      <strong className="text-sm font-semibold text-gray-900">Quick start</strong>
      <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-gray-600">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ContentLayout({
  item,
  toc,
  html,
  related,
  primaryPillar,
}: {
  item: ContentItem;
  toc: TocItem[];
  html: string;
  related: ContentItem[];
  primaryPillar?: ContentItem | null;
}) {
  const faqs = getEffectiveFaqs(item);

  const needsQuickStart = !item.video?.youtubeId && !hasQuickStart(item.body);
  const sidebarActionCard = getSidebarActionCard(item);

  const dateLabel = item.date
    ? new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";
  const updatedLabel = item.updated
    ? new Date(item.updated).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";
  const proofTheme = inferProofTheme(item);
  const proofVoices = item.kind === "resources" ? [] : getScenarioVoices(proofTheme);
  const proofLessons = item.kind === "resources" ? [] : getHardLessons(proofTheme);
  const breadcrumbs = getBreadcrumbs(item, primaryPillar);

  return (
    <main>
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/70 via-stone-100/40 to-emerald-100/65" />
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-bali.webp" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        </div>
        <div className="relative py-16 md:py-24">
          <div className="container">
          <div>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-white-600">
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition hover:text-white-900">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white-900">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 ? <span className="text-stone-300">/</span> : null}
                </span>
              ))}
            </nav>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={badge}>{item.kind === "pillars" ? "Pillar" : kindLabel(item.kind)}</span>
              {item.category ? <span className={badgeAccent}>{item.category}</span> : null}
              {dateLabel ? <span className={badge}>{dateLabel}</span> : null}
              {updatedLabel ? <span className={badge}>Updated: {updatedLabel}</span> : null}
              <span className={badge}>{item.readingTimeMinutes} min read</span>
              {item.video?.youtubeId ? <span className={badgeGood}>Video</span> : null}
            </div>

            <h1 className="mt-6 drop-shadow-sm  text-4xl font-bold tracking-tight text-white-900 sm:text-5xl">{item.title}</h1>

            <p className="mt-4 drop-shadow-sm  text-base text-white-600 sm:text-lg">{item.description}</p>

            {/* MEDIA RULE: One YouTube embed directly below H1/intro when available */}
            {item.video ? (
              <div className="mt-8 w-full">
                <VideoBlock video={item.video} />
              </div>
            ) : null}

            {item.kind === "areas" && item.area && Object.values(item.area).some((v) => String(v || "").trim()) ? (
              <div className={`${cardCls} mt-6`}>
                <strong className="text-sm font-semibold text-gray-900">At a glance</strong>
                <div className="mt-4 drop-shadow-sm  flex flex-wrap gap-2">
                  {item.area.pace ? <span className={badge}>Pace: {item.area.pace}</span> : null}
                  {item.area.traffic ? <span className={badge}>Traffic: {item.area.traffic}</span> : null}
                  {item.area.walkability ? <span className={badge}>Walkability: {item.area.walkability}</span> : null}
                  {item.area.familyFit ? <span className={badgeGood}>Family fit: {item.area.familyFit}</span> : null}
                  {item.area.beachAccess ? <span className={badge}>Beach: {item.area.beachAccess}</span> : null}
                  {item.area.natureAccess ? <span className={badge}>Nature: {item.area.natureAccess}</span> : null}
                  {item.area.costTier ? <span className={badgeAccent}>Cost: {item.area.costTier}</span> : null}
                  {item.area.noise ? <span className={badge}>Noise: {item.area.noise}</span> : null}
                </div>
                {item.area.note ? <p className="mt-4 drop-shadow-sm  text-sm leading-6 text-gray-600">{item.area.note}</p> : null}
              </div>
            ) : null}

            {item.tags?.length ? (
              <div className="mt-6 drop-shadow-sm  flex flex-wrap gap-2">
                {item.tags.map((t) => {
                  const clean = String(t || "").replace(/^#/, "");
                  return (
                    <Link
                      key={t}
                      className={pill}
                      // Always route hashtag clicks to Search so tags never land on an empty results page.
                      href={`/search?q=${encodeURIComponent(clean)}`}
                    >
                      #{clean}
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {primaryPillar ? (
              <div className="mt-4 drop-shadow-sm ">
                <Link
                  className={badgeGood}
                  href={`/${primaryPillar.slug}`}
                  data-track="content_primary_pillar"
                  data-pillar={primaryPillar.slug}
                >
                  Pillar: {primaryPillar.title}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-6 grid gap-6">
            {needsQuickStart ? (
              <div className={`${grid2} items-start`}>
                <div>
                  <QuickStartCard kind={item.kind} />
                </div>
                <div className="hidden md:block" aria-hidden="true" />
              </div>
            ) : null}

            <PageIntentStrip item={item} />
          </div>

          <div className={`${grid2} items-start`}>
            <div className="grid gap-6">
              <div className={cardCls}>
                <RichText html={html} />
              </div>

              <SmartNextSteps item={item} />

              {proofVoices.length ? (
                <ParentVoiceStrip
                  title="What families tend to notice here"
                  lead="These composite family scenarios are based on recurring patterns and questions around the hub. They are meant to make the decision more concrete without pretending to be direct testimonials."
                  voices={proofVoices}
                  ctaHref="/what-families-notice"
                  ctaLabel="Browse the story hub"
                />
              ) : null}

              {proofLessons.length ? (
                <LearnedHardWay
                  title="What we learned the hard way"
                  lead="These are the patterns that keep repeating once families move from good intentions into an actual week."
                  items={proofLessons}
                />
              ) : null}

              <FaqBlock faqs={faqs} />
            </div>

            <div className="grid gap-6 md:sticky md:top-28">
              <Toc toc={toc} />
              <SocialLinks social={item.social} />

              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">{sidebarActionCard.title}</strong>
                <p className="mt-3 text-sm leading-6 text-gray-600">{sidebarActionCard.body}</p>
                <div className={btnRow}>
                  {sidebarActionCard.actions.map((action) => {
                    const className = action.variant === "primary" ? buttonPrimary : buttonSecondary;
                    return (
                      <a
                        key={`${action.label}-${action.href}`}
                        className={className}
                        href={action.href}
                        target={action.external ? "_blank" : undefined}
                        rel={action.external ? "noreferrer" : undefined}
                        data-track="content_next_action"
                        data-label={action.label}
                        data-slug={item.slug}
                      >
                        {action.label}
                      </a>
                    );
                  })}
                </div>
              </div>

              <SourceConversationPanel sourcePath={pathForItem(item)} compact />

              <GovernanceMetaStrip item={item} compact />

              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">Trust links</strong>
                <p className="mt-3 text-sm leading-6 text-gray-600">{getTrustNote(item)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {updatedLabel ? <span className={badgeAccent}>Updated {updatedLabel}</span> : null}
                  {dateLabel ? <span className={badge}>Published {dateLabel}</span> : null}
                  <span className={badge}>By Empathy School</span>
                </div>
                <div className={btnRow}>
                  {getTrustLinks(item).map((link) => (
                    <Link key={link.href} className={buttonSecondary} href={link.href} data-track="content_trust_link">
                      {link.label}
                    </Link>
                  ))}
                  <Link className={buttonSecondary} href="/editorial-standards" data-track="content_editorial_standards">
                    Editorial standards
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {related.length ? (
            <div className="mt-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Related</h2>
              <div className={`${grid2} mt-8`}>
                {related.map((r) => (
                  <div key={r.slug} className={cardCls}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badge}>{r.kind}</span>
                      {r.category ? <span className={badgeAccent}>{r.category}</span> : null}
                    </div>
                    <h3 className="mt-4 drop-shadow-sm  text-xl font-semibold tracking-tight text-gray-900">{r.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{r.description}</p>
                    <div className={btnRow}>
                      <Link
                        className={buttonPrimary}
                        href={routeFor(r)}
                        data-track="related_open"
                        data-kind={r.kind}
                        data-slug={r.slug}
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Legal/disclosure notices should live at the bottom of the page to keep the UX calm and action-first. */}
          {showSafety(item) ? (
            <div className={`${grid2} items-start mt-10`}>
              <div>
                <SafetyNotice kind={showSafety(item)!} />
              </div>
              <div className="hidden md:block" aria-hidden="true" />
            </div>
          ) : null}

          {showDisclosure(item) ? (
            <div className={`${grid2} items-start mt-6`}>
              <div>
                <DisclosureNotice compact />
              </div>
              <div className="hidden md:block" aria-hidden="true" />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
