"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { NICHE_MODES } from "@/lib/niches";
import { NextStep } from "@/components/NextStep";
import { getNichePref, setNichePref, getGeoPref, setGeoPref, getSourcesPref, setSourcesPref,
         saveTrend, unsaveTrend, isTrendSaved, trendId } from "@/lib/prefs";
import { SOURCE_BADGES, type SourceKey } from "@/lib/sourceBadges";
import { BrandIcon } from "@/components/BrandIcon";
import { FlagIcon, isFlagCode } from "@/components/FlagIcon";
import { OptionsBar, OptionGroup, ValueChip } from "@/components/OptionsBar";
import { Icon, nicheIcon, type IconName } from "@/lib/icons";

type Velocity = "rising" | "steady" | "cooling" | "new";
type Source = SourceKey;
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
  ["GLOBAL", "Global"],
  ["US", "US"], ["FR", "FR"], ["GB", "UK"],
  ["CA", "CA"], ["ES", "ES"], ["DE", "DE"],
];

const SOURCE_LABELS: Record<Source, string> = {
  google:     "Google",
  youtube:    "YouTube",
  reddit:     "Reddit",
  wikipedia:  "Wikipedia",
  hackernews: "Hacker News",
  bluesky:    "Bluesky",
  tiktok:     "TikTok",
  twitter:    "X",
  instagram:  "Instagram",
};

// SOURCE_BADGES now lives in lib/sourceBadges.ts (shared with the Saved page).

// Canonical order. Sources that need creds (YouTube key, Reddit OAuth)
// sit at the end so the first-paint button row reads "free → gated."
// "twitter" is omitted on purpose — the X scraper actor bills $0.04/item and
// returns demo data on the free plan ($3.20 burned in one test). It's hard-
// gated in app/api/trends/route.ts too; the source code stays for a future
// paid-plan reactivation. See the route's parseSources comment.
const ALL_SOURCES: Source[] = ["google", "wikipedia", "hackernews", "bluesky", "youtube", "reddit", "tiktok", "instagram"];
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
  // Validation matches the live Source union — older versions silently dropped
  // wikipedia/hackernews/bluesky from localStorage on reload because the
  // predicate hadn't been updated when those sources were added.
  const valid = csv.split(",").map(s => s.trim()).filter(
    (s): s is Source =>
      s === "google" || s === "youtube" || s === "reddit" ||
      s === "wikipedia" || s === "hackernews" || s === "bluesky" ||
      s === "tiktok" || s === "instagram"
  );
  return sortSources(valid);
}

// encodeURIComponent throws "URI malformed" on a lone UTF-16 surrogate — a
// half-emoji left when an upstream source truncated a title mid-pair. Drop all
// surrogate code units before encoding: emoji aren't useful in a search/topic
// query, the title still renders fine in the card, and a single broken title
// can no longer crash the whole grid.
function safeEncode(s: string): string {
  return encodeURIComponent(s.replace(/[\uD800-\uDFFF]/g, ""));
}

const VELOCITY: Record<Velocity, { label: string; icon: IconName; color: string; bg: string }> = {
  rising:  { label: "Rising",  icon: "trending-up",   color: "var(--accent)",     bg: "var(--accent-soft)" },
  new:     { label: "New",     icon: "sparkles",      color: "var(--text-soft)",  bg: "var(--surface-2)" },
  steady:  { label: "Steady",  icon: "minus",         color: "var(--text-muted)", bg: "var(--surface-2)" },
  cooling: { label: "Cooling", icon: "trending-down", color: "var(--text-muted)", bg: "var(--surface-2)" },
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
    if (savedSources.length > 0) {
      // Sanity check before trusting localStorage: if the user's persisted
      // selection is exclusively gated sources (YouTube/Reddit) and those
      // aren't configured on the current deployment, the page lands in an
      // unrecoverable state — all banners fire, no toggle is obviously the
      // "fix this" button. Force-merge with DEFAULT_SOURCES (which are all
      // zero-auth, always work) so the visitor always has at least one
      // working source visible. Preserves their gated choices on top.
      // Set+sort dedupes; canonical order is restored by sortSources.
      const hasZeroAuth = savedSources.some(s => DEFAULT_SOURCES.includes(s));
      setSources(hasZeroAuth
        ? savedSources
        : sortSources([...savedSources, ...DEFAULT_SOURCES]));
    }
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
  const allGeoLess = sources.length > 0 && sources.every(s => s === "reddit" || s === "hackernews" || s === "bluesky" || s === "instagram");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return trends;
    return trends.filter(t => t.title.toLowerCase().includes(q) || t.sub?.toLowerCase().includes(q));
  }, [trends, query]);

  const nicheLabel = NICHE_MODES.find(n => n.slug === niche)?.label;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div>
        <div style={{ borderBottom: "1px solid var(--border)", padding: "2.5rem 1.5rem 2rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".5rem" }}>
            What&apos;s <span>trending</span> now
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: ".95rem" }}>
            See what&apos;s moving across platforms right now — then turn any trend into a hook angle in one click.
          </p>
        </div>

        <div className="page-wrap">
          {/* Quiet controls — defaults work for first view. Refresh always visible. */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <OptionsBar
              label="Filters"
              style={{ flex: 1, minWidth: 0 }}
              summary={
                <>
                  <ValueChip>
                    {sources.slice(0, 4).map(s => (
                      <BrandIcon key={s} name={s} size={12} style={{ color: SOURCE_BADGES[s].color }} />
                    ))}
                    {sources.length > 4 && <span>+{sources.length - 4}</span>}
                  </ValueChip>
                  <ValueChip>
                    {allGeoLess || geo === "GLOBAL"
                      ? <><Icon name="globe" /> Global</>
                      : <>{isFlagCode(geo) && <FlagIcon code={geo} size={13} />} {geo === "GB" ? "UK" : geo}</>}
                  </ValueChip>
                  <ValueChip>
                    {niche ? <Icon name={nicheIcon(niche)} /> : null}
                    {nicheLabel || "All niches"}
                  </ValueChip>
                </>
              }
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div className="hv-controls-row" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <div className="hv-scroll-pill" style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)" }}>
                    {([
                      ["google",     "Google"],
                      ["wikipedia",  "Wikipedia"],
                      ["hackernews", "HN"],
                      ["bluesky",    "Bluesky"],
                      ["youtube",    "YouTube"],
                      ["reddit",     "Reddit"],
                      ["tiktok",     "TikTok"],
                      ["instagram",  "Instagram"],
                    ] as [Source, string][]).map(([s, label]) => {
                      const active = sources.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleSource(s)}
                          aria-pressed={active}
                          title={active ? `Hide ${SOURCE_LABELS[s]} trends` : `Include ${SOURCE_LABELS[s]} trends`}
                          style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "9px 16px", border: "none", background: active ? "var(--surface-3)" : "transparent", color: active ? "var(--text)" : "var(--text-muted)", fontSize: "var(--text-sm)", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}
                        >
                          <BrandIcon name={s} size={13} style={{ color: SOURCE_BADGES[s].color, opacity: active ? 1 : .55 }} />
                          {label}
                          {active && <Icon name="check" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="hv-scroll-pill" style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)", opacity: allGeoLess ? 0.4 : 1 }} title={allGeoLess ? "Selected sources are global — geo doesn't apply" : undefined}>
                    {GEOS.map(([code, label]) => (
                      <button key={code} onClick={() => setGeo(code)} disabled={allGeoLess} title={allGeoLess ? "Selected sources are global" : `Trends for ${code}`} style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "9px 14px", border: "none", background: geo === code ? "var(--surface-3)" : "transparent", color: geo === code ? "var(--text)" : "var(--text-muted)", fontSize: "var(--text-sm)", cursor: allGeoLess ? "not-allowed" : "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                        {code === "GLOBAL" ? <Icon name="globe" /> : isFlagCode(code) ? <FlagIcon code={code} /> : null}{label}
                      </button>
                    ))}
                  </div>
                </div>
                <OptionGroup label="Niche">
                  <button onClick={() => setNiche("")} className="chip" data-active={niche === ""}>
                    All
                  </button>
                  {NICHE_MODES.map(n => (
                    <button key={n.slug} onClick={() => setNiche(n.slug)} className="chip" data-active={niche === n.slug}>
                      <Icon name={nicheIcon(n.slug)} /> {n.label}
                    </button>
                  ))}
                </OptionGroup>
              </div>
            </OptionsBar>
            <button onClick={() => load(sources, niche, geo)} disabled={loading} title="Refresh trends" aria-label="Refresh trends"
              style={{ width: "38px", height: "38px", borderRadius: "50%", border: "1px solid var(--border-strong)", background: "var(--surface)", color: "var(--text-soft)", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", opacity: loading ? 0.5 : 1, flexShrink: 0 }}>
              <Icon name="refresh" />
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
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", display: "flex", pointerEvents: "none" }}><Icon name="search" /></span>
              <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: ".72rem" }}>
                {query
                  ? `${filtered.length} match${filtered.length === 1 ? "" : "es"}`
                  : `${trends.length} trend${trends.length === 1 ? "" : "s"}`}
              </span>
            </div>
          )}

          {/* Source-specific notices: stay diplomatic — never expose env-var
              names, OAuth flows, or internal infra in the user-facing copy.
              The dev knows what to fix from the route's `unconfigured` array;
              the visitor just needs a calm explanation + a way to move on. */}
          {sources.includes("youtube") && unconfigured.includes("youtube") && (
            <div style={{ background: "var(--warning-soft)", border: "1px solid var(--warning)", color: "var(--warning)", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7, marginBottom: "12px" }}>
              YouTube trends aren&apos;t available right now. Other sources are still loading — <button onClick={() => toggleSource("youtube")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>hide YouTube</button> to continue.
            </div>
          )}

          {sources.includes("reddit") && unconfigured.includes("reddit") && (
            <div style={{ background: "var(--warning-soft)", border: "1px solid var(--warning)", color: "var(--warning)", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7, marginBottom: "12px" }}>
              Reddit trends aren&apos;t available right now. Other sources are still loading — <button onClick={() => toggleSource("reddit")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>hide Reddit</button> to continue.
            </div>
          )}

          {sources.includes("tiktok") && unconfigured.includes("tiktok") && (
            <div style={{ background: "var(--warning-soft)", border: "1px solid var(--warning)", color: "var(--warning)", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7, marginBottom: "12px" }}>
              TikTok trends aren&apos;t available right now. Other sources are still loading — <button onClick={() => toggleSource("tiktok")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>hide TikTok</button> to continue.
            </div>
          )}

          {sources.includes("instagram") && unconfigured.includes("instagram") && (
            <div style={{ background: "var(--warning-soft)", border: "1px solid var(--warning)", color: "var(--warning)", borderRadius: "var(--r2)", padding: "1.25rem 1.5rem", fontSize: ".85rem", lineHeight: 1.7, marginBottom: "12px" }}>
              Instagram trends aren&apos;t available right now. Other sources are still loading — <button onClick={() => toggleSource("instagram")} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontFamily: "var(--fb)", fontSize: ".85rem", textDecoration: "underline", padding: 0 }}>hide Instagram</button> to continue.
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
            <div style={{ background: "var(--danger-soft)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: "var(--r2)", padding: "1rem 1.25rem", fontSize: ".85rem" }}>
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
  const [saved, setSaved] = useState(false);
  const [pop, setPop] = useState(false); // brief scale feedback on click
  const id = trendId(trend.title);
  const nicheQs = niche ? `&niche=${encodeURIComponent(niche)}` : "";

  // Hydrate from localStorage (SSR-safe — can't read storage on the server, so
  // initial render is "not saved" then this corrects it). Re-runs if id changes.
  useEffect(() => { setSaved(isTrendSaved(id)); }, [id]);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (saved) { unsaveTrend(id); setSaved(false); }
    else {
      saveTrend({ id, title: trend.title, source: trend.source ?? "", url: `/trends/research?q=${safeEncode(trend.title)}` });
      setSaved(true);
    }
    setPop(true); setTimeout(() => setPop(false), 220);
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: "var(--s1)", border: `1px solid ${hov ? "rgba(108,58,255,.4)" : "var(--border)"}`, borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", flexDirection: "column", gap: "12px", position: "relative", transition: "all .25s cubic-bezier(.16,1,.3,1)", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 16px 40px rgba(108,58,255,.12)" : "none" }}
    >
      {/* ⭐ save toggle — absolute, out of the flow, top-right */}
      <button
        onClick={toggleSave}
        aria-pressed={saved}
        aria-label={saved ? "Remove from Saved" : "Save this trend"}
        title={saved ? "Remove from Saved" : "Save this trend"}
        style={{ position: "absolute", top: "10px", right: "10px", width: "28px", height: "28px", border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", color: saved ? "var(--warning)" : "var(--text-muted)", transform: pop ? "scale(1.35)" : "scale(1)", transition: "transform .2s cubic-bezier(.16,1,.3,1), color .2s" }}
      >
        <Icon name="star" fill={saved ? "currentColor" : "none"} />
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", paddingRight: "26px" }}>
        <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "var(--text-sm)", color: rank <= 3 ? "var(--accent)" : "var(--text-muted)", flexShrink: 0, width: "22px" }}>
          {rank}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: ".95rem", color: "var(--text)", lineHeight: 1.45, fontWeight: 500 }}>{trend.title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
            {trend.source && (
              <span title={`From ${SOURCE_BADGES[trend.source].label}`} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "2px 8px", borderRadius: "var(--r-pill)", color: SOURCE_BADGES[trend.source].color, background: `${SOURCE_BADGES[trend.source].color}14`, border: `1px solid ${SOURCE_BADGES[trend.source].color}33` }}>
                <BrandIcon name={trend.source} size={11} />
                {SOURCE_BADGES[trend.source].label}
              </span>
            )}
            {trend.velocity && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "2px 8px", borderRadius: "var(--r-pill)", color: VELOCITY[trend.velocity].color, background: VELOCITY[trend.velocity].bg }}>
                <Icon name={VELOCITY[trend.velocity].icon} /> {VELOCITY[trend.velocity].label}
              </span>
            )}
            {trend.history && trend.history.length >= 3 && (
              <Sparkline ranks={trend.history} color={trend.velocity ? VELOCITY[trend.velocity].color : "var(--accent)"} />
            )}
            {trend.sub && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{trend.sub}</span>}
          </div>
        </div>
      </div>

      {/* Research is the PRIMARY action now — promoted to the full-width
          gradient CTA. Generator / Analyzer remain as quick shortcuts below.
          Click navigates to /trends/research where the result has room to
          breathe (the inline-in-card expansion was cramped on desktop). */}
      <Link
        href={`/trends/research?q=${safeEncode(trend.title)}${nicheQs}`}
        className="btn btn-primary btn-sm btn-block"
      >
        <Icon name="flask" /> Research &amp; angles
      </Link>

      <div style={{ display: "flex", gap: "8px" }}>
        <Link
          href={`/generator?topic=${safeEncode(trend.title)}${nicheQs}`}
          style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-strong)", color: hov ? "var(--accent)" : "var(--text-muted)", fontSize: "var(--text-xs)", textDecoration: "none", fontFamily: "var(--fb)", transition: "color .2s" }}
        >
          <Icon name="zap" /> Quick hooks
        </Link>
        <Link
          href={`/analyzer?hook=${safeEncode(trend.title)}`}
          style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-strong)", color: hov ? "var(--accent)" : "var(--text-muted)", fontSize: "var(--text-xs)", textDecoration: "none", fontFamily: "var(--fb)", transition: "color .2s" }}
        >
          <Icon name="sparkles" /> Score it
        </Link>
      </div>
    </div>
  );
}
