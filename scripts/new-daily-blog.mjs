import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith("--")) || "";
const tagsArg = args.find((a) => a.startsWith("--tags="));
const categoryArg = args.find((a) => a.startsWith("--category="));
const pillarArg = args.find((a) => a.startsWith("--pillar=")); // optional: start-here|visas|housing|areas|family-life|costs
const areaArg = args.find((a) => a.startsWith("--area=")); // optional area slug

if (!title.trim()) {
  console.log('Usage: npm run new:daily-blog -- "Title" [--category="Learning in Bali"] [--tags=learning,bali,families] [--pillar=start-here] [--area=sanur]');
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);

const category = categoryArg ? categoryArg.split("=", 2)[1] : "Learning in Bali";
const tags = (tagsArg ? tagsArg.split("=", 2)[1] : "learning,bali,families")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

const pillar = pillarArg ? pillarArg.split("=", 2)[1] : "start-here";
const areaSlug = areaArg ? areaArg.split("=", 2)[1] : "";

const postFp = path.join(process.cwd(), "content", "blog", `${slug}.md`);
if (fs.existsSync(postFp)) {
  console.log("Post already exists:", postFp);
  process.exit(1);
}

const areaLine = areaSlug ? `- [Area: ${areaSlug}](/areas/${areaSlug})\n` : "";

const template = `---
title: "${title.replace(/"/g, '\\"')}"
description: "[NEEDS INPUT] 1–2 sentences: what parents will learn."
date: "${date}"
updated: "${date}"
category: "${category.replace(/"/g, '\\"')}"
tags: [${tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ")}]
draft: true
noindex: true
faqs:
  - q: "[ADD FAQ QUESTION]"
    a: "[ADD FAQ ANSWER]"
  - q: "[ADD FAQ QUESTION]"
    a: "[ADD FAQ ANSWER]"
  - q: "[ADD FAQ QUESTION]"
    a: "[ADD FAQ ANSWER]"
---

## Quick take

Write the answer parents came for. Keep it practical.

## The “why this matters” (for kids)

Two short paragraphs connecting the advice to learning, wellbeing, and daily routine.

## Checklist (copy/paste)

- [NEEDS INPUT] Step 1
- [NEEDS INPUT] Step 2
- [NEEDS INPUT] Step 3

## What to watch out for

- [NEEDS INPUT] Red flag 1
- [NEEDS INPUT] Red flag 2

## Next steps

- [Start here](/start-here)
- [Pillar: ${pillar}](/${pillar})
${areaLine}- [Browse guides](/guides)
- [Ask a question](/contact)

`;

fs.writeFileSync(postFp, template, "utf8");
console.log("Created daily blog post:", postFp);
