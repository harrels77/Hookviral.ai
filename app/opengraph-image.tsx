import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social share card — generated at build. Brand rules from DESIGN-SYSTEM.md:
// light surface, single raspberry accent, gradient only on the wordmark,
// score ring in semantic green. Fonts are static-weight TTF instances in
// /assets/fonts (satori can't resolve variable-font weights).

export const alt = "HookViral — score your hook in 5 seconds, fix it in one click";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RING_R = 84;
const RING_C = 2 * Math.PI * RING_R;
const SCORE = 87;

export default async function OgImage() {
  const [syne, dmSans] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Syne-ExtraBold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/DMSans-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAFAFC",
          padding: "56px 64px",
          fontFamily: "DM Sans",
          position: "relative",
        }}
      >
        {/* Single quiet accent wash, top-right */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle at center, rgba(201,19,75,.10), rgba(201,19,75,0) 70%)",
            display: "flex",
          }}
        />

        {/* Left column — wordmark + headline */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, paddingRight: 48 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: "Syne",
                fontSize: 44,
                letterSpacing: "-1px",
                backgroundImage: "linear-gradient(135deg, #C9134B, #6D28D9)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Hook
            </span>
            <span style={{ fontFamily: "Syne", fontSize: 44, letterSpacing: "-1px", color: "#101019" }}>Viral</span>
            <span style={{ fontSize: 22, color: "#5F5E78", marginLeft: 4 }}>.ai</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Syne", fontSize: 52, lineHeight: 1.12, letterSpacing: "-1px", color: "#101019", display: "flex", flexDirection: "column" }}>
              <span>Score your hook</span>
              <span style={{ display: "flex" }}>
                in&nbsp;<span style={{ color: "#C9134B" }}>5 seconds</span>,
              </span>
              <span>fix it in one click</span>
            </div>
            <div style={{ marginTop: 24, fontSize: 25, color: "#454458", display: "flex" }}>
              Free AI retention scoring for TikTok, Reels &amp; Shorts
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            {["No account", "10 free hooks/day", "9 patterns"].map((t, i) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1.5px solid #E3E3EC",
                  background: "#FFFFFF",
                  color: "#5F5E78",
                  fontSize: 21,
                  whiteSpace: "nowrap",
                  marginRight: i < 2 ? 14 : 0,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right column — the product's signature moment: a scored hook */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 360,
            background: "#FFFFFF",
            border: "1.5px solid #E3E3EC",
            borderRadius: 28,
            boxShadow: "0 24px 60px rgba(16,16,25,.10)",
            padding: "40px 32px",
          }}
        >
          <div style={{ display: "flex", position: "relative", width: 220, height: 220 }}>
            {/* satori can't render SVG <text>, so the number is HTML overlaid */}
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r={RING_R} fill="none" stroke="#E3E3EC" strokeWidth="16" />
              <circle
                cx="110"
                cy="110"
                r={RING_R}
                fill="none"
                stroke="#0A7D5C"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - SCORE / 100)}
                transform="rotate(-90 110 110)"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 220,
                height: 220,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ display: "flex", fontFamily: "Syne", fontSize: 64, color: "#0A7D5C", lineHeight: 1 }}>{SCORE}</div>
              <div style={{ display: "flex", fontFamily: "DM Sans", fontSize: 20, color: "#5F5E78", marginTop: 4 }}>/ 100</div>
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 20, letterSpacing: "3px", color: "#5F5E78", display: "flex" }}>
            RETENTION SCORE
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              padding: "8px 18px",
              borderRadius: 999,
              background: "#E7F6F0",
              color: "#0A7D5C",
              fontSize: 20,
            }}
          >
            +55 after one rewrite
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Syne", data: syne, weight: 800, style: "normal" },
        { name: "DM Sans", data: dmSans, weight: 500, style: "normal" },
      ],
    }
  );
}
