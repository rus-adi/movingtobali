import { NextResponse } from "next/server";
import { getPartnerBySlug } from "@/lib/partners";
import { getSiteUrl } from "@/lib/site";
import { getAttributionFromCookies, appendInboundAttribution } from "@/lib/attribution";

export function GET(request: Request, { params }: { params: { slug: string } }) {
  const p = getPartnerBySlug(params.slug);
  if (!p) return NextResponse.redirect(new URL("/partners", request.url));

  // Launch rule: hide ★ CHECK in production
  if (process.env.NODE_ENV === "production" && p.status === "check") {
    return NextResponse.redirect(new URL("/partners", request.url));
  }

  const inbound = getAttributionFromCookies();

  const dest = new URL(p.url);

  // Partner-click UTMs (we keep these stable so partners can filter traffic).
  dest.searchParams.set("utm_source", "movingtobali.empathy.school");
  dest.searchParams.set("utm_medium", "referral");
  dest.searchParams.set("utm_campaign", "partner_directory");
  dest.searchParams.set("utm_content", p.slug);

  // Prefer explicit ?from= (we set it on internal buttons), otherwise referer, otherwise first landing cookie.
  const reqUrl = new URL(request.url);
  const fromParam = reqUrl.searchParams.get("from") || "";
  const referer = request.headers.get("referer") || "";
  const from = fromParam || referer || inbound.first_landing || "";
  if (from) dest.searchParams.set("utm_term", from.replace(getSiteUrl(), ""));

  // Preserve inbound campaign data without overriding the partner UTMs.
  appendInboundAttribution(dest, inbound);

  // Minimal server log for debugging attribution (no personal data).
  try {
    console.log(
      JSON.stringify({
        type: "partner_redirect",
        ts: new Date().toISOString(),
        partner: p.slug,
        from: from ? from.replace(getSiteUrl(), "") : "",
        inbound,
      })
    );
  } catch {}

  return NextResponse.redirect(dest);
}
