const CACHE_NAME = 'killteam-v137';
const ASSETS = [
  './',
  './killteam_viewer.html',
  './killteam_planner.html',
  './maps-volkus.js',
  './maps-gallowdark.js',
  './maps-tombworld.js',
  './maps-beta-decima.js',
  './maps-octarius.js',
  './manifest.json',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './favicon-32.png',
  './favicon-16.png',
  './manifest-planner.json',
  './planner-apple-touch-icon.png',
  './planner-icon-192.png',
  './planner-icon-512.png',
  './planner-favicon-32.png',
  './planner-favicon-16.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE_NAME; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(response) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    }).catch(function() {
      return caches.match('./killteam_viewer.html');
    })
  );
});
