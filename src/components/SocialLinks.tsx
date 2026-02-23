import type { SocialBlock } from "@/lib/content";
import { cardCls, pill } from "@/components/ui/styles";

export default function SocialLinks({ social }: { social?: SocialBlock }) {
  if (!social || (!social.instagramUrl && !social.youtubeUrl)) return null;

  return (
    <div className={cardCls}>
      <strong className="text-sm font-semibold text-gray-900">Related social</strong>
      <p className="mt-3 text-sm leading-6 text-gray-600">
        Social posts are supporting context. The written guide on this page is the primary answer.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {social.youtubeUrl ? (
          <a className={pill} href={social.youtubeUrl} target="_blank" rel="noreferrer" data-track="social_youtube_open">
            YouTube link
          </a>
        ) : null}
        {social.instagramUrl ? (
          <a className={pill} href={social.instagramUrl} target="_blank" rel="noreferrer" data-track="social_instagram_open">
            Instagram post
          </a>
        ) : null}
      </div>
    </div>
  );
}
