"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NextStep } from "@/components/NextStep";
import { getSavedTrends, unsaveTrend, type SavedTrend } from "@/lib/prefs";
import { SOURCE_BADGES, type SourceKey } from "@/lib/sourceBadges";
import { Icon } from "@/lib/icons";

// Local copy of the surrogate-safe encoder used on the Trends card, kept inline
// so this page doesn't depend on Trends' internals (a lone UTF-16 surrogate from
// a truncated emoji title would otherwise crash encodeURIComponent).
const safeEncode = (s: string) => encodeURIComponent(s.replace(/[\uD800-\uDFFF]/g, ""));

function timeAgo(ts: number): string {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); return `${d}d ago`;
}

export default function SavedPage() {
  const [saved, setSaved] = useState<SavedTrend[]>([]);

  // Mount-once hydrate from localStorage (SSR-safe one-time read).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { setSaved(getSavedTrends()); }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function remove(id: string) {
    unsaveTrend(id);
    setSaved(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-wrap">
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px" }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", borderRadius: "14px", background: "var(--warning-soft)", color: "var(--warning)", flexShrink: 0 }}>
              <Icon name="star" size={20} fill="currentColor" />
            </span>
            Saved trends
          </h1>
          <p style={{ color: "var(--soft)", fontSize: ".875rem", marginTop: ".3rem", fontWeight: 300 }}>
            {saved.length} trend{saved.length !== 1 ? "s" : ""} you&apos;re watching — research or turn them into hooks anytime.
          </p>
        </div>

        {saved.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "var(--text-sm)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Nothing saved yet. Star a trend to keep an eye on it.
            </p>
            <Link href="/trends" className="btn btn-primary btn-md">
              Browse trends
              <Icon name="arrow-right" />
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "10px", alignItems: "start" }}>
            {saved.map(t => {
              const badge = (t.source && SOURCE_BADGES[t.source as SourceKey]) || null;
              return (
                <div key={t.id} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
                  <button onClick={() => remove(t.id)} title="Remove from Saved" aria-label="Remove from Saved"
                    style={{ position: "absolute", top: "10px", right: "10px", width: "26px", height: "26px", border: "1px solid var(--border)", borderRadius: "50%", background: "var(--surface)", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                    <Icon name="x" />
                  </button>

                  <div style={{ paddingRight: "26px" }}>
                    <div style={{ fontSize: ".95rem", color: "var(--text)", lineHeight: 1.45, fontWeight: 500 }}>{t.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
                      {badge && (
                        <span style={{ fontSize: ".62rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "2px 7px", borderRadius: "100px", color: badge.color, background: `${badge.color}14`, border: `1px solid ${badge.color}33` }}>
                          {badge.label}
                        </span>
                      )}
                      <span style={{ fontSize: ".72rem", color: "var(--muted)" }}>saved {timeAgo(t.savedAt)}</span>
                    </div>
                  </div>

                  {/* Same 3 CTAs as Trends (niche-less — you pick the niche when you act) */}
                  <Link href={`/trends/research?q=${safeEncode(t.title)}`} className="btn btn-primary btn-sm btn-block">
                    <Icon name="flask" /> Research &amp; angles
                  </Link>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link href={`/generator?topic=${safeEncode(t.title)}`} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-strong)", color: "var(--text-muted)", fontSize: "var(--text-xs)", textDecoration: "none", fontFamily: "var(--fb)" }}><Icon name="zap" /> Quick hooks</Link>
                    <Link href={`/analyzer?hook=${safeEncode(t.title)}`} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-strong)", color: "var(--text-muted)", fontSize: "var(--text-xs)", textDecoration: "none", fontFamily: "var(--fb)" }}><Icon name="sparkles" /> Score it</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <NextStep />
      </div>
    </div>
  );
}
