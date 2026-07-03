import Link from "next/link";
import { Icon } from "@/lib/icons";

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
    <section style={{ borderTop: "1px solid var(--border)", marginTop: "var(--sp-7)" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "var(--sp-6) 1.5rem var(--sp-7)", textAlign: "center" }}>
        <div className="kicker" style={{ marginBottom: "var(--sp-4)" }}>
          The HookViral loop
        </div>

        {/* Stepper — where you are */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", flexWrap: "wrap", marginBottom: "var(--sp-5)" }}>
          {LOOP.map((s, i) => {
            const active = s.id === current;
            return (
              <span key={s.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link
                  href={s.href}
                  style={{
                    display: "flex", alignItems: "center", gap: "7px", padding: "6px 14px", borderRadius: "var(--r-pill)",
                    textDecoration: "none", fontSize: "var(--text-sm)",
                    border: `1px solid ${active ? "var(--accent)" : "var(--border-strong)"}`,
                    background: active ? "var(--accent-soft)" : "transparent",
                    color: active ? "var(--accent)" : "var(--text-muted)", fontWeight: active ? 600 : 400,
                  }}
                >
                  <span style={{ fontFamily: "var(--fd)", fontWeight: 700, opacity: active ? 1 : .6 }}>{s.n}</span>
                  {s.label}
                </Link>
                {i < LOOP.length - 1 && <Icon name="arrow-right" style={{ color: "var(--text-muted)" }} />}
              </span>
            );
          })}
        </div>

        {/* Next action */}
        <div style={{ fontSize: "var(--text-sm)", color: "var(--text-soft)", marginBottom: "var(--sp-4)" }}>
          Next: <strong style={{ color: "var(--text)", fontWeight: 500 }}>{next.blurb}</strong>
        </div>
        <Link href={next.href} className="btn btn-primary btn-md">
          {next.verb}
          <Icon name="arrow-right" />
        </Link>
      </div>
    </section>
  );
}
