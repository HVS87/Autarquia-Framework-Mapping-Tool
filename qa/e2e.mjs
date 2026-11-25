// QA da aplicação de secretária real (Electron), de ponta a ponta:
//   lança o Electron com a página instrumentada, corre as suites dentro da
//   janela principal, abre o segundo ecrã e verifica-o, mede os frames.
//   uso: node qa/preparar.mjs && node qa/e2e.mjs [--sem-rede]
import fs from "node:fs";
import path from "node:path";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const desktop = path.join(aqui, "..", "desktop");
const electron = createRequire(path.join(desktop, "package.json"))("electron");
const PORTA = +(process.env.QA_PORTA || 9223), rede = !process.argv.includes("--sem-rede");
const sleep = ms => new Promise(r => setTimeout(r, ms));

const proc = spawn(electron, [".", "--remote-debugging-port=" + PORTA, "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows"],
  {cwd: desktop, env: Object.assign({}, process.env, {MAPA_HTML: path.join(aqui, "build", "qa.html")}), stdio: "ignore"});

async function alvo(re, ms){
  const fim = Date.now() + (ms || 20000);
  while (Date.now() < fim){
    try {
      const l = await (await fetch("http://127.0.0.1:" + PORTA + "/json")).json();
      const a = l.find(x => x.type === "page" && re.test(x.url));
      if (a) return a;
    } catch(e){}
    await sleep(300);
  }
  throw new Error("janela não encontrada: " + re);
}
async function ligar(a){
  const ws = new WebSocket(a.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pend = new Map();
  ws.onmessage = ev => { const m = JSON.parse(ev.data); if (m.id && pend.has(m.id)){ pend.get(m.id)(m); pend.delete(m.id); } };
  const cmd = (method, params) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({id: i, method, params})); });
  await cmd("Page.bringToFront", {});
  return {
    async avaliar(expr){
      const r = await cmd("Runtime.evaluate", {expression: expr, awaitPromise: true, returnByValue: true});
      if (r.error) throw new Error("CDP: " + JSON.stringify(r.error).slice(0, 300));
      if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400));
      return r.result.result.value;
    },
    fechar: () => ws.close(),
  };
}
const suite = n => fs.readFileSync(path.join(aqui, "suites", n), "utf8");

let falhou = false;
const relatar = (nome, r) => {
  const f = (r.falhas || []).length + (r.errs || []).length;
  if (f) falhou = true;
  console.log((f ? "✗ " : "✓ ") + nome + ": " + r.ok + " certas" + (r.falhas && r.falhas.length ? " · falhas: " + r.falhas.join(" | ") : "") + (r.errs && r.errs.length ? " · erros: " + r.errs.join(" | ") : ""));
};
try {
  const p = await ligar(await alvo(/qa\.html$/));
  /* a janela pode recarregar uma vez ao arrancar: espera-se que fique de pé */
  for (let k = 0; ; k++){
    try { await p.avaliar("new Promise(r=>{const f=()=>window.__F&&window.__F.get('booted')?r():setTimeout(f,200);f();})"); await sleep(2500);
      await p.avaliar("window.__F.get('booted')"); break; }
    catch(e){ if (k >= 5) throw e; await sleep(1000); }
  }
  console.log("  a correr: aplicação…");
  relatar("aplicação (Electron)", await p.avaliar(suite("qa-app.js") + ";window.__QA_APP()"));
  console.log("  a correr: sincronização…");
  relatar("sincronização (Electron" + (rede ? ", com ntfy.sh real" : "") + ")", await p.avaliar(suite("qa-sinc.js") + ";window.__QA_SINC({rede:" + rede + "})"));
  relatar("esquadria (Electron)", await p.avaliar(suite("qa-varrer.js") + ";window.__QA_VARRER()"));
  /* segundo ecrã */
  await p.avaliar("window.desktop.abrirPalco()");
  const pal = await ligar(await alvo(/qa\.html#palco/));
  await sleep(18000);   // a génese (a organização a nascer) leva até ~16 s
  await p.avaliar("(()=>{const F=window.__F;F.run('selectNode')(F.get('nodes')[6]);F.run('palcoEnviaFoco')(true);})()");
  await sleep(2500);
  const ep = await pal.avaliar(`(async()=>{const F=window.__F,g=n=>F.get(n);const t0=g("uxTick"),p0=performance.now();await new Promise(r=>setTimeout(r,3000));
    return {palco:g("ehPalco"),sinc:g("SINC"),foco:g("foco"),holo:!!g("holo"),fps:+((g("uxTick")-t0)/((performance.now()-p0)/1000)).toFixed(1),errs:window.__errs||[],privacidade:document.querySelectorAll(".privacidade").length};})()`);
  const okPal = ep.palco === true && ep.sinc === null && ep.foco && ep.foco.tipo === "nodulo" && ep.holo && ep.errs.length === 0;
  relatar("segundo ecrã (Electron)", {ok: okPal ? 5 : 0, falhas: okPal ? [] : ["estado do palco: " + JSON.stringify(ep)], errs: []});
  console.log("  palco a " + ep.fps + " fps, sem sincronização própria (só o principal fala com a caixa)");
  const fps = await p.avaliar(`(async()=>{await window.desktop.fecharPalco();await new Promise(r=>setTimeout(r,1500));const fr=[];let l=performance.now();const t0=l;
    await new Promise(res=>{const s=()=>{const n=performance.now();fr.push(n-l);l=n;if(n-t0<5000)requestAnimationFrame(s);else res();};requestAnimationFrame(s);});
    fr.shift();const o=[...fr].sort((a,b)=>a-b);return {fps:+(1000/(fr.reduce((a,b)=>a+b,0)/fr.length)).toFixed(1),p95:+o[Math.floor(o.length*.95)].toFixed(1),acima33:fr.filter(x=>x>33.5).length,n:fr.length,errs:window.__errs};})()`);
  console.log("  janela principal a " + fps.fps + " fps (p95 " + fps.p95 + " ms, " + fps.acima33 + " frames acima de 33 ms em " + fps.n + ")");
  if (fps.errs.length){ falhou = true; console.log("✗ erros na janela principal: " + fps.errs.join(" | ")); }
  pal.fechar(); p.fechar();
} catch(e){
  falhou = true; console.error("✗ " + (e && e.message || e));
} finally {
  proc.kill();
}
process.exit(falhou ? 1 : 0);
