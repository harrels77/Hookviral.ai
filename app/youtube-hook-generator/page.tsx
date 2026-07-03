import type { Metadata } from "next";
import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";
import { SOURCE_BADGES } from "@/lib/sourceBadges";

export const metadata: Metadata = {
  title: "YouTube Shorts Hook Generator — Free AI Hooks | HookViral AI",
  description: "Generate 8 viral YouTube Shorts hooks in seconds. Free AI hook generator specialized for YouTube. Curiosity loops, tested authority, open-loop formulas. Score included.",
  keywords: ["youtube shorts hook generator", "youtube hook generator", "viral youtube hooks", "youtube shorts hooks", "youtube video hook ideas", "youtube shorts hook examples"],
  openGraph: {
    title: "YouTube Shorts Hook Generator — HookViral AI",
    description: "Generate 8 scored YouTube Shorts hooks in seconds. Free. No account required.",
    type: "website",
    url: "https://hookviral.ai/youtube-hook-generator",
  },
  alternates: {
    canonical: "https://hookviral.ai/youtube-hook-generator",
  },
};

const YOUTUBE_HOOKS_EXAMPLES = [
  { topic: "Fitness", hooks: ["I tested every morning routine for 30 days. The winner surprised me.", "Why 99% of people never see results in the gym — and the one thing that fixes it.", "I followed the most-watched fitness plan on YouTube for 60 days. Here's the honest result."] },
  { topic: "Finance", hooks: ["The truth about compound interest nobody explains in 2 minutes.", "I saved $10,000 in a year making one change. Here's exactly what I did.", "Why your savings account is actively costing you money right now."] },
  { topic: "Productivity", hooks: ["I tried every productivity system for 90 days. This is what actually worked.", "The note-taking method that made me 3× more productive in a week.", "Why your to-do list is the reason you never finish anything."] },
  { topic: "Tech & AI", hooks: ["The AI workflow that replaced 4 tools I was paying for monthly.", "I automated my entire content pipeline with this one setup. Here's how.", "Why everyone is using AI completely wrong — and what to do instead."] },
];

const FORMULAS = [
  { name: "Tested Authority", desc: "Show you did the work so viewers trust the result.", example: "I tested 12 productivity apps for 90 days. One won by a mile." },
  { name: "Curiosity Loop", desc: "Open a question the hook doesn't close — forces the watch.", example: "The truth about YouTube growth nobody is saying out loud." },
  { name: "Stakes Opener", desc: "Lead with the cost of not knowing something.", example: "The one mistake that's killing your YouTube Shorts reach." },
  { name: "Number + Promise", desc: "Specific number with a clear, measurable result.", example: "5 Shorts formats that doubled my views in 30 days." },
  { name: "Contrarian", desc: "Challenge the dominant belief viewers already hold.", example: "Posting every day is the worst thing you can do for your channel." },
  { name: "Story + Proof", desc: "Open a narrative with an implied impressive result.", example: "I went from 0 to 10,000 subscribers. Here's what changed." },
];

const FAQS: [string, string][] = [
  ["What makes a YouTube Shorts hook different from TikTok?", "YouTube Shorts viewers come with slightly higher intent — they're often searching or browsing a creator they already know. Your hook needs to deliver a credible promise fast, not just shock. Think of it like a YouTube title compressed into a spoken opening line: specific, stakes-driven, curiosity-rich."],
  ["How long should a YouTube Shorts hook be?", "Aim for under 10 seconds of spoken audio — ideally one or two punchy lines. Shorts retention drops sharply after 15 seconds, so your opening needs to earn the watch before then. HookViral scores each hook on whether it has enough pull for the format."],
  ["Should I use the same hook on Shorts and TikTok?", "It's possible but not optimal. TikTok rewards extreme pattern interrupts and emotional volatility. YouTube rewards credibility and a clearer payoff promise. HookViral's platform setting adjusts hook generation to each algorithm — try both and compare the scores."],
  ["How many Shorts hooks should I test per video?", "Generate 8, pick the top 2-3 based on the virality score, then test them on your channel. Checking which hook gets the highest click-through before you commit to one shoot saves you wasted effort."],
  ["Is HookViral free to use?", "Yes. You get 10 free hook generations per day with no account required. Pro gives unlimited generations, script writing, and deep retention analysis."],
];

export default function YouTubeHookGeneratorPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--fb)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: ".78rem", color: "var(--muted)", marginBottom: "2rem" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <span style={{ color: "var(--soft)" }}>YouTube Shorts Hook Generator</span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", border: "1px solid rgba(255,77,90,.3)", background: "rgba(255,77,90,.07)", fontSize: ".72rem", color: "var(--hot)", marginBottom: "1.5rem", letterSpacing: ".5px" }}>
            YouTube Shorts · Free · AI-Powered
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", borderRadius: "18px", color: SOURCE_BADGES.youtube.color, background: `${SOURCE_BADGES.youtube.color}14` }}>
              <BrandIcon name="youtube" size={26} />
            </span>
          </div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "1rem", lineHeight: 1.05 }}>
            YouTube Shorts Hook Generator
          </h1>
          <p style={{ fontSize: "clamp(.9rem,2vw,1.1rem)", color: "var(--soft)", maxWidth: "580px", margin: "0 auto 2rem", lineHeight: 1.75, fontWeight: 300 }}>
            Generate 8 viral YouTube Shorts hooks in seconds. Each one is scored for retention and built on the curiosity loops, tested authority, and open-loop formulas that YouTube&apos;s algorithm rewards.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/generator?platform=shorts" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)", boxShadow: "0 6px 20px rgba(255,45,107,.3)" }}>
              Generate YouTube Hooks Free
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
            YouTube Shorts Hook Examples by Niche
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".875rem", marginBottom: "2rem", fontWeight: 300 }}>
            Real outputs generated by HookViral AI. Your hooks will be tailored to your exact topic.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {YOUTUBE_HOOKS_EXAMPLES.map((ex) => (
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
            The 6 YouTube Shorts Hook Formulas That Work
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".875rem", marginBottom: "2rem", fontWeight: 300 }}>
            HookViral uses these proven formulas — adapted to YouTube Shorts&apos; algorithm and viewer intent.
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
            How to Write High-CTR YouTube Shorts Hooks
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
            {([
              ["Treat it like a compressed YouTube title", "The best Shorts hooks work like titles condensed into a spoken sentence. High-stakes promise, specific outcome, no filler. If you can&apos;t read it out loud in under 8 seconds and feel pulled, rewrite it."],
              ["Specificity earns credibility", "'I grew my channel' is ignored. '0 to 10,000 subscribers in 60 days with one format change' triggers the curiosity loop. Numbers and timeframes are the difference between a scroll-past and a watch."],
              ["Open the loop, don&apos;t close it", "The hook should raise a question your video answers — not answer it. &ldquo;Here&apos;s why 99% of creators plateau after 1,000 subscribers&rdquo; promises an explanation that has to come later."],
              ["Authority beats shock", "YouTube viewers skew slightly older and more skeptical than TikTok. &ldquo;I tested this for 30 days&rdquo; outperforms &ldquo;This blew my mind&rdquo; because it sounds earned, not hype."],
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
            YouTube Shorts Hook FAQ
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
              ["Instagram Reels Hook Generator", "/instagram-hook-generator"],
              ["Hook Examples by Niche", "/hooks-for/fitness"],
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
            Ready to hook your next Short?
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".9rem", marginBottom: "1.75rem", fontWeight: 300 }}>
            Generate 8 scored YouTube Shorts hooks in seconds. Free. No account needed.
          </p>
          <Link href="/generator?platform=shorts" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Generate My YouTube Hooks
          </Link>
        </div>

      </div>
    </div>
  );
}
