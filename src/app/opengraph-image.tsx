import { ImageResponse } from "next/og";
import { getSite } from "@/lib/site";

export const runtime = "nodejs";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  const site = getSite();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 70,
          backgroundImage: "linear-gradient(135deg, #fbf7f0 0%, #ffffff 50%, #eef7f1 100%)",
          color: "#1f2a24",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05 }}>{site.brand.name}</div>
        <div style={{ marginTop: 16, maxWidth: 900, fontSize: 28, opacity: 0.9 }}>{site.seo.defaultDescription}</div>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center" }}>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 9999,
              border: "1px solid rgba(0,0,0,0.10)",
              fontSize: 18,
              marginRight: 12,
            }}
          >
            movingtobali.empathy.school
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 9999,
              border: "1px solid rgba(0,0,0,0.10)",
              fontSize: 18,
            }}
          >
            by Empathy School
          </div>
        </div>
      </div>
    ),
    size
  );
}
