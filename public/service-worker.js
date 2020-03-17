const CORE_CACHE = 1
const CORE_CACHE_NAME = `core-cache-v${CORE_CACHE}`
const CORE_ASSETS = [
    '/',
    '/offline',
    '/dist/site.css',
]

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
    e.waitUntil(clients.claim())
});

self.addEventListener('fetch', e => {
    console.log('sw fetch for request: ', e.request.url)

    console.log(isCoreGetRequest(e.request))
    console.log(isHtmlGetRequest(e.request))

    if (isCoreGetRequest(e.request)) {
        console.log('sw core get request: ')

        e.respondWith(
            caches.open(CORE_CACHE_NAME)
                .then(cache => cache.match(e.request.url))
        )
    } else if (isHtmlGetRequest(e.request)) {
        console.log('html get request: ', e.request.url)

        e.respondWith(
            caches.open('html-cache')
            .then(res => res ? res : fetchAndCache(e.request, 'html-cache'))
            .catch(e => {
                return caches.open(CORE_CACHE_NAME)
                    .then(cache => cache.match('/offline'))
            })
        )
    }
})

function fetchAndCache(request, cacheName) {
    return fetch(request)
        .then(res => {
            if (!res.ok) {
                throw new TypeError('Bad response status')
            }

            const clone = response.clone()
            caches.open(cacheName).then(cache => cache.put(req, clone))
            return res
        })
}

function isCoreGetRequest(request) {
    return request.method === 'GET' && CORE_ASSETS.includes(getPathName(request.url));
}

function isHtmlGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1);
}

function getPathName(requestUrl) {
    const url = new URL(requestUrl);
    return url.pathname;
}