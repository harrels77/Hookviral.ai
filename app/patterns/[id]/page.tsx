import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HOOK_PATTERNS, getPattern } from "@/lib/patterns";
import { NextStep } from "@/components/NextStep";

export function generateStaticParams() {
  return HOOK_PATTERNS.map(p => ({ id: p.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const p = getPattern(id);
  if (!p) return { title: "Hook Pattern — HookViral AI" };
  const low = p.name.toLowerCase();
  const title = `${p.name} Hook Examples — Why It Stops the Scroll | HookViral AI`;
  const description = `${p.oneLiner} See ${p.examples.length + 1} scored ${low} hook examples for TikTok, Reels & Shorts, why the pattern works, and how to apply it. Free.`;
  return {
    title,
    description,
    keywords: [
      `${low} hook`,
      `${low} hook examples`,
      `${low} hooks`,
      `${low} tiktok hook`,
      `${low} hook formula`,
      `${low} video hook`,
      "viral hook patterns",
      "hook examples",
      "scroll-stopping hooks",
      "short-form retention",
    ],
    openGraph: { title, description, url: `/patterns/${p.id}` },
    alternates: { canonical: `/patterns/${p.id}` },
  };
}

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 88 ? "var(--gold)" : "var(--hot)";
}

export default async function PatternDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const p = getPattern(id);
  if (!p) notFound();

  // Headline example first (carries the pattern's emoji), then the scored set.
  const headline = { text: p.example, score: 95, niche: p.faceless ? "Faceless" : "All niches" };
  const all = [headline, ...p.examples];
  const others = HOOK_PATTERNS.filter(o => o.id !== p.id);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-wrap">
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: ".78rem", color: "var(--muted)", marginBottom: "1.75rem" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <Link href="/patterns" style={{ color: "var(--muted)", textDecoration: "none" }}>Patterns</Link>
          <span>›</span>
          <span style={{ color: "var(--soft)" }}>{p.name}</span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "1rem 0 2.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: ".9rem", flexWrap: "wrap" }}>
            <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05 }}>
              <span>{p.name}</span> hooks
            </h1>
            {p.faceless && <span style={{ fontSize: "var(--text-xs)", padding: "3px 10px", borderRadius: "var(--r-pill)", background: "var(--accent-soft)", color: "var(--accent)", fontFamily: "var(--fd)", fontWeight: 700 }}>FACELESS</span>}
          </div>
          <p style={{ color: "var(--text)", fontWeight: 400, fontSize: "1.05rem", maxWidth: "560px", margin: "0 auto .75rem", lineHeight: 1.6 }}>
            {p.oneLiner}
          </p>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: ".92rem", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            {p.why}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "1.75rem" }}>
            <Link href={`/generator?topic=${encodeURIComponent(p.example)}`} style={{ padding: "13px 26px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
              Generate {p.name} hooks — Free
            </Link>
            <Link href="/analyzer" style={{ padding: "13px 26px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
              Score your own hook
            </Link>
          </div>
        </div>

        {/* Examples */}
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, marginBottom: ".4rem", letterSpacing: "-1px" }}>
          {p.name} hook examples
        </h2>
        <p style={{ color: "var(--soft)", fontSize: ".88rem", marginBottom: "1.25rem", fontWeight: 300 }}>
          Each one uses the {p.name} pattern across a different niche. Tap any to score it live.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2.5rem" }}>
          {all.map((ex, i) => (
            <Link key={i} href={`/analyzer?hook=${encodeURIComponent(ex.text)}`} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}>
              <p style={{ flex: 1, fontSize: ".95rem", lineHeight: 1.6, color: "var(--text)" }}>{ex.text}</p>
              <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: "100px", background: "var(--s2)", color: "var(--soft)", border: "1px solid var(--border)", whiteSpace: "nowrap" }}>{ex.niche}</span>
              <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.2rem", color: scoreColor(ex.score), letterSpacing: "-1px" }}>{ex.score}</span>
            </Link>
          ))}
        </div>

        {/* How to apply */}
        <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.75rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, marginBottom: ".75rem" }}>
            How to apply the {p.name} pattern
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".92rem", lineHeight: 1.75, fontWeight: 300, marginBottom: "1.25rem" }}>
            {p.fix}
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Link href="/analyzer" style={{ fontSize: ".78rem", padding: "8px 16px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", color: "#C4B5FD", textDecoration: "none", fontFamily: "var(--fb)" }}>
              Analyze a hook for this
            </Link>
            <Link href={`/generator?topic=${encodeURIComponent(p.example)}`} style={{ fontSize: ".78rem", padding: "8px 16px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", textDecoration: "none", fontFamily: "var(--fb)" }}>
              Generate hooks like this
            </Link>
          </div>
        </div>

        {/* Other patterns */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>The other 8 patterns</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {others.map(o => (
              <Link key={o.id} href={`/patterns/${o.id}`} style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--muted)", fontSize: ".8rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
                {o.name}
              </Link>
            ))}
          </div>
          <Link href="/patterns" style={{ display: "inline-block", marginTop: "1rem", fontSize: ".82rem", color: "var(--electric)", textDecoration: "none", fontFamily: "var(--fb)" }}>
            All patterns overview
          </Link>
        </div>
      </div>

      <NextStep current="patterns" />
    </div>
  );
}
