"use client";

import Link from "next/link";
import { useState } from "react";

const REVIEWS = [
  { name:"Sofia L.", handle:"@sofiacreates · 48k followers", avatar:"SL", color:"var(--hot)", text:"I use HookViral before every single TikTok. My views tripled in 2 weeks. The virality score is the secret weapon — I only post 90+ hooks now.", stars:5 },
  { name:"Marc K.", handle:"Social Media Manager", avatar:"MK", color:"var(--electric)", text:"I manage 12 clients. The Agency plan saves me 3 hours a day minimum. The hashtag generator alone is worth the price. Clear ROI from day one.", stars:5 },
  { name:"Aïcha R.", handle:"Finance YouTuber · 22k subs", avatar:"AR", color:"var(--neon)", text:"I used to spend 30 minutes on hooks. Now it's 30 seconds. The quality is honestly better than what I wrote myself. The script feature is insane.", stars:5 },
  { name:"Thomas B.", handle:"@fitwithtom · Instagram", avatar:"TB", color:"var(--gold)", text:"The platform-specific hooks are what got me. TikTok hooks are totally different from LinkedIn. HookViral gets that. Nothing else does.", stars:5 },
  { name:"Camille D.", handle:"Content Creator · Paris", avatar:"CD", color:"var(--hot)", text:"The analysis feature (Pro) shows me WHY each hook works. I actually learned copywriting just by using this tool. It's educational and practical.", stars:5 },
  { name:"Jake M.", handle:"@jakegrowth · 91k on X", avatar:"JM", color:"var(--electric)", text:"I tested every hook generator out there. HookViral is the only one that doesn't feel like ChatGPT wrote it. The hooks sound like a real creator.", stars:5 },
  { name:"Léa T.", handle:"Lifestyle Influencer", avatar:"LT", color:"var(--neon)", text:"Started with free tier, upgraded to Pro after 3 days. The unlimited generations + history is exactly what I needed for batch content creation.", stars:5 },
  { name:"Ryan C.", handle:"SaaS Founder · LinkedIn", avatar:"RC", color:"var(--gold)", text:"LinkedIn hooks are notoriously hard to write. HookViral's authority and contrarian formulas are perfectly calibrated for professional content.", stars:5 },
  { name:"Nina S.", handle:"@ninaeats · Food TikTok", avatar:"NS", color:"var(--hot)", text:"The hashtag suggestions are fire. They mix trending + niche perfectly. My reach doubled in the first week after using the recommended hashtags.", stars:5 },
];

function HoverBtn({ href, primary, children, style }: { href:string; primary?:boolean; children:React.ReactNode; style?:React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={href} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"inline-flex",alignItems:"center",gap:"8px",padding:"16px 36px",borderRadius:"100px",textDecoration:"none",fontFamily:"var(--fb)",fontSize:"1rem",fontWeight:500,transition:"all .3s",
        ...(primary ? {
          background:"linear-gradient(135deg,var(--hot),var(--electric))",color:"#fff",
          transform:hov?"translateY(-3px) scale(1.03)":"none",
          boxShadow:hov?"0 20px 50px rgba(255,45,107,.45)":"0 4px 16px rgba(255,45,107,.2)",
        } : {
          border:"1px solid var(--border2)",color:hov?"var(--text)":"var(--soft)",
          background:hov?"var(--s2)":"transparent",
          transform:hov?"translateY(-2px)":"none",
        }),
        ...style
      }}>
      {children}
    </Link>
  );
}

function StarRating({ n }: { n:number }) {
  return (
    <div style={{display:"flex",gap:"3px",marginBottom:"1rem"}}>
      {Array.from({length:n}).map((_,i)=>(
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",overflow:"hidden"}}>
      {/* Bg orbs */}
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",width:"700px",height:"700px",background:"var(--electric)",borderRadius:"50%",top:"-300px",left:"-250px",filter:"blur(130px)",opacity:.07,animation:"orbFloat 16s ease-in-out infinite"}}/>
        <div style={{position:"absolute",width:"600px",height:"600px",background:"var(--hot)",borderRadius:"50%",bottom:"-250px",right:"-200px",filter:"blur(130px)",opacity:.06,animation:"orbFloat 20s ease-in-out infinite reverse"}}/>
      </div>

      <div style={{position:"relative",zIndex:1}}>

        {/* ── HERO ── */}
        <section style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 64px)",textAlign:"center",padding:"4rem 1.5rem 6rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"6px 18px",borderRadius:"100px",border:"1px solid rgba(108,58,255,.35)",background:"rgba(108,58,255,.08)",fontSize:".78rem",letterSpacing:"1.5px",textTransform:"uppercase",color:"#9B8CFF",marginBottom:"2.5rem",animation:"fadeUp .6s ease"}}>
            <span style={{width:"5px",height:"5px",background:"var(--neon)",borderRadius:"50%",animation:"pulseGlow 1.5s infinite"}}/>
            AI-Powered · 8 Viral Formulas · Free to Start
          </div>

          <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(3.5rem,9vw,7rem)",fontWeight:800,lineHeight:.95,letterSpacing:"-4px",marginBottom:"1.75rem",animation:"fadeUp .7s ease .1s both"}}>
            Stop the<br/><span className="gradient-text">Scroll.</span>
          </h1>

          <p style={{fontSize:"1.2rem",color:"var(--soft)",maxWidth:"520px",margin:"0 auto 3rem",lineHeight:1.7,fontWeight:300,animation:"fadeUp .7s ease .2s both"}}>
            Generate 8 platform-optimized viral hooks <strong style={{color:"var(--text)",fontWeight:500}}>+ hashtags + scripts</strong> in seconds. Built for creators who refuse to be skipped.
          </p>

          <div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .7s ease .3s both"}}>
            <HoverBtn href="/generator" primary>Generate My Hooks — Free →</HoverBtn>
            <HoverBtn href="/pricing">See Pricing</HoverBtn>
          </div>

          {/* Stats */}
          <div style={{display:"flex",gap:"0",marginTop:"4rem",border:"1px solid var(--border)",borderRadius:"20px",background:"var(--s1)",overflow:"hidden",flexWrap:"wrap",animation:"fadeUp .7s ease .4s both"}}>
            {[["8","Viral formulas","var(--hot)"],["5","Platforms","var(--electric)"],["3s","Generation","var(--neon)"],["$0","To start","var(--gold)"]].map(([n,l,c])=>(
              <div key={l} style={{padding:"1.5rem 2rem",textAlign:"center",borderRight:"1px solid var(--border)",minWidth:"110px"}}>
                <div style={{fontFamily:"var(--fd)",fontSize:"2rem",fontWeight:800,letterSpacing:"-1px",color:c}}>{n}</div>
                <div style={{fontSize:".72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1.5px",marginTop:"4px"}}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",overflow:"hidden",padding:".875rem 0"}}>
          <div style={{display:"flex",gap:"3rem",whiteSpace:"nowrap",animation:"marqueeScroll 28s linear infinite"}}>
            {["TikTok Hooks","Instagram Reels","YouTube Shorts","LinkedIn Video","Curiosity Gap","Loss Aversion","Story Starter","Shock Value","Viral Score AI","1-Click Copy","Hashtag Generator","Script Builder","Pro Analytics","Export .txt","8 Formulas","Zero Clichés"].concat(["TikTok Hooks","Instagram Reels","YouTube Shorts","LinkedIn Video","Curiosity Gap","Loss Aversion","Story Starter","Shock Value","Viral Score AI","1-Click Copy","Hashtag Generator","Script Builder","Pro Analytics","Export .txt","8 Formulas","Zero Clichés"]).map((item,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",gap:"8px",fontSize:".78rem",color:"var(--muted)",letterSpacing:"1px",textTransform:"uppercase"}}>
                <span style={{width:"4px",height:"4px",borderRadius:"50%",background:["var(--hot)","var(--electric)","var(--neon)","var(--gold)"][i%4],flexShrink:0}}/>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS ── */}
        <section style={{maxWidth:"1000px",margin:"0 auto",padding:"7rem 2rem"}}>
          <div style={{fontSize:".72rem",letterSpacing:"3px",textTransform:"uppercase",color:"var(--electric)",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{width:"24px",height:"1px",background:"var(--electric)"}}/>How it works
          </div>
          <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:800,letterSpacing:"-2px",marginBottom:"4rem"}}>Three steps. Zero friction.</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"3rem"}}>
            {[["01","Describe your content","Type what your video is about in plain language. No templates to fill."],["02","Pick your platform & tone","TikTok, Instagram, LinkedIn — choose your style. Authentic, shock, authority..."],["03","Get 8 scored hooks","Every hook is labeled, scored, and comes with optimized hashtags. Copy and win."]].map(([num,title,desc])=>(
              <div key={num} style={{textAlign:"center"}}>
                <StepCircle num={num}/>
                <div style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:"1rem",margin:"1.25rem 0 .5rem"}}>{title}</div>
                <div style={{fontSize:".875rem",color:"var(--soft)",lineHeight:1.7,fontWeight:300}}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",background:"var(--s1)"}}>
          <div style={{maxWidth:"1000px",margin:"0 auto",padding:"7rem 2rem"}}>
            <div style={{fontSize:".72rem",letterSpacing:"3px",textTransform:"uppercase",color:"var(--electric)",marginBottom:"1.5rem",display:"flex",alignItems:"center",gap:"8px"}}>
              <span style={{width:"24px",height:"1px",background:"var(--electric)"}}/>Why creators love it
            </div>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:800,letterSpacing:"-2px",marginBottom:"4rem",lineHeight:1.05}}>Built different.<br/>Not another AI tool.</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"2px"}}>
              {[
                ["01","8 Proven Viral Formulas","Curiosity Gap, Loss Aversion, Story Starter, Shock Value... Built on psychology, not guesswork.","Science-backed"],
                ["02","Platform Intelligence","TikTok hooks need pattern interrupts. LinkedIn needs authority. Our engine adapts to each platform's unique psychology.","5 platforms"],
                ["03","Hashtag Generator","5–8 optimized hashtags per hook. Mix of high-volume, niche, and micro-niche tags. Auto-adapted per platform.","New feature"],
                ["04","AI Virality Score","Stop guessing. Each hook gets a score out of 100 with a breakdown of Curiosity, Emotion, and Clarity.","Pro feature"],
                ["05","Script Generator","From hook to full 3-part script: Hook (0-3s) + Bridge (3-10s) + CTA. Ready to record in 10 seconds.","Pro feature"],
                ["06","Fair Freemium","10 free generations/day. No bait-and-switch. Upgrade when you genuinely need more, not because we locked everything.","Fair pricing"],
              ].map(([num,title,desc,tag])=>(
                <FeatureCard key={num} num={num} title={title} desc={desc} tag={tag}/>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section style={{maxWidth:"1100px",margin:"0 auto",padding:"7rem 2rem"}}>
          <div style={{textAlign:"center",marginBottom:"4rem"}}>
            <div style={{fontSize:".72rem",letterSpacing:"3px",textTransform:"uppercase",color:"var(--electric)",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
              <span style={{width:"24px",height:"1px",background:"var(--electric)"}}/>Social proof<span style={{width:"24px",height:"1px",background:"var(--electric)"}}/>
            </div>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:800,letterSpacing:"-2px",marginBottom:"1rem"}}>Creators are already winning.</h2>
            <p style={{color:"var(--soft)",fontWeight:300}}>Join thousands of creators who stopped guessing and started going viral.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}}>
            {REVIEWS.map((r,i)=>(
              <ReviewCard key={i} review={r}/>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{textAlign:"center",padding:"8rem 2rem",background:"linear-gradient(180deg,var(--bg) 0%,rgba(108,58,255,.04) 50%,var(--bg) 100%)",position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(108,58,255,.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(2.5rem,6vw,4.5rem)",fontWeight:800,letterSpacing:"-3px",marginBottom:"1.5rem",lineHeight:1}}>
              Stop writing hooks.<br/><span className="gradient-text">Start going viral.</span>
            </h2>
            <p style={{color:"var(--soft)",fontSize:"1.1rem",marginBottom:"3rem",fontWeight:300,maxWidth:"480px",margin:"0 auto 3rem",lineHeight:1.7}}>
              Free forever. No credit card. Upgrade only when your content demands it.
            </p>
            <div style={{display:"flex",gap:"14px",justifyContent:"center",flexWrap:"wrap"}}>
              <HoverBtn href="/generator" primary>Generate My First 8 Hooks — Free →</HoverBtn>
              <HoverBtn href="/pricing">View Pricing</HoverBtn>
            </div>
            <p style={{marginTop:"1.5rem",fontSize:".8rem",color:"var(--muted)"}}>10 free hooks per day · No signup required · Reset at midnight</p>
          </div>
        </section>

      </div>

      <style>{`
        @keyframes marqueeScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

function StepCircle({ num }: { num:string }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{width:"64px",height:"64px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontFamily:"var(--fd)",fontWeight:700,fontSize:"1.25rem",border:`1px solid ${hov?"transparent":"var(--border2)"}`,background:hov?"linear-gradient(135deg,var(--hot),var(--electric))":"var(--s2)",transition:"all .35s cubic-bezier(.16,1,.3,1)",transform:hov?"scale(1.1)":"none",boxShadow:hov?"0 0 30px rgba(255,45,107,.4)":"none",color:hov?"#fff":"var(--soft)"}}>
      {num}
    </div>
  );
}

function FeatureCard({ num, title, desc, tag }: { num:string; title:string; desc:string; tag:string }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?"var(--s3)":"var(--s2)",padding:"2.5rem 2rem",position:"relative",overflow:"hidden",transition:"background .25s",cursor:"default"}}>
      <div style={{fontFamily:"var(--fd)",fontSize:"3rem",fontWeight:800,color:hov?"var(--electric)":"var(--border2)",letterSpacing:"-3px",lineHeight:1,marginBottom:"1.5rem",transition:"color .3s"}}>{num}</div>
      <div style={{fontFamily:"var(--fd)",fontSize:"1.05rem",fontWeight:700,marginBottom:".6rem"}}>{title}</div>
      <div style={{fontSize:".875rem",color:"var(--soft)",lineHeight:1.7,fontWeight:300,marginBottom:"1rem"}}>{desc}</div>
      <span style={{display:"inline-block",padding:"3px 10px",borderRadius:"100px",fontSize:".68rem",background:"rgba(108,58,255,.1)",color:"#9B8CFF",border:"1px solid rgba(108,58,255,.2)"}}>{tag}</span>
      {hov&&<div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,var(--hot),var(--electric))"}}/>}
    </div>
  );
}

function ReviewCard({ review }: { review:typeof REVIEWS[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:"var(--s1)",border:`1px solid ${hov?"rgba(108,58,255,.3)":"var(--border)"}`,borderRadius:"20px",padding:"1.75rem",transition:"all .3s",transform:hov?"translateY(-4px)":"none",boxShadow:hov?"0 16px 40px rgba(108,58,255,.12)":"none",position:"relative",overflow:"hidden"}}>
      {hov&&<div style={{position:"absolute",top:0,left:0,right:0,height:"1px",background:"linear-gradient(90deg,transparent,var(--electric),transparent)"}}/>}
      <StarRating n={review.stars}/>
      <p style={{fontSize:".875rem",lineHeight:1.75,color:"var(--soft)",marginBottom:"1.5rem",fontStyle:"italic",fontWeight:300}}>&ldquo;{review.text}&rdquo;</p>
      <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
        <div style={{width:"38px",height:"38px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)",fontWeight:700,fontSize:".75rem",background:`${review.color}22`,color:review.color,flexShrink:0}}>{review.avatar}</div>
        <div>
          <div style={{fontSize:".85rem",fontWeight:500}}>{review.name}</div>
          <div style={{fontSize:".72rem",color:"var(--muted)"}}>{review.handle}</div>
        </div>
      </div>
    </div>
  );
}