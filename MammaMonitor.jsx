import { useState, useEffect, useRef } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Nunito:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Nunito',sans-serif;background:#FDF7F2;color:#2C1A0F;-webkit-tap-highlight-color:transparent;}
input,textarea,select{font-family:'Nunito',sans-serif;color:#2C1A0F;user-select:text;}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:#FDF7F2;position:relative;}
.card{background:#fff;border-radius:18px;box-shadow:0 2px 14px rgba(160,100,60,.09);padding:18px;margin-bottom:14px;}
.ct{font-family:'Playfair Display',serif;font-size:17px;font-weight:600;color:#2C1A0F;margin-bottom:14px;}
.lbl{font-size:11px;font-weight:800;color:#A07A60;text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px;display:block;}
.inp{width:100%;border:1.5px solid #EAD9CC;border-radius:12px;padding:11px 14px;font-size:15px;background:#FAFAF7;outline:none;transition:border-color .2s;}
.inp:focus{border-color:#6B9E7E;}
.btn-g{background:#6B9E7E;color:#fff;border:none;border-radius:50px;padding:13px 28px;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;cursor:pointer;transition:transform .15s,opacity .15s;width:100%;}
.btn-g:active{transform:scale(.97);}
.btn-r{background:#E5897D;color:#fff;border:none;border-radius:50px;padding:14px;font-family:'Nunito',sans-serif;font-size:16px;font-weight:800;cursor:pointer;width:100%;transition:transform .15s;}
.btn-r:active{transform:scale(.97);}
.toggle{width:46px;height:26px;border-radius:13px;background:#EAD9CC;position:relative;cursor:pointer;transition:background .2s;flex-shrink:0;}
.toggle.on{background:#6B9E7E;}
.thumb{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);transition:left .2s;}
.on .thumb{left:23px;}
.chip{display:inline-flex;align-items:center;padding:7px 14px;border-radius:50px;font-size:13px;font-weight:700;cursor:pointer;border:2px solid #EAD9CC;background:#FAFAF7;color:#A07A60;transition:all .15s;}
.chip.on{border-color:#6B9E7E;background:#EDF6F0;color:#4D7A5E;}
.bnav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid #EAD9CC;display:flex;padding:8px 0 10px;z-index:100;box-shadow:0 -2px 12px rgba(160,100,60,.08);}
.ni{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:4px;cursor:pointer;border:none;background:none;color:#B09880;transition:color .15s;}
.ni.a{color:#6B9E7E;}
.ni.ar{color:#E5897D;}
.nlbl{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.3px;}
.ovl{position:fixed;inset:0;background:rgba(44,26,15,.52);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.sheet{background:#fff;border-radius:24px 24px 0 0;padding:24px 20px 24px;width:100%;max-width:430px;max-height:88vh;overflow-y:auto;}
.toast{position:fixed;top:84px;left:50%;transform:translateX(-50%);background:#2C1A0F;color:#fff;padding:10px 22px;border-radius:50px;font-size:13px;font-weight:700;z-index:300;animation:ft 2.5s ease forwards;white-space:nowrap;}
@keyframes ft{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}15%{opacity:1;transform:translateX(-50%) translateY(0)}80%{opacity:1}100%{opacity:0}}
.slide{-webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:#EAD9CC;outline:none;}
.slide::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#6B9E7E;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.18);}
.badge-r{background:#FEE2E2;color:#DC2626;font-size:11px;font-weight:800;padding:2px 9px;border-radius:50px;}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.ain{animation:up .3s ease;}
.sep{border:none;border-top:1px solid #F3E8DF;margin:10px 0;}
.row-item{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #F3E8DF;}
.row-item:last-child{border-bottom:none;}
`;

const SYMS = [
  {id:"nausea",e:"🤢",l:"Nausea",s:true},
  {id:"vomito",e:"🤮",l:"Vomito",s:true},
  {id:"stanchezza",e:"😴",l:"Stanchezza",s:true},
  {id:"cefalea",e:"🤕",l:"Mal di testa",s:true},
  {id:"dolor_addome",e:"🫃",l:"Dolore addominale",s:true},
  {id:"mal_schiena",e:"💙",l:"Mal di schiena",s:true},
  {id:"gonfiore",e:"💧",l:"Gonfiore arti",s:false},
  {id:"bruciore",e:"🔥",l:"Bruciore stomaco",s:false},
  {id:"vertigini",e:"😵\u200d💫",l:"Vertigini/capogiri",s:true},
  {id:"dispnea",e:"💨",l:"Difficoltà resp.",s:true},
  {id:"perdite_vaginal",e:"💦",l:"Perdite vaginali",s:false},
  {id:"prurito",e:"🌿",l:"Prurito",s:false},
  {id:"contrazioni",e:"⚡",l:"Contrazioni/crampi",s:true},
  {id:"disturbi_vis",e:"👁️",l:"Disturbi visivi",s:true},
  {id:"palpitazioni",e:"💓",l:"Palpitazioni",s:true},
];

const BLC = [
  {id:"marrone_scuro",l:"Marrone scuro",h:"#4A2810",note:"Sangue vecchio",urgency:0},
  {id:"marrone",l:"Marrone",h:"#8B5E3C",note:"Ossidato / vecchio",urgency:1},
  {id:"rosa",l:"Rosa",h:"#F4A7B9",note:"Sangue diluito",urgency:1},
  {id:"rosso",l:"Rosso",h:"#C0392B",note:"Fresco / attivo",urgency:2},
  {id:"rosso_vivo",l:"Rosso vivo ⚠️",h:"#E8000B",note:"Sanguinamento attivo",urgency:3},
];

const AMT = [
  {id:"tracce",l:"Tracce",d:"Solo sulla carta igienica"},
  {id:"lieve",l:"Lieve",d:"< 1 assorbente al giorno"},
  {id:"moderata",l:"Moderata",d:"1–2 assorbenti al giorno"},
  {id:"abbondante",l:"Abbondante ⚠️",d:"Più assorbenti al giorno"},
];

const TEX = ["Acquosa","Normale","Densa","Con coaguli ⚠️"];

const MOODS = [
  {v:1,e:"😢",l:"Molto triste"},
  {v:2,e:"😟",l:"Giù"},
  {v:3,e:"😐",l:"Neutro"},
  {v:4,e:"🙂",l:"Bene"},
  {v:5,e:"😊",l:"Ottima!"},
];

const sg = async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const ss = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch {} };
const gToday = () => new Date().toISOString().split("T")[0];
const fDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("it-IT",{day:"numeric",month:"short"});

const calcPreg = (lmp) => {
  if (!lmp) return {week:0,day:0,totalDays:0,trim:1,dueDate:null};
  const diff = Math.floor((Date.now() - new Date(lmp).getTime()) / 86400000);
  const week = Math.floor(diff/7);
  const day = diff%7;
  const trim = week<14?1:week<28?2:3;
  const dueDate = new Date(new Date(lmp).getTime() + 280*86400000);
  return {week,day,totalDays:diff,trim,dueDate};
};

const emptyDay = () => ({
  date:gToday(), weight:"", bp:"", mood:3,
  sleepH:7, sleepQ:3, fetalMov:0,
  symptoms:{},
  meals:{colazione:"",pranzo:"",cena:"",spuntini:""},
  water:6, supplements:"",
  activities:"", stressLevel:0, stressNotes:"",
  cervLen:"", hgb:"", notes:"",
});

// ── Components ────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",gap:16}}>
      <div style={{fontSize:52}}>🌸</div>
      <p style={{fontFamily:"'Nunito',sans-serif",color:"#A07A60",fontWeight:700,fontSize:15}}>Caricamento...</p>
    </div>
  );
}

function Setup({onSave}) {
  const [name,setName] = useState("");
  const [lmp,setLmp] = useState("");
  const [notes,setNotes] = useState("");
  const ok = lmp.length > 0;
  return (
    <div style={{minHeight:"100vh",background:"#FDF7F2",padding:"48px 20px 32px",display:"flex",flexDirection:"column"}}>
      <style>{G}</style>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{fontSize:60,marginBottom:10}}>🌸</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:"#2C1A0F"}}>MammaMonitor</h1>
        <p style={{color:"#A07A60",fontSize:14,marginTop:6,fontWeight:600}}>Diario medico di gravidanza</p>
      </div>
      <div className="card">
        <p className="ct">Configurazione iniziale</p>
        <div style={{marginBottom:16}}>
          <label className="lbl">Nome della mamma</label>
          <input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Es. Sofia" />
        </div>
        <div style={{marginBottom:16}}>
          <label className="lbl">Primo giorno ultima mestruazione (UPM)</label>
          <input className="inp" type="date" value={lmp} onChange={e=>setLmp(e.target.value)} max={gToday()} />
          <p style={{fontSize:12,color:"#A07A60",marginTop:5}}>📌 Usato per calcolare la settimana gestazionale</p>
        </div>
        <div style={{marginBottom:20}}>
          <label className="lbl">Note cliniche iniziali (opzionale)</label>
          <textarea className="inp" rows={3} style={{resize:"none"}} value={notes} onChange={e=>setNotes(e.target.value)}
            placeholder="Es. patologie preesistenti, farmaci abituali, allergie, gravidanza a rischio..." />
        </div>
        <button className="btn-g" style={{opacity:ok?1:.5}} onClick={()=>{if(ok)onSave({name:name||"Mamma",lmpDate:lmp,notes});}}>
          Inizia il monitoraggio →
        </button>
      </div>
      <p style={{textAlign:"center",fontSize:12,color:"#C0A090",marginTop:14}}>I dati sono salvati in modo sicuro su questo dispositivo</p>
    </div>
  );
}

function Header({preg,settings}) {
  const pct = Math.min((preg.week/40)*100,100);
  const tColors = ["#6B9E7E","#9B8FBF","#D4896A"];
  const c = tColors[preg.trim-1];
  const daysLeft = preg.dueDate ? Math.max(0,Math.floor((preg.dueDate-Date.now())/86400000)) : null;
  const tLabels = ["1° Trimestre","2° Trimestre","3° Trimestre"];
  return (
    <header style={{background:"#fff",borderBottom:"1px solid #EAD9CC",padding:"13px 18px 11px",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:"#FEF0EB",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🌸</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:"#2C1A0F"}}>{settings?.name||"Mamma"}</div>
            <div style={{fontSize:10,color:"#A07A60",fontWeight:800,textTransform:"uppercase",letterSpacing:".4px"}}>MammaMonitor</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:c,lineHeight:1.1}}>
            {preg.week}<span style={{fontSize:12,fontWeight:500}}>ª sett.</span>
            <span style={{fontSize:13,color:"#A07A60",fontWeight:500}}> + {preg.day}g</span>
          </div>
          {daysLeft!==null && <div style={{fontSize:11,color:"#A07A60",fontWeight:600}}>{daysLeft} giorni al termine</div>}
        </div>
      </div>
      <div>
        <div style={{height:7,background:"#EAD9CC",borderRadius:4,overflow:"hidden",position:"relative"}}>
          <div style={{width:`${pct}%`,height:"100%",background:c,borderRadius:4,transition:"width .4s"}} />
          {[33.33,66.66].map((pos,i)=>(
            <div key={i} style={{position:"absolute",top:0,left:`${pos}%`,width:1,height:"100%",background:"rgba(255,255,255,.6)"}} />
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
          {["T1 (0-13)","T2 (14-27)","T3 (28-40)"].map((l,i)=>(
            <span key={i} style={{fontSize:9,color:preg.trim===i+1?c:"#C0A090",fontWeight:preg.trim===i+1?800:500}}>{l}</span>
          ))}
        </div>
      </div>
    </header>
  );
}

function BNav({page,setPage}) {
  const items = [
    {id:"today",l:"Oggi",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>},
    {id:"symptoms",l:"Sintomi",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>},
    {id:"nutrition",l:"Alimenti",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>},
    {id:"bleeding",l:"Perdite",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.5 2 2 8 2 13a10 10 0 0 0 20 0c0-5-4.5-11-10-11z"/></svg>,red:true},
    {id:"diary",l:"Diario",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>},
    {id:"report",l:"Report",icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="9" x2="9" y2="21"/></svg>},
  ];
  return (
    <nav className="bnav">
      {items.map(it=>(
        <button key={it.id} className={`ni${page===it.id?(it.red?" ar":" a"):""}`} onClick={()=>setPage(it.id)}>
          {it.icon}
          <span className="nlbl">{it.l}</span>
        </button>
      ))}
    </nav>
  );
}

function Toast({msg}) { return <div className="toast">{msg}</div>; }

// ── Pages ──────────────────────────────────────────────────────────────────────

function TodayPage({dayLog,updateDay,preg}) {
  const dateStr = new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"});
  return (
    <div className="ain">
      <p style={{fontSize:12,color:"#A07A60",marginBottom:14,fontWeight:800,textTransform:"uppercase",letterSpacing:".5px"}}>{dateStr}</p>

      {/* Vitals */}
      <div className="card">
        <p className="ct">📊 Parametri Vitali</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label className="lbl">Peso (kg)</label>
            <input className="inp" type="number" step=".1" placeholder="62.5" value={dayLog.weight}
              onChange={e=>updateDay({weight:e.target.value})} />
          </div>
          <div>
            <label className="lbl">Pressione (mmHg)</label>
            <input className="inp" placeholder="120/80" value={dayLog.bp}
              onChange={e=>updateDay({bp:e.target.value})} />
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
          <div>
            <label className="lbl">Hb / Ematocrito</label>
            <input className="inp" placeholder="Es. 11.2 g/dL" value={dayLog.hgb}
              onChange={e=>updateDay({hgb:e.target.value})} />
          </div>
          <div>
            <label className="lbl">Lungh. Cerv. (mm)</label>
            <input className="inp" type="number" placeholder="Es. 38" value={dayLog.cervLen}
              onChange={e=>updateDay({cervLen:e.target.value})} />
          </div>
        </div>
      </div>

      {/* Mood + Sleep */}
      <div className="card">
        <p className="ct">😊 Umore e Riposo</p>
        <label className="lbl" style={{marginBottom:10}}>Come ti senti oggi?</label>
        <div style={{display:"flex",gap:6,justifyContent:"space-around",marginBottom:18}}>
          {MOODS.map(m=>(
            <div key={m.v} onClick={()=>updateDay({mood:m.v})}
              style={{textAlign:"center",cursor:"pointer",opacity:dayLog.mood===m.v?1:.35,transform:dayLog.mood===m.v?"scale(1.22)":"scale(1)",transition:"all .15s"}}>
              <div style={{fontSize:30}}>{m.e}</div>
              <div style={{fontSize:9,color:"#A07A60",fontWeight:800,marginTop:3}}>{m.l.split(" ").slice(-1)[0]}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <label className="lbl">Ore di sonno</label>
            <input className="inp" type="number" min="0" max="12" step=".5" value={dayLog.sleepH}
              onChange={e=>updateDay({sleepH:e.target.value})} />
          </div>
          <div>
            <label className="lbl">Qualità</label>
            <div style={{display:"flex",gap:3,marginTop:10}}>
              {[1,2,3,4,5].map(v=>(
                <span key={v} onClick={()=>updateDay({sleepQ:v})}
                  style={{fontSize:19,cursor:"pointer",opacity:dayLog.sleepQ>=v?1:.25,transition:"opacity .1s"}}>⭐</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fetal movements */}
      <div className="card">
        <p className="ct">🤰 Movimenti Fetali</p>
        {preg.week < 18
          ? <p style={{fontSize:13,color:"#A07A60"}}>Visibile solitamente dalla {preg.week<18?"18ª":""}  settimana in poi. Continua a monitorare!</p>
          : <>
            <p style={{fontSize:13,color:"#A07A60",marginBottom:14}}>Riferimento: almeno 10 movimenti in 2 ore</p>
            <div style={{display:"flex",alignItems:"center",gap:20,justifyContent:"center"}}>
              <button onClick={()=>updateDay({fetalMov:Math.max(0,dayLog.fetalMov-1)})}
                style={{width:44,height:44,borderRadius:"50%",border:"2px solid #EAD9CC",background:"#fff",fontSize:22,cursor:"pointer",color:"#A07A60"}}>−</button>
              <div style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:44,color:dayLog.fetalMov>=10?"#6B9E7E":dayLog.fetalMov>0?"#D4896A":"#C0A090",fontWeight:600,lineHeight:1}}>{dayLog.fetalMov}</div>
                <div style={{fontSize:12,color:"#A07A60",fontWeight:600}}>movimenti oggi</div>
              </div>
              <button onClick={()=>updateDay({fetalMov:dayLog.fetalMov+1})}
                style={{width:44,height:44,borderRadius:"50%",background:"#EDF6F0",border:"2px solid #6B9E7E",fontSize:22,cursor:"pointer",color:"#6B9E7E",fontWeight:700}}>+</button>
            </div>
            {dayLog.fetalMov > 0 && dayLog.fetalMov < 10 && preg.week >= 24 && (
              <div style={{background:"#FFF7ED",borderRadius:10,padding:"10px 14px",marginTop:14,fontSize:13,color:"#92400E",fontWeight:600}}>
                ⚠️ Meno di 10 movimenti — continua il conteggio nelle prossime ore
              </div>
            )}
            {dayLog.fetalMov >= 10 && (
              <div style={{background:"#EDF6F0",borderRadius:10,padding:"10px 14px",marginTop:14,fontSize:13,color:"#3A6B50",fontWeight:600}}>
                ✅ Movimenti nella norma
              </div>
            )}
          </>
        }
      </div>
    </div>
  );
}

function SymptomsPage({dayLog,updateDay}) {
  const setPresent = (id,val) => {
    const s = {...dayLog.symptoms};
    if (val) s[id]={present:true,severity:1}; else delete s[id];
    updateDay({symptoms:s});
  };
  const setSev = (id,sev) => {
    const s = {...dayLog.symptoms};
    s[id]={...s[id],severity:sev};
    updateDay({symptoms:s});
  };
  const present = Object.keys(dayLog.symptoms||{}).length;
  return (
    <div className="ain">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <p style={{fontSize:12,color:"#A07A60",fontWeight:800,textTransform:"uppercase",letterSpacing:".5px"}}>Sintomi del giorno</p>
        {present>0 && <span style={{background:"#E5897D",color:"#fff",fontSize:12,fontWeight:800,padding:"3px 11px",borderRadius:50}}>{present} presenti</span>}
      </div>
      <div className="card" style={{padding:"4px 18px"}}>
        {SYMS.map((s,i)=>{
          const sym = (dayLog.symptoms||{})[s.id];
          const on = !!sym;
          const sevL = ["","L","M","F"];
          return (
            <div key={s.id} className="row-item">
              <span style={{fontSize:20,width:26,textAlign:"center",flexShrink:0}}>{s.e}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:on?700:500,color:on?"#2C1A0F":"#A07A60"}}>{s.l}</div>
                {on && s.s && (
                  <div style={{display:"flex",gap:5,marginTop:6,alignItems:"center"}}>
                    <span style={{fontSize:11,color:"#A07A60"}}>Intensità:</span>
                    {[1,2,3].map(v=>{
                      const cols = ["","#D4896A","#E5897D","#C0392B"];
                      const bgs = ["","#FFF7ED","#FDECEA","#FEF2F2"];
                      const active = sym.severity>=v;
                      return (
                        <button key={v} onClick={()=>setSev(s.id,v)}
                          style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${active?cols[v]:"#EAD9CC"}`,background:active?bgs[v]:"#fff",
                            fontSize:11,fontWeight:800,cursor:"pointer",color:active?cols[v]:"#C0A090",transition:"all .15s"}}>
                          {sevL[v]}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={`toggle${on?" on":""}`} onClick={()=>setPresent(s.id,!on)}>
                <div className="thumb" />
              </div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <p className="ct">📍 Note sul dolore</p>
        <textarea className="inp" rows={3} style={{resize:"none"}}
          placeholder="Localizzazione, tipo (crampo/fitta/pressione/bruciore), irradiazione, quando compare..."
          value={dayLog.notes||""} onChange={e=>updateDay({notes:e.target.value})} />
      </div>
      {/* Alarm signs */}
      <div style={{background:"#FEF2F2",borderRadius:14,padding:14,borderLeft:"4px solid #EF4444"}}>
        <p style={{fontSize:12,fontWeight:800,color:"#DC2626",marginBottom:6}}>🚨 Segnali d'allarme — contattare subito il ginecologo</p>
        {["Dolore addominale acuto e persistente","Contrazioni regolari prima della 37ª settimana","Disturbi visivi + cefalea + gonfiore (segni pre-eclampsia)","Febbre > 38°C","Fuoriuscita di liquido (rotto le acque?)","Riduzione brusca dei movimenti fetali"].map(t=>(
          <div key={t} style={{fontSize:12,color:"#7F1D1D",display:"flex",gap:6,marginBottom:3}}>
            <span style={{flexShrink:0}}>⚠️</span><span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NutritionPage({dayLog,updateDay}) {
  const meals = dayLog.meals||{};
  const upMeal = (k,v) => updateDay({meals:{...meals,[k]:v}});
  return (
    <div className="ain">
      <p style={{fontSize:12,color:"#A07A60",marginBottom:14,fontWeight:800,textTransform:"uppercase",letterSpacing:".5px"}}>Diario alimentare</p>
      <div className="card">
        <p className="ct">🍽️ Pasti</p>
        {[{k:"colazione",l:"Colazione",e:"☕"},{k:"pranzo",l:"Pranzo",e:"🥗"},{k:"cena",l:"Cena",e:"🍝"},{k:"spuntini",l:"Spuntini",e:"🍎"}].map(m=>(
          <div key={m.k} style={{marginBottom:14}}>
            <label className="lbl">{m.e} {m.l}</label>
            <textarea className="inp" rows={2} style={{resize:"none"}} placeholder={`Descrivi ${m.l.toLowerCase()}...`}
              value={meals[m.k]||""} onChange={e=>upMeal(m.k,e.target.value)} />
          </div>
        ))}
      </div>
      <div className="card">
        <p className="ct">💧 Idratazione</p>
        <label className="lbl">Bicchieri d'acqua (obiettivo: 8+)</label>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:4}}>
          {[1,2,3,4,5,6,7,8,9,10].map(v=>(
            <div key={v} onClick={()=>updateDay({water:v})}
              style={{width:38,height:38,borderRadius:10,border:`2px solid ${dayLog.water>=v?"#6B9E7E":"#EAD9CC"}`,
                background:dayLog.water>=v?"#EDF6F0":"#fff",display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:17,cursor:"pointer",transition:"all .15s"}}>💧</div>
          ))}
        </div>
        <p style={{fontSize:13,color:dayLog.water>=8?"#4D7A5E":"#A07A60",marginTop:8,fontWeight:600}}>
          {dayLog.water>=8?"✅ Ottima idratazione!":`${dayLog.water}/8 bicchieri — continua!`}
        </p>
      </div>
      <div className="card">
        <p className="ct">💊 Integratori e Farmaci</p>
        <textarea className="inp" rows={3} style={{resize:"none"}}
          placeholder="Acido folico 400mcg, ferro, vitamina D3, omega-3, progesterone, altri farmaci prescr..."
          value={dayLog.supplements||""} onChange={e=>updateDay({supplements:e.target.value})} />
      </div>
      <div className="card">
        <p className="ct" style={{color:"#C0392B"}}>🚫 Da evitare in gravidanza</p>
        <div style={{background:"#FEF9F5",borderRadius:10,padding:12}}>
          {[["Alcol","Anche in minima quantità"],["Pesce crudo / sushi","Rischio Listeria e parassiti"],
            ["Formaggi molli non past.","Gorgonzola, brie, camembert"],["Carni crude o poco cotte","Rischio Toxoplasma"],
            ["Fegato e insaccati","Vitamina A in eccesso / nitriti"],["Caffeina > 200 mg/die","Circa 2 caffè espresso"],
            ["Uova crude","Mayonnaise fatta in casa"],["Frutta/verdura non lavata","Rischio Toxoplasma"]].map(([a,b])=>(
            <div key={a} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F3E8DF",fontSize:13}}>
              <span style={{fontWeight:700,color:"#6B4A35"}}>❌ {a}</span>
              <span style={{color:"#A07A60",fontSize:12}}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BEntry({entry}) {
  const c = BLC.find(x=>x.id===entry.color);
  const a = AMT.find(x=>x.id===entry.amount);
  const urgent = entry.color==="rosso_vivo"||entry.amount==="abbondante"||entry.texture?.includes("coaguli");
  return (
    <div className="row-item" style={{alignItems:"flex-start"}}>
      <div style={{width:38,height:38,borderRadius:"50%",background:c?.h||"#ccc",flexShrink:0,marginTop:2,
        border:urgent?"2.5px solid #EF4444":"2px solid rgba(0,0,0,.1)",
        boxShadow:urgent?"0 0 0 3px #FEE2E2":"none"}} />
      <div style={{flex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3,flexWrap:"wrap"}}>
          <span style={{fontSize:13,fontWeight:800,color:"#2C1A0F"}}>{fDate(entry.date)} – {entry.time}</span>
          {urgent && <span className="badge-r">Urgente</span>}
          <span style={{fontSize:11,color:"#A07A60",fontWeight:600}}>Sett.{entry.week}+{entry.day}</span>
        </div>
        <div style={{fontSize:13,color:"#6B4A35"}}>
          <span style={{fontWeight:700}}>{c?.l||"—"}</span>
          {a&&<span> · {a.l}</span>}
          {entry.texture&&<span> · {entry.texture}</span>}
        </div>
        {entry.pain&&<div style={{fontSize:12,color:"#DC2626",marginTop:2,fontWeight:600}}>🔴 Dolore NRS {entry.painLevel||"—"}/10</div>}
        {entry.notes&&<div style={{fontSize:12,color:"#A07A60",marginTop:2,fontStyle:"italic"}}>"{entry.notes}"</div>}
      </div>
    </div>
  );
}

function BleedingPage({bleeding,onAdd}) {
  const today = gToday();
  const todayE = bleeding.filter(b=>b.date===today);
  const pastE = bleeding.filter(b=>b.date!==today);
  return (
    <div className="ain">
      <div style={{background:"#FEF2F2",borderRadius:14,padding:14,marginBottom:14,borderLeft:"4px solid #EF4444"}}>
        <p style={{fontSize:12,fontWeight:800,color:"#DC2626",marginBottom:5}}>⚠️ Quando chiamare subito il ginecologo</p>
        <p style={{fontSize:12,color:"#7F1D1D",lineHeight:1.7}}>
          Rosso vivo abbondante · Dolore acuto · Coaguli > 2cm · Perdita di liquido · Riduzione movimenti fetali · Febbre associata
        </p>
      </div>
      <button className="btn-r" style={{marginBottom:14,letterSpacing:".3px"}} onClick={onAdd}>
        🩸 Registra nuovo episodio
      </button>
      {todayE.length>0&&(
        <div className="card">
          <p className="ct">Oggi</p>
          {todayE.map(e=><BEntry key={e.id} entry={e}/>)}
        </div>
      )}
      {pastE.length>0&&(
        <div className="card">
          <p className="ct">Storico perdite</p>
          {pastE.slice(0,25).map(e=><BEntry key={e.id} entry={e}/>)}
        </div>
      )}
      {bleeding.length===0&&(
        <div style={{textAlign:"center",padding:"44px 20px",color:"#A07A60"}}>
          <div style={{fontSize:52,marginBottom:12}}>🌿</div>
          <p style={{fontWeight:700,fontSize:16}}>Nessuna perdita registrata</p>
          <p style={{fontSize:13,marginTop:6}}>Usa il pulsante rosso per registrare un episodio</p>
        </div>
      )}
    </div>
  );
}

function BModal({newB,setNewB,onClose,onSave}) {
  const canSave = newB.color && newB.amount;
  return (
    <div className="ovl" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="sheet">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:21,color:"#2C1A0F"}}>🩸 Registra perdita</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:26,cursor:"pointer",color:"#A07A60",lineHeight:1}}>×</button>
        </div>

        <label className="lbl">Colore della perdita</label>
        <div style={{display:"flex",gap:10,marginBottom:18,justifyContent:"space-between"}}>
          {BLC.map(c=>(
            <div key={c.id} onClick={()=>setNewB({...newB,color:c.id})}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer",
                opacity:newB.color&&newB.color!==c.id?.5:1,transition:"opacity .15s"}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:c.h,
                border:newB.color===c.id?"3px solid #2C1A0F":"3px solid transparent",
                boxShadow:newB.color===c.id?"0 0 0 3px #6B9E7E":"none",transition:"all .15s"}} />
              <span style={{fontSize:10,fontWeight:700,color:"#6B4A35",textAlign:"center",maxWidth:52,lineHeight:1.3}}>{c.l}</span>
              <span style={{fontSize:9,color:"#A07A60",textAlign:"center",maxWidth:56,lineHeight:1.2}}>{c.note}</span>
            </div>
          ))}
        </div>

        <label className="lbl">Quantità</label>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {AMT.map(a=>(
            <div key={a.id} onClick={()=>setNewB({...newB,amount:a.id})}
              style={{padding:"10px 14px",borderRadius:12,border:`2px solid ${newB.amount===a.id?"#E5897D":"#EAD9CC"}`,
                background:newB.amount===a.id?"#FDECEA":"#fff",cursor:"pointer",transition:"all .15s"}}>
              <div style={{fontSize:14,fontWeight:800,color:"#2C1A0F"}}>{a.l}</div>
              <div style={{fontSize:12,color:"#A07A60"}}>{a.d}</div>
            </div>
          ))}
        </div>

        <label className="lbl">Consistenza</label>
        <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
          {TEX.map(t=>(
            <div key={t} onClick={()=>setNewB({...newB,texture:t})}
              className={`chip${newB.texture===t?" on":""}`}>{t}</div>
          ))}
        </div>

        <label className="lbl">Dolore associato?</label>
        <div style={{display:"flex",gap:10,marginBottom:newB.pain?12:16}}>
          {[{v:true,l:"🔴 Sì"},{v:false,l:"✅ No"}].map(opt=>(
            <div key={String(opt.v)} onClick={()=>setNewB({...newB,pain:opt.v})}
              style={{flex:1,padding:"10px",borderRadius:12,textAlign:"center",cursor:"pointer",
                border:`2px solid ${newB.pain===opt.v?"#E5897D":"#EAD9CC"}`,
                background:newB.pain===opt.v?"#FDECEA":"#fff",
                fontWeight:800,fontSize:14,color:newB.pain===opt.v?"#C0392B":"#A07A60",transition:"all .15s"}}>
              {opt.l}
            </div>
          ))}
        </div>

        {newB.pain&&(
          <div style={{marginBottom:16}}>
            <label className="lbl">Intensità dolore (NRS): <strong style={{color:"#2C1A0F"}}>{newB.painLevel||5}/10</strong></label>
            <input type="range" className="slide" min={1} max={10} value={newB.painLevel||5}
              onChange={e=>setNewB({...newB,painLevel:parseInt(e.target.value)})} />
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#A07A60",marginTop:2}}>
              <span>1 – Lieve</span><span>5 – Moderato</span><span>10 – Insopportabile</span>
            </div>
          </div>
        )}

        <label className="lbl">Note aggiuntive (opzionale)</label>
        <textarea className="inp" rows={2} style={{resize:"none",marginBottom:18}}
          placeholder="Dopo attività fisica, rapporto sessuale, al risveglio, dopo palpazione..."
          value={newB.notes||""} onChange={e=>setNewB({...newB,notes:e.target.value})} />

        <button className="btn-r" style={{opacity:canSave?1:.4,cursor:canSave?"pointer":"default"}}
          onClick={()=>{if(canSave)onSave();}}>
          Salva episodio
        </button>
        {!canSave&&<p style={{textAlign:"center",fontSize:12,color:"#A07A60",marginTop:8}}>Seleziona colore e quantità per salvare</p>}
      </div>
    </div>
  );
}

function DiaryPage({dayLog,updateDay}) {
  return (
    <div className="ain">
      <p style={{fontSize:12,color:"#A07A60",marginBottom:14,fontWeight:800,textTransform:"uppercase",letterSpacing:".5px"}}>Diario del giorno</p>
      <div className="card">
        <p className="ct">🚶 Attività Fisica</p>
        <p style={{fontSize:12,color:"#A07A60",marginBottom:10}}>Attività consigliate in gravidanza: camminata, nuoto, yoga prenatale, pilates</p>
        <textarea className="inp" rows={3} style={{resize:"none"}}
          placeholder="Es. camminata 30 min al parco, nuoto 20 min, riposo completo su indicazione medica..."
          value={dayLog.activities||""} onChange={e=>updateDay({activities:e.target.value})} />
      </div>
      <div className="card">
        <p className="ct">🧠 Stress ed Emozioni</p>
        <label className="lbl">Livello di stress percepito (0 = assente)</label>
        <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
          {[0,1,2,3,4,5].map(v=>{
            const cols = ["#6B9E7E","#8AB08E","#D4896A","#E5897D","#C0392B","#991B1B"];
            const bgs = ["#EDF6F0","#F0F7F2","#FFF7ED","#FDECEA","#FEE2E2","#FEE2E2"];
            const on = dayLog.stressLevel===v;
            return (
              <div key={v} onClick={()=>updateDay({stressLevel:v})}
                style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",
                  background:on?bgs[v]:"#F7F0EB",border:`2px solid ${on?cols[v]:"#EAD9CC"}`,
                  cursor:"pointer",fontSize:15,fontWeight:800,color:on?cols[v]:"#C0A090",transition:"all .15s"}}>
                {v}
              </div>
            );
          })}
        </div>
        <textarea className="inp" rows={3} style={{resize:"none"}}
          placeholder="Descrivi eventi stressanti, preoccupazioni, conflitti, notizie negative ricevute..."
          value={dayLog.stressNotes||""} onChange={e=>updateDay({stressNotes:e.target.value})} />
      </div>
      <div className="card">
        <p className="ct">📝 Note libere</p>
        <textarea className="inp" rows={5} style={{resize:"none"}}
          placeholder="Domande per il ginecologo, sensazioni particolari, sogni, pensieri, promemoria visite o esami..."
          value={dayLog.notes||""} onChange={e=>updateDay({notes:e.target.value})} />
      </div>
      <div className="card" style={{background:"#F9F5FF",border:"1px solid #D8D0F0"}}>
        <p className="ct" style={{color:"#5B4B8A"}}>💜 Benessere psicologico</p>
        <p style={{fontSize:13,color:"#6B5A9E",lineHeight:1.7}}>
          Ansia e instabilità emotiva sono comuni in gravidanza, specialmente in presenza di complicanze. È importante parlarne con il ginecologo e, se necessario, con un professionista della salute mentale.
          <br/><br/>
          <span style={{fontWeight:700}}>Segnali da non ignorare:</span> pianto persistente, difficoltà ad alzarsi, pensieri negativi, isolamento.
        </p>
      </div>
    </div>
  );
}

function ReportPage({dayLog,bleeding,preg,settings}) {
  const today = gToday();
  const urgentCount = bleeding.filter(b=>b.color==="rosso_vivo"||b.amount==="abbondante").length;
  const recentB = bleeding.slice(0,10);
  const activeSym = Object.keys(dayLog.symptoms||{});
  const sevL = ["","Lieve","Moderato","Forte"];
  const dateStr = new Date().toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div className="ain">
      {/* Summary banner */}
      <div style={{background:"linear-gradient(135deg,#6B9E7E,#4D7A5E)",borderRadius:18,padding:20,marginBottom:14,color:"#fff"}}>
        <p style={{fontFamily:"'Playfair Display',serif",fontSize:19,marginBottom:3}}>Report per il Ginecologo</p>
        <p style={{fontSize:12,opacity:.85,marginBottom:16}}>Generato il {dateStr}</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{n:`${preg.week}+${preg.day}`,l:"Settimane"},{n:bleeding.length,l:"Episodi perdita"},{n:urgentCount,l:"Urgenti",warn:urgentCount>0}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,.15)",borderRadius:12,padding:"10px 8px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:800,color:s.warn?"#FCA5A5":"#fff"}}>{s.n}</div>
              <div style={{fontSize:11,opacity:.85}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vitals today */}
      <div className="card">
        <p className="ct">📊 Parametri di oggi</p>
        {[
          {l:"Peso",v:dayLog.weight?`${dayLog.weight} kg`:null},
          {l:"Pressione arteriosa",v:dayLog.bp?`${dayLog.bp} mmHg`:null},
          {l:"Emoglobina",v:dayLog.hgb||null},
          {l:"Lunghezza cervicale",v:dayLog.cervLen?`${dayLog.cervLen} mm`:null,warn:dayLog.cervLen&&dayLog.cervLen<25},
          {l:"Sonno",v:dayLog.sleepH?`${dayLog.sleepH}h · qualità ${dayLog.sleepQ}/5`:null},
          {l:"Umore",v:`${MOODS.find(m=>m.v===dayLog.mood)?.e} ${MOODS.find(m=>m.v===dayLog.mood)?.l}`},
          {l:"Movimenti fetali",v:`${dayLog.fetalMov} registrati`,warn:preg.week>=24&&dayLog.fetalMov<10&&dayLog.fetalMov>0},
          {l:"Acqua",v:`${dayLog.water} bicchieri`},
          {l:"Stress",v:dayLog.stressLevel>0?`${dayLog.stressLevel}/5`:null,warn:dayLog.stressLevel>=4},
        ].filter(r=>r.v).map((r,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid #F3E8DF"}}>
            <span style={{fontSize:13,color:"#A07A60"}}>{r.l}</span>
            <span style={{fontSize:13,fontWeight:700,color:r.warn?"#DC2626":"#2C1A0F"}}>{r.warn?"⚠️ "}{r.v}</span>
          </div>
        ))}
      </div>

      {/* Active symptoms */}
      {activeSym.length>0&&(
        <div className="card">
          <p className="ct">🤒 Sintomi attivi</p>
          {activeSym.map(id=>{
            const s = SYMS.find(x=>x.id===id);
            const d = (dayLog.symptoms||{})[id];
            return (
              <div key={id} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid #F3E8DF"}}>
                <span style={{fontSize:18,width:24}}>{s?.e}</span>
                <span style={{fontSize:14,fontWeight:600,flex:1}}>{s?.l}</span>
                {d?.severity&&<span style={{fontSize:12,color:"#A07A60",fontWeight:700}}>{sevL[d.severity]}</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Bleeding summary */}
      {bleeding.length>0&&(
        <div className="card">
          <p className="ct">🩸 Ultime perdite registrate</p>
          {urgentCount>0&&(
            <div style={{background:"#FEE2E2",borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:13,fontWeight:700,color:"#DC2626"}}>
              ⚠️ {urgentCount} episodio/i ad alta urgenza nella storia recente
            </div>
          )}
          {recentB.map(e=><BEntry key={e.id} entry={e}/>)}
        </div>
      )}

      {/* Medications */}
      {dayLog.supplements&&(
        <div className="card">
          <p className="ct">💊 Terapia / Integratori</p>
          <p style={{fontSize:14,color:"#2C1A0F",lineHeight:1.7}}>{dayLog.supplements}</p>
        </div>
      )}

      {/* Activities & stress */}
      {(dayLog.activities||dayLog.stressNotes)&&(
        <div className="card">
          <p className="ct">🚶 Stile di vita</p>
          {dayLog.activities&&(
            <div style={{marginBottom:12}}>
              <p style={{fontSize:12,fontWeight:800,color:"#A07A60",marginBottom:4}}>ATTIVITÀ FISICA</p>
              <p style={{fontSize:14,color:"#2C1A0F"}}>{dayLog.activities}</p>
            </div>
          )}
          {dayLog.stressNotes&&(
            <div>
              <p style={{fontSize:12,fontWeight:800,color:"#A07A60",marginBottom:4}}>EVENTI STRESSANTI</p>
              <p style={{fontSize:14,color:"#2C1A0F"}}>{dayLog.stressNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="card">
        <p className="ct">📋 Note e domande per il ginecologo</p>
        <div style={{background:"#FEF9F5",borderRadius:10,padding:14,fontSize:14,color:"#6B4A35",lineHeight:1.8,minHeight:60}}>
          {dayLog.notes||<span style={{color:"#C0A090",fontStyle:"italic"}}>Nessuna nota aggiunta per oggi</span>}
        </div>
      </div>

      {/* Settings note */}
      {settings?.notes&&(
        <div className="card">
          <p className="ct">📁 Anamnesi iniziale</p>
          <p style={{fontSize:14,color:"#2C1A0F",lineHeight:1.7}}>{settings.notes}</p>
        </div>
      )}

      <div style={{textAlign:"center",padding:"12px 0 6px",fontSize:11,color:"#C0A090"}}>
        MammaMonitor · {settings?.name||"Paziente"} · {preg.week}ª settimana gestazionale
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function MammaMonitor() {
  const [page,setPage] = useState("today");
  const [settings,setSettings] = useState(null);
  const [showSetup,setShowSetup] = useState(false);
  const [dayLog,setDayLog] = useState(emptyDay());
  const [bleeding,setBleeding] = useState([]);
  const [bModal,setBModal] = useState(false);
  const [newB,setNewB] = useState({});
  const [toast,setToast] = useState("");
  const [loading,setLoading] = useState(true);

  const preg = settings ? calcPreg(settings.lmpDate) : {week:0,day:0,totalDays:0,trim:1,dueDate:null};

  useEffect(()=>{
    (async()=>{
      const s = await sg("settings");
      if (s) setSettings(s); else setShowSetup(true);
      const d = await sg(`day:${gToday()}`);
      if (d) setDayLog(d);
      const b = await sg("bleeding");
      if (b) setBleeding(b);
      setLoading(false);
    })();
  },[]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2500); };

  const updateDay = async (updates) => {
    const updated = {...dayLog,...updates};
    setDayLog(updated);
    await ss(`day:${gToday()}`,updated);
    showToast("✓ Salvato");
  };

  const saveSettings = async (s) => { setSettings(s); await ss("settings",s); setShowSetup(false); showToast("Profilo salvato!"); };

  const addBleeding = async () => {
    const entry = {...newB, id:Date.now().toString(), date:gToday(),
      time:new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}),
      week:preg.week, day:preg.day};
    const updated = [entry,...bleeding];
    setBleeding(updated);
    await ss("bleeding",updated);
    setBModal(false); setNewB({});
    showToast("🩸 Episodio registrato");
  };

  if (loading) return <><style>{G}</style><Spinner/></>;
  if (showSetup) return <Setup onSave={saveSettings}/>;

  return (
    <div className="app">
      <style>{G}</style>
      <Header preg={preg} settings={settings}/>
      {toast&&<Toast msg={toast}/>}
      <main style={{padding:"16px 16px 92px"}}>
        {page==="today"&&<TodayPage dayLog={dayLog} updateDay={updateDay} preg={preg}/>}
        {page==="symptoms"&&<SymptomsPage dayLog={dayLog} updateDay={updateDay}/>}
        {page==="nutrition"&&<NutritionPage dayLog={dayLog} updateDay={updateDay}/>}
        {page==="bleeding"&&<BleedingPage bleeding={bleeding} onAdd={()=>{setNewB({});setBModal(true);}}/>}
        {page==="diary"&&<DiaryPage dayLog={dayLog} updateDay={updateDay}/>}
        {page==="report"&&<ReportPage dayLog={dayLog} bleeding={bleeding} preg={preg} settings={settings}/>}
      </main>
      <BNav page={page} setPage={setPage}/>
      {bModal&&<BModal newB={newB} setNewB={setNewB} onClose={()=>setBModal(false)} onSave={addBleeding}/>}
    </div>
  );
}
