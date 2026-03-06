import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Todosh - A simple and fast Todo application";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const [geistSemiBold, iconData] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/Geist/static/Geist-SemiBold.ttf")),
    readFile(join(process.cwd(), "public/icons/icon-512x512.png"), "base64"),
  ]);
  const iconSrc = `data:image/png;base64,${iconData}`;

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
      }}
    >
      <img
        src={iconSrc}
        alt=""
        width={160}
        height={160}
        style={{ marginBottom: 32, borderRadius: 24 }}
      />
      <div
        style={{
          fontSize: 72,
          fontWeight: 600,
          color: "white",
          marginBottom: 16,
          fontFamily: "Geist",
        }}
      >
        Todosh
      </div>
      <div
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.7)",
          fontFamily: "Geist",
        }}
      >
        A simple and fast Todo application
      </div>
    </div>,
    {
      ...size,
      headers: {
        "Content-Type": "image/png",
      },
      fonts: [
        {
          name: "Geist",
          data: geistSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
