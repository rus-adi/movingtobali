import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import ContactForm from "@/components/ContactForm";
import VideoBlock from "@/components/VideoBlock";
import { getSite } from "@/lib/site";
import { getPartnerBySlug } from "@/lib/partners";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import type { VideoBlock as VideoBlockType } from "@/lib/content";
import { CONTACT_TOPIC_PRESETS, buildContactHref, getContactPreset, getContactPresetById } from "@/lib/contact";
import { buildConversationContactHref, getConversationRouteDetail, getSourceConversationContext } from "@/lib/conversion";
import { badge, badgeAccent, buttonSecondary, cardCls, grid2 } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ask a question about moving to Bali with kids or request an intro to a service provider.",
  alternates: { canonical: "/contact" },
};

type Props = { searchParams?: { topic?: string; from?: string; partner?: string; route?: string } };

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
  const requestedTopic = (searchParams?.topic || "").trim();
  const from = (searchParams?.from || "").trim();
  const partnerSlug = (searchParams?.partner || "").trim();
  const requestedRouteId = (searchParams?.route || "").trim();

  const sourceContext = from ? getSourceConversationContext(from) : null;
  const preset = requestedRouteId
    ? getContactPresetById(requestedRouteId)
    : requestedTopic
      ? getContactPreset(requestedTopic, partnerSlug)
      : sourceContext
        ? getContactPresetById(sourceContext.recommendedRouteId)
        : getContactPreset(undefined, partnerSlug);

  const routeDetail = getConversationRouteDetail(preset.id);
  const topic = requestedTopic || preset.topic;

  const partner = partnerSlug ? getPartnerBySlug(partnerSlug) : null;
  const partnerName = partner?.name || "";

  const subject = `Moving to Bali with Kids — ${topic}`;
  const bodyLines = [
    `Hi Empathy School team,`,
    ``,
    `I have a question about: ${topic}`,
    `Conversation route: ${preset.label}`,
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
  const usefulLinks = (sourceContext?.prepLinks || routeDetail.prepLinks).slice(0, 6);
  const alternatives = (sourceContext?.alternativeRouteIds || []).slice(0, 2).map((id) => ({
    id,
    detail: getConversationRouteDetail(id),
  }));

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/70 via-stone-100/40 to-emerald-100/65" />
        <div className="absolute inset-0 opacity-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-bali.webp" alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/15" aria-hidden="true" />
        <div className="relative py-16 md:py-24">
          <div className="container">
            <div className={badge}>Contact</div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Choose the right conversation without writing a novel</h1>
            <p className="mt-4 max-w-3xl text-base text-gray-600 sm:text-lg">
              This page works best when the topic matches the real decision your family is trying to solve now. Pick the route that sounds closest, then keep the message short and specific.
            </p>

            <div className="mt-8 w-full">
              <VideoBlock video={CONTACT_VIDEO} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-8">
          <div className={cardCls}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={badgeAccent}>Choose a route</span>
              {from ? <span className={badge}>From: {from}</span> : null}
              {partnerSlug ? <span className={badge}>Partner intro</span> : null}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {CONTACT_TOPIC_PRESETS.map((item) => {
                const selected = item.id === preset.id;
                return (
                  <a
                    key={item.id}
                    href={buildContactHref(item.topic, { from, partner: item.partnerSlug || undefined, routeId: item.id })}
                    data-track="contact_topic_pick"
                    data-topic={item.topic}
                    data-route={item.id}
                    className={`rounded-2xl border p-5 transition ${
                      selected
                        ? "border-blue-300 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
                  </a>
                );
              })}
            </div>
          </div>

          {sourceContext ? (
            <div className={cardCls}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={badgeAccent}>Best route from here</span>
                <span className={badge}>{preset.label}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{sourceContext.reason}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={badge}>Source: {sourceContext.sourceLabel}</span>
                <span className={badgeAccent}>Route: {routeDetail.label}</span>
              </div>
            </div>
          ) : null}

          <div className={grid2}>
            <div className="grid gap-6">
              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">Current route</strong>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className={badgeAccent}>{preset.label}</span>
                  <span className={badge}>{topic}</span>
                  {partnerSlug ? <span className={badge}>Partner: {partnerName || partnerSlug}</span> : null}
                  {from ? <span className={badge}>From: {from}</span> : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{routeDetail.summary}</p>
                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  <strong className="text-gray-900">Best when</strong>
                  <p className="mt-1">{routeDetail.bestWhen}</p>
                </div>
              </div>

              <ContactForm
                topic={topic}
                from={from}
                partnerSlug={partnerSlug || preset.partnerSlug || undefined}
                partnerName={partnerName || undefined}
                routeId={preset.id}
                routeLabel={preset.label}
                fallbackMailto={mailto}
                messagePlaceholder={preset.messagePlaceholder}
                timelinePlaceholder={preset.timelinePlaceholder}
              />
            </div>

            <div className="grid gap-6">
              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">What to include</strong>
                <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-600">
                  {preset.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>

              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">Useful before you hit send</strong>
                <div className="mt-4 grid gap-3">
                  {usefulLinks.map((link) => (
                    <a key={link.href} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white" href={link.href}>
                      {link.label}
                    </a>
                  ))}
                  <a className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white" href="/conversation-paths" data-track="contact_compare_routes">
                    Compare all conversation paths
                  </a>
                </div>
              </div>

              {alternatives.length ? (
                <div className={cardCls}>
                  <strong className="text-sm font-semibold text-gray-900">If this still feels too early</strong>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    That usually means another route would serve the family better first. Use one of these alternatives instead of forcing the wrong conversation.
                  </p>
                  <div className="mt-4 grid gap-3">
                    {alternatives.map(({ id, detail }) => (
                      <a
                        key={id}
                        className={buttonSecondary}
                        href={buildConversationContactHref(id, { from })}
                        data-track="contact_alternative_route"
                        data-route={detail.analyticsKey}
                      >
                        {detail.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <iframe
                  src="https://www.instagram.com/reel/DPAad8bgTCI/embed"
                  title="Empathy School (Instagram)"
                  loading="lazy"
                  className="w-full"
                  style={{ minHeight: 520 }}
                />
              </div>
            </div>
          </div>

          {showDisclosure ? <DisclosureNotice compact /> : null}
        </div>
      </section>
    </main>
  );
}
