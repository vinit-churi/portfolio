import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0e0e0e 0%, #1c1b1b 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 10,
              height: 10,
              background: "#ffffff",
              borderRadius: 999,
            }}
          />
          <span
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b3b3b3",
            }}
          >
            VINIT.DEV
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 80, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
            {SITE_NAME}
          </span>
          <span style={{ fontSize: 28, color: "#d4d4d4", maxWidth: 900, lineHeight: 1.3 }}>
            {SITE_DESCRIPTION}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
