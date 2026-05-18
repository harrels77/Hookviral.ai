"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { NICHE_MODES } from "@/lib/niches";

interface Trend { title: string; sub: string; }
type Source = "google" | "youtube";

export default function TrendsPage() {
  const [source, setSource] = useState<Source>("google");
  const [niche, setNiche] = useState("");
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (src: Source, slug: string) => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ source: src });
      if (src === "youtube" && slug) qs.set("niche", slug);
      const res = await fetch(`/api/trends?${qs.toString()}`);
      const data = await res.json();
      setConfigured(data.configured !== false);
      if (data.error) setError(data.error);
      setTrends(data.trends || []);
    } catch {
      setError("Could not load trends right now.");
      setTrends([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(source, niche); }, [source, niche, load]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "var(--hot)", borderRadius: "50%", top: "-200px", left: "-200px", filter: "blur(110px)", opacity: .06, animation: "orbFloat 16s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ borderBottom: "1px solid var(--border)", padding: "2.5rem 1.5rem 2rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".5rem" }}>
            What&apos;s <span className="gradient-text">trending</span> now
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: ".95rem" }}>
            Real trending topics. Pick one → get scroll-stopping hooks for it instantly.
          </p>
        </div>

        <div className="page-wrap">
          {/* Source toggle */}
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)", width: "fit-content", margin: "0 auto 12px" }}>
            {([["google", "🔎 Google Search"], ["youtube", "▶ YouTube"]] as [Source, string][]).map(([s, label]) => (
              <button key={s} onClick={() => setSource(s)} style={{ padding: "9px 22px", border: "none", background: source === s ? "var(--s3)" : "transparent", color: source === s ? "var(--text)" : "var(--muted)", fontSize: ".82rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                {label}
              </button>
            ))}
          </div>

          {/* Niche filter (YouTube only — categories) */}
          {source === "youtube" && (
            <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.25rem", marginBottom: "12px" }}>
              <div style={{ fontSize: ".68rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Filter by niche</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                <button onClick={() => setNiche("")} style={{ padding: "6px 14px", borderRadius: "100px", border: `1px solid ${niche === "" ? "rgba(255,45,107,.5)" : "var(--border2)"}`, background: niche === "" ? "rgba(255,45,107,.08)" : "transparent", color: niche === "" ? "var(--hot)" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                  🔥 All
                </button>
                {NICHE_MODES.map(n => (
                  <button key={n.slug} onClick={() => setNiche(n.slug)} style={{ padding: "6px 14px", borderRadius: "100px", border: `1px solid ${niche === n.slug ? "rgba(255,45,107,.5)" : "var(--border2)"}`, background: niche === n.slug ? "rgba(255,45,107,.08)" : "transparent", color: niche === n.slug ? "var(--hot)" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                    {n.emoji} {n.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {source === "youtube" && !configured && (
            <div style={{ background: "rgba(255,184,0,.06)", border: "1px solid rgba(255,184,0,.3)", color: "var(--gold)", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7 }}>
              YouTube trends need a <strong>YOUTUBE_API_KEY</strong> in <code>.env.local</code> (free). Meanwhile, <button onClick={() => setSource("google")} style={{ background: "none", border: "none", color: "var(--hot)", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>use Google Search trends</button> — no key needed.
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid var(--border2)", borderTopColor: "var(--hot)", animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
              <div style={{ fontSize: ".85rem", color: "var(--soft)" }}>Loading trends...</div>
            </div>
          )}

          {!loading && error && (
            <div style={{ background: "rgba(255,45,107,.06)", border: "1px solid rgba(255,45,107,.3)", color: "var(--hot)", borderRadius: "var(--r2)", padding: "1rem 1.25rem", fontSize: ".85rem" }}>
              {error}
            </div>
          )}

          {!loading && !error && trends.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {trends.map((t, i) => (
                <Link
                  key={i}
                  href={`/generator?topic=${encodeURIComponent(t.title)}${source === "youtube" && niche ? `&niche=${niche}` : ""}`}
                  style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none", transition: "all .2s" }}
                >
                  <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1rem", color: "var(--muted)", flexShrink: 0, width: "24px" }}>{i + 1}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".92rem", color: "var(--text)", lineHeight: 1.5, marginBottom: "3px" }}>{t.title}</div>
                    {t.sub && <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>{t.sub}</div>}
                  </div>
                  <span style={{ fontSize: ".78rem", color: "var(--electric)", fontFamily: "var(--fb)", whiteSpace: "nowrap", flexShrink: 0 }}>Get hooks →</span>
                </Link>
              ))}
            </div>
          )}

          {!loading && !error && trends.length === 0 && configured && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)", fontSize: ".9rem" }}>
              No trends found right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
