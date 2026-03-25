const CACHE_NAME = "gigupnorth-static-v1";
const STATIC_ASSETS = [
  "/gigupnorth/",
  "/gigupnorth/index.html",
  "/gigupnorth/style.css",
  "/gigupnorth/script.js",
  "/gigupnorth/icons/gun logo app.png",
  "/gigupnorth/manifest.json"
];

// Install: cache static files safely
self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const asset of STATIC_ASSETS) {
        try {
          await cache.add(asset);
        } catch(e) {
          console.warn("Failed to cache:", asset, e);
        }
      }
    })()
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve cached static files, network fallback for everything else
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  const isStatic = STATIC_ASSETS.some(asset => url.href.endsWith(asset));

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
