import partners from "@/content/partners.json";

export type PartnerStatus = "owned" | "verified" | "check";

export type Partner = {
  slug: string;
  name: string;
  category: string;
  status: PartnerStatus;
  url: string;
  bestFor?: string;
  languages?: string[];
  areas?: string[];
  services?: string[];
  note?: string;
};

export function getPartners(): Partner[] {
  const all = (partners as any).partners as Partner[];
  const env = process.env.NODE_ENV;

  // Launch rule: public site should only show verified/owned.
  const allowed = env === "production" ? ["owned", "verified"] : ["owned", "verified", "check"];

  return (all || [])
    .filter((p) => allowed.includes(p.status))
    .sort((a, b) => {
      const score = (s: PartnerStatus) => (s === "owned" ? 0 : s === "verified" ? 1 : 2);
      return score(a.status) - score(b.status) || a.name.localeCompare(b.name);
    });
}

export function getPartnerBySlug(slug: string): Partner | null {
  const all = (partners as any).partners as Partner[];
  const p = (all || []).find((x) => x.slug === slug);
  return p || null;
}
