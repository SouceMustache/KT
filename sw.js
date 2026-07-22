const CACHE_NAME = 'killteam-v166';
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
      // bypass the HTTP cache so an install always pulls the current files
      return Promise.all(ASSETS.map(function(u){
        return fetch(new Request(u, {cache: 'reload'}))
          .then(function(r){ return cache.put(u, r); })
          .catch(function(){});
      }));
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
  var req = e.request;
  if (req.method !== 'GET') return;
  var isPage = req.mode === 'navigate' ||
               (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  // Pages go to the network first, so an installed PWA picks up a new build straight
  // away instead of serving whatever was cached at install time. Cache is the fallback,
  // which keeps the app fully usable offline.
  if (isPage) {
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(hit){
          return hit || caches.match('./killteam_planner.html')
                     || caches.match('./killteam_viewer.html');
        });
      })
    );
    return;
  }

  // Everything else (icons, map data) is fine served from cache first.
  e.respondWith(
    caches.match(req).then(function(cached){
      return cached || fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function(c){ c.put(req, copy); });
        return res;
      });
    }).catch(function(){ return caches.match('./killteam_viewer.html'); })
  );
});
