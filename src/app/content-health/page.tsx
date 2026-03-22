import type { Metadata } from "next";
import Link from "next/link";
import ContentHealthTable from "@/components/ContentHealthTable";
import Section from "@/components/Section";
import governanceReport from "@/generated/governanceReport.json";
import type { GovernanceRow } from "@/lib/governance";
import { badgeAccent, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

type GovernanceReport = {
  generatedAt: string;
  summary: typeof governanceReport.summary;
  rows: GovernanceRow[];
};

const report = governanceReport as GovernanceReport;

export const metadata: Metadata = {
  title: "Content health",
  description: "A lightweight public view of update cadence, evidence labels, and review signals across the Move to Bali hub.",
};

function topRows(predicate: (row: GovernanceRow) => boolean, limit = 10) {
  return report.rows.filter(predicate).slice(0, limit);
}

export default function ContentHealthPage() {
  const summary = report.summary;
  const watchRows = topRows((row) => row.freshness === "watch" || row.freshness === "stale", 12);
  const tighterCadenceRows = topRows((row) => row.tighterCadence, 12);
  const noindexRows = topRows((row) => row.noindex, 8);

  return (
    <main>
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl">
            <div className={badgeAccent}>Content health</div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">A public view of how we keep the hub honest.</h1>
            <p className="mt-6 text-base leading-7 text-gray-600 sm:text-lg">
              This is not meant to be flashy. It is here so the site can grow without feeling vague or unmanaged.
              The counts below show which pages are on tighter review cadences, which are already fresh, and which should be watched next.
            </p>
          </div>
        </div>
      </section>

      <Section title="At a glance" lead="This snapshot is generated from the current content set and review rules." tone="muted">
        <div className={grid3}>
          {[
            ["Total public pages", String(summary.totalPages)],
            ["Fresh now", String(summary.fresh)],
            ["Watch list", String(summary.watch)],
            ["Needs review", String(summary.stale)],
            ["Tighter cadence pages", String(summary.tighterCadence)],
            ["Noindex / experimental", String(summary.noindex)],
          ].map(([title, value]) => (
            <div key={title} className={cardCls}>
              <div className="text-sm font-medium text-gray-500">{title}</div>
              <div className="mt-3 text-4xl font-bold tracking-tight text-gray-900">{value}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="What the review system is trying to protect"
        lead="The site is allowed to feel warm and human. It is not allowed to feel careless."
      >
        <div className={grid2}>
          <div className={cardCls}>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Tighter cadence</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Pages around visas, housing, costs, Gaia Group, Empathy School fit, and similar decision lanes are reviewed faster because small drift creates bigger family mistakes.
            </p>
          </div>
          <div className={cardCls}>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Experience-based pages still need discipline</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Story, rhythm, and family-life pages can be more evergreen, but they still get dates, ownership, and clear labeling so they do not blur into vague inspiration.
            </p>
          </div>
        </div>
      </Section>

      {watchRows.length ? (
        <Section
          title="Watch list"
          lead="These are the pages we would review first if we were doing the next trust pass today."
          tone="muted"
        >
          <ContentHealthTable title="Pages to watch next" rows={watchRows} />
        </Section>
      ) : null}

      {tighterCadenceRows.length ? (
        <Section
          title="Pages on tighter cadences"
          lead="These are the pages where families are more likely to act on the advice, not just browse it."
        >
          <ContentHealthTable title="Tighter-cadence pages" rows={tighterCadenceRows} />
        </Section>
      ) : null}

      {noindexRows.length ? (
        <Section
          title="Noindex / experimental pages"
          lead="Useful internally or as stepping stones, but not all of them are ready to carry public search traffic."
          tone="muted"
        >
          <ContentHealthTable title="Noindex pages" rows={noindexRows} />
        </Section>
      ) : null}

      <Section title="Use this with the standards page" lead="The numbers only make sense when paired with the rules behind them.">
        <div className={grid2}>
          <div className={cardCls}>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Editorial standards</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              See how we label evidence, how composite family scenarios are handled, when official links matter, and why the partner system stays intentionally narrow.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className={buttonPrimary} href="/editorial-standards">
                Read editorial standards
              </Link>
              <Link className={buttonSecondary} href="/disclosure">
                Read disclosure
              </Link>
            </div>
          </div>
          <div className={cardCls}>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Official links and trust pages</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Visa and policy pages should orient the family, then hand them back to the official source before action. That is why the trust layer lives in public, not hidden away.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className={buttonSecondary} href="/official-links">
                Open official links
              </Link>
              <Link className={buttonSecondary} href="/partners">
                Review partner disclosures
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
