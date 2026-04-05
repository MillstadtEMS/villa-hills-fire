import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get("size") ?? "192", 10);
  const isLarge = size >= 256;

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
          gap: isLarge ? 8 : 4,
        }}
      >
        <div
          style={{
            width: isLarge ? 140 : 80,
            height: isLarge ? 6 : 4,
            background: "#8B0000",
            borderRadius: 3,
            marginBottom: isLarge ? 16 : 8,
          }}
        />
        <span
          style={{
            color: "#ffffff",
            fontSize: isLarge ? 130 : 72,
            fontWeight: 900,
            fontFamily: "sans-serif",
            letterSpacing: isLarge ? -5 : -2,
            lineHeight: 1,
          }}
        >
          VHFD
        </span>
        <span
          style={{
            color: "#8B0000",
            fontSize: isLarge ? 32 : 18,
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: isLarge ? 10 : 5,
            marginTop: isLarge ? 8 : 4,
          }}
        >
          EST. 1955
        </span>
      </div>
    ),
    { width: size, height: size }
  );
}
