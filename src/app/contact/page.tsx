import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import DisclosureNotice from "@/components/DisclosureNotice";
import ContactForm from "@/components/ContactForm";
import { getSite } from "@/lib/site";
import { getPartnerBySlug } from "@/lib/partners";
import {
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
} from "@/lib/schema";
import {
  CONTACT_TOPIC_PRESETS,
  buildContactHref,
  getContactPreset,
  getContactPresetById,
} from "@/lib/contact";
import {
  getConversationRouteDetail,
  getSourceConversationContext,
} from "@/lib/conversion";
import {
  badge,
  badgeAccent,
  buttonSecondary,
  cardCls,
} from "@/components/ui/styles";
import {
  getOfficialEmpathySchoolUrl,
  schoolPlanningGuideActionLabel,
  schoolPlanningGuideHref,
  schoolPlanningGuideLabel,
} from "@/lib/schoolLinks";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Ask a question about moving to Bali with kids or request an intro to a service provider.",
  alternates: { canonical: "/contact" },
};

type Props = {
  searchParams?: {
    topic?: string;
    from?: string;
    partner?: string;
    route?: string;
  };
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
    buildWebPageSchema({
      pathname: "/contact",
      name: "Contact",
      description: "Contact the team behind Moving to Bali with Kids.",
    }),
  ];

  const showDisclosure =
    topic.toLowerCase().includes("intro") || Boolean(partnerSlug);
  const usefulLinks = (sourceContext?.prepLinks || routeDetail.prepLinks).slice(
    0,
    6,
  );
  const alternatives = (sourceContext?.alternativeRouteIds || [])
    .slice(0, 2)
    .map((id) => ({
      id,
      detail: getConversationRouteDetail(id),
    }));
  const officialSchoolUrl = getOfficialEmpathySchoolUrl();

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>Contact</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Ask a question or request the right introduction.
          </h1>
          <p className="mt-4 max-w-3xl text-base text-gray-700 sm:text-lg">
            This page now starts with the essentials: how to contact us, which
            route fits your question, and the form itself. If you already know
            the decision you are trying to make, pick the route that matches it
            and keep the message short and specific.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className={cardCls}>
              <div className={badgeAccent}>Direct email</div>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                Prefer to write directly? Use the email below and include your
                family timing, kids’ ages, and the one decision you want help
                with.
              </p>
              <a
                className="mt-5 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4"
                href={`mailto:${site.brand.contactEmail}`}
              >
                {site.brand.contactEmail}
              </a>
            </div>

            <div className={cardCls}>
              <div className={badgeAccent}>Current route</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={badge}>{preset.label}</span>
                <span className={badgeAccent}>{topic}</span>
                {partnerSlug ? (
                  <span className={badge}>
                    Partner: {partnerName || partnerSlug}
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                {routeDetail.summary}
              </p>
            </div>

            <div className={cardCls}>
              <div className={badgeAccent}>Official school site</div>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                If the next step is a direct look at the school itself, go
                straight to the official Empathy School site. If you still need
                context first, use the hub’s school planning guide.
              </p>
              <div className="mt-5 grid gap-3">
                <a
                  className={buttonSecondary}
                  href={officialSchoolUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-track="contact_official_school"
                >
                  Visit Empathy School
                </a>
                <Link
                  className={buttonSecondary}
                  href={schoolPlanningGuideHref}
                  data-track="contact_school_planning_guide"
                >
                  {schoolPlanningGuideActionLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            {sourceContext ? (
              <div className={cardCls}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badgeAccent}>Best route from here</span>
                  <span className={badge}>{preset.label}</span>
                  {from ? <span className={badge}>From: {from}</span> : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-700">
                  {sourceContext.reason}
                </p>
              </div>
            ) : null}

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                Before you send the form
              </strong>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={badgeAccent}>{preset.label}</span>
                <span className={badge}>{topic}</span>
                {partnerSlug ? (
                  <span className={badge}>
                    Partner: {partnerName || partnerSlug}
                  </span>
                ) : null}
                {from ? <span className={badge}>From: {from}</span> : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-700">
                {routeDetail.bestWhen}
              </p>
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
              <strong className="text-sm font-semibold text-gray-900">
                Choose a route
              </strong>
              <p className="mt-3 text-sm leading-6 text-gray-700">
                Pick the option that sounds closest to the decision your family
                is trying to make now.
              </p>
              <div className="mt-4 grid gap-3">
                {CONTACT_TOPIC_PRESETS.map((item) => {
                  const selected = item.id === preset.id;
                  return (
                    <a
                      key={item.id}
                      href={buildContactHref(item.topic, {
                        from,
                        partner: item.partnerSlug || undefined,
                        routeId: item.id,
                      })}
                      data-track="contact_topic_pick"
                      data-topic={item.topic}
                      data-route={item.id}
                      className={`rounded-2xl border p-4 transition ${
                        selected
                          ? "border-emerald-300 bg-emerald-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {item.description}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                What to include
              </strong>
              <ul className="mt-4 list-disc pl-5 text-sm leading-6 text-gray-700">
                {preset.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                Useful before you hit send
              </strong>
              <div className="mt-4 grid gap-3">
                {usefulLinks.map((link) => (
                  <a
                    key={link.href}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
                  href="/conversation-paths"
                  data-track="contact_compare_routes"
                >
                  Compare all conversation paths
                </a>
                <a
                  className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
                  href={mailto}
                >
                  Email {site.brand.contactEmail}
                </a>
              </div>
            </div>

            {alternatives.length ? (
              <div className={cardCls}>
                <strong className="text-sm font-semibold text-gray-900">
                  If this still feels too early
                </strong>
                <p className="mt-3 text-sm leading-6 text-gray-700">
                  That usually means another route would serve the family better
                  first. Use one of these alternatives instead of forcing the
                  wrong conversation.
                </p>
                <div className="mt-4 grid gap-3">
                  {alternatives.map(({ id, detail }) => (
                    <a
                      key={id}
                      className={buttonSecondary}
                      href={buildContactHref(detail.topic, {
                        from,
                        routeId: id,
                      })}
                      data-track="contact_alternative_route"
                      data-route={detail.analyticsKey}
                    >
                      {detail.label}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">
                Quick contact options
              </strong>
              <div className="mt-4 grid gap-3">
                <a
                  className={buttonSecondary}
                  href={`mailto:${site.brand.contactEmail}`}
                  data-track="contact_quick_email"
                >
                  Email {site.brand.contactEmail}
                </a>
                <a
                  className={buttonSecondary}
                  href={officialSchoolUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-track="contact_quick_official_school"
                >
                  Visit Empathy School
                </a>
                <Link
                  className={buttonSecondary}
                  href={schoolPlanningGuideHref}
                  data-track="contact_quick_school_guide"
                >
                  {schoolPlanningGuideLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {showDisclosure ? (
          <div className="container mt-8">
            <DisclosureNotice compact />
          </div>
        ) : null}
      </section>
    </main>
  );
}
