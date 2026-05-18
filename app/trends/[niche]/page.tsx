import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NICHE_MODES, getNiche } from "@/lib/niches";
import { googleTrends, youtubeTrends, rerankForNiche, type Trend } from "@/lib/trends";

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
  const title = `Trending ${n.label} Topics This Week — HookViral AI`;
  const description = `Live trending topics for ${n.label.toLowerCase()} creators. Turn any of them into scroll-stopping hooks in seconds. Free, no account.`;
  return {
    title,
    description,
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

export default async function NicheTrendsPage(
  { params }: { params: Promise<{ niche: string }> }
) {
  const { niche } = await params;
  const n = getNiche(niche);
  if (!n) notFound();

  const trends = await loadTrends(n.slug);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="page-wrap">
        <div style={{ textAlign: "center", padding: "2rem 0 2.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>{n.emoji}</div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".75rem", lineHeight: 1.05 }}>
            Trending <span className="gradient-text">{n.label}</span> topics
          </h1>
          <p style={{ color: "var(--soft)", fontWeight: 300, fontSize: "1rem", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            What&apos;s hot right now for {n.label.toLowerCase()} creators. Tap any topic to get 8 scored hooks for it instantly.
          </p>
        </div>

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
            Live trends are loading. Meanwhile, try these {n.label.toLowerCase()} angles:
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "1rem" }}>
              {n.sampleTopics.map(s => (
                <Link key={s} href={`/generator?topic=${encodeURIComponent(s)}&niche=${n.slug}`} style={{ padding: "8px 16px", borderRadius: "100px", background: "var(--s2)", border: "1px solid var(--border)", color: "var(--soft)", fontSize: ".85rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
                  {s} →
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <Link href={`/generator?niche=${n.slug}`} style={{ padding: "13px 26px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Generate {n.label} Hooks — Free →
          </Link>
          <Link href={`/hooks-for/${n.slug}`} style={{ padding: "13px 26px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            {n.label} Hook Examples
          </Link>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontSize: ".7rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", marginBottom: ".75rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Trending in other niches</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {NICHE_MODES.filter(o => o.slug !== n.slug).map(o => (
              <Link key={o.slug} href={`/trends/${o.slug}`} style={{ padding: "6px 14px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--muted)", fontSize: ".8rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
                {o.emoji} {o.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
