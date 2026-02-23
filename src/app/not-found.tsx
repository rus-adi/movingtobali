import Link from "next/link";
import { badgeWarn, btnRow, buttonPrimary, buttonSecondary, cardCls } from "@/components/ui/styles";

export default function NotFound() {
  return (
    <main>
      <section className="py-16 md:py-24">
        <div className="container">
          <div className={cardCls}>
            <div className={badgeWarn}>404</div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">
              Try the main hubs below.
            </p>
            <div className={btnRow}>
              <Link className={buttonPrimary} href="/start-here">Start here</Link>
              <Link className={buttonSecondary} href="/areas">Areas</Link>
              <Link className={buttonSecondary} href="/guides">Guides</Link>
              <Link className={buttonSecondary} href="/blog">Blog</Link>
              <Link className={buttonSecondary} href="/resources">Resources</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
