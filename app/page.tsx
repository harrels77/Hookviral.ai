"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const TYPING_HOOKS = [
  "🔥 I tried this for 30 days. The results shocked me.",
  "⚠️ You're losing followers every day you ignore this.",
  "🤯 Nobody talks about this trick that tripled my reach.",
  "❌ Stop starting your videos like this. Do this instead.",
  "🚀 I went from 200 to 47k views after one change.",
];

const EXAMPLE_OUTPUTS = [
  {
    topic: "My fitness transformation",
    platform: "TikTok",
    hooks: [
      { text: "🔥 I lost 15kg doing this 10-min workout. No gym required.", formula: "Story Starter", score: 96 },
      { text: "⚠️ Stop doing crunches. They're ruining your progress.", formula: "Contrarian", score: 94 },
      { text: "🤯 The fitness trick trainers don't want you to know.", formula: "Curiosity Gap", score: 92 },
    ],
  },
  {
    topic: "How to save money",
    platform: "YouTube",
    hooks: [
      { text: "💸 You're wasting $400/month on this without realizing it.", formula: "Loss Aversion", score: 95 },
      { text: "🤯 I saved $10,000 in one year doing nothing different.", formula: "Story Starter", score: 93 },
      { text: "❌ The budgeting advice everyone gives you is completely wrong.", formula: "Contrarian", score: 91 },
    ],
  },
  {
    topic: "Productivity tips",
    platform: "LinkedIn",
    hooks: [
      { text: "🧠 I deleted my to-do list for 30 days. My output doubled.", formula: "Story Starter", score: 97 },
      { text: "⚠️ Your morning routine is killing your most productive hours.", formula: "Loss Aversion", score: 94 },
      { text: "💡 The 3-minute habit that made me 10x more focused at work.", formula: "Number + Promise", score: 92 },
    ],
  },
];

const STATS = [
  { n: "2.4M+", label: "Hooks generated", color: "var(--hot)" },
  { n: "48K+", label: "Creators", color: "var(--electric)" },
  { n: "94", label: "Avg virality score", color: "var(--neon)" },
  { n: "3s", label: "Per generation", color: "var(--gold)" },
];

const BEFORE_AFTER = [
  {
    before: "Hey guys, today I'm going to show you my morning routine...",
    after: "🔥 I woke up at 5am for 30 days. Here's what nobody tells you.",
    platform: "TikTok",
  },
  {
    before: "In this video I'll share some tips about saving money.",
    after: "⚠️ You're wasting $400/month on this. Most people never realize it.",
    platform: "YouTube",
  },
  {
    before: "I wanted to share some thoughts on productivity today.",
    after: "🧠 I deleted my to-do list for 2 weeks. My output doubled.",
    platform: "LinkedIn",
  },
];

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 88 ? "var(--gold)" : "var(--hot)";
}

function useTyping(texts: string[], speed = 45, pause = 2200) {
  const [display, setDisplay] = useState("");
  const [tIdx, setTIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[tIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(c => c - 1), speed / 2.5);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTIdx(t => (t + 1) % texts.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, tIdx, texts, speed, pause]);

  return display;
}

export default function HomePage() {
  const [exampleIdx, setExampleIdx] = useState(0);
  const [baIdx, setBaIdx] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const typedHook = useTyping(TYPING_HOOKS);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: .3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const ex = EXAMPLE_OUTPUTS[exampleIdx];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* Bg orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "var(--electric)", borderRadius: "50%", top: "-200px", left: "-200px", filter: "blur(120px)", opacity: .07, animation: "orbFloat 16s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "450px", height: "450px", background: "var(--hot)", borderRadius: "50%", bottom: "-180px", right: "-150px", filter: "blur(120px)", opacity: .06, animation: "orbFloat 20s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(3rem,8vw,6rem) 1.25rem 3rem", textAlign: "center" }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", background: "rgba(108,58,255,.07)", fontSize: ".73rem", letterSpacing: "1px", textTransform: "uppercase", color: "var(--electric)", marginBottom: "1.75rem" }}>
            <span style={{ width: "5px", height: "5px", background: "var(--neon)", borderRadius: "50%", animation: "pulseGlow 1.5s infinite", flexShrink: 0 }} />
            Free to start · No AI knowledge required
          </div>

          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,6vw,5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-3px", marginBottom: "1.25rem" }}>
            Turn any idea into<br />
            <span className="gradient-text">10 viral hooks</span><br />
            in 3 seconds.
          </h1>

          <p style={{ fontSize: "clamp(.95rem,2.5vw,1.15rem)", color: "var(--soft)", maxWidth: "540px", margin: "0 auto 1.25rem", lineHeight: 1.75, fontWeight: 300 }}>
            Specialized for <strong style={{ color: "var(--text)", fontWeight: 500 }}>TikTok, Reels & YouTube Shorts</strong>. More effective than ChatGPT because we&apos;re built for one thing — hooks that stop the scroll.
          </p>

          {/* Why better than ChatGPT */}
          <div style={{ display: "inline-flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "2.5rem" }}>
            {[
              ["ChatGPT", "Generic text, no platform logic", false],
              ["HookViral", "8 viral formulas + virality score", true],
            ].map(([name, desc, isGood]) => (
              <div key={name as string} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "100px", background: isGood ? "rgba(0,255,178,.08)" : "rgba(255,255,255,.04)", border: `1px solid ${isGood ? "rgba(0,255,178,.25)" : "var(--border)"}` }}>
                <span style={{ fontSize: ".75rem" }}>{isGood ? "✓" : "✕"}</span>
                <span style={{ fontSize: ".78rem", color: isGood ? "var(--neon)" : "var(--muted)", fontWeight: 500 }}>{name as string}</span>
                <span style={{ fontSize: ".72rem", color: "var(--muted)", fontWeight: 300 }}>— {desc as string}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: ".875rem" }}>
            <HLink href="/generator" primary>Generate My Hooks — Free →</HLink>
            <HLink href="/pricing">Pro — $9/mo</HLink>
          </div>
          <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>
            10 free hooks/day · No credit card · Resets at midnight
          </p>
        </section>

        {/* ── TYPING DEMO ── */}
        <section style={{ background: "var(--s1)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "2.5rem 1.25rem" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <div style={{ fontSize: ".7rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: "1rem", fontFamily: "var(--fd)", fontWeight: 600, textAlign: "center" }}>
              Live generation preview
            </div>
            <div style={{ background: "var(--s2)", borderRadius: "16px", padding: "1.25rem 1.5rem", border: "1px solid rgba(108,58,255,.2)", minHeight: "64px", display: "flex", alignItems: "center" }}>
              <p style={{ fontSize: "clamp(.95rem,2.5vw,1.1rem)", lineHeight: 1.65, color: "var(--text)", fontWeight: 400 }}>
                {typedHook}
                <span style={{ display: "inline-block", width: "2px", height: "1.1em", background: "var(--hot)", marginLeft: "2px", verticalAlign: "middle", animation: "blink .8s ease-in-out infinite" }} />
              </p>
            </div>
            <p style={{ textAlign: "center", fontSize: ".75rem", color: "var(--muted)", marginTop: ".875rem" }}>
              This is what your hooks look like. <Link href="/generator" style={{ color: "var(--electric)", textDecoration: "none" }}>Generate yours free →</Link>
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef}>
          <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2.5rem 1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0", border: "1px solid var(--border)", borderRadius: "20px", background: "var(--s1)", overflow: "hidden" }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "1.25rem .75rem", borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.3rem,3.5vw,1.8rem)", fontWeight: 800, letterSpacing: "-1px", color: s.color, opacity: statsVisible ? 1 : 0, transform: statsVisible ? "translateY(0)" : "translateY(10px)", transition: `all .6s ease ${i * .1}s` }}>
                    {s.n}
                  </div>
                  <div style={{ fontSize: ".62rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "3px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONCRETE EXAMPLES ── */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <SLabel center>Real outputs</SLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: ".75rem" }}>
              See exactly what you get.
            </h2>
            <p style={{ color: "var(--soft)", fontSize: ".9rem", fontWeight: 300 }}>
              Real hooks generated by HookViral AI. Your results will be tailored to your topic.
            </p>
          </div>

          {/* Topic selector */}
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
            {EXAMPLE_OUTPUTS.map((e, i) => (
              <button key={i} onClick={() => setExampleIdx(i)} style={{ padding: "8px 18px", borderRadius: "100px", border: `1px solid ${exampleIdx === i ? "rgba(255,45,107,.5)" : "var(--border2)"}`, background: exampleIdx === i ? "rgba(255,45,107,.08)" : "transparent", color: exampleIdx === i ? "var(--hot)" : "var(--muted)", fontSize: ".82rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s", fontWeight: exampleIdx === i ? 500 : 400 }}>
                {e.topic}
              </button>
            ))}
          </div>

          {/* Topic + platform label */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem", justifyContent: "center" }}>
            <div style={{ padding: "6px 16px", borderRadius: "100px", background: "var(--s1)", border: "1px solid var(--border)", fontSize: ".8rem", color: "var(--soft)" }}>
              Topic: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{ex.topic}</strong>
            </div>
            <div style={{ padding: "6px 14px", borderRadius: "100px", background: "rgba(108,58,255,.08)", border: "1px solid rgba(108,58,255,.2)", fontSize: ".78rem", color: "#9B8CFF", fontFamily: "var(--fd)", fontWeight: 700 }}>
              {ex.platform}
            </div>
          </div>

          {/* Hook cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {ex.hooks.map((h, i) => (
              <div key={i} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "18px", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", animation: "cardIn .4s ease both", animationDelay: `${i * .08}s` }}>
                {/* Rank */}
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg,var(--hot),var(--electric))" : "var(--s2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".72rem", color: i === 0 ? "#fff" : "var(--muted)", flexShrink: 0 }}>
                  {i + 1}
                </div>
                {/* Text */}
                <p style={{ flex: 1, fontSize: "clamp(.85rem,2vw,.95rem)", lineHeight: 1.65, color: "var(--text)", fontWeight: 400 }}>
                  {h.text}
                </p>
                {/* Score */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.3rem", color: scoreColor(h.score), letterSpacing: "-1px", lineHeight: 1 }}>{h.score}</div>
                  <div style={{ fontSize: ".55rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>/100</div>
                  <div style={{ marginTop: "5px", width: "40px", height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: `linear-gradient(90deg,var(--electric),${scoreColor(h.score)})`, width: `${h.score}%`, borderRadius: "2px" }} />
                  </div>
                </div>
                {/* Formula tag */}
                <div style={{ display: "none" }} className="formula-tag">
                  <span style={{ fontSize: ".65rem", padding: "2px 8px", borderRadius: "100px", background: "rgba(108,58,255,.08)", color: "#9B8CFF", border: "1px solid rgba(108,58,255,.15)", whiteSpace: "nowrap" }}>{h.formula}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <HLink href="/generator" primary>Generate Hooks Like These — Free →</HLink>
          </div>
        </section>

        {/* ── BEFORE / AFTER ── */}
        <section style={{ background: "var(--s1)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <SLabel center>The difference</SLabel>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05 }}>
                Before vs After.
              </h2>
              <p style={{ color: "var(--soft)", fontSize: ".9rem", marginTop: ".5rem", fontWeight: 300 }}>Same topic. Completely different result.</p>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
              {BEFORE_AFTER.map((b, i) => (
                <button key={i} onClick={() => setBaIdx(i)} style={{ padding: "7px 18px", borderRadius: "100px", border: `1px solid ${baIdx === i ? "rgba(255,45,107,.5)" : "var(--border2)"}`, background: baIdx === i ? "rgba(255,45,107,.08)" : "transparent", color: baIdx === i ? "var(--hot)" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                  {b.platform}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.5rem" }}>
                <div style={{ fontSize: ".68rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1rem" }}>❌ Without HookViral</div>
                <p style={{ fontSize: "clamp(.82rem,2vw,.9rem)", lineHeight: 1.7, color: "var(--muted)", fontStyle: "italic" }}>&ldquo;{BEFORE_AFTER[baIdx].before}&rdquo;</p>
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "4px" }}>
                    <div style={{ height: "100%", background: "var(--muted)", width: "22%", borderRadius: "4px" }} />
                  </div>
                  <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".9rem", color: "var(--muted)" }}>22<span style={{ fontSize: ".55rem", fontWeight: 400 }}>/100</span></span>
                </div>
              </div>

              <div style={{ background: "var(--bg)", border: "1px solid rgba(0,255,178,.25)", borderRadius: "20px", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,var(--electric),var(--neon))", borderRadius: "20px 20px 0 0" }} />
                <div style={{ fontSize: ".68rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1rem" }}>✓ With HookViral</div>
                <p style={{ fontSize: "clamp(.82rem,2vw,.9rem)", lineHeight: 1.7, color: "var(--text)" }}>{BEFORE_AFTER[baIdx].after}</p>
                <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg,var(--electric),var(--neon))", width: "94%", borderRadius: "4px", transition: "width .8s ease" }} />
                  </div>
                  <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".9rem", color: "var(--neon)" }}>94<span style={{ fontSize: ".55rem", fontWeight: 400 }}>/100</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem" }}>
          <SLabel>Why not ChatGPT</SLabel>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "3rem", lineHeight: 1.05 }}>
            Built for one thing.<br />Better at it than anything else.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "2px" }}>
            {[
              ["⚡", "8 Viral Formulas", "Curiosity Gap, Loss Aversion, Story Starter, Shock Value. Every hook uses a formula proven to stop the scroll — not generic AI text."],
              ["🎯", "Platform Psychology", "TikTok hooks need pattern interrupts. LinkedIn needs authority frames. ChatGPT doesn't know the difference. HookViral does."],
              ["📊", "Virality Score", "Every hook gets scored 0–100 with a breakdown of Curiosity, Emotion, and Clarity. You always know which hook to use."],
              ["#", "Hashtag Optimizer", "5–8 platform-optimized hashtags per hook. High-volume + niche mix. Auto-adapted per platform."],
              ["🎬", "Script Generator", "Hook (0–3s) + Bridge (3–10s) + CTA. Full script in 10 seconds. Never stare at a blank screen again."],
              ["🔄", "10 Free Every Day", "10 hooks per day, reset at midnight. No account needed. See the results before you decide to upgrade."],
            ].map(([icon, title, desc]) => (
              <FCard key={title} icon={icon} title={title} desc={desc} />
            ))}
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section style={{ background: "var(--s1)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <SLabel center>What creators say</SLabel>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.5rem)", fontWeight: 800, letterSpacing: "-2px" }}>
                Real results. Real creators.
              </h2>
              <p style={{ color: "var(--muted)", fontSize: ".75rem", marginTop: ".75rem" }}>
                Share your results → hello@hookviral.ai
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "14px" }}>
              {[
                { av: "SL", c: "var(--hot)", name: "Sofia L.", role: "@sofiacreates · 48k TikTok", text: "Views from 400 to 47k in 3 weeks. The virality score is everything — I only post 90+ hooks now." },
                { av: "MK", c: "var(--electric)", name: "Marc K.", role: "Social Media Manager", text: "I manage 8 clients. HookViral saves me 2 hours/day. The platform-specific hooks are next level." },
                { av: "AR", c: "var(--neon)", name: "Aïcha R.", role: "Finance YouTuber · 22k subs", text: "My hooks went from ignored to stopping the scroll. The before/after difference is genuinely insane." },
              ].map((r, i) => <RCard key={i} r={r} />)}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ textAlign: "center", padding: "5rem 1.25rem", borderTop: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "1rem", lineHeight: 1.05 }}>
            Stop guessing.<br />
            <span className="gradient-text">Start going viral.</span>
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".95rem", margin: "0 auto 2.5rem", fontWeight: 300, maxWidth: "360px", lineHeight: 1.7 }}>
            10 free hooks/day. No account. Upgrade to Pro for unlimited.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <HLink href="/generator" primary>Generate My Hooks — Free →</HLink>
            <HLink href="/pricing">Pro — $9/mo annual</HLink>
          </div>
          <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            {[["Terms", "/terms"], ["Privacy", "/privacy"], ["TikTok Hooks", "/tiktok-hook-generator"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ fontSize: ".75rem", color: "var(--muted)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </section>

      </div>

      {/* Mobile responsive overrides */}
      <style>{`
        @media (max-width: 600px) {
          .before-after-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Sub-components ──
function SLabel({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div style={{ fontSize: ".7rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--electric)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px", justifyContent: center ? "center" : "flex-start" }}>
      <span style={{ width: "18px", height: "1px", background: "var(--electric)", flexShrink: 0 }} />
      {children}
      {center && <span style={{ width: "18px", height: "1px", background: "var(--electric)", flexShrink: 0 }} />}
    </div>
  );
}

function HLink({ href, primary, children }: { href: string; primary?: boolean; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "13px 26px", borderRadius: "100px", textDecoration: "none", fontFamily: "var(--fb)", fontSize: ".95rem", fontWeight: 500, transition: "all .3s",
        ...(primary
          ? { background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", transform: hov ? "translateY(-3px)" : "none", boxShadow: hov ? "0 16px 40px rgba(255,45,107,.4)" : "0 4px 14px rgba(255,45,107,.2)" }
          : { border: "1px solid var(--border2)", color: hov ? "var(--text)" : "var(--soft)", background: hov ? "var(--s2)" : "transparent", transform: hov ? "translateY(-2px)" : "none" }),
      }}>
      {children}
    </Link>
  );
}

function FCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? "var(--s3)" : "var(--s2)", padding: "2rem 1.75rem", position: "relative", overflow: "hidden", transition: "background .25s" }}>
      {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,var(--hot),var(--electric))" }} />}
      <div style={{ fontSize: "1.4rem", marginBottom: "1rem" }}>{icon}</div>
      <div style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 700, marginBottom: ".5rem", color: "var(--text)" }}>{title}</div>
      <div style={{ fontSize: ".875rem", color: "var(--soft)", lineHeight: 1.7, fontWeight: 300 }}>{desc}</div>
    </div>
  );
}

function RCard({ r }: { r: { av: string; c: string; name: string; role: string; text: string } }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "var(--bg)", border: `1px solid ${hov ? "rgba(108,58,255,.3)" : "var(--border)"}`, borderRadius: "18px", padding: "1.5rem", transition: "all .3s", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? "0 16px 40px rgba(108,58,255,.1)" : "none", position: "relative", overflow: "hidden" }}>
      {hov && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,var(--electric),transparent)" }} />}
      <div style={{ display: "flex", gap: "3px", marginBottom: "1rem" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
        ))}
      </div>
      <p style={{ fontSize: ".875rem", lineHeight: 1.75, color: "var(--soft)", marginBottom: "1.25rem", fontWeight: 300 }}>&ldquo;{r.text}&rdquo;</p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".72rem", background: `${r.c}22`, color: r.c, flexShrink: 0 }}>{r.av}</div>
        <div>
          <div style={{ fontSize: ".85rem", fontWeight: 500, color: "var(--text)" }}>{r.name}</div>
          <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>{r.role}</div>
        </div>
      </div>
    </div>
  );
}