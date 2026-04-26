import { useState, useEffect, useRef } from "react";

const C = {
  primary:"#6C3CE1",primaryLight:"#8B5CF6",primaryXLight:"#EDE9FE",primaryDark:"#4C1D95",
  accent:"#10B981",accentLight:"#D1FAE5",warning:"#F59E0B",warningLight:"#FEF3C7",
  danger:"#EF4444",dangerLight:"#FEE2E2",pink:"#EC4899",
  bg:"#F8F7FF",white:"#FFFFFF",text:"#1E1B4B",textMed:"#4C4780",textLight:"#9CA3AF",
  border:"#E5E7EB",borderPurple:"#DDD6FE",
  shadow:"0 2px 16px rgba(108,60,225,0.07)",
  shadowMd:"0 4px 24px rgba(108,60,225,0.12)",
  shadowLg:"0 12px 48px rgba(108,60,225,0.18)",
};

const css=`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes popIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes typing{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{background:#F8F7FF;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#DDD6FE;border-radius:4px;}
  textarea,input,select,button{font-family:'Sora',sans-serif;}
  .chip:hover{background:#EDE9FE!important;border-color:#8B5CF6!important;color:#4C1D95!important;transform:translateY(-1px);}
  .chip{transition:all 0.15s ease;}
  .chip-sel{background:#EDE9FE!important;border-color:#6C3CE1!important;color:#4C1D95!important;}
  .card-h:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(108,60,225,0.12)!important;}
  .card-h{transition:all 0.2s ease;}
  .tab-b:hover{color:#6C3CE1!important;background:#F5F3FF!important;}
  .tab-b{transition:all 0.15s ease;}
  .opt-btn:hover:not(:disabled){border-color:#8B5CF6!important;background:#F5F3FF!important;}
  .opt-btn{transition:all 0.15s ease;}
  .toggle:hover{opacity:0.8;}
  .toggle{transition:all 0.2s ease;cursor:pointer;}
  input[type=range]{-webkit-appearance:none;height:4px;background:#DDD6FE;border-radius:4px;outline:none;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#6C3CE1;border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(108,60,225,0.4);}
`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const api = async (messages, system) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:1000,
      system: system||"Você é um especialista em concursos públicos brasileiros. Responda sempre em português do Brasil.",
      messages,
    }),
  });
  const d = await r.json();
  return d.content?.[0]?.text||"";
};

const safeJSON = t => { try{ return JSON.parse(t.replace(/```json|```/g,"").trim()); }catch{ return null; } };
const getDaysLeft = dateStr => { if(!dateStr)return null; const[d,m,y]=dateStr.split("/"); return Math.max(0,Math.ceil((new Date(`${y}-${m}-${d}`)-new Date())/86400000)); };

// ── Components ────────────────────────────────────────────────────────────────
const Logo = ({size=34}) => (
  <div style={{display:"flex",alignItems:"center",gap:10}}>
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <rect width="38" height="38" rx="11" fill="url(#sbg)"/>
      <defs><linearGradient id="sbg" x1="0" y1="0" x2="38" y2="38"><stop offset="0%" stopColor="#6C3CE1"/><stop offset="100%" stopColor="#A78BFA"/></linearGradient></defs>
      <rect x="9" y="11" width="9.5" height="16" rx="2" fill="white" fillOpacity="0.25"/>
      <rect x="18.5" y="11" width="10.5" height="16" rx="2" fill="white" fillOpacity="0.18"/>
      <rect x="18" y="11" width="2" height="16" fill="white" fillOpacity="0.5"/>
      <rect x="11" y="15" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.7"/>
      <rect x="11" y="18" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.7"/>
      <rect x="11" y="21" width="3.5" height="1.5" rx="0.75" fill="white" fillOpacity="0.7"/>
      <path d="M22 19.5L24.2 21.8L27.5 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div>
      <div style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:16,color:C.text,lineHeight:1}}>SimulaBanca</div>
      <div style={{fontSize:9,color:C.textLight,letterSpacing:1.5,textTransform:"uppercase",marginTop:1}}>Preparação Inteligente</div>
    </div>
  </div>
);

const Spinner = ({size=20,color=C.primary}) => (
  <div style={{width:size,height:size,border:`2px solid #EDE9FE`,borderTop:`2px solid ${color}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}}/>
);

const Badge = ({text,color,bg}) => (
  <span style={{background:bg,color,borderRadius:100,padding:"2px 10px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{text}</span>
);

const BotBubble = ({children,delay=0}) => (
  <div style={{display:"flex",gap:10,alignItems:"flex-start",animation:`typing 0.35s ease ${delay}s both`}}>
    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.primary},${C.primaryLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0}}>SB</div>
    <div style={{background:C.white,border:`1px solid ${C.borderPurple}`,borderRadius:"4px 18px 18px 18px",padding:"12px 16px",maxWidth:"85%",boxShadow:C.shadow,fontSize:14,lineHeight:1.75,color:C.text}}>
      {children}
    </div>
  </div>
);

const UserBubble = ({children}) => (
  <div style={{display:"flex",justifyContent:"flex-end",animation:"typing 0.25s ease"}}>
    <div style={{background:C.primary,borderRadius:"18px 4px 18px 18px",padding:"12px 16px",maxWidth:"75%",fontSize:14,lineHeight:1.75,color:"white"}}>{children}</div>
  </div>
);

const TypingDots = () => (
  <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.primary},${C.primaryLight})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"white",flexShrink:0}}>SB</div>
    <div style={{background:C.white,border:`1px solid ${C.borderPurple}`,borderRadius:"4px 18px 18px 18px",padding:"14px 18px",boxShadow:C.shadow,display:"flex",gap:5,alignItems:"center"}}>
      {[0,0.2,0.4].map((d,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.primary,animation:`pulse 1.2s ease ${d}s infinite`}}/>)}
    </div>
  </div>
);

const Chips = ({options,onSelect,selected=[]}) => (
  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
    {options.map(o=>(
      <button key={o} className={`chip${selected.includes(o)?" chip-sel":""}`} onClick={()=>onSelect(o)}
        style={{padding:"8px 16px",borderRadius:100,border:`1.5px solid ${C.borderPurple}`,background:C.white,color:C.textMed,fontSize:13,fontWeight:400,cursor:"pointer"}}>
        {o}
      </button>
    ))}
  </div>
);

const HoursSlider = ({value,onChange,onConfirm}) => (
  <div style={{background:C.primaryXLight,borderRadius:14,padding:"16px 20px",marginTop:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <span style={{fontSize:13,color:C.textMed,fontWeight:500}}>Horas diárias de estudo</span>
      <span style={{fontFamily:"'Lora',serif",fontSize:28,fontWeight:700,color:C.primary,lineHeight:1}}>{value}h</span>
    </div>
    <input type="range" min={2} max={8} value={value} onChange={e=>onChange(+e.target.value)} style={{width:"100%",marginBottom:10}}/>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textLight,marginBottom:14}}>
      <span>2h mínimo</span><span>8h máximo</span>
    </div>
    <button onClick={()=>onConfirm(value)}
      style={{width:"100%",padding:"11px",background:C.primary,color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>
      Confirmar {value}h por dia →
    </button>
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// EDITAL INPUT — Cola texto ou anexa PDF
// ══════════════════════════════════════════════════════════════════════════════
const EditalInput = ({editalText, setEditalText, onSubmit, loading}) => {
  const [mode, setMode] = useState("texto"); // "texto" | "pdf"
  const [pdfName, setPdfName] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const processPDF = async (file) => {
    if(!file || file.type !== "application/pdf") return;
    setPdfName(file.name);
    setPdfLoading(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(",")[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{
            role:"user",
            content:[
              {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},
              {type:"text",text:"Extraia e liste APENAS o conteúdo programático deste edital: todas as disciplinas, matérias e tópicos cobrados. Formato de texto simples, sem JSON. Se não for um edital, responda apenas: 'Documento não reconhecido como edital.'"}
            ]
          }]
        })
      });
      const d = await resp.json();
      const text = d.content?.[0]?.text || "";
      if(text.includes("não reconhecido")) {
        setPdfName(null);
        alert("Este arquivo não parece ser um edital de concurso. Tente outro arquivo ou cole o texto manualmente.");
      } else {
        setEditalText(text);
        setMode("texto");
      }
    } catch(e) {
      console.error(e);
      alert("Erro ao ler o PDF. Tente colar o texto manualmente.");
    }
    setPdfLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processPDF(file);
  };

  const canSend = editalText.trim().length > 20 && !loading && !pdfLoading;

  return (
    <div style={{background:C.white,borderTop:`1px solid ${C.border}`,padding:"16px",flexShrink:0}}>
      <div style={{maxWidth:680,margin:"0 auto"}}>

        {/* Mode toggle */}
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[{k:"texto",l:"✏️ Colar texto"},{k:"pdf",l:"📎 Anexar PDF"}].map(m=>(
            <button key={m.k} onClick={()=>setMode(m.k)}
              style={{padding:"6px 14px",border:`1.5px solid ${mode===m.k?C.primary:C.border}`,background:mode===m.k?C.primaryXLight:C.white,color:mode===m.k?C.primary:C.textMed,borderRadius:100,fontSize:12,fontWeight:mode===m.k?700:400,cursor:"pointer"}}>
              {m.l}
            </button>
          ))}
        </div>

        {/* Text mode */}
        {mode==="texto"&&(
          <>
            <textarea value={editalText} onChange={e=>setEditalText(e.target.value)}
              placeholder="Cole aqui o conteúdo programático do edital — matérias, disciplinas, tópicos cobrados na prova..."
              style={{width:"100%",minHeight:100,background:C.bg,border:`1.5px solid ${C.borderPurple}`,borderRadius:12,color:C.text,padding:"12px 16px",fontSize:13,lineHeight:1.6,resize:"none",outline:"none"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <span style={{fontSize:11,color:C.textLight}}>
                {editalText.length>0?`${editalText.length} caracteres — pronto para analisar`:"Quanto mais detalhe, mais preciso o seu cronograma"}
              </span>
              <button onClick={onSubmit} disabled={!canSend}
                style={{padding:"10px 22px",background:canSend?C.primary:"#E5E7EB",color:canSend?"white":C.textLight,border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:canSend?"pointer":"not-allowed",display:"flex",alignItems:"center",gap:8}}>
                {loading&&<div style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>}
                {loading?"Analisando...":"Enviar edital →"}
              </button>
            </div>
          </>
        )}

        {/* PDF mode */}
        {mode==="pdf"&&(
          <div>
            <div
              onDragOver={e=>{e.preventDefault();setDragOver(true);}}
              onDragLeave={()=>setDragOver(false)}
              onDrop={handleDrop}
              onClick={()=>!pdfLoading&&fileRef.current?.click()}
              style={{border:`2px dashed ${dragOver?C.primary:pdfLoading?"#DDD6FE":C.borderPurple}`,borderRadius:14,padding:"32px 20px",textAlign:"center",cursor:pdfLoading?"default":"pointer",background:dragOver?C.primaryXLight:C.bg,transition:"all 0.2s"}}>
              <input ref={fileRef} type="file" accept=".pdf" style={{display:"none"}}
                onChange={e=>processPDF(e.target.files[0])}/>
              {pdfLoading?(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <Spinner size={32} color={C.primary}/>
                  <p style={{fontSize:13,color:C.primary,fontWeight:600}}>Lendo o PDF com IA...</p>
                  <p style={{fontSize:11,color:C.textLight}}>{pdfName}</p>
                </div>
              ):pdfName?(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <div style={{fontSize:32}}>✅</div>
                  <p style={{fontSize:13,fontWeight:700,color:C.accent}}>PDF lido com sucesso!</p>
                  <p style={{fontSize:11,color:C.textLight}}>{pdfName}</p>
                  <p style={{fontSize:11,color:C.textMed}}>Conteúdo extraído — revise na aba "Colar texto" se quiser</p>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <div style={{fontSize:36}}>📎</div>
                  <p style={{fontSize:14,fontWeight:600,color:C.text}}>Arraste o PDF aqui ou clique para selecionar</p>
                  <p style={{fontSize:12,color:C.textLight}}>Edital completo ou só o conteúdo programático · PDF até 10MB</p>
                  <div style={{background:C.primaryXLight,borderRadius:8,padding:"6px 14px",fontSize:11,color:C.primary,fontWeight:600,marginTop:4}}>
                    A IA extrai as matérias automaticamente
                  </div>
                </div>
              )}
            </div>

            {/* Send after PDF processed */}
            {pdfName&&!pdfLoading&&editalText&&(
              <button onClick={()=>{setMode("texto");}} style={{marginTop:10,width:"100%",padding:"11px",background:C.primary,color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>
                Revisar e enviar →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING
// ══════════════════════════════════════════════════════════════════════════════
const Onboarding = ({onComplete}) => {
  const [msgs,setMsgs] = useState([]);
  const [typing,setTyping] = useState(false);
  const [step,setStep] = useState(0);
  const [editalText,setEditalText] = useState("");
  const [editalMode,setEditalMode] = useState(null); // "aberto" | "pre"
  const [parsed,setParsed] = useState(null);
  const [cargo,setCargo] = useState(null);
  const [hours,setHours] = useState(4);
  const [daysOff,setDaysOff] = useState([]);
  const [simDay,setSimDay] = useState("Sábado");
  const [building,setBuilding] = useState(false);
  const endRef = useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,typing]);

  useEffect(()=>{
    setTimeout(()=>{
      setMsgs([{role:"bot",content:(
        <div>
          <p>Olá! Sou o <strong>SimulaBanca</strong> — seu preparador inteligente para concursos públicos. 👋</p>
          <p style={{marginTop:8}}>Antes de começar, me diz: <strong>o edital do seu concurso já foi publicado?</strong></p>
          <Chips options={["Sim, o edital já saiu!","Ainda não saiu, mas quero me preparar"]} onSelect={v=>{
            setEditalMode(v.includes("Sim")?"aberto":"pre");
            addUser(v);
            setTimeout(()=>stepEditalMode(v.includes("Sim")?"aberto":"pre"),400);
          }}/>
        </div>
      )}]);
      setStep(1);
    },500);
  },[]);

  const addUser = text => setMsgs(m=>[...m,{role:"user",content:text}]);
  const addBot = (content,delay=800) => new Promise(res=>{
    setTyping(true);
    setTimeout(()=>{
      setTyping(false);
      setMsgs(m=>[...m,{role:"bot",content}]);
      res();
    },delay);
  });

  const stepEditalMode = async mode => {
    if(mode==="aberto"){
      await addBot(
        <div>
          <p>Perfeito! Com o edital em mãos podemos montar uma preparação <strong>cirúrgica</strong> — cronograma baseado exatamente no que vai cair na sua prova.</p>
          <p style={{marginTop:8}}>Cole abaixo o <strong>conteúdo programático</strong> do edital. Pode ser só as matérias e disciplinas.</p>
        </div>
      );
      setStep(2);
    } else {
      await addBot(
        <div>
          <p style={{background:"#FFF7ED",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:13,color:"#92400E"}}>
            ⚡ <strong>Modo pré-edital ativado.</strong> Vamos ser mais agressivos na preparação para você já estar adiantado quando o edital sair.
          </p>
          <p>Qual concurso você está mirando? Informe o <strong>cargo e o órgão</strong> que deseja.</p>
        </div>
      );
      setStep("pre_cargo");
    }
  };

  const handleEditalSubmit = async () => {
    if(!editalText.trim())return;
    addUser("Aqui está o conteúdo do edital.");
    setEditalText("");
    setTyping(true);

    const raw = await api([{role:"user",content:`Analise este edital e retorne APENAS JSON válido:
${editalText.slice(0,5000)}

{
  "cargos":["Cargo 1"],
  "orgao":"Nome do órgão",
  "banca":"Nome da banca ou null",
  "dataProva":"dd/mm/aaaa ou null",
  "periodo":"manhã ou tarde ou null",
  "etapas":["Prova Objetiva"],
  "temDiscursiva":false,
  "totalQuestoes":120,
  "materias":[{"nome":"Matéria","peso":20,"subtopicos":["sub1","sub2"]}]
}
Extraia TODAS as matérias com peso percentual estimado. Se não houver data, use null.`}]);

    setTyping(false);
    const data = safeJSON(raw)||{cargos:["Cargo Geral"],orgao:"Órgão",banca:null,dataProva:null,periodo:null,etapas:["Prova Objetiva"],temDiscursiva:false,totalQuestoes:100,materias:[{nome:"Língua Portuguesa",peso:25,subtopicos:["Interpretação","Gramática"]},{nome:"Raciocínio Lógico",peso:25,subtopicos:["Proposições","Sequências"]},{nome:"Conhecimentos Específicos",peso:50,subtopicos:["Conteúdo do cargo"]}]};
    setParsed(data);

    if(data.cargos.length===1){
      setCargo(data.cargos[0]);
      await addBot(
        <div>
          <p>Analisei o edital do <strong>{data.orgao}</strong>! ✅</p>
          <p style={{marginTop:8}}>Encontrei o cargo: <strong>{data.cargos[0]}</strong>. Confirma?</p>
          <Chips options={["Sim, é esse!"]} onSelect={async v=>{
            addUser(v);
            await confirmStep(data.cargos[0],data);
          }}/>
        </div>
      );
    } else {
      await addBot(
        <div>
          <p>Analisei o edital do <strong>{data.orgao}</strong>! Encontrei {data.cargos.length} cargos.</p>
          <p style={{marginTop:8}}>Para qual você está se preparando?</p>
          <Chips options={data.cargos} onSelect={async v=>{
            setCargo(v); addUser(v);
            await confirmStep(v,data);
          }}/>
        </div>
      );
    }
  };

  const confirmStep = async (cargoSel,data) => {
    const dataStr = data.dataProva||"data não identificada";
    const daysLeft = getDaysLeft(data.dataProva);
    const urgente = daysLeft!==null && daysLeft<=30;
    await addBot(
      <div>
        {urgente&&<div style={{background:C.dangerLight,border:`1px solid ${C.danger}30`,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,color:C.danger,fontWeight:600}}>⚡ Atenção: restam apenas {daysLeft} dias para a prova! Modo intensivo ativado.</div>}
        <p>Confirmei os dados da sua prova:</p>
        <div style={{background:C.primaryXLight,borderRadius:12,padding:"12px 16px",margin:"10px 0",display:"flex",flexDirection:"column",gap:6,fontSize:13}}>
          <div>📅 <strong>Data:</strong> {dataStr}{data.periodo?`, período da ${data.periodo}`:""}</div>
          <div>📝 <strong>Etapas:</strong> {data.etapas.join(" + ")}</div>
          <div>🏛️ <strong>Cargo:</strong> {cargoSel}</div>
          <div>📋 <strong>Matérias:</strong> {data.materias.length} disciplinas identificadas</div>
          {data.temDiscursiva&&<div>✍️ <strong>Prova discursiva:</strong> Sim — incluída no cronograma</div>}
        </div>
        <p>Está correto?</p>
        <Chips options={["Sim, está certo!","Preciso corrigir algo"]} onSelect={async v=>{
          addUser(v);
          await materiasStep(data);
        }}/>
      </div>
    );
  };

  const materiasStep = async data => {
    await addBot(
      <div>
        <p>Essas são as matérias que identifiquei:</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,margin:"10px 0"}}>
          {data.materias.map(m=>(
            <span key={m.nome} style={{background:C.primaryXLight,color:C.primaryDark,padding:"4px 12px",borderRadius:100,fontSize:12,fontWeight:500}}>{m.nome}</span>
          ))}
        </div>
        <Chips options={["Perfeito, pode continuar!","Falta alguma matéria"]} onSelect={async v=>{
          addUser(v);
          await hoursStep();
        }}/>
      </div>
    );
  };

  const hoursStep = async () => {
    await addBot(
      <div>
        <p>Quantas <strong>horas por dia</strong> você consegue estudar?</p>
        <HoursSlider value={hours} onChange={setHours} onConfirm={async h=>{
          setHours(h); addUser(`${h} horas por dia`);
          await daysOffStep();
        }}/>
      </div>
    );
  };

  const daysOffStep = async () => {
    await addBot(
      <div>
        <p>Quais dias da semana você <strong>não</strong> pode estudar? (opcional)</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
          {["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"].map(d=>(
            <button key={d} onClick={()=>setDaysOff(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d])}
              style={{padding:"7px 14px",borderRadius:100,border:`1.5px solid ${daysOff.includes(d)?C.danger:C.borderPurple}`,background:daysOff.includes(d)?C.dangerLight:C.white,color:daysOff.includes(d)?C.danger:C.textMed,fontSize:12,fontWeight:daysOff.includes(d)?700:400,cursor:"pointer"}}>
              {daysOff.includes(d)?"✕ ":""}{d}
            </button>
          ))}
        </div>
        <button onClick={async()=>{
          addUser(daysOff.length>0?`Folga: ${daysOff.join(", ")}`:"Sem dias de folga fixos");
          await simDayStep();
        }} style={{marginTop:14,width:"100%",padding:"11px",background:C.primary,color:"white",border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>
          Confirmar →
        </button>
      </div>
    );
  };

  const simDayStep = async () => {
    await addBot(
      <div>
        <p>O simulado semanal é realizado <strong>todo sábado</strong> por padrão. Quer manter ou prefere outro dia?</p>
        <Chips options={["Sábado — ótimo!","Domingo","Sexta"]} onSelect={async v=>{
          const d=v.split(" ")[0]; setSimDay(d); addUser(v.includes("ótimo")?`Sábado`:`${v.split("—")[0].trim()}`);
          await buildPlan();
        }}/>
      </div>
    );
  };

  const buildPlan = async () => {
    setBuilding(true);
    setTyping(true);
    await new Promise(r=>setTimeout(r,2000));
    setTyping(false);
    await addBot(
      <div>
        <p>✅ <strong>Tudo pronto!</strong> Seu plano de estudos personalizado está criado.</p>
        <p style={{marginTop:8,color:C.textMed,fontSize:13}}>Cronograma adaptado ao seu edital, {hours}h diárias{daysOff.length>0?`, folgas: ${daysOff.join(", ")}`:""}, simulado às ${simDay}s.</p>
        <button onClick={()=>onComplete({parsed,cargo,hours,daysOff,simDay,editalMode})}
          style={{marginTop:14,padding:"12px 24px",background:C.primary,color:"white",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>
          Ver meu cronograma →
        </button>
      </div>
    ,400);
    setBuilding(false);
  };

  // Pre-edital flow
  const [preOrgao,setPreOrgao] = useState("");
  const handlePreCargo = async () => {
    if(!preOrgao.trim())return;
    addUser(preOrgao);
    setPreOrgao("");
    await addBot(
      <div>
        <p>Entendido! Vou montar seu cronograma com base no <strong>histórico das últimas edições</strong>.</p>
        <div style={{background:"#FFF7ED",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 14px",margin:"10px 0",fontSize:13,color:"#92400E"}}>
          📢 Quando o edital for publicado, me informe para recalibrar o plano. Algumas matérias podem mudar.
        </div>
        <p>Quantas <strong>horas por dia</strong> você tem disponível?</p>
        <HoursSlider value={hours} onChange={setHours} onConfirm={async h=>{
          setHours(h); addUser(`${h} horas por dia`);
          const mockParsed={cargos:[preOrgao],orgao:preOrgao,banca:"A definir",dataProva:null,etapas:["Prova Objetiva"],temDiscursiva:false,totalQuestoes:100,materias:[{nome:"Língua Portuguesa",peso:20,subtopicos:["Interpretação","Gramática"]},{nome:"Raciocínio Lógico",peso:20,subtopicos:["Proposições","Silogismos"]},{nome:"Direito Constitucional",peso:20,subtopicos:["Direitos Fundamentais"]},{nome:"Direito Administrativo",peso:20,subtopicos:["Atos Administrativos"]},{nome:"Informática",peso:10,subtopicos:["Office","Internet"]},{nome:"Atualidades",peso:10,subtopicos:["Política","Economia"]}]};
          setParsed(mockParsed); setCargo(preOrgao);
          await daysOffStep();
        }}/>
      </div>
    );
    setStep("pre_hours");
  };

  return(
    <div style={{fontFamily:"'Sora',sans-serif",background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 24px",height:60,display:"flex",alignItems:"center",boxShadow:"0 1px 6px rgba(0,0,0,0.04)",flexShrink:0}}>
        <Logo/>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:C.accent,animation:"pulse 2s infinite"}}/>
          <span style={{fontSize:12,color:C.accent,fontWeight:600}}>Online agora</span>
        </div>
      </nav>

      <div style={{flex:1,overflowY:"auto",padding:"24px 16px",display:"flex",flexDirection:"column",gap:14,maxWidth:680,width:"100%",margin:"0 auto"}}>
        {msgs.map((m,i)=>m.role==="bot"?<BotBubble key={i}>{m.content}</BotBubble>:<UserBubble key={i}>{m.content}</UserBubble>)}
        {typing&&<TypingDots/>}
        <div ref={endRef}/>
      </div>

      {/* Input areas */}
      {step===2&&(
        <EditalInput
          editalText={editalText}
          setEditalText={setEditalText}
          onSubmit={handleEditalSubmit}
          loading={typing}
        />
      )}

      {step==="pre_cargo"&&(
        <div style={{background:C.white,borderTop:`1px solid ${C.border}`,padding:"16px",flexShrink:0}}>
          <div style={{maxWidth:680,margin:"0 auto",display:"flex",gap:10}}>
            <input value={preOrgao} onChange={e=>setPreOrgao(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handlePreCargo()}
              placeholder="Ex: Analista Administrativo INSS, Agente de Polícia PF..."
              style={{flex:1,background:C.bg,border:`1.5px solid ${C.borderPurple}`,borderRadius:10,padding:"12px 16px",fontSize:14,color:C.text,outline:"none"}}/>
            <button onClick={handlePreCargo} disabled={!preOrgao.trim()}
              style={{padding:"12px 20px",background:preOrgao.trim()?C.primary:"#E5E7EB",color:preOrgao.trim()?"white":C.textLight,border:"none",borderRadius:10,fontSize:13,fontWeight:700,cursor:preOrgao.trim()?"pointer":"not-allowed"}}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ADJUST MODAL
// ══════════════════════════════════════════════════════════════════════════════
const AdjustModal = ({plan,onSave,onClose}) => {
  const [hours,setHours] = useState(plan.hours);
  const [daysOff,setDaysOff] = useState(plan.daysOff||[]);
  const [simDay,setSimDay] = useState(plan.simDay||"Sábado");
  const [paused,setPaused] = useState(false);
  const [pauseDays,setPauseDays] = useState(7);
  const [topicWeights,setTopicWeights] = useState(
    (plan.parsed?.materias||[]).reduce((a,m)=>({...a,[m.nome]:m.peso}),$={})
  );

  const DAYS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
  const SIM_DAYS = ["Sábado","Domingo","Sexta","Quarta"];

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(30,27,75,0.6)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,backdropFilter:"blur(4px)"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.white,borderRadius:24,width:"100%",maxWidth:560,maxHeight:"90vh",overflow:"auto",boxShadow:C.shadowLg,animation:"popIn 0.3s ease"}}>

        {/* Header */}
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:C.white,zIndex:1}}>
          <div>
            <h2 style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,color:C.text}}>Ajustar cronograma</h2>
            <p style={{fontSize:12,color:C.textMed,marginTop:2}}>As mudanças são aplicadas a partir de hoje.</p>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:"50%",border:`1px solid ${C.border}`,background:C.bg,color:C.textMed,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:24}}>

          {/* Horas por dia */}
          <div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>⏰ Horas de estudo por dia</div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <input type="range" min={2} max={8} value={hours} onChange={e=>setHours(+e.target.value)} style={{flex:1}}/>
              <div style={{fontFamily:"'Lora',serif",fontSize:24,fontWeight:700,color:C.primary,minWidth:40,textAlign:"right"}}>{hours}h</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textLight,marginTop:4}}>
              <span>2h mín.</span><span>8h máx.</span>
            </div>
          </div>

          {/* Dias livres */}
          <div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:10}}>📅 Dias sem estudar</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {DAYS.map(d=>(
                <button key={d} onClick={()=>setDaysOff(p=>p.includes(d)?p.filter(x=>x!==d):[...p,d])}
                  style={{padding:"7px 14px",borderRadius:100,border:`1.5px solid ${daysOff.includes(d)?C.danger:C.border}`,background:daysOff.includes(d)?C.dangerLight:C.bg,color:daysOff.includes(d)?C.danger:C.textMed,fontSize:12,fontWeight:daysOff.includes(d)?700:400,cursor:"pointer"}}>
                  {daysOff.includes(d)?"✕ ":""}{d}
                </button>
              ))}
            </div>
          </div>

          {/* Dia do simulado */}
          <div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:10}}>🎯 Dia do simulado semanal</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {SIM_DAYS.map(d=>(
                <button key={d} onClick={()=>setSimDay(d)}
                  style={{padding:"8px 16px",borderRadius:100,border:`1.5px solid ${simDay===d?C.primary:C.border}`,background:simDay===d?C.primaryXLight:C.bg,color:simDay===d?C.primary:C.textMed,fontSize:12,fontWeight:simDay===d?700:400,cursor:"pointer"}}>
                  {simDay===d?"✓ ":""}{d}
                </button>
              ))}
            </div>
          </div>

          {/* Peso das matérias */}
          <div>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:4}}>📚 Foco por matéria</div>
            <p style={{fontSize:11,color:C.textMed,marginBottom:12}}>Aumente o foco nas matérias que precisam de mais atenção.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {(plan.parsed?.materias||[]).map(m=>(
                <div key={m.nome} style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1,fontSize:12,fontWeight:500,color:C.text}}>{m.nome}</div>
                  <input type="range" min={5} max={50} value={topicWeights[m.nome]||m.peso}
                    onChange={e=>setTopicWeights(p=>({...p,[m.nome]:+e.target.value}))}
                    style={{width:120}}/>
                  <div style={{minWidth:36,textAlign:"right",fontSize:12,fontWeight:700,color:C.primary}}>{topicWeights[m.nome]||m.peso}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pausar */}
          <div style={{background:"#FFF7ED",border:`1px solid #FDE68A`,borderRadius:14,padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:paused?12:0}}>
              <div>
                <div style={{fontWeight:700,fontSize:13,color:"#92400E"}}>⏸️ Pausar cronograma temporariamente</div>
                <div style={{fontSize:11,color:"#78350F",marginTop:2}}>Viagem, compromisso ou imprevisto? O plano se reorganiza sozinho.</div>
              </div>
              <div className="toggle" onClick={()=>setPaused(!paused)}
                style={{width:44,height:24,borderRadius:99,background:paused?C.warning:"#E5E7EB",position:"relative",transition:"background 0.2s"}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"white",position:"absolute",top:2,left:paused?22:2,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
              </div>
            </div>
            {paused&&(
              <div style={{animation:"slideDown 0.2s ease"}}>
                <div style={{fontSize:12,color:"#92400E",marginBottom:8}}>Por quantos dias?</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {[3,7,14,30].map(d=>(
                    <button key={d} onClick={()=>setPauseDays(d)}
                      style={{padding:"6px 14px",borderRadius:100,border:`1.5px solid ${pauseDays===d?"#F59E0B":"#FDE68A"}`,background:pauseDays===d?"#FEF3C7":"white",color:pauseDays===d?C.warning:"#92400E",fontSize:12,fontWeight:pauseDays===d?700:400,cursor:"pointer"}}>
                      {d} dias
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{padding:"16px 24px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,position:"sticky",bottom:0,background:C.white}}>
          <button onClick={onClose}
            style={{flex:1,padding:"12px",background:C.bg,color:C.textMed,border:`1.5px solid ${C.border}`,borderRadius:12,fontSize:13,fontWeight:600,cursor:"pointer"}}>
            Cancelar
          </button>
          <button onClick={()=>onSave({hours,daysOff,simDay,topicWeights,paused,pauseDays})}
            style={{flex:2,padding:"12px",background:C.primary,color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>
            Salvar ajustes →
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
const Dashboard = ({plan,onReset}) => {
  const [tab,setTab] = useState("semana");
  const [showAdjust,setShowAdjust] = useState(false);
  const [settings,setSettings] = useState({hours:plan.hours,daysOff:plan.daysOff||[],simDay:plan.simDay||"Sábado"});
  const [completed,setCompleted] = useState({0:true,1:true});
  const [erros,setErros] = useState([
    {id:1,topicName:"Dir. Administrativo",topicColor:"#EF4444",topicEmoji:"⚖️",subtopic:"Licitações",questao:"Dispensa de licitação é possível para compras de qualquer valor.",gabarito:"Errado",suaResposta:"Certo",explicacao:"A dispensa só é permitida para valores abaixo dos limites legais previstos na Lei 14.133/2021.",erros:2,acertos:0,data:"Hoje"},
    {id:2,topicName:"Raciocínio Lógico",topicColor:"#F59E0B",topicEmoji:"🧠",subtopic:"Proposições",questao:"Se P→Q e P é verdadeiro, então Q é necessariamente verdadeiro.",gabarito:"Certo",suaResposta:"Errado",explicacao:"Modus ponens: P→Q verdadeiro com P verdadeiro implica Q verdadeiro.",erros:1,acertos:1,data:"Ontem"},
    {id:3,topicName:"Seguridade Social",topicColor:"#06B6D4",topicEmoji:"🏥",subtopic:"Previdência",questao:"A aposentadoria por invalidez pode ser convertida em aposentadoria por idade.",gabarito:"Errado",suaResposta:"Certo",explicacao:"A aposentadoria por invalidez tem caráter permanente e não pode ser convertida.",erros:3,acertos:0,data:"2 dias"},
  ]);
  const [revisoes,setRevisoes] = useState([
    {id:1,topicName:"Dir. Administrativo",topicColor:"#EF4444",topicEmoji:"⚖️",conteudo:"Princípios da Administração Pública — LIMPE",intervalo:3,proximaRevisao:"Hoje",acertosConsec:0,status:"urgente"},
    {id:2,topicName:"Língua Portuguesa",topicColor:"#6C3CE1",topicEmoji:"📖",conteudo:"Concordância Verbal — casos especiais",intervalo:7,proximaRevisao:"Amanhã",acertosConsec:2,status:"hoje"},
    {id:3,topicName:"Raciocínio Lógico",topicColor:"#F59E0B",topicEmoji:"🧠",conteudo:"Tabela Verdade — conectivos lógicos",intervalo:14,proximaRevisao:"Em 5 dias",acertosConsec:3,status:"em breve"},
  ]);
  const [expandErro,setExpandErro] = useState(null);
  const [erroFilter,setErroFilter] = useState("all");

  const materias = plan.parsed?.materias||[];
  const daysLeft = getDaysLeft(plan.parsed?.dataProva);
  const urgency = !daysLeft?C.textLight:daysLeft<=14?C.danger:daysLeft<=30?C.warning:C.accent;
  const isPreEdital = plan.editalMode==="pre";
  const todayIdx = new Date().getDay()===0?6:new Date().getDay()-1;
  const DAYS_NAMES = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
  const doneDays = Object.values(completed).filter(Boolean).length;
  const weekPct = Math.round((doneDays/5)*100);
  const errosUrgentes = erros.filter(e=>e.erros>=2).length;
  const revisoesHoje = revisoes.filter(r=>r.status==="urgente"||r.status==="hoje").length;

  const SCHEDULE = DAYS_NAMES.map((d,i)=>{
    if(settings.daysOff.includes(d)) return {day:d.slice(0,3),type:"folga",hours:0,questoes:0,topics:[]};
    if(d===settings.simDay) return {day:d.slice(0,3),type:"simulado",hours:4,questoes:120,topics:[]};
    const mats = materias.filter((_,mi)=>mi%5===i%5).slice(0,2);
    return {day:d.slice(0,3),type:"estudo",hours:settings.hours,questoes:settings.hours*10,topics:mats.map(m=>m.nome)};
  });

  const TABS=[
    {key:"semana",label:"📅 Semana"},
    {key:"evolucao",label:"📈 Evolução"},
    {key:"erros",label:`❌ Erros${erros.length>0?` (${erros.length})`:""}`,alert:errosUrgentes>0},
    {key:"revisao",label:`🔁 Revisão${revisoesHoje>0?` (${revisoesHoje})`:""}`,alert:revisoesHoje>0},
  ];

  return(
    <div style={{fontFamily:"'Sora',sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>

      {showAdjust&&<AdjustModal plan={{...plan,...settings}} onSave={s=>{setSettings(prev=>({...prev,...s}));setShowAdjust(false);}} onClose={()=>setShowAdjust(false)}/>}

      <nav style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 20px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
        <Logo size={30}/>
        <div style={{display:"flex",gap:4}}>
          {TABS.map(t=>(
            <button key={t.key} className="tab-b" onClick={()=>setTab(t.key)}
              style={{padding:"7px 12px",border:`1.5px solid ${tab===t.key?C.primary:C.border}`,background:tab===t.key?C.primaryXLight:C.white,color:tab===t.key?C.primary:C.textMed,borderRadius:100,fontSize:11,fontWeight:tab===t.key?700:400,cursor:"pointer",position:"relative"}}>
              {t.label}
              {t.alert&&tab!==t.key&&<span style={{position:"absolute",top:3,right:3,width:6,height:6,borderRadius:"50%",background:C.danger}}/>}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {isPreEdital&&(
            <div style={{background:"#FFF7ED",border:"1px solid #FDE68A",borderRadius:8,padding:"4px 10px",fontSize:10,fontWeight:700,color:C.warning}}>
              ⚡ Pré-edital
            </div>
          )}
          {daysLeft!==null&&(
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,fontWeight:700,color:urgency}}>{daysLeft} dias para a prova</div>
              <div style={{fontSize:9,color:C.textLight}}>{plan.parsed?.dataProva}</div>
            </div>
          )}
          <button onClick={()=>setShowAdjust(true)}
            style={{padding:"7px 14px",background:C.primaryXLight,color:C.primary,border:`1.5px solid ${C.borderPurple}`,borderRadius:10,fontSize:11,fontWeight:700,cursor:"pointer"}}>
            ⚙️ Ajustar
          </button>
        </div>
      </nav>

      <div style={{maxWidth:960,margin:"0 auto",padding:"20px 16px"}}>

        {/* Pre-edital banner */}
        {isPreEdital&&(
          <div style={{background:"linear-gradient(135deg,#FFF7ED,#FFFBEB)",border:"1.5px solid #FDE68A",borderRadius:14,padding:"14px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:20,flexShrink:0}}>📢</span>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:"#92400E",marginBottom:3}}>Você está no modo pré-edital</div>
              <p style={{fontSize:12,color:"#78350F",lineHeight:1.7,margin:0}}>
                Seu cronograma foi montado com base no histórico de edições anteriores. Quando o edital for publicado, cole aqui para recalibrar o plano com as matérias exatas.
              </p>
            </div>
            <button style={{padding:"7px 14px",background:C.warning,color:"white",border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>
              Tenho o edital →
            </button>
          </div>
        )}

        {/* ── SEMANA ── */}
        {tab==="semana"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>

            {/* Hero hoje */}
            <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:20,padding:"18px 22px",marginBottom:16,boxShadow:C.shadowMd}}>
              <div style={{fontSize:10,fontWeight:700,color:C.primary,letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>
                {DAYS_NAMES[new Date().getDay()===0?6:new Date().getDay()-1]} — Hoje
              </div>
              {SCHEDULE[todayIdx]?.type==="simulado"?(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
                  <div>
                    <h2 style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,color:C.text,marginBottom:4}}>⏱️ Simulado semanal</h2>
                    <p style={{fontSize:13,color:C.textMed}}>120 questões · 4h cronometradas · Todas as matérias</p>
                  </div>
                  <button style={{padding:"11px 22px",background:C.primary,color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>Iniciar →</button>
                </div>
              ):SCHEDULE[todayIdx]?.type==="folga"?(
                <div>
                  <h2 style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,color:C.text,marginBottom:4}}>😴 Dia de folga</h2>
                  <p style={{fontSize:13,color:C.textMed}}>Descanse bem. Você voltará mais forte amanhã.</p>
                </div>
              ):(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                  <div>
                    <h2 style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:700,color:C.text,marginBottom:8}}>
                      {SCHEDULE[todayIdx]?.topics.join(" + ")||"Estudos do dia"}
                    </h2>
                    <div style={{display:"flex",gap:12,fontSize:12,color:C.textMed}}>
                      <span>⏱️ {SCHEDULE[todayIdx]?.hours}h</span>
                      <span>🎯 {SCHEDULE[todayIdx]?.questoes} questões</span>
                      <span>📚 {SCHEDULE[todayIdx]?.topics.length} matérias</span>
                    </div>
                  </div>
                  <button style={{padding:"11px 22px",background:C.primary,color:"white",border:"none",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:C.shadowMd}}>Estudar agora →</button>
                </div>
              )}
            </div>

            {/* Alertas */}
            {(errosUrgentes>0||revisoesHoje>0)&&(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                {errosUrgentes>0&&(
                  <button onClick={()=>setTab("erros")} style={{background:C.dangerLight,border:`1px solid ${C.danger}30`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:18}}>❌</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:12,color:C.danger}}>{errosUrgentes} erro(s) urgente(s)</div>
                      <div style={{fontSize:10,color:"#991B1B"}}>Erradas 2x — atenção hoje</div>
                    </div>
                    <span style={{color:C.danger}}>→</span>
                  </button>
                )}
                {revisoesHoje>0&&(
                  <button onClick={()=>setTab("revisao")} style={{background:C.warningLight,border:`1px solid ${C.warning}30`,borderRadius:12,padding:"10px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer",textAlign:"left"}}>
                    <span style={{fontSize:18}}>🔁</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:12,color:"#92400E"}}>{revisoesHoje} revisão(ões) hoje</div>
                      <div style={{fontSize:10,color:"#92400E"}}>Não deixe para amanhã</div>
                    </div>
                    <span style={{color:C.warning}}>→</span>
                  </button>
                )}
              </div>
            )}

            {/* Grade semanal */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8,marginBottom:16}}>
              {SCHEDULE.map((day,i)=>{
                const isToday=i===todayIdx;
                const done=completed[i];
                const isFolga=day.type==="folga";
                return(
                  <div key={i} onClick={()=>!isFolga&&setCompleted(c=>({...c,[i]:!c[i]}))}
                    style={{background:done?C.accentLight:isToday?C.primaryXLight:C.white,border:`1.5px solid ${done?C.accent:isToday?C.primary:C.border}`,borderRadius:14,padding:"10px 6px",textAlign:"center",cursor:isFolga?"default":"pointer",boxShadow:C.shadow,transition:"all 0.15s"}}>
                    <div style={{fontSize:10,fontWeight:700,color:done?C.accent:isToday?C.primary:C.textLight,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{day.day}</div>
                    <div style={{fontSize:18,marginBottom:3}}>
                      {day.type==="simulado"?"⏱️":day.type==="folga"?"😴":day.type==="revisao"?"🔁":done?"✅":"📚"}
                    </div>
                    <div style={{fontSize:9,fontWeight:600,color:done?C.accent:isToday?C.primary:C.textLight}}>
                      {done?"Feito":day.type==="simulado"?"Simulado":day.type==="folga"?"Folga":`${day.hours}h`}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:16}}>
              {[
                {icon:"✅",label:"Semana",value:`${weekPct}%`,sub:`${doneDays}/5 dias`,color:weekPct>=80?C.accent:weekPct>=50?C.warning:C.primary},
                {icon:"🎯",label:"Questões",value:"183",sub:"meta: 200",color:C.primary},
                {icon:"🔥",label:"Sequência",value:"12d",sub:"sem parar",color:C.warning},
                {icon:"📊",label:"Acerto geral",value:"67%",sub:"ponderado",color:C.accent},
              ].map(s=>(
                <div key={s.label} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"12px",textAlign:"center",boxShadow:C.shadow}}>
                  <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:700,color:s.color,lineHeight:1}}>{s.value}</div>
                  <div style={{fontSize:9,color:C.textLight,marginTop:3,textTransform:"uppercase",letterSpacing:0.5}}>{s.label}</div>
                  <div style={{fontSize:9,color:C.textLight,marginTop:2}}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Jornada de ciclos */}
            <div style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:18,padding:"18px 20px",boxShadow:C.shadow}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontWeight:800,fontSize:13,color:C.text}}>Jornada de ciclos</div>
                  <div style={{fontSize:11,color:C.textMed,marginTop:2}}>Ciclo 2 de 6 · {materias.length} matérias por ciclo</div>
                </div>
                <Badge text="33% concluído" color={C.primary} bg={C.primaryXLight}/>
              </div>
              <div style={{position:"relative"}}>
                <div style={{position:"absolute",top:18,left:20,right:20,height:3,background:"#EDE9FE",borderRadius:99}}/>
                <div style={{position:"absolute",top:18,left:20,height:3,width:"20%",background:`linear-gradient(90deg,${C.accent},${C.primary})`,borderRadius:99}}/>
                <div style={{display:"flex",justifyContent:"space-between",position:"relative",zIndex:2}}>
                  {["🔍","📝","❌","⏱️","🔁","🏁"].map((icon,i)=>{
                    const isDone=i<1,isCurr=i===1;
                    const labels=["Base","Questões","Erros","Simulados","Revisão","Final"];
                    return(
                      <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
                        <div style={{width:36,height:36,borderRadius:"50%",background:isDone?C.accent:isCurr?C.primary:C.white,border:`2.5px solid ${isDone?C.accent:isCurr?C.primary:"#DDD6FE"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:isDone||isCurr?"white":C.textLight,boxShadow:isCurr?`0 0 0 4px ${C.primaryXLight}`:"none"}}>
                          {isDone?"✓":icon}
                        </div>
                        <div style={{textAlign:"center"}}>
                          <div style={{fontSize:9,fontWeight:isCurr?700:400,color:isDone?C.accent:isCurr?C.primary:C.textLight}}>{labels[i]}</div>
                          {isCurr&&<div style={{fontSize:8,color:C.warning,background:"#FEF3C7",borderRadius:3,padding:"1px 4px",fontWeight:700}}>← aqui</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── EVOLUÇÃO ── */}
        {tab==="evolucao"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{marginBottom:18}}>
              <h2 style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:4}}>Evolução semanal</h2>
              <p style={{fontSize:13,color:C.textMed}}>Progresso por matéria, cobertura do edital e comparativo com outros candidatos.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:18}}>
              {[{icon:"🎯",l:"Questões feitas",v:"847",c:C.primary},{icon:"📈",l:"Evolução no mês",v:"+18%",c:C.accent},{icon:"🔥",l:"Sequência",v:"12 dias",c:C.warning}].map(s=>(
                <div key={s.l} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"16px",textAlign:"center",boxShadow:C.shadow}}>
                  <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
                  <div style={{fontFamily:"'Lora',serif",fontSize:24,fontWeight:700,color:s.c}}>{s.v}</div>
                  <div style={{fontSize:10,color:C.textLight,marginTop:4,textTransform:"uppercase",letterSpacing:0.5}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {materias.map((m,i)=>{
                const acc=[74,60,48,71,91,54,68][i]||60;
                const meta=70;
                const onTrack=acc>=meta;
                const colors=["#6C3CE1","#F59E0B","#EF4444","#8B5CF6","#10B981","#06B6D4","#EC4899"];
                const color=colors[i%colors.length];
                return(
                  <div key={m.nome} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"14px 18px",boxShadow:C.shadow,animation:`fadeUp 0.3s ease ${i*0.04}s both`}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{width:40,height:40,borderRadius:11,background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📚</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                          <span style={{fontWeight:700,fontSize:13,color:C.text}}>{m.nome}</span>
                          <Badge text={`${m.peso}% do edital`} color={C.textMed} bg="#F3F4F6"/>
                          {onTrack?<Badge text="✓ Meta" color={C.accent} bg={C.accentLight}/>:<Badge text={`${meta-acc}pts p/ meta`} color={C.danger} bg={C.dangerLight}/>}
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{flex:1,height:7,background:"#EDE9FE",borderRadius:99,overflow:"hidden",position:"relative"}}>
                            <div style={{position:"absolute",top:0,left:`${meta}%`,width:2,height:"100%",background:"rgba(0,0,0,0.15)"}}/>
                            <div style={{height:"100%",width:`${acc}%`,background:color,borderRadius:99}}/>
                          </div>
                          <span style={{fontSize:12,fontWeight:700,color:onTrack?C.accent:acc>=50?C.warning:C.danger,minWidth:32}}>{acc}%</span>
                        </div>
                        <div style={{fontSize:10,color:C.textLight,marginTop:3}}>Meta: {meta}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ERROS ── */}
        {tab==="erros"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:10}}>
              <div>
                <h2 style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:4}}>Caderno de Erros</h2>
                <p style={{fontSize:13,color:C.textMed}}>{erros.length} questão(ões) · Você decide quando retirar cada uma.</p>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {["all",...new Set(erros.map(e=>e.topicName))].map(f=>(
                  <button key={f} onClick={()=>setErroFilter(f)}
                    style={{padding:"5px 12px",border:`1.5px solid ${erroFilter===f?C.primary:C.border}`,background:erroFilter===f?C.primaryXLight:C.white,color:erroFilter===f?C.primary:C.textMed,borderRadius:100,fontSize:11,cursor:"pointer",fontWeight:erroFilter===f?700:400}}>
                    {f==="all"?"Todas":f.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{background:C.primaryXLight,border:`1px solid ${C.borderPurple}`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:11,color:C.textMed}}>
              💡 A IA sugere retirar quando você acerta 3 vezes — mas <strong>a decisão é sempre sua</strong>.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {erros.filter(e=>erroFilter==="all"||e.topicName===erroFilter).map((e,i)=>{
                const isExp=expandErro===e.id;
                return(
                  <div key={e.id} style={{background:C.white,border:`1.5px solid ${e.erros>=2?C.danger+"40":C.border}`,borderRadius:14,padding:"14px 16px",boxShadow:C.shadow,animation:`fadeUp 0.3s ease ${i*0.05}s both`}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                      <span style={{fontSize:18,flexShrink:0}}>{e.topicEmoji}</span>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5,flexWrap:"wrap"}}>
                          <span style={{fontWeight:700,fontSize:12,color:e.topicColor}}>{e.topicName}</span>
                          <span style={{fontSize:11,color:C.textLight}}>· {e.subtopic}</span>
                          {e.erros>=2&&<Badge text={`${e.erros}x errada`} color={C.danger} bg={C.dangerLight}/>}
                          {e.acertos>=2&&<Badge text="IA sugere retirar" color={C.accent} bg={C.accentLight}/>}
                          <span style={{marginLeft:"auto",fontSize:10,color:C.textLight}}>{e.data}</span>
                        </div>
                        <p style={{fontSize:13,color:C.textMed,lineHeight:1.7,margin:0,fontStyle:"italic",cursor:"pointer",borderLeft:`3px solid ${e.topicColor}30`,paddingLeft:10}}
                          onClick={()=>setExpandErro(isExp?null:e.id)}>
                          {e.questao} <span style={{fontSize:11,color:C.primary,fontStyle:"normal"}}>{isExp?"▲":"▼"}</span>
                        </p>
                        {isExp&&(
                          <div style={{marginTop:10,padding:"10px 12px",background:C.bg,borderRadius:10,animation:"popIn 0.2s ease"}}>
                            <div style={{display:"flex",gap:16,fontSize:11,marginBottom:6}}>
                              <span>Sua resposta: <strong style={{color:C.danger}}>{e.suaResposta}</strong></span>
                              <span>Gabarito: <strong style={{color:C.accent}}>{e.gabarito}</strong></span>
                            </div>
                            <p style={{fontSize:12,color:C.textMed,lineHeight:1.75,margin:0}}>{e.explicacao}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`,alignItems:"center"}}>
                      <button onClick={()=>setErros(es=>es.map(x=>x.id===e.id?{...x,acertos:x.acertos+1,erros:Math.max(0,x.erros-1)}:x))}
                        style={{padding:"6px 12px",background:C.accentLight,color:C.accent,border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>✓ Acertei</button>
                      <button onClick={()=>setErros(es=>es.filter(x=>x.id!==e.id))}
                        style={{padding:"6px 12px",background:C.dangerLight,color:C.danger,border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>🗑 Retirar</button>
                      <span style={{marginLeft:"auto",fontSize:11,color:C.textLight}}>
                        {'★'.repeat(e.acertos)}{'☆'.repeat(Math.max(0,3-e.acertos))} {e.acertos}/3
                      </span>
                    </div>
                  </div>
                );
              })}
              {erros.filter(e=>erroFilter==="all"||e.topicName===erroFilter).length===0&&(
                <div style={{textAlign:"center",padding:"60px 0",color:C.textLight}}>
                  <div style={{fontSize:36,marginBottom:10}}>✅</div>
                  <div style={{fontWeight:600}}>Nenhum erro nesta matéria!</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REVISÃO ── */}
        {tab==="revisao"&&(
          <div style={{animation:"fadeIn 0.3s ease"}}>
            <div style={{marginBottom:16}}>
              <h2 style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:700,color:C.text,marginBottom:4}}>Caderno de Revisão</h2>
              <p style={{fontSize:13,color:C.textMed}}>Repetição espaçada — quanto mais acerta, maior o intervalo. Você pode ajustar.</p>
            </div>
            {revisoes.filter(r=>r.status==="urgente"||r.status==="hoje").length>0&&(
              <>
                <div style={{fontSize:11,fontWeight:700,color:C.danger,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>
                  ⚡ Revisitar hoje ({revisoes.filter(r=>r.status==="urgente"||r.status==="hoje").length})
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
                  {revisoes.filter(r=>r.status==="urgente"||r.status==="hoje").map((r,i)=>(
                    <div key={r.id} style={{background:r.status==="urgente"?C.dangerLight:C.warningLight,border:`1.5px solid ${r.status==="urgente"?C.danger+"30":C.warning+"40"}`,borderRadius:14,padding:"14px 16px",animation:`fadeUp 0.3s ease ${i*0.05}s both`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                        <span style={{fontSize:18}}>{r.topicEmoji}</span>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:700,fontSize:12,color:r.topicColor}}>{r.topicName}</div>
                          <div style={{fontSize:13,fontWeight:600,color:C.text,marginTop:1}}>{r.conteudo}</div>
                        </div>
                        <Badge text={r.status==="urgente"?"Urgente":"Hoje"} color={r.status==="urgente"?C.danger:C.warning} bg={r.status==="urgente"?C.dangerLight:C.warningLight}/>
                      </div>
                      <button onClick={()=>setRevisoes(rs=>rs.map(x=>x.id===r.id?{...x,acertosConsec:x.acertosConsec+1,status:"em breve",proximaRevisao:`Em ${x.intervalo*2} dias`,intervalo:x.intervalo*2}:x))}
                        style={{padding:"7px 14px",background:C.accentLight,color:C.accent,border:"none",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                        ✓ Revisão feita
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div style={{fontSize:11,fontWeight:700,color:C.textLight,letterSpacing:1,textTransform:"uppercase",marginBottom:10}}>Próximas revisões</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {revisoes.filter(r=>r.status==="em breve"||r.status==="ok").map((r,i)=>(
                <div key={r.id} style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,padding:"14px 16px",boxShadow:C.shadow}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18}}>{r.topicEmoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:12,color:r.topicColor,marginBottom:2}}>{r.topicName} · {r.proximaRevisao}</div>
                      <div style={{fontSize:13,color:C.text,fontWeight:500}}>{r.conteudo}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                      <button onClick={()=>setRevisoes(rs=>rs.map(x=>x.id===r.id?{...x,intervalo:Math.max(1,x.intervalo-7)}:x))}
                        style={{width:22,height:22,borderRadius:"50%",border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <span style={{fontSize:12,fontWeight:700,color:C.primary,minWidth:36,textAlign:"center"}}>{r.intervalo}d</span>
                      <button onClick={()=>setRevisoes(rs=>rs.map(x=>x.id===r.id?{...x,intervalo:x.intervalo+7}:x))}
                        style={{width:22,height:22,borderRadius:"50%",border:`1px solid ${C.border}`,background:C.white,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        <div style={{textAlign:"center",marginTop:32}}>
          <button onClick={onReset} style={{background:"transparent",border:"none",color:C.textLight,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>
            Recomeçar onboarding
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function SimulaBanca(){
  const [screen,setScreen] = useState("onboarding");
  const [planData,setPlanData] = useState(null);

  useEffect(()=>{
    const s=document.createElement("style");
    s.id="sb-main";
    s.textContent=css;
    document.head.appendChild(s);
    try{
      const saved=localStorage.getItem("sb_plan");
      if(saved){setPlanData(JSON.parse(saved));setScreen("dashboard");}
    }catch{}
  },[]);

  const handleComplete = data => {
    setPlanData(data);
    try{localStorage.setItem("sb_plan",JSON.stringify(data));}catch{}
    setScreen("dashboard");
  };

  const handleReset = () => {
    try{localStorage.removeItem("sb_plan");}catch{}
    setPlanData(null);
    setScreen("onboarding");
  };

  if(screen==="onboarding") return <Onboarding onComplete={handleComplete}/>;
  return <Dashboard plan={planData} onReset={handleReset}/>;
}

