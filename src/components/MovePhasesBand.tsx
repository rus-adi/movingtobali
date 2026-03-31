import Link from "next/link";
import type { HubPhase } from "@/lib/hub";
import { badgeAccent, cardCls, grid2 } from "@/components/ui/styles";

export default function MovePhasesBand({
  phases,
  compact = false,
}: {
  phases: HubPhase[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "grid gap-4" : grid2}>
      {phases.map((phase) => (
        <div key={phase.title} className={cardCls}>
          <div className={badgeAccent}>{phase.kicker}</div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{phase.title}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-700">{phase.body}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {phase.links.map((link) => (
              <Link
                key={`${phase.title}-${link.href}`}
                className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-white"
                href={link.href}
                data-track="move_phases_open_link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
