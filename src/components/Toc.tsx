import type { TocItem } from "@/lib/markdown";

export default function Toc({ toc }: { toc: TocItem[] }) {
  if (!toc.length) return null;

  return (
    <aside className="card" aria-label="Table of contents">
      <strong>On this page</strong>
      <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
        {toc.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="pill"
            style={{
              justifyContent: "flex-start",
              textDecoration: "none",
              marginLeft: item.depth === 3 ? 14 : 0,
            }}
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
