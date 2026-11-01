import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PJAM — One prompt. One shot. Prove it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c0a12 0%, #1a1224 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Hexagon "P" badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            background: "#a259ff",
            color: "#ffffff",
            fontSize: 90,
            fontWeight: 900,
            borderRadius: 28,
            border: "6px solid #efe9ff",
            marginBottom: 36,
          }}
        >
          P
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 900,
            color: "#efe9ff",
            letterSpacing: -2,
          }}
        >
          PJAM
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "#a259ff",
            marginTop: 16,
          }}
        >
          One prompt. One shot. Prove it.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 600,
            color: "#c9c9d6",
            marginTop: 28,
          }}
        >
          Real AI-judged prompt challenges · Tournaments · Daily Rush
        </div>
      </div>
    ),
    { ...size }
  );
}
