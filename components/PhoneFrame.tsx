import type { ReactNode } from "react";

// Reusable pure-CSS phone bezel: realistic status bar (time + signal + battery),
// notch, home indicator, soft glow. No images, no deps, design-system colors.
// Wrap real product screens in it — credibility comes from what's inside.
export function PhoneFrame({
  children,
  width = 248,
  glow = "rgba(108,58,255,.32)",
}: {
  children: ReactNode;
  width?: number;
  glow?: string;
}) {
  return (
    <div style={{ position: "relative", width }}>
      {/* Glow halo */}
      <div style={{ position: "absolute", inset: "-30px", background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`, filter: "blur(26px)", borderRadius: "50%", pointerEvents: "none" }} />

      {/* Bezel */}
      <div style={{ position: "relative", width, background: "var(--s1)", borderRadius: "40px", border: "2px solid var(--border2)", boxShadow: "0 40px 80px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.07)", overflow: "hidden" }}>

        {/* Status bar */}
        <div style={{ background: "var(--bg)", padding: "11px 18px 7px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <span style={{ fontSize: ".62rem", fontWeight: 700, fontFamily: "var(--fd)", color: "var(--text)", letterSpacing: ".5px" }}>9:41</span>

          {/* Notch */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80px", height: "20px", background: "var(--bg)", borderRadius: "0 0 14px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--border2)" }} />
            <div style={{ width: "30px", height: "5px", borderRadius: "3px", background: "var(--border2)" }} />
          </div>

          {/* Signal + battery */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1.5px" }}>
              {[4, 6, 8, 10].map(h => (
                <div key={h} style={{ width: "2.5px", height: `${h}px`, borderRadius: "1px", background: "var(--soft)" }} />
              ))}
            </div>
            <div style={{ width: "17px", height: "9px", borderRadius: "2px", border: "1px solid var(--soft)", padding: "1px", display: "flex" }}>
              <div style={{ flex: 1, background: "var(--neon)", borderRadius: "1px" }} />
            </div>
          </div>
        </div>

        {/* Screen */}
        <div style={{ background: "var(--bg)", padding: ".95rem" }}>{children}</div>

        {/* Home indicator */}
        <div style={{ background: "var(--bg)", padding: "11px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100px", height: "4px", borderRadius: "3px", background: "var(--border2)" }} />
        </div>
      </div>
    </div>
  );
}
