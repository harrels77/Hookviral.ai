"use client";

import { useEffect, useState } from "react";
import { scoreColor } from "@/lib/score";

// The product's signature visual: an animated ring sweeping to the retention
// score, colored by the single global score semantic (lib/score.ts). Used by
// the home ScoreDemo, the Analyzer result header, and the home try-it widget —
// one component so the flagship moment looks identical everywhere.

export function ScoreRing({
  score,
  size = 92,
  play = true,
  instant = false,
}: {
  score: number;
  size?: number;
  /** Start the sweep (false = ring stays empty, e.g. before scroll-into-view). */
  play?: boolean;
  /** Skip the animation entirely (reduced motion). */
  instant?: boolean;
}) {
  // Geometry scales off a 96-unit viewBox so any size renders crisp.
  const R = 42;
  const CIRC = 2 * Math.PI * R;
  const color = scoreColor(score);

  const [animated, setAnimated] = useState(0);
  const [noMotion, setNoMotion] = useState(false);

  // Respect prefers-reduced-motion even when the caller didn't pass `instant`.
  // Mount-once media-query read — same justified exception as ScoreDemo
  // (window doesn't exist at SSR time, so it can't be a useState initializer).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setNoMotion(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const skip = instant || noMotion;

  // Count the number up from 0 in sync with the ring sweep.
  useEffect(() => {
    if (skip || !play) return;
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
  }, [play, skip, score]);

  const display = skip ? score : animated;
  const filled = play || skip;
  const offset = filled ? CIRC * (1 - score / 100) : CIRC;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      style={{ flexShrink: 0 }}
      role="img"
      aria-label={`Retention score ${score} out of 100`}
    >
      <circle cx="48" cy="48" r={R} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="48" cy="48" r={R} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={CIRC} strokeDashoffset={offset} transform="rotate(-90 48 48)"
        style={{ transition: skip ? "none" : "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)" }}
      />
      <text x="48" y="46" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "26px", fill: color }}>{display}</text>
      <text x="48" y="64" textAnchor="middle" style={{ fontFamily: "var(--fb)", fontSize: "9px", fill: "var(--text-muted)" }}>/ 100</text>
    </svg>
  );
}
