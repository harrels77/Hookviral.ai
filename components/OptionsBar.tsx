"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/lib/icons";

// Shared disclosure bar for page options (Analyzer / Generator / Trends).
// Replaces the bare <details> "More options ▾": a real control — sliders
// icon in a tinted tile, label, a LIVE summary of the current selection as
// mini value-chips (platform logo, niche icon, geo flag…), and an animated
// chevron. The expanded panel opens as a connected card section, so the
// selection stays readable even when the panel is closed.

export function OptionsBar({
  label,
  summary,
  children,
  style,
}: {
  label: string;
  /** Current selection, rendered as <ValueChip>s — visible while closed. */
  summary: ReactNode;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card" style={{ overflow: "hidden", ...style }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--fb)",
          textAlign: "left",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", borderRadius: "9px", background: "var(--accent-soft)", color: "var(--accent)", flexShrink: 0 }}>
          <Icon name="sliders" />
        </span>
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text)", flexShrink: 0 }}>
          {label}
        </span>
        <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "6px", flex: 1, minWidth: 0, justifyContent: "flex-end" }}>
          {summary}
        </span>
        <span style={{ display: "flex", color: "var(--text-muted)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s ease", flexShrink: 0 }}>
          <Icon name="chevron-down" />
        </span>
      </button>

      {open && (
        <div style={{ borderTop: "1px solid var(--border)", padding: "14px", display: "flex", flexDirection: "column", gap: "14px", background: "var(--surface-2)", animation: "cardIn .2s ease" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// One current value in the closed bar — e.g. [TikTok-logo TikTok] [flag US].
export function ValueChip({ children, muted }: { children: ReactNode; muted?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "var(--r-pill)",
        background: muted ? "transparent" : "var(--surface-2)",
        border: `1px solid ${muted ? "transparent" : "var(--border)"}`,
        fontSize: "var(--text-xs)",
        color: "var(--text-soft)",
        fontFamily: "var(--fb)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// A titled group inside the panel (Platform / Tone / Niche / Goal / Geo…).
export function OptionGroup({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="kicker" style={{ marginBottom: "8px" }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{children}</div>
    </div>
  );
}
