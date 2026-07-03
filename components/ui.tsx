// Shared UI primitives (DESIGN-SYSTEM.md §6). Hover/active/focus states live
// in CSS (globals.css .btn/.chip) — never in useState. Redefining these
// locally in a page is forbidden (DS §8.15).
import Link from "next/link";
import type { CSSProperties, ReactNode, MouseEventHandler } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

export function Button({
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  block,
  disabled,
  title,
  ariaLabel,
  style,
  children,
}: {
  href?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const cls = `btn btn-${variant} btn-${size}${block ? " btn-block" : ""}`;
  if (href && !disabled) {
    return (
      <Link href={href} className={cls} title={title} aria-label={ariaLabel} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </button>
  );
}

export function Spinner({ size = 16, style }: { size?: number; style?: CSSProperties }) {
  return <span className="spinner" aria-hidden style={{ width: size, height: size, ...style }} />;
}
