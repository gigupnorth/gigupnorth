const CACHE_NAME = "gigupnorth-static-v1";

// Only cache static assets — never your dynamic gig data
const STATIC_ASSETS = [
  "/gigupnorth/",
  "/gigupnorth/index.html",
  "/gigupnorth/style.css",
  "/gigupnorth/script.js",
  "/gigupnorth/icons/icon-192.png",
  "/gigupnorth/icons/icon-512.png",
  "/gigupnorth/manifest.json"
];

// Install: cache static files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: static files from cache, everything else from network
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Only intercept requests inside your GitHub Pages folder
  const isStatic = STATIC_ASSETS.some(asset => url.pathname === asset);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
