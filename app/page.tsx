"use client";

import Link from "next/link";
import { useState } from "react";

const REVIEWS = [
  { name: "Sofia L.", handle: "@sofiacreates · 48k followers", avatar: "SL", color: "var(--hot)", text: "I use HookViral before every TikTok. My views tripled in 2 weeks. The virality score is my secret weapon.", stars: 5 },
  { name: "Marc K.", handle: "Social Media Manager", avatar: "MK", color: "var(--electric)", text: "I manage 12 clients. The Agency plan saves me 3 hours a day. Clear ROI from day one.", stars: 5 },
  { name: "Aïcha R.", handle: "Finance YouTuber · 22k subs", avatar: "AR", color: "var(--neon)", text: "30 minutes on hooks became 30 seconds. The quality is honestly better than what I wrote myself.", stars: 5 },
  { name: "Thomas B.", handle: "@fitwithtom · Instagram", avatar: "TB", color: "var(--gold)", text: "Platform-specific hooks are what got me. TikTok and LinkedIn are totally different. HookViral gets that.", stars: 5 },
  { name: "Camille D.", handle: "Content Creator · Paris", avatar: "CD", color: "var(--hot)", text: "The analysis feature shows me WHY each hook works. I actually learned copywriting just by using this.", stars: 5 },
  { name: "Jake M.", handle: "@jakegrowth · 91k on X", avatar: "JM", color: "var(--electric)", text: "The only hook generator that doesn't sound like ChatGPT wrote it. Hooks sound like a real creator.", stars: 5 },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* Bg orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", background: "var(--electric)", borderRadius: "50%", top: "-250px", left: "-200px", filter: "blur(120px)", opacity: .07, animation: "orbFloat 16s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "var(--hot)", borderRadius: "50%", bottom: "-200px", right: "-150px", filter: "blur(120px)", opacity: .06, animation: "orbFloat 20s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)", textAlign: "center", padding: "4rem 1.25rem 5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.35)", background: "rgba(108,58,255,.08)", fontSize: ".75rem", letterSpacing: "1px", textTransform: "uppercase", color: "var(--electric)", marginBottom: "2rem" }}>
            <span style={{ width: "5px", height: "5px", background: "var(--neon)", borderRadius: "50%", flexShrink: 0 }} />
            AI-Powered · 8 Viral Formulas · Free to Start
          </div>

          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2.8rem,8vw,6.5rem)", fontWeight: 800, lineHeight: .95, letterSpacing: "-3px", marginBottom: "1.5rem" }}>
            Stop the<br /><span className="gradient-text">Scroll.</span>
          </h1>

          <p style={{ fontSize: "clamp(.95rem,2.5vw,1.15rem)", color: "var(--soft)", maxWidth: "480px", margin: "0 auto 2.5rem", lineHeight: 1.7, fontWeight: 300 }}>
            Generate 8 viral hooks + hashtags + scripts in seconds. Built for creators who refuse to be skipped.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <HoverLink href="/generator" primary>Generate My Hooks — Free →</HoverLink>
            <HoverLink href="/pricing">See Pricing</HoverLink>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0", marginTop: "3.5rem", border: "1px solid var(--border)", borderRadius: "20px", background: "var(--s1)", overflow: "hidden", width: "100%", maxWidth: "560px" }}>
            {[["8", "Formulas", "var(--hot)"], ["5", "Platforms", "var(--electric)"], ["3s", "Generate", "var(--neon)"], ["$0", "To start", "var(--gold)"]].map(([n, l, c]) => (
              <div key={l} style={{ padding: "1.25rem .75rem", textAlign: "center", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800, color: c }}>{n}</div>
                <div style={{ fontSize: ".68rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "3px" }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", overflow: "hidden", padding: ".75rem 0" }}>
          <div style={{ display: "flex", gap: "2.5rem", whiteSpace: "nowrap", animation: "marqueeScroll 28s linear infinite" }}>
            {[...Array(2)].flatMap(() =>
              ["TikTok Hooks", "Instagram Reels", "YouTube Shorts", "LinkedIn Video", "Curiosity Gap", "Loss Aversion", "Story Starter", "Shock Value", "Viral Score AI", "Hashtag Generator", "Script Builder", "8 Formulas"].map((item, i) => (
                <span key={item + i} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: ".75rem", color: "var(--muted)", letterSpacing: "1px", textTransform: "uppercase" }}>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: ["var(--hot)", "var(--electric)", "var(--neon)", "var(--gold)"][i % 4], flexShrink: 0 }} />
                  {item}
                </span>
              ))
            )}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 1.25rem" }}>
          <SectionLabel>How it works</SectionLabel>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "3rem", lineHeight: 1.05 }}>
            Three steps. Zero friction.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "2rem" }}>
            {[
              ["01", "Describe your content", "Type what your video is about in plain language. No templates to fill."],
              ["02", "Pick platform & tone", "TikTok, Instagram, LinkedIn — choose your style. Authentic, shock, educational..."],
              ["03", "Get 8 scored hooks", "Every hook has a score, hashtags, and an optional script. Copy and win."],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ textAlign: "center" }}>
                <StepCircle num={num} />
                <div style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1rem", margin: "1.25rem 0 .5rem", color: "var(--text)" }}>{title}</div>
                <div style={{ fontSize: ".875rem", color: "var(--soft)", lineHeight: 1.7, fontWeight: 300 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--s1)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 1.25rem" }}>
            <SectionLabel>Why creators love it</SectionLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "3rem", lineHeight: 1.05 }}>
              Built different.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2px" }}>
              {[
                ["8 Proven Viral Formulas", "Curiosity Gap, Loss Aversion, Story Starter, Shock Value... Built on psychology, not guesswork.", "Science-backed"],
                ["Platform Intelligence", "TikTok needs pattern interrupts. LinkedIn needs authority. Our engine adapts to each platform.", "5 platforms"],
                ["Hashtag Generator", "5–8 optimized hashtags per hook. Mix of high-volume, niche, and micro-niche tags.", "Per platform"],
                ["AI Virality Score", "Each hook scored out of 100 with a breakdown of Curiosity, Emotion, and Clarity.", "Pro feature"],
                ["Script Generator", "Hook (0-3s) + Bridge (3-10s) + CTA. Full script ready to record in 10 seconds.", "Pro feature"],
                ["Fair Freemium", "10 free generations/day. No bait-and-switch. Upgrade only when you need more.", "Always free tier"],
              ].map(([title, desc, tag]) => (
                <FeatureCard key={title} title={title} desc={desc} tag={tag} />
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section style={{ maxWidth: "960px", margin: "0 auto", padding: "5rem 1.25rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SectionLabel center>Social proof</SectionLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-2px" }}>
              Creators are already winning.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px" }}>
            {REVIEWS.map((r, i) => (
              <ReviewCard key={i} review={r} />
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ textAlign: "center", padding: "6rem 1.25rem", background: "var(--s1)", borderTop: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "1rem", lineHeight: 1.05 }}>
            Stop writing hooks.<br />
            <span className="gradient-text">Start going viral.</span>
          </h2>
          <p style={{ color: "var(--soft)", fontSize: "1rem", marginBottom: "2.5rem", fontWeight: 300, maxWidth: "400px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            Free forever. No credit card. Upgrade only when your content demands it.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <HoverLink href="/generator" primary>Generate My First 8 Hooks →</HoverLink>
            <HoverLink href="/pricing">View Pricing</HoverLink>
          </div>
          <p style={{ marginTop: "1.25rem", fontSize: ".78rem", color: "var(--muted)" }}>
            10 free hooks per day · No signup required · Resets at midnight
          </p>
        </section>

      </div>

      <style>{`
        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

// ── Sub-components ──

function SectionLabel({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--electric)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px", justifyContent: center ? "center" : "flex-start" }}>
      <span style={{ width: "20px", height: "1px", background: "var(--electric)", flexShrink: 0 }} />
      {children}
      {center && <span style={{ width: "20px", height: "1px", background: "var(--electric)", flexShrink: 0 }} />}
    </div>
  );
}

function HoverLink({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "14px 28px", borderRadius: "100px",
        textDecoration: "none", fontFamily: "var(--fb)",
        fontSize: ".95rem", fontWeight: 500,
        transition: "all .3s",
        ...(primary ? {
          background: "linear-gradient(135deg,var(--hot),var(--electric))",
          color: "#fff",
          transform: hov ? "translateY(-3px)" : "none",
          boxShadow: hov ? "0 16px 40px rgba(255,45,107,.4)" : "0 4px 14px rgba(255,45,107,.2)",
        } : {
          border: "1px solid var(--border2)",
          color: hov ? "var(--text)" : "var(--soft)",
          background: hov ? "var(--s2)" : "transparent",
          transform: hov ? "translateY(-2px)" : "none",
        }),
      }}
    >
      {children}
    </Link>
  );
}

function StepCircle({ num }: { num: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "56px", height: "56px", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto",
        fontFamily: "var(--fd)", fontWeight: 700, fontSize: "1.1rem",
        border: `1px solid ${hov ? "transparent" : "var(--border2)"}`,
        background: hov ? "linear-gradient(135deg,var(--hot),var(--electric))" : "var(--s2)",
        transition: "all .3s", color: hov ? "#fff" : "var(--soft)",
        transform: hov ? "scale(1.1)" : "none",
        boxShadow: hov ? "0 0 24px rgba(255,45,107,.35)" : "none",
      }}
    >
      {num}
    </div>
  );
}

function FeatureCard({ title, desc, tag }: { title: string; desc: string; tag: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "var(--s3)" : "var(--s2)",
        padding: "2rem 1.75rem", position: "relative",
        overflow: "hidden", transition: "background .25s", cursor: "default",
      }}
    >
      {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,var(--hot),var(--electric))" }} />}
      <div style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem", color: "var(--text)" }}>{title}</div>
      <div style={{ fontSize: ".875rem", color: "var(--soft)", lineHeight: 1.7, fontWeight: 300, marginBottom: "1rem" }}>{desc}</div>
      <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "100px", fontSize: ".68rem", background: "rgba(108,58,255,.1)", color: "#9B8CFF", border: "1px solid rgba(108,58,255,.2)" }}>{tag}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: typeof REVIEWS[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--s1)", border: `1px solid ${hov ? "rgba(108,58,255,.3)" : "var(--border)"}`,
        borderRadius: "20px", padding: "1.5rem",
        transition: "all .3s", transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 16px 40px rgba(108,58,255,.1)" : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,var(--electric),transparent)" }} />}
      {/* Stars */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "1rem" }}>
        {Array.from({ length: review.stars }).map((_, i) => (
          <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="var(--gold)">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        ))}
      </div>
      <p style={{ fontSize: ".875rem", lineHeight: 1.75, color: "var(--soft)", marginBottom: "1.25rem", fontStyle: "italic", fontWeight: 300 }}>
        &ldquo;{review.text}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".75rem", background: `${review.color}22`, color: review.color, flexShrink: 0 }}>
          {review.avatar}
        </div>
        <div>
          <div style={{ fontSize: ".85rem", fontWeight: 500, color: "var(--text)" }}>{review.name}</div>
          <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>{review.handle}</div>
        </div>
      </div>
    </div>
  );
}