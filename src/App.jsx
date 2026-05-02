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
    .hero-section{grid-template-columns:1fr!important;padding:40px 16px 32px!important;}
    .redacao-grid{grid-template-columns:1fr!important;}
    .plans-grid{grid-template-columns:1fr!important;}
    .footer-inner{flex-direction:column!important;gap:32px!important;}
    .hero-btns{flex-direction:column!important;}
    .hero-btns button{width:100%!important;text-align:center!important;}
  }
  @media(min-width:769px){
    .hero-section{display:grid!important;grid-template-columns:1fr 1fr!important;gap:64px!important;align-items:center!important;padding:88px 28px 72px!important;}
    .redacao-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:64px!important;align-items:center!important;}
    .plans-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:24px!important;}
    .testimonials-grid{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:20px!important;}
    .how-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:20px!important;}
    .demo-show{display:block!important;}
    .demo-mobile{display:none!important;}
  }
`;

// ── Logo SVG ───────────────────────────────────────────────────────────────────
const Logo = ({ size = 38 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: Math.round(size * 0.18),
    background: C.primary,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, boxShadow: `0 2px 8px rgba(91,79,207,0.3)`
  }}>
    <span style={{
      fontFamily: "'Lora', serif",
      fontWeight: 700,
      fontSize: Math.round(size * 0.42),
      color: "white",
      letterSpacing: "-0.5px",
      lineHeight: 1
    }}>DB</span>
  </div>
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

function Landing({ onCadastro, onLogin }) {
  return(
    <div style={{fontFamily:"'Sora',sans-serif",background:C.bg,color:C.text}}>

      {/* ── NAV ── */}
      <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 8px rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 28px",height:66,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <LogoMark/>
          <button className="cta-btn" onClick={onLogin} style={{padding:"10px 24px",background:C.primary,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>
            Área do aluno
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-section" style={{maxWidth:1100,margin:"0 auto",padding:"72px 28px 60px"}}>
        <div style={{animation:"fadeUp 0.6s ease"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.primaryXLight,border:`1px solid ${C.borderPurple}`,borderRadius:100,padding:"6px 16px",fontSize:12,fontWeight:700,color:C.primary,marginBottom:28}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:C.primary,animation:"pulse 2s infinite"}}/>
            Plataforma de questões para concursos públicos
          </div>
          <h1 style={{fontFamily:"'Lora',serif",fontSize:"clamp(30px,4vw,52px)",fontWeight:700,lineHeight:1.18,color:C.text,marginBottom:22}}>
            Transforme seu edital
            <br/>em um plano estruturado
            <br/><span style={{color:C.primary}}>de estudo.</span>
          </h1>
          <p style={{fontSize:17,color:C.textMed,lineHeight:1.8,marginBottom:40,maxWidth:460}}>
            Questões, cronograma e simulados personalizados para o seu estudo diário.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}} className="hero-btns">
            <button className="cta-btn" onClick={onCadastro} style={{padding:"15px 32px",background:C.primary,color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>
              Começar gratuitamente →
            </button>
          </div>
        </div>
        {/* Demo — aparece só no desktop */}
        <div className="demo-show" style={{display:"none"}}>
          <DemoPlayer/>
        </div>
      </section>

      {/* ── DEMO MOBILE — esconde no desktop ── */}
      <section className="demo-mobile" style={{background:C.bg,padding:"0 20px 56px"}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,color:C.primary,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16}}>Veja funcionando</div>
          <h2 style={{fontFamily:"'Lora',serif",fontSize:"clamp(22px,3vw,36px)",fontWeight:700,color:C.text,marginBottom:32}}>
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

              <button className="cta-btn" onClick={onCadastro} style={{width:"100%",padding:14,background:"transparent",color:C.primary,border:`2px solid ${C.primary}`,borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer"}}>
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
            <div style={{display:"flex",flexDirection:"column",gap:20}} className="testimonials-grid">
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

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

const CadastroLogo = () => (
  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
    <div style={{
      width:40, height:40,
      borderRadius:12,
      background:C.primary,
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:`0 4px 12px rgba(91,79,207,0.35)`
    }}>
      <span style={{ fontFamily:"'Lora',serif", fontWeight:700, fontSize:16, color:"white", letterSpacing:"-0.5px" }}>DB</span>
    </div>
    <div>
      <div style={{ fontFamily:"'Lora',serif", fontWeight:700, fontSize:16, color:C.text, lineHeight:1 }}>DominaBanca</div>
      <div style={{ fontSize:9, color:C.textLight, letterSpacing:1.5, textTransform:"uppercase", marginTop:2 }}>Preparação Inteligente</div>
    </div>
  </div>
);

const ProgressBar = ({ step, total }) => (
  <div style={{ marginBottom:32 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
      <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>Etapa {step} de {total}</span>
      <span style={{ fontSize:11, color:C.textLight }}>{Math.round((step/total)*100)}% concluído</span>
    </div>
    <div style={{ height:4, background:C.border, borderRadius:99, overflow:"hidden" }}>
      <div style={{
        height:"100%",
        width:`${(step/total)*100}%`,
        background:`linear-gradient(90deg,${C.primary},${C.primaryLight})`,
        borderRadius:99,
        transition:"width 0.4s ease"
      }}/>
    </div>
    <div style={{ display:"flex", gap:8, marginTop:12 }}>
      {Array.from({length:total},(_,i)=>(
        <div key={i} style={{
          flex:1, height:3, borderRadius:99,
          background: i < step ? C.primary : C.border,
          transition:"background 0.3s ease"
        }}/>
      ))}
    </div>
  </div>
);

const Field = ({ label, name, type="text", value, onChange, error, placeholder, hint, autoFocus }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:13, fontWeight:700, color:C.textMed }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={e=>onChange(name,e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`inp${error?" error":""}`}
      style={{
        padding:"13px 16px",
        border:`1.5px solid ${error?C.danger:C.border}`,
        borderRadius:12,
        fontSize:14,
        color:C.text,
        background:C.white,
        width:"100%"
      }}
    />
    {error && <span style={{ fontSize:11, color:C.danger, fontWeight:600 }}>{error}</span>}
    {hint && !error && <span style={{ fontSize:11, color:C.textLight }}>{hint}</span>}
  </div>
);

const SelectField = ({ label, name, value, onChange, error, options, placeholder }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:13, fontWeight:700, color:C.textMed }}>{label}</label>
    <div style={{ position:"relative" }}>
      <select
        value={value}
        onChange={e=>onChange(name,e.target.value)}
        className={`inp${error?" error":""}`}
        style={{
          padding:"13px 40px 13px 16px",
          border:`1.5px solid ${error?C.danger:C.border}`,
          borderRadius:12,
          fontSize:14,
          color:value?C.text:C.textLight,
          background:C.white,
          width:"100%",
          cursor:"pointer"
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o=>(
          <option key={o.v||o} value={o.v||o}>{o.l||o}</option>
        ))}
      </select>
      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:C.textLight, fontSize:12 }}>▼</div>
    </div>
    {error && <span style={{ fontSize:11, color:C.danger, fontWeight:600 }}>{error}</span>}
  </div>
);

const SexoSelector = ({ value, onChange }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:13, fontWeight:700, color:C.textMed }}>Sexo</label>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
      {[{v:"M",l:"Masculino",icon:"👨"},{v:"F",l:"Feminino",icon:"👩"},{v:"O",l:"Prefiro não informar",icon:"🧑"}].map(o=>(
        <div key={o.v} className={`opt-card${value===o.v?" sel":""}`} onClick={()=>onChange("sexo",o.v)}
          style={{
            padding:"12px 8px", borderRadius:12, border:`1.5px solid ${value===o.v?C.primary:C.border}`,
            background:value===o.v?C.primaryXLight:C.white, textAlign:"center"
          }}>
          <div style={{ fontSize:22, marginBottom:4 }}>{o.icon}</div>
          <div style={{ fontSize:11, fontWeight:value===o.v?700:500, color:value===o.v?C.primary:C.textMed, lineHeight:1.3 }}>{o.l}</div>
        </div>
      ))}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// ETAPA 1 — Acesso
// ══════════════════════════════════════════════════════════════════════════════
const Etapa1 = ({ data, onChange, onNext, onLogin }) => {
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if(!data.email) e.email = "Email obrigatório";
    else if(!/\S+@\S+\.\S+/.test(data.email)) e.email = "Email inválido";
    if(!data.senha) e.senha = "Senha obrigatória";
    else if(data.senha.length < 6) e.senha = "Mínimo de 6 caracteres";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if(Object.keys(e).length > 0){ setErrors(e); return; }
    onNext();
  };

  return(
    <div style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp 0.4s ease" }}>
      <div style={{ marginBottom:4 }}>
        <h2 style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:700, color:C.text, marginBottom:8 }}>Crie sua conta</h2>
        <p style={{ fontSize:14, color:C.textMed, lineHeight:1.6 }}>Sua aprovação começa agora e você <span style={{color:C.primary, fontWeight:700}}>não paga nada</span> para dar o primeiro passo.</p>
      </div>

      <Field label="Email" name="email" type="email" value={data.email} onChange={onChange} error={errors.email} placeholder="seu@email.com" autoFocus/>

      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <label style={{ fontSize:13, fontWeight:700, color:C.textMed }}>Senha</label>
        <div style={{ position:"relative" }}>
          <input
            type={showPass?"text":"password"}
            value={data.senha}
            onChange={e=>onChange("senha",e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className={`inp${errors.senha?" error":""}`}
            style={{ padding:"13px 48px 13px 16px", border:`1.5px solid ${errors.senha?C.danger:C.border}`, borderRadius:12, fontSize:14, color:C.text, background:C.white, width:"100%" }}
          />
          <button onClick={()=>setShowPass(!showPass)}
            style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.textLight, fontSize:16 }}>
            {showPass?"🙈":"👁️"}
          </button>
        </div>
        {errors.senha && <span style={{ fontSize:11, color:C.danger, fontWeight:600 }}>{errors.senha}</span>}

        {/* Força da senha */}
        {data.senha.length > 0 && (
          <div style={{ display:"flex", gap:4, marginTop:4 }}>
            {[1,2,3].map(i=>{
              const strength = data.senha.length < 6 ? 0 : data.senha.length < 8 ? 1 : /[A-Z]/.test(data.senha) && /[0-9]/.test(data.senha) ? 3 : 2;
              return <div key={i} style={{ flex:1, height:3, borderRadius:99, background:i<=strength?(strength===1?C.danger:strength===2?"#F5A623":C.accent):C.border, transition:"background 0.3s" }}/>;
            })}
            <span style={{ fontSize:10, color:C.textLight, marginLeft:4 }}>
              {data.senha.length < 6 ? "Fraca" : data.senha.length < 8 ? "Média" : /[A-Z]/.test(data.senha) && /[0-9]/.test(data.senha) ? "Forte" : "Boa"}
            </span>
          </div>
        )}
      </div>

      <button className="btn-main" onClick={handleNext}
        style={{ padding:"15px", background:C.primary, color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:C.shadowMd, marginTop:4 }}>
        Continuar →
      </button>

      <p style={{ textAlign:"center", fontSize:11, color:C.textLight, lineHeight:1.6 }}>
        Ao continuar você concorda com os <span style={{ color:C.primary, cursor:"pointer" }}>Termos de uso</span> e <span style={{ color:C.primary, cursor:"pointer" }}>Política de privacidade</span>.
      </p>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ETAPA 2 — Quem é você
// ══════════════════════════════════════════════════════════════════════════════
const Etapa2 = ({ data, onChange, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if(!data.nome.trim()) e.nome = "Nome obrigatório";
    else if(data.nome.trim().split(" ").length < 2) e.nome = "Informe seu nome completo";
    if(!data.nascimento) e.nascimento = "Data de nascimento obrigatória";
    else {
      const d = new Date(data.nascimento);
      const age = (new Date() - d) / (365.25*24*3600*1000);
      if(age < 14) e.nascimento = "Você precisa ter pelo menos 14 anos";
      if(age > 100) e.nascimento = "Data inválida";
    }
    if(!data.sexo) e.sexo = "Selecione uma opção";
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if(Object.keys(e).length > 0){ setErrors(e); return; }
    onNext();
  };

  return(
    <div style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp 0.4s ease" }}>
      <div style={{ marginBottom:4 }}>
        <h2 style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:700, color:C.text, marginBottom:8 }}>Quem é você?</h2>
        <p style={{ fontSize:14, color:C.textMed, lineHeight:1.6 }}>Essas informações nos ajudam a personalizar sua experiência.</p>
      </div>

      <Field label="Nome completo" name="nome" value={data.nome} onChange={onChange} error={errors.nome} placeholder="Como você se chama?" autoFocus/>

      <Field label="Data de nascimento" name="nascimento" type="date" value={data.nascimento} onChange={onChange} error={errors.nascimento}
        hint="Usamos para entender o perfil dos nossos alunos"/>

      <SexoSelector value={data.sexo} onChange={onChange}/>
      {errors.sexo && <span style={{ fontSize:11, color:C.danger, fontWeight:600, marginTop:-12 }}>{errors.sexo}</span>}

      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button className="btn-back" onClick={onBack}
          style={{ flex:1, padding:"15px", background:C.bg, color:C.textMed, border:`1.5px solid ${C.border}`, borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          ← Voltar
        </button>
        <button className="btn-main" onClick={handleNext}
          style={{ flex:2, padding:"15px", background:C.primary, color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:C.shadowMd }}>
          Continuar →
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ETAPA 3 — Onde você está
// ══════════════════════════════════════════════════════════════════════════════
const Etapa3 = ({ data, onChange, onSubmit, onBack, loading }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if(!data.estado) e.estado = "Selecione seu estado";
    if(!data.cidade.trim()) e.cidade = "Informe sua cidade";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if(Object.keys(e).length > 0){ setErrors(e); return; }
    onSubmit();
  };

  return(
    <div style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp 0.4s ease" }}>
      <div style={{ marginBottom:4 }}>
        <h2 style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:700, color:C.text, marginBottom:8 }}>Onde você está?</h2>
        <p style={{ fontSize:14, color:C.textMed, lineHeight:1.6 }}>Sua localização nos ajuda a entender de onde vêm nossos alunos.</p>
      </div>

      <SelectField label="Estado" name="estado" value={data.estado} onChange={onChange} error={errors.estado}
        placeholder="Selecione seu estado" options={ESTADOS}/>

      <Field label="Cidade" name="cidade" value={data.cidade} onChange={onChange} error={errors.cidade}
        placeholder="Nome da sua cidade" autoFocus={false}/>

      {/* Preview do perfil */}
      {data.estado && data.cidade && (
        <div style={{ background:C.primaryXLight, border:`1px solid #DDDDF5`, borderRadius:12, padding:"14px 16px", animation:"fadeIn 0.3s ease" }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.primary, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Seu perfil</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:C.primary, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:16, fontWeight:700, flexShrink:0 }}>
              {data.nome?.charAt(0)||"?"}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C.text }}>{data.nome||"Seu nome"}</div>
              <div style={{ fontSize:12, color:C.textMed }}>{data.cidade}, {data.estado}</div>
              <div style={{ fontSize:11, color:C.textLight }}>{data.email}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <button className="btn-back" onClick={onBack}
          style={{ flex:1, padding:"15px", background:C.bg, color:C.textMed, border:`1.5px solid ${C.border}`, borderRadius:12, fontSize:14, fontWeight:600, cursor:"pointer" }}>
          ← Voltar
        </button>
        <button className="btn-main" onClick={handleSubmit} disabled={loading}
          style={{ flex:2, padding:"15px", background:C.primary, color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:C.shadowMd, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          {loading && <div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>}
          {loading ? "Criando sua conta..." : "Criar minha conta →"}
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SUCESSO
// ══════════════════════════════════════════════════════════════════════════════
const Sucesso = ({ nome, onContinue }) => (
  <div style={{ textAlign:"center", animation:"fadeUp 0.5s ease" }}>
    <div style={{ width:72, height:72, borderRadius:"50%", background:C.accentLight, border:`3px solid ${C.accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>
      ✓
    </div>
    <h2 style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:700, color:C.text, marginBottom:10 }}>
      Bem-vindo ao DominaBanca, {nome?.split(" ")[0]}!
    </h2>
    <p style={{ fontSize:14, color:C.textMed, lineHeight:1.7, marginBottom:32, maxWidth:320, margin:"0 auto 32px" }}>
      Sua conta foi criada. Agora vamos montar seu plano de estudos personalizado.
    </p>
    <button className="btn-main" onClick={onContinue}
      style={{ width:"100%", padding:"15px", background:C.primary, color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:C.shadowMd }}>
      Montar meu plano de estudos →
    </button>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
function Cadastro({ onBack, onSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    email:"", senha:"", nome:"", nascimento:"", sexo:"", estado:"", cidade:""
  });

  const handleChange = (name, value) => setForm(f => ({...f, [name]:value}));

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
  };

  const TOTAL_STEPS = 3;

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>

      {/* Nav */}
      <nav style={{ background:C.white, borderBottom:`1px solid ${C.border}`, height:64, display:"flex", alignItems:"center", padding:"0 28px", boxShadow:"0 1px 6px rgba(0,0,0,0.04)", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <CadastroLogo/>
        </button>
        <button onClick={onBack} className="btn-back"
          style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"7px 16px", fontSize:13, fontWeight:600, color:C.textMed, cursor:"pointer" }}>
          ← Voltar ao início
        </button>
      </nav>

      {/* Content */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 16px" }}>
        <div style={{ width:"100%", maxWidth:460 }}>

          {/* Card */}
          <div style={{ background:C.white, borderRadius:24, padding:"36px 32px", boxShadow:C.shadowLg, border:`1px solid ${C.border}` }}>

            {!done && <ProgressBar step={step} total={TOTAL_STEPS}/>}

            {done ? (
              <Sucesso nome={form.nome} onContinue={()=>onSuccess&&onSuccess(form)}/>
            ) : step === 1 ? (
              <Etapa1 data={form} onChange={handleChange} onNext={()=>setStep(2)} onLogin={()=>alert("Ir para o login")}/>
            ) : step === 2 ? (
              <Etapa2 data={form} onChange={handleChange} onNext={()=>setStep(3)} onBack={()=>setStep(1)}/>
            ) : (
              <Etapa3 data={form} onChange={handleChange} onSubmit={handleSubmit} onBack={()=>setStep(2)} loading={loading}/>
            )}
          </div>

          {/* Marca */}
          {!done && (
            <div style={{ display:"flex", justifyContent:"center", marginTop:28, animation:"fadeIn 0.5s ease" }}>
              <CadastroLogo/>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
function Login({ onBack, onCadastro, onSuccess }) {
  const [tela, setTela] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email:"", senha:"", emailRecuperar:"" });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setForm(f => ({...f, [name]:value}));
    if(errors[name]) setErrors(e => ({...e, [name]:""}));
  };

  const validateLogin = () => {
    const e = {};
    if(!form.email) e.email = "Email obrigatório";
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email inválido";
    if(!form.senha) e.senha = "Senha obrigatória";
    return e;
  };

  const handleLogin = async () => {
    const e = validateLogin();
    if(Object.keys(e).length > 0){ setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    onSuccess && onSuccess(form);
  };

  const handleRecuperar = async () => {
    if(!form.emailRecuperar || !/\S+@\S+\.\S+/.test(form.emailRecuperar)){
      setErrors({ emailRecuperar:"Email inválido" });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setTela("confirmado");
  };

  const NavLogin = ({ voltarPara, voltarLabel }) => (
    <nav style={{ background:"white", borderBottom:`1px solid ${C.border}`, height:64, display:"flex", alignItems:"center", padding:"0 28px", justifyContent:"space-between", boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
        <CadastroLogo/>
      </button>
      <button onClick={voltarPara} className="btn-back"
        style={{ display:"flex", alignItems:"center", gap:6, background:"transparent", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"7px 16px", fontSize:13, fontWeight:600, color:C.textMed, cursor:"pointer" }}>
        ← {voltarLabel}
      </button>
    </nav>
  );

  const Wrapper = ({ children }) => (
    <div style={{ fontFamily:"'Sora',sans-serif", minHeight:"100vh", background:C.bg, display:"flex", flexDirection:"column" }}>
      {children}
    </div>
  );

  if(tela === "login") return (
    <Wrapper>
      <NavLogin voltarPara={onBack} voltarLabel="Voltar ao início"/>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 16px" }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp 0.4s ease" }}>
          <div style={{ background:"white", borderRadius:24, padding:"40px 36px", boxShadow:C.shadowLg, border:`1px solid ${C.border}` }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <h1 style={{ fontFamily:"'Lora',serif", fontSize:26, fontWeight:700, color:C.text, marginBottom:8 }}>Bem-vindo de volta</h1>
              <p style={{ fontSize:14, color:C.textMed, lineHeight:1.6 }}>Entre na sua conta para continuar estudando.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ fontSize:13, fontWeight:700, color:C.textMed }}>Email</label>
                <input type="email" value={form.email} onChange={e=>handleChange("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                  placeholder="seu@email.com" autoFocus className="inp"
                  style={{ padding:"13px 16px", border:`1.5px solid ${errors.email?C.danger:C.border}`, borderRadius:12, fontSize:14, color:C.text, background:"white", width:"100%", outline:"none" }}/>
                {errors.email && <span style={{ fontSize:11, color:C.danger, fontWeight:600 }}>{errors.email}</span>}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <label style={{ fontSize:13, fontWeight:700, color:C.textMed }}>Senha</label>
                  <button onClick={()=>setTela("recuperar")} style={{ background:"none", border:"none", color:C.primary, fontSize:12, fontWeight:600, cursor:"pointer", padding:0 }}>
                    Esqueci minha senha
                  </button>
                </div>
                <div style={{ position:"relative" }}>
                  <input type={showPass?"text":"password"} value={form.senha} onChange={e=>handleChange("senha",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
                    placeholder="Sua senha" className="inp"
                    style={{ padding:"13px 48px 13px 16px", border:`1.5px solid ${errors.senha?C.danger:C.border}`, borderRadius:12, fontSize:14, color:C.text, background:"white", width:"100%", outline:"none" }}/>
                  <button onClick={()=>setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:C.textLight, fontSize:16 }}>
                    {showPass?"🙈":"👁️"}
                  </button>
                </div>
                {errors.senha && <span style={{ fontSize:11, color:C.danger, fontWeight:600 }}>{errors.senha}</span>}
              </div>
              <button className="btn-main" onClick={handleLogin} disabled={loading}
                style={{ padding:"15px", background:C.primary, color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:C.shadowMd, marginTop:4, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {loading&&<div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>}
                {loading?"Entrando...":"Entrar →"}
              </button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
              <div style={{ flex:1, height:1, background:C.border }}/>
              <span style={{ fontSize:11, color:C.textLight, fontWeight:600 }}>ou</span>
              <div style={{ flex:1, height:1, background:C.border }}/>
            </div>
            <p style={{ textAlign:"center", fontSize:13, color:C.textMed }}>
              Ainda não tem conta?{" "}
              <button onClick={onCadastro} style={{ background:"none", border:"none", color:C.primary, fontWeight:700, cursor:"pointer", fontSize:13 }}>
                Criar gratuitamente
              </button>
            </p>
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginTop:28 }}><CadastroLogo/></div>
        </div>
      </div>
    </Wrapper>
  );

  if(tela === "recuperar") return (
    <Wrapper>
      <NavLogin voltarPara={()=>setTela("login")} voltarLabel="Voltar ao login"/>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 16px" }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp 0.4s ease" }}>
          <div style={{ background:"white", borderRadius:24, padding:"40px 36px", boxShadow:C.shadowLg, border:`1px solid ${C.border}` }}>
            <div style={{ textAlign:"center", marginBottom:32 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:C.primaryXLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 16px" }}>🔐</div>
              <h1 style={{ fontFamily:"'Lora',serif", fontSize:24, fontWeight:700, color:C.text, marginBottom:8 }}>Recuperar senha</h1>
              <p style={{ fontSize:14, color:C.textMed, lineHeight:1.7 }}>Informe o email da sua conta. Vamos enviar um link para você criar uma nova senha.</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <label style={{ fontSize:13, fontWeight:700, color:C.textMed }}>Email da conta</label>
                <input type="email" value={form.emailRecuperar} onChange={e=>handleChange("emailRecuperar",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleRecuperar()}
                  placeholder="seu@email.com" autoFocus className="inp"
                  style={{ padding:"13px 16px", border:`1.5px solid ${errors.emailRecuperar?C.danger:C.border}`, borderRadius:12, fontSize:14, color:C.text, background:"white", width:"100%", outline:"none" }}/>
                {errors.emailRecuperar && <span style={{ fontSize:11, color:C.danger, fontWeight:600 }}>{errors.emailRecuperar}</span>}
              </div>
              <button className="btn-main" onClick={handleRecuperar} disabled={loading}
                style={{ padding:"15px", background:C.primary, color:"white", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:C.shadowMd, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                {loading&&<div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>}
                {loading?"Enviando...":"Enviar link de recuperação →"}
              </button>
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginTop:28 }}><CadastroLogo/></div>
        </div>
      </div>
    </Wrapper>
  );

  return (
    <Wrapper>
      <NavLogin voltarPara={onBack} voltarLabel="Voltar ao início"/>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 16px" }}>
        <div style={{ width:"100%", maxWidth:420, animation:"fadeUp 0.5s ease" }}>
          <div style={{ background:"white", borderRadius:24, padding:"40px 36px", boxShadow:C.shadowLg, border:`1px solid ${C.border}`, textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:C.accentLight, border:`3px solid ${C.accent}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 20px" }}>✉️</div>
            <h2 style={{ fontFamily:"'Lora',serif", fontSize:24, fontWeight:700, color:C.text, marginBottom:10 }}>Email enviado!</h2>
            <p style={{ fontSize:14, color:C.textMed, lineHeight:1.75, marginBottom:8 }}>Enviamos um link de recuperação para:</p>
            <p style={{ fontSize:15, fontWeight:700, color:C.primary, marginBottom:28 }}>{form.emailRecuperar}</p>
            <p style={{ fontSize:13, color:C.textLight, lineHeight:1.7, marginBottom:32 }}>Verifique sua caixa de entrada e a pasta de spam. O link expira em 30 minutos.</p>
            <button className="btn-main" onClick={()=>setTela("login")}
              style={{ width:"100%", padding:"14px", background:C.primary, color:"white", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:C.shadowMd }}>
              Voltar ao login
            </button>
          </div>
          <div style={{ display:"flex", justifyContent:"center", marginTop:28 }}><CadastroLogo/></div>
        </div>
      </div>
    </Wrapper>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT — Gerencia navegação entre telas
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("landing"); // "landing" | "cadastro" | "login" | "onboarding"
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.id = "db-global";
    s.textContent = css;
    document.head.appendChild(s);
  }, []);

  if(screen === "cadastro") return <Cadastro onBack={()=>setScreen("landing")} onSuccess={u=>{setUserData(u);setScreen("onboarding");}}/>;
  if(screen === "login") return <Login onBack={()=>setScreen("landing")} onCadastro={()=>setScreen("cadastro")} onSuccess={u=>{setUserData(u);setScreen("onboarding");}}/>;
  if(screen === "onboarding") return <Onboarding user={userData} onComplete={plan=>{ console.log("Plano criado:", plan); setScreen("landing"); }} onBack={()=>setScreen("landing")}/>;
  return <Landing onCadastro={()=>setScreen("cadastro")} onLogin={()=>setScreen("login")}/>;
}
// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING — Fluxo completo do edital ao cronograma
// ══════════════════════════════════════════════════════════════════════════════

const ONBOARDING_CSS = `
  @keyframes ob-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ob-fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes ob-spin { to{transform:rotate(360deg)} }
  @keyframes ob-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes ob-pop { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes ob-slide { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  .ob-btn:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(91,79,207,0.28)!important;}
  .ob-btn{transition:all 0.2s ease;}
  .ob-chip:hover{border-color:#7C6FE0!important;background:#EFEFFD!important;transform:translateY(-1px);}
  .ob-chip{transition:all 0.15s ease;cursor:pointer;}
  .ob-chip.sel{border-color:#5B4FCF!important;background:#EFEFFD!important;}
  .ob-card:hover{border-color:#7C6FE0!important;transform:translateY(-2px);}
  .ob-card{transition:all 0.2s ease;cursor:pointer;}
  .ob-card.sel{border-color:#5B4FCF!important;background:#EFEFFD!important;}
  .ob-inp:focus{border-color:#5B4FCF!important;box-shadow:0 0 0 3px rgba(91,79,207,0.1)!important;outline:none;}
  .ob-inp{transition:all 0.15s ease;}
  input[type=range].ob-range{-webkit-appearance:none;height:4px;background:#DDDDF5;border-radius:4px;outline:none;width:100%;}
  input[type=range].ob-range::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:#5B4FCF;border-radius:50%;cursor:pointer;box-shadow:0 2px 8px rgba(91,79,207,0.4);}
`;

// ── Constantes de design ──────────────────────────────────────────────────────
const OB = {
  primary: "#5B4FCF",
  primaryLight: "#7C6FE0",
  primaryXLight: "#EFEFFD",
  accent: "#00C48C",
  accentLight: "#E0FBF3",
  warning: "#F5A623",
  warningLight: "#FEF3DC",
  danger: "#F25A5A",
  bg: "#F7F7FC",
  white: "#FFFFFF",
  text: "#1A1A2E",
  textMed: "#4A4A6A",
  textLight: "#9898B8",
  border: "#E8E8F0",
};

// ── Sub-componentes ───────────────────────────────────────────────────────────
const ObSpinner = () => (
  <div style={{width:20,height:20,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"ob-spin 0.8s linear infinite",flexShrink:0}}/>
);

const ObChip = ({label, selected, onClick, color}) => (
  <button className={`ob-chip${selected?" sel":""}`} onClick={onClick}
    style={{padding:"9px 18px",borderRadius:100,border:`1.5px solid ${selected?(color||OB.primary):OB.border}`,background:selected?OB.primaryXLight:OB.white,color:selected?(color||OB.primary):OB.textMed,fontSize:13,fontWeight:selected?700:500,cursor:"pointer"}}>
    {label}
  </button>
);

const ObProgress = ({step, total, label}) => (
  <div style={{marginBottom:32}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontSize:12,fontWeight:700,color:OB.primary}}>{label}</span>
      <span style={{fontSize:11,color:OB.textLight}}>{step} de {total}</span>
    </div>
    <div style={{height:4,background:OB.border,borderRadius:99,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${(step/total)*100}%`,background:`linear-gradient(90deg,${OB.primary},${OB.primaryLight})`,borderRadius:99,transition:"width 0.5s ease"}}/>
    </div>
  </div>
);

const ObCard = ({icon, title, desc, selected, onClick}) => (
  <div className={`ob-card${selected?" sel":""}`} onClick={onClick}
    style={{padding:"20px",border:`1.5px solid ${selected?OB.primary:OB.border}`,borderRadius:16,background:selected?OB.primaryXLight:OB.white,position:"relative"}}>
    {selected && <div style={{position:"absolute",top:12,right:12,width:20,height:20,borderRadius:"50%",background:OB.primary,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:10,fontWeight:700}}>✓</div>}
    <div style={{fontSize:28,marginBottom:10}}>{icon}</div>
    <div style={{fontWeight:700,fontSize:14,color:selected?OB.primary:OB.text,marginBottom:4}}>{title}</div>
    <div style={{fontSize:12,color:OB.textMed,lineHeight:1.6}}>{desc}</div>
  </div>
);

// ── API helper ────────────────────────────────────────────────────────────────
const obApi = async (messages, system) => {
  const r = await fetch("/api/index", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system: system||"Você é um especialista em concursos públicos brasileiros. Responda sempre em português do Brasil.",
      messages,
    }),
  });
  const d = await r.json();
  return d.content?.[0]?.text||"";
};

const safeJson = t => { try{ return JSON.parse(t.replace(/```json|```/g,"").trim()); }catch{ return null; } };

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING — Fluxo completo P1→P5
// ══════════════════════════════════════════════════════════════════════════════

const OB_SYSTEM = `Você é assistente do DominaBanca. Responda em português. Máximo 2 linhas. Nunca faça outras perguntas além do solicitado. Ao validar órgão: NUNCA mencione cargo. Ao validar cargo: NUNCA mencione órgão.`;

const PROMPT_EDITAL = (orgao, cargo) => `Analise este edital do ${orgao} para o cargo ${cargo}. Extraia TUDO de uma vez: grupos, matérias, questões E tópicos completos de cada matéria. Use nomes EXATOS do edital. Retorne APENAS JSON válido:
{"dataProva":"dd/mm/aaaa ou null","totalQuestoes":120,"temDiscursiva":false,"pesoDiscursiva":0,"banca":"null","grupos":[{"nome":"Nome do grupo","materias":[{"nome":"Matéria","questoes":20,"topicos":["Tópico 1","Tópico 2","Tópico 3"]}]}]}`;

async function obAI(messages, maxTokens=300) {
  const r = await fetch("/api/index",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-haiku-4-5-20251001", max_tokens:maxTokens, system:OB_SYSTEM, messages})
  });
  const d = await r.json();
  return d.content?.[0]?.text||"";
}

async function obAIJson(messages, maxTokens=4000) {
  const r = await fetch("/api/index",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-haiku-4-5-20251001", max_tokens:maxTokens,
      system:"Você é especialista em concursos públicos brasileiros. Retorne APENAS JSON válido sem texto adicional.",
      messages})
  });
  const d = await r.json();
  const t = d.content?.[0]?.text||"";
  try{return JSON.parse(t.replace(/```json|```/g,"").trim());}catch{return null;}
}

// ── Sub-componentes ───────────────────────────────────────────────────────────
const ObBotMsg = ({children}) => (
  <div style={{display:"flex",gap:10,alignItems:"flex-start",animation:"fadeUp 0.3s ease",marginBottom:8}}>
    <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#5B4FCF,#7C6FE0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0,fontFamily:"'Lora',serif"}}>DB</div>
    <div style={{background:"white",border:"1px solid #E8E8F0",borderRadius:"4px 14px 14px 14px",padding:"10px 14px",maxWidth:"82%",fontSize:13,lineHeight:1.7,color:"#1A1A2E",boxShadow:"0 1px 8px rgba(91,79,207,0.06)"}}>{children}</div>
  </div>
);

const ObUserMsg = ({text}) => (
  <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8,animation:"fadeUp 0.2s ease"}}>
    <div style={{background:"#5B4FCF",borderRadius:"14px 4px 14px 14px",padding:"10px 14px",maxWidth:"72%",fontSize:13,lineHeight:1.7,color:"white"}}>{text}</div>
  </div>
);

const ObDots = () => (
  <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
    <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#5B4FCF,#7C6FE0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"white",flexShrink:0,fontFamily:"'Lora',serif"}}>DB</div>
    <div style={{background:"white",border:"1px solid #E8E8F0",borderRadius:"4px 14px 14px 14px",padding:"12px 16px",display:"flex",gap:5,alignItems:"center"}}>
      {[0,.2,.4].map((d,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:"#5B4FCF",animation:`pulse ${1.2}s ease ${d}s infinite`}}/>)}
    </div>
  </div>
);

const ObConfirmCard = ({label,value,onEdit,onConfirm}) => (
  <div style={{background:"#EFEFFD",border:"1.5px solid #DDDDF5",borderRadius:14,padding:"12px 14px",marginBottom:8,animation:"fadeUp 0.3s ease"}}>
    <div style={{fontSize:10,fontWeight:700,color:"#5B4FCF",letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>Confirmar {label}</div>
    <div style={{fontSize:15,fontWeight:700,color:"#1A1A2E",marginBottom:12}}>{value}</div>
    <div style={{display:"flex",gap:8}}>
      <button onClick={onEdit} style={{flex:1,padding:"9px",background:"white",color:"#4A4A6A",border:"1.5px solid #E8E8F0",borderRadius:9,fontSize:12,fontWeight:600,cursor:"pointer"}}>✏️ Corrigir</button>
      <button onClick={onConfirm} style={{flex:2,padding:"9px",background:"#5B4FCF",color:"white",border:"none",borderRadius:9,fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Confirmar</button>
    </div>
  </div>
);

// ── P3: Revisão de matérias ───────────────────────────────────────────────────
const ObRevisaoMaterias = ({dados, onConfirm}) => {
  const [grupos, setGrupos] = useState(dados.grupos||[]);
  const [exp, setExp] = useState({});
  const toggle = k => setExp(e=>({...e,[k]:!e[k]}));
  const updM = (gi,mi,f,v) => setGrupos(gs=>gs.map((g,i)=>i!==gi?g:{...g,materias:g.materias.map((m,j)=>j!==mi?m:{...m,[f]:v})}));
  const remM = (gi,mi) => setGrupos(gs=>gs.map((g,i)=>i!==gi?g:{...g,materias:g.materias.filter((_,j)=>j!==mi)}));
  const addM = gi => setGrupos(gs=>gs.map((g,i)=>i!==gi?g:{...g,materias:[...g.materias,{nome:"",questoes:0,topicos:[]}]}));
  const updT = (gi,mi,ti,v) => setGrupos(gs=>gs.map((g,i)=>i!==gi?g:{...g,materias:g.materias.map((m,j)=>j!==mi?m:{...m,topicos:(m.topicos||[]).map((t,k)=>k!==ti?t:v)})}));
  const remT = (gi,mi,ti) => setGrupos(gs=>gs.map((g,i)=>i!==gi?g:{...g,materias:g.materias.map((m,j)=>j!==mi?m:{...m,topicos:(m.topicos||[]).filter((_,k)=>k!==ti)})}));
  const addT = (gi,mi) => setGrupos(gs=>gs.map((g,i)=>i!==gi?g:{...g,materias:g.materias.map((m,j)=>j!==mi?m:{...m,topicos:[...(m.topicos||[]),""]})}));
  const totalM = grupos.reduce((a,g)=>a+g.materias.length,0);
  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <div style={{background:"#EFEFFD",border:"1px solid #DDDDF5",borderRadius:12,padding:"10px 14px",marginBottom:10,fontSize:12,color:"#5B4FCF",fontWeight:600}}>
        {grupos.length} grupos · {totalM} matérias — clique em cada matéria para editar os tópicos
      </div>
      {grupos.map((g,gi)=>(
        <div key={gi} style={{border:"1px solid #E8E8F0",borderRadius:12,overflow:"hidden",marginBottom:8}}>
          <div style={{background:"linear-gradient(135deg,#5B4FCF,#7C6FE0)",padding:"9px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:12,fontWeight:800,color:"white"}}>{g.nome} <span style={{fontSize:10,fontWeight:400,opacity:.7}}>({g.materias.length} mat.)</span></span>
            <button onClick={()=>addM(gi)} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:6,padding:"3px 9px",fontSize:10,fontWeight:700,color:"white",cursor:"pointer"}}>+ matéria</button>
          </div>
          <div style={{padding:"7px 10px",display:"flex",flexDirection:"column",gap:4}}>
            {g.materias.map((m,mi)=>{
              const k=`${gi}-${mi}`;
              const pct=dados.totalQuestoes?Math.round((m.questoes/dados.totalQuestoes)*100):0;
              return (
                <div key={mi} style={{border:"1px solid #E8E8F0",borderRadius:9,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#F7F7FC",cursor:"pointer"}} onClick={()=>toggle(k)}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#1A1A2E"}}>{m.nome}</div>
                      <div style={{display:"flex",gap:5,alignItems:"center",marginTop:2}}>
                        <div style={{height:2,width:60,background:"#E8E8F0",borderRadius:99,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:"#5B4FCF",borderRadius:99}}/>
                        </div>
                        <span style={{fontSize:10,color:"#9898B8"}}>{m.questoes}q · {pct}% · {(m.topicos||[]).length} tópicos</span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      <span style={{fontSize:11,color:"#9898B8"}}>{exp[k]?"▲":"▼"}</span>
                      <button onClick={e=>{e.stopPropagation();remM(gi,mi)}} style={{background:"none",border:"none",color:"#F25A5A",cursor:"pointer",fontSize:13}}>✕</button>
                    </div>
                  </div>
                  {exp[k]&&(
                    <div style={{background:"white",padding:"8px 10px",borderTop:"1px solid #E8E8F0"}}>
                      <div style={{display:"flex",gap:7,marginBottom:7}}>
                        <input value={m.nome} onChange={e=>updM(gi,mi,"nome",e.target.value)} style={{flex:1,padding:"6px 9px",border:"1px solid #E8E8F0",borderRadius:7,fontSize:12,color:"#1A1A2E",background:"#F7F7FC",outline:"none"}} placeholder="Nome da matéria"/>
                        <input type="number" value={m.questoes||""} onChange={e=>updM(gi,mi,"questoes",parseInt(e.target.value)||0)} style={{width:52,padding:"6px 7px",border:"1px solid #E8E8F0",borderRadius:7,fontSize:12,color:"#1A1A2E",background:"#F7F7FC",outline:"none",textAlign:"center"}} placeholder="q"/>
                      </div>
                      {(m.topicos||[]).map((t,ti)=>(
                        <div key={ti} style={{display:"flex",gap:5,alignItems:"center",marginBottom:3}}>
                          <span style={{color:"#9898B8",fontSize:10}}>•</span>
                          <input value={t} onChange={e=>updT(gi,mi,ti,e.target.value)} style={{flex:1,padding:"4px 8px",border:"1px solid #E8E8F0",borderRadius:6,fontSize:11,color:"#4A4A6A",background:"#F7F7FC",outline:"none"}} placeholder="Tópico"/>
                          <button onClick={()=>remT(gi,mi,ti)} style={{background:"none",border:"none",color:"#F25A5A",cursor:"pointer",fontSize:11}}>✕</button>
                        </div>
                      ))}
                      <button onClick={()=>addT(gi,mi)} style={{padding:"4px 8px",background:"transparent",border:"1px dashed #E8E8F0",borderRadius:6,fontSize:10,color:"#9898B8",cursor:"pointer",marginTop:3}}>+ tópico</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={()=>onConfirm(grupos)} style={{width:"100%",padding:"13px",background:"#5B4FCF",color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(91,79,207,0.28)"}}>
        ✓ Confirmar matérias e tópicos →
      </button>
    </div>
  );
};

// ── P4: Discursiva ────────────────────────────────────────────────────────────
const ObDiscursiva = ({banca, onConfirm, onSkip}) => {
  const [tipo, setTipo] = useState(null);
  const [peso, setPeso] = useState("");
  const [freq, setFreq] = useState(2);
  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,color:"#1A1A2E",marginBottom:5}}>Qual é o tipo da prova discursiva?</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {v:"redacao",icon:"✍️",t:"Redação",d:"Texto dissertativo-argumentativo (estilo ENEM/CESPE)"},
            {v:"dissertativa",icon:"📝",t:"Questões dissertativas",d:"Respostas técnicas por tema (estilo FGV/ESAF)"},
          ].map(op=>(
            <div key={op.v} onClick={()=>setTipo(op.v)}
              style={{padding:"14px",border:`1.5px solid ${tipo===op.v?"#5B4FCF":"#E8E8F0"}`,borderRadius:12,background:tipo===op.v?"#EFEFFD":"white",cursor:"pointer",position:"relative"}}>
              {tipo===op.v&&<div style={{position:"absolute",top:8,right:8,width:18,height:18,borderRadius:"50%",background:"#5B4FCF",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"white",fontWeight:700}}>✓</div>}
              <div style={{fontSize:20,marginBottom:6}}>{op.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:tipo===op.v?"#5B4FCF":"#1A1A2E",marginBottom:3}}>{op.t}</div>
              <div style={{fontSize:11,color:"#9898B8",lineHeight:1.5}}>{op.d}</div>
            </div>
          ))}
        </div>
      </div>
      {tipo&&(
        <div style={{marginBottom:14,animation:"fadeUp 0.3s ease"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1A1A2E",marginBottom:8}}>Quantas vezes por semana quer treinar?</div>
          <div style={{display:"flex",gap:8}}>
            {[1,2,3].map(n=>(
              <button key={n} onClick={()=>setFreq(n)}
                style={{flex:1,padding:"10px",border:`1.5px solid ${freq===n?"#5B4FCF":"#E8E8F0"}`,borderRadius:10,background:freq===n?"#EFEFFD":"white",color:freq===n?"#5B4FCF":"#4A4A6A",fontSize:13,fontWeight:freq===n?700:500,cursor:"pointer"}}>
                {n}x {n===2&&"⭐"}
              </button>
            ))}
          </div>
        </div>
      )}
      {tipo&&(
        <div style={{marginBottom:16,animation:"fadeUp 0.3s ease"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1A1A2E",marginBottom:6}}>Peso na nota final (opcional)</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <input type="number" value={peso} onChange={e=>setPeso(e.target.value)} placeholder="Ex: 30" min="0" max="100"
              style={{width:80,padding:"9px 12px",border:"1.5px solid #E8E8F0",borderRadius:10,fontSize:14,color:"#1A1A2E",background:"#F7F7FC",outline:"none",textAlign:"center"}}/>
            <span style={{fontSize:13,color:"#4A4A6A"}}>% da nota total</span>
          </div>
        </div>
      )}
      <div style={{display:"flex",gap:10}}>
        <button onClick={onSkip} style={{flex:1,padding:"12px",background:"white",color:"#4A4A6A",border:"1.5px solid #E8E8F0",borderRadius:12,fontSize:12,fontWeight:600,cursor:"pointer"}}>Pular por agora</button>
        <button onClick={()=>tipo&&onConfirm({tipo,freq,peso:parseInt(peso)||0})} disabled={!tipo}
          style={{flex:2,padding:"12px",background:tipo?"#5B4FCF":"#E8E8F0",color:tipo?"white":"#9898B8",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:tipo?"pointer":"not-allowed"}}>
          ✓ Confirmar discursiva →
        </button>
      </div>
    </div>
  );
};

// ── P5: Horas + Resumo ────────────────────────────────────────────────────────
const ObHorasResumo = ({dados, onConfirm}) => {
  const DIAS = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  const [horas, setHoras] = useState({Seg:2,Ter:2,Qua:2,Qui:2,Sex:2,Sáb:3,Dom:3});
  const totalHoras = Object.values(horas).reduce((a,b)=>a+b,0);
  const totalMats = dados.grupos?.reduce((a,g)=>a+g.materias.length,0)||0;
  return (
    <div style={{animation:"fadeUp 0.4s ease"}}>
      {/* Horas por dia */}
      <div style={{background:"white",border:"1px solid #E8E8F0",borderRadius:14,padding:"16px",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:"#1A1A2E",marginBottom:4}}>⏰ Horas de estudo por dia</div>
        <div style={{fontSize:11,color:"#9898B8",marginBottom:14}}>Seja realista — consistência vale mais que intensidade.</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {DIAS.map(d=>(
            <div key={d} style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:12,fontWeight:600,color:"#4A4A6A",width:30}}>{d}</span>
              <input type="range" min={0} max={8} value={horas[d]} onChange={e=>setHoras(h=>({...h,[d]:+e.target.value}))}
                style={{flex:1,accentColor:"#5B4FCF"}}/>
              <div style={{width:40,textAlign:"center"}}>
                {horas[d]===0
                  ? <span style={{fontSize:11,color:"#9898B8"}}>folga</span>
                  : <span style={{fontSize:13,fontWeight:700,color:"#5B4FCF"}}>{horas[d]}h</span>
                }
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:12,padding:"8px 12px",background:"#EFEFFD",borderRadius:9,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,color:"#5B4FCF",fontWeight:600}}>Total semanal</span>
          <span style={{fontSize:16,fontWeight:700,color:"#5B4FCF"}}>{totalHoras}h/semana</span>
        </div>
      </div>

      {/* Resumo final */}
      <div style={{background:"white",border:"1.5px solid #E8E8F0",borderRadius:14,overflow:"hidden",marginBottom:12}}>
        <div style={{background:"linear-gradient(135deg,#5B4FCF,#7C6FE0)",padding:"12px 16px"}}>
          <div style={{fontSize:13,fontWeight:800,color:"white"}}>📋 Resumo do seu plano</div>
        </div>
        <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
          {[
            {icon:"🏛️",l:"Concurso",v:`${dados.orgao||"—"} — ${dados.cargo||"—"}`},
            {icon:"📋",l:"Banca",v:dados.banca||"—"},
            {icon:"📅",l:"Data da prova",v:dados.dataProva||"A confirmar"},
            {icon:"📚",l:"Matérias",v:`${totalMats} disciplinas em ${dados.grupos?.length||0} grupos`},
            {icon:"❓",l:"Total de questões",v:dados.totalQuestoes?`${dados.totalQuestoes} questões`:"—"},
            ...(dados.discursiva?[{icon:"✍️",l:"Discursiva",v:`${dados.discursiva.tipo==="redacao"?"Redação":"Questões dissertativas"} · ${dados.discursiva.freq}x/semana${dados.discursiva.peso?` · ${dados.discursiva.peso}% da nota`:`"`}`}]:[]),
            {icon:"⏰",l:"Estudo semanal",v:`${totalHoras}h/semana`},
          ].map(r=>(
            <div key={r.l} style={{display:"flex",gap:10,alignItems:"flex-start",paddingBottom:8,borderBottom:"1px solid #E8E8F0"}}>
              <span style={{fontSize:16,flexShrink:0}}>{r.icon}</span>
              <div>
                <div style={{fontSize:10,color:"#9898B8",fontWeight:600,textTransform:"uppercase",letterSpacing:.5,marginBottom:1}}>{r.l}</div>
                <div style={{fontSize:13,fontWeight:600,color:"#1A1A2E"}}>{r.v}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=>onConfirm(horas)}
        style={{width:"100%",padding:"15px",background:"#5B4FCF",color:"white",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 24px rgba(91,79,207,0.28)"}}>
        Criar meu cronograma →
      </button>
    </div>
  );
};

// ── ONBOARDING PRINCIPAL ──────────────────────────────────────────────────────
function Onboarding({ user, onComplete, onBack }) {
  const nome = user?.nome?.split(" ")[0]||"aluno";
  const [msgs, setMsgs] = useState([]);
  const [typing, setTyping] = useState(false);
  const [phase, setPhase] = useState("init");
  const [input, setInput] = useState("");
  const [orgao, setOrgao] = useState("");
  const [cargo, setCargo] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfName, setPdfName] = useState(null);
  const [dadosEdital, setDadosEdital] = useState(null);
  const [dataProva, setDataProva] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [discursiva, setDiscursiva] = useState(null);
  const [erro, setErro] = useState("");
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(()=>{
    setTimeout(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },120);
  },[msgs,typing,phase]);

  const addMsg = (role,content) => setMsgs(m=>[...m,{role,content}]);
  const bot = (content,delay=700) => new Promise(res=>{
    setTyping(true);
    setTimeout(()=>{setTyping(false);addMsg("bot",content);res();},delay);
  });
  const userMsg = t => addMsg("user",t);
  const rb = t => {
    if(typeof t!=="string") return t;
    return t.split(/(<b>.*?<\/b>)/g).map((p,i)=>p.startsWith("<b>")?<strong key={i}>{p.replace(/<\/?b>/g,"")}</strong>:p);
  };

  useEffect(()=>{
    (async()=>{
      await bot(`Olá, ${nome}! 👋 Vou te ajudar a montar seu plano de estudos personalizado.`);
      await bot(`Para começar, qual é o <b>órgão</b> do concurso que você está se preparando?`,600);
      setPhase("orgao");
      setTimeout(()=>inputRef.current?.focus(),100);
    })();
  },[]);

  const send = async()=>{
    const val=input.trim(); if(!val||typing) return;
    setInput(""); setErro("");
    if(phase==="orgao") await handleOrgao(val);
    else if(phase==="cargo") await handleCargo(val);
    else if(phase==="data") await handleData(val);
  };

  const handleOrgao = async val=>{
    userMsg(val); setPhase("aguardando"); setTyping(true);
    try{
      const raw=await obAI([{role:"user",content:`Valide este órgão público concursal: "${val}". UMA linha. NÃO mencione cargo. NÃO faça perguntas.`}]);
      setTyping(false); addMsg("bot",<span>{raw}</span>);
      const prob=["não parece","não encontrei","misturou","pode confirmar"].some(x=>raw.toLowerCase().includes(x));
      if(prob){setPhase("orgao");setTimeout(()=>inputRef.current?.focus(),100);}
      else{setOrgao(val.toUpperCase());addMsg("confirm",{label:"órgão",value:val.toUpperCase(),onEdit:()=>{setOrgao("");setMsgs(m=>m.filter(x=>x.role!=="confirm"));setPhase("orgao");setTimeout(()=>inputRef.current?.focus(),100);},onConfirm:confirmOrgao});}
    }catch(e){setTyping(false);setErro("Erro: "+e.message);setPhase("orgao");}
  };

  const handleCargo = async val=>{
    userMsg(val); setPhase("aguardando"); setTyping(true);
    try{
      const raw=await obAI([{role:"user",content:`Valide este cargo concursal: "${val}" para o órgão ${orgao}. UMA linha. NÃO mencione órgão. NÃO faça perguntas.`}]);
      setTyping(false); addMsg("bot",<span>{raw}</span>);
      const prob=["não parece","não encontrei","misturou","pode confirmar"].some(x=>raw.toLowerCase().includes(x));
      if(prob){setPhase("cargo");setTimeout(()=>inputRef.current?.focus(),100);}
      else{setCargo(val);addMsg("confirm",{label:"cargo",value:val,onEdit:()=>{setCargo("");setMsgs(m=>m.filter(x=>x.role!=="confirm"));setPhase("cargo");setTimeout(()=>inputRef.current?.focus(),100);},onConfirm:confirmCargo});}
    }catch(e){setTyping(false);setErro("Erro: "+e.message);setPhase("cargo");}
  };

  const handleData = async val=>{
    userMsg(val); setDataProva(val);
    setMsgs(m=>m.filter(x=>x.role!=="confirm"));
    addMsg("confirm",{label:"data da prova",value:val,onEdit:()=>{setDataProva("");setPhase("data");setTimeout(()=>inputRef.current?.focus(),100);},onConfirm:()=>confirmData(val)});
  };

  const confirmOrgao = async()=>{
    setMsgs(m=>m.filter(x=>x.role!=="confirm")); userMsg("Confirmo: "+orgao);
    await bot(`Ótimo! E qual é o <b>cargo</b> que você busca neste concurso?`);
    setPhase("cargo"); setTimeout(()=>inputRef.current?.focus(),100);
  };

  const confirmCargo = async()=>{
    setMsgs(m=>m.filter(x=>x.role!=="confirm")); userMsg("Confirmo: "+cargo);
    await bot(`Perfeito! Agora envie o <b>edital</b> do seu concurso.`,600);
    await bot(`Anexe o PDF do edital abaixo. A IA vai fazer a leitura completa e extrair todas as informações automaticamente.`,500);
    setPhase("pdf");
  };

  const confirmData = async(data)=>{
    setMsgs(m=>m.filter(x=>x.role!=="confirm")); userMsg("Confirmo: "+data);
    setDataProva(data);
    await bot(`Data confirmada! Agora vou mostrar as <b>matérias identificadas</b> no edital. Revise, edite se precisar e confirme.`,600);
    setPhase("materias");
  };

  // ── PDF Upload ──────────────────────────────────────────────────────────────
  const processarPDF = async file=>{
    if(!file||file.type!=="application/pdf") return;
    setPdfName(file.name); setPdfLoading(true); setErro("");
    try{
      const base64 = await new Promise((res,rej)=>{
        const r = new FileReader();
        r.onload = ()=>res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      userMsg(`Edital enviado: ${file.name}`);
      setPhase("lendo");
      await bot("Lendo o edital completo — aguarde alguns segundos...",400);
      setTyping(true);

      const resp = await fetch("/api/index",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:4000,
          system:"Você é especialista em concursos públicos brasileiros. Retorne APENAS JSON válido sem texto adicional.",
          messages:[{role:"user",content:[
            {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},
            {type:"text",text:PROMPT_EDITAL(orgao,cargo)}
          ]}]
        })
      });
      const d = await resp.json();
      const raw = d.content?.[0]?.text||"";
      let dados = null;
      try{dados=JSON.parse(raw.replace(/```json|```/g,"").trim());}catch{}

      setTyping(false); setPdfLoading(false);

      if(!dados?.grupos?.length){
        const errMsg = d.error?.message || raw?.slice(0,100) || "Resposta inválida";
        addMsg("bot",<span>Não consegui extrair as informações. Erro: {errMsg}</span>);
        setPhase("pdf"); return;
      }

      setDadosEdital(dados);
      setGrupos(dados.grupos);
      const nM = dados.grupos.reduce((a,g)=>a+g.materias.length,0);

      await bot(<span>
        Leitura completa! Encontrei <strong>{dados.grupos.length} grupos</strong> com <strong>{nM} matérias</strong>.
        {dados.temDiscursiva?" Sua prova tem prova discursiva.":""}
        <br/>Banca: <strong>{dados.banca||"identificada"}</strong> · Questões: <strong>{dados.totalQuestoes||"—"}</strong>
      </span>,400);

      // Confirmar data da prova
      if(dados.dataProva && dados.dataProva!=="null"){
        setDataProva(dados.dataProva);
        await bot(<span>Identifiquei a data da prova: <strong>{dados.dataProva}</strong>. Está correta?</span>,500);
        addMsg("confirm",{label:"data da prova",value:dados.dataProva,onEdit:()=>{setDataProva("");setMsgs(m=>m.filter(x=>x.role!=="confirm"));setPhase("data");setTimeout(()=>inputRef.current?.focus(),100);},onConfirm:()=>confirmData(dados.dataProva)});
        setPhase("aguardando_data");
      } else {
        await bot("Não encontrei a data da prova no edital. Qual é a data? (formato dd/mm/aaaa)",500);
        setPhase("data");
        setTimeout(()=>inputRef.current?.focus(),100);
      }
    }catch(e){
      setTyping(false); setPdfLoading(false);
      setErro("Erro ao ler o PDF: "+e.message);
      setPhase("pdf");
    }
  };

  const confirmarMaterias = async gruposEditados=>{
    setGrupos(gruposEditados);
    userMsg("Confirmo as matérias e tópicos.");
    if(dadosEdital?.temDiscursiva){
      await bot(<span>Ótimo! Sua prova tem <b>prova discursiva</b>. Vamos configurar como você vai treinar.</span>,600);
      setPhase("discursiva");
    } else {
      await bot("Matérias confirmadas! Agora vamos definir sua rotina de estudos.",600);
      setPhase("horas");
    }
  };

  const confirmarDiscursiva = async disc=>{
    setDiscursiva(disc);
    userMsg(`Confirmo: ${disc.tipo==="redacao"?"Redação":"Questões dissertativas"} · ${disc.freq}x/semana${disc.peso?` · ${disc.peso}%`:""}`);
    await bot("Perfeito! Agora vamos definir sua rotina de estudos.",600);
    setPhase("horas");
  };

  const confirmarHoras = horas=>{
    const dadosFinais = {
      orgao, cargo, dataProva, banca:dadosEdital?.banca,
      totalQuestoes:dadosEdital?.totalQuestoes,
      temDiscursiva:dadosEdital?.temDiscursiva,
      grupos, discursiva, horas,
    };
    onComplete(dadosFinais);
  };

  const showInput = ["orgao","cargo","data"].includes(phase)&&!typing;
  const showPDF = phase==="pdf";
  const showMaterias = phase==="materias"&&!typing;
  const showDiscursiva = phase==="discursiva"&&!typing;
  const showHoras = phase==="horas"&&!typing;
  const prog = {init:0,orgao:10,cargo:25,pdf:35,lendo:45,aguardando_data:50,data:50,materias:60,discursiva:75,horas:88,done:100}[phase]||0;

  return (
    <div style={{fontFamily:"'Sora',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#F7F7FC"}}>
      {/* Nav */}
      <nav style={{background:"white",borderBottom:"1px solid #E8E8F0",height:62,display:"flex",alignItems:"center",padding:"0 20px",justifyContent:"space-between",boxShadow:"0 1px 6px rgba(0,0,0,0.04)",flexShrink:0}}>
        <LogoMark/>
        <button onClick={onBack} className="btn-back" style={{display:"flex",alignItems:"center",gap:6,background:"transparent",border:"1.5px solid #E8E8F0",borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:600,color:"#4A4A6A",cursor:"pointer"}}>
          ← Voltar ao início
        </button>
      </nav>

      {/* Progresso */}
      <div style={{padding:"10px 20px",background:"white",borderBottom:"1px solid #E8E8F0",flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:11,fontWeight:700,color:"#5B4FCF"}}>Configurando seu plano</span>
          <span style={{fontSize:10,color:"#9898B8"}}>{prog}% concluído</span>
        </div>
        <div style={{height:4,background:"#E8E8F0",borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${prog}%`,background:"linear-gradient(90deg,#5B4FCF,#7C6FE0)",borderRadius:99,transition:"width 0.5s ease"}}/>
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"16px",display:"flex",flexDirection:"column",maxWidth:640,width:"100%",margin:"0 auto",boxSizing:"border-box"}}>
        {msgs.map((m,i)=>{
          if(m.role==="bot") return <ObBotMsg key={i}>{typeof m.content==="string"?rb(m.content):m.content}</ObBotMsg>;
          if(m.role==="user") return <ObUserMsg key={i} text={m.content}/>;
          if(m.role==="confirm") return (
            <ObConfirmCard key={i} label={m.content.label} value={m.content.value} onEdit={m.content.onEdit} onConfirm={m.content.onConfirm}/>
          );
          return null;
        })}
        {typing&&<ObDots/>}
        {showMaterias&&<ObRevisaoMaterias dados={{...dadosEdital,grupos}} onConfirm={confirmarMaterias}/>}
        {showDiscursiva&&<ObDiscursiva banca={dadosEdital?.banca} onConfirm={confirmarDiscursiva} onSkip={()=>{setDiscursiva(null);setPhase("horas");bot("Ok! Vamos definir sua rotina de estudos.",400);}}/>}
        {showHoras&&<ObHorasResumo dados={{orgao,cargo,dataProva,banca:dadosEdital?.banca,totalQuestoes:dadosEdital?.totalQuestoes,grupos,discursiva}} onConfirm={confirmarHoras}/>}
        {erro&&<div style={{background:"#FEE8E8",border:"1px solid #F25A5A",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#F25A5A",marginBottom:8}}>{erro}</div>}
        <div style={{height:8,flexShrink:0}}/>
      </div>

      {/* Input texto */}
      {showInput&&(
        <div style={{background:"white",borderTop:"1px solid #E8E8F0",padding:"10px 16px",flexShrink:0}}>
          <div style={{maxWidth:640,margin:"0 auto",display:"flex",gap:8}}>
            <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
              placeholder={phase==="orgao"?"Ex: BCB, INSS, Receita Federal...":phase==="cargo"?"Ex: Analista Administrativo, Auditor Fiscal...":"Ex: 15/08/2025"}
              style={{flex:1,padding:"11px 14px",border:"1.5px solid #E8E8F0",borderRadius:10,fontSize:13,color:"#1A1A2E",background:"#F7F7FC",outline:"none",fontFamily:"inherit"}}/>
            <button onClick={send} disabled={!input.trim()||typing}
              style={{padding:"11px 18px",background:input.trim()&&!typing?"#5B4FCF":"#E8E8F0",color:input.trim()&&!typing?"white":"#9898B8",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:input.trim()&&!typing?"pointer":"not-allowed"}}>→</button>
          </div>
          <p style={{textAlign:"center",fontSize:10,color:"#9898B8",marginTop:5,maxWidth:640,margin:"5px auto 0"}}>
            {phase==="orgao"?"Digite apenas o nome do órgão":phase==="cargo"?"Digite apenas o nome do cargo":"Data no formato dd/mm/aaaa"}
          </p>
        </div>
      )}

      {/* Upload PDF */}
      {showPDF&&(
        <div style={{background:"white",borderTop:"1px solid #E8E8F0",padding:"14px 16px",flexShrink:0}}>
          <div style={{maxWidth:640,margin:"0 auto"}}>
            <input ref={fileRef} type="file" accept=".pdf" style={{display:"none"}} onChange={e=>e.target.files[0]&&processarPDF(e.target.files[0])}/>
            <div onClick={()=>!pdfLoading&&fileRef.current?.click()}
              onDragOver={e=>e.preventDefault()}
              onDrop={e=>{e.preventDefault();processarPDF(e.dataTransfer.files[0]);}}
              style={{border:`2px dashed ${pdfLoading?"#E8E8F0":"#5B4FCF"}`,borderRadius:14,padding:"28px 20px",textAlign:"center",cursor:pdfLoading?"default":"pointer",background:"#F7F7FC",transition:"all 0.2s"}}>
              {pdfLoading?(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,border:"3px solid #EFEFFD",borderTop:"3px solid #5B4FCF",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                  <p style={{fontSize:13,color:"#5B4FCF",fontWeight:600}}>Lendo o edital completo...</p>
                  <p style={{fontSize:11,color:"#9898B8"}}>Isso pode levar alguns segundos</p>
                </div>
              ):(
                <div>
                  <div style={{fontSize:32,marginBottom:10}}>📎</div>
                  <p style={{fontSize:14,fontWeight:700,color:"#1A1A2E",marginBottom:6}}>Toque para anexar o PDF do edital</p>
                  <p style={{fontSize:12,color:"#9898B8"}}>ou arraste o arquivo aqui</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
