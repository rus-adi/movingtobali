import { ImageResponse } from "next/og";
import { getSite } from "@/lib/site";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 600,
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
          background: "linear-gradient(135deg, #fbf7f0 0%, rgba(47,107,79,0.14) 45%, rgba(143,185,150,0.18) 100%)",
          color: "#1f2a24",
          fontFamily: "ui-sans-serif, system-ui",
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05 }}>{site.brand.name}</div>
        <div style={{ fontSize: 28, marginTop: 18, opacity: 0.92, maxWidth: 900 }}>
          {site.seo.defaultDescription}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
          <div style={{ padding: "10px 14px", borderRadius: 999, border: "1px solid rgba(31,42,36,0.18)", fontSize: 18 }}>
            movingtobali.empathy.school
          </div>
          <div style={{ padding: "10px 14px", borderRadius: 999, border: "1px solid rgba(31,42,36,0.18)", fontSize: 18 }}>
            by Empathy School
          </div>
        </div>
      </div>
    ),
    size
  );
}
