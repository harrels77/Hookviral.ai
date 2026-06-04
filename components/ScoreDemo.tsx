"use client";

import { useEffect, useRef, useState } from "react";

// Honest "show the product doing its job" — no stock photos. One real weak
// opening, scored low with the attention patterns it's missing, beside its
// rewrite scored high with those patterns now present. Pattern names are the
// real taxonomy from lib/patterns.ts. Pure SVG + CSS vars, no external deps.

const BEFORE = {
  score: 32,
  hook: "Hey guys, today I'm going to talk about saving money.",
  patterns: ["Open Loop", "Concrete Specificity", "Stakes"], // missing
};
const AFTER = {
  score: 87,
  hook: "I saved $9,000 in six months with one rule my bank hoped I'd never find.",
  patterns: ["Concrete Specificity", "Open Loop", "Stakes", "Knowledge Gap"], // present
};

const R = 42;
const CIRC = 2 * Math.PI * R; // circumference for the stroke-dash trick

function ScoreRing({
  score, play, instant, stops, numberColor, gradientId,
}: {
  score: number; play: boolean; instant: boolean;
  stops: [string, string]; numberColor: string; gradientId: string;
}) {
  const [animated, setAnimated] = useState(0);

  // Count the number up from 0 to the target in sync with the ring sweep.
  // Reduced-motion (instant) skips this entirely — `display` is derived below.
  useEffect(() => {
    if (instant || !play) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic — matches the CSS curve
      setAnimated(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, instant, score]);

  const display = instant ? score : animated;
  const filled = play || instant;
  const offset = filled ? CIRC * (1 - score / 100) : CIRC;

  return (
    <svg width="92" height="92" viewBox="0 0 96 96" style={{ flexShrink: 0 }} role="img" aria-label={`Retention score ${score} out of 100`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={stops[0]} />
          <stop offset="100%" stopColor={stops[1]} />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r={R} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={R} fill="none" stroke={`url(#${gradientId})`} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={CIRC} strokeDashoffset={offset} transform="rotate(-90 48 48)"
        style={{ transition: instant ? "none" : "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)" }}
      />
      <text x="48" y="46" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "26px", fill: numberColor }}>{display}</text>
      <text x="48" y="64" textAnchor="middle" style={{ fontFamily: "var(--fb)", fontSize: "9px", fill: "var(--muted)" }}>/ 100</text>
    </svg>
  );
}

function DemoCard({ after, play, instant }: { after: boolean; play: boolean; instant: boolean }) {
  const d = after ? AFTER : BEFORE;
  const accent = after ? "var(--neon)" : "var(--hot)";
  const chipColor = after ? "var(--neon)" : "var(--gold)";
  const chipBg = after ? "rgba(0,255,178,.08)" : "rgba(255,184,0,.07)";
  const chipBorder = after ? "rgba(0,255,178,.22)" : "rgba(255,184,0,.25)";

  return (
    <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderLeft: `3px solid ${accent}`, borderRadius: "var(--r3)", padding: "1.5rem 1.6rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <ScoreRing
          score={d.score} play={play} instant={instant}
          stops={after ? ["var(--electric)", "var(--neon)"] : ["var(--gold)", "var(--hot)"]}
          numberColor={accent}
          gradientId={after ? "hv-ring-after" : "hv-ring-before"}
        />
        <div>
          <div style={{ fontSize: ".62rem", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: accent, marginBottom: "4px" }}>
            {after ? "After — one-click rewrite" : "Before"}
          </div>
          <p style={{ fontSize: ".92rem", color: "var(--text)", lineHeight: 1.5, fontWeight: after ? 500 : 400 }}>
            &ldquo;{d.hook}&rdquo;
          </p>
        </div>
      </div>

      <div>
        <div style={{ fontSize: ".6rem", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".6rem" }}>
          {after ? "Now using" : "Missing"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {d.patterns.map((p, i) => {
            const animate = play && !instant;
            return (
              <span
                key={p}
                style={{
                  fontSize: ".7rem", padding: "3px 10px", borderRadius: "100px",
                  color: chipColor, background: chipBg, border: `1px solid ${chipBorder}`,
                  fontFamily: "var(--fb)", whiteSpace: "nowrap",
                  opacity: instant ? 1 : 0,
                  animation: animate ? `chipPop .4s cubic-bezier(.16,1,.3,1) ${i * 90 + (after ? 250 : 0)}ms both` : "none",
                }}
              >
                {after ? "✓" : "✗"} {p}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ScoreDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  const [instant, setInstant] = useState(false); // reduced-motion → skip animation

  // Mount-once: respect reduced motion, otherwise play when scrolled into view.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setInstant(true); setPlay(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setPlay(true); io.disconnect(); } },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const delta = AFTER.score - BEFORE.score;

  return (
    <div ref={ref}>
      <div className="hv-scoredemo-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", alignItems: "stretch" }}>
        <DemoCard after={false} play={play} instant={instant} />
        <DemoCard after={true} play={play} instant={instant} />
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            padding: "8px 18px", borderRadius: "100px",
            border: "1px solid var(--border2)", background: "var(--s1)",
            fontSize: ".82rem", color: "var(--soft)", fontFamily: "var(--fb)",
            opacity: play || instant ? 1 : 0,
            transition: "opacity .5s ease", transitionDelay: instant ? "0s" : "1.1s",
          }}
        >
          🔧 Same idea, rewritten to score
          <strong style={{ color: "var(--neon)", fontFamily: "var(--fd)", fontWeight: 800 }}>+{delta} ▲</strong>
        </span>
      </div>
    </div>
  );
}
