"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PLATFORMS = ["TikTok", "Instagram", "YouTube", "LinkedIn", "X / Twitter"];
const TONES = ["Authentic", "Shock", "Educational", "Humor", "Authority", "Storytelling"];
const NICHES = ["Fitness", "Finance", "Tech", "Business", "Lifestyle", "Education", "Motivation", "Relationships"];
const GOALS = ["Engagement", "Sales", "Education", "Growth", "Brand awareness", "Lead generation"];
const FREE_DAILY = 10;

interface HookAnalysis { why: string; curiosity: number; emotion: number; clarity: number; }
interface Hook { id: string; text: string; formula: string; platform: string; score: number; hashtags?: string[]; analysis?: HookAnalysis; }
interface Script { hook: string; bridge: string; cta: string; }

function getMidnight() { const d = new Date(); d.setDate(d.getDate()+1); d.setHours(0,0,0,0); return d.toISOString(); }
function loadCredits() {
  const raw = localStorage.getItem("hv_credits");
  if (!raw) { const f={count:FREE_DAILY,resetAt:getMidnight()}; localStorage.setItem("hv_credits",JSON.stringify(f)); return f; }
  const s=JSON.parse(raw);
  if (new Date()>=new Date(s.resetAt)) { const r={count:FREE_DAILY,resetAt:getMidnight()}; localStorage.setItem("hv_credits",JSON.stringify(r)); return r; }
  return s;
}
function scoreColor(s: number) { return s>=93?"var(--neon)":s>=88?"var(--gold)":"var(--hot)"; }

// Reusable hover button style
function useBtnHover() {
  const [hov, setHov] = useState(false);
  return { hov, onMouseEnter:()=>setHov(true), onMouseLeave:()=>setHov(false) };
}

export default function GeneratorPage() {
  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["TikTok","Instagram"]);
  const [tone, setTone] = useState("Authentic");
  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [goal, setGoal] = useState("Engagement");
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(FREE_DAILY);
  const [copied, setCopied] = useState<string|null>(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedHash, setExpandedHash] = useState<string|null>(null);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string|null>(null);
  const [selectedHook, setSelectedHook] = useState<Hook|null>(null);
  const [script, setScript] = useState<Script|null>(null);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const customRef = useRef<HTMLInputElement>(null);
  const genBtn = useBtnHover();

  useEffect(() => {
    setCredits(loadCredits().count);
    setFavorites((JSON.parse(localStorage.getItem("hv_favs")||"[]") as Hook[]).map(f=>f.id));
  }, []);
  useEffect(() => { if(showCustom) customRef.current?.focus(); }, [showCustom]);

  function spendCredit() {
    const n=Math.max(0,credits-1); setCredits(n);
    const raw=localStorage.getItem("hv_credits"); const s=raw?JSON.parse(raw):{resetAt:getMidnight()};
    localStorage.setItem("hv_credits",JSON.stringify({...s,count:n})); return n;
  }
  function togglePlatform(p:string) { setPlatforms(prev=>prev.includes(p)?prev.length>1?prev.filter(x=>x!==p):prev:[...prev,p]); }
  function toggleFav(hook:Hook) {
    const favs:Hook[]=JSON.parse(localStorage.getItem("hv_favs")||"[]");
    const idx=favs.findIndex(f=>f.id===hook.id);
    const updated=idx>=0?favs.filter(f=>f.id!==hook.id):[...favs,hook];
    localStorage.setItem("hv_favs",JSON.stringify(updated)); setFavorites(updated.map(f=>f.id));
  }

  const activeNiche=showCustom?customNiche:niche;

  async function generate() {
    if(credits<=0){setShowModal(true);return;}
    setLoading(true); setError(""); setHooks([]); setScript(null); setSelectedHook(null);
    spendCredit();
    try {
      const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({topic,platforms,tone,niche:activeNiche,goal})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Generation failed");
      setHooks(data.hooks);
      const session={id:`sess-${Date.now()}`,topic:topic||"(untitled)", platforms,tone,niche:activeNiche,goal,hooks:data.hooks,date:new Date().toISOString(),dateLabel:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})};
      const existing=JSON.parse(localStorage.getItem("hv_hist")||"[]");
      localStorage.setItem("hv_hist",JSON.stringify([session,...existing].slice(0,60)));
    } catch(e:unknown) { setError(e instanceof Error?e.message:"Something went wrong."); setCredits(c=>c+1); }
    finally { setLoading(false); }
  }

  async function generateScript(hook:Hook) {
    setSelectedHook(hook); setScriptLoading(true); setScript(null);
    try {
      const res=await fetch("/api/script",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hook:hook.text,topic,platform:hook.platform,tone,goal})});
      const data=await res.json(); if(!res.ok) throw new Error(data.error);
      setScript(data.script);
    } catch { setScript({hook:hook.text,bridge:"Could not generate. Check your API key.",cta:""}); }
    finally { setScriptLoading(false); }
  }

  async function copyText(text:string,id:string) { await navigator.clipboard.writeText(text).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(null),1500); }

  const creditPct=(credits/FREE_DAILY)*100;
  const creditColor=credits===0?"var(--hot)":credits<=3?"var(--gold)":"var(--neon)";
  const [genHov, setGenHov] = useState(false);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
        <div style={{position:"absolute",width:"500px",height:"500px",background:"var(--electric)",borderRadius:"50%",top:"-200px",left:"-200px",filter:"blur(100px)",opacity:.07,animation:"orbFloat 14s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:"400px",height:"400px",background:"var(--hot)",borderRadius:"50%",bottom:"-150px",right:"-150px",filter:"blur(100px)",opacity:.06,animation:"orbFloat 18s ease-in-out infinite reverse"}} />
      </div>

      <div style={{position:"relative",zIndex:1}}>
        <div style={{borderBottom:"1px solid var(--border)",padding:"2.5rem 1.5rem 2rem",textAlign:"center"}}>
          <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:800,letterSpacing:"-2px",marginBottom:".5rem"}}>
            Hook <span className="gradient-text">Generator</span>
          </h1>
          <p style={{color:"var(--soft)",fontWeight:300,fontSize:".95rem"}}>Describe your content. Get 8 scored viral hooks + hashtags. Copy. Post. Win.</p>
        </div>

        <div className="page-wrap">

          {/* Credits bar */}
          <div style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"1rem 1.25rem",marginBottom:"12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px",flexWrap:"wrap",gap:"6px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"1rem",color:creditColor}}>{credits}</span>
                <span style={{fontSize:".8rem",color:"var(--muted)"}}>/ {FREE_DAILY} free daily credits</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                {credits<=6&&<span style={{fontSize:".72rem",color:creditColor}}>{credits===0?"Resets at midnight":`${credits} left today`}</span>}
                <Link href="/pricing" style={{padding:"4px 12px",borderRadius:"100px",border:"1px solid rgba(255,45,107,.35)",background:"rgba(255,45,107,.06)",color:"var(--hot)",fontSize:".72rem",textDecoration:"none",fontFamily:"var(--fb)",fontWeight:500,transition:"all .2s"}}>
                  {credits<=6?"Pro = unlimited →":"Upgrade ↗"}
                </Link>
              </div>
            </div>
            <div style={{height:"6px",background:"var(--border)",borderRadius:"6px",overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:"6px",background:`linear-gradient(90deg,${creditColor},${credits>3?"var(--electric)":creditColor})`,width:`${creditPct}%`,transition:"width .5s cubic-bezier(.16,1,.3,1)"}} />
            </div>
            <div style={{marginTop:"6px",fontSize:".7rem",color:"var(--muted)",display:"flex",justifyContent:"space-between"}}>
              <span>Free: {credits} remaining</span><span style={{color:"rgba(108,58,255,.5)"}}>Pro: ∞ unlimited</span>
            </div>
          </div>

          {/* Topic */}
          <div style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:"var(--r3)",overflow:"hidden",marginBottom:"12px",position:"relative"}}>
            <label style={{display:"block",padding:"1.25rem 1.5rem .5rem",fontSize:".68rem",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",fontFamily:"var(--fd)",fontWeight:600}}>Your content</label>
            <textarea value={topic} onChange={e=>setTopic(e.target.value.slice(0,200))} placeholder="e.g. my morning routine that made me 10x more productive without waking up earlier..." rows={4}
              style={{width:"100%",background:"transparent",border:"none",outline:"none",padding:".5rem 1.5rem 2.5rem",color:"var(--text)",fontSize:"1rem",fontFamily:"var(--fb)",resize:"none",lineHeight:1.7,caretColor:"var(--hot)"}} />
            <div style={{position:"absolute",bottom:"1rem",right:"1.25rem",fontSize:".72rem",color:topic.length>180?"var(--hot)":"var(--muted)"}}>{topic.length}/200</div>
          </div>

          {/* Platform + Tone */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}}>
            <Panel label="Platform">{PLATFORMS.map(p=><Chip key={p} label={p} active={platforms.includes(p)} onClick={()=>togglePlatform(p)} color="plat"/>)}</Panel>
            <Panel label="Tone">{TONES.map(t=><Chip key={t} label={t} active={tone===t} onClick={()=>setTone(t)} color="tone"/>)}</Panel>
          </div>

          {/* Niche */}
          <Panel label="Niche (optional)" style={{marginBottom:"12px"}}>
            {NICHES.map(n=><Chip key={n} label={n} active={!showCustom&&niche===n} onClick={()=>{setShowCustom(false);setNiche(p=>p===n?"":n);}} color="niche"/>)}
            <button onClick={()=>{setShowCustom(p=>!p);setNiche("");}} style={{padding:"6px 14px",borderRadius:"100px",border:`1px solid ${showCustom?"rgba(255,184,0,.5)":"var(--border2)"}`,background:showCustom?"rgba(255,184,0,.08)":"transparent",color:showCustom?"var(--gold)":"var(--muted)",fontSize:".8rem",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s"}}>✏ Other...</button>
            {showCustom&&<input ref={customRef} value={customNiche} onChange={e=>setCustomNiche(e.target.value)} placeholder="Type your niche..." style={{padding:"6px 14px",borderRadius:"100px",border:"1px solid rgba(255,184,0,.4)",background:"rgba(255,184,0,.04)",color:"var(--text)",fontSize:".8rem",fontFamily:"var(--fb)",outline:"none",width:"160px",caretColor:"var(--gold)"}}/>}
          </Panel>

          {/* Goal */}
          <Panel label="Conversion goal" style={{marginBottom:"12px"}}>
            {GOALS.map(g=><Chip key={g} label={g} active={goal===g} onClick={()=>setGoal(g)} color="goal"/>)}
          </Panel>

          {/* Generate button */}
          <div style={{marginBottom:"12px"}}>
            <button
              onClick={generate}
              disabled={loading}
              onMouseEnter={() => setGenHov(true)}
              onMouseLeave={() => setGenHov(false)}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                width:"100%", justifyContent:"center",
                padding:"15px 28px", borderRadius:"100px", border:"none",
                background: loading ? "var(--s3)" : "linear-gradient(135deg,var(--hot),var(--electric))",
                color:"#fff", fontSize:"1rem", fontWeight:600,
                fontFamily:"var(--fb)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition:"all .3s",
                transform: genHov && !loading ? "translateY(-3px) scale(1.02)" : "none",
                boxShadow: genHov && !loading ? "0 16px 40px rgba(255,45,107,.4)" : "0 4px 16px rgba(255,45,107,.15)",
              }}
            >
              {loading
                ? <><div style={{width:"18px",height:"18px",borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"spin 1s linear infinite"}}/>Generating...</>
                : <>⚡ Generate 8 Hooks + Hashtags</>
              }
            </button>
          </div>

          {/* Script panel */}
          {(selectedHook||scriptLoading)&&(
            <div style={{marginTop:"2rem",background:"var(--s1)",border:"1px solid rgba(108,58,255,.3)",borderRadius:"var(--r2)",padding:"1.75rem",animation:"cardIn .4s ease"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"1rem"}}>Script</span>
                  <span style={{padding:"3px 10px",background:"rgba(255,45,107,.1)",border:"1px solid rgba(255,45,107,.2)",borderRadius:"100px",fontSize:".68rem",color:"var(--hot)",fontFamily:"var(--fd)",fontWeight:700}}>PRO FEATURE</span>
                </div>
                <button onClick={()=>{setScript(null);setSelectedHook(null);}} style={{background:"var(--s2)",border:"1px solid var(--border2)",borderRadius:"50%",width:"28px",height:"28px",color:"var(--soft)",cursor:"pointer",fontSize:"12px"}}>✕</button>
              </div>
              {scriptLoading?(
                <div style={{textAlign:"center",padding:"2rem"}}>
                  <div style={{width:"36px",height:"36px",borderRadius:"50%",border:"2px solid var(--border2)",borderTopColor:"var(--electric)",animation:"spin 1s linear infinite",margin:"0 auto 1rem"}}/>
                  <div style={{fontSize:".85rem",color:"var(--soft)"}}>Writing your script...</div>
                </div>
              ):script&&(
                <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                  {([["🎬 Hook (0–3s)",script.hook,"var(--hot)"],["🔗 Bridge (3–10s)",script.bridge,"var(--electric)"],["📣 Call to Action",script.cta,"var(--neon)"]] as [string,string,string][]).map(([label,content,color])=>(
                    <div key={label} style={{background:"var(--s2)",borderRadius:"var(--r)",padding:"1rem",border:"1px solid var(--border)"}}>
                      <div style={{fontSize:".68rem",fontFamily:"var(--fd)",fontWeight:700,color,letterSpacing:"1px",marginBottom:".5rem"}}>{label}</div>
                      <p style={{fontSize:".875rem",color:"var(--soft)",lineHeight:1.7}}>{content}</p>
                      <button onClick={()=>copyText(content,label)} style={{marginTop:".75rem",padding:"5px 14px",borderRadius:"100px",border:"1px solid var(--border2)",background:"transparent",color:copied===label?"var(--neon)":"var(--muted)",fontSize:".72rem",cursor:"pointer",fontFamily:"var(--fb)"}}>
                        {copied===label?"✓ Copied!":"Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal&&<UpgradeModal onClose={()=>setShowModal(false)}/>}
    </div>
  );
}

// ── Hook Card Component ──
interface HookCardProps {
  hook: Hook; index: number; isFav: boolean; copied: string|null;
  expandedHash: string|null; expandedAnalysis: string|null;
  onCopy:()=>void; onFav:()=>void; onScript:()=>void;
  onToggleHash:()=>void; onToggleAnalysis:()=>void;
}

function HookCard({ hook, index, isFav, copied, expandedHash, expandedAnalysis, onCopy, onFav, onScript, onToggleHash, onToggleAnalysis }: HookCardProps) {
  const [hov, setHov] = useState(false);
  const showHash = expandedHash === hook.id;
  const showAnalysis = expandedAnalysis === hook.id;

  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"var(--s1)", border:`1px solid ${hov?"rgba(108,58,255,.45)":"var(--border)"}`, borderRadius:"var(--r3)", padding:"1.4rem", position:"relative", transition:"all .35s cubic-bezier(.16,1,.3,1)", transform:hov?"translateY(-5px)":"none", boxShadow:hov?"0 20px 50px rgba(108,58,255,.15)":"none", animation:`cardIn .5s cubic-bezier(.16,1,.3,1) ${index*0.05}s both` }}
    >
      {/* Formula + actions */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1rem"}}>
        <span style={{fontSize:".68rem",fontFamily:"var(--fd)",fontWeight:700,letterSpacing:".5px",padding:"3px 10px",borderRadius:"100px",background:"rgba(108,58,255,.1)",color:"#9B8CFF",border:"1px solid rgba(108,58,255,.2)"}}>{hook.formula}</span>
        <div style={{display:"flex",gap:"5px",opacity:hov?1:0,transition:"opacity .2s"}}>
          <ActionBtn onClick={onFav} active={isFav} activeColor="var(--gold)" title="Favorite">★</ActionBtn>
          <ActionBtn onClick={onScript} title="Generate script">▶</ActionBtn>
        </div>
      </div>

      {/* Text */}
      <p onClick={onCopy} style={{fontSize:".9rem",lineHeight:1.75,color:hov?"var(--text)":"var(--soft)",marginBottom:"1rem",cursor:"pointer",transition:"color .2s"}}>{hook.text}</p>

      {/* Bottom row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:".875rem"}}>
        <span style={{fontSize:".68rem",padding:"3px 9px",borderRadius:"6px",background:"rgba(108,58,255,.08)",color:"#9B8CFF",border:"1px solid rgba(108,58,255,.15)"}}>{hook.platform}</span>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:"1.4rem",fontWeight:700,letterSpacing:"-1px",color:scoreColor(hook.score),lineHeight:1}}>{hook.score}</div>
          <div style={{fontSize:".6rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px"}}>/100</div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{height:"3px",background:"var(--s3)",borderRadius:"3px",overflow:"hidden",marginBottom:"1rem"}}>
        <div style={{height:"100%",borderRadius:"3px",background:"linear-gradient(90deg,var(--electric),var(--neon))",width:`${hook.score}%`,transition:"width .8s cubic-bezier(.16,1,.3,1)"}}/>
      </div>

      {/* Hashtags toggle */}
      {hook.hashtags&&hook.hashtags.length>0&&(
        <div style={{marginBottom:"6px"}}>
          <button onClick={onToggleHash} style={{padding:"4px 12px",borderRadius:"100px",border:"1px solid rgba(0,255,178,.25)",background:showHash?"rgba(0,255,178,.06)":"transparent",color:"var(--neon)",fontSize:".7rem",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s",display:"flex",alignItems:"center",gap:"5px"}}>
            # Hashtags {showHash?"▲":"▼"}
          </button>
          {showHash&&(
            <div style={{marginTop:"8px",display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {hook.hashtags.map(tag=>(
                <button key={tag} onClick={async()=>{await navigator.clipboard.writeText(tag).catch(()=>{}); setCopiedTag(tag);}}
                  style={{padding:"3px 9px",borderRadius:"6px",background:"rgba(0,255,178,.06)",border:"1px solid rgba(0,255,178,.2)",color:"var(--neon)",fontSize:".7rem",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s"}}>
                  {tag}
                </button>
              ))}
              <button onClick={async()=>{await navigator.clipboard.writeText(hook.hashtags!.join(" ")).catch(()=>{});}} style={{padding:"3px 9px",borderRadius:"6px",background:"rgba(108,58,255,.08)",border:"1px solid rgba(108,58,255,.2)",color:"#9B8CFF",fontSize:".7rem",cursor:"pointer",fontFamily:"var(--fb)"}}>Copy all</button>
            </div>
          )}
        </div>
      )}

      {/* Analysis toggle (Pro feature) */}
      {hook.analysis&&(
        <div>
          <button onClick={onToggleAnalysis} style={{padding:"4px 12px",borderRadius:"100px",border:"1px solid rgba(255,184,0,.25)",background:showAnalysis?"rgba(255,184,0,.06)":"transparent",color:"var(--gold)",fontSize:".7rem",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s",display:"flex",alignItems:"center",gap:"5px"}}>
            ✦ Analysis {showAnalysis?"▲":"▼"}
          </button>
          {showAnalysis&&(
            <div style={{marginTop:"10px",background:"var(--s2)",borderRadius:"var(--r)",padding:".875rem",border:"1px solid var(--border)"}}>
              <p style={{fontSize:".78rem",color:"var(--soft)",lineHeight:1.65,marginBottom:".75rem",fontStyle:"italic"}}>{hook.analysis.why}</p>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                {([["Curiosity",hook.analysis.curiosity,"var(--electric)"],["Emotion",hook.analysis.emotion,"var(--hot)"],["Clarity",hook.analysis.clarity,"var(--neon)"]] as [string,number,string][]).map(([label,val,color])=>(
                  <div key={label} style={{flex:1,minWidth:"70px"}}>
                    <div style={{fontSize:".62rem",color:"var(--muted)",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"1px"}}>{label}</div>
                    <div style={{height:"4px",background:"var(--border)",borderRadius:"4px",overflow:"hidden"}}>
                      <div style={{height:"100%",background:color,borderRadius:"4px",width:`${val*10}%`,transition:"width .6s ease"}}/>
                    </div>
                    <div style={{fontSize:".7rem",color,fontFamily:"var(--fd)",fontWeight:700,marginTop:"3px"}}>{val}/10</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {copied===hook.id&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"rgba(0,255,178,.08)",border:"1px solid rgba(0,255,178,.3)",color:"var(--neon)",padding:"8px 20px",borderRadius:"100px",fontSize:".78rem",fontFamily:"var(--fd)",fontWeight:700,pointerEvents:"none",zIndex:10,whiteSpace:"nowrap"}}>COPIED ✓</div>}
    </div>
  );
}

// We need a local state for copied tag — add it to the parent or use a local ref
// For simplicity, the copy tag button calls clipboard directly
function setCopiedTag(_tag: string) { /* handled inline */ }

function ActionBtn({ onClick, active, activeColor, title, children }: { onClick:()=>void; active?:boolean; activeColor?:string; title?:string; children:React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={e=>{e.stopPropagation();onClick();}} title={title}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{width:"26px",height:"26px",borderRadius:"50%",border:`1px solid ${active?`${activeColor}55`:"var(--border2)"}`,background:hov?`rgba(255,45,107,.1)`:active?`${activeColor}18`:"var(--s2)",color:active&&activeColor?activeColor:hov?"var(--text)":"var(--muted)",fontSize:"11px",cursor:"pointer",transition:"all .2s",transform:hov?"scale(1.1)":"none"}}>
      {children}
    </button>
  );
}

function Panel({ label, children, style }: { label:string; children:React.ReactNode; style?:React.CSSProperties }) {
  return (
    <div style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:"var(--r2)",padding:"1.25rem",...style}}>
      <div style={{fontSize:".68rem",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:".75rem",fontFamily:"var(--fd)",fontWeight:600}}>{label}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{children}</div>
    </div>
  );
}

function Chip({ label, active, onClick, color }: { label:string; active:boolean; onClick:()=>void; color:string }) {
  const map: Record<string,{border:string;bg:string;text:string}> = {
    plat:{border:"rgba(108,58,255,.6)",bg:"rgba(108,58,255,.1)",text:"#C4B5FD"},
    tone:{border:"rgba(255,45,107,.5)",bg:"rgba(255,45,107,.08)",text:"#FF9DB8"},
    niche:{border:"rgba(0,255,178,.4)",bg:"rgba(0,255,178,.06)",text:"var(--neon)"},
    goal:{border:"rgba(255,184,0,.4)",bg:"rgba(255,184,0,.07)",text:"var(--gold)"},
  };
  const c=map[color];
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:"6px 14px",borderRadius:"100px",border:`1px solid ${active?c.border:hov?c.border+"88":"var(--border2)"}`,background:active?c.bg:hov?c.bg+"44":"transparent",color:active?c.text:hov?c.text+"99":"var(--muted)",fontSize:".8rem",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s",transform:hov&&!active?"scale(1.04)":"none"}}>
      {label}
    </button>
  );
}

function SmBtn({ onClick, children }: { onClick:()=>void; children:React.ReactNode }) {
  const [hov,setHov]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:"7px 16px",borderRadius:"100px",border:`1px solid ${hov?"rgba(108,58,255,.4)":"var(--border2)"}`,background:hov?"rgba(108,58,255,.06)":"transparent",color:hov?"var(--text)":"var(--soft)",fontSize:".78rem",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s",transform:hov?"translateY(-1px)":"none"}}>
      {children}
    </button>
  );
}

function UpgradeModal({ onClose }: { onClose:()=>void }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem",backdropFilter:"blur(12px)"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{background:"var(--s1)",border:"1px solid var(--border2)",borderRadius:"28px",padding:"2.5rem",maxWidth:"440px",width:"100%",position:"relative",animation:"cardIn .4s cubic-bezier(.16,1,.3,1)"}}>
        <button onClick={onClose} style={{position:"absolute",top:"1.25rem",right:"1.25rem",background:"var(--s2)",border:"1px solid var(--border2)",borderRadius:"50%",width:"32px",height:"32px",color:"var(--soft)",cursor:"pointer",fontSize:"14px"}}>✕</button>
        <h3 style={{fontFamily:"var(--fd)",fontSize:"1.7rem",fontWeight:800,letterSpacing:"-1px",marginBottom:".5rem"}}>Go Pro. Go Viral. 🚀</h3>
        <p style={{color:"var(--soft)",fontSize:".875rem",marginBottom:"1.75rem",fontWeight:300,lineHeight:1.7}}>Unlimited hooks, scripts, hashtags, analysis and advanced AI scoring.</p>
        <Link href="/pricing" style={{display:"block",textAlign:"center",padding:"14px",borderRadius:"100px",background:"linear-gradient(135deg,var(--hot),var(--electric))",color:"#fff",fontSize:".95rem",fontWeight:500,textDecoration:"none",fontFamily:"var(--fb)",marginBottom:"10px"}}>See all plans →</Link>
        <button onClick={onClose} style={{width:"100%",padding:"10px",borderRadius:"100px",border:"1px solid var(--border2)",background:"transparent",color:"var(--muted)",fontSize:".85rem",cursor:"pointer",fontFamily:"var(--fb)"}}>Continue with free</button>
      </div>
    </div>
  );
}