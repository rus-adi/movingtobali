# Launch Checklist (quick)

## Content
- [ ] No drafts on production build (run `npm run audit:review:strict`).
- [ ] Visa/housing pages updated within last 30 days (or clearly labeled with dates).
- [ ] Each public page has at least 3 FAQs (or includes a video + a strong checklist).
- [ ] No broken internal links (dashboard + audit script).

## Trust
- [ ] Official links verified recently (run `npm run check:official-links`).
- [ ] `/privacy`, `/terms`, `/disclosure`, `/about` reviewed and accurate.
- [ ] Partner disclosures visible on partner-heavy pages.
- [ ] “★ CHECK” partners hidden in production (already enforced in code).

## Analytics & attribution
- [ ] GA4 and/or Plausible configured (env vars).
- [ ] Contact delivery configured: webhook or Resend (env vars).

## Technical
- [ ] `npm run validate:strict`
- [ ] `npm run build`
- [ ] Check sitemap output includes new pages (privacy/terms/about/disclosure).
- [ ] Verify robots meta on `/admin/review` is noindex.

Last updated: 2026-02-22
