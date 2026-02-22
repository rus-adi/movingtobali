"use client";

import { useMemo, useState, type FormEvent } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (eventName: string, opts?: { props?: Record<string, any> }) => void;
  }
}

type Props = {
  topic: string;
  from?: string;
  partnerSlug?: string;
  partnerName?: string;
  fallbackMailto: string;
};

export default function ContactForm({ topic, from, partnerSlug, partnerName, fallbackMailto }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [mailto, setMailto] = useState(fallbackMailto);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [kidsAges, setKidsAges] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");

  // Honeypot (bots tend to fill it)
  const [company, setCompany] = useState("");

  const title = useMemo(() => {
    if (partnerName) return `Intro request: ${partnerName}`;
    if (partnerSlug) return `Intro request`;
    return `Contact`;
  }, [partnerName, partnerSlug]);

  function track(eventName: string, props: Record<string, any>) {
    try {
      if (typeof window.gtag === "function") window.gtag("event", eventName, props);
      if (typeof window.plausible === "function") window.plausible(eventName, { props });
    } catch {}
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !message.trim()) {
      setStatus("error");
      setErrorMsg("Please include at least your email and a short message.");
      track("contact_submit_error", { topic, partner: partnerSlug || "", reason: "missing_fields" });
      return;
    }

    setStatus("submitting");
    track("contact_submit_attempt", { topic, partner: partnerSlug || "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          from,
          partnerSlug,
          name,
          email,
          whatsapp,
          kidsAges,
          timeline,
          message,
          company, // honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        const msg = data?.error || "Something went wrong. Please email us instead.";
        if (data?.fallbackMailto) setMailto(data.fallbackMailto);
        setStatus("error");
        setErrorMsg(msg);
        track("contact_submit_error", { topic, partner: partnerSlug || "", reason: data?.code || "unknown" });
        return;
      }

      setStatus("success");
      track("contact_submit_success", { topic, partner: partnerSlug || "", mode: data?.mode || "unknown" });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg("Network error. Please email us instead.");
      track("contact_submit_error", { topic, partner: partnerSlug || "", reason: "network" });
    }
  }

  return (
    <div className="card">
      <strong>{title}</strong>
      <p style={{ marginTop: 10, color: "var(--muted)" }}>
        Share a few details and we’ll reply with next steps. If you’re requesting an intro, we’ll ask the partner if they can take new families.
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 12 }} aria-label="Contact form">
        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="name" style={{ fontSize: 13, color: "var(--muted)" }}>Full name (optional)</label>
          <input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="input" />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="email" style={{ fontSize: 13, color: "var(--muted)" }}>Email (required)</label>
          <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className="input" />
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="whatsapp" style={{ fontSize: 13, color: "var(--muted)" }}>WhatsApp / phone (optional)</label>
          <input id="whatsapp" name="whatsapp" type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} autoComplete="tel" className="input" />
        </div>

        <div className="grid2" style={{ gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="kidsAges" style={{ fontSize: 13, color: "var(--muted)" }}>Kids’ ages (optional)</label>
            <input id="kidsAges" name="kidsAges" value={kidsAges} onChange={(e) => setKidsAges(e.target.value)} placeholder="e.g., 3 and 7" className="input" />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label htmlFor="timeline" style={{ fontSize: 13, color: "var(--muted)" }}>Timeline (optional)</label>
            <input id="timeline" name="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g., moving in June, staying 6 months" className="input" />
          </div>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label htmlFor="message" style={{ fontSize: 13, color: "var(--muted)" }}>Message (required)</label>
          <textarea id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="input" />
        </div>

        {/* Honeypot field */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} className="input" />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <button className="button primary" type="submit" disabled={status === "submitting"} data-track="contact_submit_click" data-topic={topic}>
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>

          <a className="button secondary" href={mailto} data-track="contact_fallback_mailto" data-topic={topic}>
            Email instead
          </a>
        </div>

        <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
          By sending this form, you agree to our <a href="/privacy">Privacy Policy</a>.
        </div>

        {status === "success" ? (
          <div className="card" style={{ marginTop: 6, borderColor: "rgba(134,239,172,0.35)" }}>
            <strong>Received.</strong>
            <div style={{ marginTop: 8, color: "var(--muted)" }}>
              Thanks — we’ll respond by email as soon as we can.
            </div>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="card" style={{ marginTop: 6, borderColor: "rgba(251,113,133,0.35)" }}>
            <strong>Couldn’t send.</strong>
            <div style={{ marginTop: 8, color: "var(--muted)" }}>
              {errorMsg || "Please try again or email us directly."}
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
