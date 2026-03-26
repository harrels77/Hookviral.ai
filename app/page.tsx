import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", width:"600px", height:"600px", background:"var(--electric)", borderRadius:"50%", top:"-250px", left:"-200px", filter:"blur(120px)", opacity:.08, animation:"orbFloat 14s ease-in-out infinite" }} />
        <div style={{ position:"absolute", width:"500px", height:"500px", background:"var(--hot)", borderRadius:"50%", bottom:"-200px", right:"-150px", filter:"blur(120px)", opacity:.07, animation:"orbFloat 18s ease-in-out infinite reverse" }} />
      </div>
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"calc(100vh - 64px)", textAlign:"center", padding:"4rem 1.5rem" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"6px 18px", borderRadius:"100px", border:"1px solid rgba(108,58,255,.35)", background:"rgba(108,58,255,.08)", fontSize:".78rem", letterSpacing:"1.5px", textTransform:"uppercase", color:"#9B8CFF", marginBottom:"2.5rem" }}>
          <span style={{ width:"5px", height:"5px", background:"var(--neon)", borderRadius:"50%", animation:"pulseGlow 1.5s infinite" }} />
          AI-Powered · 8 Viral Formulas · Free to Start
        </div>
        <h1 style={{ fontFamily:"var(--fd)", fontSize:"clamp(3rem,9vw,7rem)", fontWeight:800, lineHeight:.95, letterSpacing:"-4px", marginBottom:"1.75rem" }}>
          Stop the<br /><span className="gradient-text">Scroll.</span>
        </h1>
        <p style={{ fontSize:"1.15rem", color:"var(--soft)", maxWidth:"500px", margin:"0 auto 3rem", lineHeight:1.7, fontWeight:300 }}>
          Generate 8 platform-optimized viral hooks in 3 seconds. Built for creators who refuse to be skipped.
        </p>
        <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", justifyContent:"center" }}>
          <Link href="/generator" style={{ padding:"16px 36px", borderRadius:"100px", background:"linear-gradient(135deg,var(--hot),var(--electric))", color:"#fff", fontSize:"1rem", fontWeight:500, textDecoration:"none", display:"flex", alignItems:"center", gap:"8px" }}>
            Generate My Hooks →
          </Link>
          <Link href="/pricing" style={{ padding:"16px 32px", borderRadius:"100px", border:"1px solid var(--border2)", color:"var(--soft)", fontSize:"1rem", textDecoration:"none" }}>
            See Pricing
          </Link>
        </div>
        <div style={{ display:"flex", gap:"0", marginTop:"4rem", border:"1px solid var(--border)", borderRadius:"20px", background:"var(--s1)", overflow:"hidden", flexWrap:"wrap" }}>
          {[["8","Viral formulas","var(--hot)"],["5","Platforms","var(--electric)"],["3s","Generation","var(--neon)"],["$0","To start","var(--gold)"]].map(([n,l,c])=>(
            <div key={l} style={{ padding:"1.5rem 2rem", textAlign:"center", borderRight:"1px solid var(--border)", minWidth:"120px" }}>
              <div style={{ fontFamily:"var(--fd)", fontSize:"2rem", fontWeight:800, letterSpacing:"-1px", color:c as string }}>{n}</div>
              <div style={{ fontSize:".72rem", color:"var(--muted)", textTransform:"uppercase", letterSpacing:"1.5px", marginTop:"4px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}