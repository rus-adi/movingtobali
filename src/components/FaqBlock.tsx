import Link from "next/link";
import type { FaqItem } from "@/lib/faqs";
import { badge, badgeAccent, cardCls } from "@/components/ui/styles";

export default function FaqBlock({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs || !faqs.length) return null;

  return (
    <section aria-label="Frequently asked questions" className={cardCls}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={badge}>FAQ</span>
        <Link className={badgeAccent} href="/faq" data-track="faq_browse_all" data-url="/faq">
          Browse all questions
        </Link>
      </div>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-gray-900">Questions families ask</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Short answers first. If you want deeper context, use the links above or explore related guides.
      </p>

      <div className="mt-6 grid gap-3">
        {faqs.slice(0, 10).map((f, idx) => (
          <details key={`${f.q}-${idx}`} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900">{f.q}</summary>
            <p className="mt-3 text-sm leading-6 text-gray-700">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
