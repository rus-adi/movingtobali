export type AreaMeta = {
  pace?: string;
  traffic?: string;
  walkability?: string;
  familyFit?: string;
  beachAccess?: string;
  natureAccess?: string;
  noise?: string;
  costTier?: string;
  note?: string;
};

export type AreaItem = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  area?: AreaMeta;
};

export type AreaProfile = {
  calm: number;
  easy: number;
  social: number;
  practical: number;
  empathy: number;
  toddler: number;
  primary: number;
  teen: number;
  walkability: number;
  shortStay: number;
};

export const AREA_PROFILES: Record<string, AreaProfile> = {
  amed: { calm: 5, easy: 1, social: 1, practical: 1, empathy: 1, toddler: 2, primary: 2, teen: 2, walkability: 1, shortStay: 2 },
  berawa: { calm: 1, easy: 2, social: 5, practical: 3, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 3, shortStay: 4 },
  canggu: { calm: 1, easy: 2, social: 5, practical: 2, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 2, shortStay: 4 },
  denpasar: { calm: 2, easy: 4, social: 2, practical: 5, empathy: 2, toddler: 3, primary: 3, teen: 2, walkability: 3, shortStay: 2 },
  jimbaran: { calm: 4, easy: 4, social: 2, practical: 3, empathy: 2, toddler: 4, primary: 4, teen: 3, walkability: 2, shortStay: 3 },
  kerobokan: { calm: 3, easy: 3, social: 3, practical: 4, empathy: 1, toddler: 3, primary: 3, teen: 3, walkability: 2, shortStay: 3 },
  "nusa-dua": { calm: 4, easy: 3, social: 1, practical: 2, empathy: 1, toddler: 4, primary: 3, teen: 3, walkability: 2, shortStay: 3 },
  pererenan: { calm: 2, easy: 2, social: 4, practical: 2, empathy: 1, toddler: 3, primary: 3, teen: 4, walkability: 1, shortStay: 4 },
  renon: { calm: 3, easy: 4, social: 2, practical: 5, empathy: 2, toddler: 4, primary: 4, teen: 3, walkability: 3, shortStay: 2 },
  sanur: { calm: 4, easy: 5, social: 3, practical: 4, empathy: 2, toddler: 5, primary: 4, teen: 3, walkability: 4, shortStay: 5 },
  seminyak: { calm: 2, easy: 4, social: 4, practical: 4, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 4, shortStay: 4 },
  seseh: { calm: 4, easy: 3, social: 2, practical: 2, empathy: 1, toddler: 4, primary: 3, teen: 2, walkability: 1, shortStay: 3 },
  sidemen: { calm: 5, easy: 1, social: 1, practical: 1, empathy: 1, toddler: 3, primary: 2, teen: 1, walkability: 1, shortStay: 2 },
  ubud: { calm: 5, easy: 3, social: 2, practical: 3, empathy: 5, toddler: 4, primary: 5, teen: 3, walkability: 2, shortStay: 4 },
  uluwatu: { calm: 3, easy: 2, social: 3, practical: 1, empathy: 1, toddler: 2, primary: 3, teen: 4, walkability: 1, shortStay: 3 },
  umalas: { calm: 4, easy: 4, social: 3, practical: 4, empathy: 1, toddler: 4, primary: 4, teen: 3, walkability: 2, shortStay: 4 },
};

export function clamp(num: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, num));
}

export function cleanAreaTitle(title: string): string {
  return title.replace(/\sfor families$/i, "");
}

export function levelValue(value?: string): number {
  const s = String(value || "").trim().toLowerCase();
  if (!s) return 3;
  if (s === "high") return 5;
  if (["medium-high", "moderate-fast", "high-medium"].includes(s)) return 4;
  if (["medium", "moderate"].includes(s)) return 3;
  if (["low-medium", "moderate-slow", "medium-low"].includes(s)) return 2;
  if (["low", "slow"].includes(s)) return 1;
  if (s === "low-medium") return 2;
  if (s.includes("high")) return 4;
  if (s.includes("medium") || s.includes("moderate")) return 3;
  if (s.includes("low") || s.includes("slow")) return 1;
  return 3;
}

export function inverseLevelValue(value?: string): number {
  return 6 - levelValue(value);
}

export function getAreaProfile(slug: string): AreaProfile {
  return AREA_PROFILES[slug] || AREA_PROFILES.sanur;
}

export function weightedAverage(parts: Array<[number, number]>): number {
  const totalWeight = parts.reduce((sum, [, weight]) => sum + weight, 0);
  if (!totalWeight) return 0;
  const total = parts.reduce((sum, [value, weight]) => sum + value * weight, 0);
  return total / totalWeight;
}

export function toPercentFromFive(value: number): number {
  return clamp(Math.round((value / 5) * 100));
}
