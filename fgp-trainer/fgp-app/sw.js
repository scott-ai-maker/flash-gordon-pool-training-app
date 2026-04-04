/* ═══════════════════════════════════════════
   FGP TRAINING — SERVICE WORKER v1.0
   Cache-first strategy. Offline capable.
═══════════════════════════════════════════ */

const CACHE = 'fgp-v12';
const ASSETS = [
  '/fgp-app/',
  '/fgp-app/index.html',
  '/fgp-app/app.js',
  '/fgp-app/manifest.json',
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Inter:wght@400;500&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        if (e.request.headers.get('accept').includes('text/html')) {
          return caches.match('/fgp-app/index.html');
        }
      });
    })
  );
});
