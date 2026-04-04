"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const proPrice = annual ? 9 : 12;

  const faqs = [
    ["Can I cancel anytime?", "Yes. No contracts, no friction. Cancel from your account in one click. You keep Pro access until the end of your billing period."],
    ["Are hooks AI-generated or template-based?", "Both. Our engine combines 8 proven viral formulas with Claude AI to generate unique hooks tuned to your content, platform, and tone. Better than pure templates, more reliable than raw AI."],
    ["How many hooks can I generate for free?", "10 generations per day, resetting at midnight. Each generation produces 8 hooks — that's 80 hooks/day for free. Pro is completely unlimited."],
    ["Does it work in French?", "Yes. Write your description in French and hooks are generated in French. Language is auto-detected from your input."],
    ["What happens to my history on the free plan?", "Your history is saved locally in your browser. On Pro, it's unlimited and persistent."],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2.2rem,6vw,3.5rem)", fontWeight: 800, letterSpacing: "-2px", marginBottom: ".75rem", lineHeight: 1.05 }}>
            One plan.<br />
            <span className="gradient-text">Everything unlocked.</span>
          </h1>
          <p style={{ color: "var(--soft)", fontSize: "1rem", fontWeight: 300, maxWidth: "380px", margin: "0 auto" }}>
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
              <span style={{ background: "rgba(0,255,178,.1)", color: "var(--neon)", border: "1px solid rgba(0,255,178,.2)", padding: "2px 8px", borderRadius: "100px", fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700 }}>
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "16px", marginBottom: "4rem" }}>

          {/* FREE */}
          <PCard>
            <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", marginBottom: "1.25rem" }}>Free</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>$0</div>
            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "2rem", fontWeight: 300 }}>forever, no card needed</div>
            <Divider />
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".65rem", marginBottom: "2rem" }}>
              {["10 hooks / day", "5 platforms", "8 viral formulas", "Virality score", "Hashtag generator", "Copy & export"].map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: ".875rem", color: "var(--soft)", fontWeight: 300 }}>
                  <span style={{ color: "var(--neon)", fontSize: ".8rem", flexShrink: 0 }}>✓</span>{f}
                </li>
              ))}
              {["Unlimited generations", "Script generator", "Advanced analysis", "Priority support"].map(f => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: ".875rem", color: "var(--muted)", fontWeight: 300, opacity: .4 }}>
                  <span style={{ flexShrink: 0 }}>–</span>{f}
                </li>
              ))}
            </ul>
            <FreeBtn />
          </PCard>

          {/* PRO */}
          {/* ★ Most Popular badge only shows when annual=true (plan at $9) ★ */}
          <PCard featured>
            {annual && (
              <div style={{
                position: "absolute", top: "-1px", right: "1.5rem",
                background: "linear-gradient(135deg,var(--hot),var(--electric))",
                color: "#fff", fontSize: ".62rem", fontFamily: "var(--fd)",
                fontWeight: 700, letterSpacing: "2px", padding: "4px 14px",
                borderRadius: "0 0 10px 10px",
                boxShadow: "0 4px 16px rgba(255,45,107,.3)",
              }}>
                MOST POPULAR
              </div>
            )}

            <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--hot)", marginBottom: "1.25rem" }}>Pro</div>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", marginBottom: ".25rem" }}>
              <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1 }}>${proPrice}</div>
              <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: ".5rem", fontWeight: 300 }}>/mo</div>
            </div>

            {annual && (
              <div style={{ fontSize: ".75rem", color: "var(--neon)", marginBottom: ".25rem" }}>
                Billed ${proPrice * 12}/year — save $36
              </div>
            )}

            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "2rem", fontWeight: 300 }}>
              {annual ? "billed annually" : "billed monthly, cancel anytime"}
            </div>

            <Divider />

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".65rem", marginBottom: "2rem" }}>
              {[
                "Unlimited hooks — no daily limit",
                "5 platforms",
                "8 viral formulas",
                "Advanced AI virality score",
                "Score breakdown (Curiosity, Emotion, Clarity)",
                "Hashtag optimizer",
                "Script generator (Hook + Bridge + CTA)",
                "Unlimited history & favorites",
                "Export .txt / Notion",
                "Regenerate in 1 click",
                "Priority support",
              ].map(f => (
                <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: ".875rem", color: "var(--soft)", fontWeight: 300 }}>
                  <span style={{ color: "var(--neon)", fontSize: ".8rem", flexShrink: 0, marginTop: "2px" }}>✓</span>{f}
                </li>
              ))}
            </ul>

            <ProBtn />
          </PCard>

        </div>

        {/* Trust note */}
        <div style={{ textAlign: "center", padding: "1.75rem", background: "var(--s1)", borderRadius: "var(--r2)", border: "1px solid var(--border)", marginBottom: "4rem" }}>
          <p style={{ fontSize: ".875rem", color: "var(--soft)", fontWeight: 300, lineHeight: 1.7 }}>
            Same AI quality on both plans. Pro unlocks{" "}
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>volume and advanced features</strong>
            {" "}— not better hooks.{" "}
            <Link href="/generator" style={{ color: "var(--electric)", textDecoration: "none" }}>Try free first →</Link>
          </p>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "1.75rem", textAlign: "center" }}>
            Frequently asked
          </h2>
          {faqs.map(([q, a], i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".9rem", fontWeight: 500, gap: "1rem", color: "var(--text)" }}>
                <span>{q}</span>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", color: openFaq === i ? "#fff" : "var(--muted)", background: openFaq === i ? "var(--electric)" : "transparent", transition: "all .25s", flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none" }}>
                  +
                </div>
              </div>
              {openFaq === i && (
                <div style={{ fontSize: ".875rem", color: "var(--soft)", marginTop: ".875rem", lineHeight: 1.8, fontWeight: 300 }}>{a}</div>
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
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: featured ? "linear-gradient(180deg,rgba(255,45,107,.05) 0%,var(--s1) 50%)" : "var(--s1)",
      border: `1px solid ${featured ? "rgba(255,45,107,.45)" : hov ? "rgba(108,58,255,.3)" : "var(--border)"}`,
      borderRadius: "24px", padding: "2rem", position: "relative",
      transition: "all .3s cubic-bezier(.16,1,.3,1)",
      transform: hov ? "translateY(-4px)" : "none",
      boxShadow: hov ? "0 20px 50px rgba(108,58,255,.1)" : featured ? "0 0 40px rgba(255,45,107,.07)" : "none",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />;
}

function FreeBtn() {
  const [hov, setHov] = useState(false);
  return (
    <Link href="/generator"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: "100px", background: hov ? "var(--s2)" : "var(--s3)", color: hov ? "var(--text)" : "var(--soft)", border: `1px solid ${hov ? "rgba(108,58,255,.4)" : "var(--border2)"}`, fontSize: ".9rem", textDecoration: "none", fontFamily: "var(--fb)", transition: "all .25s", transform: hov ? "translateY(-2px)" : "none" }}>
      Start Free
    </Link>
  );
}

function ProBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => alert("Connect your Stripe keys to activate!")}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ width: "100%", padding: "14px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--fb)", transition: "all .3s", transform: hov ? "translateY(-2px)" : "none", boxShadow: hov ? "0 16px 40px rgba(255,45,107,.45)" : "0 6px 20px rgba(255,45,107,.25)" }}>
      Get Pro — Unlimited Access →
    </button>
  );
}