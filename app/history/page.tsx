"use client";

import { useState, useEffect } from "react";

interface Hook { id: string; text: string; formula: string; platform: string; score: number; }
interface Session { id: string; topic: string; platforms: string[]; tone: string; hooks: Hook[]; dateLabel: string; }

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tab, setTab] = useState<"all" | "favorites">("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSessions(JSON.parse(localStorage.getItem("hv_hist") || "[]"));
    setFavorites((JSON.parse(localStorage.getItem("hv_favs") || "[]") as Hook[]).map(f => f.id));
  }, []);

  function toggleOpen(id: string) {
    setOpen(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  async function copyText(text: string, id: string) {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id); setTimeout(() => setCopied(null), 1500);
  }

  const filtered = sessions
    .filter(s => tab === "favorites" ? s.hooks.some(h => favorites.includes(h.id)) : true)
    .filter(s => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return s.topic.toLowerCase().includes(q) || s.hooks.some(h => h.text.toLowerCase().includes(q));
    });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px" }}>History</h1>
            <p style={{ color: "var(--soft)", fontSize: ".875rem", marginTop: ".3rem", fontWeight: 300 }}>{sessions.length} session{sessions.length !== 1 ? "s" : ""} saved</p>
          </div>
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "100px", overflow: "hidden", background: "var(--s1)" }}>
            {(["all", "favorites"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: "8px 22px", border: "none", background: tab === t ? "var(--s3)" : "transparent", color: tab === t ? "var(--text)" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)" }}>
                {t === "favorites" ? `★ Favorites (${favorites.length})` : "All"}
              </button>
            ))}
          </div>
        </div>

        {sessions.length > 0 && (
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "14px", pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by topic or hook text..."
              style={{ width: "100%", background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "100px", padding: "10px 2.5rem", color: "var(--text)", fontSize: ".875rem", fontFamily: "var(--fb)", outline: "none", caretColor: "var(--hot)" }} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>✕</button>}
          </div>
        )}

        {search && <div style={{ fontSize: ".8rem", color: "var(--muted)", marginBottom: "1rem" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;</div>}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: "3rem", opacity: .12, marginBottom: "1.5rem" }}>{search ? "🔍" : tab === "favorites" ? "★" : "📭"}</div>
            <p style={{ color: "var(--muted)", fontSize: ".9rem", lineHeight: 1.7 }}>
              {search ? `No results for "${search}"` : tab === "favorites" ? "No favorites yet." : "No generations yet. Head to the Generator!"}
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(s => (
            <div key={s.id} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", overflow: "hidden" }}>
              <div onClick={() => toggleOpen(s.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", cursor: "pointer" }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: ".9rem", marginBottom: "4px" }}>{s.topic}</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {[s.dateLabel, s.platforms?.join(" · "), `${s.hooks.length} hooks`].filter(Boolean).map(tag => (
                      <span key={tag} style={{ padding: "2px 8px", background: "var(--s3)", borderRadius: "4px", fontSize: ".68rem", color: "var(--soft)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: ".7rem", transition: "transform .2s", transform: open.includes(s.id) ? "rotate(180deg)" : "none", flexShrink: 0 }}>▼</div>
              </div>
              {open.includes(s.id) && (
                <div style={{ padding: "0 1rem 1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {s.hooks.map(h => (
                    <div key={h.id} onClick={() => copyText(h.text, h.id)} style={{ background: "var(--s2)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "1rem", cursor: "pointer", position: "relative", transition: "all .2s" }}>
                      <div style={{ fontSize: ".82rem", color: "var(--soft)", lineHeight: 1.6, marginBottom: ".6rem" }}>{h.text}</div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: ".68rem", color: "#9B8CFF", fontFamily: "var(--fd)", fontWeight: 700 }}>{h.formula}</span>
                        <span style={{ fontSize: ".68rem", color: "var(--neon)", fontFamily: "var(--fd)", fontWeight: 700 }}>{h.score}/100</span>
                      </div>
                      {copied === h.id && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,255,178,.06)", borderRadius: "var(--r)", color: "var(--neon)", fontSize: ".8rem", fontFamily: "var(--fd)", fontWeight: 700 }}>COPIED ✓</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}