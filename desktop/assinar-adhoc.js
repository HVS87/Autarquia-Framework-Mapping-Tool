/* Mac: assinatura ad-hoc depois de empacotar. Sem certificado de programador
   a aplicação sai sem assinatura, e um Mac com chip Apple recusa abrir código
   sem assinatura nenhuma («está danificada»). A ad-hoc não identifica o autor
   — o Gatekeeper continua a pedir «Abrir» na primeira vez —, mas deixa-a correr. */
"use strict";
const {execFileSync} = require("child_process");
const path = require("path");
exports.default = async function(ctx){
  if (ctx.electronPlatformName !== "darwin") return;
  const app = path.join(ctx.appOutDir, ctx.packager.appInfo.productFilename + ".app");
  execFileSync("codesign", ["--force", "--deep", "--sign", "-", app], {stdio: "inherit"});
  execFileSync("codesign", ["--verify", "--deep", "--strict", "--verbose=2", app], {stdio: "inherit"});
};
