# Video workflow (publishing standard)

Goal: a video can enhance trust and conversion, but the **page must stand alone** for SEO + accessibility.

## Minimum standard for a published video page

1) Written answer on-page (intro + key points)
2) Video embed
3) Short summary (1–3 sentences)
4) Transcript or detailed recap
5) Clear next-step CTA under the video
6) VideoObject schema output automatically (handled by code)

## Permissions + consent

Before publishing:

- Only publish videos you **own** or have **permission** to embed on your site.
- If children appear:
  - confirm parent/guardian consent
  - set `video.childrenVisible: true`
  - set `video.consentConfirmed: true`
  - avoid full names / identifying details in transcript

## Creating a new video post

```bash
npm run new:video-post -- "Title" --youtubeId=XXXXXXXXXXX --permission=owned
```

This creates:
- `content/blog/<slug>.md` (draft + noindex by default)
- `content/transcripts/<slug>.txt` (placeholder transcript)

Then:
- paste a real transcript (or write a detailed recap)
- write the on-page answer first
- switch `draft: false` and `noindex: false` when ready

## Lightweight social links

If you reference Instagram:
- include it as a supporting link
- do not make the page dependent on the embed
- keep the written answer primary
