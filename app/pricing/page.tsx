"use client";

import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const proPrice = annual ? 9 : 12;
  const agencyPrice = annual ? 37 : 49;

  const faqs = [
    ["Can I cancel anytime?", "Yes. No contracts. Cancel in one click. You keep Pro access until end of billing period."],
    ["Are hooks AI-generated or template-based?", "Both. Our hybrid engine combines 8 proven viral formulas with Claude AI to generate unique hooks for your content and platform."],
    ["How many hooks can I generate for free?", "10 generations per day, resetting at midnight. Each generation produces 8 hooks — that's 80 hooks/day free. Pro is unlimited."],
    ["Does it work in French?", "Yes. Write your description in French and hooks are generated in French. Language is auto-detected."],
    ["What's in the Agency plan?", "Multi-client workspace, bulk generation of 50 hooks, REST API access, white-labeling, CSV/JSON export, and priority support."],
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 1.5rem 6rem", textAlign: "center" }}>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2.5rem,6vw,4rem)", fontWeight: 800, letterSpacing: "-3px", marginBottom: "1rem", lineHeight: 1 }}>
          Simple pricing.<br /><span className="gradient-text">Serious results.</span>
        </h1>
        <p style={{ color: "var(--soft)", fontSize: "1rem", marginBottom: "3rem", fontWeight: 300 }}>
          Start free. Upgrade when your content demands it.
        </p>

        {/* Billing toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "3rem", padding: "6px", background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "100px" }}>
          <button onClick={() => setAnnual(false)} style={{ padding: "8px 24px", borderRadius: "100px", border: "none", background: !annual ? "var(--s3)" : "transparent", color: !annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)" }}>Monthly</button>
          <button onClick={() => setAnnual(true)} style={{ padding: "8px 24px", borderRadius: "100px", border: "none", background: annual ? "var(--s3)" : "transparent", color: annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)", display: "flex", alignItems: "center", gap: "8px" }}>
            Annual
            <span style={{ background: "rgba(0,255,178,.1)", color: "var(--neon)", border: "1px solid rgba(0,255,178,.2)", padding: "2px 8px", borderRadius: "100px", fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700 }}>Save 25%</span>
          </button>
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", textAlign: "left", marginBottom: "5rem" }}>

          {/* Free */}
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "24px", padding: "2rem" }}>
            <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--muted)", marginBottom: "1.25rem" }}>Free</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>$0</div>
            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "1.75rem", fontWeight: 300 }}>forever free</div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />
            {["10 generations / day", "5 platforms", "8 viral formulas", "Basic virality score", "1-click copy"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--soft)", fontWeight: 300 }}>
                <span style={{ color: "var(--neon)", fontSize: ".8rem" }}>✓</span>{f}
              </div>
            ))}
            {["Unlimited history", "Export .txt", "Advanced AI score"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--muted)", fontWeight: 300, opacity: .5 }}>
                <span>–</span>{f}
              </div>
            ))}
            <div style={{ marginTop: "2rem" }}>
              <Link href="/generator" style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: "100px", background: "var(--s3)", color: "var(--soft)", border: "1px solid var(--border2)", fontSize: ".9rem", textDecoration: "none", fontFamily: "var(--fb)" }}>Start Free</Link>
            </div>
          </div>

          {/* Pro */}
          <div style={{ background: "linear-gradient(180deg,rgba(255,45,107,.04) 0%,var(--s1) 40%)", border: "1px solid rgba(255,45,107,.4)", borderRadius: "24px", padding: "2rem", position: "relative" }}>
            <div style={{ position: "absolute", top: "-1px", right: "2rem", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".65rem", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "2px", padding: "5px 14px", borderRadius: "0 0 12px 12px" }}>MOST POPULAR</div>
            <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--hot)", marginBottom: "1.25rem" }}>Pro</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>${proPrice}</div>
            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "1.75rem", fontWeight: 300 }}>per month{annual ? ", billed annually" : ""}</div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />
            {["Unlimited generations", "5 platforms", "8 viral formulas", "Advanced AI score", "Unlimited history", "Favorites & tags", "Export .txt / Notion", "Regenerate in 1 click"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--soft)", fontWeight: 300 }}>
                <span style={{ color: "var(--neon)", fontSize: ".8rem" }}>✓</span>{f}
              </div>
            ))}
            <div style={{ marginTop: "2rem" }}>
              <button onClick={() => alert("Connect your Stripe keys to activate!")} style={{ width: "100%", padding: "13px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".9rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--fb)" }}>Get Pro →</button>
            </div>
          </div>

          {/* Agency */}
          <div style={{ background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "24px", padding: "2rem" }}>
            <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", marginBottom: "1.25rem" }}>Agency</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>${agencyPrice}</div>
            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "1.75rem", fontWeight: 300 }}>per month{annual ? ", billed annually" : ""}</div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />
            {["Everything in Pro", "Multi-client workspace", "Bulk: 50 hooks / generation", "REST API access", "White-label (your brand)", "CSV / JSON export", "Priority support", "Dedicated onboarding"].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--soft)", fontWeight: 300 }}>
                <span style={{ color: "var(--neon)", fontSize: ".8rem" }}>✓</span>{f}
              </div>
            ))}
            <div style={{ marginTop: "2rem" }}>
              <button onClick={() => alert("Contact us for Agency onboarding!")} style={{ width: "100%", padding: "13px", borderRadius: "100px", border: "1px solid rgba(0,255,178,.2)", background: "rgba(0,255,178,.06)", color: "var(--neon)", fontSize: ".9rem", cursor: "pointer", fontFamily: "var(--fb)" }}>Contact for Agency</button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "left" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "2rem", textAlign: "center" }}>Frequently asked</h2>
          {faqs.map(([q, a], i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".9rem", fontWeight: 500, gap: "1rem" }}>
                {q}
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", color: openFaq === i ? "#fff" : "var(--muted)", background: openFaq === i ? "var(--electric)" : "transparent", transition: "all .25s", flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</div>
              </div>
              {openFaq === i && <div style={{ fontSize: ".875rem", color: "var(--soft)", marginTop: ".875rem", lineHeight: 1.8, fontWeight: 300 }}>{a}</div>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
