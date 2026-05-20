import type { Metadata } from "next";
import Link from "next/link";
import { HOOK_PATTERNS } from "@/lib/patterns";
import { NextStep } from "@/components/NextStep";

export const metadata: Metadata = {
  title: "Viral Hook Patterns — Why the First 3 Seconds Work | HookViral AI",
  description:
    "The structural attention patterns that stop the scroll in the first 3 seconds of short-form video. Learn each one, then score your own hook against them.",
  alternates: { canonical: "/patterns" },
  openGraph: {
    title: "Viral Hook Patterns — Why the First 3 Seconds Work",
    description:
      "The attention patterns behind scroll-stopping short-form hooks. Built for faceless & short-form creators.",
  },
};

export default function PatternsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-wrap">
        <div style={{ textAlign: "center", padding: "2rem 0 2.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".75rem", lineHeight: 1.05 }}>
            Viral hook <span className="gradient-text">patterns</span>
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: "1rem", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Hooks don&apos;t go viral by luck. These are the structural patterns that stop the scroll in the first 3 seconds — the ones our Analyzer scores your hook against. <strong style={{ color: "var(--text)", fontWeight: 500 }}>★ = especially load-bearing for faceless &amp; narration channels.</strong>
          </p>
          <Link href="/why-it-works" style={{ display: "inline-block", marginTop: "1rem", fontSize: ".82rem", color: "var(--electric)", textDecoration: "none", fontFamily: "var(--fb)" }}>
            Why these specific patterns? — the methodology →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "2.5rem" }}>
          {HOOK_PATTERNS.map(p => (
            <div key={p.id} id={p.id} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.5rem 1.6rem", scrollMarginTop: "calc(var(--nav-h) + 1rem)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".5rem", flexWrap: "wrap" }}>
                <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-.5px" }}>{p.name}</h2>
                {p.faceless && <span style={{ fontSize: ".62rem", padding: "2px 8px", borderRadius: "100px", background: "rgba(108,58,255,.1)", color: "#9B8CFF", border: "1px solid rgba(108,58,255,.2)", fontFamily: "var(--fd)", fontWeight: 700 }}>★ FACELESS</span>}
              </div>
              <p style={{ fontSize: ".92rem", color: "var(--text)", marginBottom: ".75rem", fontWeight: 400 }}>{p.oneLiner}</p>
              <p style={{ fontSize: ".85rem", color: "var(--soft)", lineHeight: 1.7, marginBottom: "1rem", fontWeight: 300 }}>{p.why}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "var(--s2)", borderRadius: "var(--r2)", padding: ".875rem 1rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: ".6rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".4rem" }}>Example</div>
                  <p style={{ fontSize: ".85rem", color: "var(--text)", lineHeight: 1.5 }}>{p.example}</p>
                </div>
                <div style={{ background: "var(--s2)", borderRadius: "var(--r2)", padding: ".875rem 1rem", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: ".6rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--gold)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".4rem" }}>How to apply</div>
                  <p style={{ fontSize: ".85rem", color: "var(--soft)", lineHeight: 1.5 }}>{p.fix}</p>
                </div>
              </div>
              {/* Patterns is the hub: act on each pattern, never dead-end on a definition. */}
              <div style={{ display: "flex", gap: "8px", marginTop: "1rem", flexWrap: "wrap" }}>
                <Link href="/analyzer" style={{ fontSize: ".75rem", padding: "6px 14px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", color: "#C4B5FD", textDecoration: "none", fontFamily: "var(--fb)" }}>
                  ✦ Analyze a hook for this →
                </Link>
                <Link href={`/generator?topic=${encodeURIComponent(p.example)}`} style={{ fontSize: ".75rem", padding: "6px 14px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", textDecoration: "none", fontFamily: "var(--fb)" }}>
                  ⚡ Generate hooks like this →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <NextStep current="patterns" />
    </div>
  );
}
