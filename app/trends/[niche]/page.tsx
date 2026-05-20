import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NICHE_MODES, getNiche } from "@/lib/niches";
import { googleTrends, youtubeTrends, rerankForNiche, type Trend } from "@/lib/trends";
import { NextStep } from "@/components/NextStep";

export const revalidate = 21600; // 6h ISR

export function generateStaticParams() {
  return NICHE_MODES.map(n => ({ niche: n.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ niche: string }> }
): Promise<Metadata> {
  const { niche } = await params;
  const n = getNiche(niche);
  if (!n) return { title: "Trends — HookViral AI" };
  const title = `Trending ${n.label} Topics This Week — Hooks That Stop the Scroll`;
  const description = `Live trending topics for ${n.label.toLowerCase()} creators, plus proven ${n.label.toLowerCase()} hook examples and how to turn any trend into a scroll-stopping opening. Free, no account.`;
  return {
    title,
    description,
    keywords: [`${n.label.toLowerCase()} hooks`, `trending ${n.label.toLowerCase()} topics`, `${n.label.toLowerCase()} video ideas`, "viral hooks", "short-form retention"],
    openGraph: { title, description },
    alternates: { canonical: `/trends/${n.slug}` },
  };
}

async function loadTrends(slug: string): Promise<Trend[]> {
  try {
    if (process.env.YOUTUBE_API_KEY) {
      const raw = await youtubeTrends(slug);
      return (await rerankForNiche(slug, raw)).slice(0, 10);
    }
    return (await googleTrends("US")).slice(0, 10);
  } catch {
    return [];
  }
}

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 88 ? "var(--gold)" : "var(--hot)";
}

export default async function NicheTrendsPage(
  { params }: { params: Promise<{ niche: string }> }
) {
  const { niche } = await params;
  const n = getNiche(niche);
  if (!n) notFound();

  const trends = await loadTrends(n.slug);
  const low = n.label.toLowerCase();

  const faqs: [string, string][] = [
    [`How do I turn a trending topic into a ${low} hook?`,
      `Pick a trend below, tap it, and HookViral generates 8 scored hooks tailored to ${low} creators. Each is built to stop the scroll in the first 3 seconds and graded 0–100 on retention.`],
    [`Why do the first 3 seconds matter so much for ${low} content?`,
      `Short-form platforms decide reach from early retention. A ${low} video with a weak opening gets suppressed before the payoff lands — the hook is the single highest-leverage edit you can make.`],
    [`How often do these ${low} trends update?`,
      `The live list refreshes roughly every 6 hours from real search and platform trend data. Bookmark this page and check it before you film.`],
    [`Is this free?`,
      `Yes. Generating hooks from any trend is free with no account. Pro removes the daily cap and unlocks unlimited trend decoding.`],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([q, a]) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      ...(trends.length > 0
        ? [{
            "@type": "ItemList",
            name: `Trending ${n.label} topics`,
            itemListElement: trends.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.title,
            })),
          }]
        : []),
    ],
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="page-wrap">
        <div style={{ textAlign: "center", padding: "2rem 0 2.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>{n.emoji}</div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".75rem", lineHeight: 1.05 }}>
            Trending <span className="gradient-text">{n.label}</span> topics
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: "1rem", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            What&apos;s hot right now for {low} creators — and how to turn any of it into an opening that survives the first 3 seconds. {n.tagline}
          </p>
        </div>

        {/* Live trends */}
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1rem" }}>
          Trending now
        </h2>
        {trends.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2.5rem" }}>
            {trends.map((t, i) => (
              <Link
                key={i}
                href={`/generator?topic=${encodeURIComponent(t.title)}&niche=${n.slug}`}
                style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem", textDecoration: "none" }}
              >
                <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1rem", color: "var(--muted)", flexShrink: 0, width: "24px" }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: ".92rem", color: "var(--text)", lineHeight: 1.5, marginBottom: "3px" }}>{t.title}</div>
                  {t.sub && <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>{t.sub}</div>}
                </div>
                <span style={{ fontSize: ".78rem", color: "var(--electric)", fontFamily: "var(--fb)", whiteSpace: "nowrap", flexShrink: 0 }}>Get hooks →</span>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.5rem", marginBottom: "2.5rem", textAlign: "center", color: "var(--muted)", fontSize: ".9rem" }}>
            Live trends are loading. Meanwhile, try these {low} angles:
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "1rem" }}>
              {n.sampleTopics.map(s => (
                <Link key={s} href={`/generator?topic=${encodeURIComponent(s)}&niche=${n.slug}`} style={{ padding: "8px 16px", borderRadius: "100px", background: "var(--s2)", border: "1px solid var(--border)", color: "var(--soft)", fontSize: ".85rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
                  {s} →
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
          <Link href={`/generator?niche=${n.slug}`} style={{ padding: "13px 26px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Generate {n.label} Hooks — Free →
          </Link>
          <Link href={`/hooks-for/${n.slug}`} style={{ padding: "13px 26px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            {n.label} Hook Examples
          </Link>
        </div>

        {/* Evergreen: proven hooks for this niche */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".5rem" }}>
            Proven {n.label} hooks
          </h2>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: ".9rem", marginBottom: "1.25rem", lineHeight: 1.7 }}>
            Patterns that consistently stop the scroll for {low} audiences. Use them as templates, then drop a trending topic in.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {n.exampleHooks.map((h, i) => (
              <div key={i} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <p style={{ flex: 1, fontSize: ".92rem", color: "var(--text)", lineHeight: 1.6 }}>{h.text}</p>
                <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: "100px", background: "rgba(108,58,255,.08)", color: "#9B8CFF", border: "1px solid rgba(108,58,255,.15)", whiteSpace: "nowrap", flexShrink: 0 }}>{h.formula}</span>
                <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.1rem", color: scoreColor(h.score), letterSpacing: "-1px", flexShrink: 0 }}>{h.score}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Evergreen: how to ride a trend */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1.25rem" }}>
            How to ride a {low} trend before it peaks
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "12px" }}>
            {[
              ["1. Catch it early", `Trends decay fast. Grab one from the live list above while it's still rising — the earlier you post, the more of the wave you catch.`],
              ["2. Frame it for your audience", `A raw topic isn't a hook. Angle it for ${low} viewers: a bold take, a stake, or a "nobody talks about this" gap.`],
              ["3. Score before you film", `Run the hook through the Analyzer. If it scores under 80, rewrite it — the opening line decides whether the rest of the video is ever seen.`],
            ].map(([t, d]) => (
              <div key={t} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.25rem" }}>
                <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".95rem", color: "var(--text)", marginBottom: ".5rem" }}>{t}</div>
                <div style={{ fontSize: ".85rem", color: "var(--soft)", lineHeight: 1.7, fontWeight: 300 }}>{d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1.25rem" }}>
            {n.label} trends — FAQ
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {faqs.map(([q, a]) => (
              <div key={q} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r2)", padding: "1.1rem 1.3rem" }}>
                <div style={{ fontSize: ".92rem", fontWeight: 500, color: "var(--text)", marginBottom: ".5rem" }}>{q}</div>
                <div style={{ fontSize: ".85rem", color: "var(--soft)", lineHeight: 1.7, fontWeight: 300 }}>{a}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Trending in other niches</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {NICHE_MODES.filter(o => o.slug !== n.slug).map(o => (
              <Link key={o.slug} href={`/trends/${o.slug}`} style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--muted)", fontSize: ".8rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
                {o.emoji} {o.label}
              </Link>
            ))}
            <Link href="/patterns" style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--muted)", fontSize: ".8rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
              🧠 Attention patterns
            </Link>
          </div>
        </div>
      </div>

      <NextStep />
    </div>
  );
}
