import type { Metadata } from "next";
import "@/app/theme.css";
import "@/app/globals.css";
import Analytics from "@/components/Analytics";
import ClickTracker from "@/components/ClickTracker";
import { getSite, getSiteUrl } from "@/lib/site";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: site.seo.defaultTitle,
    template: `%s | ${site.brand.name}`,
  },
  description: site.seo.defaultDescription,
  keywords: site.seo.keywords,
  verification: site.seo.googleSiteVerification ? { google: site.seo.googleSiteVerification } : undefined,
  openGraph: {
    title: site.seo.defaultTitle,
    description: site.seo.defaultDescription,
    url: getSiteUrl(),
    siteName: site.brand.name,
    images: [{ url: "/opengraph-image" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.defaultTitle,
    description: site.seo.defaultDescription,
    images: ["/twitter-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Analytics />
        <ClickTracker />

        <header>
          <div className="container">
            <div className="nav">
              <a className="brand" href="/" data-track="nav_home">
                <span className="brandMark" aria-hidden />
                <span>{site.brand.name}</span>
              </a>

              <nav className="navLinks" aria-label="Primary navigation">
                <a href="/start-here" data-track="nav_start">Start here</a>
                <a href="/visas" data-track="nav_visas">Visas</a>
                <a href="/housing" data-track="nav_housing">Housing</a>
                <a href="/areas" data-track="nav_areas">Areas</a>
                <a href="/costs" data-track="nav_costs">Costs</a>
                <a href="/family-life" data-track="nav_family">Family life</a>
                <a href="/guides" data-track="nav_guides">Guides</a>
                <a href="/blog" data-track="nav_blog">Blog</a>
                <a href="/resources" data-track="nav_resources">Resources</a>
                <a href="/partners" data-track="nav_partners">Partners</a>
                <a href="/contact" data-track="nav_contact">Contact</a>
                <a href="/faq" data-track="nav_faq">FAQ</a>
                <a href="/official-links" data-track="nav_official">Official links</a>
                <a className="button secondary" href={site.ctas.empathy.href} data-track="nav_empathy">Empathy School</a>
              </nav>
            </div>
          </div>
        </header>

        {children}

        <footer>
          <div className="container">
            <div className="footerGrid">
              <div>
                <div style={{ fontWeight: 650, color: "var(--text)" }}>{site.brand.name}</div>
                <div style={{ marginTop: 8, maxWidth: 520 }}>
                  {site.brand.tagline}
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a className="pill" href={site.brand.publisherUrl} target="_blank" rel="noreferrer" data-track="footer_empathy">
                    Visit Empathy School
                  </a>
                  <a className="pill" href={site.brand.social.youtube} target="_blank" rel="noreferrer" data-track="footer_youtube">
                    YouTube
                  </a>
                  <a className="pill" href={site.brand.social.instagram} target="_blank" rel="noreferrer" data-track="footer_instagram">
                    Instagram
                  </a>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 650, color: "var(--text)" }}>Site</div>
                <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                  <a href="/start-here">Start here</a>
                  <a href="/areas">Bali areas</a>
                  <a href="/costs">Costs</a>
                  <a href="/family-life">Family life</a>
                  <a href="/guides">Guides</a>
                  <a href="/blog">Blog</a>
                  <a href="/resources">Resources</a>
                  <a href="/partners">Partners</a>
                  <a href="/contact">Contact</a>
                  <a href="/about">About</a>
                  <a href="/disclosure">Disclosure</a>
                  <a href="/privacy">Privacy</a>
                  <a href="/terms">Terms</a>
                  <a href="/faq">FAQ hub</a>
                  <a href="/official-links">Official links</a>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 22, fontSize: 13, opacity: 0.75 }}>
              Disclaimer: This site shares experience-based guidance for families. It is not immigration, legal, or tax advice. Rules and pricing can change—verify via official sources.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}