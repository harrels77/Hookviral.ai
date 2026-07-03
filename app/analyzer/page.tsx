"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { isPro } from "@/lib/plan";
import { NICHE_MODES } from "@/lib/niches";
import { NextStep } from "@/components/NextStep";
import { ProNote } from "@/components/ProLock";
import { patternHref } from "@/lib/patterns";
import { scoreColor } from "@/lib/score";
import { Icon } from "@/lib/icons";
import { Button, Spinner } from "@/components/ui";
import { PLATFORMS as PLATFORM_MODES, getPlatform } from "@/lib/platforms";
import { getNichePref, setNichePref } from "@/lib/prefs";

// Short-form only — the product's positioning (lib/platforms.ts is the
// source of truth; LinkedIn/X options contradicted it and had no psychology
// block behind them).
const PLATFORMS = PLATFORM_MODES.map(p => p.label);

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

// Heuristic: does this read more like a search query (a topic) than a hook?
// Real hooks carry signals — personal pronouns, imperative verbs, punctuation,
// question/exclamation. A search-bar entry like "meghan markle england visit"
// has none of those. False positives are cheap (we still let them analyze) so
// we lean toward flagging short plain noun phrases.
function looksLikeTopic(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const words = t.split(/\s+/);
  if (words.length === 0 || words.length > 6) return false;
  if (/[?!.,:;'"—–-]/.test(t)) return false;
  if (/\b(i|i'm|i've|my|me|you|your|you're|we|our|they|this|that|here|there|nobody|everyone|everybody)\b/i.test(t)) return false;
  if (/^(watch|look|stop|wait|see|listen|hear|read|imagine|why|how|what|who|where|when|behold|meet|introducing)\b/i.test(t)) return false;
  return true;
}
const REWRITE_STYLES = ["More emotional", "More cinematic", "More contrarian", "More storytelling", "Punchier"];

interface Analysis {
  score: number;
  formula: string;
  // 2-6 word searchable subject the hook is about, e.g. "Mbappé refusal PSG 2017".
  // Empty when the hook has no real-world topic to research (pure lifestyle filler).
  // Drives the "🔬 Research the topic" CTA which deep-links to /trends/research.
  subject?: string;
  why: string;
  curiosity: number;
  emotion: number;
  clarity: number;
  weakPoints: string[];
  patternsUsed: string[];
  patternsMissing: string[];
}

// Mirror of lib/takes.ts shape — restated here to keep this page a clean
// client boundary (the lib is server-only because it imports the Anthropic SDK).
interface TakeHook { text: string; score: number; patternsUsed?: string[] }
interface Take {
  emoji: string;
  name: string;
  stance: string;
  reasoning: string;
  arguments: string[];
  hooks: TakeHook[];
}
interface StrategicTakes {
  isControversial: boolean;
  takes: Take[];
  sources: string[];
}

// SessionStorage cache for takes — same pattern as /trends/research, scoped
// per tab so back-nav restores instantly.
function takesSessionKey(subject: string, niche: string) {
  return `hv:takes:${subject.toLowerCase()}::${niche}`;
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
  const [rewriteStyle, setRewriteStyle] = useState(REWRITE_STYLES[0]);
  const [activeTarget, setActiveTarget] = useState<string | null>(null);
  const [rewrites, setRewrites] = useState<{ text: string; score: number }[]>([]);
  const [rwLoading, setRwLoading] = useState(false);
  const [rwError, setRwError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [pro, setPro] = useState(false);
  // Strategic Takes mode — when the input reads like a subject (not a hook),
  // we skip scoring and produce 2-3 defendable positions on the subject with
  // arguments + ready hooks per position. Web-search backed via /api/strategic-takes.
  const [takes, setTakes] = useState<StrategicTakes | null>(null);
  const [takesSubject, setTakesSubject] = useState("");
  const prefilled = useRef(false);

  useEffect(() => { setPro(isPro()); }, []);
  useEffect(() => { setNichePref(niche); }, [niche]);

  function resetRewrites() {
    setRewrites([]);
    setRwError("");
    setCopiedIdx(null);
  }

  function resetAllResults() {
    setResult(null);
    setTakes(null);
    setTakesSubject("");
    resetRewrites();
  }

  async function analyze(opts: { forceHook?: boolean; overrideHook?: string; overridePlatform?: string } = {}) {
    const h = (opts.overrideHook ?? hook).trim();
    if (!h) return;

    // Subject mode: skip the hook scorer entirely. A search-term-shaped input
    // gets 12/100 no matter what, which frustrated users. Branch to Strategic
    // Takes (web-search backed positions on the subject) instead. User can
    // override via "Score as a hook anyway" if our heuristic over-flagged.
    if (!opts.forceHook && looksLikeTopic(h)) {
      return fetchTakes(h);
    }

    setLoading(true);
    setError("");
    resetAllResults();
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: h, platform: opts.overridePlatform ?? platform, niche }),
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

  async function fetchTakes(subject: string) {
    setLoading(true);
    setError("");
    resetAllResults();
    setTakesSubject(subject);
    // SessionStorage hit = instant restore on back-nav from another page,
    // or repeat-clicking Analyze on the same subject in this tab.
    try {
      const stored = sessionStorage.getItem(takesSessionKey(subject, niche));
      if (stored) {
        setTakes(JSON.parse(stored) as StrategicTakes);
        setLoading(false);
        return;
      }
    } catch { /* sessionStorage disabled or quota — fall through to fetch */ }

    try {
      const res = await fetch("/api/strategic-takes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, niche }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not compute strategic takes.");
      setTakes(data.takes);
      try {
        sessionStorage.setItem(takesSessionKey(subject, niche), JSON.stringify(data.takes));
      } catch { /* ignore */ }
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
    // Accept slug ("tiktok") or label ("TikTok") — SEO pages deep-link slugs.
    const p = searchParams.get("platform");
    const platLabel = p ? getPlatform(p)?.label : undefined;
    const plat = platLabel ?? platform;
    const trimmed = h.slice(0, 300);
    if (platLabel) setPlatform(platLabel);
    setHook(trimmed);
    analyze({ overrideHook: trimmed, overridePlatform: plat });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const t3 = threeSecondCheck(hook);
  const wordCount = hook.trim() ? hook.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div>
        <div style={{ borderBottom: "1px solid var(--border)", padding: "2.5rem 1.5rem 2rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".5rem" }}>
            Hook <span>Analyzer</span>
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: ".95rem" }}>
            Paste any opening line — get the score, the missing patterns, and a stronger rewrite in seconds.
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
              style={{ width: "100%", background: "transparent", border: "none", padding: ".5rem 1.5rem 2.5rem", color: "var(--text)", fontSize: "1rem", fontFamily: "var(--fb)", resize: "none", lineHeight: 1.7, caretColor: "var(--accent)" }}
            />
            <div style={{ position: "absolute", bottom: "1rem", right: "1.25rem", fontSize: ".72rem", color: hook.length > 270 ? "var(--hot)" : "var(--muted)" }}>{hook.length}/300</div>
          </div>

          {/* Live 3-second deliverability check */}
          {t3 && (
            <div style={{ background: "var(--s1)", border: `1px solid ${t3.color}33`, borderRadius: "var(--r2)", padding: ".85rem 1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "var(--text-xs)", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: t3.color }}>
                <Icon name="timer" /> {t3.label}
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
            <summary style={{ cursor: "pointer", fontSize: "var(--text-sm)", color: "var(--text-muted)", fontFamily: "var(--fb)", padding: "6px 4px", listStyle: "none", userSelect: "none" }}>
              More options <span style={{ opacity: .6 }}>(platform, niche)</span>
            </summary>
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="card" style={{ padding: "1.25rem" }}>
                <div className="kicker" style={{ marginBottom: ".75rem" }}>Platform</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => setPlatform(p)} className="chip" data-active={platform === p}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: "1.25rem" }}>
                <div className="kicker" style={{ marginBottom: ".75rem" }}>Niche <span style={{ textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>— optional, sharpens the verdict</span></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <button onClick={() => setNiche("")} className="chip" data-active={niche === ""}>
                    Any
                  </button>
                  {NICHE_MODES.map(nm => (
                    <button key={nm.slug} onClick={() => setNiche(nm.slug)} className="chip" data-active={niche === nm.slug}>
                      {nm.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>

          {/* Analyze button */}
          <div style={{ marginBottom: "12px" }}>
            <Button onClick={() => analyze()} disabled={loading || !hook.trim()} block>
              {loading
                ? <><Spinner />{looksLikeTopic(hook) ? <>Researching positions… <span style={{ fontSize: "var(--text-sm)", opacity: .8 }}>(~10s)</span></> : <>Analyzing…</>}</>
                : <>Analyze {looksLikeTopic(hook) && hook.trim() ? "subject" : "retention"}</>}
            </Button>
          </div>

          {error && (
            <div style={{ background: "var(--danger-soft)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: "var(--r-md)", padding: "1rem 1.25rem", marginBottom: "12px", fontSize: "var(--text-sm)" }}>
              {error}
            </div>
          )}

          {takes && (
            <TakesView
              takes={takes}
              subject={takesSubject}
              onForceScore={() => analyze({ forceHook: true, overrideHook: takesSubject })}
            />
          )}

          {result && (
            <div style={{ background: "var(--s1)", border: "1px solid rgba(108,58,255,.3)", borderRadius: "var(--r3)", padding: "1.75rem", animation: "cardIn .4s ease" }}>
              {/* Topic-shape fallback. Reached only when the user explicitly
                  bypassed the auto-detector via "Score as a hook anyway" — the
                  default path branches to Strategic Takes before this view
                  renders. Offer the takes flow as the recovery path now that
                  they've confirmed the score is unhelpful. */}
              {looksLikeTopic(hook) && result.score < 40 && (
                <div style={{ marginBottom: "1.5rem", background: "var(--warning-soft)", border: "1px solid var(--warning)", borderRadius: "var(--r-md)", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontSize: "var(--text-sm)", color: "var(--warning)", fontFamily: "var(--fb)", fontWeight: 500, lineHeight: 1.6 }}>
                    This still reads like a <strong>subject</strong>, not a hook. The low score is honest — a search-bar entry can&apos;t stop the scroll on its own.
                  </div>
                  <Button onClick={() => fetchTakes(hook.trim())} size="sm" style={{ alignSelf: "flex-start" }}>
                    <Icon name="target" />
                    Get strategic positions on &ldquo;{hook.trim().slice(0, 40)}{hook.trim().length > 40 ? "…" : ""}&rdquo;
                  </Button>
                </div>
              )}

              {/* Score header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", marginBottom: "4px", fontFamily: "var(--fd)", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                    Retention score
                    <Link href="/why-it-works" title="How is this computed?" style={{ fontSize: ".68rem", color: "var(--electric)", textDecoration: "none", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>
                      How?
                    </Link>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontFamily: "var(--fd)", fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-2px", color: scoreColor(result.score), lineHeight: 1 }}>{result.score}</span>
                    <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>/100</span>
                  </div>
                </div>
                <span style={{ fontSize: "var(--text-xs)", fontFamily: "var(--fd)", fontWeight: 700, padding: "5px 14px", borderRadius: "var(--r-pill)", background: "var(--accent-soft)", color: "var(--accent)" }}>{result.formula}</span>
              </div>

              <div style={{ height: "5px", background: "var(--surface-3)", borderRadius: "3px", overflow: "hidden", marginBottom: "1.5rem" }}>
                <div style={{ height: "100%", borderRadius: "3px", background: scoreColor(result.score), width: `${result.score}%`, transition: "width .8s cubic-bezier(.16,1,.3,1)" }} />
              </div>

              {/* Why */}
              <p style={{ fontSize: ".9rem", color: "var(--soft)", lineHeight: 1.7, marginBottom: "1.5rem" }}>{result.why}</p>

              {/* Sub-scores — same semantic tiers as the main score (lib/score) */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: result.weakPoints?.length ? "1.5rem" : 0 }}>
                {([["Curiosity", result.curiosity], ["Emotion", result.emotion], ["Clarity", result.clarity]] as [string, number][]).map(([label, val]) => (
                  <div key={label} style={{ flex: 1, minWidth: "90px" }}>
                    <div className="kicker" style={{ fontSize: ".7rem", marginBottom: "5px" }}>{label}</div>
                    <div style={{ height: "5px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: scoreColor(val * 10), borderRadius: "4px", width: `${val * 10}%`, transition: "width .6s ease" }} />
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: scoreColor(val * 10), fontFamily: "var(--fd)", fontWeight: 700, marginTop: "4px" }}>{val}/10</div>
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
                <div className="hv-an-patterns" style={{ marginTop: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ background: "var(--s2)", borderRadius: "var(--r2)", padding: "1rem 1.1rem", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: ".64rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".6rem" }}>Patterns it uses</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {result.patternsUsed?.length > 0
                        ? result.patternsUsed.map(p => (
                          <Link key={p} href={patternHref(p)} title="What this pattern means" style={{ fontSize: "var(--text-xs)", padding: "3px 9px", borderRadius: "var(--r-pill)", background: "var(--success-soft)", color: "var(--success)", border: "1px solid var(--success)", textDecoration: "none" }}>{p}</Link>
                        ))
                        : <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>None detected</span>}
                    </div>
                  </div>
                  <div style={{ background: "var(--s2)", borderRadius: "var(--r2)", padding: "1rem 1.1rem", border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: ".64rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--gold)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".6rem" }}>Missing — biggest levers</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {result.patternsMissing?.length > 0
                        ? result.patternsMissing.map(p => (
                          <Link key={p} href={patternHref(p)} title="Learn this pattern" style={{ fontSize: "var(--text-xs)", padding: "3px 9px", borderRadius: "var(--r-pill)", background: "var(--warning-soft)", color: "var(--warning)", border: "1px solid var(--warning)", textDecoration: "none" }}>{p}</Link>
                        ))
                        : <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>Solid coverage</span>}
                    </div>
                  </div>
                </div>
              )}

              {(result.patternsUsed?.length > 0 || result.patternsMissing?.length > 0) && (
                <div style={{ marginTop: ".75rem", textAlign: "center" }}>
                  <Link href="/patterns" style={{ fontSize: ".78rem", color: "var(--muted)", textDecoration: "none" }}>
                    What do these patterns mean? See the library
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
                        className="chip"
                        data-active={rewriteStyle === s}
                        style={{ opacity: locked ? 0.45 : 1, cursor: locked ? "not-allowed" : "pointer" }}
                      >
                        {locked ? <><Icon name="lock" /> {s}</> : s}
                      </button>
                    );
                  })}
                </div>
                {!pro && (
                  <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: "1rem" }}>
                    Free: 1 rewrite style. <Link href="/pricing" style={{ color: "var(--accent)", textDecoration: "none" }}>Pro unlocks all 5 + 3 variants</Link>
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
                          style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "6px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--warning)", background: activeTarget === p ? "var(--warning-soft)" : "transparent", color: "var(--warning)", fontSize: "var(--text-sm)", cursor: rwLoading ? "not-allowed" : "pointer", fontFamily: "var(--fb)", transition: "all .2s", opacity: rwLoading ? 0.6 : 1 }}
                        >
                          <Icon name="plus" /> {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={() => rewrite()} disabled={rwLoading} block>
                  {rwLoading
                    ? <><Spinner />Rewriting…</>
                    : <>Rewrite — {rewriteStyle}</>}
                </Button>

                {rwError && (
                  <div style={{ marginTop: "1rem", background: "var(--danger-soft)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: "var(--r-md)", padding: ".875rem 1.1rem", fontSize: "var(--text-sm)" }}>
                    {rwError}
                  </div>
                )}

                {rewrites.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      Original retention
                      <span style={{ fontFamily: "var(--fd)", fontWeight: 800, color: scoreColor(result.score) }}>{result.score}</span>
                      <span>{activeTarget ? <>rewritten to add <strong style={{ color: "var(--gold)" }}>{activeTarget}</strong></> : "rewrites below"}</span>
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
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "var(--text-xs)", fontFamily: "var(--fd)", fontWeight: 700, color: up ? "var(--success)" : "var(--danger)", marginTop: "2px" }}>
                                {up ? "+" : ""}{delta} <Icon name={up ? "trending-up" : "trending-down"} />
                              </span>
                            </div>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "var(--text-xs)", color: copiedIdx === i ? "var(--success)" : "var(--text-muted)", fontFamily: "var(--fb)", whiteSpace: "nowrap", flexShrink: 0 }}>
                              {copiedIdx === i ? <><Icon name="check" /> Copied</> : <><Icon name="copy" /> Copy</>}
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

              {/* Push this further with web research. When the model extracted
                  a clean subject from the hook, link to the same /trends/research
                  page that powers the deep dive on trend cards. Closes the loop:
                  hook → score → "now go deeper on the topic itself". */}
              {result.subject && result.subject.length > 0 && (
                <div style={{ marginTop: "1.75rem", background: "var(--s2)", border: "1px solid rgba(108,58,255,.3)", borderRadius: "var(--r3)", padding: "1.1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div className="kicker" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", marginBottom: ".4rem" }}>
                        <Icon name="flask" /> Push it further
                      </div>
                      <div style={{ fontSize: ".88rem", color: "var(--soft)", lineHeight: 1.5 }}>
                        Deep research on <strong style={{ color: "var(--text)" }}>&ldquo;{result.subject}&rdquo;</strong> — context, stakes, and 3-5 new angles to film.
                      </div>
                    </div>
                    <Link
                      href={`/trends/research?q=${encodeURIComponent(result.subject)}${niche ? `&niche=${encodeURIComponent(niche)}` : ""}`}
                      className="btn btn-primary btn-sm"
                    >
                      Research &amp; angles
                      <Icon name="arrow-right" />
                    </Link>
                  </div>
                </div>
              )}

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <Link href="/generator" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "var(--text-sm)", color: "var(--accent)", textDecoration: "none" }}>
                  Need a stronger hook? Generate 8 scored ones <Icon name="arrow-right" />
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

// Strategic Takes view — rendered when the user pasted a subject (not a hook)
// and the auto-branch sent them here instead of the scoring path. Each take
// is a defendable position with arguments + ready scored hooks.
function TakesView({
  takes,
  subject,
  onForceScore,
}: {
  takes: StrategicTakes;
  subject: string;
  onForceScore: () => void;
}) {
  return (
    <div style={{ animation: "cardIn .4s ease", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header explaining the mode switch — the user clicked Analyze but
          got something different than a score. State that up-front. */}
      <div style={{ background: "var(--s1)", border: "1px solid rgba(108,58,255,.3)", borderRadius: "var(--r3)", padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <div className="kicker" style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", marginBottom: ".5rem" }}>
              <Icon name="target" /> Strategic Takes
            </div>
            <div style={{ fontSize: ".95rem", color: "var(--soft)", lineHeight: 1.55 }}>
              &ldquo;<strong style={{ color: "var(--text)" }}>{subject}</strong>&rdquo; reads as a subject, not a hook. Here are{" "}
              <strong style={{ color: "var(--text)" }}>{takes.takes.length} defendable position{takes.takes.length === 1 ? "" : "s"}</strong> you could film today, each with arguments + ready scored hooks.
            </div>
            {!takes.isControversial && takes.takes.length > 0 && (
              <div style={{ marginTop: ".5rem", fontSize: ".75rem", color: "var(--muted)", fontStyle: "italic" }}>
                This subject isn&apos;t inherently polarizing — positions below are angles, not opposing camps.
              </div>
            )}
          </div>
          <button
            onClick={onForceScore}
            style={{ padding: "8px 16px", borderRadius: "100px", border: "1px solid var(--border2)", background: "transparent", color: "var(--muted)", fontSize: ".74rem", fontFamily: "var(--fb)", cursor: "pointer", whiteSpace: "nowrap" }}
            title="If this actually was a hook, score it anyway"
          >
            Score as a hook anyway
          </button>
        </div>
      </div>

      {/* Take cards */}
      {takes.takes.map((take, i) => (
        <TakeCard key={i} take={take} index={i} />
      ))}

      {takes.takes.length === 0 && (
        <div style={{ background: "var(--s1)", border: "1px dashed var(--border)", borderRadius: "var(--r2)", padding: "1.5rem", textAlign: "center", color: "var(--muted)", fontSize: ".88rem" }}>
          No defendable positions returned. The subject may be too narrow — try a more specific or controversial framing.
        </div>
      )}

      {/* Sources */}
      {takes.sources.length > 0 && (
        <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: ".64rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: ".6rem" }}>
            Sources
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {takes.sources.map(url => {
              let host = url;
              try { host = new URL(url).hostname.replace(/^www\./, ""); } catch { /* keep raw */ }
              return (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "var(--text-xs)", padding: "4px 12px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-strong)", color: "var(--accent)", textDecoration: "none", fontFamily: "var(--fb)" }}>
                  {host} <Icon name="arrow-up-right" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TakeCard({ take, index }: { take: Take; index: number }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function copyHook(text: string, i: number) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(c => (c === i ? null : c)), 1500);
  }

  return (
    <div className="card" style={{ borderLeft: "3px solid var(--accent)", borderRadius: "var(--r-lg)", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Take header: numbered position + name + stance. One accent for all
          takes — the number distinguishes the camps (DS §3, one accent). */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".5rem" }}>
          <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 800, fontSize: "var(--text-sm)", flexShrink: 0 }}>{index + 1}</span>
          <h3 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-lg)", fontWeight: 800, color: "var(--text)" }}>
            {take.name}
          </h3>
        </div>
        <p style={{ fontSize: "var(--text-base)", color: "var(--text)", lineHeight: 1.55, fontWeight: 500 }}>
          {take.stance}
        </p>
        {take.reasoning && (
          <p style={{ marginTop: ".5rem", fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.55, fontStyle: "italic" }}>
            {take.reasoning}
          </p>
        )}
      </div>

      {/* Arguments — the talking points to put forward */}
      {take.arguments.length > 0 && (
        <div>
          <div style={{ fontSize: ".62rem", color: "var(--gold)", fontFamily: "var(--fd)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: ".5rem" }}>
            Arguments to put forward
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: ".4rem" }}>
            {take.arguments.map((arg, i) => (
              <li key={i} style={{ fontSize: ".85rem", color: "var(--soft)", lineHeight: 1.55 }}>
                {arg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ready hooks for this take */}
      {take.hooks.length > 0 && (
        <div>
          <div className="kicker" style={{ fontSize: ".7rem", color: "var(--success)", marginBottom: ".5rem" }}>
            Ready hooks for this take
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {take.hooks.map((h, i) => (
              <div key={i} style={{ background: "var(--s2)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: ".85rem 1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <p style={{ flex: 1, fontSize: ".92rem", color: "var(--text)", lineHeight: 1.5, fontWeight: 500 }}>
                    {h.text}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.1rem", color: scoreColor(h.score), letterSpacing: "-1px", lineHeight: 1 }}>
                      {h.score}
                    </span>
                    <span style={{ fontSize: ".58rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>/100</span>
                  </div>
                </div>
                {h.patternsUsed && h.patternsUsed.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {h.patternsUsed.map(p => (
                      <Link key={p} href={patternHref(p)} title="Learn this pattern"
                        style={{ fontSize: "var(--text-xs)", padding: "2px 8px", borderRadius: "var(--r-pill)", background: "var(--success-soft)", color: "var(--success)", border: "1px solid var(--success)", textDecoration: "none", fontFamily: "var(--fb)" }}>
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => copyHook(h.text, i)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-strong)", background: "transparent", color: copiedIdx === i ? "var(--success)" : "var(--text-muted)", fontSize: "var(--text-xs)", cursor: "pointer", fontFamily: "var(--fb)" }}
                  >
                    {copiedIdx === i ? <><Icon name="check" /> Copied</> : <><Icon name="copy" /> Copy</>}
                  </button>
                  <Link
                    href={`/analyzer?hook=${encodeURIComponent(h.text)}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "var(--r-pill)", border: "1px solid var(--accent)", color: "var(--accent)", fontSize: "var(--text-xs)", textDecoration: "none", fontFamily: "var(--fb)" }}
                  >
                    <Icon name="sparkles" /> Analyze
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
