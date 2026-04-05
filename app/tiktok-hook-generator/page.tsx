import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TikTok Hook Generator — Generate Viral TikTok Hooks Free | HookViral AI",
  description: "Generate 8 viral TikTok hooks in 3 seconds. Free AI hook generator specialized for TikTok. Curiosity Gap, Loss Aversion, Story Starter formulas. Virality score included.",
  keywords: ["tiktok hook generator", "viral tiktok hooks", "tiktok hook ideas", "tiktok content hooks", "tiktok video hooks ai"],
  openGraph: {
    title: "TikTok Hook Generator — HookViral AI",
    description: "Generate 8 viral TikTok hooks in 3 seconds. Free. No account required.",
    type: "website",
    url: "https://hookviral.ai/tiktok-hook-generator",
  },
  alternates: {
    canonical: "https://hookviral.ai/tiktok-hook-generator",
  },
};

const TIKTOK_HOOKS_EXAMPLES = [
  { topic: "Fitness", hooks: ["🔥 I lost 15kg doing this 10-min workout. No gym.", "⚠️ Stop doing pushups like this — you're wasting your time.", "🤯 The one exercise that replaced my entire gym routine."] },
  { topic: "Finance", hooks: ["💸 You're wasting $400/month on this without knowing it.", "🤯 I saved $10,000 in a year doing nothing differently.", "❌ The money advice everyone gives you is completely wrong."] },
  { topic: "Productivity", hooks: ["🧠 I deleted my to-do list for 30 days. My output doubled.", "⚡ The 3-minute habit that made me 10x more focused.", "⚠️ Your morning routine is killing your most productive hours."] },
  { topic: "Business", hooks: ["🚀 I built a $10k/month business with $0 and a phone.", "💡 The business model nobody talks about in 2025.", "🤯 I quit my job 3 months ago. Here's the honest truth."] },
];

const FORMULAS = [
  { name: "Curiosity Gap", desc: "Tease information without revealing it. Forces viewers to keep watching.", example: "The TikTok secret nobody is talking about..." },
  { name: "Loss Aversion", desc: "Show viewers what they're actively losing by not watching.", example: "You're losing followers every day you ignore this." },
  { name: "Story Starter", desc: "Open a narrative loop with an implied big result.", example: "3 months ago I had 200 followers. Today I have 47k." },
  { name: "Shock Value", desc: "Say something unexpected that stops the scroll instantly.", example: "Stop doing pushups. They're ruining your gains." },
  { name: "Number + Promise", desc: "Specific number + clear transformation.", example: "5 TikTok tricks that doubled my views overnight." },
  { name: "Contrarian", desc: "Challenge the dominant belief in your niche.", example: "Posting every day is killing your TikTok growth." },
];

const FAQS = [
  ["What makes a good TikTok hook?", "A great TikTok hook stops the scroll in the first 1-3 seconds. It should create an open loop (curiosity), trigger an emotion (fear of missing out, surprise, relatability), or make a bold statement that demands a reaction. The best hooks make viewers feel they HAVE to keep watching."],
  ["How many hooks should I test per video?", "Ideally generate 8 hooks and test the top 2-3 with different audiences. HookViral generates 8 hooks per session with virality scores so you can pick the strongest one before you even start filming."],
  ["Do TikTok hooks work differently than YouTube hooks?", "Yes. TikTok hooks need to be faster and more pattern-interrupting because the algorithm rewards immediate watch time. YouTube Shorts can have slightly more setup. HookViral adapts each hook to the platform's specific psychology."],
  ["How often should I use a new hook formula?", "Vary your formulas to keep your audience engaged. If you use Curiosity Gap every video, your audience stops feeling the hook. Rotate between Story Starter, Loss Aversion, and Shock Value for best results."],
  ["Is HookViral free to use?", "Yes. You get 10 free hook generations per day, reset at midnight. No account required. Pro ($9/month annual) gives you unlimited generations, script generator, and advanced analysis."],
];

export default function TikTokHookGeneratorPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--fb)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: ".78rem", color: "var(--muted)", marginBottom: "2rem" }}>
          <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>Home</Link>
          <span>›</span>
          <span style={{ color: "var(--soft)" }}>TikTok Hook Generator</span>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", border: "1px solid rgba(255,45,107,.3)", background: "rgba(255,45,107,.07)", fontSize: ".72rem", color: "var(--hot)", marginBottom: "1.5rem", letterSpacing: ".5px" }}>
            TikTok · Free · AI-Powered
          </div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "1rem", lineHeight: 1.05 }}>
            TikTok Hook Generator
          </h1>
          <p style={{ fontSize: "clamp(.9rem,2vw,1.1rem)", color: "var(--soft)", maxWidth: "580px", margin: "0 auto 2rem", lineHeight: 1.75, fontWeight: 300 }}>
            Generate 8 viral TikTok hooks in 3 seconds. Each hook uses a proven formula — Curiosity Gap, Loss Aversion, Story Starter — and includes a virality score so you always know which one to use.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/generator?platform=TikTok" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)", boxShadow: "0 6px 20px rgba(255,45,107,.3)" }}>
              Generate TikTok Hooks Free →
            </Link>
            <Link href="/pricing" style={{ display: "inline-flex", padding: "13px 24px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".95rem", textDecoration: "none", fontFamily: "var(--fb)" }}>
              See Pro Plan
            </Link>
          </div>
          <p style={{ fontSize: ".73rem", color: "var(--muted)", marginTop: ".875rem" }}>Free · No account · 10 hooks/day</p>
        </div>

        {/* Example hooks by niche */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".5rem" }}>
            TikTok Hook Examples by Niche
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".875rem", marginBottom: "2rem", fontWeight: 300 }}>
            Real outputs generated by HookViral AI. Your hooks will be tailored to your exact topic.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {TIKTOK_HOOKS_EXAMPLES.map((ex) => (
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

        {/* Hook formulas explained */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".5rem" }}>
            The 6 TikTok Hook Formulas That Work
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".875rem", marginBottom: "2rem", fontWeight: 300 }}>
            HookViral uses these proven formulas — adapted to TikTok&apos;s unique algorithm and viewer psychology.
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
            How to Write Viral TikTok Hooks in 2025
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}>
            {[
              ["The first 3 seconds are everything", "TikTok's algorithm measures completion rate. If viewers swipe away in the first 3 seconds, your video is dead. Your hook must give them a reason to stay before they even think about swiping."],
              ["Use pattern interrupts", "TikTok users are in a fast-scroll mindset. A hook that sounds like every other video gets ignored. Contrarian statements, bold claims, and unexpected openings force the brain to pause."],
              ["Create an open loop", "The most viral TikTok hooks promise something without delivering it immediately. 'I did this for 30 days...' creates a story loop viewers need to close by watching the whole video."],
              ["Specificity builds credibility", "'I lost weight' is ignored. '15kg in 8 weeks doing this one exercise' stops the scroll. Numbers and specifics make claims feel real and achievable."],
            ].map(([title, content]) => (
              <div key={title as string}>
                <h3 style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 700, color: "var(--text)", marginBottom: ".35rem" }}>{title}</h3>
                <p style={{ fontSize: ".875rem", color: "var(--soft)", lineHeight: 1.75, fontWeight: 300 }}>{content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.4rem,3vw,1.8rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1.5rem" }}>
            TikTok Hook FAQ
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
            {[
              ["YouTube Hook Generator", "/youtube-hook-generator"],
              ["Instagram Hook Generator", "/instagram-hook-generator"],
              ["Viral Hook Examples", "/viral-hook-examples"],
              ["Generator", "/generator"],
            ].map(([label, href]) => (
              <Link key={href} href={href} style={{ padding: "8px 16px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".82rem", textDecoration: "none", fontFamily: "var(--fb)", transition: "all .2s" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", padding: "3rem 2rem", background: "var(--s1)", borderRadius: "24px", border: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-1px", marginBottom: ".75rem" }}>
            Ready to stop the scroll?
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".9rem", marginBottom: "1.75rem", fontWeight: 300 }}>
            Generate 8 TikTok hooks in 3 seconds. Free. No account needed.
          </p>
          <Link href="/generator?platform=TikTok" style={{ display: "inline-flex", padding: "13px 28px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Generate My TikTok Hooks →
          </Link>
        </div>

      </div>
    </div>
  );
}