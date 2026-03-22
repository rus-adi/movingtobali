# Batch 21 — daily life system

## Goal

Make the site feel more substantial by turning day-to-day Bali life into a clearer system:
- a stronger daily-life pillar,
- a weekday-reality tool,
- practical guides for the ordinary week,
- smaller planning resources families can actually use.

## Why this batch matters

A lot of families do not need more inspiration.
They need help answering a harder question:

**Will Bali still feel good once it becomes normal life?**

That question lives in:
- mornings,
- commutes,
- food,
- rainy days,
- sick days,
- after-school energy,
- repeated weekly rhythms.

## What shipped

### Structure
- `content/pillars/daily-life.md` now becomes the main daily-life pillar.
- `/family-life` becomes a redirect to `/daily-life` so older internal links do not die.
- new tool page: `/weekday-reality`
- new component: `src/components/WeekdayRealityBuilder.tsx`

### New guides
- `what-daily-life-in-bali-actually-feels-like-with-kids`
- `how-to-build-a-calm-weekday-rhythm-in-bali`
- `getting-sick-in-bali-with-kids`
- `rainy-season-routines-in-bali-with-kids`
- `after-school-rhythm-in-bali-for-families`

### New resources
- `weekday-reality-planner`
- `rainy-day-defaults-list`
- `after-school-rhythm-planner`
- `sick-day-plan-for-bali-families`

### Navigation + surfacing
- top navigation now points to **Daily Life**
- homepage surfaces the daily-life and weekday-reality path more clearly
- planning/checklist pages include the new daily-life entries

## UX principle

This batch is intentionally not a giant “things to do in Bali” expansion.
It is a **real life** expansion.
That should make the site feel more premium and more trustworthy.

## Follow-on recommendation

Batch 22 should deepen the housing ecosystem again:
- Gaia Group profile strength
- housing process education
- family housing styles
- stronger shortlist-to-intro flow
