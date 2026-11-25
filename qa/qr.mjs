// O código QR da página, lido por um leitor independente (jsQR): se o leitor
// não o decifra, uma câmara também não. Corre em Node, fora da página.
//   uso: node qa/qr.mjs   (precisa de "npm ci" em desktop/, que traz o jsqr)
import fs from "node:fs";
import path from "node:path";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(aqui, "..", "desktop", "package.json"));
const jsQR = require("jsqr");
const html = fs.readFileSync(path.join(aqui, "..", "network-framework.html"), "utf8");
const i = html.indexOf("/* QR-INICIO */"), j = html.indexOf("/* QR-FIM */");
if (i < 0 || j < 0) { console.error("QR: não encontrei o codificador na página"); process.exit(1); }
const qrMatriz = new Function(html.slice(i, j) + "; return qrMatriz;")();

const PAG = "https://hvs87.github.io/Autarquia-Framework-Mapping-Tool/network-framework.html";
const casos = ["A", PAG + "#ligar=0123456789ABCDEFGHJKMNPQR",
  PAG + "#ligar=0123456789ABCDEFGHJKMNPQR&s=" + encodeURIComponent("https://ntfy.exemplo.pt"),
  "file:///C:/Program%20Files/Mapeamento/network-framework.html#ligar=ZZZZZYYYYYXXXXXWWWWWVVVVV"];
for (let n = 1; n <= 213; n += 4) casos.push(Array.from({length: n}, (_, k) => "abcXYZ09-_#&=/çã€"[k % 17]).join(""));

let falhas = 0, total = 0;
const versoes = new Set();
for (const t of casos) {
  if (new TextEncoder().encode(t).length > 213) continue;
  total++;
  const m = qrMatriz(t);
  versoes.add((m.length - 17) / 4);
  for (const escala of [3, 6]) {
    const q = 4, N = (m.length + 2 * q) * escala;
    const d = new Uint8ClampedArray(N * N * 4).fill(255);
    m.forEach((l, y) => l.forEach((c, x) => {
      if (!c) return;
      for (let a = 0; a < escala; a++) for (let b = 0; b < escala; b++) {
        const p = (((y + q) * escala + a) * N + (x + q) * escala + b) * 4;
        d[p] = d[p + 1] = d[p + 2] = 0;
      }
    }));
    const r = jsQR(d, N, N);
    if (!r || r.data !== t) { falhas++; console.log("QR falhou:", t.length, "bytes, versão", (m.length - 17) / 4, "escala", escala); }
  }
}
console.log("QR: " + (total * 2 - falhas) + "/" + total * 2 + " leituras certas, versões " + Array.from(versoes).sort((a, b) => a - b).join(","));
process.exit(falhas ? 1 : 0);
