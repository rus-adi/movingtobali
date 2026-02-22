import fs from "fs";
import path from "path";
import type { VideoBlock } from "@/lib/content";

/**
 * Load a transcript either from front matter (`video.transcript`) or from a file (`video.transcriptFile`).
 * Transcript files should live in `content/transcripts/`.
 */
export function loadTranscript(video?: VideoBlock): string {
  if (!video) return "";
  if (video.transcript && String(video.transcript).trim()) return String(video.transcript).trim();

  if (video.transcriptFile) {
    const rel = String(video.transcriptFile).replace(/^\//, "");
    const fp = path.join(process.cwd(), rel);
    if (fs.existsSync(fp)) {
      return fs.readFileSync(fp, "utf8").trim();
    }
  }
  return "";
}

export function truncateForSchema(text: string, maxChars = 4500): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars - 3) + "...";
}
