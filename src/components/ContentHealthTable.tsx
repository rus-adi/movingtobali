import Link from "next/link";
import type { GovernanceRow } from "@/lib/governance";
import { badge, badgeAccent, badgeGood, cardCls } from "@/components/ui/styles";

function freshnessClass(freshness: GovernanceRow["freshness"]) {
  if (freshness === "fresh") return badgeGood;
  if (freshness === "watch") return badgeAccent;
  return badge;
}

function freshnessLabel(freshness: GovernanceRow["freshness"]) {
  if (freshness === "watch") return "Watch list";
  if (freshness === "stale") return "Needs review";
  if (freshness === "undated") return "Date needed";
  return "Fresh";
}

export default function ContentHealthTable({
  title,
  lead,
  rows,
}: {
  title: string;
  lead?: string;
  rows: GovernanceRow[];
}) {
  return (
    <div className={cardCls}>
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
      {lead ? <p className="mt-3 text-sm leading-6 text-gray-600">{lead}</p> : null}

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-xs uppercase tracking-[0.18em] text-gray-500">
              <th className="pb-2 pr-4 font-semibold">Page</th>
              <th className="pb-2 pr-4 font-semibold">Status</th>
              <th className="pb-2 pr-4 font-semibold">Evidence</th>
              <th className="pb-2 pr-4 font-semibold">Cadence</th>
              <th className="pb-2 pr-4 font-semibold">Next review</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.route} className="align-top">
                <td className="pr-4">
                  <Link href={row.route} className="text-sm font-semibold text-gray-900 transition hover:text-blue-700">
                    {row.title}
                  </Link>
                  <div className="mt-1 text-xs leading-5 text-gray-500">
                    {row.kind}
                    {row.category ? ` · ${row.category}` : ""}
                    {row.noindex ? " · noindex" : ""}
                  </div>
                </td>
                <td className="pr-4">
                  <span className={freshnessClass(row.freshness)}>{freshnessLabel(row.freshness)}</span>
                  <div className="mt-2 text-xs leading-5 text-gray-500">{row.actionLabel}</div>
                </td>
                <td className="pr-4">
                  <div className="text-sm text-gray-700">{row.evidenceLevel}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-500">{row.owner}</div>
                </td>
                <td className="pr-4 text-sm text-gray-700">{row.reviewCadenceDays} days</td>
                <td className="pr-4 text-sm text-gray-700">{row.nextReviewBy || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
