const CACHE = 'satyam-portfolio-v7';
const scope = self.registration.scope;
const assets = ['./', 'index.html', 'blog.html', 'photo.jpeg?v=3e246dc63a', 'icon-192.png?v=cf686446a2', 'icon-512.png?v=a8b7995ba4', 'manifest.json', 'e936c80468e9d92.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(assets.map(path => new Request(new URL(path, scope), { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('satyam-portfolio-') && key !== CACHE)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(scope)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const navigation = request.mode === 'navigate';
    try {
      const response = await fetch(request, navigation ? { cache: 'no-cache' } : {});
      if (response.ok && response.status === 200) {
        try {
          await cache.put(request, response.clone());
        } catch {
          // A full cache must not prevent delivery of a successful response.
        }
      }
      return response;
    } catch {
      return await cache.match(request, { ignoreSearch: navigation }) || Response.error();
    }
  })());
});
