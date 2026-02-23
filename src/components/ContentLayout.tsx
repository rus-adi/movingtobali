import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import type { TocItem } from "@/lib/markdown";
import VideoBlock from "@/components/VideoBlock";
import SocialLinks from "@/components/SocialLinks";
import Toc from "@/components/Toc";
import RichText from "@/components/RichText";
import DisclosureNotice from "@/components/DisclosureNotice";
import SafetyNotice from "@/components/SafetyNotice";
import { getSite } from "@/lib/site";
import {
  badge,
  badgeAccent,
  badgeGood,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  grid2,
  pill,
} from "@/components/ui/styles";

function routeFor(item: ContentItem): string {
  if (item.kind === "pillars") return `/${item.slug}`;
  return `/${item.kind}/${item.slug}`;
}

function showDisclosure(item: ContentItem): boolean {
  const key = `${item.kind}:${item.slug}`.toLowerCase();
  if (key.includes("visas") || key.includes("visa")) return true;
  if (key.includes("housing") || key.includes("rent")) return true;
  if (key.includes("partners")) return true;
  return false;
}

function showSafety(item: ContentItem): "visa" | "housing" | null {
  const key = `${item.kind}:${item.slug}`.toLowerCase();
  if (key.includes("visa") || key.includes("visas")) return "visa";
  if (key.includes("housing") || key.includes("rent")) return "housing";
  return null;
}

export default function ContentLayout({
  item,
  toc,
  html,
  related,
  primaryPillar,
}: {
  item: ContentItem;
  toc: TocItem[];
  html: string;
  related: ContentItem[];
  primaryPillar?: ContentItem | null;
}) {
  const site = getSite();

  const dateLabel = item.date
    ? new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";
  const updatedLabel = item.updated
    ? new Date(item.updated).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <main>
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="flex flex-wrap items-center gap-2">
            <Link className={badge} href="/">
              ← Home
            </Link>
            {item.kind !== "pillars" ? (
              <Link className={badge} href={`/${item.kind}`}>
                {item.kind}
              </Link>
            ) : (
              <span className={badge}>pillar</span>
            )}
            {item.category ? <span className={badgeAccent}>{item.category}</span> : null}
            {dateLabel ? <span className={badge}>{dateLabel}</span> : null}
            {updatedLabel ? <span className={badge}>Updated: {updatedLabel}</span> : null}
            <span className={badge}>{item.readingTimeMinutes} min read</span>
            {item.video?.youtubeId ? <span className={badgeGood}>video</span> : null}
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {item.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">{item.description}</p>

          {item.kind === "areas" && item.area && Object.values(item.area).some((v) => String(v || "").trim()) ? (
            <div className={`${cardCls} mt-6`}>
              <strong className="text-sm font-semibold text-gray-900">At a glance</strong>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.area.pace ? <span className={badge}>Pace: {item.area.pace}</span> : null}
                {item.area.traffic ? <span className={badge}>Traffic: {item.area.traffic}</span> : null}
                {item.area.walkability ? <span className={badge}>Walkability: {item.area.walkability}</span> : null}
                {item.area.familyFit ? <span className={badgeGood}>Family fit: {item.area.familyFit}</span> : null}
                {item.area.beachAccess ? <span className={badge}>Beach: {item.area.beachAccess}</span> : null}
                {item.area.natureAccess ? <span className={badge}>Nature: {item.area.natureAccess}</span> : null}
                {item.area.costTier ? <span className={badgeAccent}>Cost: {item.area.costTier}</span> : null}
                {item.area.noise ? <span className={badge}>Noise: {item.area.noise}</span> : null}
              </div>
              {item.area.note ? <p className="mt-4 text-sm leading-6 text-gray-600">{item.area.note}</p> : null}
            </div>
          ) : null}

          {item.tags?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {item.tags.map((t) => (
                <Link
                  key={t}
                  className={pill}
                  href={item.kind === "pillars" ? `/search?q=${encodeURIComponent(t)}` : `/${item.kind}/tag/${encodeURIComponent(t)}`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          ) : null}

          {primaryPillar ? (
            <div className="mt-4">
              <Link
                className={badgeGood}
                href={`/${primaryPillar.slug}`}
                data-track="content_primary_pillar"
                data-pillar={primaryPillar.slug}
              >
                Pillar: {primaryPillar.title}
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {showSafety(item) ? (
            <div className="mb-6">
              <SafetyNotice kind={showSafety(item)!} />
            </div>
          ) : null}

          {showDisclosure(item) ? (
            <div className="mb-6">
              <DisclosureNotice compact />
            </div>
          ) : null}

          {item.video ? (
            <div className="mb-6">
              <VideoBlock video={item.video} />
            </div>
          ) : null}

          <div className={`${grid2} items-start`}>
            <div className={cardCls}>
              <RichText html={html} />
            </div>

            <div className="grid gap-6">
              <Toc toc={toc} />
              <SocialLinks social={item.social} />

              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">Next steps</strong>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  If you’re new to the idea, follow the roadmap. If you’re already committed, jump into visas, housing, and areas.
                </p>
                <div className={btnRow}>
                  <a className={buttonPrimary} href={site.ctas.primary.href} data-track="content_next_start">
                    {site.ctas.primary.text}
                  </a>
                  <a className={buttonSecondary} href={site.ctas.secondary.href} data-track="content_next_contact">
                    {site.ctas.secondary.text}
                  </a>
                  <a
                    className={buttonSecondary}
                    href={site.ctas.empathy.href}
                    target="_blank"
                    rel="noreferrer"
                    data-track="content_next_empathy"
                  >
                    {site.ctas.empathy.text}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {related.length ? (
            <div className="mt-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Related</h2>
              <div className={`${grid2} mt-8`}>
                {related.map((r) => (
                  <div key={r.slug} className={cardCls}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={badge}>{r.kind}</span>
                      {r.category ? <span className={badgeAccent}>{r.category}</span> : null}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">{r.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{r.description}</p>
                    <div className={btnRow}>
                      <Link
                        className={buttonPrimary}
                        href={routeFor(r)}
                        data-track="related_open"
                        data-kind={r.kind}
                        data-slug={r.slug}
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
