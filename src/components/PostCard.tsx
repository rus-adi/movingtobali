import Link from "next/link";
import type { ContentItem } from "@/lib/content";

function routeFor(item: ContentItem): string {
  if (item.kind === "pillars") return `/${item.slug}`;
  return `/${item.kind}/${item.slug}`;
}

export default function PostCard({ item }: { item: ContentItem }) {
  const href = routeFor(item);
  return (
    <div className="card">
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span className="badge">{item.kind === "pillars" ? "Pillar" : item.kind}</span>
        {item.category ? <span className="badge accent">{item.category}</span> : null}
        {item.date ? <span className="badge">{item.date}</span> : null}
        {item.readingTimeMinutes ? <span className="badge">{item.readingTimeMinutes} min</span> : null}
        {item.video?.youtubeId ? <span className="badge good">Video</span> : null}
      </div>

      <h3 style={{ marginTop: 12, marginBottom: 8 }}>{item.title}</h3>
      <p style={{ marginTop: 0, color: "var(--muted)" }}>{item.description}</p>

      <div className="btnRow">
        <Link className="button primary" href={href} data-track="card_open" data-kind={item.kind} data-slug={item.slug}>
          Read
        </Link>
        {item.kind !== "pillars" ? (
          <Link className="button secondary" href={`/${item.kind}`} data-track="card_back_to_index" data-kind={item.kind}>
            View all
          </Link>
        ) : null}
      </div>
    </div>
  );
}
