import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#f7f8fa",
        color: "#14161c",
      }}
    >
      <div style={{ display: "flex", fontSize: 32, fontWeight: 800 }}>
        usama<span style={{ color: "#0f766e" }}>.</span>khaki
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            color: "#0f766e",
            fontWeight: 700,
          }}
        >
          {`${profile.role} · ${profile.location}`}
        </div>
        <div style={{ marginTop: 20, fontSize: 30, color: "#4a505c" }}>
          10+ years in React, Next.js, Node and Laravel
        </div>
      </div>
    </div>,
    size,
  );
}
