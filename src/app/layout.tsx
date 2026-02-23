import type { Metadata } from "next";
import "@/app/globals.css";
import Analytics from "@/components/Analytics";
import ClickTracker from "@/components/ClickTracker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Analytics />
        <ClickTracker />

        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}
