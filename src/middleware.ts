import { NextRequest, NextResponse } from "next/server";

const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
] as const;

function cookieName(k: string) {
  return `mtb_${k}`;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const res = NextResponse.next();

  const nowIso = new Date().toISOString();

  // First-touch landing (only set once)
  if (!req.cookies.get("mtb_first_landing")) {
    res.cookies.set("mtb_first_landing", url.pathname, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.cookies.set("mtb_first_seen", nowIso, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Capture UTM + click IDs when present
  for (const k of ATTR_KEYS) {
    const v = url.searchParams.get(k);
    if (!v) continue;

    res.cookies.set(cookieName(k), v, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return res;
}

export const config = {
  // Avoid setting cookies on static assets and route handlers.
  matcher: [
    "/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image).*)",
  ],
};
