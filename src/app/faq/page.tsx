import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SearchBoxUrl from "@/components/SearchBoxUrl";
import { asInt, paginate } from "@/lib/pagination";
import { getAllContent } from "@/lib/content";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema, buildBreadcrumbSchema } from "@/lib/schema";
import { getSiteUrl } from "@/lib/site";
import { badge, btnRow, buttonDisabled, buttonSecondary, cardCls } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about moving to Bali with kids, with links to the deeper guides.",
  alternates: { canonical: "/faq" },
};

type FAQItem = {
  q: string;
  a: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceKind: string;
};

type Props = { searchParams?: { q?: string; page?: string } };

function routeFor(kind: string, slug: string) {
  return kind === "pillars" ? `/${slug}` : `/${kind}/${slug}`;
}

export default function FaqPage({ searchParams }: Props) {
  const q = (searchParams?.q || "").trim().toLowerCase();
  const page = asInt(searchParams?.page, 1);
  const pageSize = 20;

  const sources = [
    ...getAllContent("pillars"),
    ...getAllContent("guides"),
  ];

  const all: FAQItem[] = [];
  sources.forEach((s) => {
    (s.faqs || []).forEach((f) => {
      all.push({
        q: f.q,
        a: f.a,
        sourceTitle: s.title,
        sourceUrl: routeFor(s.kind, s.slug),
        sourceKind: s.kind,
      });
    });
  });

  const filtered = q
    ? all.filter((f) => `${f.q} ${f.a} ${f.sourceTitle}`.toLowerCase().includes(q))
    : all;

  const { total, items } = paginate(filtered, page, pageSize);

  const siteUrl = getSiteUrl();
  const schemas: any[] = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/faq", name: "FAQ", description: "Frequently asked questions about moving to Bali with kids." }),
    buildBreadcrumbSchema([
      { name: "Home", url: `${siteUrl}/` },
      { name: "FAQ", url: `${siteUrl}/faq` },
    ]),
  ];

  // FAQPage schema: keep this reasonably sized
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.slice(0, 10).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  if (faqSchema.mainEntity.length) schemas.push(faqSchema);

  const prevHref = `/faq?${new URLSearchParams({ q: q || "", page: String(Math.max(1, page - 1)) }).toString()}`;
  const nextHref = `/faq?${new URLSearchParams({ q: q || "", page: String(page + 1) }).toString()}`;

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>FAQ</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Questions parents ask</h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            Short answers here, then links to the deeper guide so you can act on it.
          </p>

          <div className="mt-8">
            <SearchBoxUrl placeholder="Search FAQs… (e.g., eVOA, deposit, school tour, Sanur)" />
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {total} question{total === 1 ? "" : "s"} found
          </div>

          <div className={btnRow}>
            <Link className={buttonSecondary} href="/start-here">Start here</Link>
            <Link className={buttonSecondary} href="/guides">Browse guides</Link>
            <Link className={buttonSecondary} href="/official-links">Official links</Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-6">
            {items.map((f, idx) => (
              <div key={`${f.sourceUrl}-${idx}`} className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">{f.q}</strong>
                <p className="mt-3 text-sm leading-6 text-gray-600">{f.a}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className={badge}>From</span>
                  <Link
                    href={f.sourceUrl}
                    className="font-semibold text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-700"
                    data-track="faq_source_open"
                    data-url={f.sourceUrl}
                  >
                    {f.sourceTitle}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {page > 1 ? (
              <Link className={buttonSecondary} href={prevHref}>Prev</Link>
            ) : (
              <span className={`${buttonSecondary} ${buttonDisabled}`}>Prev</span>
            )}
            <span className={badge}>Page {page}</span>
            {(page * pageSize) < total ? (
              <Link className={buttonSecondary} href={nextHref}>Next</Link>
            ) : (
              <span className={`${buttonSecondary} ${buttonDisabled}`}>Next</span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
