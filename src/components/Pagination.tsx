import Link from "next/link";
import { badge, buttonDisabled, buttonSecondary } from "@/components/ui/styles";
import { cn } from "@/lib/cn";

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
    <nav
      aria-label="Pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-3"
    >
      <Link
        className={cn(buttonSecondary, page === 1 && buttonDisabled)}
        aria-disabled={page === 1}
        href={buildHref(basePath, { ...query, page: String(prev) })}
      >
        Prev
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          className={cn(
            buttonSecondary,
            p === page && "border-blue-200 bg-blue-50 text-blue-700"
          )}
          href={buildHref(basePath, { ...query, page: String(p) })}
        >
          {p}
        </Link>
      ))}

      <Link
        className={cn(buttonSecondary, page === totalPages && buttonDisabled)}
        aria-disabled={page === totalPages}
        href={buildHref(basePath, { ...query, page: String(next) })}
      >
        Next
      </Link>

      <span className={cn(badge, "text-xs")}>Page {page} of {totalPages}</span>
    </nav>
  );
}
