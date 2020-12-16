/**
 * The cache is the storage of the browser. It's useful
 * to save data there, because then you don't have to
 * load it again.
 */
const CACHE_NAME = 'version-1';
const urlsToCache = ['index.html', 'offline.html'];
const self = this;

// install Service Worker.
self.addEventListener('install', (event) => {
  // We open the cache and add the urls that we want to cache.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for all the requests to external API (for example, our axios request to get the weather)
self.addEventListener('fetch', (event) => {
  // once we have caught the event, we can respond to it in 2 different ways:
  // A) if there is internet connection, we just "fetch" the request.
  // B) if the request cannot be fetched, that means we're offline, so we must redirect to the offline page.
  event.respondWith(
    caches
      .match(event.request)
      .then(() =>
        fetch(event.request).catch(() => caches.match('offline.html'))
      )
  );
});

// Activate the Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME)

  // Keep the whitelisted cache and delete the rest.
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if(!cacheWhiteList.includes(cacheName)){
          return caches.delete(cacheName);
        }
      })
    ))
  )
});
