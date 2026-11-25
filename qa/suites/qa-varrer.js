/* QA — esquadria no tamanho de ecrã atual (telemóvel, tablet, computador).
   Mudar o tamanho primeiro, recarregar, e depois: await window.__QA_VARRER()
   Em cada página: nada sai do ecrã na horizontal, e em ecrã tátil nenhum
   controlo fica abaixo de 24 px (os interruptores têm um halo de toque). */
window.__QA_VARRER = async function(){
  const F = window.__F, g = n => F.get(n), run = n => F.run(n);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const q = s => document.querySelector(s);
  const ok = [], falhas = [], errs0 = (window.__errs || []).length;
  const t = async (nome, fn) => { try { const v = await fn(); if (v === false) falhas.push(nome); else ok.push(nome); } catch(e){ falhas.push(nome + ": " + (e && e.message || e)); } };
  const W = document.documentElement.clientWidth, tatil = document.body.classList.contains("vp-touch");
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const pb = g("pageBody");
  await t("sem deslocação horizontal da página", () => document.documentElement.scrollWidth <= W + 1);
  for (const tab of ["nodulos", "agentes", "tarefas", "dados", "definicoes", "procedimentos", "pelouros", "objetos", "repositorios"]){
    run("setTab")(tab); await sleep(tab === "tarefas" ? 250 : 60);
    const fora = [...pb.querySelectorAll("*")].filter(vis).filter(e => e.getBoundingClientRect().right > W + 2);
    await t("página " + tab + ": nada sai do ecrã", () => { if (fora.length) throw new Error(fora.slice(0, 3).map(e => (e.id || e.className || e.tagName).toString().slice(0, 30)).join(", ")); return true; });
    if (tatil){
      const peq = [...pb.querySelectorAll("button,input,select,[role=button]")].filter(vis)
        .filter(e => !e.classList.contains("switch") && e.tagName !== "g")
        .filter(e => { const b = e.getBoundingClientRect(); return b.height < 24 || b.width < 24; });
      await t("página " + tab + ": alvos de toque ≥ 24 px", () => { if (peq.length) throw new Error(peq.slice(0, 3).map(e => (e.className || e.tagName).toString().split(" ")[0] + " " + Math.round(e.getBoundingClientRect().width) + "x" + Math.round(e.getBoundingClientRect().height)).join(", ")); return true; });
    }
  }
  run("setTab")("definicoes"); await sleep(60);
  await t("acessibilidade e sincronização cabem", () => [q("#a11yRow"), q("#sincRow")].every(e => e && e.getBoundingClientRect().right <= W + 1));
  run("closePage")();
  const st = q("#stepper");
  await t("cartão da visita cabe", () => !vis(st) || st.getBoundingClientRect().right <= W + 1);
  await t("estado da sincronização no cabeçalho cabe", () => { const p = q("#sincPill"); return p.hidden || p.getBoundingClientRect().right <= W + 1; });
  return {suite: "varrer " + W + "x" + document.documentElement.clientHeight + (tatil ? " tátil" : ""), ok: ok.length, falhas, errs: (window.__errs || []).slice(errs0)};
};
