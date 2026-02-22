import { cookies } from "next/headers";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  first_landing?: string;
  first_seen?: string;
};

const KEYMAP: Record<keyof Attribution, string> = {
  utm_source: "mtb_utm_source",
  utm_medium: "mtb_utm_medium",
  utm_campaign: "mtb_utm_campaign",
  utm_term: "mtb_utm_term",
  utm_content: "mtb_utm_content",
  gclid: "mtb_gclid",
  fbclid: "mtb_fbclid",
  first_landing: "mtb_first_landing",
  first_seen: "mtb_first_seen",
};

export function getAttributionFromCookies(): Attribution {
  const c = cookies();
  const a: Attribution = {};
  (Object.keys(KEYMAP) as (keyof Attribution)[]).forEach((k) => {
    const v = c.get(KEYMAP[k])?.value;
    if (v) (a as any)[k] = v;
  });
  return a;
}

export function attributionToText(a: Attribution): string {
  const lines: string[] = [];
  const push = (label: string, v?: string) => {
    if (!v) return;
    lines.push(`${label}: ${v}`);
  };

  push("First landing", a.first_landing);
  push("First seen", a.first_seen);

  push("utm_source", a.utm_source);
  push("utm_medium", a.utm_medium);
  push("utm_campaign", a.utm_campaign);
  push("utm_term", a.utm_term);
  push("utm_content", a.utm_content);

  push("gclid", a.gclid);
  push("fbclid", a.fbclid);

  return lines.length ? lines.join("\n") : "No attribution cookies found.";
}

/**
 * Append inbound attribution to an outbound URL without overriding the
 * outbound URL's primary UTM parameters.
 *
 * We use `mtb_*` parameters so partners can still see the original campaign.
 */
export function appendInboundAttribution(url: URL, a: Attribution) {
  if (a.utm_source) url.searchParams.set("mtb_in_utm_source", a.utm_source);
  if (a.utm_medium) url.searchParams.set("mtb_in_utm_medium", a.utm_medium);
  if (a.utm_campaign) url.searchParams.set("mtb_in_utm_campaign", a.utm_campaign);
  if (a.utm_term) url.searchParams.set("mtb_in_utm_term", a.utm_term);
  if (a.utm_content) url.searchParams.set("mtb_in_utm_content", a.utm_content);
  if (a.gclid) url.searchParams.set("mtb_gclid", a.gclid);
  if (a.fbclid) url.searchParams.set("mtb_fbclid", a.fbclid);
}
