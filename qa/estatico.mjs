// Varrimento estático: sintaxe de cada script, funções e variáveis sem uso,
// funções repetidas, ids duplicados ou em falta, texto estragado (mojibake),
// português do Brasil e grafia de antes do Acordo de 1990.
//   uso: node qa/estatico.mjs     (sai com 1 se encontrar problemas)
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(raiz, "network-framework.html"), "utf8");
const problemas = [], avisos = [];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "fma-qa-"));

/* sintaxe */
const scripts = [...html.matchAll(/<script(?![^>]*src)([^>]*)>([\s\S]*?)<\/script>/g)];
scripts.forEach((m, i) => {
  if (/ld\+json/.test(m[1])) { try { JSON.parse(m[2]); } catch(e){ problemas.push("JSON-LD inválido"); } return; }
  const f = path.join(tmp, "s" + i + ".js"); fs.writeFileSync(f, m[2]);
  try { execFileSync(process.execPath, ["--check", f], {stdio: "pipe"}); } catch(e){ problemas.push("sintaxe no script " + i + ": " + String(e.stderr).split("\n").slice(0, 4).join(" ")); }
});
for (const f of ["sw.js", "desktop/main.js", "desktop/preload.js"]) {
  try { execFileSync(process.execPath, ["--check", path.join(raiz, f)], {stdio: "pipe"}); } catch(e){ problemas.push("sintaxe em " + f); }
}
fs.rmSync(tmp, {recursive: true, force: true});

/* referências, no script principal */
const principal = scripts.map(m => m[2]).sort((a, b) => b.length - a.length)[0];
const esc = s => s.replace(/\$/g, "\\$");
const conta = n => (principal.match(new RegExp("\\b" + esc(n) + "\\b", "g")) || []).length;
const funcoes = [...principal.matchAll(/^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)].map(m => m[1]);
const vistas = new Set();
funcoes.forEach(n => { if (vistas.has(n)) return; vistas.add(n); if (conta(n) < 2) problemas.push("função sem uso: " + n); });
const repetidas = [...new Set(funcoes.filter((n, i) => funcoes.indexOf(n) !== i))].filter(n => n !== "renderResults");   // renderResults: duas funções locais, em sítios diferentes
repetidas.forEach(n => problemas.push("função declarada duas vezes: " + n));
new Set([...principal.matchAll(/^(?:let|const)\s+([A-Za-z_$][\w$]*)\s*[=;,]/gm)].map(m => m[1])).forEach(v => { if (conta(v) < 2) problemas.push("variável sem uso: " + v); });

/* ids */
const ids = [...html.matchAll(/\bid="([^"+$]+)"/g)].map(m => m[1]);
[...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))].forEach(v => problemas.push("id duplicado: " + v));
const criados = new Set([...principal.matchAll(/\.id\s*=\s*"([^"]+)"/g)].map(m => m[1]).concat(["npSvg"]));   // npSvg nasce via svgEl
[...new Set([...principal.matchAll(/getElementById\("([^"]+)"\)/g)].map(m => m[1]))]
  .filter(r => !ids.includes(r) && !criados.has(r)).forEach(r => problemas.push("getElementById de um id que não existe: " + r));

/* texto */
const textos = ["network-framework.html", "README.md", "DEPLOY.md", "desktop/notas-da-versao.md", "sw.js", "desktop/main.js"];
const PTBR = /\b(você|vocês|usuário|usuários|arquivo|arquivos|gerenciar|gerenciamento|deletar|salvar|celular|cadastro|cadastrar|contato|registro|sobrenome|ônibus|equipe|planejamento|planejar|aprimorar|acessar|senha|aplicativo|conosco|bacana|grátis)\b/i;
const PRE90 = /\b(acção|acções|actual\w*|activ[oa]s?|direcção|selecção|projecto\w*|objecto\w*|correct[oa]\w*|exact[oa]\w*|óptim\w*|efectiv\w*|efectua\w*|aspecto\w*|tecto|director\w*|direct[oa]s?|directamente|objectiv\w*|adopt\w*|recepção|concepção|percepção|baptismo|afect\w*|infecção|redacção|espectacul\w*|protecção|lectiv\w*)\b/;
for (const f of textos) {
  const linhas = fs.readFileSync(path.join(raiz, f), "utf8").split("\n");
  linhas.forEach((l, i) => {
    if (/Ã[\x80-\xBF]|â€|Â[\x80-\xBF]/.test(l)) problemas.push(f + ":" + (i + 1) + " texto estragado (mojibake)");
    const a = l.match(PTBR); if (a) problemas.push(f + ":" + (i + 1) + " português do Brasil? «" + a[0] + "»");
    const b = l.match(PRE90); if (b && !/\bactive\b|\.active|actual[A-Z]|correct\b|exact\b|direct\b/.test(b[0])) problemas.push(f + ":" + (i + 1) + " grafia antiga? «" + b[0] + "»");
  });
}
console.log(problemas.length ? problemas.join("\n") : "varrimento estático: limpo (" + scripts.length + " scripts, " + vistas.size + " funções, " + ids.length + " ids, " + textos.length + " ficheiros de texto)");
process.exit(problemas.length ? 1 : 0);
