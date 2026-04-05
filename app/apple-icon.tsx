import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {/* Red bar accent */}
        <div
          style={{
            width: 64,
            height: 4,
            background: "#8B0000",
            borderRadius: 2,
            marginBottom: 8,
          }}
        />
        <span
          style={{
            color: "#ffffff",
            fontSize: 52,
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          VHFD
        </span>
        <span
          style={{
            color: "#8B0000",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          EST. 1955
        </span>
      </div>
    ),
    { ...size }
  );
}
