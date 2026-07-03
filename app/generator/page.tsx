"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getNiche } from "@/lib/niches";
import { isPro } from "@/lib/plan";
import { NextStep } from "@/components/NextStep";
import { patternHref } from "@/lib/patterns";
import { scoreColor } from "@/lib/score";
import { Icon } from "@/lib/icons";
import { Button, Spinner } from "@/components/ui";
import { PLATFORMS as PLATFORM_MODES, getPlatform } from "@/lib/platforms";
import { BrandIcon, PLATFORM_BRAND } from "@/components/BrandIcon";

// Short-form only — lib/platforms.ts is the source of truth (the old
// LinkedIn/X options contradicted the positioning and had no psychology
// block behind them). Chips render from PLATFORM_MODES with brand marks.
const TONES = ["Authentic", "Shock", "Educational", "Humor", "Authority", "Storytelling"];
const NICHES = ["Fitness", "Finance", "Tech", "Business", "Lifestyle", "Education", "Motivation", "Relationships"];
const GOALS = ["Engagement", "Sales", "Education", "Growth", "Brand awareness", "Lead generation"];
const FREE_DAILY = 10;

interface HookAnalysis { why: string; curiosity: number; emotion: number; clarity: number; }
interface Hook { id: string; text: string; formula: string; platform: string; score: number; hashtags?: string[]; analysis?: HookAnalysis; patternsUsed?: string[]; reasoning?: string; }
interface Script { hook: string; bridge: string; cta: string; }

function getMidnight() { const d = new Date(); d.setDate(d.getDate()+1); d.setHours(0,0,0,0); return d.toISOString(); }
function loadCredits() {
  const raw = localStorage.getItem("hv_credits");
  if (!raw) { const f={count:FREE_DAILY,resetAt:getMidnight()}; localStorage.setItem("hv_credits",JSON.stringify(f)); return f; }
  const s=JSON.parse(raw);
  if (new Date()>=new Date(s.resetAt)) { const r={count:FREE_DAILY,resetAt:getMidnight()}; localStorage.setItem("hv_credits",JSON.stringify(r)); return r; }
  return s;
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={null}>
      <GeneratorInner />
    </Suspense>
  );
}

function GeneratorInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(["TikTok"]);
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

  useEffect(() => {
    setCredits(loadCredits().count);
    setFavorites((JSON.parse(localStorage.getItem("hv_favs")||"[]") as Hook[]).map(f=>f.id));
  }, []);
  useEffect(() => {
    const t = searchParams.get("topic");
    if (t) setTopic(t.slice(0,200));
    // Accept slug ("shorts") or label ("YouTube Shorts") — the SEO platform
    // pages deep-link slugs; previously this param was silently ignored.
    const plat = searchParams.get("platform");
    if (plat) {
      const pm = getPlatform(plat);
      if (pm) setPlatforms([pm.label]);
    }
    const nSlug = searchParams.get("niche");
    if (nSlug) {
      const nm = getNiche(nSlug);
      if (nm) {
        if (NICHES.includes(nm.label)) { setShowCustom(false); setNiche(nm.label); }
        else { setShowCustom(true); setCustomNiche(nm.label); }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if(showCustom) customRef.current?.focus(); }, [showCustom]);

  function spendCredit() {
    const n=Math.max(0,credits-1); setCredits(n);
    const raw=localStorage.getItem("hv_credits"); const s=raw?JSON.parse(raw):{resetAt:getMidnight()};
    localStorage.setItem("hv_credits",JSON.stringify({...s,count:n})); return n;
  }
  function refundCredit() {
    const raw=localStorage.getItem("hv_credits"); const s=raw?JSON.parse(raw):{resetAt:getMidnight(),count:credits};
    const current=typeof s.count==="number"?s.count:credits;
    const n=Math.min(FREE_DAILY,current+1); setCredits(n);
    localStorage.setItem("hv_credits",JSON.stringify({...s,count:n}));
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
    } catch(e:unknown) { setError(e instanceof Error?e.message:"Something went wrong."); refundCredit(); }
    finally { setLoading(false); }
  }

  async function generateScript(hook:Hook) {
    if(!isPro()){setShowModal(true);return;} // Script generator is Pro-only
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
  const creditColor=credits===0?"var(--danger)":credits<=3?"var(--warning)":"var(--success)";

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <div>
        <div style={{borderBottom:"1px solid var(--border)",padding:"2.5rem 1.5rem 2rem",textAlign:"center"}}>
          <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:800,letterSpacing:"-2px",marginBottom:".5rem"}}>
            Hook <span>Generator</span>
          </h1>
          <p style={{color:"var(--soft)",fontWeight:300,fontSize:".95rem"}}>Pick a topic and niche. Get 8 scored hooks with the attention patterns that make each one work.</p>
        </div>

        <div className="page-wrap">

          {/* Credits bar — one line + progress, not four reminders of the limit */}
          <div className="card" style={{padding:"1rem 1.25rem",marginBottom:"12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px",flexWrap:"wrap",gap:"6px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"var(--text-base)",color:creditColor}}>{credits}</span>
                <span style={{fontSize:"var(--text-sm)",color:"var(--text-muted)"}}>/ {FREE_DAILY} free daily credits{credits===0?" — resets at midnight":""}</span>
              </div>
              <Link href="/pricing" style={{fontSize:"var(--text-xs)",color:"var(--accent)",textDecoration:"none",fontFamily:"var(--fb)",fontWeight:500}}>
                Pro is unlimited
              </Link>
            </div>
            <div style={{height:"6px",background:"var(--border)",borderRadius:"6px",overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:"6px",background:creditColor,width:`${creditPct}%`,transition:"width .5s cubic-bezier(.16,1,.3,1)"}} />
            </div>
          </div>

          {/* Topic */}
          <div style={{background:"var(--s1)",border:"1px solid var(--border)",borderRadius:"var(--r3)",overflow:"hidden",marginBottom:"12px",position:"relative"}}>
            <label style={{display:"block",padding:"1.25rem 1.5rem .5rem",fontSize:".68rem",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",fontFamily:"var(--fd)",fontWeight:600}}>Your content</label>
            <textarea value={topic} onChange={e=>setTopic(e.target.value.slice(0,200))} placeholder="e.g. my morning routine that made me 10x more productive without waking up earlier..." rows={4}
              style={{width:"100%",background:"transparent",border:"none",padding:".5rem 1.5rem 2.5rem",color:"var(--text)",fontSize:"1rem",fontFamily:"var(--fb)",resize:"none",lineHeight:1.7,caretColor:"var(--accent)"}} />
            <div style={{position:"absolute",bottom:"1rem",right:"1.25rem",fontSize:".72rem",color:topic.length>180?"var(--hot)":"var(--muted)"}}>{topic.length}/200</div>
          </div>

          {/* Optional knobs — sensible defaults (TikTok, Authentic, Engagement) work for 80% of cases. */}
          <details style={{marginBottom:"12px"}}>
            <summary style={{cursor:"pointer",fontSize:"var(--text-sm)",color:"var(--text-muted)",fontFamily:"var(--fb)",padding:"6px 4px",listStyle:"none",userSelect:"none"}}>
              More options <span style={{opacity:.6}}>(platform, tone, niche, goal)</span>
            </summary>
            <div style={{marginTop:"8px",display:"flex",flexDirection:"column",gap:"12px"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                <Panel label="Platform">{PLATFORM_MODES.map(pm=>(
                  <button key={pm.slug} onClick={()=>togglePlatform(pm.label)} className="chip" data-active={platforms.includes(pm.label)}>
                    <BrandIcon name={PLATFORM_BRAND[pm.slug]} size={13} /> {pm.label}
                  </button>
                ))}</Panel>
                <Panel label="Tone">{TONES.map(t=><Chip key={t} label={t} active={tone===t} onClick={()=>setTone(t)}/>)}</Panel>
              </div>
              <Panel label="Niche (optional)">
                {NICHES.map(n=><Chip key={n} label={n} active={!showCustom&&niche===n} onClick={()=>{setShowCustom(false);setNiche(p=>p===n?"":n);}}/>)}
                <button onClick={()=>{setShowCustom(p=>!p);setNiche("");}} className="chip" data-active={showCustom}><Icon name="pencil"/> Other…</button>
                {showCustom&&<input ref={customRef} value={customNiche} onChange={e=>setCustomNiche(e.target.value)} placeholder="Type your niche..." aria-label="Custom niche" style={{padding:"6px 14px",borderRadius:"var(--r-pill)",border:"1px solid var(--border-strong)",background:"var(--surface)",color:"var(--text)",fontSize:"var(--text-sm)",fontFamily:"var(--fb)",width:"160px",caretColor:"var(--accent)"}}/>}
              </Panel>
              <Panel label="Conversion goal">
                {GOALS.map(g=><Chip key={g} label={g} active={goal===g} onClick={()=>setGoal(g)}/>)}
              </Panel>
            </div>
          </details>

          {/* Generate button */}
          <div style={{marginBottom:"12px"}}>
            <Button onClick={generate} disabled={loading} block>
              {loading
                ? <><Spinner />Generating…</>
                : <><Icon name="zap" /> Generate 8 hooks + hashtags</>
              }
            </Button>
          </div>

          {error && (
            <div style={{background:"var(--danger-soft)",border:"1px solid var(--danger)",color:"var(--danger)",borderRadius:"var(--r-md)",padding:"1rem 1.25rem",marginBottom:"12px",fontSize:"var(--text-sm)"}}>
              {error}
            </div>
          )}

          {hooks.length>0 && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"12px",marginBottom:"12px"}}>
              {hooks.map((h,i)=>(
                <HookCard
                  key={h.id}
                  hook={h}
                  index={i}
                  isFav={favorites.includes(h.id)}
                  copied={copied}
                  expandedHash={expandedHash}
                  expandedAnalysis={expandedAnalysis}
                  onCopy={()=>copyText(h.text,h.id)}
                  onFav={()=>toggleFav(h)}
                  onScript={()=>generateScript(h)}
                  onAnalyze={()=>router.push(`/analyzer?hook=${encodeURIComponent(h.text)}&platform=${encodeURIComponent(h.platform)}`)}
                  onToggleHash={()=>setExpandedHash(prev=>prev===h.id?null:h.id)}
                  onToggleAnalysis={()=>setExpandedAnalysis(prev=>prev===h.id?null:h.id)}
                />
              ))}
            </div>
          )}

          {/* Script panel */}
          {(selectedHook||scriptLoading)&&(
            <div className="card" style={{marginTop:"2rem",padding:"1.75rem",animation:"cardIn .4s ease"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
                <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"var(--text-base)"}}>Script</span>
                <button onClick={()=>{setScript(null);setSelectedHook(null);}} aria-label="Close script" style={{background:"var(--surface-2)",border:"1px solid var(--border-strong)",borderRadius:"50%",width:"28px",height:"28px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-soft)",cursor:"pointer"}}><Icon name="x"/></button>
              </div>
              {scriptLoading?(
                <div style={{textAlign:"center",padding:"2rem"}}>
                  <Spinner size={32} style={{margin:"0 auto 1rem",display:"block"}}/>
                  <div style={{fontSize:"var(--text-sm)",color:"var(--text-soft)"}}>Writing your script…</div>
                </div>
              ):script&&(
                <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                  {([["Hook (0–3s)",script.hook],["Bridge (3–10s)",script.bridge],["Call to action",script.cta]] as [string,string][]).map(([label,content])=>(
                    <div key={label} style={{background:"var(--surface-2)",borderRadius:"var(--r-sm)",padding:"1rem",border:"1px solid var(--border)"}}>
                      <div className="kicker" style={{color:"var(--accent)",marginBottom:".5rem"}}>{label}</div>
                      <p style={{fontSize:"var(--text-sm)",color:"var(--text-soft)",lineHeight:1.7}}>{content}</p>
                      <button onClick={()=>copyText(content,label)} style={{display:"inline-flex",alignItems:"center",gap:"4px",marginTop:".75rem",padding:"5px 14px",borderRadius:"var(--r-pill)",border:"1px solid var(--border-strong)",background:"transparent",color:copied===label?"var(--success)":"var(--text-muted)",fontSize:"var(--text-xs)",cursor:"pointer",fontFamily:"var(--fb)"}}>
                        {copied===label?<><Icon name="check"/> Copied</>:<><Icon name="copy"/> Copy</>}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <NextStep current="generate" />
      </div>

      {showModal&&<UpgradeModal onClose={()=>setShowModal(false)}/>}
    </div>
  );
}

// ── Hook Card Component ──
interface HookCardProps {
  hook: Hook; index: number; isFav: boolean; copied: string|null;
  expandedHash: string|null; expandedAnalysis: string|null;
  onCopy:()=>void; onFav:()=>void; onScript:()=>void; onAnalyze:()=>void;
  onToggleHash:()=>void; onToggleAnalysis:()=>void;
}

function HookCard({ hook, index, isFav, copied, expandedHash, expandedAnalysis, onCopy, onFav, onScript, onAnalyze, onToggleHash, onToggleAnalysis }: HookCardProps) {
  const [hov, setHov] = useState(false);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const showHash = expandedHash === hook.id;
  const showAnalysis = expandedAnalysis === hook.id;

  return (
    <div
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"var(--s1)", border:`1px solid ${hov?"rgba(108,58,255,.45)":"var(--border)"}`, borderRadius:"var(--r3)", padding:"1.4rem", position:"relative", transition:"all .35s cubic-bezier(.16,1,.3,1)", transform:hov?"translateY(-5px)":"none", boxShadow:hov?"0 20px 50px rgba(108,58,255,.15)":"none", animation:`cardIn .5s cubic-bezier(.16,1,.3,1) ${index*0.05}s both` }}
    >
      {/* Formula + actions */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
        <span style={{fontSize:"var(--text-xs)",fontFamily:"var(--fd)",fontWeight:700,padding:"3px 10px",borderRadius:"var(--r-pill)",background:"var(--accent-soft)",color:"var(--accent)"}}>{hook.formula}</span>
        <div style={{display:"flex",gap:"5px",opacity:hov?1:0,transition:"opacity .2s"}}>
          <ActionBtn onClick={onFav} active={isFav} activeColor="var(--warning)" title="Favorite"><Icon name="star" fill={isFav?"currentColor":"none"}/></ActionBtn>
          <ActionBtn onClick={onScript} title="Generate script"><Icon name="play"/></ActionBtn>
        </div>
      </div>

      {/* Attention patterns this hook uses — same vocabulary as Analyzer & Patterns */}
      {hook.patternsUsed && hook.patternsUsed.length > 0 && (
        <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginBottom:hook.reasoning?"6px":"1rem"}}>
          {hook.patternsUsed.map(p => (
            <Link key={p} href={patternHref(p)} title="Learn this pattern"
              style={{fontSize:"var(--text-xs)",padding:"2px 8px",borderRadius:"var(--r-pill)",background:"var(--success-soft)",color:"var(--success)",border:"1px solid var(--success)",textDecoration:"none",fontFamily:"var(--fb)"}}>
              {p}
            </Link>
          ))}
        </div>
      )}

      {/* Why this hook works — 1-sentence rationale from the Generator's
          reasoning field. Mirrors the chips' purpose ("what patterns") with
          the "why those patterns hit, in plain language." Small + italic so
          it reads as auxiliary context, not noise. */}
      {hook.reasoning && (
        <p style={{fontSize:".72rem",lineHeight:1.5,color:"var(--muted)",fontStyle:"italic",marginBottom:"1rem",margin:"0 0 1rem 0"}}>
          {hook.reasoning}
        </p>
      )}

      {/* Text */}
      <p onClick={onCopy} style={{fontSize:".9rem",lineHeight:1.75,color:hov?"var(--text)":"var(--soft)",marginBottom:"1rem",cursor:"pointer",transition:"color .2s"}}>{hook.text}</p>

      {/* Bottom row */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:".875rem"}}>
        <span style={{fontSize:"var(--text-xs)",padding:"3px 9px",borderRadius:"var(--r-sm)",background:"var(--surface-3)",color:"var(--text-soft)"}}>{hook.platform}</span>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:"1.4rem",fontWeight:700,letterSpacing:"-1px",color:scoreColor(hook.score),lineHeight:1}}>{hook.score}</div>
          <div style={{fontSize:".6rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1px"}}>/100</div>
        </div>
      </div>

      {/* Score bar */}
      <div style={{height:"3px",background:"var(--surface-3)",borderRadius:"3px",overflow:"hidden",marginBottom:"1rem"}}>
        <div style={{height:"100%",borderRadius:"3px",background:scoreColor(hook.score),width:`${hook.score}%`,transition:"width .8s cubic-bezier(.16,1,.3,1)"}}/>
      </div>

      {/* Hashtags toggle */}
      {hook.hashtags&&hook.hashtags.length>0&&(
        <div style={{marginBottom:"6px"}}>
          <button onClick={onToggleHash} aria-expanded={showHash} style={{padding:"4px 12px",borderRadius:"var(--r-pill)",border:"1px solid var(--border-strong)",background:showHash?"var(--surface-2)":"transparent",color:"var(--text-soft)",fontSize:"var(--text-xs)",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s",display:"flex",alignItems:"center",gap:"5px"}}>
            <Icon name="hash"/> Hashtags <Icon name="chevron-down" style={{transform:showHash?"rotate(180deg)":"none",transition:"transform .15s ease"}}/>
          </button>
          {showHash&&(
            <div style={{marginTop:"8px",display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {hook.hashtags.map(tag=>(
                <button key={tag} onClick={async()=>{await navigator.clipboard.writeText(tag).catch(()=>{}); setCopiedTag(tag); setTimeout(()=>setCopiedTag(c=>c===tag?null:c),1200);}}
                  style={{padding:"3px 9px",borderRadius:"var(--r-sm)",background:copiedTag===tag?"var(--success-soft)":"var(--surface-2)",border:"1px solid var(--border)",color:copiedTag===tag?"var(--success)":"var(--text-soft)",fontSize:"var(--text-xs)",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s"}}>
                  {tag}
                </button>
              ))}
              <button onClick={async()=>{await navigator.clipboard.writeText(hook.hashtags!.join(" ")).catch(()=>{});}} style={{padding:"3px 9px",borderRadius:"var(--r-sm)",background:"var(--accent-soft)",border:"1px solid var(--accent)",color:"var(--accent)",fontSize:"var(--text-xs)",cursor:"pointer",fontFamily:"var(--fb)"}}>Copy all</button>
            </div>
          )}
        </div>
      )}

      {/* Analysis toggle */}
      {hook.analysis&&(
        <div>
          <button onClick={onToggleAnalysis} aria-expanded={showAnalysis} style={{padding:"4px 12px",borderRadius:"var(--r-pill)",border:"1px solid var(--border-strong)",background:showAnalysis?"var(--surface-2)":"transparent",color:"var(--text-soft)",fontSize:"var(--text-xs)",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s",display:"flex",alignItems:"center",gap:"5px"}}>
            Analysis <Icon name="chevron-down" style={{transform:showAnalysis?"rotate(180deg)":"none",transition:"transform .15s ease"}}/>
          </button>
          {showAnalysis&&(
            <div style={{marginTop:"10px",background:"var(--surface-2)",borderRadius:"var(--r-sm)",padding:".875rem",border:"1px solid var(--border)"}}>
              <p style={{fontSize:"var(--text-xs)",color:"var(--text-soft)",lineHeight:1.65,marginBottom:".75rem",fontStyle:"italic"}}>{hook.analysis.why}</p>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                {([["Curiosity",hook.analysis.curiosity],["Emotion",hook.analysis.emotion],["Clarity",hook.analysis.clarity]] as [string,number][]).map(([label,val])=>(
                  <div key={label} style={{flex:1,minWidth:"70px"}}>
                    <div className="kicker" style={{fontSize:".7rem",marginBottom:"4px"}}>{label}</div>
                    <div style={{height:"4px",background:"var(--border)",borderRadius:"4px",overflow:"hidden"}}>
                      <div style={{height:"100%",background:scoreColor(val*10),borderRadius:"4px",width:`${val*10}%`,transition:"width .6s ease"}}/>
                    </div>
                    <div style={{fontSize:"var(--text-xs)",color:scoreColor(val*10),fontFamily:"var(--fd)",fontWeight:700,marginTop:"3px"}}>{val}/10</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deep analyze — sends this hook to the full Analyzer */}
      <button onClick={onAnalyze}
        style={{marginTop:"12px",width:"100%",padding:"9px",borderRadius:"var(--r-pill)",border:"1px solid var(--accent)",background:hov?"var(--accent-soft)":"transparent",color:"var(--accent)",fontSize:"var(--text-xs)",cursor:"pointer",fontFamily:"var(--fb)",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
        Deep retention analysis <Icon name="arrow-right"/>
      </button>

      {copied===hook.id&&<div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"var(--success-soft)",border:"1px solid var(--success)",color:"var(--success)",padding:"8px 20px",borderRadius:"var(--r-pill)",fontSize:"var(--text-xs)",fontFamily:"var(--fd)",fontWeight:700,pointerEvents:"none",zIndex:10,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:"5px"}}><Icon name="check"/> Copied</div>}
    </div>
  );
}

function ActionBtn({ onClick, active, activeColor, title, children }: { onClick:()=>void; active?:boolean; activeColor?:string; title?:string; children:React.ReactNode }) {
  return (
    <button onClick={e=>{e.stopPropagation();onClick();}} title={title} aria-label={title}
      style={{width:"26px",height:"26px",borderRadius:"50%",border:"1px solid var(--border-strong)",background:"var(--surface-2)",color:active&&activeColor?activeColor:"var(--text-muted)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"color .2s"}}>
      {children}
    </button>
  );
}

function Panel({ label, children, style }: { label:string; children:React.ReactNode; style?:React.CSSProperties }) {
  return (
    <div className="card" style={{padding:"1.25rem",...style}}>
      <div className="kicker" style={{marginBottom:".75rem"}}>{label}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{children}</div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} className="chip" data-active={active}>
      {label}
    </button>
  );
}

function UpgradeModal({ onClose }: { onClose:()=>void }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(16,16,25,.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="card" style={{borderRadius:"var(--r-lg)",padding:"2.5rem",maxWidth:"440px",width:"100%",position:"relative",animation:"cardIn .4s cubic-bezier(.16,1,.3,1)"}}>
        <button onClick={onClose} aria-label="Close" style={{position:"absolute",top:"1.25rem",right:"1.25rem",background:"var(--surface-2)",border:"1px solid var(--border-strong)",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-soft)",cursor:"pointer"}}><Icon name="x"/></button>
        <h3 style={{fontFamily:"var(--fd)",fontSize:"var(--text-xl)",fontWeight:800,marginBottom:".5rem"}}>You&apos;ve used today&apos;s free credits</h3>
        <p style={{color:"var(--text-soft)",fontSize:"var(--text-sm)",marginBottom:"1.75rem",lineHeight:1.7}}>Credits reset at midnight. Pro removes the daily limit — unlimited hooks, scripts, hashtags and analysis.</p>
        <Link href="/pricing" className="btn btn-primary btn-md btn-block" style={{marginBottom:"10px"}}>See all plans</Link>
        <Button onClick={onClose} variant="secondary" block>Continue with free</Button>
      </div>
    </div>
  );
}