const CACHE = 'entrancehearts-v1';
const ASSETS = [
  '/entrancehearts/',
  '/entrancehearts/index.html',
  '/entrancehearts/style.css',
  '/entrancehearts/script.js',
  '/entrancehearts/login.html',
  '/entrancehearts/signup.html',
  '/entrancehearts/browse.html',
  '/entrancehearts/chat.html',
  '/entrancehearts/profile.html',
  '/entrancehearts/ai-match.html',
  '/entrancehearts/confessions.html',
  '/entrancehearts/study.html',
  '/entrancehearts/timer.html',
  '/entrancehearts/verify.html',
  '/entrancehearts/update-password.html',
  '/entrancehearts/icon-192.png',
  '/entrancehearts/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for Supabase, cache first for assets
  if (e.request.url.includes('supabase.co')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});

// Push notification handler
self.addEventListener('push', function(event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/entrancehearts/icon-192.png',
    badge: '/entrancehearts/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/entrancehearts/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
