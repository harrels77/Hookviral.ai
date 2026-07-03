"use client";

import { useEffect, useRef, useState } from "react";
import { scoreColor, scoreSoft } from "@/lib/score";
import { Icon } from "@/lib/icons";
import { ScoreRing } from "@/components/ScoreRing";

// Honest "show the product doing its job" — no stock photos. One real weak
// opening, scored low with the attention patterns it's missing, beside its
// rewrite scored high with those patterns now present. Pattern names are the
// real taxonomy from lib/patterns.ts. Ring = shared components/ScoreRing.

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

function DemoCard({ after, play, instant }: { after: boolean; play: boolean; instant: boolean }) {
  const d = after ? AFTER : BEFORE;
  const accent = scoreColor(d.score);
  const chipColor = after ? "var(--success)" : "var(--warning)";
  const chipBg = after ? "var(--success-soft)" : "var(--warning-soft)";

  return (
    <div className="card" style={{ borderLeft: `3px solid ${accent}`, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <ScoreRing score={d.score} play={play} instant={instant} />
        <div>
          <div className="kicker" style={{ color: accent, marginBottom: "4px" }}>
            {after ? "After — one-click rewrite" : "Before"}
          </div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--text)", lineHeight: 1.5, fontWeight: after ? 500 : 400 }}>
            &ldquo;{d.hook}&rdquo;
          </p>
        </div>
      </div>

      <div>
        <div className="kicker" style={{ marginBottom: ".6rem" }}>
          {after ? "Now using" : "Missing"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {d.patterns.map((p, i) => {
            const animate = play && !instant;
            return (
              <span
                key={p}
                style={{
                  fontSize: "var(--text-xs)", padding: "3px 10px", borderRadius: "var(--r-pill)",
                  color: chipColor, background: chipBg, border: `1px solid ${chipColor}`,
                  fontFamily: "var(--fb)", whiteSpace: "nowrap",
                  opacity: instant ? 1 : 0,
                  animation: animate ? `chipPop .4s cubic-bezier(.16,1,.3,1) ${i * 90 + (after ? 250 : 0)}ms both` : "none",
                }}
              >
                {p}
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
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 18px", borderRadius: "var(--r-pill)",
            border: "1px solid var(--border-strong)", background: scoreSoft(AFTER.score),
            fontSize: "var(--text-sm)", color: "var(--text-soft)", fontFamily: "var(--fb)",
            opacity: play || instant ? 1 : 0,
            transition: "opacity .5s ease", transitionDelay: instant ? "0s" : "1.1s",
          }}
        >
          Same idea, rewritten and re-scored
          <strong style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--success)", fontFamily: "var(--fd)", fontWeight: 800 }}>
            +{delta} <Icon name="trending-up" />
          </strong>
        </span>
      </div>
    </div>
  );
}
