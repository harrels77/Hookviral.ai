"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { NICHE_MODES } from "@/lib/niches";
import { NextStep } from "@/components/NextStep";
import { getNichePref, setNichePref, getGeoPref, setGeoPref, getSourcesPref, setSourcesPref } from "@/lib/prefs";

type Velocity = "rising" | "steady" | "cooling" | "new";
type Source = "google" | "youtube" | "reddit" | "wikipedia" | "hackernews" | "bluesky";
interface Trend { title: string; sub: string; source?: Source; velocity?: Velocity; history?: number[]; }

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

const GEOS: [string, string][] = [
  ["GLOBAL", "🌍 Global"],
  ["US", "🇺🇸 US"], ["FR", "🇫🇷 FR"], ["GB", "🇬🇧 UK"],
  ["CA", "🇨🇦 CA"], ["ES", "🇪🇸 ES"], ["DE", "🇩🇪 DE"],
];

const SOURCE_LABELS: Record<Source, string> = {
  google:     "Google",
  youtube:    "YouTube",
  reddit:     "Reddit",
  wikipedia:  "Wikipedia",
  hackernews: "Hacker News",
  bluesky:    "Bluesky",
};

const SOURCE_BADGES: Record<Source, { emoji: string; label: string; color: string }> = {
  google:     { emoji: "🔎", label: "Google",      color: "#5BA8FF" },
  youtube:    { emoji: "▶",  label: "YouTube",     color: "#FF4D5A" },
  reddit:     { emoji: "🟠", label: "Reddit",      color: "#FF8B4A" },
  wikipedia:  { emoji: "📚", label: "Wikipedia",   color: "#9CA3AF" },
  hackernews: { emoji: "🟧", label: "Hacker News", color: "#FF6600" },
  bluesky:    { emoji: "🦋", label: "Bluesky",     color: "#0085FF" },
};

// Canonical order. Sources that need creds (YouTube key, Reddit OAuth)
// sit at the end so the first-paint button row reads "free → gated."
const ALL_SOURCES: Source[] = ["google", "wikipedia", "hackernews", "bluesky", "youtube", "reddit"];
// Default selection on first paint = every zero-auth source. The first-time
// visitor sees ~110 unique trends merged with no banners and nothing to
// register. YouTube + Reddit stay in ALL_SOURCES (visible toggles) so users
// with creds can opt in; their respective banners explain the env-var flow
// on demand. This pattern beats "force everyone to register before seeing
// anything" — see [[feedback-tool-vs-value]].
const DEFAULT_SOURCES: Source[] = ["google", "wikipedia", "hackernews", "bluesky"];

// Canonical order so cache tags + persistence don't depend on click order.
function sortSources(list: Source[]): Source[] {
  const set = new Set(list);
  return ALL_SOURCES.filter(s => set.has(s));
}

function parseSourcesCsv(csv: string): Source[] {
  const valid = csv.split(",").map(s => s.trim()).filter(
    (s): s is Source => s === "google" || s === "youtube" || s === "reddit"
  );
  return sortSources(valid);
}

const VELOCITY: Record<Velocity, { label: string; color: string; bg: string }> = {
  rising:  { label: "🔥 Rising",  color: "var(--hot)",     bg: "rgba(255,45,107,.1)" },
  new:     { label: "🆕 New",     color: "var(--electric)", bg: "rgba(108,58,255,.1)" },
  steady:  { label: "⚡ Steady",  color: "var(--gold)",    bg: "rgba(255,184,0,.08)" },
  cooling: { label: "📉 Cooling", color: "var(--muted)",   bg: "rgba(255,255,255,.04)" },
};

export default function TrendsPage() {
  // SSR-safe initial state: defaults that match the server render. We can't
  // read localStorage in the useState initializer (window is undefined at
  // SSR, any conditional read makes server + client diverge and React 19
  // discards the hydrated tree on mismatch). Hydrate prefs in a mount-once
  // effect below, gated by `hydrated` so we don't (a) clobber saved prefs
  // by writing the defaults back on first render, or (b) fetch trends twice
  // (once with defaults, once with the user's real geo/niche).
  //
  // Sources is an array (canonical order) rather than a Set because (a)
  // Set mutation doesn't trigger React re-renders and (b) we serialize it
  // as CSV for the API + localStorage anyway.
  const [sources, setSources] = useState<Source[]>(DEFAULT_SOURCES);
  const [niche, setNiche] = useState("");
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [unconfigured, setUnconfigured] = useState<Source[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [geo, setGeo] = useState("US");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedSources = parseSourcesCsv(getSourcesPref());
    if (savedSources.length > 0) setSources(savedSources);
    setNiche(getNichePref());
    setGeo(getGeoPref() || "US");
    setHydrated(true);
  }, []);

  // Persist any change for next visit + cross-page consistency. Guarded by
  // `hydrated` — without it, the very first render would write the SSR
  // defaults to localStorage and overwrite the user's saved prefs.
  useEffect(() => { if (hydrated) setNichePref(niche); }, [hydrated, niche]);
  useEffect(() => { if (hydrated) setGeoPref(geo); }, [hydrated, geo]);
  useEffect(() => { if (hydrated) setSourcesPref(sources.join(",")); }, [hydrated, sources]);

  // Toggle a source on/off. Never let the user deselect the last one —
  // an empty selection makes the page pointless and the API falls back to
  // "google" anyway, which is confusing if the UI still shows nothing
  // selected. Re-clicking the last active source is a no-op.
  const toggleSource = useCallback((s: Source) => {
    setSources(prev => {
      if (prev.includes(s)) {
        if (prev.length === 1) return prev;
        return sortSources(prev.filter(x => x !== s));
      }
      return sortSources([...prev, s]);
    });
  }, []);

  const load = useCallback(async (srcs: Source[], slug: string, g: string) => {
    if (srcs.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ sources: srcs.join(","), geo: g });
      if (slug) qs.set("niche", slug);
      const res = await fetch(`/api/trends?${qs.toString()}`);
      const data = await res.json();
      setUnconfigured(Array.isArray(data.unconfigured) ? data.unconfigured : []);
      if (data.error) setError(data.error);
      setTrends(data.trends || []);
    } catch {
      setError("Could not load trends right now.");
      setTrends([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // sourcesKey collapses the array into a primitive so the effect deps
  // catch real changes without re-firing on every render that creates a
  // new array reference. The array is already in canonical order.
  const sourcesKey = sources.join(",");
  // Wait until prefs are hydrated before the first fetch — otherwise we'd
  // fire one request for the defaults and another the next tick for the
  // user's actual prefs, doubling the rate-limit hit.
  useEffect(() => {
    if (!hydrated) return;
    load(sourcesKey.split(",") as Source[], niche, geo);
  }, [hydrated, sourcesKey, niche, geo, load]);

  // Disable the geo row only when *every* selected source is geo-less
  // (Reddit, Hacker News, Bluesky). Mixed with any geo-aware source
  // (Google, YouTube, Wikipedia) → geo still applies to those.
  const allGeoLess = sources.length > 0 && sources.every(s => s === "reddit" || s === "hackernews" || s === "bluesky");

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
            Don&apos;t just see a trend — research the context and turn it into ready-to-film angles for your niche.
          </p>
        </div>

        <div className="page-wrap">
          {/* Quiet controls — defaults work for first view. Refresh always visible. */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <details style={{ flex: 1 }}>
              <summary style={{ cursor: "pointer", fontSize: ".82rem", color: "var(--muted)", fontFamily: "var(--fb)", padding: "6px 4px", listStyle: "none", userSelect: "none" }}>
                Filters ▾ <span style={{ color: "var(--muted)", opacity: .6 }}>
                  ({sources.length === ALL_SOURCES.length
                    ? "All sources"
                    : sources.map(s => SOURCE_LABELS[s]).join(" + ")} · {allGeoLess ? "global" : geo} · {nicheLabel || "All niches"})
                </span>
              </summary>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)" }}>
                    {([
                      ["google",     "🔎 Google"],
                      ["wikipedia",  "📚 Wikipedia"],
                      ["hackernews", "🟧 HN"],
                      ["bluesky",    "🦋 Bluesky"],
                      ["youtube",    "▶ YouTube"],
                      ["reddit",     "🟠 Reddit"],
                    ] as [Source, string][]).map(([s, label]) => {
                      const active = sources.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSource(s)}
                          aria-pressed={active}
                          title={active ? `Hide ${SOURCE_LABELS[s]} trends` : `Include ${SOURCE_LABELS[s]} trends`}
                          style={{ padding: "9px 18px", border: "none", background: active ? "var(--s3)" : "transparent", color: active ? "var(--text)" : "var(--muted)", fontSize: ".82rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}
                        >
                          {active ? "✓ " : ""}{label}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)", opacity: allGeoLess ? 0.4 : 1 }} title={allGeoLess ? "Selected sources are global — geo doesn't apply" : undefined}>
                    {GEOS.map(([code, label]) => (
                      <button key={code} onClick={() => setGeo(code)} disabled={allGeoLess} title={allGeoLess ? "Selected sources are global" : `Trends for ${code}`} style={{ padding: "9px 14px", border: "none", background: geo === code ? "var(--s3)" : "transparent", color: geo === code ? "var(--text)" : "var(--muted)", fontSize: ".82rem", cursor: allGeoLess ? "not-allowed" : "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1rem 1.1rem" }}>
                  <div style={{ fontSize: ".66rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".5rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Niche</div>
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
              </div>
            </details>
            <button onClick={() => load(sources, niche, geo)} disabled={loading} title="Refresh trends"
              style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid var(--border2)", background: "var(--s1)", color: "var(--soft)", cursor: loading ? "not-allowed" : "pointer", fontSize: "15px", transition: "all .2s", opacity: loading ? 0.5 : 1, flexShrink: 0 }}>
              ↻
            </button>
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
              <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: ".72rem" }}>
                {query
                  ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}`
                  : `${trends.length} trend${trends.length === 1 ? "" : "s"}`}
              </span>
            </div>
          )}

          {sources.includes("youtube") && unconfigured.includes("youtube") && (
            <div style={{ background: "rgba(255,184,0,.06)", border: "1px solid rgba(255,184,0,.3)", color: "var(--gold)", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7, marginBottom: "12px" }}>
              YouTube trends need a <strong>YOUTUBE_API_KEY</strong> in <code>.env.local</code> (free). Other sources keep working — <button onClick={() => toggleSource("youtube")} style={{ background: "none", border: "none", color: "var(--hot)", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>hide YouTube</button> to dismiss this.
            </div>
          )}

          {sources.includes("reddit") && unconfigured.includes("reddit") && (
            <div style={{ background: "rgba(255,138,72,.06)", border: "1px solid rgba(255,138,72,.3)", color: "#FF8A48", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7, marginBottom: "12px" }}>
              Reddit now requires OAuth from cloud IPs (post-2023 API tightening — the public JSON endpoint 403s from Vercel/AWS). Add <strong>REDDIT_CLIENT_ID</strong> + <strong>REDDIT_CLIENT_SECRET</strong> to <code>.env.local</code> (free, ~2 min — register a &quot;script&quot; app at <a href="https://www.reddit.com/prefs/apps" target="_blank" rel="noopener noreferrer" style={{ color: "#FF8A48", textDecoration: "underline" }}>reddit.com/prefs/apps</a>). Other sources keep working — <button onClick={() => toggleSource("reddit")} style={{ background: "none", border: "none", color: "var(--hot)", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>hide Reddit</button> to dismiss this.
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

          {!loading && !error && trends.length === 0 && (
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
  const nicheQs = niche ? `&niche=${encodeURIComponent(niche)}` : "";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "var(--s1)", border: `1px solid ${hov ? "rgba(108,58,255,.4)" : "var(--border)"}`, borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", flexDirection: "column", gap: "12px", transition: "all .25s cubic-bezier(.16,1,.3,1)", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 16px 40px rgba(108,58,255,.12)" : "none" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".95rem", color: rank <= 3 ? "var(--hot)" : "var(--muted)", flexShrink: 0, width: "22px" }}>
          {rank <= 3 ? "🔥" : rank}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: ".95rem", color: "var(--text)", lineHeight: 1.45, fontWeight: 500 }}>{trend.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
            {trend.source && (
              <span title={`From ${SOURCE_BADGES[trend.source].label}`} style={{ fontSize: ".62rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "2px 7px", borderRadius: "100px", color: SOURCE_BADGES[trend.source].color, background: `${SOURCE_BADGES[trend.source].color}14`, border: `1px solid ${SOURCE_BADGES[trend.source].color}33` }}>
                {SOURCE_BADGES[trend.source].emoji} {SOURCE_BADGES[trend.source].label}
              </span>
            )}
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

      {/* Research is the PRIMARY action now — promoted to the full-width
          gradient CTA. Generator / Analyzer remain as quick shortcuts below.
          Click navigates to /trends/research where the result has room to
          breathe (the inline-in-card expansion was cramped on desktop). */}
      <Link
        href={`/trends/research?q=${encodeURIComponent(trend.title)}${nicheQs}`}
        style={{ width: "100%", textAlign: "center", padding: "10px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".82rem", fontWeight: 600, textDecoration: "none", fontFamily: "var(--fb)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
      >
        🔬 Research &amp; angles
        <span style={{ fontSize: ".58rem", padding: "1px 6px", borderRadius: "100px", background: "rgba(255,255,255,.15)", color: "#fff", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "1px" }}>PRO</span>
      </Link>

      <div style={{ display: "flex", gap: "8px" }}>
        <Link
          href={`/generator?topic=${encodeURIComponent(trend.title)}${nicheQs}`}
          style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "100px", border: "1px solid var(--border2)", color: hov ? "#C4B5FD" : "var(--muted)", fontSize: ".74rem", textDecoration: "none", fontFamily: "var(--fb)", transition: "color .2s" }}
        >
          ⚡ Quick hooks
        </Link>
        <Link
          href={`/analyzer?hook=${encodeURIComponent(trend.title)}`}
          style={{ flex: 1, textAlign: "center", padding: "8px", borderRadius: "100px", border: "1px solid var(--border2)", color: hov ? "#C4B5FD" : "var(--muted)", fontSize: ".74rem", textDecoration: "none", fontFamily: "var(--fb)", transition: "color .2s" }}
        >
          ✦ Score it
        </Link>
      </div>
    </div>
  );
}
