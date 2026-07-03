import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Instagram Reels Hook Generator — Free AI Hooks | HookViral AI",
  description: "Generate 8 viral Instagram Reels hooks in seconds. Free AI hook generator for Reels. Transformation arcs, save-this energy, aspirational formulas. Retention score included.",
  keywords: ["instagram reels hook generator", "reels hook generator", "instagram hook generator", "viral reels hooks", "instagram reel hooks", "reels hook examples", "instagram hook ideas"],
  openGraph: {
    title: "Instagram Reels Hook Generator — HookViral AI",
    description: "Generate 8 scored Instagram Reels hooks in seconds. Free. No account required.",
    type: "website",
    url: "https://hookviral.ai/instagram-hook-generator",
  },
  alternates: {
    canonical: "https://hookviral.ai/instagram-hook-generator",
  },
};

const REELS_HOOKS_EXAMPLES = [
  { topic: "Fitness & Wellness", hooks: ["This is what 90 days of consistency actually looks like.", "I quit 3 'healthy' habits and finally slept through the night.", "Save this — the only morning routine you'll actually stick to."] },
  { topic: "Finance", hooks: ["Save this before your next impulse purchase. Seriously.", "The budgeting system that took me from broke to saving 30% — no spreadsheets.", "5 money habits I wish someone showed me at 22."] },
  { topic: "Lifestyle & Routine", hooks: ["This is your sign to stop optimizing and just start.", "The 10-minute evening routine that changed how I sleep.", "What a 'slow morning' actually does to your cortisol (save this)."] },
  { topic: "Business & Creator", hooks: ["I grew from 0 to 20k followers. Here's the honest version.", "The content strategy nobody talks about because it's too simple.", "Save this — the 3 Reels formats that drove 90% of my growth."] },
];

const FORMULAS = [
  { name: "Transformation Arc", desc: "Show the before/after contrast upfront to trigger aspiration.", example: "This is what 90 days of meal prep actually looks like." },
  { name: "Save Hook", desc: "Tell viewers to save so they don't lose something valuable.", example: "Save this before you book your next flight. Trust me." },
  { name: "List Promise", desc: "Number + clear win that's easy to imagine yourself getting.", example: "5 habits that genuinely changed my relationship with money." },
  { name: "Relatable Confession", desc: "Mirror a feeling the viewer already has but hasn't said out loud.", example: "Nobody warns you how lonely 'levelling up' actually feels." },
  { name: "Aspirational Specific", desc: "Paint a concrete future state the viewer wants to be in.", example: "The morning routine that made me stop dreading Mondays." },
  { name: "Contrarian (Warm)", desc: "Challenge a norm — but keep the tone positive-confident.", example: "The reason your skincare routine isn't working isn't what you think." },
];

const FAQS: [string, string][] = [
  ["What makes a good Instagram Reels hook?", "Reels viewers come primed to be inspired and to save content. The best hooks promise a transformation or insight the viewer can apply to their own life — something they'll want to come back to. Save-intent triggers ('save this', 'the only X you need') and before/after framing outperform shock or pure curiosity on this platform."],
  ["How are Reels hooks different from TikTok hooks?", "TikTok rewards pattern interrupts and emotional volatility. Reels rewards aspiration and 'save this' energy. A TikTok hook like 'You're doing it completely wrong' can feel harsh on Reels — on Instagram, the same insight lands better as 'The skincare mistake I made for 5 years (and how to fix it).' HookViral's platform toggle adjusts the tone automatically."],
  ["Should my Reels hook be visual or text-based?", "Both can work, but Reels' visual-first feed means your opening frame competes visually. A spoken hook paired with on-screen text that echoes it gives you two bites at the same second. When relevant, HookViral suggests visual reinforcements inline."],
  ["How long should an Instagram Reels hook be?", "Under 5 seconds of spoken audio is the sweet spot. Reels skip rates peak before the 3-second mark. Your hook should create pull before viewers decide to swipe — one punchy sentence is usually enough."],
  ["Is HookViral free to use?", "Yes. You get 10 free hook generations per day with no account required. Pro gives unlimited generations, full script writing, and deep retention analysis with rewrite suggestions."],
];

export default function InstagramHookGeneratorPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--fb)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: ".78rem", color: "var(--muted)", marginBottom: "2rem" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <span style={{ color: "var(--soft)" }}>Instagram Reels Hook Generator</span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", border: "1px solid rgba(225,48,108,.3)", background: "rgba(225,48,108,.07)", fontSize: ".72rem", color: "var(--hot)", marginBottom: "1.5rem", letterSpacing: ".5px" }}>
            Instagram Reels · Free · AI-Powered
          </div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "1rem", lineHeight: 1.05 }}>
            Instagram Reels Hook Generator
          </h1>
          <p style={{ fontSize: "clamp(.9rem,2vw,1.1rem)", color: "var(--soft)", maxWidth: "580px", margin: "0 auto 2rem", lineHeight: 1.75, fontWeight: 300 }}>
            Generate 8 scored Instagram Reels hooks in seconds. Each one is built on transformation arcs, save-this energy, and aspirational formulas that Reels&apos; algorithm actually rewards.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/generator?platform=reels" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)", boxShadow: "0 6px 20px rgba(255,45,107,.3)" }}>
              Generate Reels Hooks Free
            </Link>
            <Link href="/analyzer" style={{ display: "inline-flex", padding: "13px 24px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".95rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
              Score My Hook
            </Link>
          </div>
          <p style={{ fontSize: ".73rem", color: "var(--muted)", marginTop: ".875rem" }}>Free · No account · 10 hooks/day</p>
        </div>

        {/* Example hooks by niche */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".5rem" }}>
            Instagram Reels Hook Examples by Niche
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".875rem", marginBottom: "2rem", fontWeight: 300 }}>
            Real outputs generated by HookViral AI. Your hooks will be tailored to your exact topic.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {REELS_HOOKS_EXAMPLES.map((ex) => (
              <div key={ex.topic} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                  <span style={{ fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)" }}>Topic:</span>
                  <span style={{ padding: "3px 12px", borderRadius: "100px", background: "rgba(255,45,107,.08)", border: "1px solid rgba(255,45,107,.2)", fontSize: ".78rem", color: "var(--hot)", fontWeight: 500 }}>{ex.topic}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {ex.hooks.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "var(--s2)", borderRadius: "12px", padding: "12px 16px" }}>
                      <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".72rem", color: "var(--muted)", flexShrink: 0 }}>#{i + 1}</span>
                      <p style={{ fontSize: ".875rem", lineHeight: 1.6, color: "var(--text)", flex: 1 }}>{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hook formulas */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".5rem" }}>
            The 6 Instagram Reels Hook Formulas That Work
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".875rem", marginBottom: "2rem", fontWeight: 300 }}>
            HookViral uses these proven formulas — adapted to Reels&apos; aspirational algorithm and save-this culture.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "12px" }}>
            {FORMULAS.map((f) => (
              <div key={f.name} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "16px", padding: "1.25rem" }}>
                <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".9rem", color: "var(--text)", marginBottom: ".5rem" }}>{f.name}</div>
                <p style={{ fontSize: ".82rem", color: "var(--soft)", lineHeight: 1.65, marginBottom: ".875rem", fontWeight: 300 }}>{f.desc}</p>
                <div style={{ background: "var(--s2)", borderRadius: "10px", padding: "10px 12px", fontSize: ".78rem", color: "var(--electric)", fontStyle: "italic" }}>
                  &ldquo;{f.example}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO content */}
        <div style={{ marginBottom: "4rem", padding: "2rem", background: "var(--s1)", borderRadius: "20px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1rem" }}>
            How to Write Viral Instagram Reels Hooks
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
            {([
              ["Lead with aspiration, not just shock", "Reels skews toward a slightly older, more intentional audience than TikTok. Hooks that promise a visible change or a saveable insight outperform pure shock. If it sounds like something you&apos;d actually screenshot and send to a friend, you&apos;re close."],
              ["Trigger save intent early", "Instagram&apos;s algorithm weighs saves heavily. Hooks that imply &ldquo;you&apos;ll want to come back to this&rdquo; — explicit like &ldquo;save this before your next trip&rdquo; or implicit like &ldquo;the only morning routine you&apos;ll actually keep&rdquo; — prime the viewer to save before they&apos;ve even seen the content."],
              ["Make the transformation visible", "The best Reels hooks put the result in the opening line. Not &ldquo;I changed my routine&rdquo; but &ldquo;This is what 90 days of consistency actually looks like.&rdquo; Specificity + implied transformation is the Reels formula."],
              ["Keep the tone warm, not harsh", "Unlike TikTok where edge and outrage travel, Reels rewards a confident-positive voice. Contrarian hooks work, but soften the delivery — &ldquo;The skincare advice that&apos;s wasting your money&rdquo; lands better than &ldquo;Stop doing this, it&apos;s wrong.&rdquo;"],
            ] as [string, string][]).map(([title, content]) => (
              <div key={title}>
                <h3 style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--text)", marginBottom: ".35rem" }} dangerouslySetInnerHTML={{ __html: title }} />
                <p style={{ fontSize: ".875rem", color: "var(--soft)", lineHeight: 1.75, fontWeight: 300 }} dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.4rem,3vw,1.8rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1.5rem" }}>
            Instagram Reels Hook FAQ
          </h2>
          {FAQS.map(([q, a], i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0" }}>
              <h3 style={{ fontSize: ".9rem", fontWeight: 600, color: "var(--text)", marginBottom: ".625rem", fontFamily: "var(--fb)" }}>{q}</h3>
              <p style={{ fontSize: ".875rem", color: "var(--soft)", lineHeight: 1.8, fontWeight: 300 }}>{a}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* Related pages */}
        <div style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", letterSpacing: "-.5px" }}>
            More Hook Generators
          </h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {([
              ["TikTok Hook Generator", "/tiktok-hook-generator"],
              ["YouTube Shorts Hook Generator", "/youtube-hook-generator"],
              ["Hook Examples by Niche", "/hooks-for/lifestyle"],
              ["Analyze My Hook", "/analyzer"],
            ] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} style={{ padding: "8px 16px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".82rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--s1)", borderRadius: "24px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".75rem" }}>
            Ready to make Reels worth saving?
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".9rem", marginBottom: "1.75rem", fontWeight: 300 }}>
            Generate 8 scored Instagram Reels hooks in seconds. Free. No account needed.
          </p>
          <Link href="/generator?platform=reels" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Generate My Reels Hooks
          </Link>
        </div>

      </div>
    </div>
  );
}
