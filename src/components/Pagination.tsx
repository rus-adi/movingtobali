import Link from "next/link";

type Props = {
  basePath: string;
  page: number;
  pageSize: number;
  total: number;
  query?: Record<string, string | undefined>;
};

function buildHref(basePath: string, query: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v && String(v).trim()) sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({ basePath, page, pageSize, total, query = {} }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);

  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav aria-label="Pagination" style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
      <Link className={`button secondary ${page === 1 ? "disabled" : ""}`} aria-disabled={page === 1} href={buildHref(basePath, { ...query, page: String(prev) })}>
        Prev
      </Link>

      {pages.map((p) => (
        <Link key={p} className={`button secondary ${p === page ? "active" : ""}`} href={buildHref(basePath, { ...query, page: String(p) })}>
          {p}
        </Link>
      ))}

      <Link className={`button secondary ${page === totalPages ? "disabled" : ""}`} aria-disabled={page === totalPages} href={buildHref(basePath, { ...query, page: String(next) })}>
        Next
      </Link>

      <span style={{ opacity: 0.7, fontSize: 13 }}>Page {page} of {totalPages}</span>
    </nav>
  );
}
