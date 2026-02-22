# Batch 13 — Areas UX improvements (comparison + fit guides)

## What this batch adds
- A lightweight “Quick compare” table on `/areas` (based on optional front matter metadata)
- An “At a glance” block on each area page (pace/traffic/walkability/family-fit, etc.)
- Three fit guides to help families choose an area by life stage:
  - `/guides/bali-areas-for-toddlers`
  - `/guides/bali-areas-for-teens`
  - `/guides/quiet-nature-areas-in-bali`

## How the comparison table works
Each area markdown file can include an `area:` object in front matter:

```yaml
area:
  pace: "Moderate"
  traffic: "Medium"
  walkability: "Low"
  familyFit: "High"
  beachAccess: "High"
  natureAccess: "Low"
  noise: "Low"
  costTier: "Medium-High"
  note: "Short summary shown in the table."
```

All fields are optional. Missing values show as “—”.

### Editorial guidance
- Keep these values subjective and honest (“rough signals”, not guarantees).
- Don’t over-optimize—this is for shortlisting, then doing a test stay.
- Keep `note` short (one sentence).

## Where to edit
- Area pages: `content/areas/*.md`
- Areas hub UI: `src/app/areas/page.tsx`
- Table component: `src/components/AreasCompareTable.tsx`
- Area “At a glance”: `src/components/ContentLayout.tsx`

## QA checks
- Run:
  - `npm run validate:strict`
  - `npm run audit:review`
- The internal dashboard `/admin/review` also flags missing area metadata.
