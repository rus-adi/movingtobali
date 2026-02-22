import Link from "next/link";
import type { ContentItem } from "@/lib/content";

function v(x?: string) {
  const s = (x || "").trim();
  return s ? s : "—";
}

export default function AreasCompareTable({ areas }: { areas: ContentItem[] }) {
  if (!areas?.length) return null;

  return (
    <div className="tableWrap" role="region" aria-label="Areas comparison table" tabIndex={0}>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "18%" }}>Area</th>
            <th>Region</th>
            <th>Pace</th>
            <th>Traffic</th>
            <th>Walkability</th>
            <th>Family fit</th>
            <th>Beach</th>
            <th>Nature</th>
            <th style={{ width: "22%" }}>Note</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((a) => (
            <tr key={a.slug}>
              <td>
                <Link href={`/areas/${a.slug}`} style={{ color: "inherit" }}>
                  <strong>{a.title.replace(/\sfor families$/i, "")}</strong>
                </Link>
              </td>
              <td>{v(a.category)}</td>
              <td>{v(a.area?.pace)}</td>
              <td>{v(a.area?.traffic)}</td>
              <td>{v(a.area?.walkability)}</td>
              <td>{v(a.area?.familyFit)}</td>
              <td>{v(a.area?.beachAccess)}</td>
              <td>{v(a.area?.natureAccess)}</td>
              <td style={{ color: "var(--muted)" }}>{v(a.area?.note)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
