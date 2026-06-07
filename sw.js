const CACHE = 'satyam-portfolio-v4';
const ASSETS = [
  '/portfolio/',
  '/portfolio/index.html',
  '/portfolio/photo.jpeg',
  '/portfolio/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // delete ALL old caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // network-first: always try network, fallback to cache only when offline
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // update cache with fresh response
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request).then(cached => cached || caches.match('/portfolio/')))
  );
});
