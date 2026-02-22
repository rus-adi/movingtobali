# Batch 8 — Video + Social integration + Schema upgrades

This batch implements the project-plan requirements for video publishing:

- Every embedded video includes:
  - an on-page written answer (the primary content)
  - a short summary
  - a transcript **or** a detailed recap
  - a clear next-step CTA under the video

- Video usage policy is enforced with front matter fields:
  - `video.permission`: `owned | licensed | permission`
  - If `video.childrenVisible: true`, then `video.consentConfirmed: true` is required

- JSON-LD schema upgrades:
  - pages with video now output **VideoObject** schema
  - blog/guides/resources/areas output Article/BlogPosting schema

- Social integration:
  - optional `social.instagramUrl` / `social.youtubeUrl` renders as **links** (not heavy embeds)
  - social is treated as “supporting context”; written content stays primary

## Front matter example

```yaml
video:
  youtubeId: "XXXXXXXXXXX"
  title: "Optional title override"
  summary: "1–3 sentences: what parents learn in the video."
  transcriptFile: "content/transcripts/your-file.txt"
  uploadDate: "2026-02-22"
  permission: "owned"
  childrenVisible: false
  consentConfirmed: false
  ctaText: "Start here"
  ctaHref: "/start-here"
social:
  youtubeUrl: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
  instagramUrl: "https://www.instagram.com/p/XXXXXXXX/"
```

## Where the code lives

- `src/components/VideoBlock.tsx` — the embed + summary + transcript + CTA
- `src/components/SocialLinks.tsx` — lightweight social links block
- `src/lib/schema.ts` — VideoObject schema (and other schemas)
- `src/lib/transcripts.ts` — transcript loading + schema-safe truncation
- `scripts/validate-content.mjs` — video policy validation
