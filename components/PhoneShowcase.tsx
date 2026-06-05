"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";

// Three phones, each a REAL product surface (Trends / Generator / Analyzer),
// fanned in a light 3D cluster with the center elevated. Illustrative example
// content — the product's own UI, no fabricated social proof. Fan on desktop,
// swipeable row on small screens (.hv-phones-stage in globals.css).

function Cap({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: ".6rem", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".6rem" }}>{children}</div>;
}

// ── Trends screen — a mini live feed ──
function TrendsScreen() {
  const rows = [
    { t: "Wembanyama injury update", e: "🦋", s: "Bluesky", c: "#0085FF", v: "🔥 Rising", vc: "var(--hot)" },
    { t: "5am morning routine", e: "🔎", s: "Google", c: "#5BA8FF", v: "⚡ Steady", vc: "var(--electric)" },
    { t: "AI side hustle 2026", e: "▶", s: "YouTube", c: "#FF4D5A", v: "🆕 New", vc: "var(--electric)" },
    { t: "Faceless YouTube automation", e: "🟧", s: "Hacker News", c: "#FF6600", v: "🔥 Rising", vc: "var(--hot)" },
  ];
  return (
    <div style={{ minHeight: "352px" }}>
      <Cap>What&apos;s trending</Cap>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "9px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "11px", padding: "9px 10px" }}>
            <div style={{ fontSize: ".72rem", color: "var(--text)", fontWeight: 500, lineHeight: 1.3, marginBottom: "6px" }}>{r.t}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: ".54rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "2px 7px", borderRadius: "100px", color: r.c, background: `${r.c}14`, border: `1px solid ${r.c}33` }}>{r.e} {r.s}</span>
              <span style={{ fontSize: ".54rem", fontFamily: "var(--fd)", fontWeight: 700, color: r.vc }}>{r.v}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "9px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", textAlign: "center", fontSize: ".68rem", color: "#fff", fontFamily: "var(--fd)", fontWeight: 700 }}>🔬 Research &amp; angles</div>
    </div>
  );
}

// ── Generator screen — topic → 8 scored hooks (3 shown) ──
function GeneratorScreen() {
  const hooks = [
    { t: "I tried the 5am routine that broke me.", sc: 91, f: "Cold Open" },
    { t: "Nobody tells you this about mornings.", sc: 84, f: "Knowledge Gap" },
    { t: "Your 5am alarm is sabotaging you.", sc: 78, f: "Warning" },
    { t: "Why your mornings feel impossible.", sc: 73, f: "Open Loop" },
  ];
  return (
    <div style={{ minHeight: "352px" }}>
      <Cap>Topic → 8 hooks</Cap>
      <div style={{ display: "inline-flex", padding: "4px 11px", borderRadius: "100px", background: "var(--s2)", border: "1px solid var(--border)", fontSize: ".64rem", color: "var(--soft)", marginBottom: "9px" }}>morning routine</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {hooks.map((h, i) => (
          <div key={i} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "11px", padding: "9px 10px" }}>
            <div style={{ fontSize: ".7rem", color: "var(--text)", lineHeight: 1.35, marginBottom: "6px" }}>{h.t}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: ".54rem", fontFamily: "var(--fd)", fontWeight: 700, color: "#9B8CFF" }}>{h.f}</span>
              <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".86rem", color: h.sc >= 85 ? "var(--neon)" : "var(--gold)" }}>{h.sc}<span style={{ fontSize: ".54rem", color: "var(--muted)", fontWeight: 400 }}>/100</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Analyzer screen — score + sub-scores + patterns ──
function AnalyzerScreen() {
  const subs: [string, number, string][] = [
    ["Curiosity", 8, "var(--electric)"],
    ["Emotion", 9, "var(--hot)"],
    ["Clarity", 8, "var(--neon)"],
  ];
  return (
    <div style={{ minHeight: "352px" }}>
      <Cap>Hook score</Cap>
      <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "11px", padding: "10px", marginBottom: "9px" }}>
        <div style={{ fontSize: ".7rem", color: "var(--text)", lineHeight: 1.35, marginBottom: "9px" }}>&ldquo;I tried the 5am routine that broke me.&rdquo;</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ flex: 1, height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "84%", background: "linear-gradient(90deg,var(--electric),var(--neon))", borderRadius: "3px" }} />
          </div>
          <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.05rem", color: "var(--neon)", letterSpacing: "-1px" }}>84<span style={{ fontSize: ".54rem", color: "var(--muted)", fontWeight: 400 }}>/100</span></span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "9px" }}>
        {subs.map(([label, v, c], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ fontSize: ".56rem", color: "var(--muted)", width: "48px", flexShrink: 0 }}>{label}</span>
            <div style={{ flex: 1, height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${v * 10}%`, background: c, borderRadius: "3px" }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {["Cold Open", "Stakes"].map(p => (
          <span key={p} style={{ fontSize: ".54rem", padding: "2px 8px", borderRadius: "100px", color: "var(--neon)", background: "rgba(0,255,178,.08)", border: "1px solid rgba(0,255,178,.2)" }}>✓ {p}</span>
        ))}
        <span style={{ fontSize: ".54rem", padding: "2px 8px", borderRadius: "100px", color: "var(--gold)", background: "rgba(255,184,0,.07)", border: "1px solid rgba(255,184,0,.25)" }}>+ Open Loop</span>
      </div>
      <div style={{ marginTop: "10px", padding: "9px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.4)", textAlign: "center", fontSize: ".66rem", color: "var(--electric)", fontFamily: "var(--fd)", fontWeight: 700 }}>✦ Rewrite to 91 →</div>
    </div>
  );
}

export function PhoneShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setInstant(true); setShown(true); return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // lift = visual elevation (transform doesn't affect flow, so captions stay on
  // a flat baseline). zi = stacking so the bigger center overlaps its siblings.
  const items = [
    { screen: <TrendsScreen />, step: "Discover", tool: "Trends", glow: "rgba(0,133,255,.32)", w: 232, delay: 0, lift: 8, zi: 1, mx: "-18px" },
    { screen: <GeneratorScreen />, step: "Create", tool: "Generator", glow: "rgba(255,184,0,.3)", w: 268, delay: 140, lift: -22, zi: 3, mx: "0" },
    { screen: <AnalyzerScreen />, step: "Diagnose & fix", tool: "Analyzer", glow: "rgba(108,58,255,.34)", w: 232, delay: 280, lift: 8, zi: 1, mx: "-18px" },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Ambient backdrop glow */}
      <div aria-hidden style={{ position: "absolute", inset: "-12% -5%", background: "radial-gradient(ellipse 55% 55% at 50% 42%, rgba(108,58,255,.14), rgba(255,45,107,.06) 45%, transparent 72%)", filter: "blur(24px)", pointerEvents: "none", zIndex: 0 }} />

      <div className="hv-phones-stage" style={{ position: "relative", zIndex: 1 }}>
        {items.map(it => (
          <div key={it.tool} className="hv-phone-col" style={{ zIndex: it.zi, marginLeft: it.mx, marginRight: it.mx }}>
            {/* elevation (lift) — does not affect flow, so the caption below stays aligned */}
            <div style={{ transform: `translateY(${it.lift}px)` }}>
              {/* entrance (opacity + scale) */}
              <div style={{ opacity: shown ? 1 : 0, transform: shown ? "scale(1)" : "scale(.9)", transition: instant ? "none" : "opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1)", transitionDelay: instant ? "0s" : `${it.delay}ms` }}>
                {/* continuous gentle float (separate node so transforms never collide) */}
                <div className="hv-phonefloat" style={{ animationDelay: `${it.delay}ms` }}>
                  <PhoneFrame width={it.w} glow={it.glow}>{it.screen}</PhoneFrame>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: "1.1rem" }}>
              <div style={{ fontSize: ".62rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 600 }}>{it.step}</div>
              <div style={{ fontFamily: "var(--fd)", fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-.5px" }}>{it.tool}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
