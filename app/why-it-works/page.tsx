import type { Metadata } from "next";
import Link from "next/link";
import { HOOK_PATTERNS } from "@/lib/patterns";
import { NextStep } from "@/components/NextStep";

export const metadata: Metadata = {
  title: "How HookViral Actually Scores Your Hook — Methodology & Limits",
  description:
    "Why HookViral isn't just an AI guessing a number. The 9 attention patterns, the 3-second math, what the score really means — and what we honestly don't claim.",
  alternates: { canonical: "/why-it-works" },
  openGraph: {
    title: "How HookViral Actually Scores Your Hook",
    description:
      "The methodology, the science, and the honest constraints behind every score.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How HookViral Actually Scores Your Hook",
  description:
    "The methodology behind HookViral's retention score: the 9 attention patterns, the 3-second window, and what we honestly don't claim.",
  author: { "@type": "Organization", name: "HookViral" },
  publisher: { "@type": "Organization", name: "HookViral AI" },
  datePublished: "2026-05-19",
};

export default function WhyItWorksPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ maxWidth: "740px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>

        {/* Hero */}
        <div style={{ marginBottom: "2.5rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: ".7rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--electric)", fontFamily: "var(--fd)", fontWeight: 600, marginBottom: ".75rem" }}>
            Methodology
          </div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,2.8rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: "1rem" }}>
            How HookViral <span className="gradient-text">actually scores</span> your hook.
          </h1>
          <p style={{ color: "var(--soft)", fontSize: "1.05rem", lineHeight: 1.75, fontWeight: 300 }}>
            A scroll-stopping opening isn&apos;t a coin flip. There&apos;s a small number of structural properties that consistently make viewers stay past the first 3 seconds — and they&apos;re learnable. Here&apos;s how we measure them, why the score is more than &ldquo;an AI guessing a number,&rdquo; and exactly what we don&apos;t claim.
          </p>
        </div>

        <Article>

          <H2>Why &ldquo;paste a hook, get a number&rdquo; isn&apos;t enough</H2>
          <P>
            Most AI scoring tools spit out a number with no rationale. That&apos;s not useful. A score you can&apos;t reason about doesn&apos;t teach you anything for the next hook you write. So we built scoring around an <Strong>explainable</Strong> model: every score points to specific patterns the hook uses or misses. You don&apos;t just get told it&apos;s a 72 — you get told <Em>which lever to pull to make it an 84</Em>.
          </P>
          <P>
            That single shift — from opaque rating to grounded diagnosis — is the difference between a tool that ranks your work and a tool that improves your craft.
          </P>

          <H2>What the score is actually built on</H2>
          <P>Every retention score the Analyzer returns is a synthesis of three honest sub-scores:</P>
          <Ul items={[
            <><Strong>Curiosity</Strong> (0–10) — does the line open a loop the viewer must close?</>,
            <><Strong>Emotion</Strong> (0–10) — does it trigger a real feeling (fear, desire, surprise, validation)?</>,
            <><Strong>Clarity</Strong> (0–10) — is it instantly understandable, with no fluff before the payload?</>,
          ]} />
          <P>
            On top of that, the hook is mapped against <Strong>{HOOK_PATTERNS.length} owned attention patterns</Strong> — a curated taxonomy of structural devices that hold the first 3 seconds. Each one is grounded in viewer psychology:
          </P>
          <Ul items={[
            <><Em>Open loops</Em> create a cognitive itch the brain resists leaving unresolved.</>,
            <><Em>Loss and danger</Em> are processed faster than gain — a warning gets attention before the viewer decides to.</>,
            <><Em>Concrete numbers</Em> read as true and earned, not generic — and a precise figure is itself a curiosity trigger (&ldquo;why 47?&rdquo;).</>,
            <><Em>Pattern interrupts</Em> break the swipe rhythm the feed has trained.</>,
          ]} />
          <P>
            The scale is calibrated honestly: <Strong>95+</Strong> stops 9/10 scrollers, <Strong>80–89</Strong> is decent but a sharper version exists, <Strong>below 60</Strong> gets scrolled past. We deliberately don&apos;t inflate. A mediocre line scores in the 70s.
          </P>
          <P>
            <Link href="/patterns" style={{ color: "var(--electric)", textDecoration: "none" }}>
              See the full taxonomy of {HOOK_PATTERNS.length} patterns →
            </Link>
          </P>

          <H2>Why the first 3 seconds matter (the math)</H2>
          <P>
            Short-form platforms don&apos;t show your video to many people if early retention is weak. The first signal they read is whether viewers stay past the opening seconds. A video with strong watch time at 3s gets pushed to more feeds; one with a swipe in the first 2s gets buried.
          </P>
          <P>
            So the hook isn&apos;t a creative flourish — it&apos;s the <Strong>single edit with the highest leverage</Strong> on whether the rest of your video is ever seen. That&apos;s why we score the opening and only the opening: it&apos;s the moment where the math actually breaks for most creators.
          </P>

          <H2>Why this isn&apos;t just generic AI</H2>
          <P>
            A plain AI asked to &ldquo;score this hook&rdquo; will invent its own taxonomy on every call. That&apos;s how you get inconsistent, vague feedback — &ldquo;catchy&rdquo;, &ldquo;intriguing&rdquo;, &ldquo;could be stronger&rdquo;. We avoid that two ways:
          </P>
          <Ul items={[
            <>The model is constrained to <Strong>our owned vocabulary</Strong> of {HOOK_PATTERNS.length} patterns. Server-side, we drop any pattern name the model tries to invent outside the taxonomy.</>,
            <>The <Strong>same vocabulary runs through the whole product</Strong>. When the Analyzer says you&apos;re missing &ldquo;Open Loop,&rdquo; the rewrite engine knows exactly what to inject, the Patterns page explains exactly that pattern, and the Generator builds against the same definitions.</>,
          ]} />
          <P>
            One language, end to end. That&apos;s the difference between a chatbot that opines and a system that compounds.
          </P>

          <H2>A concrete walkthrough — 12 to 84 in one click</H2>
          <P>Take a hook a real creator might write: <Em>&ldquo;My morning routine.&rdquo;</Em></P>
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.5rem 1.6rem", margin: "1.5rem 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <Row label="Analyzer score" value={<span style={{ color: "var(--hot)", fontFamily: "var(--fd)", fontWeight: 800 }}>12 / 100</span>} />
            <Row label="Sub-scores" value={<span>Curiosity <strong>1</strong> · Emotion <strong>0</strong> · Clarity <strong>4</strong></span>} />
            <Row label="Formula detected" value={<span style={{ color: "var(--muted)" }}>None</span>} />
            <Row label="Missing patterns" value={
              <span>
                <PatternChip name="Open Loop" />{" "}
                <PatternChip name="Concrete Specificity" />{" "}
                <PatternChip name="Stakes" />
              </span>
            } />
          </div>
          <P>Click <Strong>＋ Open Loop</Strong>. The rewrite engine takes that exact pattern definition from the corpus — &ldquo;raise a question the viewer must stay to resolve; end on tension, not summary&rdquo; — and applies it to the same topic.</P>
          <div style={{ background: "var(--s1)", border: "1px solid rgba(0,255,178,.25)", borderRadius: "var(--r3)", padding: "1.5rem 1.6rem", margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            <p style={{ flex: 1, minWidth: "220px", color: "var(--text)", fontSize: "1rem", lineHeight: 1.6 }}>
              &ldquo;⏰ I changed one thing in my morning and haven&apos;t been the same since.&rdquo;
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.8rem", color: "var(--neon)", letterSpacing: "-1px", lineHeight: 1 }}>84</span>
              <span style={{ fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", marginTop: "4px" }}>+72 ▲</span>
            </div>
          </div>
          <P>
            The hook is now a real Open Loop: &ldquo;one thing&rdquo; without saying what; &ldquo;haven&apos;t been the same since&rdquo; without saying how. <Strong>Same topic. Same AI model. Different score, because the structure changed.</Strong> That&apos;s what the system is for.
          </P>

          <H2>What we don&apos;t claim</H2>
          <P>Honesty matters more than marketing, so here&apos;s the line:</P>
          <Ul items={[
            <><Strong>We don&apos;t measure your actual video retention.</Strong> No platform — TikTok, Instagram, YouTube — exposes per-video retention data freely or at any reasonable cost for a tool. The score reflects the <Em>structural likelihood</Em> a hook stops the scroll, based on craft and viewer psychology. It&apos;s a craft tool, not an analytics tool.</>,
            <><Strong>We don&apos;t predict virality.</Strong> A viral video has ~50 variables: production, audio, edit, posting time, your audience history, platform luck. We help the first 3 seconds. It&apos;s the highest-leverage moment, but it&apos;s not the whole game.</>,
            <><Strong>Same AI quality on Free and Pro.</Strong> Pro removes the daily cap and unlocks production briefs. It does <Em>not</Em> give you a smarter scorer — that would be a lie and we don&apos;t run it. Volume and workflow are the lever, never quality.</>,
          ]} />

          <H2>Where to start</H2>
          <P>
            If you already have a hook in your head, paste it in the <Link href="/analyzer" style={{ color: "var(--electric)", textDecoration: "none" }}>Analyzer</Link>. If you don&apos;t, start in <Link href="/trends" style={{ color: "var(--electric)", textDecoration: "none" }}>Trends</Link> — a niche-relevant idea will be there, already decoded into angles you can build on.
          </P>
          <P>
            Either way, the loop is the same. The vocabulary you&apos;ll learn in <Link href="/patterns" style={{ color: "var(--electric)", textDecoration: "none" }}>Patterns</Link> compounds on every hook you write after.
          </P>

        </Article>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginTop: "3rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/analyzer" style={{ padding: "13px 26px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Analyze a hook — free →
          </Link>
          <Link href="/patterns" style={{ padding: "13px 26px", borderRadius: "100px", border: "1px solid var(--border2)", color: "var(--soft)", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            See the patterns
          </Link>
        </div>
      </div>

      <NextStep />
    </div>
  );
}

// ── Article primitives — tight typography for long-form on the dark palette ──

function Article({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>{children}</div>;
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.2, marginTop: "2rem", marginBottom: ".25rem", color: "var(--text)" }}>
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: ".975rem", lineHeight: 1.85, color: "var(--soft)", fontWeight: 300 }}>
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "var(--text)", fontWeight: 500 }}>{children}</strong>;
}

function Em({ children }: { children: React.ReactNode }) {
  return <em style={{ color: "var(--text)", fontStyle: "italic" }}>{children}</em>;
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: ".25rem 0", display: "flex", flexDirection: "column", gap: ".7rem" }}>
      {items.map((it, i) => (
        <li key={i} style={{ display: "flex", gap: "12px", fontSize: ".95rem", lineHeight: 1.75, color: "var(--soft)", fontWeight: 300 }}>
          <span style={{ color: "var(--electric)", flexShrink: 0, marginTop: "2px" }}>—</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", fontSize: ".88rem", flexWrap: "wrap" }}>
      <span style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 600 }}>
        {label}
      </span>
      <span style={{ color: "var(--soft)" }}>{value}</span>
    </div>
  );
}

function PatternChip({ name }: { name: string }) {
  const p = HOOK_PATTERNS.find(x => x.name === name);
  const href = p ? `/patterns#${p.id}` : "/patterns";
  return (
    <Link href={href} style={{ fontSize: ".75rem", padding: "3px 9px", borderRadius: "100px", background: "rgba(255,184,0,.07)", color: "var(--gold)", border: "1px solid rgba(255,184,0,.25)", textDecoration: "none" }}>
      {name}
    </Link>
  );
}
