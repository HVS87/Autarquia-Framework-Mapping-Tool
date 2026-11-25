/* QA — Sincronizar dispositivos.
   Corre dentro da página instrumentada (qa/build/qa.html, com window.__F):
     await window.__QA_SINC({rede:true})
   1. código, cifra, compressão, chaves, QR
   2. o motor com uma caixa em memória: receber, juntar, conflitos, apagados,
      ids com marca do aparelho, mensagens duplicadas e perdidas, anexo
      expirado, um terceiro aparelho, um intruso com outra chave
   3. a ligação à página: o projeto real vai e vem, anula-se, espera pelo
      editor fechado, ids com marca, estado no cabeçalho
   4. interface: secção, QR, ligação de emparelhamento, aviso de privacidade
   5. (opcional, {rede:true}) uma troca real pelo ntfy.sh
   Devolve {ok, falhas, errs, tempo}. Repõe o projeto e o armazenamento. */
window.__QA_SINC = async function(opts){
  opts = opts || {};
  const F = window.__F, g = n => F.get(n), run = n => F.run(n);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
  const ok = [], falhas = [], t0 = performance.now(), errs0 = (window.__errs || []).length;
  const t = async (nome, fn) => { try { const v = await fn(); if (v === false) falhas.push(nome); else ok.push(nome); } catch(e){ falhas.push(nome + ": " + (e && e.message || e)); } };
  const esperar = async (cond, ms) => { const fim = Date.now() + (ms || 8000); while (Date.now() < fim){ try { if (await cond()) return true; } catch(e){} await sleep(60); } return false; };
  const clone = o => JSON.parse(JSON.stringify(o));
  const J = run("jsonEstavel");

  /* ---------- armazenamento e projeto: tudo volta como estava ---------- */
  const CHAVES_LS = ["of.sinc.v1", "of.sinc.versoes.v1"];
  const lsAntes = {}; CHAVES_LS.forEach(k => { lsAntes[k] = localStorage.getItem(k); });
  const snap0 = run("snapshotState")();
  const transporteOriginal = run("transporteNtfy");
  if (g("SINC")) run("sincParar")();
  CHAVES_LS.forEach(k => localStorage.removeItem(k));

  try {
  /* ---------- 1. peças soltas ---------- */
  const codigoNovo = run("codigoNovo"), limpar = run("limparCodigo"), valido = run("codigoValido"), formatar = run("formatarCodigo");
  await t("código novo: 25 símbolos em 5 grupos", () => /^([0-9A-Z]{5}-){4}[0-9A-Z]{5}$/.test(codigoNovo()));
  await t("códigos diferentes de cada vez", () => new Set(Array.from({length: 50}, codigoNovo)).size === 50);
  await t("código tolera minúsculas, espaços, O/I/L", () => {
    const c = "0123456789ABCDEFGHJKMNPQR";
    return valido(" 0i23 4s678 9abcd efghj kmnpq r ".replace("s", "5")) && limpar("oil") === "011" && formatar(c) === "01234-56789-ABCDE-FGHJK-MNPQR";
  });
  await t("código inválido recusado", () => !valido("123") && !valido("") && !valido(null));
  const cA = codigoNovo(), cB = codigoNovo();
  const kA1 = await run("sincChaves")(cA), kA2 = await run("sincChaves")(cA), kB = await run("sincChaves")(cB);
  await t("chaves: mesmo código, mesma caixa", () => kA1.topico === kA2.topico && /^fma-[0-9a-f]{32}$/.test(kA1.topico));
  await t("chaves: códigos diferentes, caixas diferentes", () => kA1.topico !== kB.topico);
  const cifrar = run("cifrar"), decifrar = run("decifrar"), comprimir = run("comprimir"), descomprimir = run("descomprimir");
  const texto = J(run("sincEstadoLocal")());
  const pacote = await cifrar(kA1.chave, await comprimir(texto));
  await t("cifra + compressão: ida e volta", async () => (await descomprimir(await decifrar(kA2.chave, pacote))) === texto);
  await t("compressão reduz o projeto", () => pacote.length < new TextEncoder().encode(texto).length / 2);
  await t("cifra: outra chave não abre", async () => { try { await decifrar(kB.chave, pacote); return false; } catch(e){ return true; } });
  await t("cifra: um byte mudado não abre", async () => { const p = pacote.slice(); p[40] ^= 1; try { await decifrar(kA1.chave, p); return false; } catch(e){ return true; } });
  await t("cifra: o texto não aparece em claro", () => { const s = String.fromCharCode.apply(null, pacote.subarray(0, 4000)); return s.indexOf("Executivo") < 0 && s.indexOf("nodes") < 0; });
  await t("QR do código de ligação", () => { const m = run("qrMatriz")("https://hvs87.github.io/Autarquia-Framework-Mapping-Tool/network-framework.html#ligar=" + limpar(cA)); return Array.isArray(m) && m.length >= 21 && m.length <= 57; });
  await t("ligação lida de volta", () => { const r = run("codigoDeTexto")("https://x/y.html#ligar=" + limpar(cA) + "&s=" + encodeURIComponent("https://ntfy.exemplo.pt")); return r && limpar(r.codigo) === limpar(cA) && r.servidor === "https://ntfy.exemplo.pt"; });
  await t("estado: ida e volta pelas peças", () => {
    const L = run("sincEstadoLocal")();
    const s = run("sincParaEstado")(L);
    const orig = JSON.parse(snap0);
    return J(s.nodes) === J(orig.nodes) && J(s.layers) === J(orig.layers) && J(s.agents) === J(orig.agents) && s.theme === orig.theme;
  });
  await t("estado: tarefas são peças à parte", () => {
    const u = run("unidades")(run("sincEstadoLocal")());
    return [...u.keys()].some(k => /^tasks\//.test(k)) && [...u.keys()].some(k => /^layers\//.test(k)) && !J(u.get([...u.keys()].find(k => /^layers\//.test(k)))).includes('"tasks"');
  });
  await t("o tema não viaja", () => !("theme" in run("sincEstadoLocal")()));

  /* ---------- 2. o motor com uma caixa em memória ---------- */
  function caixaFalsa(){
    const cx = {msgs: [], anexos: new Map(), subs: new Set(), seq: 0, duplicar: false, perderProxima: 0};
    const nova = m => { const id = "m" + (++cx.seq); const msg = Object.assign({id, event: "message", time: Date.now()}, m); cx.msgs.push(msg); return msg; };
    const entregar = msg => cx.subs.forEach(s => {
      if (cx.perderProxima > 0){ cx.perderProxima--; return; }
      s(msg); if (cx.duplicar) s(msg);
    });
    cx.transporte = () => ({
      async publicarEstado(bytes, meta){ const msg = nova({message: meta, attachment: {url: ""}}); msg.attachment.url = "mem://" + msg.id; cx.anexos.set(msg.attachment.url, bytes); entregar(msg); return {}; },
      async publicarTexto(meta){ entregar(nova({message: meta})); },
      async desde(desde){ const i = cx.msgs.findIndex(m => m.id === desde); return clone(i >= 0 ? cx.msgs.slice(i + 1) : cx.msgs); },
      async baixar(url){ if (!cx.anexos.has(url)) throw new Error("o anexo expirou"); return cx.anexos.get(url); },
      escutar(desde, aoMsg, aoEstado){ const s = m => setTimeout(() => aoMsg(clone(m)), 1); cx.subs.add(s); aoEstado(true); return () => cx.subs.delete(s); },
    });
    return cx;
  }
  const criarSinc = run("criarSinc");
  function aparelho(nome, estado, cx, chave, receber){
    const d = {nome, estado: clone(estado), meta: {}, versoes: {}, aplicados: 0};
    d.motor = criarSinc({chave, eu: {id: "id-" + nome, nome}, transporte: cx.transporte(),
      ler: () => clone(d.estado),
      aplicar: (M, info) => { d.estado = clone(M); d.aplicados++; if (info.concluir) info.concluir(); },
      vazio: () => !!receber, meta: {ler: () => d.meta, gravar: p => Object.assign(d.meta, p)},
      versoes: {ler: () => d.versoes, gravar: v => { d.versoes = v; }}, atraso: 0, intervaloPedidos: 0});
    d.mudar = fn => { fn(d.estado); d.motor.mudou(); };
    return d;
  }
  const assentar = async (ds, voltas) => { for (let k = 0; k < (voltas || 40); k++){ await sleep(8); await Promise.all(ds.map(d => d.motor._fila())); } };
  const igual = (a, b) => J(a.estado) === J(b.estado);
  const base = run("sincEstadoLocal")();
  const demo = clone(base); demo.orgName = "Projeto de demonstração do telemóvel"; demo.nodes = demo.nodes.slice(0, 5);

  const cx = caixaFalsa();
  const A = aparelho("PC", base, cx, kA1.chave, false);
  const B = aparelho("Telemóvel", demo, cx, kA1.chave, true);
  await A.motor.ligar(); await assentar([A]);
  await B.motor.ligar(); await assentar([A, B]);
  await t("receber: o telemóvel fica com o projeto do PC tal e qual", () => igual(A, B) && B.estado.nodes.length === base.nodes.length && B.estado.orgName === base.orgName);
  await t("receber: o PC não ficou com o projeto de demonstração", () => A.estado.orgName === base.orgName);
  await t("receber: os dois sabem um do outro", () => Object.keys(A.meta.pares || {}).includes("id-Telemóvel") && Object.keys(B.meta.pares || {}).includes("id-PC"));

  A.mudar(e => { e.nodes[1].name = "Divisão mudada no PC"; });
  B.mudar(e => { e.nodes[2].name = "Divisão mudada no telemóvel"; });
  await assentar([A, B]);
  await t("juntar: alterações a peças diferentes ficam as duas", () => igual(A, B) && A.estado.nodes[1].name === "Divisão mudada no PC" && A.estado.nodes[2].name === "Divisão mudada no telemóvel");

  A.mudar(e => { e.nodes[3].name = "Primeiro"; });
  await sleep(15);
  B.mudar(e => { e.nodes[3].name = "Segundo, mais recente"; });
  await assentar([A, B]);
  await t("conflito: na mesma peça ganha a mudança mais recente", () => igual(A, B) && A.estado.nodes[3].name === "Segundo, mais recente");

  const tApagada = A.estado.tasks[0].id;
  A.mudar(e => { e.tasks = e.tasks.filter(x => x.id !== tApagada); });
  await assentar([A, B]);
  B.mudar(e => { e.orgName = "Junta renomeada no telemóvel"; });
  await assentar([A, B]);
  await t("apagar: a tarefa apagada não volta", () => igual(A, B) && !B.estado.tasks.some(x => x.id === tApagada) && A.estado.orgName === "Junta renomeada no telemóvel");

  const tarefaNova = (id, a, b) => ({p: A.estado.layers[0].id, id, a, b, desc: "Tarefa " + id, nome: "", estado: "", link: "", nota: "", agent: null, duration: "1 dia", custom: true, prazoDias: null, ativaDesde: null, validadoPor: null, validadoEm: null});
  const n0 = A.estado.nodes[0].id, n1 = A.estado.nodes[1].id;
  A.mudar(e => { e.tasks.push(tarefaNova("t900_pcpc", n0, n1)); });
  B.mudar(e => { e.tasks.push(tarefaNova("t900_tlmv", n0, n1)); });
  await assentar([A, B]);
  await t("criar em paralelo: ids com marca do aparelho não colidem", () => igual(A, B) && ["t900_pcpc", "t900_tlmv"].every(id => A.estado.tasks.some(x => x.id === id)));

  cx.duplicar = true;
  for (let k = 0; k < 5; k++){ A.mudar(e => { e.nodes[4].name = "Repetido " + k; }); await sleep(3); }
  await assentar([A, B]);
  cx.duplicar = false;
  await t("mensagens repetidas: o resultado não muda", () => igual(A, B) && B.estado.nodes[4].name === "Repetido 4");

  cx.perderProxima = 1;
  A.mudar(e => { e.nodes[5].name = "Mensagem perdida"; });
  await assentar([A, B]);
  await B.motor.agora(true); await assentar([A, B]);
  await t("mensagem perdida: «Sincronizar agora» recupera", () => igual(A, B) && B.estado.nodes[5].name === "Mensagem perdida");

  cx.anexos.clear();          // tudo o que estava na caixa expirou
  const C = aparelho("Tablet", demo, cx, kA1.chave, true);
  await C.motor.ligar(); await assentar([A, B, C], 80);
  await t("anexos expirados: o aparelho novo pede e recebe", () => igual(A, C) && igual(B, C));
  C.mudar(e => { e.groups = e.groups.slice(0, 1); });
  await assentar([A, B, C], 60);
  await t("três aparelhos convergem", () => igual(A, B) && igual(B, C) && A.estado.groups.length === 1);

  const cxIntruso = cx;
  const I = aparelho("Intruso", demo, cxIntruso, kB.chave, true);
  await I.motor.ligar(); await assentar([A, B, C, I], 40);
  await t("outra chave: o intruso não lê nada", () => I.estado.orgName === demo.orgName && I.aplicados === 0);
  await t("outra chave: ninguém é contaminado", () => igual(A, B) && A.estado.orgName !== demo.orgName);
  [A, B, C, I].forEach(d => d.motor.desligar());

  /* ---------- 3. a ligação à página, com uma caixa em memória ---------- */
  const cxP = caixaFalsa();
  F.set("transporteNtfy", () => cxP.transporte());
  const codigoP = codigoNovo();
  const kP = await run("sincChaves")(codigoP);
  run("sincLigarCom")(codigoP, {receber: false});
  await t("página: liga-se", () => esperar(() => g("SINC") && g("SINC").estado.ligado, 6000));
  const R = aparelho("Remoto", demo, cxP, kP.chave, true);
  await R.motor.ligar();
  await t("página → remoto: o projeto chega inteiro", () => esperar(() => R.estado.nodes.length === g("nodes").length && R.estado.orgName === g("orgName"), 12000));
  const nomeAntes = g("nodes")[2].name;
  R.mudar(e => { e.nodes[2].name = "Renomeado no remoto"; e.orgName = "Junta de Freguesia (remoto)"; });
  await t("remoto → página: chega e entra em cena", () => esperar(() => g("nodes")[2].name === "Renomeado no remoto" && g("orgName") === "Junta de Freguesia (remoto)", 12000));
  await t("remoto → página: é um passo que se anula", () => { const r = g("undoRotulos"); return /receber alterações de Remoto/.test(r[r.length - 1] || ""); });
  await t("remoto → página: o nome do nódulo no 3D acompanha", () => g("nodes")[2].name !== nomeAntes);
  const agNovo = run("addAgent")(g("nodes")[3].id, false, null, "Pessoa criada na página");
  run("markDirty")();
  await t("página: ids novos levam a marca do aparelho", () => /^a\d+_[0-9a-z]{1,4}$/.test(agNovo.id));
  await t("página → remoto: a pessoa criada chega", () => esperar(() => R.estado.agents.some(a => a.id === agNovo.id), 12000));
  run("showOrgChart")();
  R.mudar(e => { e.nodes[4].name = "Mudado com o organograma aberto"; });
  await t("editor aberto: a alteração espera", () => esperar(() => g("_sincPendente") !== null, 8000));
  await t("editor aberto: o estado diz «por aplicar»", () => /por aplicar/.test(q("#sincPill").textContent));
  run("closeModalSilent")();
  await t("editor fechado: a alteração entra", () => esperar(() => g("nodes")[4].name === "Mudado com o organograma aberto" && g("_sincPendente") === null, 6000));
  await t("estado no cabeçalho: sincronizado", () => esperar(() => /sincronizado/.test(q("#sincPill").textContent) && !q("#sincPill").hidden, 6000));
  await t("o tema não foi tocado pela sincronização", () => g("themeId") === JSON.parse(snap0).theme);
  run("setTab")("definicoes"); await sleep(80);
  await t("secção ligada: estado, QR, código, botões", () => !!q("#sincRow .sinc-tab") && !!q("#sincRow svg.qr") && run("limparCodigo")(q("#sincRow .codigo-sinc").textContent) === run("limparCodigo")(codigoP) && !!q("#sincAgoraBtn") && !!q("#sincDesligarBtn"));
  await t("secção ligada: mostra o aparelho do outro lado", () => /Remoto/.test(q("#sincRow").textContent));
  R.motor.desligar();
  run("sincParar")();
  localStorage.removeItem("of.sinc.v1"); localStorage.removeItem("of.sinc.versoes.v1");
  run("renderSincRow")(); run("pintarEstadoSinc")();
  await t("desligado: a secção volta ao princípio", () => !!q("#sincCriarBtn") && !!q("#sincCodigo") && q("#sincPill").hidden);
  await t("desligado: ids novos sem marca", () => { const a = run("addAgent")(g("nodes")[3].id, false, null, "Sem marca"); return /^a\d+$/.test(a.id); });
  run("closePage")();

  /* ---------- 4. interface e privacidade ---------- */
  const AVISO1 = "Esta é uma ferramenta gratuita e sem fins lucrativos. Todos os dados são unicamente gravados no seu aparelho/computador (conforme a versão PC ou Mobile); esta aplicação não recolhe nenhuns dados nem analytics.";
  const AVISO2 = "Não há contas, publicidade, cookies de terceiros nem estatísticas de utilização. Se ligar dois dispositivos em «Sincronizar dispositivos», o projeto passa encriptado diretamente de um para o outro, e o serviço que os põe em contacto não o consegue ler.";
  await t("aviso nas boas-vindas, palavra por palavra", () => { const p = qa("#coach .privacidade p").map(x => x.textContent); return p[0] === AVISO1 && p[1] === AVISO2; });
  run("setTab")("definicoes"); await sleep(60);
  await t("aviso no fim das Definições", () => { const ps = qa("#pageBody .privacidade p"); return ps.length === 2 && ps[0].textContent === AVISO1 && ps[1].textContent === AVISO2; });
  await t("aviso é o último bloco das Definições", () => { const sec = q("#pageBody #secDefinicoes .sec-body"); const ult = sec && [...sec.children].filter(e => e.offsetParent !== null).pop(); return ult && ult.classList.contains("privacidade-host"); });
  await t("secção «Sincronizar dispositivos» nas Definições", () => q("#sincTitulo").textContent === "Sincronizar dispositivos" && !!q("#sincRow"));
  F.set("transporteNtfy", () => caixaFalsa().transporte());
  q("#sincCriarBtn").click(); await sleep(150);
  await t("«Criar código» liga e mostra o QR", () => !!run("sincCfg")().codigo && !!q("#sincRow svg.qr") && !run("sincCfg")().receber);
  run("sincParar")(); localStorage.removeItem("of.sinc.v1"); localStorage.removeItem("of.sinc.versoes.v1"); run("renderSincRow")();
  q("#sincCodigo").value = "curto"; q("#sincEntrarBtn").click(); await sleep(50);
  await t("código errado recusado com aviso", () => !run("sincCfg")().codigo);
  q("#sincCodigo").value = codigoNovo(); q("#sincEntrarBtn").click(); await sleep(120);
  await t("código certo pergunta receber ou juntar", () => q("#optDialog").classList.contains("open") && /Receber o projeto/.test(q("#odBtns").textContent) && /Juntar/.test(q("#odBtns").textContent));
  run("fechaOpcoes")("nao"); await sleep(60);
  await t("cancelar não liga", () => !run("sincCfg")().codigo);
  run("closePage")();
  const cL = codigoNovo();
  history.replaceState(null, "", location.pathname + location.search + "#ligar=" + run("limparCodigo")(cL));
  const leu = run("sincLerLigacao")();
  await t("ligação #ligar=: lida e tirada do endereço", () => leu === true && !/ligar=/.test(location.hash));
  await t("ligação #ligar=: pergunta antes de ligar", () => esperar(() => q("#optDialog").classList.contains("open") && /Ligar este aparelho/.test(q("#odTitle").textContent), 3000));
  run("fechaOpcoes")("nao"); await sleep(60);
  await t("paleta: ação «Sincronizar dispositivos»", () => run("buildPaletteItems")().some(x => /Sincronizar dispositivos/.test(x.label)));

  /* ---------- 5. uma troca real pelo ntfy.sh ---------- */
  if (opts.rede){
    F.set("transporteNtfy", transporteOriginal);
    const cR = codigoNovo(), kR = await run("sincChaves")(cR);
    const pequeno = {orgName: "QA " + Date.now(), tiers: [], nodes: [{id: "n1", name: "Um"}], agents: [], layers: [], tasks: [], groups: [], pelouros: [], objetos: [], repositorios: [], alertas: null};
    const real = {transporte: () => transporteOriginal(run("SINC_SERVIDOR"), kR.topico)};
    const X = aparelho("Rede-A", pequeno, real, kR.chave, false);
    const Y = aparelho("Rede-B", Object.assign(clone(pequeno), {orgName: "vazio", nodes: []}), real, kR.chave, true);
    try {
      await X.motor.ligar();
      await esperar(() => X.motor.estado.enviadas > 0, 15000);
      await Y.motor.ligar();
      await t("ntfy.sh real: o estado cifrado chega ao outro aparelho", () => esperar(() => Y.estado.orgName === pequeno.orgName && Y.estado.nodes.length === 1, 25000));
      await t("ntfy.sh real: sem erros de rede", () => !X.motor.estado.erro && !Y.motor.estado.erro);
    } finally { X.motor.desligar(); Y.motor.desligar(); }
  }
  } finally {
    /* tudo como estava */
    try { run("sincParar")(); } catch(e){}
    F.set("transporteNtfy", transporteOriginal);
    try { run("fechaOpcoes")(null); } catch(e){}
    CHAVES_LS.forEach(k => { if (lsAntes[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, lsAntes[k]); });
    try { run("closeModalSilent")(); run("closePage")(); run("clearSelection")(); } catch(e){}
    run("restoreState")(snap0); run("clearDirty")();
    try { run("renderSincRow")(); run("pintarEstadoSinc")(); } catch(e){}
  }
  return {suite: "sinc", ok: ok.length, falhas, errs: (window.__errs || []).slice(errs0), tempo: Math.round(performance.now() - t0) + " ms"};
};
