import type { SocialBlock } from "@/lib/content";
import { cardCls, pill } from "@/components/ui/styles";

export default function SocialLinks({ social }: { social?: SocialBlock }) {
  if (!social) return null;

  const youtube = [
    ...(Array.isArray(social.youtube) ? social.youtube : []),
    ...(social.youtubeUrl ? [{ url: social.youtubeUrl, label: "YouTube link" }] : []),
  ].filter((x) => x && x.url);

  const instagram = [
    ...(Array.isArray(social.instagram) ? social.instagram : []),
    ...(social.instagramUrl ? [{ url: social.instagramUrl, label: "Instagram post" }] : []),
  ].filter((x) => x && x.url);

  if (!youtube.length && !instagram.length) return null;

  return (
    <div className={cardCls}>
      <strong className="text-sm font-semibold text-gray-900">Related social</strong>
      <p className="mt-3 text-sm leading-6 text-gray-600">
        Social posts are supporting context. The written guide on this page is the primary answer.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {youtube.map((x) => (
          <a
            key={`yt:${x.url}`}
            className={pill}
            href={x.url}
            target="_blank"
            rel="noreferrer"
            data-track="social_youtube_open"
          >
            {x.label || "YouTube"}
          </a>
        ))}

        {instagram.map((x) => (
          <a
            key={`ig:${x.url}`}
            className={pill}
            href={x.url}
            target="_blank"
            rel="noreferrer"
            data-track="social_instagram_open"
          >
            {x.label || "Instagram"}
          </a>
        ))}
      </div>
    </div>
  );
}
