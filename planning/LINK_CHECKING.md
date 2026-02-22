# Link checking (official links + outbound links)

This hub relies on a few **official portals** for the parts that change (visas/entry procedures). To keep trust high, we run a lightweight link check routinely.

## Commands

### Check official links only (fast)
```bash
npm run check:official-links
```

### Check official links and update lastVerified (after review)
```bash
npm run check:official-links:write
```

### Check all outbound links (slower)
```bash
npm run check:links
```

> Tip: If you see timeouts, reduce concurrency:
> `node scripts/check-links.mjs --all --concurrency=2`

## Outputs
After running, the script writes:
- `planning/link-check-report.json`
- `planning/link-check-report.md`

## How “lastVerified” works
Official links live in:
- `src/content/official-links.json`

Each link can have:
- `lastVerified` (YYYY-MM-DD)
- `reviewCadenceDays` (e.g., 30 for immigration/arrival)

The `/official-links` page displays these so families (and your team) can see freshness.

## Suggested cadence
- Immigration / arrival / levy links: review **monthly**
- Empathy School reference links: review **quarterly**
