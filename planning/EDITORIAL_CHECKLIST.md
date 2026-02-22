# Editorial checklist (before publishing)

## Content quality
- The first 2–5 paragraphs answer the question directly (no “fluff intro”).
- Includes at least one “useful asset”:
  - checklist, template, or copy/paste block
  - or a video + transcript/recap
  - or a “what to watch out for” section
- At least one “reality detail” (what surprised you / what took longer / what you’d do differently).

## Safety + trust (especially visas/housing)
- Uses “in our experience” language.
- Avoids guarantees (“always approved”, “never a problem”).
- Links to `/official-links` when relevant.
- Includes disclosure if partner CTAs exist.

## SEO basics
- Title is clear and matches intent.
- Description is specific (not generic).
- URL slug is readable.
- Has a TOC (H2/H3) if long.
- Includes internal links:
  - 1 pillar
  - 2 related pages
  - 1 conversion link

## Technical
- `draft: false`
- `noindex: false`
- No placeholders like `[NEEDS INPUT]`, `[ADD FAQ ...]`
- Run:
  - `npm run validate:strict`
  - `npm run audit:review` (recommended)
