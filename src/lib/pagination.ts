export function asInt(v: string | undefined, fallback: number) {
  const n = Number(v || "");
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return { total, items: slice };
}
