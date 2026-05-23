"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HOOK_PATTERNS } from "@/lib/patterns";

function patternHref(name: string) {
  const p = HOOK_PATTERNS.find(x => x.name === name);
  return p ? `/patterns#${p.id}` : "/patterns";
}

// ── Data ──
const DEMO_HOOKS = [
  { text: "🔥 I tried this for 30 days. The results shocked me.", formula: "Story Starter", platform: "TikTok", score: 96, color: "rgba(255,45,107,.15)", textColor: "#FF7DA0" },
  { text: "⚠️ You're losing followers every day you ignore this.", formula: "Loss Aversion", platform: "Instagram", score: 93, color: "rgba(225,48,108,.12)", textColor: "#F48CB1" },
  { text: "🤯 Nobody talks about this LinkedIn trick.", formula: "Curiosity Gap", platform: "LinkedIn", score: 91, color: "rgba(10,102,194,.12)", textColor: "#7EB6E8" },
  { text: "❌ Stop starting your videos like this. Do this instead.", formula: "Contrarian", platform: "YouTube", score: 94, color: "rgba(255,50,50,.12)", textColor: "#FF7070" },
];

// Product-true facts only — no fabricated counts.
const STATS = [
  { n: "8", label: "Scored hooks / generation", color: "var(--hot)" },
  { n: "0–100", label: "Retention score", color: "var(--electric)" },
  { n: "9", label: "Attention patterns", color: "var(--neon)" },
  { n: "Free", label: "No account needed", color: "var(--gold)" },
];

function scoreColor(s: number) {
  return s >= 93 ? "var(--neon)" : s >= 88 ? "var(--gold)" : "var(--hot)";
}

export default function HomePage() {
  const [demoActive, setDemoActive] = useState(0);

  // Auto-cycle demo hooks in the hero phone mockup
  useEffect(() => {
    const t = setInterval(() => setDemoActive(p => (p + 1) % DEMO_HOOKS.length), 3200);
    return () => clearInterval(t);
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
            HERO — Split layout (from v2)
            Left: copy + CTA + mini-stats
            Right: Phone mockup
        ══════════════════════════════════ */}
        <section
          className="hero-grid"
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
        >
          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "100px", border: "1px solid rgba(108,58,255,.3)", background: "rgba(108,58,255,.07)", fontSize: ".73rem", letterSpacing: "1px", textTransform: "uppercase", color: "var(--electric)", marginBottom: "2rem" }}>
              <span style={{ width: "5px", height: "5px", background: "var(--neon)", borderRadius: "50%", animation: "pulseGlow 1.5s infinite", flexShrink: 0 }} />
              Free to start · No AI knowledge required
            </div>

            <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2.5rem,4vw,4.2rem)", fontWeight: 800, lineHeight: .95, letterSpacing: "-3px", marginBottom: "1.25rem" }}>
              Score your hook in<br />
              <span className="gradient-text">5 seconds.</span><br />
              Fix it in one click.
            </h1>

            <p style={{ fontSize: "1rem", color: "var(--soft)", marginBottom: "1.75rem", lineHeight: 1.75, fontWeight: 300, maxWidth: "440px" }}>
              Paste any opening line. Get the score, the missing patterns, and a stronger rewrite in seconds — no prompting required. Built for <strong style={{ color: "var(--text)", fontWeight: 500 }}>TikTok, Reels & YouTube Shorts</strong>.
            </p>

            {/* Why better than ChatGPT chips (from v1) */}
            <div style={{ display: "inline-flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
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

            {/* Two personas side-by-side as full bordered cards. Previous
                version used tiny uppercase labels above plain CTAs — visually
                indistinct from the surrounding hero content and ignored on
                scroll. These claim space deliberately: each card is the
                primary action for its persona, not a label-decorated link. */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "1.25rem" }}>
              <PersonaCard
                accent="var(--hot)"
                emoji="✦"
                title="I have a hook"
                desc="Score it in 5 seconds. See the missing patterns. Rewrite stronger in one click."
                href="/analyzer"
                cta="Score it — Free →"
                primary
              />
              <PersonaCard
                accent="var(--electric)"
                emoji="🔬"
                title="I have a niche, no idea"
                desc="Pick a live trend. Get 3-5 ready angles with scored hooks for your niche."
                href="/trends"
                cta="Discover trends →"
              />
            </div>
            <p style={{ fontSize: ".75rem", color: "var(--muted)", marginBottom: "2.5rem" }}>
              No signup · 10 free generations/day · Resets at midnight
            </p>

            {/* Mini stats row (from v2) */}
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: "1.4rem", fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>{s.n}</div>
                  <div style={{ fontSize: ".7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Phone mockup (from v2) */}
          <div className="hero-right" style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            <PhoneMockup hook={DEMO_HOOKS[demoActive]} />
          </div>
        </section>

        {/* ══════════════════════════════════
            HOW IT WORKS — the loop, made explicit
        ══════════════════════════════════ */}
        <section style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "5rem 1.5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <SLabel center>How it works</SLabel>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: ".75rem" }}>
                From idea to a <span className="gradient-text">scroll-stopping hook</span>.<br />Step by step.
              </h2>
              <p style={{ color: "var(--soft)", fontSize: ".95rem", fontWeight: 300, maxWidth: "580px", margin: "0 auto", lineHeight: 1.7 }}>
                Each tool does one job in a loop. You can start anywhere — but here&apos;s the path that turns a blank screen into a hook you&apos;re ready to film.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(205px,1fr))", gap: "12px" }}>
              {[
                {
                  n: "1", step: "Discover", tool: "Trends", href: "/trends", cta: "Open Trends",
                  you: "Pick what's already getting attention in your niche.",
                  get: "3 niche-specific content angles + a ready scored hook for each trend.",
                },
                {
                  n: "2", step: "Create", tool: "Generator", href: "/generator", cta: "Generate 8 hooks",
                  you: "Drop a topic in, pick a platform.",
                  get: "8 openings, each scored 0–100 for retention, with hashtags.",
                },
                {
                  n: "3", step: "Diagnose & fix", tool: "Analyzer", href: "/analyzer", cta: "Analyze a hook",
                  you: "Paste a hook you already wrote.",
                  get: "Score, the “why”, the attention patterns it's missing, and a 1-click rewrite that injects them.",
                },
                {
                  n: "4", step: "Learn", tool: "Patterns", href: "/patterns", cta: "See the 9 patterns",
                  you: "Read the 9 attention patterns once.",
                  get: "The vocabulary behind every score — so you know WHY a hook works, not just whether.",
                },
              ].map((s, i, arr) => (
                <div key={s.n} style={{ position: "relative", background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                    <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".85rem", flexShrink: 0 }}>{s.n}</span>
                    <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 600 }}>{s.step}</div>
                  </div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-.5px", marginBottom: ".75rem" }}>{s.tool}</div>
                  <div style={{ flex: 1, marginBottom: "1rem" }}>
                    <div style={{ fontSize: ".62rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>You do</div>
                    <p style={{ fontSize: ".85rem", color: "var(--soft)", lineHeight: 1.6, fontWeight: 300, marginBottom: ".75rem" }}>{s.you}</p>
                    <div style={{ fontSize: ".62rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px" }}>You get</div>
                    <p style={{ fontSize: ".85rem", color: "var(--text)", lineHeight: 1.6, fontWeight: 400 }}>{s.get}</p>
                  </div>
                  <Link href={s.href} style={{ fontSize: ".82rem", color: "var(--electric)", textDecoration: "none", fontFamily: "var(--fb)", fontWeight: 500 }}>
                    {s.cta} →
                  </Link>
                  {i < arr.length - 1 && (
                    <span className="hiw-arrow" style={{ position: "absolute", right: "-11px", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "1rem", zIndex: 2 }}>→</span>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════
            TRY-IT WIDGET — real /api/analyze on the home
            (compresses "land → aha" to one step, no nav)
        ══════════════════════════════════ */}
        <section style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
            <SLabel center>Try it on yours</SLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.05, marginBottom: ".75rem" }}>
              See your hook&apos;s score <span className="gradient-text">in 5 seconds</span>.
            </h2>
            <p style={{ color: "var(--soft)", fontSize: ".95rem", fontWeight: 300, marginBottom: "2rem", lineHeight: 1.7 }}>
              Same scoring as the full Analyzer. Real Claude call, real number, no account.
            </p>
            <HomeAnalyzeWidget />
          </div>
        </section>


        {/* ══════════════════════════════════
            EMAIL CAPTURE
        ══════════════════════════════════ */}
        <section style={{ background: "var(--s1)", borderTop: "1px solid var(--border)" }}>
          <div style={{ maxWidth: "620px", margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
            <SLabel center>Weekly hook teardown</SLabel>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: ".75rem" }}>
              One viral hook, broken down.<br />Every week.
            </h2>
            <p style={{ color: "var(--soft)", fontSize: ".9rem", fontWeight: 300, marginBottom: "2rem", lineHeight: 1.7 }}>
              We pull a hook that actually went viral, score it, and explain the pattern behind it. No spam — unsubscribe anytime.
            </p>
            <EmailCapture source="home-weekly" />
          </div>
        </section>

        {/* ══════════════════════════════════
            FINAL CTA
        ══════════════════════════════════ */}
        <section style={{ textAlign: "center", padding: "6rem 1.5rem", borderTop: "1px solid var(--border)" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: "1rem", lineHeight: 1.05 }}>
            Stop losing viewers.<br />
            <span className="gradient-text">Start keeping them.</span>
          </h2>
          <p style={{ color: "var(--soft)", fontSize: ".95rem", margin: "0 auto 2.5rem", fontWeight: 300, maxWidth: "360px", lineHeight: 1.7 }}>
            10 free hooks/day. No account. Upgrade to Pro for unlimited.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <HLink href="/analyzer" primary>Analyze My Hook — Free →</HLink>
            <HLink href="/generator">Generate 8 Hooks</HLink>
          </div>
          <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
            {[["Terms", "/terms"], ["Privacy", "/privacy"], ["TikTok Hooks", "/tiktok-hook-generator"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ fontSize: ".75rem", color: "var(--muted)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
        </section>

      </div>

      <style>{`
        @media (max-width: 700px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
        }
        @media (max-width: 600px) {
          .before-after-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1040px) {
          .hiw-arrow { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════
// PHONE MOCKUP COMPONENT (from v2)
// ══════════════════════════════════
function PhoneMockup({ hook }: { hook: typeof DEMO_HOOKS[0] }) {
  return (
    <div style={{ position: "relative", width: "260px" }}>
      {/* Glow behind phone */}
      <div style={{ position: "absolute", inset: "-30px", background: `radial-gradient(ellipse at center, ${hook.color.replace(".12", ".4").replace(".15", ".4")} 0%, transparent 70%)`, filter: "blur(20px)", transition: "background .5s ease", borderRadius: "50%" }} />

      {/* Phone frame */}
      <div style={{
        position: "relative", width: "260px", background: "var(--s1)",
        borderRadius: "36px", border: "2px solid var(--border2)",
        boxShadow: "0 40px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)",
        overflow: "hidden",
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

// Persona-choice card — full-bordered, hoverable, with the CTA built in.
// Each card IS the action for its persona (not a labeled link). Two of these
// side-by-side under the hero make the workflow fork visually unmissable.
function PersonaCard({
  accent, emoji, title, desc, href, cta, primary,
}: {
  accent: string; emoji: string; title: string; desc: string;
  href: string; cta: string; primary?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", gap: "10px",
        padding: "1.1rem 1.2rem",
        borderRadius: "var(--r3)",
        background: hov ? "var(--s2)" : "var(--s1)",
        // Individual border properties — mixing `border` shorthand with
        // `borderLeft` on the same element makes React's reconciler reset
        // borderLeft to default during re-render. Split keeps them stable.
        borderTop: `1px solid ${hov ? accent : "var(--border)"}`,
        borderRight: `1px solid ${hov ? accent : "var(--border)"}`,
        borderBottom: `1px solid ${hov ? accent : "var(--border)"}`,
        borderLeft: `3px solid ${accent}`,
        textDecoration: "none",
        transition: "all .25s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 14px 40px ${accent}26` : "none",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "1.1rem", lineHeight: 1, color: accent }}>{emoji}</span>
        {/* h2 (not h3) — PersonaCard titles sit directly under the hero h1.
            Lighthouse heading-order rule flags a h1→h3 jump as a11y issue. */}
        <h2 style={{ fontFamily: "var(--fd)", fontSize: ".95rem", fontWeight: 800, letterSpacing: "-.3px", color: "var(--text)", margin: 0 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: ".83rem", color: "var(--soft)", lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
        {desc}
      </p>
      <span
        style={{
          marginTop: "4px",
          alignSelf: "flex-start",
          padding: "8px 16px",
          borderRadius: "100px",
          fontSize: ".82rem",
          fontWeight: 600,
          fontFamily: "var(--fb)",
          ...(primary
            ? { background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff" }
            : { border: `1px solid ${accent}55`, color: accent, background: "transparent" }),
        }}
      >
        {cta}
      </span>
    </Link>
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

// ── Home try-it widget: real /api/analyze, mini result on the page ──
interface MiniResult { score: number; why: string; missing: string[]; }

function HomeAnalyzeWidget() {
  const [hook, setHook] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MiniResult | null>(null);

  async function score(text?: string) {
    const h = (text ?? hook).trim();
    if (!h || loading) return;
    if (text) setHook(text);
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hook: h, platform: "TikTok" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult({
        score: data.analysis.score,
        why: data.analysis.why,
        missing: (data.analysis.patternsMissing || []).slice(0, 3),
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const sc = result ? (result.score >= 90 ? "var(--neon)" : result.score >= 78 ? "var(--gold)" : "var(--hot)") : "var(--muted)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          value={hook}
          onChange={e => setHook(e.target.value.slice(0, 300))}
          placeholder="Paste a hook you'd post on TikTok / Reels / Shorts…"
          rows={2}
          style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "var(--text)", fontSize: "1rem", fontFamily: "var(--fb)", resize: "none", lineHeight: 1.6, caretColor: "var(--hot)" }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => score("My morning routine")}
            disabled={loading}
            style={{ fontSize: ".75rem", color: "var(--muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fb)", padding: 0, textDecoration: "underline" }}
          >
            Try: &ldquo;My morning routine&rdquo;
          </button>
          <button
            onClick={() => score()}
            disabled={loading || !hook.trim()}
            style={{ padding: "10px 22px", borderRadius: "100px", border: "none", background: loading || !hook.trim() ? "var(--s3)" : "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".88rem", fontWeight: 600, fontFamily: "var(--fb)", cursor: loading || !hook.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            {loading
              ? <><span style={{ width: "14px", height: "14px", borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 1s linear infinite", display: "inline-block" }} />Scoring…</>
              : <>✦ Score this hook</>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(255,45,107,.06)", border: "1px solid rgba(255,45,107,.3)", color: "var(--hot)", borderRadius: "var(--r2)", padding: ".85rem 1.1rem", fontSize: ".85rem" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ background: "var(--s1)", border: `1px solid ${sc}33`, borderRadius: "var(--r3)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left", animation: "cardIn .4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: ".62rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 700, marginBottom: "2px" }}>Retention score</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontFamily: "var(--fd)", fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-2px", color: sc, lineHeight: 1 }}>{result.score}</span>
                <span style={{ fontSize: ".8rem", color: "var(--muted)" }}>/100</span>
              </div>
            </div>
            <div style={{ height: "5px", flex: 1, minWidth: "120px", background: "var(--s3)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${result.score}%`, background: `linear-gradient(90deg,var(--electric),${sc})`, borderRadius: "3px", transition: "width .8s cubic-bezier(.16,1,.3,1)" }} />
            </div>
          </div>

          <p style={{ fontSize: ".9rem", color: "var(--soft)", lineHeight: 1.7 }}>{result.why}</p>

          {result.missing.length > 0 && (
            <div>
              <div style={{ fontSize: ".62rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--gold)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".5rem" }}>Missing — biggest levers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {result.missing.map(p => (
                  <Link key={p} href={patternHref(p)} style={{ fontSize: ".72rem", padding: "3px 10px", borderRadius: "100px", background: "rgba(255,184,0,.07)", color: "var(--gold)", border: "1px solid rgba(255,184,0,.25)", textDecoration: "none" }}>
                    {p}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: ".5rem", borderTop: "1px solid var(--border)" }}>
            <Link
              href={`/analyzer?hook=${encodeURIComponent(hook)}`}
              style={{ flex: 1, minWidth: "180px", textAlign: "center", padding: "11px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".85rem", fontWeight: 600, textDecoration: "none", fontFamily: "var(--fb)" }}
            >
              See the full analysis &amp; 1-click rewrite →
            </Link>
            <button
              onClick={() => { setHook(""); setResult(null); }}
              style={{ padding: "11px 20px", borderRadius: "100px", border: "1px solid var(--border2)", background: "transparent", color: "var(--soft)", fontSize: ".85rem", fontFamily: "var(--fb)", cursor: "pointer" }}
            >
              Try another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Email capture ──
function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not subscribe.");
      setState("done");
    } catch (err: unknown) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 24px", borderRadius: "100px", background: "rgba(0,255,178,.08)", border: "1px solid rgba(0,255,178,.25)", color: "var(--neon)", fontSize: ".95rem", fontFamily: "var(--fb)" }}>
        ✓ You&apos;re in. Check your inbox.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "440px", margin: "0 auto" }}>
      <form onSubmit={submit} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@email.com"
          style={{ flex: 1, minWidth: "200px", padding: "13px 18px", borderRadius: "100px", border: "1px solid var(--border2)", background: "var(--bg)", color: "var(--text)", fontSize: ".9rem", fontFamily: "var(--fb)", outline: "none", caretColor: "var(--hot)" }}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          style={{ padding: "13px 26px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".9rem", fontWeight: 600, fontFamily: "var(--fb)", cursor: state === "loading" ? "not-allowed" : "pointer", opacity: state === "loading" ? 0.6 : 1, whiteSpace: "nowrap" }}
        >
          {state === "loading" ? "..." : "Get it →"}
        </button>
      </form>
      {state === "error" && (
        <div style={{ marginTop: ".75rem", fontSize: ".8rem", color: "var(--hot)" }}>{msg}</div>
      )}
    </div>
  );
}

