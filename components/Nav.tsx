"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/Themeprovider";

export function Nav() {
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const links = [
    { href: "/", label: "Home" },
    { href: "/generator", label: "Generator" },
    { href: "/history", label: "History" },
    { href: "/pricing", label: "Pricing" },
  ];

  useEffect(() => { setMenuOpen(false); }, [path]);

  // Animated cursor — desktop only
  useEffect(() => {
    const cursor = document.getElementById("hv-cursor");
    const ring = document.getElementById("hv-ring");
    if (!cursor || !ring) return;

    if (window.matchMedia("(hover: none)").matches) {
      cursor.style.display = "none";
      ring.style.display = "none";
      return;
    }

    let mx = 0, my = 0, rx = 0, ry = 0, raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx - 5 + "px"; cursor.style.top = my - 5 + "px";
    };
    const tick = () => {
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      ring.style.left = rx - 16 + "px"; ring.style.top = ry - 16 + "px";
      raf = requestAnimationFrame(tick);
    };
    const grow = () => {
      ring.style.width = "48px"; ring.style.height = "48px";
      ring.style.borderColor = "rgba(255,45,107,.8)";
      ring.style.background = "rgba(255,45,107,.05)";
      cursor.style.transform = "scale(1.8)";
    };
    const shrink = () => {
      ring.style.width = "32px"; ring.style.height = "32px";
      ring.style.borderColor = "rgba(255,45,107,.35)";
      ring.style.background = "transparent";
      cursor.style.transform = "scale(1)";
    };

    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    const attach = () => {
      document.querySelectorAll("button,a,input,textarea,select").forEach(el => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    };
    attach();
    const obs = new MutationObserver(attach);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      {/* Cursor */}
      <div id="hv-cursor" style={{ position: "fixed", width: "10px", height: "10px", background: "var(--hot)", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, transition: "transform .15s", mixBlendMode: "difference" }} />
      <div id="hv-ring" style={{ position: "fixed", width: "32px", height: "32px", border: "1px solid rgba(255,45,107,.35)", borderRadius: "50%", pointerEvents: "none", zIndex: 9998, transition: "width .2s, height .2s, border-color .2s, background .2s" }} />

      {/* Mobile overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 150, backdropFilter: "blur(6px)" }} />
      )}

      {/* Mobile drawer */}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "280px", background: "var(--s1)", borderLeft: "1px solid var(--border)", zIndex: 200, padding: "5rem 1.5rem 2rem", display: "flex", flexDirection: "column", gap: "6px", transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform .3s cubic-bezier(.16,1,.3,1)" }}>
        {links.map(l => {
          const active = path === l.href;
          return (
            <Link key={l.href} href={l.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: "var(--r2)", background: active ? "var(--s3)" : "transparent", color: active ? "var(--text)" : "var(--soft)", textDecoration: "none", fontFamily: "var(--fb)", fontSize: "1rem", fontWeight: active ? 500 : 400, border: active ? "1px solid var(--border2)" : "1px solid transparent", transition: "all .2s" }}>
              {l.label}
              {active && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "linear-gradient(135deg,var(--hot),var(--electric))", flexShrink: 0 }} />}
            </Link>
          );
        })}
        <div style={{ marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/pricing" style={{ display: "block", textAlign: "center", padding: "14px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".95rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)" }}>
            Upgrade to Pro →
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: "var(--nav-h)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", background: "var(--nav-bg)", backdropFilter: "blur(24px) saturate(180%)", borderBottom: "1px solid var(--border)" }}>

        {/* Logo */}
        <Link href="/" style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-1px", display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "var(--text)" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", background: "linear-gradient(135deg,var(--hot),var(--electric))", borderRadius: "8px", fontSize: "14px", animation: "pulseGlow 2.5s ease-in-out infinite" }}>⚡</span>
          HookViral<span style={{ color: "var(--hot)" }}>.</span>ai
        </Link>

        {/* Desktop links */}
        <div className="hv-desktop-nav" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {links.map(l => {
            const active = path === l.href;
            return (
              <Link key={l.href} href={l.href} style={{ position: "relative", padding: "6px 16px", borderRadius: "100px", fontSize: ".85rem", color: active ? "var(--text)" : "var(--soft)", background: active ? "var(--s3)" : "transparent", textDecoration: "none", fontFamily: "var(--fb)", transition: "all .2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                {l.label}
                {active && (
                  <span style={{ display: "block", width: "4px", height: "4px", borderRadius: "50%", background: "linear-gradient(90deg,var(--hot),var(--electric))", animation: "fadeUp .3s ease" }} />
                )}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1px solid var(--border2)", background: "var(--s2)", color: "var(--soft)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", transition: "all .25s", marginLeft: "4px" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,45,107,.5)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text)";
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1) rotate(15deg)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border2)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--soft)";
              (e.currentTarget as HTMLButtonElement).style.transform = "none";
            }}
          >
            {theme === "dark" ? "☀" : "🌙"}
          </button>

          <Link href="/pricing" style={{ marginLeft: "8px", padding: "8px 20px", borderRadius: "100px", background: "linear-gradient(135deg,var(--hot),var(--electric))", color: "#fff", fontSize: ".85rem", fontWeight: 500, textDecoration: "none", fontFamily: "var(--fb)", boxShadow: "0 4px 16px rgba(255,45,107,.25)", transition: "all .25s" }}>
            Start Free →
          </Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(p => !p)} className="hv-hamburger" style={{ display: "none", flexDirection: "column", gap: "5px", padding: "8px", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--r)", cursor: "pointer" }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: "block", width: "20px", height: "1.5px", background: "var(--soft)", borderRadius: "2px", transition: "all .25s", transform: menuOpen ? (i === 0 ? "rotate(45deg) translate(4.5px,4.5px)" : i === 1 ? "scaleX(0)" : "rotate(-45deg) translate(4.5px,-4.5px)") : "none" }} />
          ))}
        </button>
      </nav>

      <style>{`
        @media (max-width: 700px) {
          .hv-desktop-nav { display: none !important; }
          .hv-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}