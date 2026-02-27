import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import ContactForm from "@/components/ContactForm";
import VideoBlock from "@/components/VideoBlock";
import { getSite } from "@/lib/site";
import { getPartnerBySlug } from "@/lib/partners";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import type { VideoBlock as VideoBlockType } from "@/lib/content";
import { badge, cardCls } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask a question about moving to Bali with kids or request an intro to a service provider.",
  alternates: { canonical: "/contact" },
};

type Props = { searchParams?: { topic?: string; from?: string; partner?: string } };

const CONTACT_VIDEO: VideoBlockType = {
  youtubeId: "VvBVtTIXdbU",
  title: "If you’re stuck, here’s the next step",
  summary:
    "If you’re stuck, tell us your timeline and your biggest question. We’ll reply with the next calm step.",
  transcript:
    "Detailed recap (not verbatim)\n\n- Tell us your timeline and your biggest question.\n- Include kids’ ages and what you’re trying to decide.\n- We’ll reply with the next calm step (and an intro if you requested one).\n",
  uploadDate: "2026-02-23",
  permission: "owned",
  childrenVisible: false,
  consentConfirmed: false,
  ctaText: "Start here",
  ctaHref: "/start-here",
};

export default function ContactPage({ searchParams }: Props) {
  const site = getSite();
  const topic = (searchParams?.topic || "General question").trim();
  const from = (searchParams?.from || "").trim();
  const partnerSlug = (searchParams?.partner || "").trim();

  const partner = partnerSlug ? getPartnerBySlug(partnerSlug) : null;
  const partnerName = partner?.name || "";

  const subject = `Moving to Bali with Kids — ${topic}`;
  const bodyLines = [
    `Hi Empathy School team,`,
    ``,
    `I have a question about: ${topic}`,
    partnerSlug ? `Partner intro requested: ${partnerName || partnerSlug}` : "",
    from ? `Source page: ${from}` : "",
    ``,
    `Our family situation (kids ages, timeline, etc.):`,
    `-`,
    ``,
    `What we’ve already done:`,
    `-`,
    ``,
    `What we’re trying to decide right now:`,
    `-`,
    ``,
    `Thanks!`,
  ].filter(Boolean);

  const mailto = `mailto:${encodeURIComponent(site.brand.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/contact", name: "Contact", description: "Contact the team behind Moving to Bali with Kids." }),
  ];

  const showDisclosure = topic.toLowerCase().includes("intro") || Boolean(partnerSlug);

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Contact</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Ask a question</h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            We keep contact simple on purpose. If you need an intro to a provider, tell us your situation and we’ll reply with next steps.
          </p>

          {/* MEDIA RULE: One YouTube embed directly below H1/intro */}
          <div className="mt-8 w-full">
            <VideoBlock video={CONTACT_VIDEO} />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6">
          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Topic</strong>
            <div className="mt-3 text-sm leading-6 text-gray-600">{topic}</div>
            {partnerSlug ? (
              <div className="mt-3 text-sm leading-6 text-gray-600">
                <strong className="font-semibold text-gray-900">Partner:</strong> {partnerName || partnerSlug}
              </div>
            ) : null}
          </div>

          <ContactForm
            topic={topic}
            from={from}
            partnerSlug={partnerSlug || undefined}
            partnerName={partnerName || undefined}
            fallbackMailto={mailto}
          />

          {/* Instagram embed after early content (never at the very top) */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <iframe
              src="https://www.instagram.com/reel/DPAad8bgTCI/embed"
              title="Empathy School (Instagram)"
              loading="lazy"
              className="w-full"
              style={{ minHeight: 520 }}
            />
          </div>

          <div className={cardCls}>
            <div className="text-sm leading-6 text-gray-600">
              Prefer to self-serve? Start with <a href="/start-here" className="underline underline-offset-4">Start here</a> and then follow the pillar that matches your stage.
            </div>
          </div>

          {/* Legal/disclosure notices should live at the bottom of the page to keep the UX calm and action-first. */}
          {showDisclosure ? <DisclosureNotice compact /> : null}
        </div>
      </section>
    </main>
  );
}
