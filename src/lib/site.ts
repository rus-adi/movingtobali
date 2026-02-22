import site from "@/content/site.json";

export type SiteConfig = typeof site;

export function getSite(): SiteConfig {
  return site as SiteConfig;
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  return (fromEnv && fromEnv.trim()) || (site.brand.siteUrl || "http://localhost:3000");
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
