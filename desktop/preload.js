/* A ponte entre a página e o processo principal. Só expõe o que a página
   precisa, com contextIsolation ligado: a página nunca vê o Node. */
"use strict";
const {contextBridge,ipcRenderer,webUtils}=require("electron");

contextBridge.exposeInMainWorld("desktop",{
  ehDesktop:true,
  versao:ipcRenderer.sendSync("versao"),
  ehPalco:ipcRenderer.sendSync("sou-palco"),
  ecras:()=>ipcRenderer.sendSync("ecras"),
  palcoAberto:()=>ipcRenderer.sendSync("palco-aberto"),
  lerAutosave:()=>ipcRenderer.sendSync("autosave-ler"),
  definicoes:()=>ipcRenderer.sendSync("defs-ler"),
  guardarAutosave:json=>ipcRenderer.invoke("autosave-guardar",json),
  abrirPasta:()=>ipcRenderer.invoke("autosave-pasta"),
  definir:(k,v)=>ipcRenderer.invoke("defs-escrever",k,v),
  ecraInteiro:on=>ipcRenderer.invoke("ecra-inteiro",on),
  abrirPalco:()=>ipcRenderer.invoke("palco-abrir"),
  fecharPalco:()=>ipcRenderer.invoke("palco-fechar"),
  palcoEnviar:m=>ipcRenderer.send("palco-msg",m),
  onPalco:cb=>{ipcRenderer.on("palco-msg",(_e,m)=>cb(m));},
  onEcras:cb=>{ipcRenderer.on("ecras-mudaram",(_e,n)=>cb(n));},
  /* ficheiro de trabalho e saída */
  guardar:(json,o)=>ipcRenderer.invoke("ficheiro-guardar",json,o),
  ficheiroAtual:()=>ipcRenderer.sendSync("ficheiro-atual"),
  definirFicheiro:p=>ipcRenderer.send("ficheiro-definir",p),
  caminhoDe:f=>webUtils.getPathForFile(f),
  sair:()=>ipcRenderer.send("sair"),
  onPedirSair:cb=>{ipcRenderer.on("pedir-sair",()=>cb());},
  /* pasta dos autosaves */
  pastaAutosaves:()=>ipcRenderer.sendSync("pasta-autosaves-ler"),
  escolherPasta:()=>ipcRenderer.invoke("pasta-autosaves-escolher")
});
