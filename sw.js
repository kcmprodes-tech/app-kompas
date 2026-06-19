const CACHE_NAME = "app-kompas-v20260619";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./js/01-core.js",
  "./js/02-shell.js",
  "./js/03-comments.js",
  "./js/04-business-epaper.js",
  "./js/05-original.js",
  "./js/06-podcast.js",
  "./js/07-article.js",
  "./js/08-appreciation.js",
  "./js/09-ai-chat.js",
  "./js/10-account-event.js",
  "./js/11-home-router.js",
  "./js/12-extras.js",
  "./js/99-init.js",
  "./manifest.webmanifest",
  "./assets/app-icon-192.png",
  "./assets/app-icon-512.png",
  "./assets/businessinsight.png",
  "./assets/hariankompas.png",
  "./assets/sajiansedap.png",
  "./assets/logo-business-insight.png",
  "./assets/icon-chat.png",
  "./assets/share.svg",
  "./assets/podcast-player-gradient.png",
  "./assets/podcast-cover-morning-brief.png",
  "./assets/podcast-sample.mp3",
  "./assets/kompas-logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("./index.html"))
      )
  );
});
