import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HookViral AI — Stop the Scroll in 3 Seconds",
  description: "Generate 8 viral hooks in seconds. Free to start.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ position:"fixed", top:0, left:0, right:0, height:"var(--nav-h)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 1.5rem", background:"rgba(6,6,9,.9)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)" }}>
          <a href="/" style={{ fontFamily:"var(--fd)", fontWeight:800, fontSize:"1.2rem", letterSpacing:"-1px", display:"flex", alignItems:"center", gap:"8px", textDecoration:"none", color:"var(--text)" }}>
            <span style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"28px", height:"28px", background:"linear-gradient(135deg,var(--hot),var(--electric))", borderRadius:"8px", fontSize:"14px", animation:"pulseGlow 2s ease-in-out infinite" }}>⚡</span>
            HookViral<span style={{ color:"var(--hot)" }}>.</span>ai
          </a>
          <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            {[["Home","/"],["Generator","/generator"],["History","/history"],["Pricing","/pricing"]].map(([label,href])=>(
              <a key={href} href={href} style={{ padding:"6px 14px", borderRadius:"100px", fontSize:".85rem", color:"var(--soft)", textDecoration:"none", fontFamily:"var(--fb)" }}>{label}</a>
            ))}
            <a href="/generator" style={{ marginLeft:"8px", padding:"8px 20px", borderRadius:"100px", background:"linear-gradient(135deg,var(--hot),var(--electric))", color:"#fff", fontSize:".85rem", fontWeight:500, textDecoration:"none", fontFamily:"var(--fb)" }}>Start Free →</a>
          </div>
        </nav>
        <main style={{ paddingTop:"var(--nav-h)" }}>{children}</main>
      </body>
    </html>
  );
}