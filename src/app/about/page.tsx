import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import RichTextBlock from "@/components/RichTextBlock";
import VideoBlock from "@/components/VideoBlock";
import { buildOrganizationSchema, buildWebPageSchema, buildWebSiteSchema } from "@/lib/schema";
import type { VideoBlock as VideoBlockType } from "@/lib/content";
import { badge, cardCls, pill } from "@/components/ui/styles";

export const metadata: Metadata = {
  title: "About",
  description: "What this site is, how we write, and how to get help moving to Bali with kids.",
  alternates: { canonical: "/about" },
};

const LAST_UPDATED = "2026-02-23";

const ABOUT_VIDEO: VideoBlockType = {
  youtubeId: "VvBVtTIXdbU",
  title: "Why Empathy School exists (short)",
  summary:
    "A short founder clip that explains the motivation behind Empathy School — and why this Move-to-Bali hub is intentionally calm, practical, and written for parents.",
  // A detailed recap is acceptable per the site standard when a full transcript isn't available.
  transcript:
    "Detailed recap (not verbatim)\n\n- Why we built Empathy School: to create a learning community that feels safe, grounded, and genuinely supportive for children and families.\n- Why this hub exists: families considering Bali face a lot of moving parts (visas, housing, schools, daily logistics). A calm roadmap reduces overwhelm.\n- The tone is intentional: practical steps, trade-offs, and checklists — not hype.\n\nIf you’re brand new to the idea, start with the Start Here pillar. If you’re already planning dates, jump to visas/housing/areas and work in a staged way.",
  uploadDate: "2026-02-23",
  permission: "owned",
  childrenVisible: false,
  consentConfirmed: false,
  ctaText: "Start here",
  ctaHref: "/start-here",
};

export default function AboutPage() {
  const schemas = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildWebPageSchema({ pathname: "/about", name: "About", description: "About Moving to Bali with Kids — by Empathy School." }),
  ];

  return (
    <main>
      <JsonLd data={schemas} />

      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className={badge}>About</div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">About this guide</h1>
          <p className="mt-4 text-base text-gray-600 sm:text-lg">
            <strong>Moving to Bali with Kids</strong> is a practical, parent-first content hub—built to reduce overwhelm and help families make good decisions.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-6">
          <VideoBlock video={ABOUT_VIDEO} />

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Founding story (supporting reel)</strong>
            <RichTextBlock className="mt-4">
              <p>
                Social posts are <strong>supporting context</strong>. The written policy on this page is the primary source of truth.
              </p>
              <p>
                If you’d like the short version of the backstory, this reel is a good companion:
              </p>
            </RichTextBlock>
            <div className="mt-4 flex flex-wrap gap-3">
              <a className={pill} href="https://www.instagram.com/empathy.school/reel/DPgZ3djEfrM/" target="_blank" rel="noreferrer" data-track="about_instagram_reel">
                Instagram: founder story
              </a>
              <a className={pill} href="https://www.youtube.com/watch?v=vTds0BelBf0" target="_blank" rel="noreferrer" data-track="about_youtube_founder_long">
                YouTube: longer founder story
              </a>
            </div>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">What you’ll find here</strong>
            <RichTextBlock className="mt-4">
              <ul>
                <li><strong>Pillars</strong> that map the big topics (visas, housing, areas, costs, family life).</li>
                <li><strong>Guides</strong> for the decisions that usually block families from moving forward.</li>
                <li><strong>Resources</strong> you can copy/paste and reuse (checklists, templates, planners).</li>
                <li><strong>Official links</strong> so you can verify anything that matters.</li>
              </ul>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">How we write (editorial policy)</strong>
            <RichTextBlock className="mt-4">
              <ul>
                <li>We write for parents and long-term families (not “digital nomad hype”).</li>
                <li>We prefer concrete steps, trade-offs, and checklists over generic advice.</li>
                <li>When something is time-sensitive (especially visas), we point you to official sources.</li>
              </ul>
              <p>
                If you spot something outdated, please <a href="/contact?topic=Correction">message us</a> and include the page URL.
              </p>
            </RichTextBlock>
          </div>

          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Connection to Empathy School</strong>
            <RichTextBlock className="mt-4">
              <p>
                This guide is published by <a href="https://empathy.school" target="_blank" rel="noreferrer">Empathy School</a>.
                We built it because many families considering Bali have the same questions—especially around learning, community, and day-to-day logistics.
              </p>
              <p>
                You can explore the school here: <a href="https://empathy.school" target="_blank" rel="noreferrer">empathy.school</a>.
              </p>
            </RichTextBlock>
          </div>

          {/* Notes & disclosures should live at the bottom of the page. */}
          <div className={cardCls}>
            <strong className="text-sm font-semibold text-gray-900">Notes & disclosures</strong>
            <RichTextBlock className="mt-4">
              <ul>
                <li>This site is not immigration, legal, medical, or tax advice.</li>
                <li>
                  Some pages include partner links (for example: visa agents, housing support, or services families often need). If you contact a partner through our site, we may receive a referral fee at no extra cost to you.
                </li>
              </ul>
              <p>
                Read the full policy on the <a href="/disclosure">Disclosure</a> page, or browse the public list on <a href="/partners">Partners</a>.
              </p>
            </RichTextBlock>
          </div>

          <div className="text-xs text-gray-500">Last updated: {LAST_UPDATED}</div>
        </div>
      </section>
    </main>
  );
}
