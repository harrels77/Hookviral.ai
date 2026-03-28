import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{borderTop:"1px solid var(--border)",marginTop:"2.5rem",padding:"1.25rem 1.5rem",textAlign:"center",background:"transparent"}}>
      <div style={{maxWidth:"960px",margin:"0 auto",display:"flex",justifyContent:"center",gap:"12px",alignItems:"center",flexWrap:"wrap"}}>
        <Link href="/terms" style={{fontSize:".85rem",color:"var(--muted)",textDecoration:"none"}}>Terms</Link>
        <span style={{color:"var(--muted)"}}>•</span>
        <Link href="/privacy" style={{fontSize:".85rem",color:"var(--muted)",textDecoration:"none"}}>Privacy</Link>
        <span style={{color:"var(--muted)"}}>•</span>
        <span style={{fontSize:".85rem",color:"var(--muted)"}}>© {new Date().getFullYear()} HookViral</span>
      </div>
    </footer>
  );
}