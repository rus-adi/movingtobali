# Schema checklist

This project outputs JSON-LD via `src/lib/schema.ts`.

## Global schemas (site-wide)

- Organization
- WebSite (with SearchAction)
- WebPage
- BreadcrumbList

## Content schemas

- Blog posts: BlogPosting
- Guides/resources/areas: Article
- Pages with `video`: VideoObject (plus transcript text, truncated for JSON-LD)

## VideoObject requirements

When a page includes `video` front matter:
- youtubeId
- summary
- permission (owned | licensed | permission)
- transcript or transcriptFile (required for *published* pages)

## Validating

Run:

```bash
npm run validate
npm run validate:strict
```

Strict mode is meant for pre-launch / CI.
