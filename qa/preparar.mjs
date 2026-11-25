// Gera as páginas instrumentadas para QA, a partir de network-framework.html:
//   qa/build/qa.html          — a app com um gancho de testes (window.__F) e
//                               um coletor de erros (window.__errs)
//   qa/build/qa-desktop.html  — o mesmo, com um window.desktop de faz-de-conta
//                               (a versão .exe simulada num browser)
// A app publicada nunca leva o gancho: só estas cópias, que ficam fora do git.
//   uso: node qa/preparar.mjs
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.join(aqui, "..");
const destino = path.join(aqui, "build");
fs.mkdirSync(destino, {recursive: true});
const html = fs.readFileSync(path.join(raiz, "network-framework.html"), "utf8");

const TRES = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" crossorigin="anonymous"></script>';
if (!html.includes(TRES)) throw new Error("não encontrei o <script> do three.js");
const FECHO = "})();\n})();\n\n</script>";
if (!html.includes(FECHO)) throw new Error("não encontrei o fim do script principal");

const ERROS = `<script>window.__errs=[];addEventListener("error",e=>__errs.push(String(e.message||e)));addEventListener("unhandledrejection",e=>__errs.push(String(e.reason&&e.reason.message||e.reason)));</script>\n`;
// O gancho vive DENTRO do IIFE: eval direto lê e escreve as variáveis da app.
const GANCHO = `window.__F={get:n=>eval(n),set:(n,v)=>{window.__qaV=v;eval(n+"=window.__qaV");},run:n=>eval(n)};\n`;

const STUB = `<script>
(function(){
  /* window.desktop de faz-de-conta: regista as chamadas em __D.log e responde como o .exe */
  var D=window.__D={log:[],defs:{ecraInteiro:true,ecraAuto:null,pastaAutosaves:null,motor:null},autosave:null,palcoAberto:false,
    cbPalco:[],cbEcras:[],cbSair:[],ficheiro:null,plataforma:"win32"};
  window.desktop={ehDesktop:true,versao:"qa",ehPalco:/^#palco/.test(location.hash),plataforma:"win32",
    ecras:function(){D.log.push(["ecras"]);return [{id:1,primario:true},{id:2,primario:false}];},
    palcoAberto:function(){return D.palcoAberto;},
    lerAutosave:function(){D.log.push(["lerAutosave"]);return D.autosave;},
    definicoes:function(){return JSON.parse(JSON.stringify(D.defs));},
    guardarAutosave:function(j){D.log.push(["guardarAutosave",String(j).length]);D.autosave=j;return Promise.resolve(true);},
    abrirPasta:function(){D.log.push(["abrirPasta"]);return Promise.resolve();},
    definir:function(k,v){D.log.push(["definir",k,v]);D.defs[k]=v;return Promise.resolve(true);},
    ecraInteiro:function(on){D.log.push(["ecraInteiro",on]);return Promise.resolve(true);},
    abrirPalco:function(){D.log.push(["abrirPalco"]);D.palcoAberto=true;return Promise.resolve(true);},
    fecharPalco:function(){D.log.push(["fecharPalco"]);D.palcoAberto=false;return Promise.resolve(true);},
    palcoEnviar:function(m){D.log.push(["palcoEnviar",m&&m.t]);},
    onPalco:function(cb){D.cbPalco.push(cb);},
    onEcras:function(cb){D.cbEcras.push(cb);},
    guardar:function(json,o){D.log.push(["guardar",String(json).length,!!(o&&o.como),o&&o.sugestao]);return Promise.resolve({ok:true,nome:"projeto.json",caminho:"C:\\\\qa\\\\projeto.json"});},
    ficheiroAtual:function(){return D.ficheiro;},
    definirFicheiro:function(p){D.log.push(["definirFicheiro",p]);D.ficheiro=p;},
    caminhoDe:function(){return "C:\\\\qa\\\\ficheiro.json";},
    sair:function(){D.log.push(["sair"]);},
    onPedirSair:function(cb){D.cbSair.push(cb);},
    pastaAutosaves:function(){return {atual:"C:\\\\qa\\\\autosaves",omissao:"C:\\\\qa\\\\autosaves"};},
    escolherPasta:function(){D.log.push(["escolherPasta"]);return Promise.resolve("C:\\\\qa\\\\outra");}
  };
})();
</script>
`;

function gerar(nome, comStub){
  let h = html.replace(TRES, ERROS + (comStub ? STUB : "") + TRES);
  h = h.replace(FECHO, "})();\n" + GANCHO + "})();\n\n</script>");
  fs.writeFileSync(path.join(destino, nome), h, "utf8");
  console.log(nome + ": " + h.length + " caracteres");
}
gerar("qa.html", false);
gerar("qa-desktop.html", true);
