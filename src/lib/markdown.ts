import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import GithubSlugger from "github-slugger";

export type TocItem = { depth: number; text: string; id: string };

function remarkHeadingsWithIds() {
  return (tree: any) => {
    const slugger = new GithubSlugger();
    visit(tree, "heading", (node: any) => {
      const text = (node.children || [])
        .filter((c: any) => c.type === "text" || c.type === "inlineCode")
        .map((c: any) => String(c.value || ""))
        .join("")
        .trim();
      if (!text) return;
      const id = slugger.slug(text);
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.id = id;
    });
  };
}

export async function extractToc(markdown: string, opts: { minDepth?: number; maxDepth?: number } = {}): Promise<TocItem[]> {
  const minDepth = opts.minDepth ?? 2;
  const maxDepth = opts.maxDepth ?? 3;

  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];

  const tree = remark().use(remarkGfm).parse(markdown);
  visit(tree, "heading", (node: any) => {
    const depth = Number(node.depth || 0);
    if (depth < minDepth || depth > maxDepth) return;

    const text = (node.children || [])
      .filter((c: any) => c.type === "text" || c.type === "inlineCode")
      .map((c: any) => String(c.value || ""))
      .join("")
      .trim();
    if (!text) return;

    toc.push({ depth, text, id: slugger.slug(text) });
  });

  return toc;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(remarkGfm).use(remarkHeadingsWithIds).use(remarkHtml).process(markdown);
  return result.toString();
}

export function estimateReadingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
