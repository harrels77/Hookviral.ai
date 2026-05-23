// Wordmark logo — "Hook" in brand gradient, "Viral" in default text color.
// Pure typography, no symbol. Same pattern as Linear / Vercel / Notion's
// startup-era wordmarks: indemodable, scales perfectly, reads at any size.
// Replaces the geometric HV monogram that read amateur ("vraiment laid").
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      role="img"
      aria-label="HookViral"
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: "var(--fd)",
        fontWeight: 800,
        fontSize: `${Math.round(size * 0.78)}px`,
        letterSpacing: "-1.2px",
        lineHeight: 1,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          background: "linear-gradient(135deg, var(--hot), var(--electric))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        Hook
      </span>
      <span style={{ color: "var(--text)" }}>Viral</span>
    </span>
  );
}
