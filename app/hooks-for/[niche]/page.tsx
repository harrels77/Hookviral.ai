import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NICHE_MODES, getNiche } from "@/lib/niches";

export function generateStaticParams() {
  return NICHE_MODES.map(n => ({ niche: n.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ niche: string }> }
): Promise<Metadata> {
  const { niche } = await params;
  const n = getNiche(niche);
  if (!n) return { title: "Hooks — HookViral AI" };
  const title = `Viral ${n.label} Hooks Generator (Free) — HookViral AI`;
  const description = `${n.tagline} Generate 8 scored ${n.label.toLowerCase()} hooks built to stop the scroll, then analyze them for retention. Free, no account.`;
  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `/hooks-for/${n.slug}` },
  };
}

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 88 ? "var(--gold)" : "var(--hot)";
}

export default async function NicheHooksPage(
  { params }: { params: Promise<{ niche: string }> }
) {
  const { niche } = await params;
  const n = getNiche(niche);
  if (!n) notFound();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-wrap">
        {/* Hero */}
        <div style={{ textAlign: "center", padding: "2rem 0 2.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>{n.emoji}</div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".75rem", lineHeight: 1.05 }}>
            Viral <span className="gradient-text">{n.label}</span> hooks
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: "1rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            {n.tagline}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "1.75rem" }}>
            <Link href={`/generator?niche=${n.slug}`} style={{ padding: "13px 26px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
              Generate {n.label} Hooks — Free →
            </Link>
            <Link href="/analyzer" style={{ padding: "13px 26px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
              Analyze a Hook
            </Link>
          </div>
        </div>

        {/* Example hooks */}
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", letterSpacing: "-1px" }}>
          Example {n.label.toLowerCase()} hooks
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2.5rem" }}>
          {n.exampleHooks.map((h, i) => (
            <div key={i} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <p style={{ flex: 1, fontSize: ".95rem", lineHeight: 1.6, color: "var(--text)" }}>{h.text}</p>
              <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: "100px", background: "rgba(108,58,255,.08)", color: "#9B8CFF", border: "1px solid rgba(108,58,255,.15)", whiteSpace: "nowrap" }}>{h.formula}</span>
              <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.2rem", color: scoreColor(h.score), letterSpacing: "-1px" }}>{h.score}</span>
            </div>
          ))}
        </div>

        {/* Sample topics */}
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", letterSpacing: "-1px" }}>
          Try it on a {n.label.toLowerCase()} topic
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "2.5rem" }}>
          {n.sampleTopics.map(t => (
            <Link key={t} href={`/generator?niche=${n.slug}&topic=${encodeURIComponent(t)}`} style={{ padding: "8px 16px", borderRadius: "100px", background: "var(--s1)", border: "1px solid var(--border)", color: "var(--soft)", fontSize: ".85rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
              {t} →
            </Link>
          ))}
        </div>

        {/* Why */}
        <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.75rem", marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, marginBottom: ".75rem" }}>
            What makes a {n.label.toLowerCase()} hook go viral?
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".9rem", lineHeight: 1.75, fontWeight: 300 }}>
            {n.guidance} HookViral generates 8 hooks per idea using proven viral formulas, scores each 0–100 for scroll-stopping power, and lets you analyze any hook you already wrote for retention.
          </p>
        </div>

        {/* Other niches */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>More niches</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {NICHE_MODES.filter(o => o.slug !== n.slug).map(o => (
              <Link key={o.slug} href={`/hooks-for/${o.slug}`} style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--muted)", fontSize: ".8rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
                {o.emoji} {o.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
