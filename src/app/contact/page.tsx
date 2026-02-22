import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import ContactForm from "@/components/ContactForm";
import { getSite } from "@/lib/site";
import { getPartnerBySlug } from "@/lib/partners";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask a question about moving to Bali with kids or request an intro to a service provider.",
  alternates: { canonical: "/contact" },
};

type Props = { searchParams?: { topic?: string; from?: string; partner?: string } };

export default function ContactPage({ searchParams }: Props) {
  const site = getSite();
  const topic = (searchParams?.topic || "General question").trim();
  const from = (searchParams?.from || "").trim();
  const partnerSlug = (searchParams?.partner || "").trim();

  const partner = partnerSlug ? getPartnerBySlug(partnerSlug) : null;
  const partnerName = partner?.name || "";

  const subject = `Moving to Bali with Kids — ${topic}`;
  const bodyLines = [
    `Hi Empathy School team,`,
    ``,
    `I have a question about: ${topic}`,
    partnerSlug ? `Partner intro requested: ${partnerName || partnerSlug}` : "",
    from ? `Source page: ${from}` : "",
    ``,
    `Our family situation (kids ages, timeline, etc.):`,
    `-`,
    ``,
    `What we’ve already done:`,
    `-`,
    ``,
    `What we’re trying to decide right now:`,
    `-`,
    ``,
    `Thanks!`,
  ].filter(Boolean);

  const mailto = `mailto:${encodeURIComponent(site.brand.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/contact", name: "Contact", description: "Contact the team behind Moving to Bali with Kids." }),
  ];

  const showDisclosure = topic.toLowerCase().includes("intro") || Boolean(partnerSlug);

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 24px 0" }}>
        <div className="container">
          <div className="badge">Contact</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Ask a question</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            We keep contact simple on purpose. If you need an intro to a provider, tell us your situation and we’ll reply with next steps.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container" style={{ display: "grid", gap: 18 }}>
          {showDisclosure ? <DisclosureNotice compact /> : null}

          <div className="card">
            <strong>Topic</strong>
            <div style={{ marginTop: 10, color: "var(--muted)" }}>{topic}</div>
            {partnerSlug ? (
              <div style={{ marginTop: 10, color: "var(--muted)" }}>
                <strong>Partner:</strong> {partnerName || partnerSlug}
              </div>
            ) : null}
          </div>

          <ContactForm
            topic={topic}
            from={from}
            partnerSlug={partnerSlug || undefined}
            partnerName={partnerName || undefined}
            fallbackMailto={mailto}
          />

          <div className="card" style={{ color: "var(--muted)" }}>
            Prefer to self-serve? Start with <a href="/start-here">Start here</a> and then follow the pillar that matches your stage.
          </div>
        </div>
      </section>
    </main>
  );
}
