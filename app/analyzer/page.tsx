"use client";

import { useState } from "react";
import Link from "next/link";

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "LinkedIn", "X / Twitter"];

interface Analysis {
  score: number;
  formula: string;
  why: string;
  curiosity: number;
  emotion: number;
  clarity: number;
  weakPoints: string[];
}

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 80 ? "var(--gold)" : "var(--hot)";
}

export default function AnalyzerPage() {
  const [hook, setHook] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [btnHov, setBtnHov] = useState(false);

  async function analyze() {
    if (!hook.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.analysis);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "var(--electric)", borderRadius: "50%", top: "-200px", right: "-200px", filter: "blur(110px)", opacity: .06, animation: "orbFloat 15s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ borderBottom: "1px solid var(--border)", padding: "2.5rem 1.5rem 2rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".5rem" }}>
            Hook <span className="gradient-text">Analyzer</span>
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: ".95rem" }}>
            Paste a hook you already wrote. See if it stops the scroll in the first 3 seconds.
          </p>
        </div>

        <div className="page-wrap">
          {/* Input */}
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", overflow: "hidden", marginBottom: "12px", position: "relative" }}>
            <label style={{ display: "block", padding: "1.25rem 1.5rem .5rem", fontSize: ".68rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 600 }}>Your hook</label>
            <textarea
              value={hook}
              onChange={e => setHook(e.target.value.slice(0, 300))}
              placeholder="e.g. Hey guys, today I'm going to show you my morning routine..."
              rows={3}
              style={{ width: "100%", background: "transparent", border: "none", outline: "none", padding: ".5rem 1.5rem 2.5rem", color: "var(--text)", fontSize: "1rem", fontFamily: "var(--fb)", resize: "none", lineHeight: 1.7, caretColor: "var(--hot)" }}
            />
            <div style={{ position: "absolute", bottom: "1rem", right: "1.25rem", fontSize: ".72rem", color: hook.length > 270 ? "var(--hot)" : "var(--muted)" }}>{hook.length}/300</div>
          </div>

          {/* Platform */}
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.25rem", marginBottom: "12px" }}>
            <div style={{ fontSize: ".68rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Platform</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatform(p)} style={{ padding: "6px 14px", borderRadius: "100px", border: `1px solid ${platform === p ? "rgba(108,58,255,.6)" : "var(--border2)"}`, background: platform === p ? "rgba(108,58,255,.1)" : "transparent", color: platform === p ? "#C4B5FD" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Analyze button */}
          <button
            onClick={analyze}
            disabled={loading || !hook.trim()}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              display: "flex", alignItems: "center", gap: "10px", width: "100%", justifyContent: "center",
              padding: "15px 28px", borderRadius: "100px", border: "none", marginBottom: "12px",
              background: loading || !hook.trim() ? "var(--s3)" : "linear-gradient(135deg,var(--hot),var(--electric))",
              color: "#fff", fontSize: "1rem", fontWeight: 600, fontFamily: "var(--fb)",
              cursor: loading || !hook.trim() ? "not-allowed" : "pointer",
              opacity: loading || !hook.trim() ? 0.6 : 1, transition: "all .3s",
              transform: btnHov && !loading && hook.trim() ? "translateY(-3px) scale(1.02)" : "none",
              boxShadow: btnHov && !loading && hook.trim() ? "0 16px 40px rgba(255,45,107,.4)" : "0 4px 16px rgba(255,45,107,.15)",
            }}
          >
            {loading
              ? <><div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite" }} />Analyzing...</>
              : <>✦ Analyze Retention</>}
          </button>

          {error && (
            <div style={{ background: "rgba(255,45,107,.06)", border: "1px solid rgba(255,45,107,.3)", color: "var(--hot)", borderRadius: "var(--r2)", padding: "1rem 1.25rem", marginBottom: "12px", fontSize: ".85rem" }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ background: "var(--s1)", border: "1px solid rgba(108,58,255,.3)", borderRadius: "var(--r3)", padding: "1.75rem", animation: "cardIn .4s ease" }}>
              {/* Score header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", marginBottom: "4px", fontFamily: "var(--fd)", fontWeight: 600 }}>Retention score</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontFamily: "var(--fd)", fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-2px", color: scoreColor(result.score), lineHeight: 1 }}>{result.score}</span>
                    <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>/100</span>
                  </div>
                </div>
                <span style={{ fontSize: ".75rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "5px 14px", borderRadius: "100px", background: "rgba(108,58,255,.1)", color: "#9B8CFF", border: "1px solid rgba(108,58,255,.2)" }}>{result.formula}</span>
              </div>

              <div style={{ height: "5px", background: "var(--s3)", borderRadius: "3px", overflow: "hidden", marginBottom: "1.5rem" }}>
                <div style={{ height: "100%", borderRadius: "3px", background: "linear-gradient(90deg,var(--electric),var(--neon))", width: `${result.score}%`, transition: "width .8s cubic-bezier(.16,1,.3,1)" }} />
              </div>

              {/* Why */}
              <p style={{ fontSize: ".9rem", color: "var(--soft)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{result.why}</p>

              {/* Sub-scores */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: result.weakPoints?.length ? "1.5rem" : 0 }}>
                {([["Curiosity", result.curiosity, "var(--electric)"], ["Emotion", result.emotion, "var(--hot)"], ["Clarity", result.clarity, "var(--neon)"]] as [string, number, string][]).map(([label, val, color]) => (
                  <div key={label} style={{ flex: 1, minWidth: "90px" }}>
                    <div style={{ fontSize: ".62rem", color: "var(--muted)", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
                    <div style={{ height: "5px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: color, borderRadius: "4px", width: `${val * 10}%`, transition: "width .6s ease" }} />
                    </div>
                    <div style={{ fontSize: ".75rem", color, fontFamily: "var(--fd)", fontWeight: 700, marginTop: "4px" }}>{val}/10</div>
                  </div>
                ))}
              </div>

              {/* Weak points */}
              {result.weakPoints?.length > 0 && (
                <div style={{ background: "var(--s2)", borderRadius: "var(--r2)", padding: "1rem 1.25rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: ".68rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--gold)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".75rem" }}>What to fix</div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {result.weakPoints.map((w, i) => (
                      <li key={i} style={{ fontSize: ".85rem", color: "var(--soft)", lineHeight: 1.6 }}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <Link href="/generator" style={{ fontSize: ".85rem", color: "var(--electric)", textDecoration: "none" }}>
                  Need a stronger hook? Generate 8 scored ones →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
