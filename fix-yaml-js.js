#!/usr/bin/env node
/**
 * Fix YAML frontmatter using gray-matter + js-yaml to validate,
 * and targeted string fixes for the remaining broken files.
 *
 * Fixes:
 *  1. `area:` block children duplicated at root level → remove duplicates, indent properly
 *  2. `video:` / `social:` block children at root → indent properly under their parent
 *  3. Multi-line unquoted values inside nested blocks (summary: etc.)
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function walk(dir) {
    return fs
        .readdirSync(dir)
        .flatMap((f) => {
            const fp = path.join(dir, f);
            return fs.statSync(fp).isDirectory() ? walk(fp) : [fp];
        })
        .filter((f) => f.endsWith(".md"));
}

/**
 * Fix frontmatter by parsing the raw text line-by-line.
 * Handles:
 *   - Nested blocks (area:, video:, social:) whose children are at root level
 *   - Duplicate root-level keys (keep first occurrence only)
 *   - Multi-line unquoted string values → join + quote
 */
function fixFile(filepath) {
    const original = fs.readFileSync(filepath, "utf8");

    // Already valid? Skip.
    try {
        matter(original);
        return false;
    } catch (_) {
        // fall through to fix
    }

    const lines = original.split("\n");

    // Find closing ---
    let fmEnd = -1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "---") {
            fmEnd = i;
            break;
        }
    }
    if (fmEnd === -1) return false;

    const fmLines = lines.slice(1, fmEnd);
    const bodyLines = lines.slice(fmEnd + 1);

    // ── Pass 1: Detect nested block keys (like area:, video:, social:) ──────
    // A nested block key looks like "key:" with no value, followed by children.
    // After our previous script ran, the children may be at root level AND
    // duplicated. We need to:
    //   a) Find all root keys that appear more than once → keep first
    //   b) Identify children that belong under a nested block and re-indent them

    // Known nested block keys and their expected child keys
    const NESTED_BLOCKS = {
        area: new Set([
            "pace", "traffic", "walkability", "familyFit", "beachAccess",
            "natureAccess", "noise", "costTier", "note",
        ]),
        video: new Set([
            "youtubeId", "title", "summary", "transcript", "transcriptFile",
            "uploadDate", "permission", "childrenVisible", "consentConfirmed",
            "ctaText", "ctaHref",
        ]),
        social: new Set(["instagramUrl", "youtubeUrl", "facebookUrl"]),
    };

    // Build a map of which keys are children of which nested block
    const childToParent = {};
    for (const [parent, children] of Object.entries(NESTED_BLOCKS)) {
        for (const child of children) {
            childToParent[child] = parent;
        }
    }

    // Parse the frontmatter lines into tokens
    // We'll re-emit them correctly
    const ROOT_KEYS = new Set([
        "title", "description", "date", "updated", "category", "tags",
        "keywords", "draft", "noindex", "order", "coverImage", "resourceType",
        "faqs", "area", "video", "social",
    ]);

    // ── Strategy: rebuild frontmatter from scratch ───────────────────────────
    // Walk lines, track current block context, collect children
    let result = [];
    const seenRootKeys = new Set();
    const nestedChildren = {}; // parent → [{key, value}]
    for (const b of Object.keys(NESTED_BLOCKS)) nestedChildren[b] = [];

    let i = 0;
    let inNestedBlock = null; // name of current nested block
    let inFaqs = false;
    let inTagList = false;
    let inKeywordList = false;
    let pendingListParent = null;

    while (i < fmLines.length) {
        const raw = fmLines[i];
        const stripped = raw.trim();

        // Blank lines
        if (stripped === "") {
            i++;
            continue;
        }

        // List item under faqs (- q: ...)
        if (/^\s*-\s+q:/.test(raw)) {
            inNestedBlock = null;
            inTagList = false;
            inKeywordList = false;
            // Collect this and following faq lines
            let block = [raw];
            i++;
            while (i < fmLines.length) {
                const next = fmLines[i];
                if (/^\s+(a:|q:)/.test(next) || /^\s{4,}\S/.test(next)) {
                    block.push(next);
                    i++;
                } else break;
            }
            // Normalise: join multi-line q and a values
            const joined = block.join("\n");
            const qMatch = joined.match(/q:\s*([\s\S]*?)(?=\n\s*a:|$)/);
            const aMatch = joined.match(/a:\s*([\s\S]*?)$/);
            if (qMatch && aMatch) {
                const qVal = qMatch[1].trim().replace(/\n\s+/g, " ");
                const aVal = aMatch[1].trim().replace(/\n\s+/g, " ");
                const quote = (s) => `"${s.replace(/"/g, '\\"')}"`;
                result.push(`- q: ${quote(qVal)}`);
                result.push(`  a: ${quote(aVal)}`);
            } else {
                result.push(...block);
            }
            continue;
        }

        // Tag/keyword list items
        if (inTagList && /^\s*-\s+/.test(raw)) {
            result.push(raw.trimEnd());
            i++;
            continue;
        }
        if (inKeywordList && /^\s*-\s+/.test(raw)) {
            result.push(raw.trimEnd());
            i++;
            continue;
        }

        // Key: value line
        const keyMatch = raw.match(/^(\s*)([a-zA-Z][a-zA-Z0-9_]*):\s*(.*)/);
        if (!keyMatch) {
            // Continuation or unknown — include as-is if in nested block
            if (inNestedBlock) {
                nestedChildren[inNestedBlock].push({ raw: raw.trimEnd(), isRaw: true });
            }
            i++;
            continue;
        }

        const lineIndent = keyMatch[1].length;
        const key = keyMatch[2];
        let value = keyMatch[3].trimEnd();

        // Collect multi-line value (indented continuation lines)
        let j = i + 1;
        while (j < fmLines.length) {
            const nextRaw = fmLines[j];
            // Continuation: indented more and not a new key/list
            if (
                /^\s{2,}/.test(nextRaw) &&
                !/^\s*-\s/.test(nextRaw) &&
                !/^\s*[a-zA-Z][a-zA-Z0-9_]*:/.test(nextRaw)
            ) {
                value = value.trimEnd() + " " + nextRaw.trim();
                j++;
            } else {
                break;
            }
        }
        i = j;

        // Determine where this key belongs
        if (lineIndent === 0 && ROOT_KEYS.has(key)) {
            // Root-level key
            inTagList = key === "tags";
            inKeywordList = key === "keywords";

            if (Object.keys(NESTED_BLOCKS).includes(key)) {
                // This is a nested block header
                inNestedBlock = key;
                if (!seenRootKeys.has(key)) {
                    seenRootKeys.add(key);
                    // Will emit the block after collecting children (below)
                    // For now, mark position
                    result.push(`__NESTED_BLOCK:${key}__`);
                }
                i = j > i ? j : i; // already advanced
                continue;
            }

            if (seenRootKeys.has(key)) {
                // Duplicate root key — skip (but keep children of nested block)
                i = j > i ? j : i;
                continue;
            }

            seenRootKeys.add(key);
            inNestedBlock = null;

            // Quote if needed (remove stray trailing single-quotes from partial quoting)
            if (value && !value.startsWith('"') && !value.startsWith("'") && key === "description") {
                const clean = value.replace(/^'|'$/g, "").replace(/"/g, '\\"');
                value = `"${clean}"`;
            }

            if (value === "") {
                result.push(`${key}:`);
            } else {
                result.push(`${key}: ${value}`);
            }
        } else if (
            lineIndent === 0 &&
            !ROOT_KEYS.has(key) &&
            childToParent[key]
        ) {
            // This is a child key that ended up at root — put it under its parent
            const parent = childToParent[key];
            if (inNestedBlock !== parent) {
                // Not currently in that block — this is a duplicate displaced child
                // Add to parent's children if not already there
                const alreadyHas = nestedChildren[parent].some((c) => c.key === key);
                if (!alreadyHas) {
                    nestedChildren[parent].push({ key, value });
                }
            }
        } else if (lineIndent > 0 && inNestedBlock) {
            // Properly indented child of nested block
            const alreadyHas = nestedChildren[inNestedBlock].some((c) => c.key === key);
            if (!alreadyHas) {
                nestedChildren[inNestedBlock].push({ key, value });
            }
        } else {
            // Anything else — include as-is
            result.push(raw.trimEnd());
        }
    }

    // Now replace __NESTED_BLOCK:x__ placeholders with actual content
    const finalLines = [];
    for (const line of result) {
        const match = line.match(/^__NESTED_BLOCK:(\w+)__$/);
        if (match) {
            const blockName = match[1];
            finalLines.push(`${blockName}:`);
            for (const child of nestedChildren[blockName]) {
                if (child.isRaw) {
                    finalLines.push(`  ${child.raw.trim()}`);
                } else {
                    finalLines.push(`  ${child.key}: ${child.value}`);
                }
            }
        } else {
            finalLines.push(line);
        }
    }

    const newFm = finalLines.join("\n");
    const newBody = bodyLines.join("\n");
    const newText = `---\n${newFm}\n---\n${newBody}`;

    // Validate before writing
    try {
        matter(newText);
    } catch (e) {
        console.log(`  STILL BROKEN after fix attempt: ${filepath}`);
        console.log(`    ${e.message.split("\n")[0]}`);
        return false;
    }

    fs.writeFileSync(filepath, newText, "utf8");
    return true;
}

const files = walk("content");
let fixed = 0;
let errors = 0;
for (const fp of files) {
    try {
        const wasFixed = fixFile(fp);
        if (wasFixed) {
            console.log(`  FIXED: ${path.relative(".", fp)}`);
            fixed++;
        }
    } catch (e) {
        console.log(`  ERROR: ${fp}: ${e.message}`);
        errors++;
    }
}
console.log(`\nDone. Fixed ${fixed}, errors ${errors}.`);
