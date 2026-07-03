import Link from "next/link";
import { Icon } from "@/lib/icons";

// Single, shared Pro-lock surface. Every "this is Pro" message in the product
// renders through this — same wording shape, same look, same destination.
// One concept, one component (the inverse of the previous scattered locks).
export function ProNote({ title, detail }: { title: string; detail?: string }) {
  return (
    <Link
      href="/pricing"
      style={{
        display: "block",
        background: "var(--surface-2)",
        border: "1px dashed var(--border-strong)",
        borderRadius: "var(--r-md)",
        padding: ".9rem 1.1rem",
        textDecoration: "none",
        fontFamily: "var(--fb)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "var(--text-sm)", color: "var(--text)", fontWeight: 500, marginBottom: detail ? "4px" : 0 }}>
        <Icon name="lock" /> {title}
      </div>
      {detail && (
        <div style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", lineHeight: 1.5 }}>
          {detail}
        </div>
      )}
      <div style={{ fontSize: "var(--text-xs)", color: "var(--accent)", marginTop: "6px" }}>
        See Pro
      </div>
    </Link>
  );
}
