"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/lib/icons";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const proPrice = annual ? 9 : 12;

  const faqs = [
    ["What do I actually get?", "More than a generator. You get the Hook Analyzer (retention score + the attention patterns your hook uses or misses), a one-click Rewrite engine, the generator (8 scored hooks per idea), and live Trends. It's a system for the first 3 seconds, not a text spitter."],
    ["How is this different from ChatGPT or vidIQ?", "ChatGPT writes generic text with no platform logic. vidIQ optimizes long-form YouTube. HookViral is the specialist for the opening seconds of short-form (TikTok / Reels / Shorts) — it scores retention and names why a hook works."],
    ["Is the free plan actually usable?", "Yes. 10 generations/day (8 hooks each = 80 hooks/day), the Analyzer, Patterns and Trends — free, no account, reset at midnight. Pro removes the daily limit."],
    ["Can I cancel anytime?", "Yes. No contracts. Cancel in one click; you keep Pro until the end of your billing period."],
    ["Does it work for faceless channels and in French?", "Both. Faceless / narration channels are a core focus, with niche-specific patterns. Write in French and everything (hooks, analysis, rewrites) comes back in French — language is auto-detected."],
    ["What happens to my history?", "It's saved locally in your browser, free. No account needed for it to work."],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-3xl)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: ".75rem", lineHeight: 1.1 }}>
            One plan that unlocks everything
          </h1>
          <p style={{ color: "var(--text-soft)", fontSize: "var(--text-base)", maxWidth: "380px", margin: "0 auto" }}>
            Start free. Upgrade to Pro when you need unlimited.
          </p>
        </div>

        {/* Billing toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", padding: "5px", background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "100px" }}>
            <button onClick={() => setAnnual(false)}
              style={{ padding: "8px 22px", borderRadius: "100px", border: "none", background: !annual ? "var(--s3)" : "transparent", color: !annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              style={{ padding: "8px 22px", borderRadius: "100px", border: "none", background: annual ? "var(--s3)" : "transparent", color: annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)", display: "flex", alignItems: "center", gap: "8px", transition: "all .2s" }}>
              Annual
              <span style={{ background: "var(--success-soft)", color: "var(--success)", padding: "2px 8px", borderRadius: "var(--r-pill)", fontSize: "var(--text-xs)", fontFamily: "var(--fd)", fontWeight: 700 }}>
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "4rem" }}>

          {/* FREE */}
          <PCard>
            <div className="kicker" style={{ marginBottom: "1.25rem" }}>Free</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>$0</div>
            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "2rem", fontWeight: 300 }}>forever, no card needed</div>
            <Divider />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".65rem", marginBottom: "2rem" }}>
              {[
                "10 hook generations / day",
                "Full Analyzer — score, patterns, 1 rewrite",
                "Live Trends + 3 decodes / day",
                "Patterns library, history, hashtags",
                "No account, no card",
              ].map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "var(--text-sm)", color: "var(--text-soft)" }}>
                  <Icon name="check" style={{ color: "var(--success)" }} />{f}
                </li>
              ))}
            </ul>
            <FreeBtn />
          </PCard>

          {/* PRO */}
          <PCard featured>
            <div className="kicker" style={{ color: "var(--accent)", marginBottom: "1.25rem" }}>Pro</div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", marginBottom: ".25rem" }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1 }}>${proPrice}</div>
              <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: ".5rem", fontWeight: 300 }}>/mo</div>
            </div>

            {annual && (
              <div style={{ fontSize: "var(--text-xs)", color: "var(--success)", marginBottom: ".25rem" }}>
                Billed ${proPrice * 12}/year — save $36
              </div>
            )}

            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "2rem", fontWeight: 300 }}>
              {annual ? "billed annually" : "billed monthly, cancel anytime"}
            </div>

            <Divider />

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".65rem", marginBottom: "2rem" }}>
              {[
                "Unlimited hook generations",
                "Full rewrite engine — 5 styles × 3 variants",
                "Unlimited trend decodes",
                "Script generator + faceless production brief",
                "Priority support",
              ].map(f => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "var(--text-sm)", color: "var(--text-soft)" }}>
                  <Icon name="check" style={{ color: "var(--success)", marginTop: "2px" }} />{f}
                </li>
              ))}
            </ul>

            <ProBtn />
          </PCard>

        </div>

        {/* Trust note */}
        <div style={{ textAlign: "center", padding: "1.75rem", background: "var(--s1)", borderRadius: "var(--r2)", border: "1px solid var(--border)", marginBottom: "4rem" }}>
          <p style={{ fontSize: ".875rem", color: "var(--soft)", fontWeight: 300, lineHeight: 1.7 }}>
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>Same AI on both plans. Pro = unlimited.</strong>{" "}
            <Link href="/generator" style={{ color: "var(--accent)", textDecoration: "none" }}>Try free first</Link>
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "1.75rem", textAlign: "center" }}>
            Frequently asked questions
          </h2>
          {faqs.map(([q, a], i) => (
            <div key={i} style={{ borderTop: "1px solid var(--border)" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "1.25rem 0", background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text)", fontFamily: "var(--fb)", textAlign: "left" }}
              >
                <span>{q}</span>
                <span style={{ display: "flex", color: "var(--text-muted)", transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .2s ease" }}>
                  <Icon name="chevron-down" size={20} />
                </span>
              </button>
              {openFaq === i && (
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-soft)", paddingBottom: "1.25rem", lineHeight: 1.8 }}>{a}</div>
              )}
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        {/* Footer links */}
        <div style={{ textAlign: "center", marginTop: "3rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          {[["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"], ["Generator", "/generator"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: ".78rem", color: "var(--muted)", textDecoration: "none" }}>{label}</Link>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ──

function PCard({ children, featured }: { children: React.ReactNode; featured?: boolean }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: `1px solid ${featured ? "var(--accent)" : "var(--border)"}`,
      borderRadius: "var(--r-lg)", padding: "2rem", position: "relative",
      boxShadow: featured ? "0 8px 24px rgb(16 16 25 / .08)" : "none",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />;
}

function FreeBtn() {
  return (
    <Link href="/generator" className="btn btn-secondary btn-md btn-block">
      Start free
    </Link>
  );
}

function ProBtn() {
  // Stripe wiring is deferred — the click behavior is intentionally untouched.
  return (
    <button
      onClick={() => alert("Connect your Stripe keys to activate!")}
      className="btn btn-primary btn-md btn-block">
      Get Pro — unlimited access
    </button>
  );
}