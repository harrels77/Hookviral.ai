"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HOOK_PATTERNS } from "@/lib/patterns";
import { isPro } from "@/lib/plan";
import { ProNote } from "@/components/ProLock";

// SessionStorage cache for instant restore on back-nav. Scoped to the tab
// (cleared on close), which is the right scope — we want "back" to feel
// like nothing happened, but a fresh tab should re-fetch. Key includes
// trend+niche so different research pages don't collide.
const SESSION_PREFIX = "hv:research:";
function sessionKey(q: string, niche: string) {
  return `${SESSION_PREFIX}${q.toLowerCase()}::${niche}`;
}

// Mirror of lib/trends.ts types — we restate them client-side rather than
// import from a server-only module to keep this page a clean client boundary.
interface TrendAngle {
  angle: string;
  reasoning?: string;
  hook: string;
  score: number;
  patternsUsed?: string[];
}
interface TrendContext {
  who: string;
  what: string;
  whyTrending: string;
  stakes: string;
  timeline: string;
}
interface Decoded {
  context: TrendContext;
  kind: "news" | "evergreen";
  angles: TrendAngle[];
  sources: string[];
}

function patternHref(name: string) {
  const p = HOOK_PATTERNS.find(x => x.name === name);
  return p ? `/patterns#${p.id}` : "/patterns";
}

function scoreColor(s: number) {
  return s >= 90 ? "var(--neon)" : s >= 78 ? "var(--gold)" : "var(--hot)";
}

export default function ResearchPage() {
  return (
    <Suspense fallback={<PageShell><LoadingState trend="" /></PageShell>}>
      <ResearchInner />
    </Suspense>
  );
}

function ResearchInner() {
  const params = useSearchParams();
  const trend = (params.get("q") || "").trim();
  const niche = (params.get("niche") || "").trim();

  // Initial render tries sessionStorage synchronously so the back-nav case
  // shows the previous result instantly — no loading flash. Falls back to
  // "loading" if there's nothing stored, then the effect below kicks the fetch.
  const initial = (() => {
    if (typeof window === "undefined" || !trend) return null;
    try {
      const raw = sessionStorage.getItem(sessionKey(trend, niche));
      return raw ? (JSON.parse(raw) as Decoded) : null;
    } catch { return null; }
  })();

  const [state, setState] = useState<"loading" | "done" | "error">(initial ? "done" : "loading");
  const [data, setData] = useState<Decoded | null>(initial);
  const [errMsg, setErrMsg] = useState("");

  const fetchResearch = useCallback(async () => {
    if (!trend) {
      setState("error");
      setErrMsg("No trend provided. Pick one from /trends.");
      return;
    }
    setState("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/trend-angle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trend, niche }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not research this trend.");
      setData(json.decoded);
      setState("done");
      // Persist for instant restore if the user navigates away and back.
      try {
        sessionStorage.setItem(sessionKey(trend, niche), JSON.stringify(json.decoded));
      } catch { /* quota or disabled — non-blocking */ }
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  }, [trend, niche]);

  // Skip the fetch when we already restored from sessionStorage. The result
  // is at most 6h old (Upstash cache) and we'd just be re-fetching the same
  // payload — pure waste of latency.
  useEffect(() => {
    if (initial) return;
    fetchResearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchResearch]);

  return (
    <PageShell>
      {/* Header bar — trend title is the subject of this page, kind badge is
          the headline call-to-action ("post today" vs "build a series"). */}
      <div style={{ marginBottom: "1.5rem" }}>
        <Link
          href="/trends"
          style={{ color: "var(--muted)", fontSize: ".82rem", fontFamily: "var(--fb)", textDecoration: "none", padding: "4px 0", marginBottom: "1rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          ← Back to trends
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--electric)", fontFamily: "var(--fd)", fontWeight: 700, marginBottom: ".5rem" }}>
              🔬 Research
            </div>
            <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.15, color: "var(--text)" }}>
              {trend || "—"}
            </h1>
            {niche && (
              <div style={{ marginTop: ".5rem", fontSize: ".78rem", color: "var(--muted)", fontFamily: "var(--fb)" }}>
                For: <span style={{ color: "#C4B5FD" }}>{niche}</span> creators
              </div>
            )}
          </div>
          {data && state === "done" && (
            <span style={{ fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "5px 14px", borderRadius: "100px", color: data.kind === "news" ? "var(--hot)" : "var(--neon)", background: data.kind === "news" ? "rgba(255,45,107,.1)" : "rgba(0,255,178,.08)", border: `1px solid ${data.kind === "news" ? "rgba(255,45,107,.3)" : "rgba(0,255,178,.25)"}`, whiteSpace: "nowrap" }}>
              {data.kind === "news" ? "🗞️ News spike — post today" : "🌱 Evergreen — build a series"}
            </span>
          )}
        </div>
      </div>

      {state === "loading" && <LoadingState trend={trend} />}
      {state === "error" && <ErrorState err={errMsg} retry={fetchResearch} hasTrend={!!trend} />}
      {state === "done" && data && <ResearchReport data={data} niche={niche} />}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "var(--electric)", borderRadius: "50%", top: "-200px", left: "-200px", filter: "blur(110px)", opacity: .05, animation: "orbFloat 16s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem 4rem" }}>
        {children}
      </div>
    </div>
  );
}

function LoadingState({ trend }: { trend: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "20px" }}>
      <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ width: "20px", height: "20px", borderRadius: "50%", border: "3px solid rgba(108,58,255,.2)", borderTopColor: "var(--electric)", animation: "spin 1s linear infinite", display: "inline-block" }} />
          <span style={{ fontSize: ".95rem", color: "var(--soft)", fontFamily: "var(--fb)" }}>
            {trend ? <>Searching the web for <strong style={{ color: "var(--text)" }}>{trend}</strong>…</> : "Loading…"}
          </span>
        </div>
        <div style={{ fontSize: ".82rem", color: "var(--muted)", lineHeight: 1.6 }}>
          Claude is reading 1–3 sources to pull the real context — who, what, why now, the stakes.
          Takes about 10 seconds the first time. Subsequent visits on this trend are instant (6h cache).
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.25rem", opacity: 1 - i * 0.15 }}>
            <div style={{ height: "10px", background: "var(--s3)", borderRadius: "4px", width: "30%", marginBottom: "12px" }} />
            <div style={{ height: "14px", background: "var(--s3)", borderRadius: "4px", width: "85%", marginBottom: "6px" }} />
            <div style={{ height: "14px", background: "var(--s2)", borderRadius: "4px", width: "60%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ err, retry, hasTrend }: { err: string; retry: () => void; hasTrend: boolean }) {
  return (
    <div style={{ background: "rgba(255,45,107,.05)", border: "1px solid rgba(255,45,107,.3)", borderRadius: "var(--r3)", padding: "2rem", textAlign: "center" }}>
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
      <div style={{ fontSize: "1rem", color: "var(--hot)", fontFamily: "var(--fb)", fontWeight: 500, marginBottom: ".5rem" }}>
        {err}
      </div>
      <div style={{ fontSize: ".82rem", color: "var(--muted)", marginBottom: "1.5rem", maxWidth: "440px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
        Web search costs tokens and can fail — usually a transient issue. Retrying is free if the result was cached.
      </div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        {hasTrend && (
          <button onClick={retry} style={{ padding: "10px 22px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.4)", background: "rgba(108,58,255,.08)", color: "#C4B5FD", fontSize: ".88rem", fontWeight: 500, fontFamily: "var(--fb)", cursor: "pointer" }}>
            ↻ Retry
          </button>
        )}
        <Link href="/trends" style={{ padding: "10px 22px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--muted)", fontSize: ".88rem", fontFamily: "var(--fb)", textDecoration: "none" }}>
          ← Back to trends
        </Link>
      </div>
    </div>
  );
}

function ResearchReport({ data, niche }: { data: Decoded; niche: string }) {
  const hasContext =
    data.context.who || data.context.what || data.context.whyTrending ||
    data.context.stakes || data.context.timeline;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Two-column layout: context (sticky) on the left, angles on the right.
          Below 880px the grid collapses to a single column via clamp magic. */}
      <div className="research-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 0.42fr) minmax(0, 0.58fr)", gap: "24px", alignItems: "start" }}>
        {/* CONTEXT */}
        {hasContext ? (
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.5rem 1.6rem", position: "sticky", top: "1.5rem" }}>
            <div style={{ fontSize: ".66rem", color: "var(--electric)", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "var(--fd)", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "20px", height: "1px", background: "var(--electric)" }} /> Context
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {([
                ["👤", "Who", data.context.who],
                ["📍", "What", data.context.what],
                ["📈", "Why now", data.context.whyTrending],
                ["⚖️", "Stakes", data.context.stakes],
                ["⏱", "When", data.context.timeline],
              ] as [string, string, string][]).filter(([, , v]) => v).map(([emoji, label, body]) => (
                <div key={label}>
                  <div style={{ fontSize: ".66rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: ".4rem" }}>
                    {emoji} {label}
                  </div>
                  <div style={{ fontSize: ".88rem", color: "var(--soft)", lineHeight: 1.65 }}>
                    {body}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <div />}

        {/* ANGLES */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: ".66rem", color: "var(--hot)", textTransform: "uppercase", letterSpacing: "2px", fontFamily: "var(--fd)", fontWeight: 700, marginBottom: ".25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "20px", height: "1px", background: "var(--hot)" }} /> {data.angles.length} angle{data.angles.length === 1 ? "" : "s"} to film
          </div>
          {data.angles.map((a, i) => (
            <AngleCard key={i} a={a} i={i} niche={niche} />
          ))}
          {data.angles.length === 0 && (
            <div style={{ background: "var(--s1)", border: "1px dashed var(--border)", borderRadius: "var(--r2)", padding: "1.5rem", textAlign: "center", color: "var(--muted)", fontSize: ".85rem" }}>
              No angles returned. Try retrying or picking a more specific trend.
            </div>
          )}
        </div>
      </div>

      {/* SOURCES */}
      {data.sources.length > 0 && (
        <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: ".64rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: ".6rem" }}>
            Sources
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {data.sources.map(url => {
              let host = url;
              try { host = new URL(url).hostname.replace(/^www\./, ""); } catch { /* keep raw */ }
              return (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: ".74rem", padding: "4px 12px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--electric)", textDecoration: "none", fontFamily: "var(--fb)" }}>
                  {host} ↗
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile: stack the two columns. Tailwind-free, single-rule media query. */}
      <style jsx>{`
        @media (max-width: 880px) {
          :global(.research-grid) {
            grid-template-columns: 1fr !important;
          }
          :global(.research-grid > div:first-child) {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}

interface Brief { voiceover: string[]; broll: string[]; onScreenText: string[]; cta: string }

function AngleCard({ a, i, niche }: { a: TrendAngle; i: number; niche: string }) {
  const [copied, setCopied] = useState(false);
  const [bs, setBs] = useState<"idle" | "loading" | "done" | "error" | "locked">("idle");
  const [brief, setBrief] = useState<Brief | null>(null);
  const nicheQs = niche ? `&niche=${encodeURIComponent(niche)}` : "";

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
    <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "12px", transition: "border-color .2s" }}>
      {/* Header row: index + score */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ fontSize: ".66rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          Angle {i + 1}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.4rem", color: scoreColor(a.score), letterSpacing: "-1px", lineHeight: 1 }}>{a.score}</span>
          <span style={{ fontSize: ".62rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>/100</span>
        </div>
      </div>

      {/* The angle (what story this video tells) */}
      <div style={{ fontSize: ".95rem", color: "var(--text)", lineHeight: 1.55, fontWeight: 500 }}>
        {a.angle}
      </div>

      {/* Reasoning — why this angle works */}
      {a.reasoning && (
        <div style={{ fontSize: ".8rem", color: "var(--muted)", lineHeight: 1.6, fontStyle: "italic" }}>
          💭 {a.reasoning}
        </div>
      )}

      {/* The hook itself — the headline asset */}
      <div style={{ background: "var(--s2)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: ".85rem 1rem", marginTop: "4px" }}>
        <div style={{ fontSize: ".58rem", color: "var(--neon)", fontFamily: "var(--fd)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: ".4rem" }}>
          🪝 Ready hook
        </div>
        <p style={{ fontSize: ".95rem", color: "var(--text)", lineHeight: 1.5, fontWeight: 500 }}>{a.hook}</p>
      </div>

      {/* Patterns */}
      {a.patternsUsed && a.patternsUsed.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {a.patternsUsed.map(p => (
            <Link key={p} href={patternHref(p)} title="Learn this pattern"
              style={{ fontSize: ".66rem", padding: "3px 9px", borderRadius: "100px", background: "rgba(0,255,178,.06)", color: "var(--neon)", border: "1px solid rgba(0,255,178,.2)", textDecoration: "none", fontFamily: "var(--fb)" }}>
              {p}
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
        <button
          onClick={copyHook}
          style={{ padding: "7px 14px", borderRadius: "100px", border: "1px solid var(--border2)", background: "transparent", color: copied ? "var(--neon)" : "var(--soft)", fontSize: ".74rem", cursor: "pointer", fontFamily: "var(--fb)" }}
        >
          {copied ? "✓ Copied" : "Copy hook"}
        </button>
        <Link
          href={`/generator?topic=${encodeURIComponent(a.angle)}${nicheQs}`}
          style={{ padding: "7px 14px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", color: "#C4B5FD", fontSize: ".74rem", textDecoration: "none", fontFamily: "var(--fb)" }}
        >
          ⚡ More hooks
        </Link>
        <Link
          href={`/analyzer?hook=${encodeURIComponent(a.hook)}`}
          style={{ padding: "7px 14px", borderRadius: "100px", border: "1px solid rgba(255,45,107,.3)", color: "var(--hot)", fontSize: ".74rem", textDecoration: "none", fontFamily: "var(--fb)" }}
        >
          ✦ Analyze
        </Link>
        <button
          onClick={buildBrief}
          disabled={bs === "loading"}
          style={{ padding: "7px 14px", borderRadius: "100px", border: "1px solid rgba(255,184,0,.3)", background: bs === "done" ? "rgba(255,184,0,.08)" : "transparent", color: "var(--gold)", fontSize: ".74rem", cursor: bs === "loading" ? "wait" : "pointer", fontFamily: "var(--fb)" }}
        >
          {bs === "loading" ? "Building…" : bs === "done" ? "📋 Hide brief" : "📋 Faceless brief"}
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
        <div style={{ background: "var(--s2)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1rem 1.1rem", display: "flex", flexDirection: "column", gap: "10px", animation: "cardIn .3s ease" }}>
          {brief.voiceover.map((vo, k) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: "4px", paddingBottom: "8px", borderBottom: k < brief.voiceover.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: ".6rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--fd)", fontWeight: 700 }}>Beat {k + 1}</div>
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
