import { badge, badgeAccent, cardCls, grid3 } from "@/components/ui/styles";
import type { HardLesson } from "@/lib/proof";

export default function LearnedHardWay({
  title = "What we learned the hard way",
  lead = "These are the patterns that keep showing up once families move from inspiration into real weekly life.",
  items,
}: {
  title?: string;
  lead?: string;
  items: HardLesson[];
}) {
  return (
    <div className="grid gap-6">
      <div className={cardCls}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={badgeAccent}>Lived-pattern notes</span>
          <span className={badge}>Practical trust</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{lead}</p>
      </div>

      <div className={grid3}>
        {items.map((item) => (
          <div key={item.title} className={cardCls}>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
