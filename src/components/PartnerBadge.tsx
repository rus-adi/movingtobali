import type { PartnerStatus } from "@/lib/partners";

export default function PartnerBadge({ status }: { status: PartnerStatus }) {
  if (status === "owned") return <span className="badge good">OWNED</span>;
  if (status === "verified") return <span className="badge good">✔ VERIFIED PARTNER</span>;
  return <span className="badge warn">★ CHECK</span>;
}
