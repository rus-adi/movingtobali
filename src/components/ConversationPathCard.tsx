import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls } from "@/components/ui/styles";
import { buildConversationContactHref, getConversationRouteDetail, type ConversationRouteId } from "@/lib/conversion";

type Props = {
  routeId: ConversationRouteId;
  from?: string;
};

export default function ConversationPathCard({ routeId, from }: Props) {
  const detail = getConversationRouteDetail(routeId);
  const [firstPrep, secondPrep] = detail.prepLinks;

  return (
    <div className={cardCls}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={badgeAccent}>Conversation path</span>
        <span className={badge}>{detail.label}</span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{detail.label}</h2>
      <p className="mt-3 text-sm leading-6 text-gray-600">{detail.summary}</p>

      <div className="mt-6 space-y-4 text-sm leading-6 text-gray-600">
        <div>
          <strong className="text-gray-900">Best when</strong>
          <p className="mt-1">{detail.bestWhen}</p>
        </div>
        <div>
          <strong className="text-gray-900">Not yet when</strong>
          <p className="mt-1">{detail.notYet}</p>
        </div>
      </div>

      <div className={btnRow}>
        <a
          className={buttonPrimary}
          href={buildConversationContactHref(routeId, { from })}
          data-track="conversation_path_primary"
          data-route={detail.analyticsKey}
        >
          {detail.ctaLabel}
        </a>
        {firstPrep ? (
          <a
            className={buttonSecondary}
            href={firstPrep.href}
            data-track="conversation_path_prep"
            data-route={detail.analyticsKey}
          >
            {firstPrep.label}
          </a>
        ) : null}
        {secondPrep ? (
          <a
            className={buttonSecondary}
            href={secondPrep.href}
            data-track="conversation_path_prep"
            data-route={detail.analyticsKey}
          >
            {secondPrep.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}
