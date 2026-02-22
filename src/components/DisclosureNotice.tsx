import Link from "next/link";

export default function DisclosureNotice({ compact }: { compact?: boolean }) {
  return (
    <div className="card" style={{ padding: compact ? 14 : 18 }}>
      <strong>Disclosure</strong>
      <div style={{ marginTop: 8, color: "var(--muted)" }}>
        Some links on this site may be partner links. If you choose to contact a partner through our site, we may receive a referral fee at no extra cost to you.
        We only highlight partners we believe are aligned with families, and we encourage you to do your own due diligence.
      </div>
      <div style={{ marginTop: 10 }}>
        <Link className="pill" href="/disclosure" data-track="disclosure_learn_more">
          Learn more
        </Link>
      </div>
    </div>
  );
}
