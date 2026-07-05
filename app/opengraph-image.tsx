import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const dynamic = "force-static"; // required for output: export
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share image, generated at build time (static-export friendly).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf9f5",
          color: "#141413",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#6f6e69" }}>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 600, lineHeight: 1.05 }}>
            {site.headlineLine1}
          </div>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 600, lineHeight: 1.05 }}>
            {site.headlineLine2}
          </div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 34, color: "#cc785c" }}>
            {site.role}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
