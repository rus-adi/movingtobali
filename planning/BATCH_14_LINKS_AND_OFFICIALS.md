# Batch 14 — Official links freshness + link checking

## Why
Visa/entry procedures change often. The hub stays trustworthy if we:
- Point to official portals for changing details
- Keep those links fresh and working

This batch adds:
- `lastVerified` + `reviewCadenceDays` to official links
- A link-check script with a report output
- QA hooks in the review dashboard + audit script

## What to run
- Fast: `npm run check:official-links`
- Update freshness after review: `npm run check:official-links:write`
- Full outbound scan: `npm run check:links`

## Where official links live
- `src/content/official-links.json`
- Page: `/official-links`

## QA hooks
- Dashboard: `/admin/review` flags stale official links
- CLI: `npm run audit:review` flags stale official links too
