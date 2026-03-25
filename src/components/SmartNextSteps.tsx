import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { buttonPrimary, buttonSecondary, cardCls, badgeAccent, badge } from "@/components/ui/styles";
import { getSmartActionGroup } from "@/lib/nextCtas";

export default function SmartNextSteps({ item }: { item: ContentItem }) {
  const group = getSmartActionGroup(item);

  return (
    <section className="grid gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Next best steps</span>
          <span className={badge}>CTA intelligence</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{group.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">{group.lead}</p>
      </div>

      <div className="grid gap-4">
        {group.actions.map((action) => {
          const className = action.variant === "primary" ? buttonPrimary : buttonSecondary;
          return (
            <div key={`${action.label}-${action.href}`} className={cardCls}>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{action.slot === "conversation" ? "Conversation" : action.slot === "primary" ? "Do this next" : "Pair with this"}</div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900">{action.label}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">{action.body}</p>
              <div className="mt-6">
                <Link
                  href={action.href}
                  className={className}
                  data-track="smart_next_step_click"
                  data-sourcekind={item.kind}
                  data-sourceslug={item.slug}
                  data-slot={action.slot}
                  data-routeid={action.routeId || ""}
                  data-destination={action.href}
                >
                  {action.label}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
