import type { ContentItem } from "@/lib/content";

export type FaqItem = { q: string; a: string };

function nonEmpty(s: unknown): string {
  return String(s || "").trim();
}

function titleToAreaName(title: string, fallback: string): string {
  const t = nonEmpty(title);
  if (!t) return fallback;
  return t.replace(/\s+for\s+families\s*$/i, "").trim() || fallback;
}

export function buildAreaFaqs(item: ContentItem): FaqItem[] {
  const area = item.area;
  if (!area) return [];

  const areaName = titleToAreaName(item.title, item.slug);

  const pace = nonEmpty(area.pace);
  const traffic = nonEmpty(area.traffic);
  const walkability = nonEmpty(area.walkability);
  const familyFit = nonEmpty(area.familyFit);
  const beach = nonEmpty(area.beachAccess);
  const nature = nonEmpty(area.natureAccess);
  const noise = nonEmpty(area.noise);
  const cost = nonEmpty(area.costTier);
  const note = nonEmpty(area.note);

  const faqs: FaqItem[] = [];

  faqs.push({
    q: `Is ${areaName} a good fit for families?`,
    a: familyFit
      ? `${areaName} is generally rated as ${familyFit} for family fit in our hub. “Fit” still depends on your child’s age, your commute, and whether you prefer quiet routines or convenience. ${note ? `(${note})` : ""}`.trim()
      : `${areaName} can work for families, but “fit” depends heavily on your commute, your routine preferences, and the exact micro-area you choose.`,
  });

  if (pace) {
    faqs.push({
      q: `What is the pace like in ${areaName}?`,
      a: `Overall pace is ${pace}. When you visit, test it at real times (school run, grocery run, bedtime), not only midday.`,
    });
  }

  if (traffic) {
    faqs.push({
      q: `How is traffic in ${areaName}?`,
      a: `Traffic is typically ${traffic}. For families, the practical question is: can you do your daily commute in a way that still feels calm? Try the route at peak times before you commit.`,
    });
  }

  if (walkability) {
    faqs.push({
      q: `Is ${areaName} walkable?`,
      a: `Walkability is ${walkability}. Even “walkable” areas can vary block by block—choose your exact street based on school run + errands, not photos.`,
    });
  }

  if (beach) {
    faqs.push({
      q: `How easy is beach access from ${areaName}?`,
      a: `Beach access is generally ${beach}. If beach time is a weekly non-negotiable for your family, test the drive in real traffic (not Google Maps at midnight).`,
    });
  }

  if (nature) {
    faqs.push({
      q: `How easy is nature access from ${areaName}?`,
      a: `Nature access is generally ${nature}. If “nature time” is one of your family’s core values, prioritize areas where you can do it without a big commute.`,
    });
  }

  if (noise) {
    faqs.push({
      q: `How noisy is ${areaName}?`,
      a: `Noise level is typically ${noise}. In Bali, noise can change dramatically between two nearby streets—visit at night, not just in the morning.`,
    });
  }

  if (cost) {
    faqs.push({
      q: `Is ${areaName} more budget-friendly or premium?`,
      a: `Cost tier is generally ${cost}. Your biggest swing factors are housing (rent + deposits), transport, and how often you eat out vs cook.`,
    });
  }

  // A closing “how to choose micro-area” question (always useful)
  faqs.push({
    q: `What’s the best way to choose the exact micro-area in ${areaName}?`,
    a: `Do a short test-stay (7–14 days if you can) and run real-life routines: school route, groceries, evenings, rainy-day backup plans. Then pick the street—not the Instagram photo.`,
  });

  // Keep it within a reasonable range.
  return faqs.slice(0, 10);
}

export function getEffectiveFaqs(item: ContentItem): FaqItem[] {
  const explicit = Array.isArray(item.faqs)
    ? (item.faqs as any[])
        .map((f) => ({ q: nonEmpty((f as any)?.q), a: nonEmpty((f as any)?.a) }))
        .filter((f) => f.q && f.a)
    : [];

  // Area pages benefit from a consistent “at a glance” FAQ, even if no custom FAQs exist yet.
  const auto = item.kind === "areas" ? buildAreaFaqs(item) : [];

  if (!auto.length) return explicit;

  const seen = new Set(explicit.map((f) => f.q.toLowerCase()));
  auto.forEach((f) => {
    if (!seen.has(f.q.toLowerCase())) explicit.push(f);
  });

  return explicit;
}
