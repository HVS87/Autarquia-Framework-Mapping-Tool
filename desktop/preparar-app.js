/* Prepara a pasta "app" que vai dentro da aplicação de secretária: copia a
   página e os ícones, descarrega o three.js para funcionar sem internet, e
   aponta a página para essa cópia local. Em Node, para correr igual no
   Windows, no Mac e no Linux. Corre antes do electron-builder. */
"use strict";
const fs = require("fs"), path = require("path");
const raiz = path.join(__dirname, "..");
const app = path.join(__dirname, "app");

(async () => {
  fs.mkdirSync(path.join(app, "vendor"), {recursive: true});
  fs.mkdirSync(path.join(app, "icons"), {recursive: true});
  for (const f of fs.readdirSync(path.join(raiz, "icons")))
    fs.copyFileSync(path.join(raiz, "icons", f), path.join(app, "icons", f));
  fs.mkdirSync(path.join(__dirname, "build"), {recursive: true});
  fs.copyFileSync(path.join(raiz, "icons", "icon-512.png"), path.join(__dirname, "build", "icon.png"));

  let html = fs.readFileSync(path.join(raiz, "network-framework.html"), "utf8");
  /* O three.js vem de um CDN na versão web; na aplicação fica dentro do pacote. */
  const cdn = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  const local = path.join(app, "vendor", "three.min.js");
  if (!fs.existsSync(local)) {
    console.log("A descarregar three.js r128…");
    const r = await fetch(cdn);
    if (!r.ok) throw new Error("three.js: o CDN respondeu " + r.status);
    fs.writeFileSync(local, Buffer.from(await r.arrayBuffer()));
  }
  const tag = '<script src="' + cdn + '" crossorigin="anonymous"></script>';
  if (!html.includes(tag)) throw new Error("Não encontrei o <script> do three.js para apontar à cópia local.");
  html = html.replace(tag, '<script src="vendor/three.min.js"></script>');
  /* O service worker é da versão web (instalação como app); aqui não faz sentido. */
  html = html.replace(/navigator\.serviceWorker\.register\([^)]*\)/, "Promise.resolve()");
  fs.writeFileSync(path.join(app, "network-framework.html"), html, "utf8");
  console.log("Pasta app preparada em " + app);
})().catch(e => { console.error(e.message || e); process.exit(1); });
