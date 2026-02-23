import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { badge, badgeAccent, badgeGood, btnRow, buttonPrimary, buttonSecondary, cardCls } from "@/components/ui/styles";

function routeFor(item: ContentItem): string {
  if (item.kind === "pillars") return `/${item.slug}`;
  return `/${item.kind}/${item.slug}`;
}

export default function PostCard({ item }: { item: ContentItem }) {
  const href = routeFor(item);
  return (
    <div className={cardCls}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={badge}>{item.kind === "pillars" ? "Pillar" : item.kind}</span>
        {item.category ? <span className={badgeAccent}>{item.category}</span> : null}
        {item.date ? <span className={badge}>{item.date}</span> : null}
        {item.readingTimeMinutes ? <span className={badge}>{item.readingTimeMinutes} min</span> : null}
        {item.video?.youtubeId ? <span className={badgeGood}>Video</span> : null}
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">
        {item.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>

      <div className={btnRow}>
        <Link className={buttonPrimary} href={href} data-track="card_open" data-kind={item.kind} data-slug={item.slug}>
          Read
        </Link>
        {item.kind !== "pillars" ? (
          <Link className={buttonSecondary} href={`/${item.kind}`} data-track="card_back_to_index" data-kind={item.kind}>
            View all
          </Link>
        ) : null}
      </div>
    </div>
  );
}
