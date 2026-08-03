/* ============================================================
   Service worker — "guardar como app"

   Faz duas coisas. Primeira: sem um service worker com um handler de fetch,
   o Chrome nunca oferece a instalação, por muito correcto que o manifesto
   esteja. Segunda, e a que interessa a quem anda no terreno: depois da
   primeira visita a ferramenta abre sem rede — numa junta com internet
   intermitente, isso é a diferença entre servir e não servir.
============================================================ */
const VERSION = "v1";
const SHELL   = "fma-shell-" + VERSION;   // a app em si
const EXTRA   = "fma-extra-" + VERSION;   // bibliotecas externas

/* O essencial para arrancar. Tudo relativo, para funcionar tanto na raiz de
   um domínio como numa subpasta do GitHub Pages. */
const CORE = [
  "./",
  "./index.html",
  "./network-framework.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

/* O Three.js vem de um CDN e é o único recurso sem o qual não há 3D. É
   versionado (r128), por isso guarda-se e nunca mais se pergunta. */
const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    // addAll falha por inteiro se um único pedido falhar; um a um, uma falha
    // isolada (uma pasta de ícones ainda por publicar) não estraga a instalação.
    await Promise.all(CORE.map(u => c.add(u).catch(() => {})));
    try {
      const x = await caches.open(EXTRA);
      await x.add(new Request(THREE_URL, { mode: "cors" }));
    } catch (err) { /* sem rede à primeira; apanha-se no primeiro fetch */ }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keep = [SHELL, EXTRA];
    const names = await caches.keys();
    await Promise.all(names.map(n => keep.includes(n) ? null : caches.delete(n)));
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (err) {}
    }
    await self.clients.claim();
  })());
});

/* A app avisa quando quer passar já para a versão nova */
self.addEventListener("message", e => {
  if (e.data && e.data.type === "skip-waiting") self.skipWaiting();
});

const isThree = url => url.startsWith("https://cdnjs.cloudflare.com/ajax/libs/three.js/");

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  /* Navegações: rede primeiro, para que uma versão nova chegue mal exista;
     cache a seguir, para que a falta de rede não seja o fim. */
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const pre = await e.preloadResponse;
        if (pre) { caches.open(SHELL).then(c => c.put(req, pre.clone())); return pre; }
        const net = await fetch(req);
        caches.open(SHELL).then(c => c.put(req, net.clone()));
        return net;
      } catch (err) {
        return (await caches.match(req)) ||
               (await caches.match("./network-framework.html")) ||
               (await caches.match("./index.html")) ||
               new Response("Sem ligação e sem cópia guardada.", {
                 status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })());
    return;
  }

  /* Three.js: da cache, sempre que lá esteja. É imutável. */
  if (isThree(url.href)) {
    e.respondWith((async () => {
      const hit = await caches.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const net = await fetch(req, { mode: "cors" });
      if (net && net.ok) caches.open(EXTRA).then(c => c.put(req, net.clone()));
      return net;
    })());
    return;
  }

  /* Recursos próprios: responde da cache e actualiza em segundo plano. */
  if (sameOrigin) {
    e.respondWith((async () => {
      const hit = await caches.match(req);
      const net = fetch(req).then(r => {
        if (r && r.ok && r.type === "basic")
          caches.open(SHELL).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => null);
      return hit || (await net) ||
        new Response("", { status: 504 });
    })());
    return;
  }

  /* Resto (jsPDF, PptxGenJS — só usados ao exportar): pela rede, guardando
     o que correr bem, para que uma segunda exportação funcione offline. */
  e.respondWith((async () => {
    try {
      const net = await fetch(req);
      if (net && net.ok) caches.open(EXTRA).then(c => c.put(req, net.clone()));
      return net;
    } catch (err) {
      const hit = await caches.match(req);
      if (hit) return hit;
      throw err;
    }
  })());
});
