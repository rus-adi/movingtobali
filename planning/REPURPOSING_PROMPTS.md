# Repurposing prompts (video → daily blog posts)

Use these prompts inside GPT to turn one video into 3–7 daily blog posts.

## Prompt 1 — Extract segments

**Input:** transcript (or recap), and the target audience: “parents moving to Bali”.

**Prompt:**
You are an editor for a parent-focused relocation site. From the transcript below:
1) Identify 5–10 distinct “micro topics” that can each be a 600–900 word blog post.
2) For each micro topic, give:
   - a working title
   - a 1–2 sentence hook
   - 3 headings (H2) that answer the question fully
   - a suggested CTA to a pillar page (start-here, visas, housing, areas, schools, costs, family-life)
Return as JSON.

## Prompt 2 — Write one post (SEO first)

**Input:** one micro topic + transcript excerpts.

**Prompt:**
Write a blog post for movingtobali.empathy.school.
Constraints:
- Calm, parent-first tone; practical; no legal advice
- Start with the written answer (no fluff)
- Add 3–5 H2 sections
- Include a checklist section
- Include a “What we learned the hard way” section
- End with 2 internal links (one pillar, one guide/resource)
- Add FAQ (2 Q&As) at the end
Return markdown with front matter:
title, description, date, updated, category, tags, draft=true, noindex=true

## Prompt 3 — Create transcript summary + timestamps

**Input:** video transcript.

**Prompt:**
Summarize the video into:
- 3–5 bullet takeaways
- A 1 paragraph summary
- 8–12 timestamps with short labels
Return as markdown.

## Prompt 4 — Build on-page transcript (privacy safe)

**Input:** raw transcript.

**Prompt:**
Clean this transcript for on-page publishing:
- remove filler words
- remove identifying details (full names, phone numbers)
- keep meaning accurate
Return a readable transcript with light paragraphing.
