import { getSite } from "@/lib/site";
import { buttonSecondary, pill } from "@/components/ui/styles";

export default function Footer() {
  const site = getSite();

  return (
    <footer className="mt-16 border-t border-gray-100 py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-gray-900">{site.brand.name}</div>
            <div className="mt-4 max-w-md text-sm leading-6 text-gray-600">{site.brand.tagline}</div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className={pill}
                href={site.brand.publisherUrl}
                target="_blank"
                rel="noreferrer"
                data-track="footer_empathy"
              >
                Visit Empathy School
              </a>
              <a
                className={pill}
                href={site.brand.social.youtube}
                target="_blank"
                rel="noreferrer"
                data-track="footer_youtube"
              >
                YouTube
              </a>
              <a
                className={pill}
                href={site.brand.social.instagram}
                target="_blank"
                rel="noreferrer"
                data-track="footer_instagram"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Site</div>
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 sm:grid-cols-3">
              <a className="transition-colors hover:text-gray-900" href="/start-here">Start here</a>
              <a className="transition-colors hover:text-gray-900" href="/schools">Schools</a>
              <a className="transition-colors hover:text-gray-900" href="/camps">Camps</a>
              <a className="transition-colors hover:text-gray-900" href="/areas">Bali areas</a>
              <a className="transition-colors hover:text-gray-900" href="/costs">Costs</a>
              <a className="transition-colors hover:text-gray-900" href="/family-life">Family life</a>
              <a className="transition-colors hover:text-gray-900" href="/guides">Guides</a>
              <a className="transition-colors hover:text-gray-900" href="/blog">Blog</a>
              <a className="transition-colors hover:text-gray-900" href="/resources">Resources</a>
              <a className="transition-colors hover:text-gray-900" href="/partners">Partners</a>
              <a className="transition-colors hover:text-gray-900" href="/contact">Contact</a>
              <a className="transition-colors hover:text-gray-900" href="/about">About</a>
              <a className="transition-colors hover:text-gray-900" href="/disclosure">Disclosure</a>
              <a className="transition-colors hover:text-gray-900" href="/privacy">Privacy</a>
              <a className="transition-colors hover:text-gray-900" href="/terms">Terms</a>
              <a className="transition-colors hover:text-gray-900" href="/faq">FAQ hub</a>
              <a className="transition-colors hover:text-gray-900" href="/official-links">Official links</a>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a className={buttonSecondary} href={site.ctas.primary.href} data-track="footer_cta_start">
                {site.ctas.primary.text}
              </a>
              <a className={buttonSecondary} href={site.ctas.secondary.href} data-track="footer_cta_contact">
                {site.ctas.secondary.text}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-6 text-xs leading-5 text-gray-500">
          Disclaimer: This site shares experience-based guidance for families. It is not immigration, legal, or tax advice. Rules and pricing can change—verify via official sources.
        </div>
      </div>
    </footer>
  );
}
