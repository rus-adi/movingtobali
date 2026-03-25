import Link from "next/link";
import { badge, badgeAccent, buttonSecondary, cardCls } from "@/components/ui/styles";
import type { ScenarioVoice } from "@/lib/proof";

export default function ParentVoiceStrip({
  title = "What families tend to notice",
  lead = "These are composite family scenarios based on recurring patterns around the hub. They are not direct quoted testimonials.",
  voices,
  ctaHref,
  ctaLabel,
}: {
  title?: string;
  lead?: string;
  voices: ScenarioVoice[];
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="grid gap-6">
      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Composite family scenarios</span>
          <span className={badge}>Trust layer</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{lead}</p>
        {ctaHref && ctaLabel ? (
          <div className="mt-5">
            <Link className={buttonSecondary} href={ctaHref} data-track="proof_strip_open_hub">
              {ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4">
        {voices.map((voice) => (
          <div key={`${voice.familyType}-${voice.title}`} className={cardCls}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">{voice.familyType}</div>
            <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">{voice.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">{voice.note}</p>
            <p className="mt-4 text-sm leading-6 text-gray-900">
              <strong className="font-semibold">What changed:</strong> {voice.learn}
            </p>
            {voice.href ? (
              <div className="mt-6">
                <Link className="text-sm font-semibold text-gray-900" href={voice.href} data-track="proof_voice_open_story">
                  Read the related page →
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
