"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Nav() {
  const path = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/generator", label: "Generator" },
    { href: "/history", label: "History" },
    { href: "/pricing", label: "Pricing" },
  ];

  // Animated cursor
  useEffect(() => {
    const cursor = document.getElementById("hv-cursor");
    const ring = document.getElementById("hv-ring");
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx - 5 + "px";
      cursor.style.top = my - 5 + "px";
    };

    const animate = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx - 16 + "px";
      ring.style.top = ry - 16 + "px";
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      ring.style.width = "44px";
      ring.style.height = "44px";
      ring.style.borderColor = "rgba(255,45,107,.8)";
      ring.style.background = "rgba(255,45,107,.06)";
      cursor.style.transform = "scale(1.6)";
    };

    const onLeave = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(255,45,107,.35)";
      ring.style.background = "transparent";
      cursor.style.transform = "scale(1)";
    };

    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animate);

    // Hide on touch devices
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (isTouchDevice) {
      cursor.style.display = "none";
      ring.style.display = "none";
    }

    // Attach to all interactive elements
    const attach = () => {
      document.querySelectorAll("button, a, input, textarea, [role='button'], .interactive").forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attach();

    // Re-attach when DOM changes (for dynamic content)
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Custom cursor elements */}
      <div id="hv-cursor" style={{
        position: "fixed", width: "10px", height: "10px",
        background: "var(--hot)", borderRadius: "50%",
        pointerEvents: "none", zIndex: 9999,
        transition: "transform .15s ease",
        mixBlendMode: "difference",
      }} />
      <div id="hv-ring" style={{
        position: "fixed", width: "32px", height: "32px",
        border: "1px solid rgba(255,45,107,.35)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 9998,
        transition: "width .25s ease, height .25s ease, border-color .25s ease, background .25s ease",
      }} />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: "var(--nav-h)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem",
        background: "rgba(6,6,9,.88)",
        backdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: "var(--fd)", fontWeight: 800, fontSize: "1.2rem",
          letterSpacing: "-1px", display: "flex", alignItems: "center", gap: "8px",
          textDecoration: "none", color: "var(--text)",
        }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "28px", height: "28px",
            background: "linear-gradient(135deg,var(--hot),var(--electric))",
            borderRadius: "8px", fontSize: "14px",
            animation: "pulseGlow 2.5s ease-in-out infinite",
          }}>⚡</span>
          HookViral<span style={{ color: "var(--hot)" }}>.</span>ai
        </Link>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {links.map(l => {
            const isActive = path === l.href;
            return (
              <Link key={l.href} href={l.href} style={{
                position: "relative",
                padding: "6px 16px", borderRadius: "100px",
                fontSize: ".85rem",
                color: isActive ? "var(--text)" : "var(--soft)",
                textDecoration: "none",
                background: isActive ? "var(--s3)" : "transparent",
                fontFamily: "var(--fb)",
                transition: "all .2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "3px",
              }}>
                {l.label}
                {/* Active dot indicator */}
                {isActive && (
                  <span style={{
                    display: "block", width: "4px", height: "4px",
                    borderRadius: "50%",
                    background: "linear-gradient(90deg,var(--hot),var(--electric))",
                    position: "absolute", bottom: "2px",
                    animation: "fadeUp .3s ease",
                  }} />
                )}
              </Link>
            );
          })}
          <Link href="/generator" style={{
            marginLeft: "8px", padding: "8px 20px",
            borderRadius: "100px",
            background: "linear-gradient(135deg,var(--hot),var(--electric))",
            color: "#fff", fontSize: ".85rem", fontWeight: 500,
            textDecoration: "none", fontFamily: "var(--fb)",
            transition: "all .25s",
            boxShadow: "0 4px 16px rgba(255,45,107,.25)",
          }}>
            Start Free →
          </Link>
        </div>
      </nav>
    </>
  );
}
