import type { TocItem } from "@/lib/markdown";
import { cardCls, pill } from "@/components/ui/styles";

export default function Toc({ toc }: { toc: TocItem[] }) {
  if (!toc.length) return null;

  return (
    <aside className={cardCls} aria-label="Table of contents">
      <strong className="text-sm font-semibold text-gray-900">On this page</strong>
      <div className="mt-4 grid gap-2">
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${pill} justify-start ${item.depth === 3 ? "ml-4" : ""}`}
            data-track="toc_click"
            data-target={item.id}
          >
            {item.text}
          </a>
        ))}
      </div>
    </aside>
  );
}
