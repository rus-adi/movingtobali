import Image from "next/image";
import Section from "@/components/Section";
import PostCard from "@/components/PostCard";
import { getSite } from "@/lib/site";
import { getAllContent } from "@/lib/content";
import { badgeAccent, btnRow, buttonPrimary, buttonSecondary, cardCls, grid2, grid3 } from "@/components/ui/styles";

type QuickItem = { title: string; href: string; track: string; code: string };

export default function HomePage() {
  const site = getSite();
  const pillars = getAllContent("pillars");
  const latestBlog = getAllContent("blog").slice(0, 6);
  const latestGuides = getAllContent("guides").slice(0, 6);
  const featuredAreas = getAllContent("areas").slice(0, 6);

  const quick: QuickItem[] = [
    { title: "Plan a Test Stay", href: "/start-here", track: "home_quick_teststay", code: "TS" },
    { title: "Choose an Area", href: "/areas", track: "home_quick_areas", code: "AR" },
    { title: "Visa Steps", href: "/visas", track: "home_quick_visas", code: "VS" },
    { title: "Set a Budget", href: "/costs", track: "home_quick_costs", code: "BU" },
    { title: "Explore Schools", href: "/schools", track: "home_quick_schools", code: "SC" },
  ];

  return (
    <main>
      {/* HERO (full-bleed, high-contrast) */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-bali.webp" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/20" />

        <div className="relative py-16 md:py-24">
          <div className="container">
            <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
              {/* Left: message */}
              <div className="space-y-6">
                <div className={badgeAccent}>Move to Bali with Kids — by Empathy School</div>

                <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
                  Moving to Bali With Kids? Here’s What We Wish We Knew.
                </h1>

                <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
                  Real guidance on schools, housing, visas, and daily life — from families who’ve already made the leap.
                </p>

                <div className={btnRow}>
                  <a className={buttonPrimary} href={site.ctas.primary.href} data-track="home_cta_start">
                    {site.ctas.primary.text}
                  </a>
                  <a className={buttonSecondary} href="/schools" data-track="home_cta_schools">
                    Explore schools
                  </a>
                </div>
              </div>

              {/* Right: quick panel */}
              <div className={cardCls + " bg-white/10 border-white/15 backdrop-blur"}>
                <strong className="text-sm font-semibold text-white">A calm way to start</strong>
                <p className="mt-4 text-sm leading-6 text-white/85">
                  Start with your timeline, then choose areas and routines first. Once daily life feels clear, visas and housing become much simpler decisions.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    className="group rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    href="/start-here"
                    data-track="home_hero_card_start"
                  >
                    Start Here <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
                  </a>
                  <a
                    className="group rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    href="/areas"
                    data-track="home_hero_card_areas"
                  >
                    Explore Areas <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Start tiles */}
            <div className="mt-12">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/20" />
                <h2 className="text-xl font-semibold tracking-tight text-white">Quick Start</h2>
                <div className="h-px flex-1 bg-white/20" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {quick.map((q) => (
                  <a
                    key={q.href}
                    href={q.href}
                    data-track={q.track}
                    className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-sm backdrop-blur transition hover:bg-white/15 hover:shadow-md"
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-xs font-semibold text-white"
                      aria-hidden
                    >
                      {q.code}
                    </span>
                    <span className="text-sm font-semibold">{q.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="pillars" title="Explore Bali life" lead="Start with a pillar, then follow the linked deep-dives." tone="default">
        <div className={grid3}>
          {pillars.map((p) => (
            <PostCard key={p.slug} item={p} />
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
          <a className={buttonPrimary} href="/areas" data-track="home_open_areas">
            Browse all areas
          </a>
        </div>
      </Section>

      <Section id="guides" title="Guides" lead="Evergreen, checklist-heavy guides that support the pillars." tone="default">
        <div className={grid2}>
          {latestGuides.map((g) => (
            <PostCard key={g.slug} item={g} />
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/guides" data-track="home_open_guides">
            Browse all guides
          </a>
          <a className={buttonSecondary} href="/resources" data-track="home_open_resources">
            Resources
          </a>
        </div>
      </Section>

      <Section id="blog" title="Latest from the Blog" lead="Short posts that answer one question at a time." tone="muted">
        <div className={grid2}>
          {latestBlog.map((p) => (
            <PostCard key={p.slug} item={p} />
          ))}
        </div>
        <div className={btnRow}>
          <a className={buttonPrimary} href="/blog" data-track="home_open_blog">
            View all posts
          </a>
        </div>
      </Section>
    </main>
  );
}
