/* QA — a aplicação inteira, por dentro.
   Corre na página instrumentada (qa/build/qa.html ou qa-desktop.html):
     await window.__QA_APP()
   Núcleo (criar, mover, apagar, navegar, histórico), vistas e páginas,
   governação (pelouros, credenciais, validação e prazos), objetos (árvore,
   arrastar e largar, mapa de caixas, pétalas), repositórios, visita guiada,
   temas e contraste, e — na versão de secretária simulada — o menu Esc, a
   saída, as definições e o segundo ecrã. Repõe o projeto no fim. */
window.__QA_APP = async function(){
  const F = window.__F, g = n => F.get(n), run = n => F.run(n);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
  const click = el => { if (!el) throw new Error("sem elemento"); el.dispatchEvent(new MouseEvent("click", {bubbles: true, cancelable: true})); };
  const ok = [], falhas = [], t0 = performance.now(), errs0 = (window.__errs || []).length;
  const t = async (nome, fn) => { try { const v = await fn(); if (v === false) falhas.push(nome); else ok.push(nome); } catch(e){ falhas.push(nome + ": " + (e && e.message || e)); } };
  const snap0 = run("snapshotState")();
  const lsAntes = {}; ["of.visita.v1", "of.perfil.v1", "of.a11y.cores.v1", "of.a11y.movimento.v1", "of.a11y.foco.v1", "of.a11y.temaAnterior"].forEach(k => { lsAntes[k] = localStorage.getItem(k); });
  /* animação à mão: num separador escondido o requestAnimationFrame não corre */
  const clock = g("clock"), gd = clock.getDelta, raf = window.requestAnimationFrame, an = run("animate");
  clock.getDelta = () => 0.016; window.requestAnimationFrame = () => 0;
  const passos = n => { for (let k = 0; k < n; k++) an(); };
  try {
    const ns = g("nodes");
    await t("arranque limpo", () => g("booted") && ns.length > 0 && (window.__errs || []).length === 0);
    /* ---- núcleo ---- */
    const novo = run("createNode")({name: "QA Unidade", tier: 2, parent: ns[1].id});
    const ag = run("addAgent")(novo.id, false, g("CATEGORIES")[0], "QA Pessoa");
    const proc = run("createLayer")("QA Procedimento"), pi = g("processes").indexOf(proc);
    const tk = run("createTask")(pi, ns[0].id, ns[1].id, "QA tarefa", ag.id, "2 dias");
    await t("criar nódulo, pessoa, procedimento, tarefa", () => g("nodes").includes(novo) && g("agents").includes(ag) && proc.tasks.includes(tk));
    run("changeNodeTier")(novo, 3); run("moveAgentToNode")(ag, ns[2].id); run("moveTaskToLayer")(tk, 0); run("moveTaskToLayer")(tk, pi);
    await t("mover nível, pessoa, tarefa", () => novo.tier === 3 && ag.nodeId === ns[2].id && proc.tasks.includes(tk));
    run("selectNode")(novo); run("selectAgent")(ag); run("selectTask")(tk); run("goBack")(); run("goForward")();
    await t("navegar (seleção, voltar, avançar)", () => g("selected") && g("selected").type === "task");
    run("clearSelection")();
    run("showFlowchart")(proc); click(q("#modalBody .fc-box.task"));
    await t("fluxograma e editor lateral", () => g("fcSel") === tk); run("closeModalSilent")();
    run("selectNode")(novo);
    await t("fluxograma fechado já não manda no segundo ecrã", () => { const c = run("contextoEdicao")(); return c && c.tipo === "nodulo" && c.id === novo.id; });
    run("clearSelection")();
    run("showFeynman")(proc); await t("diagrama de interações", () => !!q("#modalBody svg")); run("closeModalSilent")();
    run("showOrgChart")(); await t("organograma", () => g("modalBody").innerHTML.length > 500); run("closeModalSilent")();
    for (const v of ["matrix", "sankey", "mural", "metro", "oficial", "municipe"]){ run("showView")(v); await t("vista " + v, () => g("modalBody").children.length > 0); }
    run("closeModalSilent")();
    for (const tab of ["nodulos", "agentes", "tarefas", "dados", "definicoes", "procedimentos", "pelouros", "objetos", "repositorios"]){
      run("setTab")(tab); await sleep(20);
      await t("página " + tab, () => document.body.classList.contains("page-open") && g("pageBody").textContent.trim().length > 20);
    }
    run("closePage")();
    await t("paleta de comandos", () => run("buildPaletteItems")().length > 20);
    await t("temas (5)", () => { const ids = Object.keys(g("THEMES")); ids.forEach(id => run("applyTheme")(id)); run("applyTheme")(JSON.parse(snap0).theme); return ids.length === 5; });
    await t("níveis de desempenho", () => { run("defineDesempenho")("leve"); const a = g("nivel") === 2; run("defineDesempenho")("auto"); return a; });
    await t("anular e refazer", () => {
      const n0 = g("nodes").length; run("recordHistory")("qa"); run("createNode")({name: "QA Anular", tier: 2, parent: ns[0].id}); run("recordHistory")("qa2");
      run("undoAction")(); const u = g("nodes").length; run("redoAction")(); return u === n0 && g("nodes").length === n0 + 1;
    });
    await t("guardar e repor o estado", () => { const s = run("snapshotState")(); return run("restoreState")(s) && run("snapshotState")() === s; });
    await t("visita: terminar e retomar", () => {
      click(q("#endTourBtn")); const a = document.body.classList.contains("visita-terminada");
      run("retomaVisita")(); const b = !document.body.classList.contains("visita-terminada") && g("sceneIdx") === 0;
      F.set("autoplay", false); run("syncPlay")(); return a && b;
    });
    /* ---- governação ---- */
    const pres = run("presidente")();
    run("setTab")("pelouros"); await sleep(20);
    click(qa("#pelouroList button").find(b => /Sugerir/.test(b.textContent)));
    await t("pelouros sugeridos com responsável do Executivo", () => g("pelouros").length > 0 && g("pelouros").every(p => p.resp === pres.id));
    const pl = g("pelouros")[0], raiz = g("byId")(pl.nodes[0]), filho = g("nodes").find(n => n.parent === raiz.id);
    await t("pelouro: herança e destacar", () => {
      const a = run("pelouroDe")(filho.id) === pl; run("destacaNodulo")(filho, g("pelouros")[1] || pl);
      run("destacaNodulo")(filho, null); return a && run("pelouroDe")(filho.id) === pl;
    });
    const chefe = g("agents").find(a => a.primary && g("byId")(a.nodeId).tier === 2);
    const sub = g("agents").find(a => !a.primary && a.nodeId === chefe.nodeId) || run("addAgent")(chefe.nodeId, false, null, "QA Sub");
    chefe.cred = 3; F.set("perfil", {tipo: "agente", id: chefe.id});
    await t("credenciais: chefia precisa de permissão e não passa a sua", () => {
      const a = !run("podeAlterarCred")(sub); chefe.podeCredSub = true;
      return a && run("podeAlterarCred")(sub) && !run("podeAlterarCred")(chefe) && run("credMaxAtribuivel")() === 3;
    });
    F.set("perfil", {tipo: "agente", id: pres.id});
    await t("credenciais: presidente altera todas", () => run("podeAlterarCred")(chefe) && run("credMaxAtribuivel")() === 5);
    F.set("perfil", {tipo: "admin", id: null});
    const p0 = g("processes")[0], t1 = p0.tasks[0];
    run("atualizaAtivas")(); t1.prazoDias = 5; t1.ativaDesde = run("somaDias")(run("hojeISO")(), -6);
    await t("tarefa em atraso: alerta vermelho com destinatários", () => { const a = run("alertaTarefa")(p0, t1); return a && a.nivel === "vermelho" && a.dest.length >= 1; });
    await t("validar faz o procedimento prosseguir", () => { run("validarTarefa")(p0, t1); return t1.estado === "validado"; });
    /* ---- objetos ---- */
    const o1 = run("criaObjeto")("Armazém QA"), o2 = run("criaObjeto")("Carrinha QA"), o3 = run("criaObjeto")("Chaves QA");
    run("depositaObjeto")(o2, o1); run("depositaObjeto")(o3, o2);
    await t("objetos: hierarquia e ciclos recusados", () => run("filhosDe")(o1).includes(o2) && run("depositaObjeto")(o1, o3) === false);
    run("setTab")("objetos"); await sleep(20);
    await t("objetos: árvore com caixas de 4 pétalas", () => qa("#objetoList .obj-tree-row").length >= 3 && qa("#objetoList .obj-tree-row")[0].querySelectorAll(".caixa .tampa").length === 4);
    const rows = qa("#objetoList .obj-tree-row");
    const de = rows.find(r => r.dataset.oid === o3.id), para = rows.find(r => r.dataset.oid === o1.id);
    de.dispatchEvent(new DragEvent("dragstart", {bubbles: true, dataTransfer: new DataTransfer()}));
    para.dispatchEvent(new DragEvent("dragover", {bubbles: true, cancelable: true, dataTransfer: new DataTransfer()}));
    await t("arrastar: a caixa de destino abre", () => para.classList.contains("caixa-aberta"));
    para.dispatchEvent(new DragEvent("drop", {bubbles: true, cancelable: true, dataTransfer: new DataTransfer()}));
    await t("largar: fica lá dentro", () => o3.loc.objId === o1.id);
    await sleep(400);
    click(qa("#objetoList .layer-pick button").find(b => /Mapa/.test(b.textContent))); passos(5);
    const c1 = run("objCubo")(o1);
    await t("mapa 3D: caixas baixas, organização escondida", () => g("objMapaAtivo") && c1 && g("nodeGroup").visible === false);
    await t("mapa 3D: a tampa abre em flor e fecha", () => {
      run("caixaAbre")(o1); passos(80); const p = c1.petalas.geometry.attributes.position.array; const aberta = c1.abre > 0.9 && p[7] > c1.lado * 0.225 + 0.2;
      run("caixaAbre")(null); passos(90); return aberta && c1.abre < 0.05;
    });
    run("setTab")("objetos"); passos(3);
    await t("lista repõe a organização", () => !g("objMapaAtivo") && g("nodeGroup").visible);
    run("selectObjeto")(o2); await sleep(20);
    await t("ficha do objeto", () => /Categoria/.test(g("detail").textContent) && /Valores/.test(g("detail").textContent));
    /* ---- repositórios ---- */
    const r1 = run("criaRepositorio")("ata", [{tipo: "procedimento", id: p0.id}]);
    const r2 = run("criaRepositorio")("documento", [{tipo: "tarefa", id: t1.id}]); r2.cred = 5;
    run("selectTask")(t1); await sleep(20);
    await t("repositório no painel da tarefa", () => qa("#detail .repo-row").length >= 1);
    F.set("perfil", {tipo: "agente", id: sub.id}); sub.cred = 2;
    await t("repositório restrito por credencial", () => !run("podeAcederRepo")(r2) && run("podeAcederRepo")(r1));
    F.set("perfil", {tipo: "admin", id: null});
    await t("estado guardado leva os extras", () => { const s = JSON.parse(run("snapshotState")()); return s.extras.objetos.length >= 3 && s.extras.repositorios.length >= 2 && s.extras.pelouros.length >= 1; });
    run("clearSelection")(); run("closePage")();
    /* ---- acessibilidade ---- */
    run("setTab")("definicoes"); await sleep(30);
    await t("acessibilidade: secção com cores, contraste, movimento, teclado", () => !!q("#a11yTitulo") && qa("#cvdRow button").length === 4 && !!q("#a11yContrasteBtn") && qa("#movRow button").length === 3 && !!q("#a11yFoco"));
    const LC = g("LAYER_COLORS"), PAL = g("CVD_PALETAS"), proc0 = g("processes")[0], cor0 = proc0.corBase;
    for (const modo of ["vermelhoverde", "azulamarelo", "mono"]){
      click(q('#cvdRow button[data-cvd="' + modo + '"]')); passos(2);
      await t("daltonismo " + modo + ": procedimentos e divisões mudam", () => proc0.color === PAL[modo].proc[LC.indexOf(cor0) % PAL[modo].proc.length] && g("PRIMARY_GRADS") === PAL[modo].prim && q('#cvdRow button[data-cvd="' + modo + '"]').classList.contains("sel"));
      await t("daltonismo " + modo + ": o projeto guarda as cores de origem", () => JSON.parse(run("snapshotState")()).layers[0].color === cor0 && run("sincEstadoLocal")().layers[0].color === cor0);
    }
    await t("daltonismo: cores dos procedimentos distinguem-se (mono por luminosidade)", () => {
      const lumH = c => { const r = (c >> 16) & 255, gg = (c >> 8) & 255, b = c & 255; return 0.2126 * r + 0.7152 * gg + 0.0722 * b; };
      const ls = PAL.mono.proc.slice(0, 8).map(lumH).sort((a, b) => a - b);
      return ls.every((v, i) => i === 0 || v - ls[i - 1] >= 8);
    });
    click(q('#cvdRow button[data-cvd="normal"]')); passos(2);
    await t("daltonismo: voltar ao normal repõe as cores", () => proc0.color === cor0 && localStorage.getItem("of.a11y.cores.v1") === null);
    q("#a11yFoco").checked = true; q("#a11yFoco").dispatchEvent(new Event("change"));
    await t("foco do teclado reforçado", () => document.body.classList.contains("foco-forte"));
    q("#a11yFoco").checked = false; q("#a11yFoco").dispatchEvent(new Event("change"));
    click(qa("#movRow button").find(b => /Reduzido/.test(b.textContent)));
    await t("movimento reduzido à mão", () => document.body.classList.contains("movimento-reduzido") && localStorage.getItem("of.a11y.movimento.v1") === "reduzido");
    click(qa("#movRow button").find(b => /sistema/.test(b.textContent)));
    await t("movimento como o sistema", () => !document.body.classList.contains("movimento-reduzido"));
    const temaAntes = g("themeId"); click(q("#a11yContrasteBtn"));
    await t("contraste: liga o tema Alto Contraste e volta", () => { const a = g("themeId") === "contraste"; click(q("#a11yContrasteBtn")); return a && g("themeId") === temaAntes; });
    run("closePage")();
    /* ---- contraste nos cinco temas ---- */
    const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", {willReadFrequently: true});
    const solid = (fg, bg) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = bg || "#000"; cx.fillRect(0, 0, 1, 1); cx.fillStyle = fg; cx.fillRect(0, 0, 1, 1); return [...cx.getImageData(0, 0, 1, 1).data].slice(0, 3); };
    const lum = c => c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
    const bgDe = e => { let p = e, acc = null; while (p){ const c = getComputedStyle(p).backgroundColor; const m = c.match(/[\d.]+/g); if (m && (m.length < 4 || +m[3] > 0)){ acc = acc ? "rgb(" + solid(acc, c).join(",") + ")" : c; if (m.length < 4 || +m[3] >= 0.95) break; } p = p.parentElement; } return acc || "rgb(255,255,255)"; };
    const amostras = {definicoes: [".foot-note", ".mini-title", ".privacidade p", ".btn", ".btn.primary", ".sinc-passo .mini-sub", ".search-input"], tarefas: [".chip", ".t-desc"], objetos: [".obj-num", ".obj-row .row-name"], repositorios: [".repo-tipo", ".repo-row .row-name"]};
    for (const id of Object.keys(g("THEMES"))){
      run("applyTheme")(id); const maus = [];
      for (const [tab, sels] of Object.entries(amostras)){
        run("setTab")(tab); await sleep(30);
        for (const s of sels){ const e = g("pageBody").querySelector(s); if (!e) continue; const cs = getComputedStyle(e); const r = ratio(solid(cs.color, "#000"), solid(bgDe(e), "#000")); const grande = parseFloat(cs.fontSize) >= 18 || (parseFloat(cs.fontSize) >= 14 && +cs.fontWeight >= 700); if (r < (grande ? 3 : 4.5)) maus.push(tab + " " + s + "=" + r.toFixed(2)); }
      }
      run("closePage")();
      for (const s of ["#coach .privacidade p", "#stepper .caption", "#stepper h3"]){ const e = q(s); if (!e) continue; const cs = getComputedStyle(e); const r = ratio(solid(cs.color, "#000"), solid(bgDe(e), "#000")); if (r < 4.5 && getComputedStyle(q("#coach")).display !== "none") maus.push(s + "=" + r.toFixed(2)); }
      await t("contraste no tema " + id, () => { if (maus.length) throw new Error(maus.join(", ")); return true; });
    }
    run("applyTheme")(JSON.parse(snap0).theme);
    /* ---- versão de secretária simulada ---- */
    if (window.__D){
      const D = window.__D, Js = x => JSON.stringify(x);
      try { run("fechaOpcoes")(null); } catch(e){}
      document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true})); await sleep(150);
      await t(".exe: menu Esc com 5 opções", () => qa("#odBtns button").map(b => b.textContent).join("|") === "Voltar|Guardar…|Guardar como…|Definições|Sair");
      click(qa("#odBtns button").find(b => /^Guardar…/.test(b.textContent))); await sleep(200);
      await t(".exe: Guardar", () => D.log.some(l => /^\["guardar"/.test(Js(l))));
      run("markDirty")(); document.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true})); await sleep(120);
      click(qa("#odBtns button").find(b => /^Sair$/.test(b.textContent))); await sleep(200);
      await t(".exe: sair com alterações pergunta", () => /Sair sem guardar/.test(q("#optDialog").textContent));
      click(qa("#odBtns button").find(b => /mesmo assim/.test(b.textContent))); await sleep(150);
      await t(".exe: Sair mesmo assim", () => D.log.some(l => /sair/.test(Js(l)))); run("clearDirty")();
      run("setTab")("definicoes"); await sleep(150);
      await t(".exe: definições (pasta, motor, perfil, visita, sincronizar)", () => !!q("#pastaAlterarBtn") && qa("#motorRow button").length === 4 && !!q("#perfilRow select") && !!q("#visitaRow button") && !!q("#sincRow"));
      run("closePage")();
      D.cbPalco.forEach(f => f({t: "ola"})); await sleep(120);
      await t(".exe: palco aberto, o principal cede", () => g("palcoVivo") === true && run("ritmoPasso")() >= 3);
      D.cbPalco.forEach(f => f({t: "adeus"})); await sleep(40);
      await t(".exe: palco fechado", () => g("palcoVivo") === false);
    }
  } finally {
    clock.getDelta = gd; window.requestAnimationFrame = raf;
    try { run("fechaOpcoes")(null); run("closeModalSilent")(); run("closePage")(); run("clearSelection")(); } catch(e){}
    Object.keys(lsAntes).forEach(k => { if (lsAntes[k] === null) localStorage.removeItem(k); else localStorage.setItem(k, lsAntes[k]); });
    F.set("perfil", {tipo: "admin", id: null});
    run("restoreState")(snap0); run("clearDirty")();
  }
  return {suite: "app", ok: ok.length, falhas, errs: (window.__errs || []).slice(errs0), tempo: Math.round(performance.now() - t0) + " ms"};
};
