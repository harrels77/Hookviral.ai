import Link from "next/link";

// The product loop made visible. Every core page ends with this so the user
// always knows where they are and what the next step is — this is the skeleton
// that turns a pile of features into one system.
// Discover → Create → Diagnose → Learn → (back to Discover)

type StepId = "trends" | "generate" | "analyze" | "patterns";

// Each row describes itself: verb = CTA to land here, blurb = what this step does.
// NextStep then reads next.verb / next.blurb to point to the next step.
const LOOP: { id: StepId; n: number; label: string; href: string; verb: string; blurb: string; nextId: StepId }[] = [
  { id: "trends",   n: 1, label: "Discover", href: "/trends",    verb: "Find a trend",       blurb: "Real trends decoded into content angles for your niche.",       nextId: "generate" },
  { id: "generate", n: 2, label: "Create",   href: "/generator", verb: "Generate the hook",  blurb: "Turn an idea into 8 scored openings, with hashtags.",          nextId: "analyze" },
  { id: "analyze",  n: 3, label: "Diagnose", href: "/analyzer",  verb: "Analyze your hook",  blurb: "Score, the “why”, missing patterns, one-click rewrite.",        nextId: "patterns" },
  { id: "patterns", n: 4, label: "Learn",    href: "/patterns",  verb: "See the patterns",   blurb: "The 9 attention patterns every score is built on.",             nextId: "generate" },
];

export function NextStep({ current }: { current?: StepId }) {
  // No current = the page sits outside the loop (SEO entry, History, meta).
  // Show the stepper inert + push the user into the loop's first step.
  const here = current ? LOOP.find(s => s.id === current) : undefined;
  const next = here ? LOOP.find(s => s.id === here.nextId) ?? LOOP[1] : LOOP[0];

  return (
    <section style={{ borderTop: "1px solid var(--border)", marginTop: "3rem" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "2.5rem 1.5rem 3rem", textAlign: "center" }}>
        <div style={{ fontSize: ".68rem", letterSpacing: "3px", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 600, marginBottom: "1.25rem" }}>
          The HookViral loop
        </div>

        {/* Stepper — where you are */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {LOOP.map((s, i) => {
            const active = s.id === current;
            return (
              <span key={s.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link
                  href={s.href}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px", padding: "6px 14px", borderRadius: "100px",
                    textDecoration: "none", fontFamily: "var(--fb)", fontSize: ".8rem",
                    border: `1px solid ${active ? "transparent" : "var(--border2)"}`,
                    background: active ? "linear-gradient(135deg,var(--hot),var(--electric))" : "transparent",
                    color: active ? "#fff" : "var(--muted)", fontWeight: active ? 600 : 400,
                  }}
                >
                  <span style={{ fontFamily: "var(--fd)", fontWeight: 800, opacity: active ? 1 : .6 }}>{s.n}</span>
                  {s.label}
                </Link>
                {i < LOOP.length - 1 && <span style={{ color: "var(--muted)", fontSize: ".7rem" }}>→</span>}
              </span>
            );
          })}
        </div>

        {/* Next action */}
        <div style={{ fontSize: ".8rem", color: "var(--soft)", marginBottom: "1rem", fontWeight: 300 }}>
          Next: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{next.blurb}</strong>
        </div>
        <Link
          href={next.href}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 600, textDecoration: "none", fontFamily: "var(--fb)", boxShadow: "0 4px 16px rgba(255,45,107,.25)" }}
        >
          {next.verb} →
        </Link>
      </div>
    </section>
  );
}
