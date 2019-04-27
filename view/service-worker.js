const CACHE_NAME = 'static-cache-v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
    "index.html"
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    // CODELAB: Precache static resources here.

    self.skipWaiting();
});

self.addEventListener('install', (event) => {
    event.waitUntil(async function () {
        const cache = await caches.open('mysite-static-v3');
        await cache.addAll([
            '/css/whatever-v3.css',
            '/css/imgs/sprites-v6.png',
            '/css/fonts/whatever-v8.woff',
            '/js/all-min-v4.js'
            // etc
        ]);
    }());
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.

    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);
    // CODELAB: Add fetch event handler here.

});