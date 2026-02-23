import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import PartnerBadge from "@/components/PartnerBadge";
import { getPartners } from "@/lib/partners";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { badge, badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Partners",
  description: "Preferred services we can introduce families to (only verified partners are shown publicly).",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  const items = getPartners();

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/partners", name: "Partners", description: "Preferred services we can introduce families to." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Partners</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Preferred partners & services</h1>
          <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
            We only show <strong>✔ VERIFIED</strong> partners publicly. If a partner is still “★ CHECK”, it stays hidden until agreements, vetting, and tracking are in place.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <DisclosureNotice />

          <div className={`${grid2} mt-10`}>
            {items.map((p) => (
              <div key={p.slug} className={cardCls}>
                <div className="flex flex-wrap items-center gap-2">
                  <PartnerBadge status={p.status} />
                  <span className={badgeAccent}>{p.category}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">{p.name}</h3>

                {p.bestFor ? (
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    <strong className="font-semibold text-gray-900">Best for:</strong> {p.bestFor}
                  </p>
                ) : null}

                {p.services?.length ? (
                  <div className="mt-3 text-sm leading-6 text-gray-600">
                    <strong className="font-semibold text-gray-900">Services:</strong> {p.services.join(", ")}
                  </div>
                ) : null}

                {p.languages?.length ? (
                  <div className="mt-3 text-sm leading-6 text-gray-600">
                    <strong className="font-semibold text-gray-900">Languages:</strong> {p.languages.join(", ")}
                  </div>
                ) : null}

                <div className={btnRow}>
                  <a
                    className={buttonPrimary}
                    href={`/go/${p.slug}?from=${encodeURIComponent("/partners")}`}
                    data-track="partner_go"
                    data-partner={p.slug}
                  >
                    Visit (tracked)
                  </a>
                  <a
                    className={buttonSecondary}
                    href={`/contact?topic=${encodeURIComponent(p.category)}%20intro&partner=${encodeURIComponent(p.slug)}&from=${encodeURIComponent("/partners")}`}
                    data-track="partner_intro"
                    data-partner={p.slug}
                  >
                    Request intro
                  </a>
                </div>

                {p.note ? <div className="mt-4 text-xs leading-5 text-gray-600">{p.note}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
