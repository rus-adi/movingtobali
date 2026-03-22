import { NextResponse } from "next/server";
import { getPartnerBySlug } from "@/lib/partners";
import { getSiteUrl } from "@/lib/site";
import { getAttributionFromCookies, appendInboundAttribution } from "@/lib/attribution";

export function GET(request: Request, { params }: { params: { slug: string } }) {
  const p = getPartnerBySlug(params.slug);
  if (!p || !p.url) return NextResponse.redirect(new URL("/partners", request.url));

  if (process.env.NODE_ENV === "production" && p.status === "check") {
    return NextResponse.redirect(new URL("/partners", request.url));
  }

  const inbound = getAttributionFromCookies();
  const dest = new URL(p.url);

  dest.searchParams.set("utm_source", "movingtobali.empathy.school");
  dest.searchParams.set("utm_medium", "referral");
  dest.searchParams.set("utm_campaign", "partner_directory");
  dest.searchParams.set("utm_content", p.slug);

  const reqUrl = new URL(request.url);
  const fromParam = reqUrl.searchParams.get("from") || "";
  const referer = request.headers.get("referer") || "";
  const from = fromParam || referer || inbound.first_landing || "";
  if (from) dest.searchParams.set("utm_term", from.replace(getSiteUrl(), ""));

  appendInboundAttribution(dest, inbound);

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
