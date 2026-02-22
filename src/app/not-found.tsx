import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="card">
            <div className="badge warn">404</div>
            <h1 className="h1" style={{ marginTop: 12 }}>Page not found</h1>
            <p className="lead">
              Try the main hubs below.
            </p>
            <div className="btnRow">
              <Link className="button primary" href="/start-here">Start here</Link>
              <Link className="button secondary" href="/areas">Areas</Link>
              <Link className="button secondary" href="/guides">Guides</Link>
              <Link className="button secondary" href="/blog">Blog</Link>
              <Link className="button secondary" href="/resources">Resources</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
