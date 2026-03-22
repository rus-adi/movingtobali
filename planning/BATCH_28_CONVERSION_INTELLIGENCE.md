# Batch 28 — conversion intelligence

## Goal

Make the site better at routing families to the right next conversation without turning it into a pushy funnel.

This batch is not about adding louder CTAs.
It is about making the CTA match the decision that page or tool is already helping with.

## What landed

### New routing system
- `src/lib/conversion.ts`
- source-aware route mapping for:
  - planning
  - test stay
  - areas + budget
  - housing intro
  - Empathy School fit
- route metadata for prep links, best-when guidance, and cleaner analytics labels

### New components
- `src/components/ConversationPathCard.tsx`
- `src/components/SourceConversationPanel.tsx`

### New page
- `/conversation-paths`

This page turns contact into part of the planning system instead of leaving it as one generic endpoint.

### Contact flow upgrades
- `route` query param support
- source-aware preset selection based on `from`
- stronger “best route from here” explanation on `/contact`
- alternative-route logic when the current conversation feels too early
- better before-send links
- `ContactForm` now carries `routeId` and source context through submission
- API payload / email / webhook now include `routeId`

### Page-level CTA upgrades
Added `SourceConversationPanel` to key planning and decision pages, including:
- budget calculator
- area match
- compare areas
- commute reality
- move timeline
- housing intro readiness
- housing brief builder
- Empathy School fit
- Empathy School tour prep
- weekday reality
- first month planner
- plan your move

### Content additions
- `content/guides/which-conversation-should-you-start-with-for-your-bali-move.md`
- `content/guides/when-to-ask-for-a-gaia-group-intro.md`
- `content/guides/what-to-prepare-before-an-empathy-school-fit-conversation.md`
- `content/resources/contact-prep-notes-sheet.md`

### Navigation / indexing updates
- footer now links to `/conversation-paths`
- navbar active-state logic now treats `/conversation-paths` as part of the planning system
- sitemap includes `/conversation-paths`
- `Plan your move` now surfaces the new conversation-routing lane

## Why this matters

The site had become much larger and more useful, but a lot of pages still ended with broadly similar contact behavior.

This batch fixes that by making the next conversation depend on the actual decision lane:
- planning
- school
- housing
- area + budget
- test stay

That keeps the site feeling premium and practical instead of noisy.

## Guardrails used

1. Empathy School remains the only school actively promoted.
2. Gaia Group remains the only public housing partner.
3. Routing should reduce friction, not increase pressure.
4. Contact should stay calm and specific, not form-heavy.
5. Alternative routes matter — the right answer is sometimes “not this conversation yet.”

## Best next follow-on batch

Batch 29 should focus on technical/editorial governance:
- stale-content rules
- content-state flags
- selective noindex on weak or unfinished pages
- schema expansion
- internal-link tuning
- pruning / repair of older weaker pages
