export default function Section({
  id,
  title,
  lead,
  children,
}: {
  id?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ padding: "54px 0" }}>
      <div className="container">
        <h2 className="h2">{title}</h2>
        {lead ? <p className="lead" style={{ maxWidth: 980 }}>{lead}</p> : null}
        <div style={{ marginTop: 18 }}>{children}</div>
      </div>
    </section>
  );
}
