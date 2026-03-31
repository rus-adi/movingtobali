import { getSite } from "@/lib/site";
import { badge, badgeAccent, buttonSecondary, pill } from "@/components/ui/styles";
import { schoolPlanningGuideHref, schoolPlanningGuideLabel } from "@/lib/schoolLinks";

const groups = [
  {
    title: "Plan",
    links: [
      ["/start-here", "Start here"],
      ["/how-this-hub-works", "How this hub works"],
      ["/plan-your-move", "Plan your move"],
      ["/move-timeline", "Move timeline"],
      ["/decision-checklists", "Decision checklists"],
      ["/conversation-paths", "Conversation paths"],
      ["/family-path-match", "Family path match"],
      ["/test-stay-vs-full-move", "Test stay vs full move"],
      ["/test-stay", "Test stay"],
      ["/first-month-planner", "First month planner"],
      ["/housing-intro-readiness", "Housing readiness"],
      ["/housing-brief-builder", "Housing brief builder"],
      ["/weekday-reality", "Weekday reality"],
      ["/budget-calculator", "Budget calculator"],
    ],
  },
  {
    title: "Explore",
    links: [
      ["/areas", "Bali areas"],
      ["/area-match", "Area Match"],
      ["/compare-areas", "Compare areas"],
      ["/commute-reality", "Commute reality"],
      ["/housing", "Housing"],
      ["/housing-style-compare", "Housing style compare"],
      ["/gaia-group", "Gaia Group"],
      ["/daily-life", "Daily life"],
      ["/settling-in", "Settling in"],
      ["/costs", "Costs"],
      ["/family-paths", "Family paths"],
      ["/guides", "Guides"],
      ["/resources", "Resources"],
      ["/video-recaps", "Video recaps"],
    ],
  },
  {
    title: "School & partners",
    links: [
      [schoolPlanningGuideHref, schoolPlanningGuideLabel],
      ["/empathy-school-fit", "School fit"],
      ["/empathy-school-tour-prep", "Tour prep"],
      ["/camps", "Camps"],
      ["/partners", "Partners"],
      ["/contact", "Contact"],
    ],
  },
  {
    title: "Trust",
    links: [
      ["/faq", "FAQ hub"],
      ["/what-families-notice", "What families notice"],
      ["/editorial-standards", "Editorial standards"],
      ["/content-health", "Content health"],
      ["/official-links", "Official links"],
      ["/disclosure", "Disclosure"],
      ["/privacy", "Privacy"],
      ["/terms", "Terms"],
    ],
  },
] as const;

export default function Footer() {
  const site = getSite();

  return (
    <footer className="mt-16 border-t border-stone-200 bg-white/95 py-16">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <div className="text-sm font-semibold text-gray-900">{site.brand.name}</div>
            <div className="mt-4 max-w-md text-sm leading-6 text-gray-600">{site.brand.tagline}</div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className={badgeAccent}>Built by Empathy School</span>
              <span className={badge}>Selective housing: Gaia Group</span>
              <span className={badge}>Composite proof, not fake testimonials</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a className={pill} href={site.brand.publisherUrl} target="_blank" rel="noreferrer" data-track="footer_empathy">
                Visit Empathy School
              </a>
              <a className={pill} href={site.brand.social.youtube} target="_blank" rel="noreferrer" data-track="footer_youtube">
                YouTube
              </a>
              <a className={pill} href={site.brand.social.instagram} target="_blank" rel="noreferrer" data-track="footer_instagram">
                Instagram
              </a>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a className={buttonSecondary} href="/how-this-hub-works" data-track="footer_cta_hub">
                How this hub works
              </a>
              <a className={buttonSecondary} href="/plan-your-move" data-track="footer_cta_plan">
                Plan your move
              </a>
              <a className={buttonSecondary} href={schoolPlanningGuideHref} data-track="footer_cta_school_guide">
                {schoolPlanningGuideLabel}
              </a>
              <a className={buttonSecondary} href="/contact" data-track="footer_cta_contact">
                Ask a question
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <div className="text-sm font-semibold text-gray-900">{group.title}</div>
                <div className="mt-4 grid gap-2 text-sm text-gray-600">
                  {group.links.map(([href, label]) => (
                    <a key={href} className="transition-colors hover:text-gray-900" href={href}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-6 text-xs leading-5 text-gray-500">
          Disclaimer: This site shares experience-based guidance for families. It is not immigration, legal, or tax advice. Rules, partner details, and pricing can change — verify via official sources where needed.
        </div>
      </div>
    </footer>
  );
}
