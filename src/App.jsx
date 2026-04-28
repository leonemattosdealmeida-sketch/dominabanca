import { useState, useEffect, useRef } from "react";

const C = {
  primary: "#6C3CE1",
  primaryLight: "#8B5CF6",
  primaryXLight: "#EDE9FE",
  primaryDark: "#4C1D95",
  accent: "#10B981",
  accentLight: "#D1FAE5",
  warning: "#F59E0B",
  danger: "#EF4444",
  bg: "#F8F7FF",
  white: "#FFFFFF",
  text: "#1E1B4B",
  textMed: "#4C4780",
  textLight: "#9CA3AF",
  border: "#E5E7EB",
  borderPurple: "#DDD6FE",
  shadow: "0 2px 16px rgba(108,60,225,0.08)",
  shadowMd: "0 4px 24px rgba(108,60,225,0.13)",
  shadowLg: "0 12px 48px rgba(108,60,225,0.18)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes bounceIn{0%{transform:scale(0.85);opacity:0}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
  @keyframes slideRight{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  *{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:#F8F7FF;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#DDD6FE;border-radius:4px;}
  textarea,input,select,button{font-family:'Sora',sans-serif;}
  .cta-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(108,60,225,0.32)!important;}
  .cta-btn{transition:all 0.2s ease;}
  .feature-card:hover{transform:translateY(-4px);box-shadow:0 8px 32px rgba(108,60,225,0.14)!important;}
  .feature-card{transition:all 0.25s ease;}
  .nav-link:hover{color:#6C3CE1!important;}
  .nav-link{transition:color 0.15s;}
  .step-dot{transition:all 0.3s ease;cursor:pointer;}
  .plan-card:hover{transform:translateY(-3px);}
  .plan-card{transition:all 0.2s ease;}
  @media(max-width:768px){
    .nav-desktop{display:none!important;}
    .hero-grid{grid-template-columns:1fr!important;padding:40px 16px 32px!important;}
    .features-grid{grid-template-columns:1fr!important;}
    .plans-grid{grid-template-columns:1fr!important;}
    .redacao-grid{grid-template-columns:1fr!important;}
    .footer-inner{flex-direction:column!important;gap:32px!important;}
    .section-pad{padding:56px 16px!important;}
    .hero-btns{flex-direction:column!important;}
    .hero-btns button, .hero-btns a{width:100%!important;text-align:center!important;}
    .demo-col{display:none!important;}
    .nav-wrap{padding:0 16px!important;}
    .trust-row{gap:16px!important;flex-wrap:wrap!important;}
  }
`;

// ── Logo SVG ───────────────────────────────────────────────────────────────────
const Logo = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill="url(#logoGrad)"/>
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5B3FD4"/>
        <stop offset="100%" stopColor="#8B6FF0"/>
      </linearGradient>
    </defs>
    {/* Livro aberto elegante */}
    <path d="M20 10 C20 10 13 12 11 14 L11 30 C13 28 20 27 20 27 C20 27 27 28 29 30 L29 14 C27 12 20 10 20 10Z" fill="white" fillOpacity="0.15"/>
    <path d="M20 10 L20 27" stroke="white" strokeWidth="1.2" strokeOpacity="0.5"/>
    {/* Página esquerda */}
    <path d="M11 14 C13 12 20 10 20 10 L20 27 C20 27 13 28 11 30 Z" fill="white" fillOpacity="0.22"/>
    {/* Página direita */}
    <path d="M29 14 C27 12 20 10 20 10 L20 27 C20 27 27 28 29 30 Z" fill="white" fillOpacity="0.12"/>
    {/* Linhas na página esquerda */}
    <line x1="13.5" y1="17" x2="18.5" y2="16" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75"/>
    <line x1="13.5" y1="20" x2="18.5" y2="19.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75"/>
    <line x1="13.5" y1="23" x2="17" y2="22.4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.75"/>
    {/* Check na página direita */}
    <path d="M22.5 20.5 L24.5 22.8 L28 18" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.95"/>
  </svg>
);

const LogoMark = () => (
  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
    <Logo size={38} />
    <div>
      <div style={{ fontFamily:"'Lora',serif", fontWeight:700, fontSize:18, color:C.text, lineHeight:1 }}>DominaBanca</div>
      <div style={{ fontSize:9, color:C.textLight, letterSpacing:1.5, textTransform:"uppercase", marginTop:1 }}>Preparação Inteligente</div>
    </div>
  </div>
);

// ── Demo Player ────────────────────────────────────────────────────────────────
const DEMO_STEPS = [
  { label:"Edital", icon:"📋", title:"Análise do edital", desc:"A IA extrai cargo, banca, matérias e datas.", component:"edital" },
  { label:"Cronograma", icon:"🗓️", title:"Cronograma semanal", desc:"Cada dia com matéria e tempo definidos.", component:"cronograma" },
  { label:"Questões", icon:"🎯", title:"Questões diárias", desc:"Estilo exato da sua banca, todo dia.", component:"questao" },
  { label:"Simulado", icon:"⏱️", title:"Simulado agendado", desc:"Prova completa, cronometrada, como no dia real.", component:"simulado" },
  { label:"Evolução", icon:"📊", title:"Acompanhamento", desc:"Pontos fortes, fracos e caderno de erros.", component:"evolucao" },
];

const DemoEdital = () => {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const text = "CONTEÚDO PROGRAMÁTICO\nLíngua Portuguesa: Interpretação, Gramática\nRaciocínio Lógico: Proposições, Silogismos\nDir. Administrativo: Atos, Licitações...";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { setTyped(text.slice(0,i)); i+=4; if(i>text.length){clearInterval(t);setTimeout(()=>setDone(true),600);} }, 30);
    return ()=>clearInterval(t);
  }, []);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{background:"#F8F7FF",border:`1.5px solid ${done?"#10B981":"#DDD6FE"}`,borderRadius:10,padding:"10px 12px",minHeight:90,fontSize:11,color:"#4C4780",lineHeight:1.7,fontFamily:"monospace",transition:"border-color 0.4s"}}>
        {typed}{!done&&<span style={{animation:"blink 1s infinite"}}>|</span>}
      </div>
      {done&&(
        <div style={{animation:"bounceIn 0.4s ease"}}>
          {[{l:"Banca",v:"CESPE/CEBRASPE",c:C.primary},{l:"Matérias",v:"9 disciplinas",c:C.accent},{l:"Data da prova",v:"15/08/2025",c:C.warning},{l:"Cargo",v:"Analista Administrativo",c:C.textMed}].map(r=>(
            <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"7px 10px",background:C.white,border:`1px solid ${C.border}`,borderRadius:7,marginBottom:5,fontSize:11}}>
              <span style={{color:C.textLight}}>{r.l}</span>
              <span style={{fontWeight:700,color:r.c}}>{r.v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DemoCronograma = () => {
  const days = [
    {day:"Seg",materia:"Língua Portuguesa",horas:"2h",color:"#6C3CE1",done:true},
    {day:"Ter",materia:"Raciocínio Lógico",horas:"2h",color:"#F59E0B",done:true},
    {day:"Qua",materia:"Dir. Administrativo",horas:"2h30",color:"#EF4444",done:false,active:true},
    {day:"Qui",materia:"Informática",horas:"1h30",color:"#10B981",done:false},
    {day:"Sex",materia:"Língua Portuguesa",horas:"2h",color:"#6C3CE1",done:false},
    {day:"Sáb",materia:"🎯 SIMULADO COMPLETO",horas:"4h",color:"#1E1B4B",done:false,simulado:true},
  ];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <div style={{fontSize:11,fontWeight:700,color:C.textMed,marginBottom:2}}>Semana 3 de 12 — Agosto/2025</div>
      {days.map(d=>(
        <div key={d.day} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",background:d.active?`${d.color}12`:d.simulado?"#1E1B4B0A":C.white,border:`1.5px solid ${d.active?d.color:d.simulado?"#1E1B4B30":C.border}`,borderRadius:9}}>
          <div style={{width:28,fontSize:10,fontWeight:700,color:d.active?d.color:C.textLight,flexShrink:0}}>{d.day}</div>
          <div style={{width:8,height:8,borderRadius:"50%",background:d.done?"#10B981":d.active?d.color:"#E5E7EB",flexShrink:0}}/>
          <div style={{flex:1,fontSize:11,fontWeight:d.active||d.simulado?700:400,color:d.active?d.color:d.simulado?C.text:C.textMed}}>{d.materia}</div>
          <div style={{fontSize:10,color:C.textLight,flexShrink:0}}>{d.horas}</div>
        </div>
      ))}
    </div>
  );
};

const DemoQuestao = () => {
  const [sel,setSel]=useState(null);
  const [show,setShow]=useState(false);
  const opts={A:"Somente quando autorizada por lei",B:"Sempre que não houver vedação expressa",C:"A qualquer tempo, por conveniência",D:"Apenas em situações de urgência"};
  return (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"flex",gap:6,marginBottom:2}}>
        <span style={{background:"#EDE9FE",color:C.primary,border:"1px solid #DDD6FE",borderRadius:100,padding:"3px 10px",fontSize:10,fontWeight:600}}>CESPE • Dir. Administrativo</span>
      </div>
      <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 12px",fontSize:11,lineHeight:1.75,color:C.text,fontStyle:"italic",borderLeft:`3px solid ${C.primary}`,paddingLeft:12}}>
        A Administração Pública pode agir:
      </div>
      {Object.entries(opts).map(([k,v])=>{
        const isSel=sel===k,isRight=show&&k==="A",isWrong=show&&isSel&&k!=="A";
        return(
          <button key={k} onClick={()=>!show&&setSel(k)} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"8px 10px",border:`1.5px solid ${isRight?"#10B981":isWrong?"#EF4444":isSel?C.primary:C.border}`,borderRadius:8,background:isRight?"#D1FAE5":isWrong?"#FEE2E2":isSel?"#EDE9FE":C.white,color:C.text,fontSize:11,cursor:"pointer",textAlign:"left",width:"100%",lineHeight:1.5}}>
            <span style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${isRight?"#10B981":isWrong?"#EF4444":isSel?C.primary:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0,color:isRight?"#10B981":isWrong?"#EF4444":isSel?C.primary:C.textLight}}>{k}</span>
            <span>{v}</span>
          </button>
        );
      })}
      {!show?(
        <button onClick={()=>sel&&setShow(true)} style={{padding:"8px",background:sel?C.primary:"#E5E7EB",color:sel?"white":C.textLight,border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:sel?"pointer":"not-allowed"}}>Confirmar →</button>
      ):(
        <div style={{padding:"8px 12px",background:sel==="A"?"#D1FAE5":"#FEE2E2",borderRadius:8,fontSize:11,color:sel==="A"?"#065F46":"#991B1B",lineHeight:1.6,animation:"bounceIn 0.3s ease"}}>
          <strong>{sel==="A"?"✓ Correto!":"✗ Gabarito: A"}</strong> — O princípio da legalidade exige autorização legal expressa para que a Administração aja.
        </div>
      )}
    </div>
  );
};

const DemoSimulado = () => {
  const [elapsed,setElapsed]=useState(47*60+23);
  useEffect(()=>{const t=setInterval(()=>setElapsed(e=>e+1),1000);return()=>clearInterval(t);},[]);
  const fmt=s=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const total=4*3600,pct=Math.min(100,(elapsed/total)*100);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{background:"#1E1B4B",borderRadius:12,padding:"14px 16px",color:"white",textAlign:"center"}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Simulado CESPE em andamento</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:32,fontWeight:700,letterSpacing:2}}>{fmt(elapsed)}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:4}}>de 4h00 disponíveis</div>
        <div style={{height:4,background:"rgba(255,255,255,0.1)",borderRadius:99,marginTop:12,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.primaryLight},${C.accent})`,borderRadius:99,transition:"width 1s linear"}}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4}}>
        {Array.from({length:20},(_,i)=>(
          <div key={i} style={{height:28,borderRadius:6,background:i<11?"#EDE9FE":i===11?"#6C3CE1":"#F3F4F6",border:`1px solid ${i===11?C.primary:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:i===11?700:400,color:i===11?"white":i<11?C.primary:C.textLight}}>
            {i+1}
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMed}}>
        <span>✅ 11 respondidas</span><span>⏳ 9 restantes</span><span>🎯 120 total</span>
      </div>
    </div>
  );
};

const DemoEvolucao = () => {
  const topics=[
    {name:"Língua Portuguesa",acc:82,color:"#6C3CE1",emoji:"📖"},
    {name:"Raciocínio Lógico",acc:68,color:"#F59E0B",emoji:"🧠"},
    {name:"Dir. Administrativo",acc:54,color:"#EF4444",emoji:"⚖️"},
    {name:"Informática",acc:91,color:"#10B981",emoji:"💻"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:4}}>
        {[{l:"Simulados feitos",v:"3",c:C.primary},{l:"Acerto geral",v:"74%",c:C.accent},{l:"Questões hoje",v:"18",c:C.warning},{l:"Erros no caderno",v:"12",c:C.danger}].map(s=>(
          <div key={s.l} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:9,padding:"8px",textAlign:"center"}}>
            <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:C.textLight,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      {topics.map(t=>(
        <div key={t.name} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:9,padding:"8px 10px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:12}}>{t.emoji}</span>
              <span style={{fontSize:11,fontWeight:600,color:C.text}}>{t.name}</span>
            </div>
            <span style={{fontSize:11,fontWeight:700,color:t.acc>=70?C.accent:t.acc>=50?C.warning:C.danger}}>{t.acc}%</span>
          </div>
          <div style={{height:4,background:"#EDE9FE",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${t.acc}%`,background:t.color,borderRadius:99,transition:"width 1.2s ease"}}/>
          </div>
        </div>
      ))}
    </div>
  );
};

const DEMO_COMPS={edital:DemoEdital,cronograma:DemoCronograma,questao:DemoQuestao,simulado:DemoSimulado,evolucao:DemoEvolucao};

const DemoPlayer = () => {
  const [step,setStep]=useState(0);
  const [key,setKey]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>{setStep(s=>(s+1)%DEMO_STEPS.length);setKey(k=>k+1);},5000);return()=>clearTimeout(t);},[step]);
  const goTo=i=>{setStep(i);setKey(k=>k+1);};
  const DemoComp=DEMO_COMPS[DEMO_STEPS[step].component];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{position:"relative",maxWidth:340,margin:"0 auto",width:"100%"}}>
        <div style={{position:"absolute",inset:-24,background:`radial-gradient(ellipse at center,${C.primaryXLight} 0%,transparent 70%)`,zIndex:0,borderRadius:50}}/>
        <div style={{position:"relative",zIndex:1,background:C.white,border:`2px solid ${C.borderPurple}`,borderRadius:24,overflow:"hidden",boxShadow:C.shadowLg}}>
          <div style={{background:"#F3F4F6",borderBottom:`1px solid ${C.border}`,padding:"9px 12px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{display:"flex",gap:5}}>{["#EF4444","#F59E0B","#10B981"].map(c=><div key={c} style={{width:8,height:8,borderRadius:"50%",background:c}}/>)}</div>
            <div style={{flex:1,background:C.white,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 8px",fontSize:10,color:C.textLight,textAlign:"center"}}>simulabanca.com.br</div>
          </div>
          <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
            <Logo size={26}/>
            <span style={{fontWeight:800,fontSize:12,color:C.text}}>DominaBanca</span>
            <div style={{marginLeft:"auto",display:"flex",gap:4,alignItems:"center"}}>
              <div style={{width:5,height:5,borderRadius:"50%",background:C.accent}}/>
              <span style={{fontSize:9,color:C.accent}}>online</span>
            </div>
          </div>
          <div style={{background:C.primaryXLight,borderBottom:`1px solid ${C.borderPurple}`,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>{DEMO_STEPS[step].icon}</span>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:C.primary}}>{DEMO_STEPS[step].title}</div>
              <div style={{fontSize:10,color:C.textMed}}>{DEMO_STEPS[step].desc}</div>
            </div>
          </div>
          <div key={key} style={{padding:12,minHeight:280,background:C.bg,animation:"fadeIn 0.35s ease"}}>
            <DemoComp/>
          </div>
          <div style={{height:3,background:"#EDE9FE"}}>
            <div style={{height:"100%",background:C.primary,animation:"slideRight 5s linear",transformOrigin:"left"}}/>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
        {DEMO_STEPS.map((s,i)=>(
          <button key={i} onClick={()=>goTo(i)} style={{padding:"5px 11px",border:`1.5px solid ${i===step?C.primary:C.border}`,background:i===step?C.primaryXLight:C.white,color:i===step?C.primary:C.textLight,borderRadius:100,fontSize:10,fontWeight:i===step?700:400,cursor:"pointer"}}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Carrossel Redação ─────────────────────────────────────────────────────────
const RedacaoCarrossel = () => {
  const [slide, setSlide] = useState(0);
  const startX = useRef(null);

  const handleTouchStart = e => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if(startX.current===null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if(diff > 40) setSlide(1);
    if(diff < -40) setSlide(0);
    startX.current = null;
  };

  return(
    <div>
      <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:16}}>
        {[0,1].map(i=>(
          <button key={i} onClick={()=>setSlide(i)}
            style={{width:i===slide?24:8,height:8,borderRadius:99,background:i===slide?"white":"rgba(255,255,255,0.3)",border:"none",cursor:"pointer",transition:"all 0.2s"}}/>
        ))}
      </div>
      <div style={{overflow:"hidden",borderRadius:20}} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div style={{display:"flex",transition:"transform 0.35s ease",transform:`translateX(-${slide*100}%)`}}>

          {/* Slide 1 — Avaliação */}
          <div style={{minWidth:"100%"}}>
            <div style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:20,backdropFilter:"blur(10px)"}}>
              <div style={{background:"rgba(255,255,255,0.97)",borderRadius:14,padding:18,marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.text}}>📝 Redação avaliada</span>
                  <span style={{background:C.accentLight,color:C.accent,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:100}}>Nota 8.4/10</span>
                </div>
                {[
                  {criterio:"Domínio da escrita",nota:"9.0",cor:C.accent},
                  {criterio:"Argumentação",nota:"8.0",cor:C.warning},
                  {criterio:"Proposta de intervenção",nota:"8.5",cor:C.accent},
                  {criterio:"Coesão e coerência",nota:"8.2",cor:C.accent},
                ].map(c=>(
                  <div key={c.criterio} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:12,color:C.textMed}}>{c.criterio}</span>
                    <span style={{fontSize:13,fontWeight:700,color:c.cor}}>{c.nota}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 14px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.9)",marginBottom:6}}>💡 Sugestão de melhoria</div>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.7,margin:0}}>
                  Sua proposta de intervenção poderia incluir o agente executor e o financiamento da ação. Isso elevaria sua nota neste critério para 9.5+.
                </p>
              </div>
            </div>
          </div>

          {/* Slide 2 — Evolução da discursiva */}
          <div style={{minWidth:"100%"}}>
            <div style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:20,padding:20,backdropFilter:"blur(10px)"}}>
              <div style={{background:"rgba(255,255,255,0.97)",borderRadius:14,padding:18,marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:16}}>📈 Evolução da discursiva</div>
                {[
                  {semana:"Semana 1",nota:6.8,cor:"#EF4444"},
                  {semana:"Semana 2",nota:7.2,cor:C.warning},
                  {semana:"Semana 3",nota:7.9,cor:C.warning},
                  {semana:"Semana 4",nota:8.4,cor:C.accent},
                  {semana:"Semana 5",nota:8.8,cor:C.accent},
                ].map((s,i)=>(
                  <div key={i} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                      <span style={{color:C.textMed,fontWeight:600}}>{s.semana}</span>
                      <span style={{fontWeight:700,color:s.cor}}>{s.nota}</span>
                    </div>
                    <div style={{height:7,background:"#EDE9FE",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(s.nota/10)*100}%`,background:s.cor,borderRadius:99}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {l:"Redações feitas",v:"12",icon:"✍️"},
                  {l:"Evolução total",v:"+29%",icon:"📈"},
                  {l:"Melhor nota",v:"9.1",icon:"🏆"},
                  {l:"Meta atual",v:"9.5",icon:"🎯"},
                ].map(s=>(
                  <div key={s.l} style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                    <div style={{fontSize:16,marginBottom:4}}>{s.icon}</div>
                    <div style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700,color:"white",lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",marginTop:3,fontWeight:600}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <p style={{textAlign:"center",fontSize:11,color:"rgba(255,255,255,0.4)",marginTop:12}}>← deslize para ver a evolução →</p>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────────
export default function DominaBancaLanding() {
  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=css;
    document.head.appendChild(s);
  },[]);

  return(
    <div style={{fontFamily:"'Sora',sans-serif",background:C.bg,color:C.text}}>

      {/* ── NAV ── */}
      <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 28px",height:66,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <LogoMark/>
          <div className="nav-desktop" style={{display:"flex",alignItems:"center",gap:28}}>
            {["Como funciona","Recursos","Redação","Planos"].map(l=>(
              <a key={l} className="nav-link" href={`#${l.toLowerCase().replace(" ","-")}`} style={{fontSize:14,color:C.textMed,textDecoration:"none",fontWeight:500}}>{l}</a>
            ))}
            <button className="cta-btn" style={{padding:"10px 24px",background:C.primary,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>
              Começar gratuitamente
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{maxWidth:1100,margin:"0 auto",padding:"88px 28px 72px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}} className="hero-grid">
        <div style={{animation:"fadeUp 0.6s ease"}}>
          <h1 style={{fontFamily:"'Lora',serif",fontSize:"clamp(30px,4vw,52px)",fontWeight:700,lineHeight:1.18,color:C.text,marginBottom:22}}>
            Transforme seu edital
            <br/>em um plano estruturado
            <br/><span style={{color:C.primary}}>de estudo.</span>
          </h1>
          <p style={{fontSize:17,color:C.textMed,lineHeight:1.8,marginBottom:40,maxWidth:460}}>
            Questões, cronograma e simulados personalizados para o seu estudo diário.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}} className="hero-btns">
            <button className="cta-btn" style={{padding:"15px 32px",background:C.primary,color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>
              Começar gratuitamente →
            </button>
          </div>
          <div style={{display:"flex",gap:28,marginTop:40,flexWrap:"wrap"}}>
            {[{icon:"📋",text:"Qualquer edital e banca"},{icon:"🆓",text:"Primeira semana grátis"},{icon:"⚡",text:"Cronograma em minutos"}].map(t=>(
              <div key={t.text} style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:C.textMed}}>
                <span>{t.icon}</span><span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <section style={{background:C.bg,padding:"0 28px 72px"}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:C.primary,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16}}>Veja funcionando</div>
          <h2 style={{fontFamily:"'Lora',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:40}}>
            Uma plataforma feita para o seu concurso
          </h2>
          <DemoPlayer/>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="recursos" style={{padding:"88px 28px",background:C.white,borderTop:`1px solid ${C.border}`}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div style={{fontSize:11,fontWeight:700,color:C.primary,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}>Como funciona</div>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:C.text}}>
              Sua jornada do edital à prova
            </h2>
          </div>

          <div style={{position:"relative"}}>
            {/* Linha vertical */}
            <div style={{position:"absolute",left:23,top:0,bottom:0,width:2,background:`linear-gradient(to bottom, ${C.primary}, ${C.primaryLight})`,borderRadius:99,zIndex:0}}/>

            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              {[
                {n:"1",icon:"📋",title:"Envie seu edital",desc:"Cole o conteúdo programático ou anexe o PDF. A plataforma identifica cargo, banca, matérias e data da prova automaticamente — em segundos."},
                {n:"2",icon:"💬",title:"Onboarding personalizado",desc:"Informe suas dificuldades, facilidades e quantas horas tem disponíveis por dia. A plataforma usa tudo isso para montar a melhor preparação para você."},
                {n:"3",icon:"🗓️",title:"Cronograma até o dia da prova",desc:"Plano semanal completo com matérias organizadas por prioridade, peso no edital e sua dificuldade. Ajusta automaticamente conforme você evolui."},
                {n:"4",icon:"⏱️",title:"Simulados agendados no padrão da banca",desc:"Provas completas cronometradas com o número exato de questões do edital, no estilo real da sua banca. Você treina como se fosse o dia da prova — sem diferença."},
                {n:"5",icon:"✍️",title:"Correção de redação ilimitada",desc:"Escreva à mão, fotografe e envie. A plataforma corrige com os critérios exatos do seu edital, atribui nota por critério e aponta o caminho para a nota máxima — quantas vezes precisar."},
                {n:"6",icon:"📊",title:"Acompanhamento personalizado",desc:"Análise contínua do seu desempenho, caderno de erros inteligente, revisão programada e alertas quando uma matéria precisar de mais atenção. Você nunca fica sem saber onde está."},
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:24,position:"relative",zIndex:1,paddingBottom: i<5?48:0}}>
                  {/* Círculo numerado */}
                  <div style={{width:48,height:48,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:`0 0 0 4px ${C.primaryXLight}`,zIndex:2}}>
                    <span style={{fontSize:16,fontWeight:800,color:"white"}}>{s.n}</span>
                  </div>
                  {/* Conteúdo */}
                  <div style={{flex:1,paddingTop:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      <span style={{fontSize:20}}>{s.icon}</span>
                      <h3 style={{fontFamily:"'Lora',serif",fontSize:18,fontWeight:700,color:C.text}}>{s.title}</h3>
                    </div>
                    <p style={{fontSize:14,color:C.textMed,lineHeight:1.8}}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REDAÇÃO SECTION ── */}
      <section id="redação" style={{background:`linear-gradient(135deg, ${C.primaryDark} 0%, ${C.primary} 60%, ${C.primaryLight} 100%)`,padding:"88px 28px"}}>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center"}} className="redacao-grid">
          <div>
            <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.6)",letterSpacing:2.5,textTransform:"uppercase",marginBottom:16}}>Prova discursiva e redação</div>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:"white",lineHeight:1.25,marginBottom:20}}>
              Correção com o olhar da banca
            </h2>
            <p style={{fontSize:16,color:"rgba(255,255,255,0.8)",lineHeight:1.8,marginBottom:24}}>
              Escreva sua redação ou prova discursiva à mão, como no dia da prova. Fotografe e envie. A IA avalia com os critérios exatos do seu edital.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {icon:"📸",text:"Envie foto da redação manuscrita"},
                {icon:"⚖️",text:"Avaliação com os critérios do edital"},
                {icon:"💡",text:"Argumentos que poderiam ser utilizados"},
                {icon:"📈",text:"Direcionamento claro de como evoluir"},
                {icon:"🏆",text:"Reconhecimento quando a nota for excelente"},
              ].map(i=>(
                <div key={i.text} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{i.icon}</div>
                  <span style={{fontSize:14,color:"rgba(255,255,255,0.9)"}}>{i.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Carrossel swipeable */}
          <RedacaoCarrossel/>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="planos" style={{padding:"88px 28px",background:C.white,borderTop:`1px solid ${C.border}`}}>
        <div style={{maxWidth:920,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div style={{fontSize:11,fontWeight:700,color:C.primary,letterSpacing:2.5,textTransform:"uppercase",marginBottom:14}}>Planos</div>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:"clamp(24px,3vw,40px)",fontWeight:700,color:C.text,marginBottom:12}}>
              Experimente de verdade. Assine quando quiser.
            </h2>
            <p style={{fontSize:16,color:C.textMed,maxWidth:520,margin:"0 auto",lineHeight:1.7}}>
              Na primeira semana você tem acesso completo — sem limitação. Assim você decide com base na experiência real, não em promessas.
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}} className="plans-grid">

            {/* FREE */}
            <div className="plan-card" style={{background:C.bg,border:`2px solid ${C.border}`,borderRadius:22,padding:32,boxShadow:C.shadow}}>
              <div style={{fontWeight:800,fontSize:13,color:C.textMed,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Gratuito</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:8}}>
                <span style={{fontFamily:"'Lora',serif",fontSize:44,fontWeight:700,color:C.text}}>R$0</span>
              </div>
              <p style={{fontSize:13,color:C.textLight,marginBottom:24}}>Sem cartão de crédito. Sem compromisso.</p>

              {/* Week 1 highlight */}
              <div style={{background:C.accentLight,border:`1.5px solid ${C.accent}30`,borderRadius:12,padding:"14px 16px",marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:800,color:C.accent,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                  <span>✨</span> Semana 1 — Experiência completa
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    "Análise completa do edital",
                    "Onboarding conversacional completo",
                    "Cronograma da 1ª semana completo",
                    "Questões diárias com comentário técnico",
                    "1 simulado com análise detalhada",
                    "1 correção de redação com nota por critério",
                  ].map(f=>(
                    <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:12,color:"#065F46"}}>
                      <span style={{color:C.accent,flexShrink:0,marginTop:1}}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </div>

              {/* After week 1 */}
              <div style={{background:"#F9FAFB",border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:28}}>
                <div style={{fontSize:12,fontWeight:700,color:C.textLight,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
                  <span>🔒</span> A partir da semana 2
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    {t:"5 questões/dia sem comentário técnico",ok:true},
                    {t:"Cronograma bloqueado após semana 1",ok:false},
                    {t:"Simulados sem análise detalhada",ok:false},
                    {t:"Redação sem detalhamento por critério",ok:false},
                    {t:"Caderno de erros — só visualização",ok:false},
                    {t:"Análise de progresso bloqueada",ok:false},
                  ].map(f=>(
                    <div key={f.t} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:12,color:f.ok?C.textMed:C.textLight}}>
                      <span style={{color:f.ok?C.textLight:C.textLight,flexShrink:0,marginTop:1}}>{f.ok?"–":"✗"}</span>{f.t}
                    </div>
                  ))}
                </div>
              </div>

              <button className="cta-btn" style={{width:"100%",padding:14,background:"transparent",color:C.primary,border:`2px solid ${C.primary}`,borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                Começar gratuitamente
              </button>
            </div>

            {/* PAID */}
            <div className="plan-card" style={{background:C.primary,border:`2px solid ${C.primary}`,borderRadius:22,padding:32,boxShadow:C.shadowLg,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-1,right:20,background:C.warning,color:"white",borderRadius:"0 0 12px 12px",padding:"6px 16px",fontSize:11,fontWeight:800,letterSpacing:0.5}}>
                🔥 PLANO FUNDADOR
              </div>

              <div style={{fontWeight:800,fontSize:13,color:"rgba(255,255,255,0.5)",letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Preparação Completa</div>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:4}}>
                <span style={{fontFamily:"'Lora',serif",fontSize:44,fontWeight:700,color:"white"}}>R$67</span>
                <span style={{fontSize:14,color:"rgba(255,255,255,0.5)"}}>/mês</span>
              </div>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:4,textDecoration:"line-through"}}>Após lançamento: R$97/mês</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",marginBottom:24}}>Para os primeiros 100 assinantes. Cancele quando quiser.</p>

              {/* All unlocked */}
              <div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:12,padding:"14px 16px",marginBottom:28}}>
                <div style={{fontSize:12,fontWeight:800,color:"#6EE7B7",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
                  <span>🔓</span> Tudo desbloqueado — do início ao fim
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {[
                    "Análise completa do edital",
                    "Cronograma semanal completo até a prova",
                    "Questões diárias ilimitadas com comentário técnico",
                    "Simulados agendados, cronometrados e ilimitados",
                    "Análise detalhada completa após cada simulado",
                    "Correção ilimitada de redação com nota por critério",
                    "Sugestões de melhoria em cada correção",
                    "Caderno de erros com revisão guiada",
                    "Análise de evolução semana a semana",
                    "Relatório de pontos fortes e fracos",
                    "Suporte prioritário",
                  ].map(f=>(
                    <div key={f} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:"white"}}>
                      <span style={{color:"#6EE7B7",flexShrink:0,marginTop:1}}>✓</span>{f}
                    </div>
                  ))}
                </div>
              </div>

              <button className="cta-btn" style={{width:"100%",padding:14,background:C.white,color:C.primary,border:"none",borderRadius:12,fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>
                Assinar por R$67/mês →
              </button>
              <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",textAlign:"center",marginTop:12}}>
                Sem fidelidade. Cancele a qualquer momento.
              </p>
            </div>
          </div>

          {/* Depoimentos */}
          <div style={{marginTop:48}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <h3 style={{fontFamily:"'Lora',serif",fontSize:"clamp(20px,2.5vw,30px)",fontWeight:700,color:C.text}}>
                Quem usa, não abre mão.
              </h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}} className="features-grid">
              {[
                {nome:"Leone Mattos",local:"Niterói/RJ",texto:"Nunca vi nada parecido no mercado de concursos. A plataforma leu meu edital, montou meu cronograma e já sabia exatamente o que eu precisava estudar. É como ter um preparador particular disponível 24 horas.",inicial:"L"},
                {nome:"Mylena Athaydes",local:"São Paulo/SP",texto:"Estudei para concurso por anos sem organização nenhuma. O DominaBanca mudou completamente minha rotina de estudos. O cronograma semanal e o caderno de erros me mostraram exatamente onde eu estava falhando.",inicial:"M"},
                {nome:"Sandro Almeida",local:"Porto Seguro/BA",texto:"O que mais me impressionou foi a qualidade das questões. São idênticas ao estilo da banca — cheguei no dia da prova sem nenhuma surpresa. Produto incrível.",inicial:"S"},
              ].map((d,i)=>(
                <div key={i} style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:16,padding:24,boxShadow:C.shadow}}>
                  <div style={{display:"flex",gap:2,marginBottom:12}}>{"★★★★★".split("").map((s,j)=><span key={j} style={{color:C.warning,fontSize:15}}>{s}</span>)}</div>
                  <p style={{fontSize:13,color:C.textMed,lineHeight:1.75,marginBottom:18,fontStyle:"italic"}}>"{d.texto}"</p>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:`linear-gradient(135deg,${C.primary},${C.primaryLight})`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:14,fontWeight:700,flexShrink:0}}>{d.inicial}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>{d.nome}</div>
                      <div style={{fontSize:11,color:C.textLight}}>{d.local}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frase concorrência */}
          <div style={{textAlign:"center",marginTop:64,paddingTop:48,borderTop:`1px solid ${C.border}`}}>
            <p style={{fontFamily:"'Lora',serif",fontSize:"clamp(20px,2.8vw,32px)",fontWeight:700,color:C.text,lineHeight:1.5}}>
              Enquanto outros te dão questões,<br/>
              <span style={{color:C.primary}}>nós te damos direção.</span>
            </p>
          </div>
        </div>
      </section>
      <footer style={{background:C.text,color:"white",padding:"56px 28px 32px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:40,marginBottom:48}} className="footer-inner">
            <div style={{maxWidth:280}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <Logo size={34}/>
                <div>
                  <div style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:16,color:"white"}}>DominaBanca</div>
                  <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",letterSpacing:1.5,textTransform:"uppercase",marginTop:1}}>Preparação Inteligente</div>
                </div>
              </div>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",lineHeight:1.7}}>
                Cronograma inteligente, questões no estilo da banca e simulados agendados para a sua preparação.
              </p>
            </div>
            <div style={{display:"flex",gap:56,flexWrap:"wrap"}}>
              {[
                {title:"Produto",links:["Como funciona","Recursos","Correção de Redação","Planos"]},
                {title:"Empresa",links:["Sobre nós","Blog","Contato","Imprensa"]},
                {title:"Legal",links:["Termos de uso","Política de privacidade"]},
              ].map(col=>(
                <div key={col.title}>
                  <div style={{fontWeight:700,fontSize:13,marginBottom:14,color:"white"}}>{col.title}</div>
                  {col.links.map(l=><div key={l} style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:10,cursor:"pointer"}}>{l}</div>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:24,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>© 2025 DominaBanca. Todos os direitos reservados.</p>
            <p style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>Feito com IA para concurseiros sérios.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
