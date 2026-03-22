import type { Metadata } from "next";
import "@/app/globals.css";
import Analytics from "@/components/Analytics";
import ClickTracker from "@/components/ClickTracker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageProgress from "@/components/PageProgress";
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
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-stone-50 text-gray-900 antialiased selection:bg-emerald-100 selection:text-emerald-950">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-lg">
          Skip to content
        </a>
        <Analytics />
        <ClickTracker />
        <PageProgress />

        <Navbar />

        <div id="main-content">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
