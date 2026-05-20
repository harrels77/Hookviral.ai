"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { isPro } from "@/lib/plan";
import { NICHE_MODES } from "@/lib/niches";
import { NextStep } from "@/components/NextStep";
import { ProNote } from "@/components/ProLock";
import { HOOK_PATTERNS } from "@/lib/patterns";
import { getNichePref, setNichePref } from "@/lib/prefs";

// Deep-link a pattern name to its explanation on the Patterns hub.
function patternHref(name: string) {
  const p = HOOK_PATTERNS.find(x => x.name === name);
  return p ? `/patterns#${p.id}` : "/patterns";
}

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "LinkedIn", "X / Twitter"];

// Honest spoken-delivery heuristic: energetic short-form narration ≈ 3.3 words/s.
// This estimates whether the line actually lands inside the 3-second window.
function threeSecondCheck(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return null;
  const secs = words / 3.3;
  if (words <= 10) return { secs, label: "Lands in 3s", color: "var(--neon)" };
  if (words <= 16) return { secs, label: "Tight — trim it", color: "var(--gold)" };
  return { secs, label: "Too long for 3s", color: "var(--hot)" };
}
const REWRITE_STYLES = ["More emotional", "More cinematic", "More contrarian", "More storytelling", "Punchier"];

interface Analysis {
  score: number;
  formula: string;
  why: string;
  curiosity: number;
  emotion: number;
  clarity: number;
  weakPoints: string[];
  patternsUsed: string[];
  patternsMissing: string[];
}

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 80 ? "var(--gold)" : "var(--hot)";
}

export default function AnalyzerPage() {
  return (
    <Suspense fallback={null}>
      <AnalyzerInner />
    </Suspense>
  );
}

function AnalyzerInner() {
  const searchParams = useSearchParams();
  const [hook, setHook] = useState("");
  const [platform, setPlatform] = useState("TikTok");
  // Niche hydrates from cross-page prefs (Trends, Analyzer, etc. share it).
  const [niche, setNiche] = useState(() => typeof window !== "undefined" ? getNichePref() : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Analysis | null>(null);
  const [btnHov, setBtnHov] = useState(false);
  const [rewriteStyle, setRewriteStyle] = useState(REWRITE_STYLES[0]);
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [rewrites, setRewrites] = useState<{ text: string; score: number }[]>([]);
  const [rwLoading, setRwLoading] = useState(false);
  const [rwError, setRwError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [pro, setPro] = useState(false);
  const prefilled = useRef(false);

  useEffect(() => { setPro(isPro()); }, []);
  useEffect(() => { setNichePref(niche); }, [niche]);

  function resetRewrites() {
    setRewrites([]);
    setRwError("");
    setCopiedIdx(null);
  }

  async function analyze(overrideHook?: string, overridePlatform?: string) {
    const h = (overrideHook ?? hook).trim();
    if (!h) return;
    setLoading(true);
    setError("");
    setResult(null);
    resetRewrites();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: h, platform: overridePlatform ?? platform, niche }),
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

  async function rewrite(targetPattern?: string) {
    if (!hook.trim()) return;
    setRwLoading(true);
    setRwError("");
    setRewrites([]);
    setCopiedIdx(null);
    setActiveTarget(targetPattern ?? null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          targetPattern
            ? { hook, platform, pattern: targetPattern }
            : { hook, style: rewriteStyle, platform }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rewrite failed");
      setRewrites(data.rewrites || []);
    } catch (e: unknown) {
      setRwError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setRwLoading(false);
    }
  }

  async function copyRewrite(text: string, i: number) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(c => (c === i ? null : c)), 1500);
  }

  // Prefill + auto-run when arriving from a generated hook (?hook=&platform=)
  useEffect(() => {
    if (prefilled.current) return;
    const h = searchParams.get("hook");
    if (!h) return;
    prefilled.current = true;
    const p = searchParams.get("platform");
    const plat = p && PLATFORMS.includes(p) ? p : platform;
    const trimmed = h.slice(0, 300);
    if (p && PLATFORMS.includes(p)) setPlatform(p);
    setHook(trimmed);
    analyze(trimmed, plat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t3 = threeSecondCheck(hook);
  const wordCount = hook.trim() ? hook.trim().split(/\s+/).filter(Boolean).length : 0;

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

          {/* Live 3-second deliverability check */}
          {t3 && (
            <div style={{ background: "var(--s1)", border: `1px solid ${t3.color}33`, borderRadius: "var(--r2)", padding: ".85rem 1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: t3.color }}>
                ⏱ {t3.label}
              </span>
              <span style={{ fontSize: ".78rem", color: "var(--soft)" }}>
                {wordCount} words · ~{t3.secs.toFixed(1)}s to say aloud
              </span>
              <div style={{ flex: 1, minWidth: "80px", height: "4px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: "4px", background: t3.color, width: `${Math.min(100, (t3.secs / 4.5) * 100)}%`, transition: "width .3s ease" }} />
              </div>
            </div>
          )}

          {/* Optional knobs — default platform TikTok + Any niche works for first-pass analysis. */}
          <details style={{ marginBottom: "12px" }}>
            <summary style={{ cursor: "pointer", fontSize: ".78rem", color: "var(--muted)", fontFamily: "var(--fb)", padding: "6px 4px", listStyle: "none", userSelect: "none" }}>
              More options ▾ <span style={{ color: "var(--muted)", opacity: .6 }}>(platform, niche)</span>
            </summary>
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.25rem" }}>
                <div style={{ fontSize: ".68rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Platform</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => setPlatform(p)} style={{ padding: "6px 14px", borderRadius: "100px", border: `1px solid ${platform === p ? "rgba(108,58,255,.6)" : "var(--border2)"}`, background: platform === p ? "rgba(108,58,255,.1)" : "transparent", color: platform === p ? "#C4B5FD" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.25rem" }}>
                <div style={{ fontSize: ".68rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Niche <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>— optional, sharpens the verdict</span></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <button onClick={() => setNiche("")} style={{ padding: "6px 14px", borderRadius: "100px", border: `1px solid ${niche === "" ? "rgba(108,58,255,.6)" : "var(--border2)"}`, background: niche === "" ? "rgba(108,58,255,.1)" : "transparent", color: niche === "" ? "#C4B5FD" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                    Any
                  </button>
                  {NICHE_MODES.map(nm => (
                    <button key={nm.slug} onClick={() => setNiche(nm.slug)} style={{ padding: "6px 14px", borderRadius: "100px", border: `1px solid ${niche === nm.slug ? "rgba(108,58,255,.6)" : "var(--border2)"}`, background: niche === nm.slug ? "rgba(108,58,255,.1)" : "transparent", color: niche === nm.slug ? "#C4B5FD" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                      {nm.emoji} {nm.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>

          {/* Analyze button */}
          <button
            onClick={() => analyze()}
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
                  <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", marginBottom: "4px", fontFamily: "var(--fd)", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                    Retention score
                    <Link href="/why-it-works" title="How is this computed?" style={{ fontSize: ".68rem", color: "var(--electric)", textDecoration: "none", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
                      How? →
                    </Link>
                  </div>
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

              {/* Attention patterns */}
              {(result.patternsUsed?.length > 0 || result.patternsMissing?.length > 0) && (
                <div style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: "var(--s2)", borderRadius: "var(--r2)", padding: "1rem 1.1rem", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: ".64rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".6rem" }}>Patterns it uses</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {result.patternsUsed?.length > 0
                        ? result.patternsUsed.map(p => (
                          <Link key={p} href={patternHref(p)} title="What this pattern means" style={{ fontSize: ".7rem", padding: "3px 9px", borderRadius: "100px", background: "rgba(0,255,178,.08)", color: "var(--neon)", border: "1px solid rgba(0,255,178,.2)", textDecoration: "none" }}>{p}</Link>
                        ))
                        : <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>None detected</span>}
                    </div>
                  </div>
                  <div style={{ background: "var(--s2)", borderRadius: "var(--r2)", padding: "1rem 1.1rem", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: ".64rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--gold)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".6rem" }}>Missing — biggest levers</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {result.patternsMissing?.length > 0
                        ? result.patternsMissing.map(p => (
                          <Link key={p} href={patternHref(p)} title="Learn this pattern" style={{ fontSize: ".7rem", padding: "3px 9px", borderRadius: "100px", background: "rgba(255,184,0,.07)", color: "var(--gold)", border: "1px solid rgba(255,184,0,.25)", textDecoration: "none" }}>{p}</Link>
                        ))
                        : <span style={{ fontSize: ".78rem", color: "var(--muted)" }}>Solid coverage</span>}
                    </div>
                  </div>
                </div>
              )}

              {(result.patternsUsed?.length > 0 || result.patternsMissing?.length > 0) && (
                <div style={{ marginTop: ".75rem", textAlign: "center" }}>
                  <Link href="/patterns" style={{ fontSize: ".78rem", color: "var(--muted)", textDecoration: "none" }}>
                    What do these patterns mean? See the library →
                  </Link>
                </div>
              )}

              {/* Rewrite engine */}
              <div style={{ marginTop: "1.75rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: ".68rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--electric)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".75rem" }}>Rewrite it stronger</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: rewriteStyle && !pro ? ".6rem" : "1rem" }}>
                  {REWRITE_STYLES.map((s, idx) => {
                    const locked = !pro && idx > 0;
                    return (
                      <button
                        key={s}
                        onClick={() => { if (!locked) setRewriteStyle(s); }}
                        title={locked ? "Pro — all 5 styles" : undefined}
                        style={{ padding: "6px 14px", borderRadius: "100px", border: `1px solid ${rewriteStyle === s ? "rgba(108,58,255,.6)" : "var(--border2)"}`, background: rewriteStyle === s ? "rgba(108,58,255,.1)" : "transparent", color: locked ? "var(--muted)" : rewriteStyle === s ? "#C4B5FD" : "var(--muted)", fontSize: ".8rem", cursor: locked ? "not-allowed" : "pointer", fontFamily: "var(--fb)", transition: "all .2s", opacity: locked ? 0.45 : 1 }}
                      >
                        {locked ? `🔒 ${s}` : s}
                      </button>
                    );
                  })}
                </div>
                {!pro && (
                  <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: "1rem" }}>
                    Free: 1 rewrite style. <Link href="/pricing" style={{ color: "var(--electric)", textDecoration: "none" }}>Pro unlocks all 5 + 3 variants →</Link>
                  </div>
                )}

                {/* Targeted rewrite: inject a high-leverage pattern the hook is missing */}
                {result.patternsMissing?.length > 0 && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: ".68rem", color: "var(--gold)", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".6rem" }}>
                      Or fix a missing pattern — 1 click
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {result.patternsMissing.map(p => (
                        <button
                          key={p}
                          onClick={() => rewrite(p)}
                          disabled={rwLoading}
                          style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(255,184,0,.35)", background: activeTarget === p ? "rgba(255,184,0,.12)" : "rgba(255,184,0,.05)", color: "var(--gold)", fontSize: ".8rem", cursor: rwLoading ? "not-allowed" : "pointer", fontFamily: "var(--fb)", transition: "all .2s", opacity: rwLoading ? 0.6 : 1 }}
                        >
                          ＋ {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => rewrite()}
                  disabled={rwLoading}
                  style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", justifyContent: "center", padding: "12px 24px", borderRadius: "100px", border: "none", background: rwLoading ? "var(--s3)" : "linear-gradient(135deg,var(--electric),var(--hot))", color: "#fff", fontSize: ".9rem", fontWeight: 600, fontFamily: "var(--fb)", cursor: rwLoading ? "not-allowed" : "pointer", opacity: rwLoading ? 0.6 : 1 }}
                >
                  {rwLoading
                    ? <><div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite" }} />Rewriting...</>
                    : <>✦ Rewrite — {rewriteStyle}</>}
                </button>

                {rwError && (
                  <div style={{ marginTop: "1rem", background: "rgba(255,45,107,.06)", border: "1px solid rgba(255,45,107,.3)", color: "var(--hot)", borderRadius: "var(--r2)", padding: ".875rem 1.1rem", fontSize: ".82rem" }}>
                    {rwError}
                  </div>
                )}

                {rewrites.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      Original retention
                      <span style={{ fontFamily: "var(--fd)", fontWeight: 800, color: scoreColor(result.score) }}>{result.score}</span>
                      <span>→ {activeTarget ? <>rewritten to add <strong style={{ color: "var(--gold)" }}>{activeTarget}</strong></> : "rewrites below"}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {(pro ? rewrites : rewrites.slice(0, 1)).map((r, i) => {
                        const delta = r.score - result.score;
                        const up = delta >= 0;
                        return (
                          <div key={i} onClick={() => copyRewrite(r.text, i)} style={{ background: "var(--s2)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1rem 1.1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem", transition: "all .2s" }}>
                            <p style={{ flex: 1, fontSize: ".9rem", lineHeight: 1.6, color: "var(--text)" }}>{r.text}</p>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, minWidth: "54px" }}>
                              <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.2rem", color: scoreColor(r.score), letterSpacing: "-1px", lineHeight: 1 }}>{r.score}</span>
                              <span style={{ fontSize: ".62rem", fontFamily: "var(--fd)", fontWeight: 700, color: up ? "var(--neon)" : "var(--hot)", marginTop: "2px" }}>
                                {up ? "+" : ""}{delta} {up ? "▲" : "▼"}
                              </span>
                            </div>
                            <span style={{ fontSize: ".72rem", color: copiedIdx === i ? "var(--neon)" : "var(--muted)", fontFamily: "var(--fb)", whiteSpace: "nowrap", flexShrink: 0 }}>
                              {copiedIdx === i ? "✓ Copied" : "Copy"}
                            </span>
                          </div>
                        );
                      })}
                      {!pro && rewrites.length > 1 && (
                        <ProNote
                          title={`${rewrites.length - 1} more scored variant${rewrites.length - 1 > 1 ? "s" : ""}`}
                          detail="Pro unlocks the full rewrite engine — 5 styles × 3 variants, regenerate any time."
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <Link href="/generator" style={{ fontSize: ".85rem", color: "var(--electric)", textDecoration: "none" }}>
                  Need a stronger hook? Generate 8 scored ones →
                </Link>
              </div>
            </div>
          )}
        </div>

        <NextStep current="analyze" />
      </div>
    </div>
  );
}
