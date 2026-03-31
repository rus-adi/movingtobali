import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { summarizeGovernance } from "@/lib/governance";
import { badge, badgeAccent, badgeGood, btnRow, buttonSecondary, cardCls } from "@/components/ui/styles";

function freshnessLabel(value: ReturnType<typeof summarizeGovernance>["freshness"]): string {
  switch (value) {
    case "fresh":
      return "Fresh";
    case "watch":
      return "Watch list";
    case "stale":
      return "Needs review";
    default:
      return "Date needed";
  }
}

function evidenceLabel(value: ReturnType<typeof summarizeGovernance>["evidenceLevel"]): string {
  switch (value) {
    case "official-links":
      return "Official links";
    case "reviewed":
      return "Reviewed";
    default:
      return "Experience-based";
  }
}

export default function GovernanceMetaStrip({ item, compact = false }: { item: ContentItem; compact?: boolean }) {
  const summary = summarizeGovernance(item);

  return (
    <div className={cardCls}>
      <strong className="text-sm font-semibold text-gray-900">Page governance</strong>
      <p className="mt-3 text-sm leading-6 text-gray-700">{summary.note}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className={summary.freshness === "fresh" ? badgeGood : badgeAccent}>{freshnessLabel(summary.freshness)}</span>
        <span className={badge}>Review cadence: {summary.reviewCadenceDays} days</span>
        <span className={badge}>{evidenceLabel(summary.evidenceLevel)}</span>
        <span className={badge}>Owner: {summary.owner}</span>
        {summary.lastTouched ? <span className={badge}>Last touched: {summary.lastTouched}</span> : null}
        {summary.nextReviewBy ? <span className={badgeAccent}>Next review: {summary.nextReviewBy}</span> : null}
      </div>

      {!compact ? (
        <div className={btnRow}>
          <Link className={buttonSecondary} href="/editorial-standards" data-track="governance_editorial_standards">
            Editorial standards
          </Link>
          <Link className={buttonSecondary} href="/content-health" data-track="governance_content_health">
            Content health
          </Link>
        </div>
      ) : null}
    </div>
  );
}
