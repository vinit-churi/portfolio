import { ImageResponse } from "next/og";
import { SITE_NAME } from "./site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOgImage(opts: {
  eyebrow: string;
  title: string;
  meta?: string;
}) {
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b3b3b3",
            }}
          >
            {opts.eyebrow}
          </span>
          <span
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b3b3b3",
            }}
          >
            {SITE_NAME}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: opts.title.length > 50 ? 60 : 76,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.08,
            }}
          >
            {opts.title}
          </span>
          {opts.meta && (
            <span style={{ fontSize: 22, color: "#d4d4d4", letterSpacing: 1 }}>
              {opts.meta}
            </span>
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
