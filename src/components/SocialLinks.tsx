import type { SocialBlock } from "@/lib/content";

export default function SocialLinks({ social }: { social?: SocialBlock }) {
  if (!social || (!social.instagramUrl && !social.youtubeUrl)) return null;

  return (
    <div className="card">
      <strong>Related social</strong>
      <p style={{ marginTop: 8, color: "var(--muted)" }}>
        Social posts are supporting context. The written guide on this page is the primary answer.
      </p>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {social.youtubeUrl ? (
          <a className="pill" href={social.youtubeUrl} target="_blank" rel="noreferrer" data-track="social_youtube_open">
            YouTube link
          </a>
        ) : null}
        {social.instagramUrl ? (
          <a className="pill" href={social.instagramUrl} target="_blank" rel="noreferrer" data-track="social_instagram_open">
            Instagram post
          </a>
        ) : null}
      </div>
    </div>
  );
}
