import Section from "@/components/Section";
import PostCard from "@/components/PostCard";
import { getSite } from "@/lib/site";
import { getAllContent } from "@/lib/content";
import { badgeAccent, badge, badgeGood, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

export default function HomePage() {
  const site = getSite();
  const pillars = getAllContent("pillars");
  const latestBlog = getAllContent("blog").slice(0, 6);
  const latestGuides = getAllContent("guides").slice(0, 6);
  const featuredAreas = getAllContent("areas").slice(0, 6);

  return (
    <main>
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className={badgeAccent}>Move to Bali with Kids — by Empathy School</div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                A calm, comprehensive guide to moving to Bali
              </h1>
              <p className="max-w-3xl text-base text-gray-600 sm:text-lg">
                Visas, housing, neighborhoods, learning, day-to-day logistics—written for parents, with checklists and lived experience.
              </p>

              <div className={btnRow}>
                <a className={buttonPrimary} href={site.ctas.primary.href} data-track="home_cta_start">{site.ctas.primary.text}</a>
                <a className={buttonSecondary} href={site.ctas.empathy.href} target="_blank" rel="noreferrer" data-track="home_cta_empathy">
                  {site.ctas.empathy.text}
                </a>
              </div>
            </div>

            <div className={cardCls}>
              <strong className="text-sm font-semibold text-gray-900">What this site is</strong>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                A content hub that answers the questions families actually type into Google when they’re considering Bali.
                It’s designed to be useful on its own, while naturally guiding the right families toward Empathy School.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="pillars"
        title="Start with a pillar"
        lead="Choose the topic that matches your stage, then follow the linked deep-dives."
        tone="default"
      >
        <div className={grid3}>
          {pillars.map((p) => (
            <div key={p.slug} className={cardCls}>
              <div className="flex flex-wrap gap-2">
                <span className={badge}>pillar</span>
                {p.video?.youtubeId ? <span className={badgeGood}>video</span> : null}
              </div>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-gray-900">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{p.description}</p>
              <div className={btnRow}>
                <a className={buttonPrimary} href={`/${p.slug}`} data-track="home_open_pillar" data-slug={p.slug}>
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="areas"
        title="Explore Bali areas"
        lead="Short, honest area guides for families—where it’s calm, where it’s busy, and what daily life feels like."
        tone="muted"
      >
        <div className={grid2}>
          {featuredAreas.map((a) => (
            <PostCard key={a.slug} item={a} />
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/areas" data-track="home_open_areas">Browse all areas</a>
        </div>
      </Section>

      <Section id="guides" title="Guides" lead="Evergreen, checklist-heavy guides that support the pillars." tone="default">
        <div className={grid2}>
          {latestGuides.map((g) => (
            <PostCard key={g.slug} item={g} />
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/guides" data-track="home_open_guides">Browse all guides</a>
          <a className={buttonSecondary} href="/resources" data-track="home_open_resources">Resources</a>
        </div>
      </Section>

      <Section
        id="blog"
        title="Latest from the blog"
        lead="Daily posts (shorter than guides) that answer one question at a time."
        tone="muted"
      >
        <div className={grid2}>
          {latestBlog.map((p) => (
            <PostCard key={p.slug} item={p} />
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/blog" data-track="home_open_blog">View all posts</a>
        </div>
      </Section>

      <Section
        id="cta"
        title="Want to learn about Empathy School?"
        lead="This hub is for families. Empathy School is the place many families choose once they decide Bali is right."
        tone="default"
      >
        <div className={cardCls}>
          <strong className="text-sm font-semibold text-gray-900">Empathy School</strong>
          <p className="mt-4 text-sm leading-6 text-gray-600">
            If you’re exploring school options or want to understand whether our approach fits your child, start here.
          </p>
          <div className={btnRow}>
            <a className={buttonPrimary} href={site.ctas.empathy.href} target="_blank" rel="noreferrer" data-track="home_empathy_open">
              {site.ctas.empathy.text}
            </a>
            <a className={buttonSecondary} href="/contact" data-track="home_contact_open">Ask a question</a>
          </div>
        </div>
      </Section>
    </main>
  );
}
