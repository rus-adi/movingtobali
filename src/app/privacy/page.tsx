import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect and use information on movingtobali.empathy.school.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "2026-02-22";

export default function PrivacyPage() {
  const site = getSite();
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/privacy", name: "Privacy Policy", description: "Privacy Policy for Moving to Bali with Kids." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section style={{ padding: "56px 0 18px 0" }}>
        <div className="container">
          <div className="badge">Privacy</div>
          <h1 className="h1" style={{ marginTop: 12 }}>Privacy Policy</h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            This policy explains what information we collect, how we use it, and the choices you have.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 60px 0" }}>
        <div className="container" style={{ display: "grid", gap: 18 }}>
          <div className="card">
            <strong>Summary</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <ul>
                <li>We collect information you submit via forms (like your email and message).</li>
                <li>We may use analytics to understand what content helps families most.</li>
                <li>We do not sell your personal information.</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <strong>Information we collect</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p><strong>Contact form:</strong> when you use our contact form, you may provide your name, email, phone/WhatsApp, kids’ ages, timeline, and message.</p>
              <p><strong>Usage analytics:</strong> we may collect anonymous or pseudonymous usage data (page views, clicks, referral sources) to improve the site.</p>
              <p><strong>Partner link tracking:</strong> if you click a partner link, we may store basic attribution (like UTM parameters) so we can understand what’s working and prevent spam/abuse.</p>
            </div>
          </div>

          <div className="card">
            <strong>How we use information</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <ul>
                <li>To respond to your message or intro request.</li>
                <li>To improve site content and user experience.</li>
                <li>To measure whether pages are helpful (analytics).</li>
                <li>To prevent spam and abuse (basic rate limiting and bot detection).</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <strong>How messages are delivered</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                When you submit the contact form, your message is delivered to our team email or CRM.
                Delivery may be handled by an email service provider (for example Resend) or a secure webhook integration.
              </p>
              <p>
                We only share the information needed to deliver your message and respond.
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Cookies</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                We may use cookies or similar technologies for analytics and attribution. For example, to remember the referral source (UTMs) and improve content.
              </p>
              <p>
                Analytics tools may include services like Google Analytics or Plausible (depending on how the site is configured).
              </p>
            </div>
          </div>

          <div className="card">
            <strong>Your choices</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <ul>
                <li>You can avoid submitting personal details by emailing us directly at <a href={`mailto:${site.brand.contactEmail}`}>{site.brand.contactEmail}</a>.</li>
                <li>You can disable cookies in your browser settings (may impact some site features).</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <strong>Contact</strong>
            <div className="prose" style={{ marginTop: 10 }}>
              <p>
                Questions about privacy? Contact us at <a href={`mailto:${site.brand.contactEmail}`}>{site.brand.contactEmail}</a> or via <a href="/contact?topic=Privacy">Contact</a>.
              </p>
              <p style={{ color: "var(--muted)" }}>
                Note: this page is informational and not legal advice. If you need legal guidance, consult a qualified professional.
              </p>
            </div>
          </div>

          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Last updated: {LAST_UPDATED}
          </div>
        </div>
      </section>
    </main>
  );
}
