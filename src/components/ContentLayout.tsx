import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import type { TocItem } from "@/lib/markdown";
import VideoBlock from "@/components/VideoBlock";
import SocialLinks from "@/components/SocialLinks";
import Toc from "@/components/Toc";
import DisclosureNotice from "@/components/DisclosureNotice";
import SafetyNotice from "@/components/SafetyNotice";
import { getSite } from "@/lib/site";

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
  const href = routeFor(item);

  const dateLabel = item.date ? new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";
  const updatedLabel = item.updated ? new Date(item.updated).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <main>
      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Link className="badge" style={{ textDecoration: "none" }} href="/">
              ← Home
            </Link>
            {item.kind !== "pillars" ? (
              <Link className="badge" style={{ textDecoration: "none" }} href={`/${item.kind}`}>
                {item.kind}
              </Link>
            ) : (
              <span className="badge">pillar</span>
            )}
            {item.category ? <span className="badge accent">{item.category}</span> : null}
            {dateLabel ? <span className="badge">{dateLabel}</span> : null}
            {updatedLabel ? <span className="badge">Updated: {updatedLabel}</span> : null}
            <span className="badge">{item.readingTimeMinutes} min read</span>
            {item.video?.youtubeId ? <span className="badge good">video</span> : null}
          </div>

          <h1 className="h1">{item.title}</h1>
          
<p className="lead" style={{ maxWidth: 980 }}>{item.description}</p>

{item.kind === "areas" && item.area && Object.values(item.area).some((v) => String(v || "").trim()) ? (
  <div className="card" style={{ marginTop: 16 }}>
    <strong>At a glance</strong>
    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
      {item.area.pace ? <span className="badge">Pace: {item.area.pace}</span> : null}
      {item.area.traffic ? <span className="badge">Traffic: {item.area.traffic}</span> : null}
      {item.area.walkability ? <span className="badge">Walkability: {item.area.walkability}</span> : null}
      {item.area.familyFit ? <span className="badge good">Family fit: {item.area.familyFit}</span> : null}
      {item.area.beachAccess ? <span className="badge">Beach: {item.area.beachAccess}</span> : null}
      {item.area.natureAccess ? <span className="badge">Nature: {item.area.natureAccess}</span> : null}
      {item.area.costTier ? <span className="badge accent">Cost: {item.area.costTier}</span> : null}
      {item.area.noise ? <span className="badge">Noise: {item.area.noise}</span> : null}
    </div>
    {item.area.note ? (
      <p style={{ marginTop: 10, color: "var(--muted)" }}>{item.area.note}</p>
    ) : null}
  </div>
) : null}

{item.tags?.length ? (

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {item.tags.map((t) => (
                <Link key={t} className="pill" href={item.kind === "pillars" ? `/search?q=${encodeURIComponent(t)}` : `/${item.kind}/tag/${encodeURIComponent(t)}`}>
                  #{t}
                </Link>
              ))}
            </div>
          ) : null}

          {primaryPillar ? (
            <div style={{ marginTop: 12 }}>
              <Link
                className="badge good"
                style={{ textDecoration: "none" }}
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

      <section style={{ padding: "0 0 56px 0" }}>
        <div className="container">
          {showSafety(item) ? (
            <div style={{ marginBottom: 18 }}>
              <SafetyNotice kind={showSafety(item)!} />
            </div>
          ) : null}

          {showDisclosure(item) ? (
            <div style={{ marginBottom: 18 }}>
              <DisclosureNotice compact />
            </div>
          ) : null}

          {item.video ? (
            <div style={{ marginBottom: 18 }}>
              <VideoBlock video={item.video} />
            </div>
          ) : null}

          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="card">
              <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            </div>

            <div style={{ display: "grid", gap: 18 }}>
              <Toc toc={toc} />
              <SocialLinks social={item.social} />

              <div className="card">
                <strong>Next steps</strong>
                <p style={{ marginTop: 8, color: "var(--muted)" }}>
                  If you’re new to the idea, follow the roadmap. If you’re already committed, jump into visas, housing, and areas.
                </p>
                <div className="btnRow">
                  <a className="button primary" href={site.ctas.primary.href} data-track="content_next_start">{site.ctas.primary.text}</a>
                  <a className="button secondary" href={site.ctas.secondary.href} data-track="content_next_contact">{site.ctas.secondary.text}</a>
                  <a className="button secondary" href={site.ctas.empathy.href} target="_blank" rel="noreferrer" data-track="content_next_empathy">{site.ctas.empathy.text}</a>
                </div>
              </div>
            </div>
          </div>

          {related.length ? (
            <div style={{ marginTop: 26 }}>
              <h2 className="h2">Related</h2>
              <div className="grid2" style={{ marginTop: 12 }}>
                {related.map((r) => (
                  <div key={r.slug} className="card">
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                      <span className="badge">{r.kind}</span>
                      {r.category ? <span className="badge accent">{r.category}</span> : null}
                    </div>
                    <h3 style={{ marginTop: 12, marginBottom: 8 }}>{r.title}</h3>
                    <p style={{ marginTop: 0, color: "var(--muted)" }}>{r.description}</p>
                    <div className="btnRow">
                      <Link className="button primary" href={routeFor(r)} data-track="related_open" data-kind={r.kind} data-slug={r.slug}>
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