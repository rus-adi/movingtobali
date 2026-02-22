#!/usr/bin/env python3
"""
Fix malformed YAML frontmatter in all content/*.md files.

Problems fixed:
  1. Multi-line unquoted `description:` values → quoted single-line
  2. Multi-line unquoted `q:` / `a:` values inside `faqs:` list → quoted single-line
  3. `a:` items that are not indented under their `- q:` list item
  4. Misindented closing `---`
  5. Extra leading indentation in the body
"""

import os
import re
import glob


CONTENT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "content")


def strip_outer_quotes(s):
    s = s.strip()
    if (s.startswith("'") and s.endswith("'")) or (s.startswith('"') and s.endswith('"')):
        return s[1:-1]
    return s


def quote_value(s):
    """Return the value wrapped in double-quotes, with internal double-quotes escaped."""
    s = strip_outer_quotes(s)
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    return f'"{s}"'


def join_continuation(lines, start):
    """
    Starting at lines[start], collect the first value line and any indented
    continuation lines. Returns (joined_value, next_index).
    """
    value = lines[start].strip()
    i = start + 1
    while i < len(lines):
        ln = lines[i]
        # Continuation: indented but not a new list item or new key
        if re.match(r'^\s+\S', ln) and not re.match(r'^\s*-\s', ln) and not re.match(r'^\s*[a-zA-Z][a-zA-Z0-9_]*:', ln):
            value = value.rstrip() + " " + ln.strip()
            i += 1
        else:
            break
    return value, i


def fix_frontmatter(text):
    if not text.startswith("---"):
        return text, False

    lines = text.splitlines(keepends=True)

    # Find closing ---  (may have leading whitespace)
    fm_end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            fm_end = i
            break

    if fm_end is None:
        return text, False

    fm_lines = lines[1:fm_end]
    body_lines = lines[fm_end + 1:]

    changed = False
    new_fm = []
    i = 0

    while i < len(fm_lines):
        raw = fm_lines[i]
        stripped = raw.strip()

        # ── Fix misindented root-level keys (e.g. "    title: foo") ──────────
        root_key_match = re.match(r'^(\s+)([a-zA-Z][a-zA-Z0-9_]*):\s*(.*)\n?$', raw)
        if root_key_match:
            indent = root_key_match.group(1)
            key = root_key_match.group(2)
            rest = root_key_match.group(3)
            # Only treat as misindented root key if indent is uniform (no deeper nesting context)
            # and the key is not a list-item child (those start with "  a:" or "  q:")
            # We'll only fix description/title/order/etc. — clearly root keys
            TOP_LEVEL_KEYS = {'title', 'description', 'order', 'category', 'draft',
                              'noindex', 'updated', 'tags', 'faqs'}
            if key in TOP_LEVEL_KEYS and len(indent) > 0:
                raw = f"{key}: {rest}\n"
                stripped = raw.strip()
                changed = True

        # ── Fix multi-line `description:` ─────────────────────────────────────
        desc_match = re.match(r'^description:\s+(.+)\n?$', raw)
        if desc_match:
            value = desc_match.group(1)
            # Already properly quoted on one line?
            if (value.startswith('"') and value.endswith('"')) or \
               (value.startswith("'") and value.endswith("'")):
                # Check it's not a broken single-quote (opening only)
                balanced = (value.count('"') % 2 == 0) or (value.startswith('"') and value.endswith('"'))
                if balanced:
                    new_fm.append(raw)
                    i += 1
                    continue

            # Collect continuation lines
            full_value, next_i = join_continuation(fm_lines, i + 1)
            # join_continuation returns lines[i+1]… so combine with value
            if next_i > i + 1:
                value = value.rstrip() + " " + full_value
                i = next_i
            else:
                i += 1

            new_fm.append(f"description: {quote_value(value)}\n")
            changed = True
            continue

        # ── Fix list items: `- q:` and adjacent `a:` ─────────────────────────
        # Pattern: "- q: some text" (possibly multi-line)
        q_item_match = re.match(r'^(\s*)-\s+q:\s+(.*)\n?$', raw)
        if q_item_match:
            list_indent = q_item_match.group(1)
            q_val = q_item_match.group(2)

            # Collect q continuation lines
            j = i + 1
            while j < len(fm_lines):
                next_ln = fm_lines[j]
                # Continuation for q: indented more than the list item, not a key
                if re.match(r'^\s{' + str(len(list_indent) + 4) + r',}\S', next_ln) and \
                   not re.match(r'^\s*(a|q):', next_ln.strip()):
                    q_val = q_val.rstrip() + " " + next_ln.strip()
                    j += 1
                else:
                    break

            i = j

            # Now look for the `a:` line (may be at list_indent+2 spaces, or misindented at root)
            a_val = None
            if i < len(fm_lines):
                a_line = fm_lines[i]
                a_match = re.match(r'^\s*a:\s+(.*)\n?$', a_line)
                if a_match:
                    a_val = a_match.group(1)
                    i += 1
                    # Collect a continuation lines
                    while i < len(fm_lines):
                        next_ln = fm_lines[i]
                        if re.match(r'^\s+\S', next_ln) and \
                           not re.match(r'^\s*-\s+q:', next_ln) and \
                           not re.match(r'^\s*[a-zA-Z][a-zA-Z0-9_]*:', next_ln):
                            a_val = a_val.rstrip() + " " + next_ln.strip()
                            i += 1
                        else:
                            break

            item_indent = list_indent + "  "
            q_line = f"{list_indent}- q: {quote_value(q_val)}\n"
            new_fm.append(q_line)
            if a_val is not None:
                new_fm.append(f"{item_indent}a: {quote_value(a_val)}\n")
            changed = True
            continue

        # ── Fix stray `a:` lines not preceded by proper list item ─────────────
        stray_a_match = re.match(r'^(\s*)a:\s+(.*)\n?$', raw)
        if stray_a_match:
            a_indent = stray_a_match.group(1)
            a_val = stray_a_match.group(2)
            i += 1
            # Collect continuation
            while i < len(fm_lines):
                next_ln = fm_lines[i]
                if re.match(r'^\s+\S', next_ln) and not re.match(r'^\s*-\s', next_ln):
                    a_val = a_val.rstrip() + " " + next_ln.strip()
                    i += 1
                else:
                    break
            new_fm.append(f"{a_indent}a: {quote_value(a_val)}\n")
            changed = True
            continue

        new_fm.append(raw)
        i += 1

    # ── Fix extra leading indentation in body ────────────────────────────────
    new_body = []
    for line in body_lines:
        if line.startswith("    "):
            new_body.append(line[4:])
            changed = True
        else:
            new_body.append(line)

    result = "---\n" + "".join(new_fm) + "---\n" + "".join(new_body)
    return result, changed


def main():
    pattern = os.path.join(CONTENT_DIR, "**", "*.md")
    files = glob.glob(pattern, recursive=True)
    fixed = []
    errors = []

    for filepath in sorted(files):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                original = f.read()
            result, changed = fix_frontmatter(original)
            if changed:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(result)
                rel = os.path.relpath(filepath, os.path.dirname(os.path.abspath(__file__)))
                fixed.append(rel)
                print(f"  FIXED: {rel}")
        except Exception as e:
            errors.append((filepath, str(e)))
            print(f"  ERROR: {filepath}: {e}")

    print(f"\nDone. Fixed {len(fixed)} file(s), {len(errors)} error(s).")
    if errors:
        for f, e in errors:
            print(f"  !! {f}: {e}")


if __name__ == "__main__":
    main()
