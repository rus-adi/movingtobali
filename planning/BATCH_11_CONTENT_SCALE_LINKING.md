# Batch 11 — Content Scale + Internal Linking

## What we shipped in this batch

### 1) Cross-site “Recommended reading” (stronger internal links)
- Added a cross-kind recommendation engine in `src/lib/content.ts`:
  - `getRecommendedFor(item, limit)` returns a **primary pillar** + a **mixed set** of recommended pages (pillars/guides/areas/resources/blog) based on tags + category.
  - Production caching in `getAllContent()` to keep builds fast as you add daily blog posts.
- Updated all content templates to use the new logic:
  - `src/app/[slug]/page.tsx` (pillars)
  - `src/app/guides/[slug]/page.tsx`
  - `src/app/areas/[slug]/page.tsx`
  - `src/app/resources/[slug]/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
- Updated `ContentLayout` to show a “Pillar:” badge link at the top of each content page, when available.

### 2) Area expansion + meaningful area categories
- Added 8 new area pages:
  - Seminyak, Umalas, Kerobokan, Seseh, Denpasar, Renon, Sidemen, Amed
- Updated existing area pages to use **regional categories** (instead of one generic category).
- Added `areas` + `neighborhoods` tags to **all** area pages for better discovery and recommendations.

### 3) New high-intent guides (no directories)
Added 11 new guides focused on family logistics and decision-making:
- Arrival checklist (eVOA / Arrival Card / tourist levy)
- 2-week test stay plan
- Family transport: drivers/scooters/cars
- Safety basics for families
- Health insurance decision framework
- Phones + internet setup
- Banking + payments
- Groceries + meal routines
- Packing list for kids
- Ubud vs Sanur vs Canggu comparison
- Lease + deposit questions checklist (guide)

### 4) New resources (copy/paste)
Added 3 resources:
- Arrival folder checklist
- Lease + deposit checklist
- Family transport plan worksheet

### 5) Pillar pages now link to the new deep-dives
Appended “Deep dives (recommended)” sections to:
- Start here, Visas, Housing, Family life, Costs

### 6) QA updates
- Admin review dashboard and CLI audit now flag pages with “Few internal links (<2)” to encourage stronger internal linking as you publish.

## Notes / guardrails we followed
- No school/camp directories or listing templates were added.
- Visa/entry content is framed as a checklist with explicit “verify via official portals” guidance.

## Suggested Batch 12 (next)
1) Editorial system hardening
- Blog post “front matter defaults” + a script to create new posts quickly (slug, date, tags, FAQs template).
- Optional: auto-generate “related links” section inside markdown at publish time (so it’s visible even without the UI block).

2) Area UX improvements
- Add optional area attributes (pace/traffic/walkability) to front matter and show a simple comparison table on `/areas`.
- Add an “Area comparison” guide template for easy publishing.

3) Trust + compliance improvements
- Add “Last verified” stamps and a lightweight link-check script for `/official-links`.
