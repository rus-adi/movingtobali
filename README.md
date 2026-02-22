# Moving to Bali with Kids (movingtobali.empathy.school)

A Next.js content hub for families relocating to Bali.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment variables

Create a `.env.local` file (optional):

```bash
# Recommended (for correct canonical URLs, sitemap, etc.)
NEXT_PUBLIC_SITE_URL=https://movingtobali.empathy.school

# Optional analytics
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

# Contact / intro form (optional)

This site includes a lightweight contact form at `/contact`.

By default, the form will **not** deliver anywhere until you configure one of these options:

```bash
# Option A (recommended): send to a webhook (Zapier / Make / custom endpoint)
CONTACT_WEBHOOK_URL=

# Option B: send email via Resend (requires domain verification)
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@empathy.school
CONTACT_FROM_EMAIL="Moving to Bali <hello@empathy.school>"
```

If not configured, the form will show an “Email instead” fallback.

## Content

All content lives in `/content`:

- `content/pillars` — pillar pages (served at `/{slug}` e.g., `/visas`)
- `content/areas` — area guides (`/areas/{slug}`)
- `content/guides` — guides (`/guides/{slug}`)
- `content/blog` — blog posts (`/blog/{slug}`)
- `content/resources` — templates / checklists (`/resources/{slug}`)
- `content/transcripts` — transcripts or detailed recaps referenced by video posts

## Content tools

Create new content:

```bash
npm run new:blog -- "Title"
npm run new:guide -- "Title"
npm run new:area -- "Title"
npm run new:resource -- "Title"
npm run new:video-post -- "Title" --youtubeId=XXXXXXXXXXX --permission=owned
npm run new:daily-blog -- "Learning in Bali: Title" --pillar=start-here --area=sanur
npm run suggest:links -- blog your-post-slug
```

Validate content:

```bash
npm run validate
npm run validate:strict
```

## Notes

- The public site should only show VERIFIED/OWNED partners. “★ CHECK” partners remain hidden in production by default.
- This is not legal/immigration advice. Always confirm changing requirements via official portals.
# movingtobali
