/* ==========================================================================
   NeuroEng // Prep OS — Service Worker (Cache-First, 100% offline)
   IMPORTANTE: ao alterar QUALQUER arquivo local, incremente CACHE_VERSION
   para que os dispositivos baixem a versão nova (estratégia cache-first).
   ========================================================================== */
const CACHE_VERSION = "v2";
const CACHE_NAME = "neuroeng-prep-os-" + CACHE_VERSION;
const FONT_CACHE = "neuroeng-fonts-v1";

// Caminhos relativos ao escopo do SW (funciona na raiz ou em subpasta, ex.: GitHub Pages).
const PRECACHE = [
  "./",
  "index.html",
  "manifest.json",
  "css/styles.css",
  "js/data.js",
  "js/store.js",
  "js/audio.js",
  "js/study.js",
  "js/lab.js",
  "js/views.js",
  "js/app.js",
  "icons/icon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          const mine = k.indexOf("neuroeng-prep-os-") === 0 && k !== CACHE_NAME;
          return mine ? caches.delete(k) : null;
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // GitHub API (Cloud Sync via Gist): Network-Only (nunca cachear)
  if (url.hostname === "api.github.com") {
    return;
  }

  // Fontes do Google: stale-while-revalidate (opcionais; o app tem fallback de fontes do SO).
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONT_CACHE).then(function (cache) {
        return cache.match(req).then(function (hit) {
          const net = fetch(req).then(function (res) {
            if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
            return res;
          }).catch(function () { return hit; });
          return hit || net;
        });
      })
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Arquivos locais: CACHE-FIRST (rede só como reserva e para preencher o cache).
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        if (req.mode === "navigate") return caches.match("index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});

