/* Processo principal da aplicação de secretária (Electron).
   Responsabilidades: a janela principal (ecrã inteiro por omissão), o palco
   no segundo monitor (já em ecrã inteiro, sem arrastar nem clicar), a pasta
   local de autosaves, as definições persistidas, e o correio entre as duas
   janelas — no .exe cada janela file:// é uma origem opaca, por isso o
   BroadcastChannel da versão web não as liga; o IPC daqui faz esse papel. */
"use strict";
const {app,BrowserWindow,ipcMain,screen,shell}=require("electron");
const fs=require("fs");
const path=require("path");

/* ---------- onde vivem os dados ----------
   Em desenvolvimento (electron .) é a raiz do projeto. Empacotado, é a pasta
   do executável (versão portátil, tudo ao lado do .exe); se essa pasta for
   só de leitura (instalado em Program Files), cai-se nos dados do
   utilizador. A pasta "autosaves" nasce lá dentro. */
function pastaBase(){
  if(!app.isPackaged)return path.join(__dirname,"..");
  const exeDir=path.dirname(app.getPath("exe"));
  try{fs.accessSync(exeDir,fs.constants.W_OK);return exeDir;}
  catch(e){return app.getPath("userData");}
}
const BASE=pastaBase();
const PASTA_AUTOSAVES=path.join(BASE,"autosaves");
const FICHEIRO_DEFS=path.join(BASE,"definicoes.json");
const HTML=app.isPackaged
  ?path.join(app.getAppPath(),"app","network-framework.html")
  :path.join(__dirname,"..","network-framework.html");

function garantePasta(){try{fs.mkdirSync(PASTA_AUTOSAVES,{recursive:true});}catch(e){}}

/* ---------- definições ---------- */
const DEFS_OMISSAO={ecraInteiro:true,ecraAuto:null};
function lerDefs(){
  try{
    const d=JSON.parse(fs.readFileSync(FICHEIRO_DEFS,"utf8"));
    return Object.assign({},DEFS_OMISSAO,(d&&typeof d==="object")?d:{});
  }catch(e){return Object.assign({},DEFS_OMISSAO);}
}
function escreveDefs(d){
  try{garantePasta();fs.writeFileSync(FICHEIRO_DEFS,JSON.stringify(d,null,2),"utf8");}catch(e){}
}

/* ---------- autosaves ----------
   "autosave.json" é sempre o último estado; de 30 em 30 minutos fica também
   uma cópia datada, e guardam-se as últimas 40. */
let ultimaCopiaDatada=0;
function guardaAutosave(json){
  if(typeof json!=="string"||!json)return false;
  garantePasta();
  try{
    fs.writeFileSync(path.join(PASTA_AUTOSAVES,"autosave.json"),json,"utf8");
    const agora=Date.now();
    if(agora-ultimaCopiaDatada>30*60*1000){
      const d=new Date(agora);
      const carimbo=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+
        "_"+String(d.getHours()).padStart(2,"0")+"-"+String(d.getMinutes()).padStart(2,"0");
      fs.writeFileSync(path.join(PASTA_AUTOSAVES,"autosave-"+carimbo+".json"),json,"utf8");
      ultimaCopiaDatada=agora;
      const datados=fs.readdirSync(PASTA_AUTOSAVES).filter(f=>/^autosave-.*\.json$/.test(f)).sort();
      while(datados.length>40){const velho=datados.shift();try{fs.unlinkSync(path.join(PASTA_AUTOSAVES,velho));}catch(e){}}
    }
    return true;
  }catch(e){return false;}
}
function leAutosave(){
  try{return fs.readFileSync(path.join(PASTA_AUTOSAVES,"autosave.json"),"utf8");}
  catch(e){return null;}
}

/* ---------- janelas ---------- */
let janelaPrincipal=null,janelaPalco=null;
const prefs={preload:path.join(__dirname,"preload.js"),contextIsolation:true,nodeIntegration:false,sandbox:false};

function criaPrincipal(){
  const d=lerDefs();
  janelaPrincipal=new BrowserWindow({
    width:1400,height:900,minWidth:900,minHeight:600,
    fullscreen:d.ecraInteiro!==false,
    autoHideMenuBar:true,
    backgroundColor:"#04070E",
    title:"Ferramenta de Mapeamento para Autarquias",
    webPreferences:prefs
  });
  janelaPrincipal.setMenuBarVisibility(false);
  janelaPrincipal.loadFile(HTML);
  janelaPrincipal.on("closed",()=>{janelaPrincipal=null;if(janelaPalco)janelaPalco.close();});
}
function ecraDoPalco(){
  const todos=screen.getAllDisplays();
  if(todos.length<2||!janelaPrincipal)return null;
  const principal=screen.getDisplayMatching(janelaPrincipal.getBounds());
  return todos.find(e=>e.id!==principal.id)||null;
}
function abrePalco(){
  if(janelaPalco&&!janelaPalco.isDestroyed()){janelaPalco.focus();return {ok:true,doisEcras:screen.getAllDisplays().length>1};}
  const alvo=ecraDoPalco();
  const opts=alvo
    ?{x:alvo.bounds.x,y:alvo.bounds.y,width:alvo.bounds.width,height:alvo.bounds.height,fullscreen:true}
    :{width:1100,height:700,fullscreen:false};
  janelaPalco=new BrowserWindow(Object.assign({
    autoHideMenuBar:true,backgroundColor:"#04070E",
    title:"Palco — Ferramenta de Mapeamento para Autarquias",
    webPreferences:prefs
  },opts));
  janelaPalco.setMenuBarVisibility(false);
  janelaPalco.loadFile(HTML,{hash:"palco"});
  janelaPalco.on("closed",()=>{
    janelaPalco=null;
    if(janelaPrincipal&&!janelaPrincipal.isDestroyed())janelaPrincipal.webContents.send("palco-msg",{t:"adeus"});
  });
  return {ok:true,doisEcras:!!alvo};
}
function fechaPalco(){if(janelaPalco&&!janelaPalco.isDestroyed())janelaPalco.close();}

/* ---------- IPC ---------- */
ipcMain.on("versao",e=>{e.returnValue=app.getVersion();});
ipcMain.on("ecras",e=>{
  e.returnValue=screen.getAllDisplays().map(d=>({id:d.id,bounds:d.bounds,primary:d.id===screen.getPrimaryDisplay().id}));
});
ipcMain.on("sou-palco",e=>{e.returnValue=!!(janelaPalco&&!janelaPalco.isDestroyed()&&e.sender===janelaPalco.webContents);});
ipcMain.on("palco-aberto",e=>{e.returnValue=!!(janelaPalco&&!janelaPalco.isDestroyed());});
ipcMain.on("autosave-ler",e=>{e.returnValue=leAutosave();});
ipcMain.on("defs-ler",e=>{e.returnValue=lerDefs();});
ipcMain.handle("autosave-guardar",(e,json)=>guardaAutosave(json));
ipcMain.handle("autosave-pasta",()=>{garantePasta();return shell.openPath(PASTA_AUTOSAVES);});
ipcMain.handle("defs-escrever",(e,k,v)=>{
  if(typeof k!=="string"||!(k in DEFS_OMISSAO))return false;
  const d=lerDefs();d[k]=v;escreveDefs(d);return true;
});
ipcMain.handle("ecra-inteiro",(e,on)=>{
  const w=BrowserWindow.fromWebContents(e.sender);
  if(!w)return false;
  const alvo=(typeof on==="boolean")?on:!w.isFullScreen();
  w.setFullScreen(alvo);
  return alvo;
});
ipcMain.handle("palco-abrir",()=>abrePalco());
ipcMain.handle("palco-fechar",()=>{fechaPalco();return true;});
/* correio entre janelas: o que uma envia chega a todas as outras */
ipcMain.on("palco-msg",(e,m)=>{
  BrowserWindow.getAllWindows().forEach(w=>{
    if(!w.isDestroyed()&&w.webContents!==e.sender)w.webContents.send("palco-msg",m);
  });
});

/* ---------- ciclo de vida ---------- */
if(!app.requestSingleInstanceLock()){app.quit();}
else{
  app.on("second-instance",()=>{if(janelaPrincipal){if(janelaPrincipal.isMinimized())janelaPrincipal.restore();janelaPrincipal.focus();}});
  app.whenReady().then(()=>{
    garantePasta();
    criaPrincipal();
    const avisaEcras=()=>{
      if(janelaPrincipal&&!janelaPrincipal.isDestroyed())
        janelaPrincipal.webContents.send("ecras-mudaram",screen.getAllDisplays().length);
    };
    screen.on("display-added",avisaEcras);
    screen.on("display-removed",()=>{
      /* o monitor do palco foi-se: o palco vai com ele, e o principal fica a saber */
      if(janelaPalco&&!janelaPalco.isDestroyed()&&screen.getAllDisplays().length<2)fechaPalco();
      avisaEcras();
    });
    app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)criaPrincipal();});
  });
  app.on("window-all-closed",()=>{app.quit();});
}
