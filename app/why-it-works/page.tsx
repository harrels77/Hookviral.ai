import type { Metadata } from "next";
import Link from "next/link";
import { NextStep } from "@/components/NextStep";

export const metadata: Metadata = {
  title: "Start Here — How HookViral Works in 60 Seconds",
  description:
    "What each HookViral tool does, when to use it, and why it works. Plain language, no methodology paper.",
  alternates: { canonical: "/why-it-works" },
  openGraph: {
    title: "Start Here — How HookViral Works",
    description: "What each tool does + when to use it + why it works. In 60 seconds.",
  },
};

interface Tool {
  step: string;
  name: string;
  href: string;
  cta: string;
  does: string;
  when: string;
  why: string;
}

const TOOLS: Tool[] = [
  {
    step: "1",
    name: "Trends",
    href: "/trends",
    cta: "Open Trends",
    does: "Shows what's getting attention right now, decoded into 3 ready angles for your niche.",
    when: "You don't know what to post about — start here.",
    why: "A raw trending term isn't content. Three niche-framed angles bridge the gap from \"that's hot\" to \"I can film this today.\"",
  },
  {
    step: "2",
    name: "Generator",
    href: "/generator",
    cta: "Open Generator",
    does: "Turns a topic into 8 scored openings (0–100 retention) with hashtags.",
    when: "You have an idea but no hook yet.",
    why: "Eight options sweep different viral formulas in one shot — you pick the strongest instead of betting on a single try.",
  },
  {
    step: "3",
    name: "Analyzer",
    href: "/analyzer",
    cta: "Open Analyzer",
    does: "Scores any hook you already wrote, names the attention patterns it's missing, and rewrites it stronger in one click.",
    when: "You have a hook and want to know if it'll land — or how to fix it.",
    why: "The first 3 seconds decide whether the rest of your video gets seen. We score that exact moment against patterns proven to hold attention.",
  },
  {
    step: "4",
    name: "Patterns",
    href: "/patterns",
    cta: "Open Patterns",
    does: "The 9 attention patterns every score is built on, with example + how to apply each.",
    when: "You want to learn why a hook works, not just whether.",
    why: "Once you know the vocabulary, you stop guessing — the same patterns drive scores in the Analyzer, the Generator, and Trends decoding.",
  },
];

export default function StartHere() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "3rem 1.5rem 4rem" }}>

        {/* Hero */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ fontSize: ".7rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--electric)", fontFamily: "var(--fd)", fontWeight: 600, marginBottom: ".75rem" }}>
            Start here
          </div>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem,5vw,2.6rem)", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: "1rem" }}>
            How HookViral works <span className="gradient-text">in 60 seconds</span>.
          </h1>
          <p style={{ color: "var(--soft)", fontSize: "1.05rem", lineHeight: 1.75, fontWeight: 300 }}>
            Four small tools, one job: <strong style={{ color: "var(--text)", fontWeight: 500 }}>repair the first 3 seconds of your short-form videos.</strong> Pick the one that fits where you are right now — they all connect, but each one works on its own.
          </p>
        </div>

        {/* Tools */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "3rem" }}>
          {TOOLS.map(t => (
            <div key={t.name} style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "var(--r3)", padding: "1.5rem 1.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <span style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".8rem", flexShrink: 0 }}>{t.step}</span>
                <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-.5px" }}>{t.name}</h2>
              </div>

              <Row label="What it does" body={t.does} color="var(--text)" />
              <Row label="When to use it" body={t.when} color="var(--soft)" />
              <Row label="Why it works" body={t.why} color="var(--soft)" />

              <Link href={t.href} style={{ display: "inline-flex", alignItems: "center", marginTop: "1rem", fontSize: ".85rem", color: "var(--electric)", textDecoration: "none", fontFamily: "var(--fb)", fontWeight: 500 }}>
                {t.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Quick start */}
        <div style={{ background: "var(--s1)", border: "1px solid rgba(0,255,178,.2)", borderRadius: "var(--r3)", padding: "1.5rem 1.75rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: ".68rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--neon)", fontFamily: "var(--fd)", fontWeight: 700, marginBottom: ".75rem" }}>
            ⚡ Not sure where to start
          </div>
          <p style={{ fontSize: ".95rem", color: "var(--soft)", lineHeight: 1.75, marginBottom: "1rem" }}>
            Have a hook in your head? Paste it in the <Link href="/analyzer" style={{ color: "var(--electric)", textDecoration: "none" }}>Analyzer</Link> — you&apos;ll see it score, see why, and you can fix it in one click. That single loop is the heart of the product. The rest is for when you want to go wider.
          </p>
          <Link href="/analyzer" style={{ display: "inline-block", padding: "11px 24px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".9rem", fontWeight: 600, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Try the Analyzer — free →
          </Link>
        </div>
      </div>

      <NextStep />
    </div>
  );
}

function Row({ label, body, color }: { label: string; body: string; color: string }) {
  return (
    <div style={{ marginBottom: ".75rem", display: "flex", gap: "10px", alignItems: "baseline" }}>
      <span style={{ fontSize: ".58rem", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", letterSpacing: "1.5px", textTransform: "uppercase", flexShrink: 0, width: "98px", marginTop: "3px" }}>
        {label}
      </span>
      <span style={{ flex: 1, fontSize: ".92rem", color, lineHeight: 1.65, fontWeight: 300 }}>{body}</span>
    </div>
  );
}
