import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2 } from "@/components/ui/styles";
import {
  buildConversationContactHref,
  getConversationRouteDetail,
  getSourceConversationContext,
  type ConversationRouteId,
} from "@/lib/conversion";

type Props = {
  sourcePath: string;
  compact?: boolean;
  title?: string;
  lead?: string;
};

function AlternativeRouteButton({ routeId, sourcePath }: { routeId: ConversationRouteId; sourcePath: string }) {
  const detail = getConversationRouteDetail(routeId);
  return (
    <a
      className={buttonSecondary}
      href={buildConversationContactHref(routeId, { from: sourcePath })}
      data-track="conversion_alternative_contact"
      data-route={detail.analyticsKey}
    >
      {detail.label}
    </a>
  );
}

export default function SourceConversationPanel({ sourcePath, compact = false, title, lead }: Props) {
  const context = getSourceConversationContext(sourcePath);
  const detail = getConversationRouteDetail(context.recommendedRouteId);
  const prepLinks = context.prepLinks.slice(0, compact ? 2 : 3);
  const alternatives = context.alternativeRouteIds.slice(0, compact ? 1 : 2);

  if (compact) {
    return (
      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Best next conversation</span>
          <span className={badge}>{detail.label}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-gray-600">{context.reason}</p>
        <div className={btnRow}>
          <a
            className={buttonPrimary}
            href={buildConversationContactHref(context.recommendedRouteId, { from: sourcePath })}
            data-track="conversion_primary_contact"
            data-route={detail.analyticsKey}
          >
            {detail.ctaLabel}
          </a>
          <a className={buttonSecondary} href="/conversation-paths" data-track="conversion_open_paths">
            Compare all conversation paths
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="max-w-3xl">
          <div className={badgeAccent}>Conversion path</div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {title || "Choose the next conversation on purpose"}
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            {lead || "The strongest next contact usually depends on the page you just used. This keeps the site practical instead of making every question look the same."}
          </p>
        </div>

        <div className={grid2 + " mt-8 items-start"}>
          <div className={cardCls}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={badgeAccent}>Recommended now</span>
              <span className={badge}>{detail.label}</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{detail.ctaLabel}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">{context.reason}</p>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
              <strong className="text-gray-900">Best when</strong>
              <p className="mt-1">{detail.bestWhen}</p>
            </div>
            <div className={btnRow}>
              <a
                className={buttonPrimary}
                href={buildConversationContactHref(context.recommendedRouteId, { from: sourcePath })}
                data-track="conversion_primary_contact"
                data-route={detail.analyticsKey}
              >
                {detail.ctaLabel}
              </a>
              <a className={buttonSecondary} href="/conversation-paths" data-track="conversion_open_paths">
                Compare all conversation paths
              </a>
            </div>
          </div>

          <div className="grid gap-6">
            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">Useful before you contact</strong>
              <div className="mt-4 grid gap-3">
                {prepLinks.map((link) => (
                  <a
                    key={link.href}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
                    href={link.href}
                    data-track="conversion_prep_link"
                    data-route={detail.analyticsKey}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {alternatives.length ? (
              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">Another valid route if this is too early</strong>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  The site should help families route themselves. If the recommended conversation still feels premature, use one of the alternatives instead of forcing the wrong contact.
                </p>
                <div className={btnRow}>
                  {alternatives.map((routeId) => (
                    <AlternativeRouteButton key={routeId} routeId={routeId} sourcePath={sourcePath} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
