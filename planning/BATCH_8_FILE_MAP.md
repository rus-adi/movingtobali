# Batch 8 — File map (what changed / added)

## New / updated front matter fields

- `video` (object)
- `social` (object)
- `faqs` (array of {q,a}) — used by /faq hub

## Key implementation files

- `src/components/VideoBlock.tsx`
  - YouTube embed
  - Summary
  - Transcript (inline or file)
  - CTA under video
  - Tracking attributes (`data-track=...`)

- `src/components/SocialLinks.tsx`
  - Lightweight social links (no heavy embeds)

- `src/lib/transcripts.ts`
  - Loads transcript from `video.transcript` or `video.transcriptFile`
  - Truncates transcript for JSON-LD safely

- `src/lib/schema.ts`
  - Adds `VideoObject` schema when `video` exists
  - Adds `Article` / `BlogPosting` schemas

- `src/lib/content.ts`
  - Parses `video`, `social`, and `faqs` from front matter

- `scripts/validate-content.mjs`
  - Ensures required fields
  - Enforces video permission + consent policy
  - Ensures published videos have transcript (or transcriptFile exists)

## Demo content

- `content/blog/video-how-we-run-a-school-tour.md`
- `content/transcripts/video-how-we-run-a-school-tour.txt`

Replace the placeholder YouTube/Instagram IDs before indexing.
