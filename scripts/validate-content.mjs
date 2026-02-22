import fs from "fs";
import path from "path";
import matter from "gray-matter";

const strict = process.argv.includes("--strict");

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const OFFICIAL_LINKS_PATH = path.join(ROOT, "src", "content", "official-links.json");

const dirs = ["pillars", "guides", "areas", "blog", "resources"];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir)) {
    const fp = path.join(dir, f);
    const stat = fs.statSync(fp);
    if (stat.isDirectory()) out.push(...walk(fp));
    else out.push(fp);
  }
  return out;
}

function isPlaceholder(v) {
  if (typeof v !== "string") return false;
  const s = v.toLowerCase();

  // Common placeholder signals
  if (
    s.includes("write a 1–2 sentence description") ||
    s.includes("write a 1-2 sentence description") ||
    s.includes("replace this with") ||
    s.includes("placeholder") ||
    s.includes("todo") ||
    s.includes("tbd")
  ) return true;

  // Explicit bracket placeholders used in this repo
  if (/\[(needs input|add faq|define|set price|optional|write)\b/i.test(s)) return true;

  // Common dummy values
  if (s.includes("example.com") || s.includes("hello@example.com")) return true;

  return false;
}

function err(msg) {
  if (strict) {
    console.error("ERROR:", msg);
    process.exitCode = 2;
  } else {
    console.warn("WARN:", msg);
  }
}

function checkUrl(field, v, file) {
  if (!v) return;
  const s = String(v);
  if (!/^https?:\/\//.test(s) && !s.startsWith("/")) {
    err(`${file}: ${field} must be an absolute URL (http/https) or site-relative (/...). Got: ${s}`);
  }
}


function walkData(obj, cb, prefix = "") {
  if (obj === null || obj === undefined) return;
  if (typeof obj === "string") {
    cb(obj, prefix);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, idx) => walkData(v, cb, prefix ? `${prefix}[${idx}]` : `[${idx}]`));
    return;
  }
  if (typeof obj === "object") {
    Object.entries(obj).forEach(([k, v]) => {
      const next = prefix ? `${prefix}.${k}` : k;
      walkData(v, cb, next);
    });
  }
}

function checkVideo(video, file, isPublished) {
  if (!video) return;

  if (!video.youtubeId || String(video.youtubeId).trim().length < 5) {
    err(`${file}: video.youtubeId is required`);
  }

  if (!video.summary || isPlaceholder(video.summary)) {
    err(`${file}: video.summary is required and should not be a placeholder`);
  }

  const permission = video.permission;
  if (!permission || !["owned", "licensed", "permission"].includes(permission)) {
    err(`${file}: video.permission must be one of: owned | licensed | permission`);
  }

  const childrenVisible = Boolean(video.childrenVisible);
  const consentConfirmed = Boolean(video.consentConfirmed);
  if (childrenVisible && !consentConfirmed) {
    err(`${file}: video.childrenVisible=true requires video.consentConfirmed=true (privacy/consent policy)`);
  }

  // Published pages should have a transcript or a detailed recap.
  // This follows the master plan: "Every embedded video gets: summary + transcript (or a detailed recap)."
  if (isPublished) {
    const transcript = String(video.transcript || "").trim();
    const transcriptFile = String(video.transcriptFile || "").trim();
    if (!transcript && !transcriptFile) {
      err(`${file}: published video pages must include video.transcript or video.transcriptFile`);
    }
    if (transcriptFile) {
      const fp = path.join(ROOT, transcriptFile.replace(/^\//, ""));
      if (!fs.existsSync(fp)) {
        err(`${file}: video.transcriptFile not found: ${transcriptFile}`);
      }
    }
  }
}

const issues = [];

for (const d of dirs) {
  const base = path.join(CONTENT_DIR, d);
  for (const fp of walk(base)) {
    if (!fp.endsWith(".md")) continue;
    const raw = fs.readFileSync(fp, "utf8");
    const { data, content } = matter(raw);

    const rel = path.relative(ROOT, fp);

    if (!data.title) err(`${rel}: missing title`);
    if (!data.description || isPlaceholder(data.description)) err(`${rel}: missing description or placeholder`);
    if (["blog", "guides", "resources", "areas"].includes(d)) {
      if (!data.date) err(`${rel}: missing date`);
    }

    if (Array.isArray(data.tags)) {
      data.tags.forEach((t) => {
        if (typeof t !== "string") err(`${rel}: tags must be strings`);
      });
    } else if (data.tags) {
      err(`${rel}: tags must be an array`);
    }

    
// Scan all front matter strings for placeholders
walkData(data, (val, p) => {
  if (isPlaceholder(val)) err(`${rel}: placeholder detected in front matter at ${p}`);
});

if (isPlaceholder(content)) err(`${rel}: content looks like placeholder`);

    // Social URLs
    if (data.social) {
      checkUrl("social.instagramUrl", data.social.instagramUrl, rel);
      checkUrl("social.youtubeUrl", data.social.youtubeUrl, rel);
    }

    // Video policy checks
    const isPublished = !data.draft && !data.noindex;
    checkVideo(data.video, rel, isPublished);
  }
}



// Validate official links list (source-of-truth anchors used in visa/entry guides)
try {
  const raw = fs.readFileSync(OFFICIAL_LINKS_PATH, "utf8");
  const links = JSON.parse(raw);
  if (!Array.isArray(links)) {
    err(`official-links.json: expected an array`);
  } else {
    links.forEach((l, idx) => {
      const label = `official-links.json[${idx}]`;
      if (!l.title) err(`${label}: missing title`);
      if (!l.url) err(`${label}: missing url`);
      checkUrl(`${label}.url`, l.url, "official-links.json");

      const last = String(l.lastVerified || "").trim();
      if (!last) err(`${label}: missing lastVerified (YYYY-MM-DD)`);
      const ts = last ? new Date(last).getTime() : NaN;
      if (last && !Number.isFinite(ts)) err(`${label}: invalid lastVerified date: ${last}`);

      const cadence = l.reviewCadenceDays;
      if (cadence !== undefined && (!Number.isFinite(Number(cadence)) || Number(cadence) <= 0)) {
        err(`${label}: reviewCadenceDays must be a positive number if provided`);
      }
    });
  }
} catch (e) {
  err(`Could not read official links: ${e.message}`);
}

if (process.exitCode === 2) {
  console.error("\nValidation failed.");
  process.exit(2);
} else {
  console.log("Validation complete.");
}
