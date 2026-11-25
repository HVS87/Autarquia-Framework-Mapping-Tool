// Servidor estático para a QA da versão web: serve a raiz do projeto, sem cache.
//   uso: node qa/servir.mjs [porta]   (por omissão 8753)
//   http://127.0.0.1:8753/qa/build/qa.html          a app instrumentada
//   http://127.0.0.1:8753/qa/build/qa.html#palco    o segundo ecrã (web)
//   http://127.0.0.1:8753/qa/build/qa-desktop.html  o .exe simulado
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const raiz = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const porta = +(process.argv[2] || 8753);
const TIPOS = {".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".css": "text/css; charset=utf-8",
  ".webmanifest": "application/manifest+json", ".ico": "image/x-icon"};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const f = path.normalize(path.join(raiz, p));
  if (!f.startsWith(raiz)) { res.writeHead(403); res.end(); return; }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404, {"Content-Type": "text/plain"}); res.end("não encontrado"); return; }
    res.writeHead(200, {"Content-Type": TIPOS[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store"});
    res.end(req.method === "HEAD" ? undefined : buf);
  });
}).listen(porta, "127.0.0.1", () => console.log("A servir " + raiz + " em http://127.0.0.1:" + porta + "/"));
