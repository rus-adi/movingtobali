import fs from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const kind = argv[0];

const opts = {};
const titleParts = [];

for (const a of argv.slice(1)) {
  if (a.startsWith("--")) {
    const [k, v = "true"] = a.replace(/^--/, "").split("=", 2);
    opts[k] = v;
  } else {
    titleParts.push(a);
  }
}

const title = titleParts.join(" ").trim();

if (!kind || !title) {
  console.log('Usage: node scripts/new-content.mjs <blog|guides|resources|areas> "Title" [--category=...] [--tags=a,b,c] [--draft=true|false] [--noindex=true|false]');
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const slug = slugify(title);

const dirMap = {
  blog: "content/blog",
  guides: "content/guides",
  resources: "content/resources",
  areas: "content/areas",
};

const dir = dirMap[kind];
if (!dir) {
  console.log("Unknown kind:", kind);
  process.exit(1);
}

const fp = path.join(process.cwd(), dir, `${slug}.md`);
if (fs.existsSync(fp)) {
  console.log("File already exists:", fp);
  process.exit(1);
}

const categoryDefault = kind === "blog" ? "Learning in Bali" : kind === "resources" ? "Templates" : "General";
const category = String(opts.category || categoryDefault);

const tagsDefault = ["bali", "families"];
const tags = String(opts.tags || tagsDefault.join(","))
  .split(",")
  .map((x) => x.trim())
  .filter(Boolean);

const draft = String(opts.draft ?? "true") === "true";
const noindex = String(opts.noindex ?? "true") === "true";

const template = `---
title: "${title.replace(/"/g, '\\"')}"
description: "[NEEDS INPUT] 1–2 sentences: what the reader will know or be able to do."
date: "${date}"
updated: "${date}"
category: "${category.replace(/"/g, '\\"')}"
tags: [${tags.map((t) => `"${t.replace(/"/g, '\\"')}"`).join(", ")}]
draft: ${draft}
noindex: ${noindex}
# keywords: ["optional", "keyword phrase"]
# coverImage: "/images/optional-cover.jpg"
faqs:
  - q: "[ADD FAQ QUESTION]"
    a: "[ADD FAQ ANSWER]"
  - q: "[ADD FAQ QUESTION]"
    a: "[ADD FAQ ANSWER]"
  - q: "[ADD FAQ QUESTION]"
    a: "[ADD FAQ ANSWER]"
---

## Quick take

Write the quick answer first (2–5 short paragraphs). Be specific and calm.

## Checklist

- [NEEDS INPUT] Item 1
- [NEEDS INPUT] Item 2
- [NEEDS INPUT] Item 3

## What we learned the hard way

One honest paragraph: what surprised us, and what we’d do differently.

## Next steps

- [Start here](/start-here)
- [NEEDS INPUT] Add 1–2 related guides
- [Ask a question](/contact)

`;

fs.writeFileSync(fp, template, "utf8");
console.log("Created:", fp);
