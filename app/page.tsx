"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { patternHref } from "@/lib/patterns";
import { scoreColor } from "@/lib/score";
import { Icon, type IconName } from "@/lib/icons";
import { Button, Spinner } from "@/components/ui";
import { ScoreRing } from "@/components/ScoreRing";
import { ScoreDemo } from "@/components/ScoreDemo";
import { PhoneShowcase } from "@/components/PhoneShowcase";

// ── Data ──
// Product-true demo hooks: short-form platforms only (the positioning), no
// emoji, no fabricated engagement numbers — just hook + formula + score.
const DEMO_HOOKS = [
  { text: "I tried this for 30 days and the results genuinely shocked me.", formula: "Story Starter", platform: "TikTok", score: 96 },
  { text: "You're losing viewers every day you keep opening videos like this.", formula: "Loss Aversion", platform: "Reels", score: 93 },
  { text: "Nobody making faceless channels talks about this one metric.", formula: "Curiosity Gap", platform: "Shorts", score: 91 },
  { text: "Stop writing your hook last. Here's what to do instead.", formula: "Contrarian", platform: "TikTok", score: 94 },
];

// Product-true facts only — no fabricated counts.
const STATS = [
  { n: "8", label: "Scored hooks / generation" },
  { n: "0–100", label: "Retention score" },
  { n: "9", label: "Attention patterns" },
  { n: "Free", label: "No account needed" },
];

// Types the hook out character by character, then reports done so the score
// can land after the line — the hero demo behaves like someone writing a hook.
// Reduced-motion users get the full text instantly.
function useTypedText(text: string, speed = 24) {
  const [typed, setTyped] = useState(text);
  const [done, setDone] = useState(true);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setTyped(text); setDone(true);
      return;
    }
    let i = 0;
    setTyped(""); setDone(false);
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  /* eslint-enable react-hooks/set-state-in-effect */
  return { typed, done };
}

export default function HomePage() {
  const [demoActive, setDemoActive] = useState(0);

  // Auto-cycle demo hooks in the hero phone mockup
  useEffect(() => {
    const t = setInterval(() => setDemoActive(p => (p + 1) % DEMO_HOOKS.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* ══════════════════════════════════
          HERO — Split layout
          Left: copy + persona fork + mini-stats
          Right: Phone mockup
      ══════════════════════════════════ */}
      <section style={{ position: "relative" }}>
        {/* The page's single decorative wash — static, one accent (DS §3) */}
        <div aria-hidden style={{ position: "absolute", top: "-180px", right: "-140px", width: "560px", height: "560px", borderRadius: "50%", background: "radial-gradient(circle at center, var(--accent-soft), transparent 68%)", opacity: .8, pointerEvents: "none" }} />
        <div
          className="hero-grid"
          style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", padding: "5rem 1.5rem 4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}
        >
        {/* Left */}
        <div>
          <div className="kicker" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "var(--r-pill)", border: "1px solid var(--border)", background: "var(--surface)", marginBottom: "var(--sp-6)" }}>
            Free to start · No AI knowledge required
          </div>

          <h1 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-4xl)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em", marginBottom: "var(--sp-4)" }}>
            Score your hook in<br />
            <span className="gradient-text">5 seconds</span>,<br />
            fix it in one click
          </h1>

          <p style={{ fontSize: "var(--text-base)", color: "var(--text-soft)", marginBottom: "var(--sp-6)", lineHeight: 1.7, maxWidth: "440px" }}>
            Paste any opening line. Get the score, the missing patterns, and a stronger rewrite in seconds — no prompting required. Built for <strong style={{ color: "var(--text)", fontWeight: 500 }}>TikTok, Reels &amp; YouTube Shorts</strong>.
          </p>

          {/* Three personas side-by-side as full bordered cards. Each card
              IS the primary action for its persona. Order = "I have something
              specific" → "I have an idea" → "I have nothing yet" so the
              visitor's mental state maps directly to the corresponding tool. */}
          <div className="hv-persona-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: "10px", marginBottom: "var(--sp-4)" }}>
            <PersonaCard
              icon="sparkles"
              title="I have a hook"
              desc="Score it in 5 seconds. See the missing patterns. Rewrite stronger in one click."
              href="/analyzer"
              cta="Score it — free"
              primary
            />
            <PersonaCard
              icon="lightbulb"
              title="I have an idea, no hook"
              desc="Drop your topic. Get 8 scored openings across viral formulas — pick the strongest."
              href="/generator"
              cta="Generate 8 hooks"
            />
            <PersonaCard
              icon="flask"
              title="I have a niche, no idea"
              desc="Pick a live trend. Get 3-5 ready angles with scored hooks for your niche."
              href="/trends"
              cta="Discover trends"
            />
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", marginBottom: "var(--sp-6)" }}>
            No signup · 10 free generations/day · Resets at midnight
          </p>

          {/* Mini stats row — product facts, neutral color (DS: one accent) */}
          <div style={{ display: "flex", gap: "var(--sp-6)", flexWrap: "wrap" }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--fd)", fontSize: "var(--text-lg)", fontWeight: 800, color: "var(--text)" }}>{s.n}</div>
                <div className="kicker" style={{ fontSize: ".7rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Phone mockup */}
        <div className="hero-right" style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <PhoneMockup hook={DEMO_HOOKS[demoActive]} />
        </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PROOF — the product doing its job (before/after, animated)
          Honest: no stock photos, just a real weak hook → its rewrite.
      ══════════════════════════════════ */}
      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "var(--sp-9) 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--sp-6)" }}>
            <div className="kicker" style={{ marginBottom: "var(--sp-4)" }}>Proof</div>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-2xl)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "var(--sp-3)" }}>
              Watch a real hook go from 32 to 87
            </h2>
            <p style={{ color: "var(--text-soft)", fontSize: "var(--text-sm)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              One weak opening. The Analyzer names the attention patterns it&apos;s missing and rewrites it — here&apos;s the before and after, scored.
            </p>
          </div>
          <ScoreDemo />
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS — the loop, made explicit
      ══════════════════════════════════ */}
      <section style={{ borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--sp-9) 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--sp-7)" }}>
            <div className="kicker" style={{ marginBottom: "var(--sp-4)" }}>How it works</div>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-2xl)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "var(--sp-3)" }}>
              From idea to a scroll-stopping hook, step by step
            </h2>
            <p style={{ color: "var(--text-soft)", fontSize: "var(--text-sm)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.7 }}>
              Each tool does one job in a loop. You can start anywhere — but here&apos;s the path that turns a blank screen into a hook you&apos;re ready to film.
            </p>
          </div>

          {/* Real product screens on a phone — the 3 "doing" tools made
              concrete (Trends / Generator / Analyzer), no stock imagery. */}
          <div style={{ marginBottom: "var(--sp-7)" }}>
            <PhoneShowcase />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(205px,1fr))", gap: "12px" }}>
            {[
              {
                n: "1", step: "Discover", tool: "Trends", icon: "trending-up" as const, href: "/trends", cta: "Open Trends",
                you: "Pick what's already getting attention in your niche.",
                get: "3 niche-specific content angles + a ready scored hook for each trend.",
              },
              {
                n: "2", step: "Create", tool: "Generator", icon: "zap" as const, href: "/generator", cta: "Generate 8 hooks",
                you: "Drop a topic in, pick a platform.",
                get: "8 openings, each scored 0–100 for retention, with hashtags.",
              },
              {
                n: "3", step: "Diagnose & fix", tool: "Analyzer", icon: "sparkles" as const, href: "/analyzer", cta: "Analyze a hook",
                you: "Paste a hook you already wrote.",
                get: "Score, the “why”, the attention patterns it's missing, and a 1-click rewrite that injects them.",
              },
              {
                n: "4", step: "Learn", tool: "Patterns", icon: "book" as const, href: "/patterns", cta: "See the 9 patterns",
                you: "Read the 9 attention patterns once.",
                get: "The vocabulary behind every score — so you know WHY a hook works, not just whether.",
              },
            ].map((s, i, arr) => (
              <div key={s.n} className="card" style={{ position: "relative", borderRadius: "var(--r-lg)", padding: "var(--sp-5)", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--sp-4)" }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--accent)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 800, fontSize: "var(--text-sm)", flexShrink: 0 }}>{s.n}</span>
                  <div className="kicker">{s.step}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--sp-3)" }}>
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "9px", background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0 }}><Icon name={s.icon} /></span>
                  <span style={{ fontFamily: "var(--fd)", fontSize: "var(--text-lg)", fontWeight: 800 }}>{s.tool}</span>
                </div>
                <div style={{ flex: 1, marginBottom: "var(--sp-4)" }}>
                  <div className="kicker" style={{ fontSize: ".7rem", marginBottom: "4px" }}>You do</div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text-soft)", lineHeight: 1.6, marginBottom: "var(--sp-3)" }}>{s.you}</p>
                  <div className="kicker" style={{ fontSize: ".7rem", color: "var(--success)", marginBottom: "4px" }}>You get</div>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--text)", lineHeight: 1.6 }}>{s.get}</p>
                </div>
                <Link href={s.href} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "var(--text-sm)", color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
                  {s.cta} <Icon name="arrow-right" />
                </Link>
                {i < arr.length - 1 && (
                  <span className="hiw-arrow" style={{ position: "absolute", right: "-14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", zIndex: 2, display: "flex" }}>
                    <Icon name="arrow-right" />
                  </span>
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
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "var(--sp-9) 1.5rem", textAlign: "center" }}>
          <div className="kicker" style={{ marginBottom: "var(--sp-4)" }}>Try it on yours</div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-2xl)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "var(--sp-3)" }}>
            See your hook&apos;s score in 5 seconds
          </h2>
          <p style={{ color: "var(--text-soft)", fontSize: "var(--text-sm)", marginBottom: "var(--sp-6)", lineHeight: 1.7 }}>
            Same scoring as the full Analyzer. Real Claude call, real number, no account.
          </p>
          <HomeAnalyzeWidget />
        </div>
      </section>


      {/* ══════════════════════════════════
          EMAIL CAPTURE
      ══════════════════════════════════ */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto", padding: "var(--sp-9) 1.5rem", textAlign: "center" }}>
          <div className="kicker" style={{ marginBottom: "var(--sp-4)" }}>Weekly hook teardown</div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-2xl)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "var(--sp-3)" }}>
            One viral hook, broken down every week
          </h2>
          <p style={{ color: "var(--text-soft)", fontSize: "var(--text-sm)", marginBottom: "var(--sp-6)", lineHeight: 1.7 }}>
            We pull a hook that actually went viral, score it, and explain the pattern behind it. No spam — unsubscribe anytime.
          </p>
          <EmailCapture source="home-weekly" />
        </div>
      </section>

      {/* ══════════════════════════════════
          FINAL CTA
      ══════════════════════════════════ */}
      <section style={{ textAlign: "center", padding: "var(--sp-9) 1.5rem", borderTop: "1px solid var(--border)" }}>
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-3xl)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "var(--sp-4)", lineHeight: 1.1 }}>
          Stop losing viewers in the first 3 seconds
        </h2>
        <p style={{ color: "var(--text-soft)", fontSize: "var(--text-sm)", margin: "0 auto var(--sp-6)", maxWidth: "360px", lineHeight: 1.7 }}>
          10 free hooks a day, no account. Upgrade to Pro when you need unlimited.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Button href="/analyzer">
            Analyze my hook — free
            <Icon name="arrow-right" />
          </Button>
          <Button href="/generator" variant="secondary">Generate 8 hooks</Button>
        </div>
      </section>

      <style>{`
        .hv-persona { transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease; }
        .hv-persona:hover { border-color: var(--border-strong); border-left-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 24px rgb(16 16 25 / .08); }
        @media (max-width: 700px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-right { display: none !important; }
        }
        @media (max-width: 1040px) {
          .hiw-arrow { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════
// PHONE MOCKUP COMPONENT
// ══════════════════════════════════
function PhoneMockup({ hook }: { hook: typeof DEMO_HOOKS[0] }) {
  const { typed, done } = useTypedText(hook.text);
  return (
    <div style={{ position: "relative", width: "260px" }}>
      {/* Soft accent halo behind the phone — the page's single decorative tint */}
      <div style={{ position: "absolute", inset: "-30px", background: "radial-gradient(ellipse at center, rgba(201,19,75,.12) 0%, transparent 70%)", filter: "blur(20px)", borderRadius: "50%" }} />

      {/* Phone frame */}
      <div style={{
        position: "relative", width: "260px", background: "var(--surface)",
        borderRadius: "36px", border: "2px solid var(--border-strong)",
        boxShadow: "0 24px 60px rgb(16 16 25 / .18)",
        overflow: "hidden",
      }}>
        {/* Notch */}
        <div style={{ background: "var(--bg)", padding: "14px 20px 10px", display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ width: "90px", height: "24px", background: "var(--bg)", borderRadius: "0 0 16px 16px", position: "absolute", top: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--border-strong)" }} />
            <div style={{ width: "40px", height: "6px", borderRadius: "3px", background: "var(--border-strong)" }} />
          </div>
          <div style={{ marginTop: "16px", fontSize: ".7rem", color: "var(--text-muted)", fontFamily: "var(--fd)", fontWeight: 600, letterSpacing: "1px" }}>HOOKVIRAL.AI</div>
        </div>

        {/* Screen content */}
        <div style={{ background: "var(--bg)", padding: "1rem" }}>
          {/* Platform + formula tags */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".875rem" }}>
            <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: ".65rem", background: "var(--surface-3)", color: "var(--text-soft)", fontFamily: "var(--fd)", fontWeight: 700 }}>{hook.platform}</span>
            <span style={{ fontSize: ".65rem", fontFamily: "var(--fd)", fontWeight: 700, padding: "3px 10px", borderRadius: "100px", background: "var(--accent-soft)", color: "var(--accent)" }}>{hook.formula}</span>
          </div>

          {/* Hook text — typed live, like someone writing their opening line */}
          <div style={{ background: "var(--surface)", borderRadius: "14px", padding: "1rem", marginBottom: ".75rem", border: "1px solid var(--border)", minHeight: "80px" }}>
            <p style={{ fontSize: ".85rem", lineHeight: 1.7, color: "var(--text)" }}>
              {typed}
              {!done && <span aria-hidden style={{ display: "inline-block", width: "2px", height: ".9em", background: "var(--accent)", marginLeft: "2px", verticalAlign: "-1px" }} />}
            </p>
          </div>

          {/* Score — lands only after the line is written */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: ".75rem" }}>
            <div style={{ flex: 1, height: "5px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", background: scoreColor(hook.score), width: done ? `${hook.score}%` : "0%", borderRadius: "3px", transition: "width .7s cubic-bezier(.16,1,.3,1)" }} />
            </div>
            <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1rem", color: scoreColor(hook.score), flexShrink: 0, opacity: done ? 1 : .25, transition: "opacity .4s ease" }}>{hook.score}<span style={{ fontSize: ".55rem", color: "var(--text-muted)", fontWeight: 400 }}>/100</span></span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ flex: 1, padding: "8px", background: "var(--accent)", borderRadius: "100px", textAlign: "center", fontSize: ".72rem", color: "var(--on-accent)", fontFamily: "var(--fd)", fontWeight: 700 }}>Copy hook</div>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
              <Icon name="star" />
            </div>
          </div>

          {/* Mini hooks below */}
          <div style={{ marginTop: ".75rem", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[2, 3].map(i => (
              <div key={i} style={{ background: "var(--surface)", borderRadius: "8px", padding: "6px 10px", border: "1px solid var(--border)", opacity: .5 }}>
                <div style={{ height: "6px", background: "var(--border-strong)", borderRadius: "3px", width: `${65 + i * 10}%`, marginBottom: "3px" }} />
                <div style={{ height: "6px", background: "var(--border-strong)", borderRadius: "3px", width: `${40 + i * 8}%` }} />
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div style={{ background: "var(--bg)", padding: "12px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100px", height: "4px", background: "var(--border-strong)", borderRadius: "2px" }} />
        </div>
      </div>
    </div>
  );
}

// Persona-choice card — full-bordered, hoverable, with the CTA built in.
// Each card IS the action for its persona (not a labeled link). Hover states
// live in CSS via the .hv-persona class below (DS §8.8: no useState hover).
function PersonaCard({
  icon, title, desc, href, cta, primary,
}: {
  icon: IconName; title: string; desc: string;
  href: string; cta: string; primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className="hv-persona card"
      style={{
        display: "flex", flexDirection: "column", gap: "10px",
        padding: "var(--sp-4) var(--sp-4)",
        borderRadius: "var(--r-md)",
        borderLeft: "3px solid var(--accent)",
        textDecoration: "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "10px", background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0 }}><Icon name={icon} /></span>
        {/* h2 (not h3) — PersonaCard titles sit directly under the hero h1.
            Lighthouse heading-order rule flags a h1→h3 jump as a11y issue. */}
        <h2 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-sm)", fontWeight: 800, color: "var(--text)", margin: 0 }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--text-soft)", lineHeight: 1.55, margin: 0 }}>
        {desc}
      </p>
      <span className={`btn btn-${primary ? "primary" : "secondary"} btn-sm`} style={{ marginTop: "4px", alignSelf: "flex-start" }}>
        {cta}
        <Icon name="arrow-right" />
      </span>
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="card" style={{ borderRadius: "var(--r-lg)", padding: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          value={hook}
          onChange={e => setHook(e.target.value.slice(0, 300))}
          placeholder="Paste a hook you'd post on TikTok / Reels / Shorts…"
          rows={2}
          aria-label="Hook to score"
          style={{ width: "100%", background: "transparent", border: "none", color: "var(--text)", fontSize: "var(--text-base)", fontFamily: "var(--fb)", resize: "none", lineHeight: 1.6, caretColor: "var(--accent)" }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => score("My morning routine")}
            disabled={loading}
            style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--fb)", padding: 0, textDecoration: "underline" }}
          >
            Try: &ldquo;My morning routine&rdquo;
          </button>
          <Button onClick={() => score()} disabled={loading || !hook.trim()} size="sm">
            {loading ? <><Spinner size={14} />Scoring…</> : <>Score this hook</>}
          </Button>
        </div>
      </div>

      {error && (
        <div style={{ background: "var(--danger-soft)", border: "1px solid var(--danger)", color: "var(--danger)", borderRadius: "var(--r-md)", padding: ".85rem 1.1rem", fontSize: "var(--text-sm)" }}>
          {error}
        </div>
      )}

      {result && (
        <div className="card" style={{ borderRadius: "var(--r-lg)", padding: "var(--sp-5)", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left", animation: "cardIn .4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            <ScoreRing score={result.score} size={96} />
            <div style={{ flex: 1, minWidth: "200px" }}>
              <div className="kicker" style={{ fontSize: ".7rem", marginBottom: "6px" }}>Retention score</div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--text-soft)", lineHeight: 1.7 }}>{result.why}</p>
            </div>
          </div>

          {result.missing.length > 0 && (
            <div>
              <div className="kicker" style={{ fontSize: ".7rem", color: "var(--warning)", marginBottom: ".5rem" }}>Missing — biggest levers</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {result.missing.map(p => (
                  <Link key={p} href={patternHref(p)} style={{ fontSize: "var(--text-xs)", padding: "3px 10px", borderRadius: "var(--r-pill)", background: "var(--warning-soft)", color: "var(--warning)", border: "1px solid var(--warning)", textDecoration: "none" }}>
                    {p}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: ".5rem", borderTop: "1px solid var(--border)" }}>
            <Button href={`/analyzer?hook=${encodeURIComponent(hook)}`} size="sm" style={{ flex: 1, minWidth: "200px" }}>
              See the full analysis &amp; 1-click rewrite
              <Icon name="arrow-right" />
            </Button>
            <Button onClick={() => { setHook(""); setResult(null); }} variant="secondary" size="sm">
              Try another
            </Button>
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
      <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 24px", borderRadius: "var(--r-pill)", background: "var(--success-soft)", border: "1px solid var(--success)", color: "var(--success)", fontSize: "var(--text-sm)", fontFamily: "var(--fb)" }}>
        <Icon name="check" /> You&apos;re in. Check your inbox.
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
          aria-label="Email address"
          style={{ flex: 1, minWidth: "200px", padding: "12px 18px", borderRadius: "var(--r-pill)", border: "1px solid var(--border-strong)", background: "var(--bg)", color: "var(--text)", fontSize: "var(--text-sm)", fontFamily: "var(--fb)", caretColor: "var(--accent)" }}
        />
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? <Spinner size={14} /> : "Get it"}
        </Button>
      </form>
      {state === "error" && (
        <div style={{ marginTop: ".75rem", fontSize: "var(--text-xs)", color: "var(--danger)" }}>{msg}</div>
      )}
    </div>
  );
}
