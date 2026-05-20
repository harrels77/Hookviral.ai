"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { NICHE_MODES } from "@/lib/niches";
import { consumeFree, freeRemaining, isPro } from "@/lib/plan";
import { HOOK_PATTERNS } from "@/lib/patterns";
import { NextStep } from "@/components/NextStep";
import { ProNote } from "@/components/ProLock";
import { getNichePref, setNichePref, getGeoPref, setGeoPref } from "@/lib/prefs";

type Velocity = "rising" | "steady" | "cooling" | "new";
interface Trend { title: string; sub: string; velocity?: Velocity; history?: number[]; }

// Tiny rank-history sparkline. Input is rank (1 = top), so we invert: a term
// climbing toward #1 trends upward. Honest — only rendered with ≥3 real points.
function Sparkline({ ranks, color }: { ranks: number[]; color: string }) {
  const w = 56, h = 18;
  const max = Math.max(...ranks), min = Math.min(...ranks);
  const span = max - min || 1;
  const pts = ranks.map((r, i) => {
    const x = (i / (ranks.length - 1)) * w;
    const y = ((r - min) / span) * (h - 2) + 1; // higher rank number = lower line
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0, display: "block" }} aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
}
interface TrendAngle { angle: string; hook: string; score: number; patternsUsed?: string[]; }
interface Decoded { why: string; kind: "news" | "evergreen"; angles: TrendAngle[]; }

function patternHref(name: string) {
  const p = HOOK_PATTERNS.find(x => x.name === name);
  return p ? `/patterns#${p.id}` : "/patterns";
}
type Source = "google" | "youtube";

const GEOS: [string, string][] = [
  ["US", "🇺🇸 US"], ["FR", "🇫🇷 FR"], ["GB", "🇬🇧 UK"],
  ["CA", "🇨🇦 CA"], ["ES", "🇪🇸 ES"], ["DE", "🇩🇪 DE"],
];

function scoreColor(s: number) {
  return s >= 90 ? "var(--neon)" : s >= 78 ? "var(--gold)" : "var(--hot)";
}

const VELOCITY: Record<Velocity, { label: string; color: string; bg: string }> = {
  rising:  { label: "🔥 Rising",  color: "var(--hot)",     bg: "rgba(255,45,107,.1)" },
  new:     { label: "🆕 New",     color: "var(--electric)", bg: "rgba(108,58,255,.1)" },
  steady:  { label: "⚡ Steady",  color: "var(--gold)",    bg: "rgba(255,184,0,.08)" },
  cooling: { label: "📉 Cooling", color: "var(--muted)",   bg: "rgba(255,255,255,.04)" },
};

export default function TrendsPage() {
  const [source, setSource] = useState<Source>("google");
  // Hydrate niche + geo from cross-page prefs so the product remembers you.
  const [niche, setNiche] = useState(() => typeof window !== "undefined" ? getNichePref() : "");
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [geo, setGeo] = useState(() => typeof window !== "undefined" ? (getGeoPref() || "US") : "US");

  // Persist any change for next visit + cross-page consistency.
  useEffect(() => { setNichePref(niche); }, [niche]);
  useEffect(() => { setGeoPref(geo); }, [geo]);

  const load = useCallback(async (src: Source, slug: string, g: string) => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ source: src, geo: g });
      if (slug) qs.set("niche", slug);
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

  useEffect(() => { load(source, niche, geo); }, [source, niche, geo, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trends;
    return trends.filter(t => t.title.toLowerCase().includes(q) || t.sub?.toLowerCase().includes(q));
  }, [trends, query]);

  const nicheLabel = NICHE_MODES.find(n => n.slug === niche)?.label;

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
            Don&apos;t just see a trend — decode it into content angles you can post today.
          </p>
        </div>

        <div className="page-wrap">
          {/* Source toggle + refresh */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)" }}>
              {([["google", "🔎 Google Search"], ["youtube", "▶ YouTube"]] as [Source, string][]).map(([s, label]) => (
                <button key={s} onClick={() => setSource(s)} style={{ padding: "9px 22px", border: "none", background: source === s ? "var(--s3)" : "transparent", color: source === s ? "var(--text)" : "var(--muted)", fontSize: ".82rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)" }}>
              {GEOS.map(([code, label]) => (
                <button key={code} onClick={() => setGeo(code)} title={`Trends for ${code}`} style={{ padding: "9px 14px", border: "none", background: geo === code ? "var(--s3)" : "transparent", color: geo === code ? "var(--text)" : "var(--muted)", fontSize: ".82rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={() => load(source, niche, geo)} disabled={loading} title="Refresh trends"
              style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid var(--border2)", background: "var(--s1)", color: "var(--soft)", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px", transition: "all .2s", opacity: loading ? 0.5 : 1 }}>
              ↻
            </button>
          </div>

          {/* Niche filter — both sources. YouTube = category; Google = Claude relevance re-rank. */}
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.25rem", marginBottom: "12px" }}>
            <div style={{ fontSize: ".68rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".25rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Filter by niche</div>
            <div style={{ fontSize: ".72rem", color: "var(--muted)", marginBottom: ".75rem", fontWeight: 300 }}>
              {niche
                ? `Showing only trends a ${nicheLabel} creator can build on.`
                : "Pick a niche — we keep only the trends you can actually turn into content."}
            </div>
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

          {/* Keyword filter */}
          {!loading && !error && trends.length > 0 && (
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Filter trends by keyword..."
                style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: "var(--r2)", border: "1px solid var(--border2)", background: "var(--s1)", color: "var(--text)", fontSize: ".88rem", fontFamily: "var(--fb)", outline: "none", caretColor: "var(--hot)" }}
              />
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: ".85rem", pointerEvents: "none" }}>🔎</span>
              {query && (
                <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: ".72rem" }}>
                  {filtered.length} match{filtered.length === 1 ? "" : "es"}
                </span>
              )}
            </div>
          )}

          {source === "youtube" && !configured && (
            <div style={{ background: "rgba(255,184,0,.06)", border: "1px solid rgba(255,184,0,.3)", color: "var(--gold)", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7 }}>
              YouTube trends need a <strong>YOUTUBE_API_KEY</strong> in <code>.env.local</code> (free). Meanwhile, <button onClick={() => setSource("google")} style={{ background: "none", border: "none", color: "var(--hot)", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>use Google Search trends</button> — no key needed.
            </div>
          )}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem", opacity: 1 - i * 0.1 }}>
                  <div style={{ width: "24px", height: "20px", background: "var(--s3)", borderRadius: "4px", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: "12px", background: "var(--s3)", borderRadius: "4px", width: `${70 - i * 5}%`, marginBottom: "6px" }} />
                    <div style={{ height: "8px", background: "var(--s2)", borderRadius: "4px", width: "30%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div style={{ background: "rgba(255,45,107,.06)", border: "1px solid rgba(255,45,107,.3)", color: "var(--hot)", borderRadius: "var(--r2)", padding: "1rem 1.25rem", fontSize: ".85rem" }}>
              {error}
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "10px", alignItems: "start" }}>
              {filtered.map((t, i) => (
                <TrendCard key={`${t.title}-${i}`} trend={t} rank={i + 1} niche={niche} />
              ))}
            </div>
          )}

          {!loading && !error && trends.length > 0 && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)", fontSize: ".9rem" }}>
              No trend matches &ldquo;{query}&rdquo;.
            </div>
          )}

          {!loading && !error && trends.length === 0 && configured && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--muted)", fontSize: ".9rem" }}>
              {niche ? "No trend matched this niche right now — try All or another niche." : "No trends found right now."}
            </div>
          )}
        </div>

        <NextStep current="trends" />
      </div>
    </div>
  );
}

function TrendCard({ trend, rank, niche }: { trend: Trend; rank: number; niche: string }) {
  const [hov, setHov] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error" | "locked">("idle");
  const [decoded, setDecoded] = useState<Decoded | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const nicheQs = niche ? `&niche=${niche}` : "";

  useEffect(() => { if (!isPro()) setLeft(freeRemaining("decode")); }, []);

  async function decode() {
    if (state === "done") { setOpen(o => !o); return; }
    if (!consumeFree("decode")) { setOpen(true); setState("locked"); return; }
    setLeft(isPro() ? null : freeRemaining("decode"));
    setOpen(true);
    setState("loading");
    try {
      const res = await fetch("/api/trend-angle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trend: trend.title, niche }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not decode.");
      setDecoded(data.decoded);
      setState("done");
    } catch {
      setState("error");
    }
  }


  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "var(--s1)", border: `1px solid ${open ? "rgba(108,58,255,.4)" : hov ? "rgba(108,58,255,.4)" : "var(--border)"}`, borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", flexDirection: "column", gap: "12px", transition: "all .25s cubic-bezier(.16,1,.3,1)", transform: hov && !open ? "translateY(-3px)" : "none", boxShadow: hov && !open ? "0 16px 40px rgba(108,58,255,.12)" : "none" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".95rem", color: rank <= 3 ? "var(--hot)" : "var(--muted)", flexShrink: 0, width: "22px" }}>
          {rank <= 3 ? "🔥" : rank}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: ".95rem", color: "var(--text)", lineHeight: 1.45, fontWeight: 500 }}>{trend.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
            {trend.velocity && (
              <span style={{ fontSize: ".64rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", color: VELOCITY[trend.velocity].color, background: VELOCITY[trend.velocity].bg, border: `1px solid ${VELOCITY[trend.velocity].color}33` }}>
                {VELOCITY[trend.velocity].label}
              </span>
            )}
            {trend.history && trend.history.length >= 3 && (
              <Sparkline ranks={trend.history} color={trend.velocity ? VELOCITY[trend.velocity].color : "var(--electric)"} />
            )}
            {trend.sub && <span style={{ fontSize: ".72rem", color: "var(--muted)" }}>{trend.sub}</span>}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <Link
          href={`/generator?topic=${encodeURIComponent(trend.title)}${nicheQs}`}
          style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".78rem", fontWeight: 600, textDecoration: "none", fontFamily: "var(--fb)" }}
        >
          ⚡ Get hooks
        </Link>
        <Link
          href={`/analyzer?hook=${encodeURIComponent(trend.title)}`}
          style={{ padding: "9px 16px", borderRadius: "100px", border: "1px solid var(--border2)", color: hov ? "#C4B5FD" : "var(--muted)", fontSize: ".78rem", textDecoration: "none", fontFamily: "var(--fb)", transition: "color .2s", whiteSpace: "nowrap" }}
        >
          ✦ Analyze
        </Link>
      </div>

      {/* Decode → angles */}
      <button
        onClick={decode}
        disabled={state === "loading"}
        style={{ width: "100%", padding: "9px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", background: open ? "rgba(108,58,255,.08)" : "transparent", color: state === "loading" ? "var(--muted)" : "#C4B5FD", fontSize: ".78rem", cursor: state === "loading" ? "wait" : "pointer", fontFamily: "var(--fb)", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
      >
        {state === "loading"
          ? <><span style={{ width: "13px", height: "13px", borderRadius: "50%", border: "2px solid rgba(196,181,253,.3)", borderTopColor: "#C4B5FD", animation: "spin 1s linear infinite", display: "inline-block" }} />Decoding…</>
          : state === "done"
            ? <>🧠 {open ? "Hide angles ▲" : "Show angles ▼"}</>
            : <>🧠 Decode into content angles{left !== null && left !== Infinity ? ` · ${left} left` : ""}</>}
      </button>

      {open && state === "locked" && (
        <ProNote
          title="You've used your 3 free decodes today"
          detail="Resets at midnight. Pro removes the daily cap."
        />
      )}

      {open && state === "error" && (
        <div style={{ fontSize: ".8rem", color: "var(--hot)", textAlign: "center" }}>
          Could not decode this trend. <button onClick={decode} style={{ background: "none", border: "none", color: "var(--electric)", cursor: "pointer", textDecoration: "underline", fontFamily: "var(--fb)", fontSize: ".8rem" }}>Retry</button>
        </div>
      )}

      {open && state === "done" && decoded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", animation: "cardIn .35s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
            <span style={{ fontSize: ".66rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", color: decoded.kind === "news" ? "var(--hot)" : "var(--neon)", background: decoded.kind === "news" ? "rgba(255,45,107,.1)" : "rgba(0,255,178,.08)", border: `1px solid ${decoded.kind === "news" ? "rgba(255,45,107,.3)" : "rgba(0,255,178,.25)"}` }}>
              {decoded.kind === "news" ? "🗞️ News spike — post today" : "🌱 Evergreen — build a series"}
            </span>
            {decoded.why && <span style={{ flex: 1, minWidth: "180px", fontSize: ".8rem", color: "var(--soft)", lineHeight: 1.5, fontStyle: "italic" }}>💡 {decoded.why}</span>}
          </div>
          {decoded.angles.map((a, i) => (
            <AngleCard key={i} a={a} i={i} niche={niche} nicheQs={nicheQs} />
          ))}
        </div>
      )}
    </div>
  );
}

interface Brief { voiceover: string[]; broll: string[]; onScreenText: string[]; cta: string; }

function AngleCard({ a, i, niche, nicheQs }: { a: TrendAngle; i: number; niche: string; nicheQs: string }) {
  const [copied, setCopied] = useState(false);
  const [bs, setBs] = useState<"idle" | "loading" | "done" | "error" | "locked">("idle");
  const [brief, setBrief] = useState<Brief | null>(null);

  async function copyHook() {
    await navigator.clipboard.writeText(a.hook).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function buildBrief() {
    if (bs === "done") { setBs("idle"); return; }
    if (!isPro()) { setBs("locked"); return; }
    setBs("loading");
    try {
      const res = await fetch("/api/trend-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ angle: a.angle, hook: a.hook, niche }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setBrief(data.brief);
      setBs("done");
    } catch {
      setBs("error");
    }
  }

  return (
    <div style={{ background: "var(--s2)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "0.9rem 1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ fontSize: ".72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--fd)", fontWeight: 600 }}>
        Angle {i + 1}
      </div>
      <div style={{ fontSize: ".82rem", color: "var(--soft)", lineHeight: 1.5 }}>{a.angle}</div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <p style={{ flex: 1, fontSize: ".9rem", color: "var(--text)", lineHeight: 1.5, fontWeight: 500 }}>{a.hook}</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.05rem", color: scoreColor(a.score), letterSpacing: "-1px", lineHeight: 1 }}>{a.score}</span>
          <span style={{ fontSize: ".55rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>/100</span>
        </div>
      </div>
      {a.patternsUsed && a.patternsUsed.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {a.patternsUsed.map(p => (
            <Link key={p} href={patternHref(p)} title="Learn this pattern"
              style={{ fontSize: ".62rem", padding: "2px 8px", borderRadius: "100px", background: "rgba(0,255,178,.06)", color: "var(--neon)", border: "1px solid rgba(0,255,178,.2)", textDecoration: "none", fontFamily: "var(--fb)" }}>
              {p}
            </Link>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button
          onClick={copyHook}
          style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid var(--border2)", background: "transparent", color: copied ? "var(--neon)" : "var(--muted)", fontSize: ".72rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}
        >
          {copied ? "✓ Copied" : "Copy hook"}
        </button>
        <Link
          href={`/generator?topic=${encodeURIComponent(a.angle)}${nicheQs}`}
          style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", color: "#C4B5FD", fontSize: ".72rem", textDecoration: "none", fontFamily: "var(--fb)" }}
        >
          ⚡ More hooks
        </Link>
        <button
          onClick={buildBrief}
          disabled={bs === "loading"}
          style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(255,184,0,.3)", background: bs === "done" ? "rgba(255,184,0,.08)" : "transparent", color: "var(--gold)", fontSize: ".72rem", cursor: bs === "loading" ? "wait" : "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}
        >
          {bs === "loading" ? "Building…" : bs === "done" ? "📋 Hide brief" : "📋 Faceless brief · Pro"}
        </button>
      </div>

      {bs === "locked" && (
        <ProNote
          title="Faceless production brief"
          detail="Voiceover beats, B-roll suggestions, on-screen text, ready to shoot. Pro feature."
        />
      )}
      {bs === "error" && (
        <div style={{ fontSize: ".78rem", color: "var(--hot)" }}>
          Couldn&apos;t build the brief. <button onClick={buildBrief} style={{ background: "none", border: "none", color: "var(--electric)", cursor: "pointer", textDecoration: "underline", fontFamily: "var(--fb)", fontSize: ".78rem" }}>Retry</button>
        </div>
      )}
      {bs === "done" && brief && (
        <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1rem", display: "flex", flexDirection: "column", gap: "10px", animation: "cardIn .3s ease" }}>
          {brief.voiceover.map((vo, k) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: "4px", paddingBottom: "8px", borderBottom: k < brief.voiceover.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: ".62rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--fd)", fontWeight: 700 }}>Beat {k + 1}</div>
              <div style={{ fontSize: ".84rem", color: "var(--text)", lineHeight: 1.5 }}>🎙️ {vo}</div>
              {brief.broll[k] && <div style={{ fontSize: ".76rem", color: "var(--soft)", lineHeight: 1.5 }}>🎬 {brief.broll[k]}</div>}
              {brief.onScreenText[k] && <div style={{ fontSize: ".76rem", color: "#C4B5FD", lineHeight: 1.5 }}>🔤 {brief.onScreenText[k]}</div>}
            </div>
          ))}
          {brief.cta && (
            <div style={{ fontSize: ".84rem", color: "var(--neon)", fontWeight: 500 }}>📣 {brief.cta}</div>
          )}
        </div>
      )}
    </div>
  );
}
