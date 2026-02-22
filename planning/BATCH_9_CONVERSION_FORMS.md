# Batch 9 — Conversion + attribution (no directories)

This batch implements the “request an introduction” workflow and clean attribution without turning the site into a tracking monster.

## What shipped

### 1) Contact form (with email fallback)
- `/contact` now includes a real form.
- Anti-spam:
  - honeypot field
  - basic per-IP rate limiting (in-memory)
- If delivery is not configured, the UI falls back to “Email instead”.

Delivery options (choose ONE):
- Webhook: `CONTACT_WEBHOOK_URL`
- Resend email: `RESEND_API_KEY`, plus `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`

### 2) Attribution capture (UTM cookies)
- Middleware captures: `utm_*`, `gclid`, `fbclid`
- Stored as cookies for 30 days:
  - `mtb_utm_source`, `mtb_utm_medium`, `mtb_utm_campaign`, `mtb_utm_term`, `mtb_utm_content`
  - `mtb_gclid`, `mtb_fbclid`
  - `mtb_first_landing`, `mtb_first_seen`

### 3) Partner redirect preserves inbound campaign info
- `/go/[slug]` keeps stable partner UTMs and appends inbound attribution using `mtb_in_*` params.
- Also logs a minimal server-side record (no personal data).

## Key files
- `src/middleware.ts`
- `src/lib/attribution.ts`
- `src/app/api/contact/route.ts`
- `src/components/ContactForm.tsx`
- `src/app/contact/page.tsx`
- `src/app/go/[slug]/route.ts`
