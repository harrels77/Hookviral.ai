"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/Themeprovider";
import { Logo } from "@/components/Logo";
import { Icon } from "@/lib/icons";

// Five primary entries + Library (personal, localStorage-backed pages).
// Order signals priority: Analyze is the demo that converts ("paste hook →
// 32/100 → fix → 84/100"); Generate follows because the natural workflow is
// "I have a hook, is it any good?" before "blank page, generate something".
const PRIMARY = [
  { href: "/analyzer", label: "Analyze" },
  { href: "/generator", label: "Generate" },
  { href: "/trends", label: "Trends" },
  { href: "/patterns", label: "Patterns" },
  { href: "/pricing", label: "Pricing" },
];

const LIBRARY = [
  { href: "/saved", label: "Saved trends" },
  { href: "/history", label: "History" },
  { href: "/why-it-works", label: "Start here" },
];

export function Nav() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [libOpen, setLibOpen] = useState(false);
  const libRef = useRef<HTMLDivElement>(null);
  const { theme, toggle } = useTheme();

  // Close the Library dropdown on outside click.
  useEffect(() => {
    if (!libOpen) return;
    const onDown = (e: MouseEvent) => {
      if (libRef.current && !libRef.current.contains(e.target as Node)) setLibOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [libOpen]);

  const inLibrary = LIBRARY.some(l => l.href === path);

  return (
    <>
      {/* Mobile overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(16,16,25,.45)", zIndex: 150 }} />
      )}

      {/* Mobile drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "280px", background: "var(--surface)", borderLeft: "1px solid var(--border)", zIndex: 200, padding: "4.5rem 1.5rem 2rem", display: "flex", flexDirection: "column", gap: "4px", transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform .3s cubic-bezier(.16,1,.3,1)", overflowY: "auto" }}>
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          style={{ position: "absolute", top: "14px", right: "1.5rem", width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", color: "var(--text-soft)", cursor: "pointer" }}
        >
          <Icon name="x" size={20} />
        </button>
        {[{ href: "/", label: "Home" }, ...PRIMARY, ...LIBRARY].map(l => {
          const active = path === l.href;
          return (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderRadius: "var(--r-md)", background: active ? "var(--surface-3)" : "transparent", color: active ? "var(--text)" : "var(--text-soft)", textDecoration: "none", fontSize: "var(--text-base)", fontWeight: active ? 500 : 400 }}>
              {l.label}
              {active && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
            </Link>
          );
        })}
        <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/analyzer" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-md btn-block">
            Score my hook
            <Icon name="arrow-right" />
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: "var(--nav-h)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", background: "var(--nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>

        <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: "2px", textDecoration: "none" }} aria-label="HookViral — home">
          <Logo size={28} />
          <span style={{ fontFamily: "var(--fd)", fontWeight: 600, fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>
            <span style={{ color: "var(--accent)" }}>.</span>ai
          </span>
        </Link>

        {/* Desktop */}
        <div className="hv-desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {PRIMARY.map(l => {
            const active = path === l.href;
            return (
              <Link key={l.href} href={l.href} style={{ padding: "7px 14px", borderRadius: "var(--r-pill)", fontSize: "var(--text-sm)", color: active ? "var(--text)" : "var(--text-soft)", background: active ? "var(--surface-3)" : "transparent", textDecoration: "none", fontWeight: active ? 500 : 400, transition: "background .15s ease, color .15s ease" }}>
                {l.label}
              </Link>
            );
          })}

          {/* Library — personal pages grouped so the primary row stays short */}
          <div ref={libRef} style={{ position: "relative" }}>
            <button
              onClick={() => setLibOpen(o => !o)}
              aria-expanded={libOpen}
              aria-haspopup="menu"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "7px 14px", borderRadius: "var(--r-pill)", border: "none", background: inLibrary ? "var(--surface-3)" : "transparent", color: inLibrary ? "var(--text)" : "var(--text-soft)", fontSize: "var(--text-sm)", fontFamily: "var(--fb)", cursor: "pointer", transition: "background .15s ease, color .15s ease" }}
            >
              Library
              <Icon name="chevron-down" style={{ transform: libOpen ? "rotate(180deg)" : "none", transition: "transform .15s ease" }} />
            </button>
            {libOpen && (
              <div role="menu" style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, minWidth: "180px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--r-md)", boxShadow: "0 8px 24px rgb(16 16 25 / .10)", padding: "6px", display: "flex", flexDirection: "column", gap: "2px" }}>
                {LIBRARY.map(l => (
                  <Link key={l.href} role="menuitem" href={l.href} onClick={() => setLibOpen(false)} style={{ padding: "9px 12px", borderRadius: "var(--r-sm)", fontSize: "var(--text-sm)", color: path === l.href ? "var(--text)" : "var(--text-soft)", background: path === l.href ? "var(--surface-2)" : "transparent", textDecoration: "none" }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-soft)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "4px" }}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>

          <Link href="/analyzer" className="btn btn-primary btn-sm" style={{ marginLeft: "8px" }}>
            Score my hook
            <Icon name="arrow-right" />
          </Link>
        </div>

        {/* Mobile right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={toggle}
            className="hv-theme-mobile"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{ display: "none", width: "34px", height: "34px", borderRadius: "50%", border: "1px solid var(--border-strong)", background: "var(--surface-2)", color: "var(--text-soft)", cursor: "pointer", alignItems: "center", justifyContent: "center" }}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="hv-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{ display: "none", width: "38px", height: "38px", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--r-sm)", color: "var(--text-soft)", cursor: "pointer", zIndex: 210 }}
          >
            <Icon name={menuOpen ? "x" : "menu"} size={20} />
          </button>
        </div>
      </nav>

      <style>{`
        @media (max-width: 760px) {
          .hv-desktop-nav { display: none !important; }
          .hv-hamburger { display: flex !important; }
          .hv-theme-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
}
