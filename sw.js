// Service worker mínimo: guarda só a "casca" do app (esta página e os ícones).
// Os dados continuam vindo sempre da planilha, ao vivo.
const CACHE = 'finansovr-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './maskable-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;            // Google/Apps Script: nunca intercepta
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true })
    .then((r) => r || caches.match('./index.html'))));
});
