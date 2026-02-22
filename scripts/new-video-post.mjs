import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith("--")) || "";
const youtubeIdArg = args.find((a) => a.startsWith("--youtubeId="));
const permissionArg = args.find((a) => a.startsWith("--permission="));
const youtubeId = youtubeIdArg ? youtubeIdArg.split("=", 2)[1] : "";
const permission = permissionArg ? permissionArg.split("=", 2)[1] : "owned";

if (!title.trim()) {
  console.log('Usage: npm run new:video-post -- "Title" --youtubeId=XXXXXXXXXXX --permission=owned');
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

const postFp = path.join(process.cwd(), "content", "blog", `${slug}.md`);
if (fs.existsSync(postFp)) {
  console.log("Post already exists:", postFp);
  process.exit(1);
}

const transcriptRel = `content/transcripts/${slug}.txt`;
const transcriptFp = path.join(process.cwd(), transcriptRel);
fs.writeFileSync(
  transcriptFp,
  `TRANSCRIPT PLACEHOLDER\n\n- Replace this with a real transcript or detailed recap.\n- If children appear, confirm consent and set video.consentConfirmed: true\n`,
  "utf8"
);

const template = `---
title: "${title.replace(/"/g, '\"')}"
description: "[NEEDS INPUT] 1–2 sentences: what the video covers."
date: "${date}"
updated: "${date}"
category: "Video"
tags: ["video", "bali", "families"]
draft: true
noindex: true
video:
  youtubeId: "${youtubeId}"
  title: "${title.replace(/"/g, '\"')}"
  summary: "[NEEDS INPUT] A short written summary (what parents will learn)."
  transcriptFile: "${transcriptRel}"
  uploadDate: "${date}"
  permission: "${permission}"
  childrenVisible: false
  consentConfirmed: false
  ctaText: "Start here"
  ctaHref: "/start-here"
social:
  youtubeUrl: "https://www.youtube.com/watch?v=${youtubeId}"
---

## Written answer (always comes first)

Write the answer on-page first. The video is supporting context.

## Key takeaways

- Takeaway 1
- Takeaway 2

## Related links

- [Start here](/start-here)
- [Visas](/visas)
- [Housing](/housing)

`;

fs.writeFileSync(postFp, template, "utf8");
console.log("Created video post:", postFp);
console.log("Created transcript file:", transcriptFp);
