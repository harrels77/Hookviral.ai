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
        <div style={{ display: "inline-flex", alignItems: "center", marginBottom: "3rem", padding: "6px", background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "100px" }}>
          <button
            onClick={() => setAnnual(false)}
            style={{ padding: "8px 24px", borderRadius: "100px", border: "none", background: !annual ? "var(--s3)" : "transparent", color: !annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{ padding: "8px 24px", borderRadius: "100px", border: "none", background: annual ? "var(--s3)" : "transparent", color: annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)", display: "flex", alignItems: "center", gap: "8px", transition: "all .2s" }}
          >
            Annual
            <span style={{ background: "rgba(0,255,178,.1)", color: "var(--neon)", border: "1px solid rgba(0,255,178,.2)", padding: "2px 8px", borderRadius: "100px", fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700 }}>Save 25%</span>
          </button>
        </div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", textAlign: "left", marginBottom: "5rem" }}>

          {/* ── FREE ── */}
          <PlanCard>
            <PlanTier color="var(--muted)">Free</PlanTier>
            <PlanPrice>$0</PlanPrice>
            <PlanPer>forever free</PlanPer>
            <PlanDivider />
            <PlanFeatures
              included={["10 generations / day", "5 platforms", "8 viral formulas", "Basic virality score", "1-click copy"]}
              excluded={["Unlimited history", "Export .txt", "Advanced AI score", "Script generator", "Hashtag analysis"]}
            />
            <div style={{ marginTop: "2rem" }}>
              <Link
                href="/generator"
                style={{ display: "block", textAlign: "center", padding: "13px", borderRadius: "100px", background: "var(--s3)", color: "var(--soft)", border: "1px solid var(--border2)", fontSize: ".9rem", textDecoration: "none", fontFamily: "var(--fb)", transition: "all .25s" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "var(--s2)";
                  el.style.color = "var(--text)";
                  el.style.transform = "translateY(-2px)";
                  el.style.borderColor = "rgba(108,58,255,.4)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = "var(--s3)";
                  el.style.color = "var(--soft)";
                  el.style.transform = "none";
                  el.style.borderColor = "var(--border2)";
                }}
              >
                Start Free
              </Link>
            </div>
          </PlanCard>

          {/* ── PRO ── */}
          <PlanCard featured>
            <div style={{ position: "absolute", top: "-1px", right: "2rem", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".65rem", fontFamily: "var(--fd)", fontWeight: 700, letterSpacing: "2px", padding: "5px 14px", borderRadius: "0 0 12px 12px" }}>
              MOST POPULAR
            </div>
            <PlanTier color="var(--hot)">Pro</PlanTier>
            <PlanPrice>${proPrice}</PlanPrice>
            <PlanPer>per month{annual ? ", billed annually" : ""}</PlanPer>
            <PlanDivider />
            <PlanFeatures
              included={["Unlimited generations", "5 platforms", "8 viral formulas", "Advanced AI score + analysis", "Unlimited history", "Favorites & tags", "Export .txt / Notion", "Script generator", "Hashtag optimizer"]}
              excluded={[]}
            />
            <div style={{ marginTop: "2rem" }}>
              <button
                onClick={() => alert("Connect your Stripe keys to activate!")}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "translateY(-3px) scale(1.02)";
                  el.style.boxShadow = "0 20px 50px rgba(255,45,107,.5)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "none";
                  el.style.boxShadow = "0 8px 24px rgba(255,45,107,.25)";
                }}
                style={{ width: "100%", padding: "13px", borderRadius: "100px", border: "none", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".9rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--fb)", transition: "all .3s", boxShadow: "0 8px 24px rgba(255,45,107,.25)" }}
              >
                Get Pro →
              </button>
            </div>
          </PlanCard>

          {/* ── AGENCY ── */}
          <PlanCard>
            <PlanTier color="var(--neon)">Agency</PlanTier>
            <PlanPrice>${agencyPrice}</PlanPrice>
            <PlanPer>per month{annual ? ", billed annually" : ""}</PlanPer>
            <PlanDivider />
            <PlanFeatures
              included={["Everything in Pro", "Multi-client workspace", "Bulk: 50 hooks / generation", "REST API access", "White-label (your brand)", "CSV / JSON export", "Priority support", "Dedicated onboarding"]}
              excluded={[]}
            />
            <div style={{ marginTop: "2rem" }}>
              <button
                onClick={() => alert("Contact us for Agency onboarding!")}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "translateY(-2px)";
                  el.style.background = "rgba(0,255,178,.15)";
                  el.style.boxShadow = "0 12px 32px rgba(0,255,178,.2)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = "none";
                  el.style.background = "rgba(0,255,178,.06)";
                  el.style.boxShadow = "none";
                }}
                style={{ width: "100%", padding: "13px", borderRadius: "100px", border: "1px solid rgba(0,255,178,.2)", background: "rgba(0,255,178,.06)", color: "var(--neon)", fontSize: ".9rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .3s" }}
              >
                Contact for Agency
              </button>
            </div>
          </PlanCard>

        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "left" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "2rem", textAlign: "center" }}>
            Frequently asked
          </h2>
          {faqs.map(([q, a], i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".9rem", fontWeight: 500, gap: "1rem" }}>
                {q}
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".7rem", color: openFaq === i ? "#fff" : "var(--muted)", background: openFaq === i ? "var(--electric)" : "transparent", transition: "all .25s", flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "none" }}>
                  +
                </div>
              </div>
              {openFaq === i && (
                <div style={{ fontSize: ".875rem", color: "var(--soft)", marginTop: ".875rem", lineHeight: 1.8, fontWeight: 300 }}>
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ──

function PlanCard({ children, featured }: { children: React.ReactNode; featured?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: featured ? "linear-gradient(180deg,rgba(255,45,107,.04) 0%,var(--s1) 40%)" : "var(--s1)",
        border: `1px solid ${featured ? "rgba(255,45,107,.4)" : hov ? "rgba(108,58,255,.35)" : "var(--border)"}`,
        borderRadius: "24px",
        padding: "2rem",
        position: "relative",
        transition: "all .3s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov ? "0 24px 60px rgba(108,58,255,.12)" : featured ? "0 0 40px rgba(255,45,107,.08)" : "none",
      }}
    >
      {children}
    </div>
  );
}

function PlanTier({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color, marginBottom: "1.25rem" }}>
      {children}
    </div>
  );
}

function PlanPrice({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--fd)", fontSize: "3rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>
      {children}
    </div>
  );
}

function PlanPer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "1.75rem", fontWeight: 300 }}>
      {children}
    </div>
  );
}

function PlanDivider() {
  return <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />;
}

function PlanFeatures({ included, excluded }: { included: string[]; excluded: string[] }) {
  return (
    <>
      {included.map(f => (
        <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--soft)", fontWeight: 300 }}>
          <span style={{ color: "var(--neon)", fontSize: ".8rem", flexShrink: 0 }}>✓</span>{f}
        </div>
      ))}
      {excluded.map(f => (
        <div key={f} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--muted)", fontWeight: 300, opacity: .45 }}>
          <span style={{ flexShrink: 0 }}>–</span>{f}
        </div>
      ))}
    </>
  );
}