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
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 1.25rem 6rem" }}>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontFamily: "var(--fd)",
              fontSize: "clamp(2.5rem,6vw,4rem)",
              fontWeight: 800,
              letterSpacing: "-3px",
              marginBottom: "1rem",
              lineHeight: 1,
            }}
          >
            Simple pricing.<br />
            <span className="gradient-text">Serious results.</span>
          </h1>
          <p
            style={{
              color: "var(--soft)",
              fontSize: "1rem",
              fontWeight: 300,
              maxWidth: "420px",
              margin: "0 auto",
            }}
          >
            Start free. Upgrade when your content demands it.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", padding: "5px", background: "var(--s1)", border: "1px solid var(--border)", borderRadius: "100px" }}>
            <button
              onClick={() => setAnnual(false)}
              style={{ padding: "8px 22px", borderRadius: "100px", border: "none", background: !annual ? "var(--s3)" : "transparent", color: !annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)", transition: "all .2s" }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{ padding: "8px 22px", borderRadius: "100px", border: "none", background: annual ? "var(--s3)" : "transparent", color: annual ? "var(--text)" : "var(--muted)", fontSize: ".85rem", cursor: "pointer", fontFamily: "var(--fb)", display: "flex", alignItems: "center", gap: "8px", transition: "all .2s" }}
            >
              Annual
              <span style={{ background: "rgba(0,255,178,.1)", color: "var(--neon)", border: "1px solid rgba(0,255,178,.2)", padding: "2px 8px", borderRadius: "100px", fontSize: ".7rem", fontFamily: "var(--fd)", fontWeight: 700 }}>
                Save 25%
              </span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "16px", marginBottom: "5rem" }}>

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
              <AnimLink href="/generator" variant="ghost">Start Free</AnimLink>
            </div>
          </PlanCard>

          <PlanCard featured>
            <div
              style={{
                position: "absolute",
                top: "-12px",
                right: "1.5rem",
                background: "linear-gradient(135deg, #ff2d6b, #6c3aff)",
                color: "#fff",
                fontSize: ".72rem",
                fontFamily: "var(--fd)",
                fontWeight: 800,
                letterSpacing: "2.5px",
                padding: "7px 16px",
                borderRadius: "0 0 12px 12px",
                boxShadow: "0 10px 24px rgba(255,45,107,.35)",
                border: "1px solid rgba(255,255,255,.12)",
              }}
            >
              MOST POPULAR
            </div>

            <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--hot)", marginBottom: "1.25rem" }}>
              Pro
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>
              ${proPrice}
            </div>
            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "1.75rem", fontWeight: 300 }}>
              per month{annual ? ", billed annually" : ""}
            </div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />
            <Features
              yes={["Unlimited generations", "5 platforms", "8 viral formulas", "Advanced AI score + analysis", "Unlimited history", "Favorites & tags", "Export .txt / Notion", "Script generator", "Hashtag optimizer"]}
              no={[]}
            />
            <div style={{ marginTop: "2rem" }}>
              <AnimBtn variant="primary" onClick={() => alert("Connect your Stripe keys!")}>Get Pro →</AnimBtn>
            </div>
          </PlanCard>

          <PlanCard>
            <div style={{ fontSize: ".72rem", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "var(--fd)", fontWeight: 700, color: "var(--neon)", marginBottom: "1.25rem" }}>
              Agency
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>
              ${agencyPrice}
            </div>
            <div style={{ fontSize: ".875rem", color: "var(--muted)", marginBottom: "1.75rem", fontWeight: 300 }}>
              per month{annual ? ", billed annually" : ""}
            </div>
            <div style={{ height: "1px", background: "var(--border)", marginBottom: "1.5rem" }} />
            <Features
              yes={["Everything in Pro", "Multi-client workspace", "Bulk: 50 hooks / gen", "REST API access", "White-label", "CSV / JSON export", "Priority support", "Dedicated onboarding"]}
              no={[]}
            />
            <div style={{ marginTop: "2rem" }}>
              <AnimBtn variant="neon" onClick={() => alert("Contact us for Agency!")}>Contact for Agency</AnimBtn>
            </div>
          </PlanCard>
        </div>

        <div style={{ textAlign: "center", padding: "2rem", background: "var(--s1)", borderRadius: "var(--r2)", border: "1px solid var(--border)", marginBottom: "5rem" }}>
          <p style={{ fontSize: ".875rem", color: "var(--soft)", fontWeight: 300, lineHeight: 1.7 }}>
            All plans include the same AI quality. Upgrades unlock <strong style={{ color: "var(--text)", fontWeight: 500 }}>volume, history, and power features</strong> — not better hooks.<br />
            <Link href="/generator" style={{ color: "var(--electric)", textDecoration: "none" }}>Try free first →</Link>
          </p>
        </div>

        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-1px", marginBottom: "2rem", textAlign: "center" }}>
            Frequently asked
          </h2>
          {faqs.map(([q, a], i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ borderTop: "1px solid var(--border)", padding: "1.25rem 0", cursor: "pointer" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: ".9rem", fontWeight: 500, gap: "1rem", color: "var(--text)" }}>
                <span>{q}</span>
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
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>

        <div style={{ textAlign: "center", marginTop: "4rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          {[["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"], ["Generator", "/generator"]].map(([label, href]) => (
            <Link key={href} href={href} style={{ fontSize: ".8rem", color: "var(--muted)", textDecoration: "none" }}>{label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanCard({ children, featured }: { children: React.ReactNode; featured?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: featured
          ? "linear-gradient(180deg, rgba(255,45,107,.10) 0%, rgba(108,58,255,.08) 45%, var(--s1) 100%)"
          : "var(--s1)",
        border: `1px solid ${featured ? "rgba(255,45,107,.55)" : hov ? "rgba(108,58,255,.35)" : "var(--border)"}`,
        borderRadius: "24px",
        padding: "2rem",
        position: "relative",
        transition: "all .3s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov
          ? "0 20px 50px rgba(108,58,255,.12)"
          : featured
            ? "0 0 0 1px rgba(255,45,107,.12), 0 18px 50px rgba(255,45,107,.14)"
            : "none",
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
    <div style={{ fontFamily: "var(--fd)", fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, marginBottom: ".25rem" }}>
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

function Features({ yes, no }: { yes: string[]; no: string[] }) {
  return (
    <div>
      {yes.map(f => (
        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--soft)", fontWeight: 300 }}>
          <span style={{ color: "var(--neon)", fontSize: ".8rem", flexShrink: 0, marginTop: "2px" }}>✓</span>{f}
        </div>
      ))}
      {no.map(f => (
        <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: ".6rem", fontSize: ".875rem", color: "var(--muted)", fontWeight: 300, opacity: .45 }}>
          <span style={{ flexShrink: 0, marginTop: "2px" }}>–</span>{f}
        </div>
      ))}
    </div>
  );
}

function AnimLink({ href, variant, children }: { href: string; variant: "ghost"; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        textAlign: "center",
        padding: "13px",
        borderRadius: "100px",
        background: hov ? "var(--s2)" : "var(--s3)",
        color: hov ? "var(--text)" : "var(--soft)",
        border: `1px solid ${hov ? "rgba(108,58,255,.4)" : "var(--border2)"}`,
        fontSize: ".9rem",
        textDecoration: "none",
        fontFamily: "var(--fb)",
        transition: "all .25s",
        transform: hov ? "translateY(-2px)" : "none",
      }}
    >
      {children}
    </Link>
  );
}

function AnimBtn({ onClick, variant, children }: { onClick: () => void; variant: "primary" | "neon"; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  const isPrimary = variant === "primary";
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "13px",
        borderRadius: "100px",
        border: isPrimary ? "none" : "1px solid rgba(0,255,178,.2)",
        background: isPrimary
          ? "linear-gradient(135deg,var(--hot),var(--electric))"
          : hov ? "rgba(0,255,178,.15)" : "rgba(0,255,178,.06)",
        color: isPrimary ? "#fff" : "var(--neon)",
        fontSize: ".9rem",
        fontWeight: isPrimary ? 500 : 400,
        cursor: "pointer",
        fontFamily: "var(--fb)",
        transition: "all .3s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov
          ? isPrimary ? "0 16px 40px rgba(255,45,107,.4)" : "0 10px 28px rgba(0,255,178,.2)"
          : isPrimary ? "0 6px 20px rgba(255,45,107,.25)" : "none",
      }}
    >
      {children}
    </button>
  );
}
