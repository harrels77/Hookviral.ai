"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ── Data ──
const TYPING_HOOKS = [
  "🔥 I tried this for 30 days. The results shocked me.",
  "⚠️ You're losing followers every day you ignore this.",
  "🤯 Nobody talks about this trick that tripled my reach.",
  "❌ Stop starting your videos like this. Do this instead.",
  "🚀 I went from 200 to 47k views after one change.",
];

const DEMO_HOOKS = [
  { text: "🔥 I tried this for 30 days. The results shocked me.", formula: "Story Starter", platform: "TikTok", score: 96, color: "rgba(255,45,107,.15)", textColor: "#FF7DA0" },
  { text: "⚠️ You're losing followers every day you ignore this.", formula: "Loss Aversion", platform: "Instagram", score: 93, color: "rgba(225,48,108,.12)", textColor: "#F48CB1" },
  { text: "🤯 Nobody talks about this LinkedIn trick.", formula: "Curiosity Gap", platform: "LinkedIn", score: 91, color: "rgba(10,102,194,.12)", textColor: "#7EB6E8" },
  { text: "❌ Stop starting your videos like this. Do this instead.", formula: "Contrarian", platform: "YouTube", score: 94, color: "rgba(255,50,50,.12)", textColor: "#FF7070" },
];

const BEFORE_AFTER = [
  { before: "Hey guys, today I'm going to show you my morning routine...", after: "🔥 I woke up at 5am for 30 days. Here's what nobody tells you.", platform: "TikTok" },
  { before: "In this video I'll share some tips about saving money.", after: "⚠️ You're wasting $400/month on this. Most people never realize it.", platform: "YouTube" },
  { before: "I wanted to share some thoughts on productivity today.", after: "🧠 I deleted my to-do list for 2 weeks. My output doubled.", platform: "LinkedIn" },
];

const STATS = [
  { n: "2.4M+", label: "Hooks generated", color: "var(--hot)" },
  { n: "48K+", label: "Creators", color: "var(--electric)" },
  { n: "94", label: "Avg score", color: "var(--neon)" },
  { n: "3s", label: "Per generation", color: "var(--gold)" },
];

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 88 ? "var(--gold)" : "var(--hot)";
}

// ── Typing animation hook ──
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
  const [demoActive, setDemoActive] = useState(0);
  const [baIdx, setBaIdx] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const typedHook = useTyping(TYPING_HOOKS);
  const statsRef = useRef<HTMLDivElement>(null);

  // Auto-cycle demo hooks
  useEffect(() => {
    const t = setInterval(() => setDemoActive(p => (p + 1) % DEMO_HOOKS.length), 3200);
    return () => clearInterval(t);
  }, []);

  // Stats appear on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: .3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* Bg orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", background: "var(--electric)", borderRadius: "50%", top: "-250px", left: "-200px", filter: "blur(130px)", opacity: .07, animation: "orbFloat 16s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", background: "var(--hot)", borderRadius: "50%", bottom: "-200px", right: "-150px", filter: "blur(130px)", opacity: .06, animation: "orbFloat 20s ease-in-out infinite reverse" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ══════════════════════════════════
            HERO — Split layout
            Left: copy + CTA
            Right: Phone mockup
        ══════════════════════════════════ */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>

          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", background: "rgba(108,58,255,.07)", fontSize: ".73rem", letterSpacing: "1px", textTransform: "uppercase", color: "var(--electric)", marginBottom: "2rem" }}>
              <span style={{ width: "5px", height: "5px", background: "var(--neon)", borderRadius: "50%", animation: "pulseGlow 1.5s infinite" }} />
              AI Hook Generator · Free to Start
            </div>

            <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2.5rem,4vw,4.2rem)", fontWeight: 800, lineHeight: .95, letterSpacing: "-3px", marginBottom: "1.5rem" }}>
              Stop the<br />
              Scroll.<br />
              <span className="gradient-text">In 3 Seconds.</span>
            </h1>

            <p style={{ fontSize: "1rem", color: "var(--soft)", marginBottom: "2.5rem", lineHeight: 1.75, fontWeight: 300, maxWidth: "420px" }}>
              Generate 8 platform-optimized viral hooks in seconds. Real AI. Real virality scores. No fluff.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
              <HLink href="/generator" primary>Start Free →</HLink>
              <HLink href="/pricing">See Pro — $12/mo</HLink>
            </div>
            <p style={{ fontSize: ".75rem", color: "var(--muted)" }}>10 free hooks/day · No card · Resets at midnight</p>

            {/* Mini stats row */}
            <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>{s.n}</div>
                  <div style={{ fontSize: ".7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <PhoneMockup hook={DEMO_HOOKS[demoActive]} />
          </div>
        </section>

        {/* ══════════════════════════════════
            TYPING DEMO — Full width
        ══════════════════════════════════ */}
        <section style={{ background: "var(--s1)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <SLabel>Live generator</SLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: "2.5rem", color: "var(--text)" }}>
              Watch it generate in real time.
            </h2>

            {/* Desktop mockup */}
            <DesktopMockup typedHook={typedHook} />
          </div>
        </section>

        {/* ══════════════════════════════════
            STATS
        ══════════════════════════════════ */}
        <section ref={statsRef} style={{ borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "0" }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "1.5rem 1rem", borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800, letterSpacing: "-1px", color: s.color, opacity: statsVisible ? 1 : 0, transform: statsVisible ? "translateY(0)" : "translateY(12px)", transition: `all .6s ease ${i * .12}s` }}>
                    {s.n}
                  </div>
                  <div style={{ fontSize: ".7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            BEFORE / AFTER
        ══════════════════════════════════ */}
        <section style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SLabel center>The difference</SLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05 }}>
              Before HookViral vs After.
            </h2>
            <p style={{ color: "var(--soft)", fontSize: ".9rem", marginTop: ".75rem", fontWeight: 300 }}>
              Same topic. Completely different result.
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" }}>
            {BEFORE_AFTER.map((b, i) => (
              <button key={i} onClick={() => setBaIdx(i)} style={{ padding: "7px 18px", borderRadius: "100px", border: `1px solid ${baIdx === i ? "rgba(255,45,107,.5)" : "var(--border2)"}`, background: baIdx === i ? "rgba(255,45,107,.08)" : "transparent", color: baIdx === i ? "var(--hot)" : "var(--muted)", fontSize: ".8rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
                {b.platform}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "20px", padding: "1.5rem" }}>
              <div style={{ fontSize: ".68rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1rem" }}>❌ Without HookViral</div>
              <p style={{ fontSize: ".9rem", lineHeight: 1.7, color: "var(--muted)", fontStyle: "italic" }}>&ldquo;{BEFORE_AFTER[baIdx].before}&rdquo;</p>
              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "4px" }}>
                  <div style={{ height: "100%", background: "var(--muted)", width: "22%", borderRadius: "4px" }} />
                </div>
                <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".95rem", color: "var(--muted)" }}>22<span style={{ fontSize: ".6rem", fontWeight: 400 }}>/100</span></span>
              </div>
            </div>

            <div style={{ background: "var(--s1)", border: "1px solid rgba(0,255,178,.25)", borderRadius: "20px", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,var(--electric),var(--neon))", borderRadius: "20px 20px 0 0" }} />
              <div style={{ fontSize: ".68rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1rem" }}>✓ With HookViral</div>
              <p style={{ fontSize: ".9rem", lineHeight: 1.7, color: "var(--text)" }}>{BEFORE_AFTER[baIdx].after}</p>
              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ flex: 1, height: "4px", background: "var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "linear-gradient(90deg,var(--electric),var(--neon))", width: "94%", borderRadius: "4px", transition: "width .8s ease" }} />
                </div>
                <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".95rem", color: "var(--neon)" }}>94<span style={{ fontSize: ".6rem", fontWeight: 400 }}>/100</span></span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/generator" style={{ fontSize: ".875rem", color: "var(--electric)", textDecoration: "none" }}>
              Generate hooks like these — free →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════
            FEATURES
        ══════════════════════════════════ */}
        <section style={{ borderTop: "1px solid var(--border)", background: "var(--s1)" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 1.5rem" }}>
            <SLabel>Features</SLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "3rem", lineHeight: 1.05 }}>
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "2px" }}>
              {[
                ["⚡", "8 Viral Formulas", "Curiosity Gap, Loss Aversion, Story Starter, Shock Value — built on psychology."],
                ["🎯", "Platform-Specific", "TikTok needs pattern interrupts. LinkedIn needs authority. Our AI adapts."],
                ["#", "Hashtag Optimizer", "5–8 optimized hashtags per hook. High-volume, niche, and micro-niche mix."],
                ["📊", "Virality Score", "Each hook scored out of 100. Curiosity, Emotion, and Clarity breakdown."],
                ["🎬", "Script Generator", "Hook + Bridge + CTA. Full script in 10 seconds. Pro feature."],
                ["🔄", "Daily Free Tier", "10 hooks/day, reset at midnight. No account needed to start."],
              ].map(([icon, title, desc]) => (
                <FCard key={title} icon={icon} title={title} desc={desc} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            REVIEWS
        ══════════════════════════════════ */}
        <section style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <SLabel center>What creators say</SLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px" }}>
              Real results. Real creators.
            </h2>
            <p style={{ color: "var(--muted)", fontSize: ".78rem", marginTop: ".75rem" }}>
              Share your results → hello@hookviral.ai
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "14px" }}>
            {[
              { av: "SL", c: "var(--hot)", name: "Sofia L.", role: "@sofiacreates · 48k", text: "Views from 400 to 47k in 3 weeks. The virality score is everything — I only post 90+ hooks now." },
              { av: "MK", c: "var(--electric)", name: "Marc K.", role: "Social Media Manager", text: "I manage 8 clients. This saves me 2 hours/day minimum. Platform-specific hooks are next level." },
              { av: "AR", c: "var(--neon)", name: "Aïcha R.", role: "Finance YouTuber", text: "My hooks went from 'meh' to stopping the scroll. The before/after difference is insane." },
            ].map((r, i) => (
              <RCard key={i} r={r} />
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            FINAL CTA
        ══════════════════════════════════ */}
        <section style={{ background: "var(--s1)", borderTop: "1px solid var(--border)", textAlign: "center", padding: "6rem 1.5rem" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "1rem", lineHeight: 1.05 }}>
            Stop guessing.<br /><span className="gradient-text">Start going viral.</span>
          </h2>
          <p style={{ color: "var(--soft)", fontSize: "1rem", margin: "0 auto 2.5rem", fontWeight: 300, maxWidth: "360px", lineHeight: 1.7 }}>
            10 free hooks/day. No account. Upgrade to Pro for unlimited.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <HLink href="/generator" primary>Generate My Hooks — Free →</HLink>
            <HLink href="/pricing">See Pro — $12/mo</HLink>
          </div>
          <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            {[["Terms", "/terms"], ["Privacy", "/privacy"], ["Generator", "/generator"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ fontSize: ".75rem", color: "var(--muted)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 700px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid .hero-right { display: none; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════
// PHONE MOCKUP COMPONENT
// ══════════════════════════════════
function PhoneMockup({ hook }: { hook: typeof DEMO_HOOKS[0] }) {
  return (
    <div style={{ position: "relative", width: "260px" }}>
      {/* Glow behind phone */}
      <div style={{ position: "absolute", inset: "-30px", background: `radial-gradient(ellipse at center, ${hook.color.replace(".12", ".4")} 0%, transparent 70%)`, filter: "blur(20px)", transition: "background .5s ease", borderRadius: "50%" }} />

      {/* Phone frame */}
      <div style={{
        position: "relative", width: "260px", background: "var(--s1)",
        borderRadius: "36px", border: "2px solid var(--border2)",
        boxShadow: "0 40px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)",
        overflow: "hidden", padding: "0",
      }}>
        {/* Notch */}
        <div style={{ background: "var(--bg)", padding: "14px 20px 10px", display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ width: "90px", height: "24px", background: "var(--bg)", borderRadius: "0 0 16px 16px", position: "absolute", top: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--border2)" }} />
            <div style={{ width: "40px", height: "6px", borderRadius: "3px", background: "var(--border2)" }} />
          </div>
          <div style={{ marginTop: "16px", fontSize: ".7rem", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 600, letterSpacing: "1px" }}>HOOKVIRAL.AI</div>
        </div>

        {/* Screen content */}
        <div style={{ background: "var(--bg)", padding: "1rem" }}>
          {/* Platform tag */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".875rem" }}>
            <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: ".65rem", background: hook.color, color: hook.textColor, fontFamily: "var(--fd)", fontWeight: 700 }}>{hook.platform}</span>
            <span style={{ fontSize: ".65rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", background: "rgba(108,58,255,.1)", color: "#9B8CFF", border: "1px solid rgba(108,58,255,.2)" }}>{hook.formula}</span>
          </div>

          {/* Hook text */}
          <div style={{ background: "var(--s1)", borderRadius: "14px", padding: "1rem", marginBottom: ".75rem", border: "1px solid var(--border)", minHeight: "80px", transition: "all .4s ease" }}>
            <p style={{ fontSize: ".85rem", lineHeight: 1.7, color: "var(--text)", fontWeight: 400 }}>{hook.text}</p>
          </div>

          {/* Score */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: ".75rem" }}>
            <div style={{ flex: 1, height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg,var(--electric),var(--neon))", width: `${hook.score}%`, borderRadius: "3px", transition: "width .8s cubic-bezier(.16,1,.3,1)" }} />
            </div>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1rem", color: scoreColor(hook.score), letterSpacing: "-1px", flexShrink: 0 }}>{hook.score}<span style={{ fontSize: ".55rem", color: "var(--muted)", fontWeight: 400 }}>/100</span></span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ flex: 1, padding: "8px", background: "linear-gradient(135deg,var(--hot),var(--electric))", borderRadius: "100px", textAlign: "center", fontSize: ".72rem", color: "#fff", fontFamily: "var(--fd)", fontWeight: 700 }}>Copy Hook</div>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--s2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>★</div>
          </div>

          {/* Mini hooks below */}
          <div style={{ marginTop: ".75rem", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[2, 3].map(i => (
              <div key={i} style={{ background: "var(--s1)", borderRadius: "8px", padding: "6px 10px", border: "1px solid var(--border)", opacity: .5 }}>
                <div style={{ height: "6px", background: "var(--border2)", borderRadius: "3px", width: `${65 + i * 10}%`, marginBottom: "3px" }} />
                <div style={{ height: "6px", background: "var(--border2)", borderRadius: "3px", width: `${40 + i * 8}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ background: "var(--bg)", padding: "12px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100px", height: "4px", background: "var(--border2)", borderRadius: "2px" }} />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════
// DESKTOP MOCKUP COMPONENT
// ══════════════════════════════════
function DesktopMockup({ typedHook }: { typedHook: string }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "60%", height: "40%", background: "radial-gradient(ellipse, rgba(108,58,255,.15) 0%, transparent 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

      {/* Browser frame */}
      <div style={{
        background: "var(--s2)",
        borderRadius: "16px",
        border: "1px solid var(--border2)",
        overflow: "hidden",
        boxShadow: "0 40px 80px rgba(0,0,0,.4)",
        position: "relative",
      }}>
        {/* Browser chrome */}
        <div style={{ background: "var(--s3)", padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28CA41" }} />
          </div>
          <div style={{ flex: 1, background: "var(--s2)", borderRadius: "6px", padding: "5px 12px", fontSize: ".7rem", color: "var(--muted)", fontFamily: "var(--fb)" }}>
            hookviral.ai/generator
          </div>
        </div>

        {/* App content */}
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

            {/* Left — input panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ background: "var(--s1)", borderRadius: "12px", padding: "1rem", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: ".6rem", letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)", marginBottom: ".5rem", fontFamily: "var(--fd)", fontWeight: 600 }}>Your content</div>
                <div style={{ fontSize: ".8rem", color: "var(--soft)", lineHeight: 1.6, minHeight: "48px" }}>
                  my fitness transformation story...
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {["TikTok", "Instagram", "YouTube"].map((p, i) => (
                  <div key={p} style={{ padding: "4px 10px", borderRadius: "100px", border: `1px solid ${i === 0 ? "rgba(108,58,255,.6)" : "var(--border)"}`, background: i === 0 ? "rgba(108,58,255,.1)" : "transparent", color: i === 0 ? "#C4B5FD" : "var(--muted)", fontSize: ".65rem" }}>{p}</div>
                ))}
              </div>
              <div style={{ padding: "10px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", textAlign: "center", fontSize: ".75rem", color: "#fff", fontFamily: "var(--fd)", fontWeight: 700 }}>⚡ Generate 8 Hooks</div>
            </div>

            {/* Right — output with typing animation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Active hook with typing cursor */}
              <div style={{ background: "var(--s1)", borderRadius: "12px", padding: "1rem", border: "1px solid rgba(108,58,255,.3)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,var(--hot),var(--electric))" }} />
                <div style={{ fontSize: ".62rem", color: "#9B8CFF", fontFamily: "var(--fd)", fontWeight: 700, marginBottom: ".5rem" }}>Story Starter</div>
                <p style={{ fontSize: ".78rem", lineHeight: 1.6, color: "var(--text)", minHeight: "48px" }}>
                  {typedHook}<span style={{ display: "inline-block", width: "2px", height: "14px", background: "var(--hot)", marginLeft: "2px", verticalAlign: "middle", animation: "blink .8s ease-in-out infinite" }} />
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: ".5rem" }}>
                  <div style={{ flex: 1, height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ height: "100%", background: "linear-gradient(90deg,var(--electric),var(--neon))", width: "96%" }} />
                  </div>
                  <span style={{ fontSize: ".72rem", fontFamily: "var(--fd)", fontWeight: 800, color: "var(--neon)" }}>96</span>
                </div>
              </div>

              {/* Skeleton hooks */}
              {[1, 2].map(i => (
                <div key={i} style={{ background: "var(--s1)", borderRadius: "10px", padding: ".875rem", border: "1px solid var(--border)", opacity: .6 }}>
                  <div style={{ height: "6px", background: "var(--border2)", borderRadius: "3px", width: "40%", marginBottom: "5px" }} />
                  <div style={{ height: "6px", background: "var(--border2)", borderRadius: "3px", width: "90%", marginBottom: "3px" }} />
                  <div style={{ height: "6px", background: "var(--border2)", borderRadius: "3px", width: "70%" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared sub-components ──
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
          : { border: "1px solid var(--border2)", color: hov ? "var(--text)" : "var(--soft)", background: hov ? "var(--s2)" : "transparent", transform: hov ? "translateY(-2px)" : "none" }
        ),
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