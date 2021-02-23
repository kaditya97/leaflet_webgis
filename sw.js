const cacheName = 'kaditya97';
const staticAssets = [
  './',
  './manifest.webmanifest',
  './images/icon-192x192.png',
  './images/icon-512x512.png',
  './index.html',
  './info.html',
  './css/images/cancel.png',
  './css/images/check.png',
  './css/images/close.svg',
  './css/images/download.svg',
  './css/images/draw-shapefile.png',
  './css/images/focus.png',
  './css/images/geocoder.png',
  './css/images/layers-2x.png',
  './css/images/layers.png',
  './css/images/marker-icon-2x.png',
  './css/images/marker-icon.png',
  './css/images/marker-shadow.png',
  './css/images/rulers.png',
  './css/images/spritesheet-2x.png',
  './css/images/spritesheet.png',
  './css/images/spritesheet.svg',
  './css/images/start.png',
  './css/images/trash.png',
  './css/Control.OSMGeocoder.css',
  './css/L.Control.SlideMenu.css',
  './css/leaflet-measure.css',
  './css/leaflet-sidebar.min.css',
  './css/leaflet.contextmenu.min.css',
  './css/leaflet.css',
  './css/leaflet.draw-shapefile.css',
  './css/leaflet.draw.css',
  './css/mousePosition.css',
  './css/styles.css',
  './js/Control.OSMGeocoder.js',
  './js/easy-button.js',
  './js/leaflet-measure.js',
  './js/leaflet-src.js',
  './js/leaflet.browser.print.min.js',
  './js/leaflet.contextmenu.min.js',
  './js/leaflet.draw-shapefile.js',
  './js/leaflet.draw-src.js',
  './js/leaflet.shapefile.js',
  './js/mousePosition.js',
  './js/shp.js',
  './jss/main.js',
  './sw.js'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}
