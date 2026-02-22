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

// ← tambahkan credentials di sini
const VALID_USER = "admin";
const VALID_PASS = "bali2026";

function isAuthenticated(req: NextRequest): boolean {
  const basicAuth = req.headers.get("authorization");
  if (!basicAuth) return false;
  const auth = basicAuth.split(" ")[1];
  if (!auth) return false;
  const [user, password] = atob(auth).split(":");
  return user === VALID_USER && password === VALID_PASS;
}

export function middleware(req: NextRequest) {
  // ← cek auth dulu sebelum lanjut
  if (!isAuthenticated(req)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Restricted Area"'
      }
    });
  }

  const url = req.nextUrl;
  const res = NextResponse.next();
  const nowIso = new Date().toISOString();

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
  matcher: [
    "/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml|opengraph-image|twitter-image).*)",
  ],
};