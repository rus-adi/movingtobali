import { NextResponse } from "next/server";
import { getSite } from "@/lib/site";
import { getAttributionFromCookies, attributionToText } from "@/lib/attribution";

type Payload = {
  topic?: string;
  from?: string;
  partnerSlug?: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  kidsAges?: string;
  timeline?: string;
  message?: string;
  company?: string; // honeypot
};

const MAX_PER_HOUR = 5;
const WINDOW_MS = 60 * 60 * 1000;

// Note: this is in-memory and may reset on serverless cold starts.
// It's still useful to stop basic spam bursts.
const ipHits = new Map<string, number[]>();

function getIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  return real || "unknown";
}

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const prev = ipHits.get(ip) || [];
  const fresh = prev.filter((t) => now - t < WINDOW_MS);
  if (fresh.length >= MAX_PER_HOUR) {
    ipHits.set(ip, fresh);
    return false;
  }
  fresh.push(now);
  ipHits.set(ip, fresh);
  return true;
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function clamp(s: string | undefined, max: number): string {
  return (s || "").trim().slice(0, max);
}

async function sendViaResend(opts: { to: string; from: string; subject: string; text: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Missing RESEND_API_KEY");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend error: ${res.status} ${body}`.slice(0, 500));
  }
}

async function sendViaWebhook(url: string, payload: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Webhook error: ${res.status} ${body}`.slice(0, 500));
  }
}

export async function POST(req: Request) {
  const site = getSite();
  const ip = getIp(req);

  if (!rateLimitOk(ip)) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", error: "Too many requests. Please email us instead." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: Payload | null = null;
  try {
    body = (await req.json()) as Payload;
  } catch {
    body = null;
  }

  if (!body) {
    return NextResponse.json(
      { ok: false, code: "bad_json", error: "Invalid request." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Honeypot
  if (clamp(body.company, 120)) {
    return NextResponse.json(
      { ok: false, code: "spam", error: "Invalid request." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const topic = clamp(body.topic, 120) || "General question";
  const from = clamp(body.from, 200);
  const partnerSlug = clamp(body.partnerSlug, 80);

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 180);
  const whatsapp = clamp(body.whatsapp, 80);
  const kidsAges = clamp(body.kidsAges, 120);
  const timeline = clamp(body.timeline, 180);
  const message = clamp(body.message, 8000);

  if (!email || !isEmail(email) || !message) {
    return NextResponse.json(
      { ok: false, code: "validation", error: "Please include a valid email and a short message." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const attribution = getAttributionFromCookies();

  const subject = `Moving to Bali with Kids — ${topic}`;

  const text = [
    `New message from movingtobali.empathy.school`,
    ``,
    `Topic: ${topic}`,
    partnerSlug ? `Partner: ${partnerSlug}` : "",
    from ? `Source page: ${from}` : "",
    ``,
    `Name: ${name || "(not provided)"}`,
    `Email: ${email}`,
    whatsapp ? `WhatsApp/Phone: ${whatsapp}` : "",
    kidsAges ? `Kids’ ages: ${kidsAges}` : "",
    timeline ? `Timeline: ${timeline}` : "",
    ``,
    `Message:`,
    message,
    ``,
    `---`,
    `Attribution`,
    attributionToText(attribution),
  ].filter(Boolean).join("\n");

  const to = (process.env.CONTACT_TO_EMAIL || site.brand.contactEmail || "").trim();
  const fromEmail = (process.env.CONTACT_FROM_EMAIL || site.brand.contactEmail || "").trim();
  const webhook = (process.env.CONTACT_WEBHOOK_URL || "").trim();

  // Fallback mailto for cases where server-side delivery isn't configured.
  const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

  try {
    if (webhook) {
      await sendViaWebhook(webhook, {
        subject,
        topic,
        from,
        partnerSlug,
        name,
        email,
        whatsapp,
        kidsAges,
        timeline,
        message,
        attribution,
        ts: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, mode: "webhook" }, { headers: { "Cache-Control": "no-store" } });
    }

    if (process.env.RESEND_API_KEY) {
      await sendViaResend({ to, from: fromEmail, subject, text });
      return NextResponse.json({ ok: true, mode: "resend" }, { headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json(
      {
        ok: false,
        mode: "noop",
        code: "not_configured",
        error: "Contact delivery is not configured yet. Please email us instead.",
        fallbackMailto: mailto,
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, mode: "error", code: "send_failed", error: "Couldn’t send right now. Please email us instead.", fallbackMailto: mailto },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
