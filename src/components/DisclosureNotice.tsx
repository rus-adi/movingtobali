import Link from "next/link";
import { card, cardPad, pill } from "@/components/ui/styles";

export default function DisclosureNotice({ compact }: { compact?: boolean }) {
  return (
    <div className={`${card} ${compact ? "p-5 md:p-6" : cardPad}`}>
      <strong className="text-sm font-semibold text-gray-900">Disclosure</strong>
      <div className="mt-3 text-sm leading-6 text-gray-700">
        Some links on this site may be partner links or tracked introduction routes. If you choose to contact a partner through our site, we may receive a referral fee at no extra cost to you.
        We keep the public partner layer intentionally narrow, and we still encourage you to do your own due diligence on fit, pricing, contracts, and service quality.
      </div>
      <div className="mt-4">
        <Link className={pill} href="/disclosure" data-track="disclosure_learn_more">
          Learn more
        </Link>
      </div>
    </div>
  );
}
