import type { VideoBlock as VideoBlockType } from "@/lib/content";
import { loadTranscript } from "@/lib/transcripts";
import { getSite } from "@/lib/site";
import {
  badgeAccent,
  badgeGood,
  btnRow,
  buttonPrimary,
  buttonSecondary,
  cardCls,
  pill,
} from "@/components/ui/styles";

function badgeForPermission(p: VideoBlockType["permission"]) {
  if (p === "owned") return { text: "Owned video", cls: badgeGood };
  if (p === "licensed") return { text: "Licensed use", cls: badgeAccent };
  return { text: "Used with permission", cls: badgeAccent };
}

export default function VideoBlock({ video }: { video: VideoBlockType }) {
  const site = getSite();
  const transcript = loadTranscript(video);

  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}`;

  const permission = badgeForPermission(video.permission);

  return (
    <div className={cardCls}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeGood}>Video</span>
          <span className={permission.cls}>{permission.text}</span>
        </div>
        <a
          className={pill}
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          data-track="video_watch_youtube"
          data-youtubeid={video.youtubeId}
        >
          Watch on YouTube
        </a>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={video.title || "YouTube video"}
            loading="lazy"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      {video.summary ? (
        <div className="mt-6">
          <strong className="text-sm font-semibold text-gray-900">Summary</strong>
          <p className="mt-3 text-sm leading-6 text-gray-600">{video.summary}</p>
        </div>
      ) : null}

      {transcript ? (
        <div className="mt-6">
          <details className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900">
              Transcript <span className="font-normal text-gray-600">(click to expand)</span>
            </summary>
            <div id="transcript" className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {transcript}
            </div>
          </details>
        </div>
      ) : (
        <div className="mt-6 text-sm leading-6 text-gray-600">
          <em>No transcript added yet.</em> To follow the site standard, add either <code>video.transcript</code> or <code>video.transcriptFile</code>.
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <strong className="text-sm font-semibold text-gray-900">Next step</strong>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          If your family is considering Bali, start with the roadmap, then follow the pillar that matches your stage.
        </p>
        <div className={btnRow}>
          <a className={buttonPrimary} href={video.ctaHref || site.ctas.primary.href} data-track="video_cta_primary">
            {video.ctaText || site.ctas.primary.text}
          </a>
          <a
            className={buttonSecondary}
            href={site.ctas.empathy.href}
            target="_blank"
            rel="noreferrer"
            data-track="video_cta_empathy"
          >
            {site.ctas.empathy.text}
          </a>
        </div>
      </div>
    </div>
  );
}
