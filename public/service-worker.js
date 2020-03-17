const CORE_CACHE = 1
const CORE_CACHE_NAME = `core-cache-v${CORE_CACHE}`
const CORE_ASSETS = ['./']

self.addEventListener('install', e => {
    console.log('sw install')
    e.waitUntil(
        caches.open(CORE_CACHE_NAME)
        .then(cache => cache.addAll(CORE_ASSETS))
        .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', e => {
    console.log('sw activate');

    // update sw in all active tabs
    // e.waitUntil(clients.claim())
});

self.addEventListener('fetch', e => {
    console.log('sw fetch for request: ', e.request.url)

    // e.respondWith(cashes.match(e.request)
    // .then(cashedResponse => {
    //     if (cashedResponse) {
    //         return cashedResponse
    //     }
    //     return fetch(e.request)
    // })
    // )
})