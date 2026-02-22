import Section from "@/components/Section";
import PostCard from "@/components/PostCard";
import { getSite } from "@/lib/site";
import { getAllContent } from "@/lib/content";

export default function HomePage() {
  const site = getSite();
  const pillars = getAllContent("pillars");
  const latestBlog = getAllContent("blog").slice(0, 6);
  const latestGuides = getAllContent("guides").slice(0, 6);
  const featuredAreas = getAllContent("areas").slice(0, 6);

  return (
    <main>
      <section style={{ padding: "70px 0 32px 0" }}>
        <div className="container">
          <div className="badge accent">Move to Bali with Kids — by Empathy School</div>
          <h1 className="h1" style={{ marginTop: 14 }}>
            A calm, comprehensive guide to moving to Bali
          </h1>
          <p className="lead" style={{ maxWidth: 980 }}>
            Visas, housing, neighborhoods, learning, day-to-day logistics—written for parents, with checklists and lived experience.
          </p>

          <div className="btnRow">
            <a className="button primary" href={site.ctas.primary.href} data-track="home_cta_start">{site.ctas.primary.text}</a>
            <a className="button secondary" href={site.ctas.empathy.href} target="_blank" rel="noreferrer" data-track="home_cta_empathy">
              {site.ctas.empathy.text}
            </a>
          </div>

          <div style={{ marginTop: 18 }} className="card">
            <strong>What this site is</strong>
            <p style={{ marginTop: 8, color: "var(--muted)" }}>
              A content hub that answers the questions families actually type into Google when they’re considering Bali.
              It’s designed to be useful on its own, while naturally guiding the right families toward Empathy School.
            </p>
          </div>
        </div>
      </section>

      <Section id="pillars" title="Start with a pillar" lead="Choose the topic that matches your stage, then follow the linked deep-dives.">
        <div className="grid3">
          {pillars.map((p) => (
            <div key={p.slug} className="card">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="badge">pillar</span>
                {p.video?.youtubeId ? <span className="badge good">video</span> : null}
              </div>
              <h3 style={{ marginTop: 12, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ marginTop: 0, color: "var(--muted)" }}>{p.description}</p>
              <div className="btnRow">
                <a className="button primary" href={`/${p.slug}`} data-track="home_open_pillar" data-slug={p.slug}>
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="areas" title="Explore Bali areas" lead="Short, honest area guides for families—where it’s calm, where it’s busy, and what daily life feels like.">
        <div className="grid2">
          {featuredAreas.map((a) => (
            <PostCard key={a.slug} item={a} />
          ))}
        </div>
        <div className="btnRow">
          <a className="button primary" href="/areas" data-track="home_open_areas">Browse all areas</a>
        </div>
      </Section>

      <Section id="guides" title="Guides" lead="Evergreen, checklist-heavy guides that support the pillars.">
        <div className="grid2">
          {latestGuides.map((g) => (
            <PostCard key={g.slug} item={g} />
          ))}
        </div>
        <div className="btnRow">
          <a className="button primary" href="/guides" data-track="home_open_guides">Browse all guides</a>
          <a className="button secondary" href="/resources" data-track="home_open_resources">Resources</a>
        </div>
      </Section>

      <Section id="blog" title="Latest from the blog" lead="Daily posts (shorter than guides) that answer one question at a time.">
        <div className="grid2">
          {latestBlog.map((p) => (
            <PostCard key={p.slug} item={p} />
          ))}
        </div>
        <div className="btnRow">
          <a className="button primary" href="/blog" data-track="home_open_blog">View all posts</a>
        </div>
      </Section>

      <Section id="cta" title="Want to learn about Empathy School?" lead="This hub is for families. Empathy School is the place many families choose once they decide Bali is right.">
        <div className="card">
          <strong>Empathy School</strong>
          <p style={{ marginTop: 10, color: "var(--muted)" }}>
            If you’re exploring school options or want to understand whether our approach fits your child, start here.
          </p>
          <div className="btnRow">
            <a className="button primary" href={site.ctas.empathy.href} target="_blank" rel="noreferrer" data-track="home_empathy_open">
              {site.ctas.empathy.text}
            </a>
            <a className="button secondary" href="/contact" data-track="home_contact_open">Ask a question</a>
          </div>
        </div>
      </Section>
    </main>
  );
}
