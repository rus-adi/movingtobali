import Link from "next/link";
import type { HubBundle } from "@/lib/hub";
import { cardCls, grid2 } from "@/components/ui/styles";

export default function BundleStrip({
  bundles,
}: {
  bundles: HubBundle[];
}) {
  return (
    <div className={grid2}>
      {bundles.map((bundle) => (
        <div key={bundle.title} className={cardCls}>
          <h3 className="text-2xl font-semibold tracking-tight text-gray-900">{bundle.title}</h3>
          <p className="mt-3 text-sm leading-6 text-gray-700">{bundle.body}</p>
          <div className="mt-5 grid gap-3">
            {bundle.links.map((link) => (
              <Link
                key={`${bundle.title}-${link.href}`}
                href={link.href}
                className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
                data-track="bundle_strip_open_link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
