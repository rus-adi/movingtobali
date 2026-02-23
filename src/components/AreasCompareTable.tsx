import Link from "next/link";
import type { ContentItem } from "@/lib/content";
import { card } from "@/components/ui/styles";

function v(x?: string) {
  const s = (x || "").trim();
  return s ? s : "—";
}

export default function AreasCompareTable({ areas }: { areas: ContentItem[] }) {
  if (!areas?.length) return null;

  return (
    <div
      className={`overflow-x-auto ${card}`}
      role="region"
      aria-label="Areas comparison table"
      tabIndex={0}
    >
      <table className="min-w-[860px] w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="sticky top-0 w-[18%] border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Area
            </th>
            <th className="sticky top-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Region
            </th>
            <th className="sticky top-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Pace
            </th>
            <th className="sticky top-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Traffic
            </th>
            <th className="sticky top-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Walkability
            </th>
            <th className="sticky top-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Family fit
            </th>
            <th className="sticky top-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Beach
            </th>
            <th className="sticky top-0 border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Nature
            </th>
            <th className="sticky top-0 w-[22%] border-b border-gray-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {areas.map((a) => (
            <tr key={a.slug} className="border-b border-gray-200 last:border-b-0">
              <td className="px-3 py-3 align-top">
                <Link href={`/areas/${a.slug}`} className="font-semibold text-gray-900 transition-colors hover:text-blue-600">
                  {a.title.replace(/\sfor families$/i, "")}
                </Link>
              </td>
              <td className="px-3 py-3 align-top">{v(a.category)}</td>
              <td className="px-3 py-3 align-top">{v(a.area?.pace)}</td>
              <td className="px-3 py-3 align-top">{v(a.area?.traffic)}</td>
              <td className="px-3 py-3 align-top">{v(a.area?.walkability)}</td>
              <td className="px-3 py-3 align-top">{v(a.area?.familyFit)}</td>
              <td className="px-3 py-3 align-top">{v(a.area?.beachAccess)}</td>
              <td className="px-3 py-3 align-top">{v(a.area?.natureAccess)}</td>
              <td className="px-3 py-3 align-top text-gray-600">{v(a.area?.note)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
