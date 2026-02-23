export default function Section({
  id,
  title,
  lead,
  children,
  tone = "default",
}: {
  id?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <section
      id={id}
      className={tone === "muted" ? "bg-gray-50 py-16 md:py-24" : "bg-white py-16 md:py-24"}
    >
      <div className="container">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
          {lead ? <p className="text-base text-gray-600 sm:text-lg">{lead}</p> : null}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
