import Link from "next/link";
import { card, pill } from "@/components/ui/styles";

export default function SafetyNotice({ kind }: { kind: "visa" | "housing" | "general" }) {
  const title = kind === "visa" ? "Visa & residency note" : kind === "housing" ? "Housing note" : "Important note";
  const body =
    kind === "visa"
      ? "Visa rules can change quickly. This page shares experience-based guidance for families, not immigration or legal advice. Always confirm steps and requirements with official sources and a qualified professional."
      : kind === "housing"
        ? "Rental terms and norms vary a lot in Bali. This page shares experience-based guidance for families, not legal advice. Verify contracts, pricing, and terms independently."
        : "This page shares experience-based guidance for families. Verify any critical details with official sources.";

  return (
    <div className={`${card} p-6`}>
      <strong className="text-sm font-semibold text-gray-900">{title}</strong>
      <div className="mt-3 text-sm leading-6 text-gray-600">{body}</div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link className={pill} href="/official-links" data-track="notice_official_links">
          Official links
        </Link>
        <Link className={pill} href="/contact?topic=Question" data-track="notice_contact">
          Ask a question
        </Link>
      </div>
    </div>
  );
}
