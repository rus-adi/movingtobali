import Link from "next/link";
import type { HubMetric } from "@/lib/hub";
import { badge, badgeAccent, buttonSecondary, cardCls, grid3 } from "@/components/ui/styles";

export default function HubMetricsStrip({
  title = "How the hub has grown",
  lead = "The site should feel bigger because it solves more real family decisions, not because it publishes filler.",
  metrics,
}: {
  title?: string;
  lead?: string;
  metrics: HubMetric[];
}) {
  return (
    <div className="grid gap-6">
      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Premiumization pass</span>
          <span className={badge}>Built by Empathy School</span>
          <span className={badge}>Selective housing: Gaia Group</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{lead}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className={buttonSecondary} href="/how-this-hub-works" data-track="hub_metrics_how_it_works">
            How this hub works
          </Link>
          <Link className={buttonSecondary} href="/editorial-standards" data-track="hub_metrics_editorial_standards">
            Editorial standards
          </Link>
        </div>
      </div>

      <div className={grid3}>
        {metrics.map((metric) => {
          const content = (
            <>
              <div className="text-3xl font-semibold tracking-tight text-gray-900">{metric.value}</div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">{metric.label}</div>
              <p className="mt-3 text-sm leading-6 text-gray-600">{metric.detail}</p>
            </>
          );

          return metric.href ? (
            <Link key={`${metric.label}-${metric.value}`} href={metric.href} className={cardCls} data-track="hub_metrics_open_lane">
              {content}
            </Link>
          ) : (
            <div key={`${metric.label}-${metric.value}`} className={cardCls}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
