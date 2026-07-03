import Link from "next/link";
import { Logo } from "@/components/Logo";

// Real site footer — wordmark + tagline + three link columns. A finished
// product doesn't end on a single line of legal links; this also gives every
// page crawlable internal links to the SEO surfaces (DESIGN-SYSTEM.md tokens).

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["Hook Analyzer", "/analyzer"],
      ["Hook Generator", "/generator"],
      ["Trends", "/trends"],
      ["Pricing", "/pricing"],
    ],
  },
  {
    title: "Learn",
    links: [
      ["Start here", "/why-it-works"],
      ["Attention patterns", "/patterns"],
      ["TikTok hooks", "/tiktok-hook-generator"],
      ["YouTube hooks", "/youtube-hook-generator"],
      ["Instagram hooks", "/instagram-hook-generator"],
    ],
  },
  {
    title: "Library",
    links: [
      ["Saved trends", "/saved"],
      ["History", "/history"],
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: "var(--sp-8)", background: "var(--surface)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "var(--sp-7) 1.5rem var(--sp-5)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-7)", justifyContent: "space-between" }}>
          {/* Brand */}
          <div style={{ maxWidth: "260px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "baseline", gap: "2px", textDecoration: "none", marginBottom: "var(--sp-3)" }} aria-label="HookViral — home">
              <Logo size={26} />
              <span style={{ fontFamily: "var(--fd)", fontWeight: 600, fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
                <span style={{ color: "var(--accent)" }}>.</span>ai
              </span>
            </Link>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", lineHeight: 1.6, marginTop: "var(--sp-2)" }}>
              Score, fix and generate short-form hooks that survive the first 3 seconds.
            </p>
          </div>

          {/* Link columns */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-7)" }}>
            {COLUMNS.map(col => (
              <div key={col.title} style={{ minWidth: "130px" }}>
                <div className="kicker" style={{ marginBottom: "var(--sp-3)" }}>{col.title}</div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} style={{ fontSize: "var(--text-sm)", color: "var(--text-soft)", textDecoration: "none" }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--sp-3)", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", marginTop: "var(--sp-6)", paddingTop: "var(--sp-4)" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} HookViral
          </span>
          <div style={{ display: "flex", gap: "var(--sp-4)" }}>
            <Link href="/terms" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textDecoration: "none" }}>Terms</Link>
            <Link href="/privacy" style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)", textDecoration: "none" }}>Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
