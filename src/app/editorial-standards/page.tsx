import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/Section";
import { badge, badgeAccent, badgeGood, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Editorial standards",
  description: "How Move to Bali by Empathy School reviews pages, labels evidence, uses disclosures, and keeps family guidance trustworthy.",
};

export default function EditorialStandardsPage() {
  return (
    <main>
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <div className={badgeAccent}>Editorial standards</div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">How this hub stays useful without sounding overconfident.</h1>
            <p className="mt-6 text-base leading-7 text-gray-700 sm:text-lg">
              Move to Bali is a family relocation hub built by Empathy School. That means the tone should stay calm,
              practical, and human. We want a parent to trust the next step on the page, not feel pushed into a fast yes.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className={badgeGood}>Family-first</span>
              <span className={badge}>Experience-based</span>
              <span className={badge}>Official links where rules change</span>
              <span className={badgeAccent}>Selective partners only</span>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="The editorial rules we keep visible"
        lead="These standards are public on purpose. The site should feel more trustworthy as it grows, not less."
        tone="muted"
      >
        <div className={grid2}>
          {[
            [
              "Empathy School is the school anchor",
              "We can talk about school choice as part of a move, but the educational pathway we actively develop here is Empathy School. This is not a generic multi-school directory.",
            ],
            [
              "Gaia Group is the public housing partner",
              "The housing lane stays intentionally narrow. We prefer one trusted public housing path over a noisy directory of lightly-vetted agents.",
            ],
            [
              "Composite stories must be labeled",
              "When we use recurring family patterns to make a decision feel concrete, we label them as composite scenarios. We do not invent direct testimonials and present them as quotes.",
            ],
            [
              "Changing rules need official links",
              "Visas, entry requirements, and similar details should never rely on confidence alone. Pages in those lanes point families back to official sources before they act.",
            ],
          ].map(([title, body]) => (
            <div key={title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="How we label evidence"
        lead="Not every page serves the same job. The labels tell families how to use the page wisely."
      >
        <div className={grid3}>
          <div className={cardCls}>
            <div className={badge}>Experience-based</div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">Lived guidance and recurring family questions</h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              These pages help families picture daily life, test routines, and make calmer decisions. They are practical, but they are not legal or regulatory authority.
            </p>
          </div>
          <div className={cardCls}>
            <div className={badgeAccent}>Reviewed</div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">Decision pages checked on a tighter cadence</h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Areas, housing, Empathy School fit, costs, and other decision-heavy pages are reviewed more tightly because families use them to make real commitments.
            </p>
          </div>
          <div className={cardCls}>
            <div className={badgeGood}>Official links</div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">Pages where changing rules matter</h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              In visas and similar lanes, the job of the page is to orient the family and then hand them back to the right official source before they act.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="When a page gets reviewed more often"
        lead="We do not try to review every page at the same speed. We tighten the cycle where drift creates bigger family mistakes."
        tone="muted"
      >
        <div className={grid3}>
          {[
            ["30-day cadence", "Visa and official-links pages where details can shift quickly."],
            ["45-day cadence", "Housing, Gaia Group, costs, and similar pages where a small miss can create expensive confusion."],
            ["60-day cadence", "Empathy School fit, tours, and camp-adjacent pages that need to stay honest and current."],
            ["90–120 day cadence", "Evergreen pillars, area explainers, and core family planning guidance."],
            ["180-day cadence", "Resources, templates, and story pages that are stable unless the surrounding system changes."],
            ["Noindex / experimental", "Pages that are not ready for search yet, or are still being tested, should not be treated as finished public landings."],
          ].map(([title, body]) => (
            <div key={title} className={cardCls}>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="What we will avoid as the site grows"
        lead="The point is depth with restraint. Bigger should not mean messier."
      >
        <div className={grid2}>
          <div className={cardCls}>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">We will avoid</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
              <li>generic “best schools in Bali” publishing</li>
              <li>thin doorway pages</li>
              <li>inflated partner listings</li>
              <li>fake testimonials or anonymous “reviews” we cannot stand behind</li>
              <li>multilingual support pages before the real support exists</li>
            </ul>
          </div>
          <div className={cardCls}>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">We will keep building</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-gray-700">
              <li>decision tools</li>
              <li>checklists and planning boards</li>
              <li>real routine guidance</li>
              <li>Empathy School fit pathways</li>
              <li>careful trust and disclosure systems</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className={buttonPrimary} href="/content-health">
            View content health
          </Link>
          <Link className={buttonSecondary} href="/disclosure">
            Read disclosures
          </Link>
          <Link className={buttonSecondary} href="/official-links">
            Open official links
          </Link>
        </div>
      </Section>
    </main>
  );
}
