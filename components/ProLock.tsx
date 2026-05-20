import Link from "next/link";

// Single, shared Pro-lock surface. Every "this is Pro" message in the product
// renders through this — same wording shape, same look, same destination.
// One concept, one component (the inverse of the previous scattered locks).
export function ProNote({ title, detail }: { title: string; detail?: string }) {
  return (
    <Link
      href="/pricing"
      style={{
        display: "block",
        background: "var(--s2)",
        border: "1px dashed var(--border2)",
        borderRadius: "var(--r2)",
        padding: ".9rem 1.1rem",
        textDecoration: "none",
        fontFamily: "var(--fb)",
      }}
    >
      <div style={{ fontSize: ".85rem", color: "var(--text)", fontWeight: 500, marginBottom: detail ? "4px" : 0 }}>
        🔒 {title}
      </div>
      {detail && (
        <div style={{ fontSize: ".78rem", color: "var(--muted)", lineHeight: 1.5 }}>
          {detail}
        </div>
      )}
      <div style={{ fontSize: ".75rem", color: "var(--electric)", marginTop: "6px" }}>
        See Pro →
      </div>
    </Link>
  );
}
