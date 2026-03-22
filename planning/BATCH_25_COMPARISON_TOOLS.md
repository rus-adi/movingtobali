# Batch 25 — comparison tools

## Goal

Make the site feel bigger through stronger decision support, not more filler.

This batch focuses on the moment when families already have good options but still need to compare tradeoffs clearly.

## What this batch adds

### New interactive tools
- `/compare-areas`
- `/commute-reality`
- `src/components/AreaCompareTool.tsx`
- `src/components/CommuteRealityChecker.tsx`
- `src/lib/areaDecision.ts`

### New comparison pages
- `/test-stay-vs-full-move`
- `/housing-style-compare`

### New guides
- `/guides/how-to-compare-two-bali-areas-with-kids`
- `/guides/when-commute-friction-changes-the-whole-move`
- `/guides/how-to-choose-between-a-test-stay-and-a-full-move`

### New resources
- `/resources/two-area-comparison-sheet`
- `/resources/empathy-school-commute-decision-grid`
- `/resources/housing-style-comparison-grid`

## Wiring updates

- homepage now surfaces a comparison-tools cluster
- `Plan Your Move` includes the new comparison lane
- `Decision Checklists` includes a side-by-side decision cluster
- `Areas` and `Area Match` route families into comparison and commute testing sooner
- `Contact` area+budget flows now surface comparison tools before sending
- footer, sitemap, and nav active states support the new routes
- `Start Here`, `Areas`, `Housing`, and `Empathy School` content now point into the new comparison tools

## Strategic reason

Area decisions, school route decisions, housing timing, and move-shape choices are where families often circle too long.

This batch adds tools that make those tradeoffs visible:
- compare two areas
- test whether commute is the hidden problem
- compare a test stay against a bigger commitment
- compare housing styles before listing noise takes over

The result should be a site that feels more like a family relocation system and less like a strong but linear content library.
