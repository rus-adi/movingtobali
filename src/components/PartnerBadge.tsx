import type { PartnerStatus } from "@/lib/partners";
import { badgeGood, badgeWarn } from "@/components/ui/styles";

export default function PartnerBadge({ status }: { status: PartnerStatus }) {
  if (status === "owned") return <span className={badgeGood}>OWNED</span>;
  if (status === "verified") return <span className={badgeGood}>✔ VERIFIED PARTNER</span>;
  return <span className={badgeWarn}>★ CHECK</span>;
}
