# Batch 12 — Editorial tooling for daily publishing

This batch focuses on **speed + consistency** for daily posting, without adding heavy CMS complexity.

## What’s included
- `npm run new:daily-blog -- "Title"` (daily blog template optimized for families + learning)
- Improved `new:blog/new:guide/new:area/new:resource` templates:
  - optional FAQ placeholders (flagged by validator until you replace/remove)
  - safe defaults (`draft: true`, `noindex: true`)
- `npm run suggest:links -- <kind> <slug>` to generate a “Next steps” internal linking snippet

## Key editor workflow
1) Create:
   - Daily blog: `npm run new:daily-blog -- "Learning in Bali: …"`
   - Guide: `npm run new:guide -- "…"`
2) Write the **Quick take** first.
3) Add:
   - Checklist
   - 3–7 FAQs (or remove the FAQ block)
   - 3–6 internal links (pillar + 2 related pages + Empathy School)
4) When ready:
   - set `draft: false`
   - set `noindex: false`
5) Run:
   - `npm run validate:strict`
   - `npm run audit:review:strict` (optional)

## Internal linking rule of thumb
Every published page should include:
- 1 pillar link
- 2 related cluster links
- 1 conversion link (Empathy School or contact)

Use `npm run suggest:links -- kind slug` to generate options quickly.
