import Link from "next/link";
import { badge, badgeAccent, buttonSecondary, cardCls } from "@/components/ui/styles";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function TrustMetaStrip({
  updated,
  title = "Why this page exists",
  body,
  links = [],
}: {
  updated: string;
  title?: string;
  body: string;
  links?: { href: string; label: string }[];
}) {
  return (
    <div className={cardCls}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={badgeAccent}>Updated {formatDate(updated)}</span>
        <span className={badge}>Built by Empathy School</span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-gray-700">{body}</p>
      {links.length ? (
        <div className="mt-5 flex flex-wrap gap-3">
          {links.map((link) => (
            <Link key={link.href} className={buttonSecondary} href={link.href} data-track="trust_meta_open_link">
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
