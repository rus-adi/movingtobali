import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { visit } from "unist-util-visit";

export type TocItem = { id: string; text: string; level: number };

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function remarkAutoIds() {
  return (tree: any) => {
    const used = new Map<string, number>();

    visit(tree, "heading", (node: any) => {
      const raw = node.children
        ?.filter((c: any) => c.type === "text" || c.type === "inlineCode")
        .map((c: any) => c.value)
        .join(" ");
      const base = slugifyHeading(raw || "section");
      const n = (used.get(base) || 0) + 1;
      used.set(base, n);
      const id = n === 1 ? base : `${base}-${n}`;
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.id = id;
    });
  };
}

/**
 * Performance helpers for markdown-rendered content:
 * - Ensure images use lazy loading by default
 * - Add lazy loading to raw HTML iframes/img when missing
 */
function remarkLazyMedia() {
  return (tree: any) => {
    // Markdown images: ![]()
    visit(tree, "image", (node: any) => {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      // Browser-level performance defaults
      if (!node.data.hProperties.loading) node.data.hProperties.loading = "lazy";
      if (!node.data.hProperties.decoding) node.data.hProperties.decoding = "async";
    });

    // Raw HTML blocks inside markdown (common for embeds)
    visit(tree, "html", (node: any) => {
      if (!node.value || typeof node.value !== "string") return;
      let v = node.value;

      if (v.includes("<iframe") && !v.includes("loading=")) {
        v = v.replace("<iframe", '<iframe loading="lazy"');
      }

      if (v.includes("<img") && !v.includes("loading=")) {
        v = v.replace("<img", '<img loading="lazy" decoding="async"');
      }

      node.value = v;
    });
  };
}

/**
 * Wrap "Quick …" sections into a dedicated container so we can style them like a
 * readable, responsive card using Tailwind utilities.
 *
 * This is intentionally presentation-only: content remains identical.
 */
function remarkQuickCards() {
  return (tree: any) => {
    if (!tree || !Array.isArray(tree.children)) return;

    const children: any[] = tree.children;
    const out: any[] = [];

    const headingText = (node: any): string => {
      const raw = node?.children
        ?.filter((c: any) => c.type === "text" || c.type === "inlineCode")
        .map((c: any) => c.value)
        .join(" ");
      return String(raw || "").trim();
    };

    let i = 0;
    while (i < children.length) {
      const node = children[i];

      // Only treat H2 "Quick …" as a quick-start card.
      if (node?.type === "heading" && node.depth === 2) {
        const text = headingText(node);
        if (/^quick\b/i.test(text)) {
          out.push({ type: "html", value: '<div class="quick-card">' });
          out.push(node);
          i += 1;

          // Include everything until the next H2.
          while (i < children.length) {
            const next = children[i];
            if (next?.type === "heading" && next.depth === 2) break;
            out.push(next);
            i += 1;
          }

          out.push({ type: "html", value: "</div>" });
          continue;
        }
      }

      out.push(node);
      i += 1;
    }

    tree.children = out;
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkAutoIds)
    .use(remarkLazyMedia)
    .use(remarkQuickCards)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return String(result);
}

export function extractToc(markdown: string): TocItem[] {
  const toc: TocItem[] = [];
  const used = new Map<string, number>();

  const tree = remark().use(remarkGfm).parse(markdown) as any;

  visit(tree, "heading", (node: any) => {
    const level = node.depth;
    if (level < 2 || level > 3) return;

    const text = node.children
      ?.filter((c: any) => c.type === "text" || c.type === "inlineCode")
      .map((c: any) => c.value)
      .join(" ");

    const base = slugifyHeading(text || "section");
    const n = (used.get(base) || 0) + 1;
    used.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;

    toc.push({ id, text, level });
  });

  return toc;
}

/**
 * Estimate reading time for markdown content.
 *
 * This is intentionally simple and stable (no runtime deps):
 * - strips code blocks / inline code
 * - turns markdown links into their visible text
 * - strips basic HTML
 *
 * Returns a minimum of 1 minute (so UI doesn't show "0 min read").
 */
export function estimateReadingTimeMinutes(markdown: string, wordsPerMinute = 220): number {
  if (!markdown || typeof markdown !== "string") return 1;

  // Remove fenced code blocks and inline code.
  const noCode = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ");

  // Replace markdown links with link text.
  const noLinks = noCode.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");

  // Strip basic HTML tags (for embedded blocks).
  const noHtml = noLinks.replace(/<[^>]+>/g, " ");

  // Remove common markdown punctuation that can inflate tokenization.
  const normalized = noHtml.replace(/[#>*_~\-]+/g, " ");

  const words = normalized
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const count = words.length;
  if (count <= 0) return 1;

  // Clamp to avoid accidental extreme values.
  const wpm = Math.max(120, Math.min(400, wordsPerMinute));
  return Math.max(1, Math.ceil(count / wpm));
}
