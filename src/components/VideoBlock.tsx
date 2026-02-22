import type { VideoBlock as VideoBlockType } from "@/lib/content";
import { loadTranscript } from "@/lib/transcripts";
import { getSite } from "@/lib/site";

function badgeForPermission(p: VideoBlockType["permission"]) {
  if (p === "owned") return { text: "Owned video", cls: "good" };
  if (p === "licensed") return { text: "Licensed use", cls: "accent" };
  return { text: "Used with permission", cls: "accent" };
}

export default function VideoBlock({ video }: { video: VideoBlockType }) {
  const site = getSite();
  const transcript = loadTranscript(video);

  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}`;

  const permission = badgeForPermission(video.permission);

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span className="badge good">Video</span>
          <span className={`badge ${permission.cls}`}>{permission.text}</span>
        </div>
        <a className="pill" href={watchUrl} target="_blank" rel="noreferrer" data-track="video_watch_youtube" data-youtubeid={video.youtubeId}>
          Watch on YouTube
        </a>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 14, border: "1px solid var(--border)" }}>
          <iframe
            src={embedUrl}
            title={video.title || "YouTube video"}
            loading="lazy"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      {video.summary ? (
        <div style={{ marginTop: 14 }}>
          <strong>Summary</strong>
          <p style={{ marginTop: 8, color: "var(--muted)" }}>{video.summary}</p>
        </div>
      ) : null}

      {transcript ? (
        <div style={{ marginTop: 12 }}>
          <details>
            <summary style={{ cursor: "pointer" }}>
              <strong>Transcript</strong> <span style={{ color: "var(--muted)" }}>(click to expand)</span>
            </summary>
            <div id="transcript" style={{ marginTop: 12, color: "var(--muted)", whiteSpace: "pre-wrap" }}>
              {transcript}
            </div>
          </details>
        </div>
      ) : (
        <div style={{ marginTop: 12, color: "var(--muted)" }}>
          <em>No transcript added yet.</em> To follow the site standard, add either <code>video.transcript</code> or <code>video.transcriptFile</code>.
        </div>
      )}

      <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
        <strong>Next step</strong>
        <p style={{ marginTop: 8, color: "var(--muted)" }}>
          If your family is considering Bali, start with the roadmap, then follow the pillar that matches your stage.
        </p>
        <div className="btnRow">
          <a className="button primary" href={video.ctaHref || site.ctas.primary.href} data-track="video_cta_primary">
            {video.ctaText || site.ctas.primary.text}
          </a>
          <a className="button secondary" href={site.ctas.empathy.href} target="_blank" rel="noreferrer" data-track="video_cta_empathy">
            {site.ctas.empathy.text}
          </a>
        </div>
      </div>
    </div>
  );
}
