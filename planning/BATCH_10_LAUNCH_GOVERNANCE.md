# Batch 10 — Launch & Governance (Legal + Editorial QA + Brand tokens)

This batch focuses on *launch readiness* and *operational hygiene*.

## What shipped

### 1) Legal / trust pages (SEO-friendly)
- `/about` — purpose, editorial policy, Empathy School connection, partner policy
- `/disclosure` — partner links + badge meanings + editorial independence
- `/privacy` — what data is collected (forms, analytics, attribution), how it’s used
- `/terms` — terms of use + disclaimers (not legal/immigration advice)

All pages are simple, readable, and internal-link to the rest of the site.

### 2) Internal review dashboard (noindex)
- `/admin/review` — a noindex internal dashboard that flags:
  - Draft/noindex pages
  - Stale pages (visa/housing pages older than 30 days; others older than ~6 months)
  - Thin content (no video, <3 FAQs, <350 words)
  - Pages missing FAQs
  - Broken internal links (links to routes that don’t exist)

### 3) CLI audit script
- `npm run audit:review`
- `npm run audit:review:strict` (exits non-zero if anything is flagged)

### 4) Brand tokens + warmer UI baseline
- Added `src/app/theme.css` for brand tokens (colors, surfaces, border, etc.)
- Updated `src/app/globals.css` to use the tokens and provide consistent form styling.

> To match Empathy School exactly, update the hex tokens in `src/app/theme.css`.

### 5) Improved “visa/housing” safety notice
- New `SafetyNotice` component automatically appears on Visa/Housing related pages (based on slug).
- Links users to `/official-links` and `/contact`.

### 6) Footer/nav polish
- Added footer links to About, Disclosure, Privacy, Terms.
- Added Partners + Contact links in the top navigation.

## Notes
- `/admin/review` is intentionally not in the sitemap and has `robots: noindex, nofollow`.
- We did **not** add schools/camps directories or templates.
- This is not legal advice; treat these pages as reasonable defaults and have counsel review if needed.

Last updated: 2026-02-22
