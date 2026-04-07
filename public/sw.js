// Service Worker para PWA y Notificaciones Push

const CACHE_NAME = 'cali-eats-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-dark-32x32.png',
  '/apple-icon.png',
];

// Instalación: Precachear assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activación: Limpiar caches antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Tomar control inmediatamente
  self.clients.claim();
});

// Fetch: Estrategia Cache-First con Network Fallback
self.addEventListener('fetch', (event) => {
  // Ignorar requests de API y autenticación
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('auth')) {
    return;
  }

  // Ignorar requests POST/PUT/DELETE
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en cache, devolver cache
      if (cachedResponse) {
        // Actualizar cache en background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        
        return cachedResponse;
      }

      // Si no está en cache, fetch y cachear
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    }).catch(() => {
      // Fallback si está offline
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
      return new Response('Offline', { status: 503 });
    })
  );
});

// Notificaciones Push
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  
  const options = {
    body: data.body || '¡Nuevos restaurantes cerca de ti!',
    icon: '/icon-dark-32x32.png',
    badge: '/icon-dark-32x32.png',
    tag: data.tag || 'cali-eats-notification',
    requireInteraction: false,
    data: data.data || {},
    actions: data.actions || [
      { action: 'explore', title: 'Explorar' },
      { action: 'dismiss', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Cali Eats',
      options
    )
  );
});

// Click en notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data;
  let url = '/';
  
  if (event.action === 'explore') {
    url = '/?tab=explore';
  } else if (notificationData?.restaurantId) {
    url = `/?restaurant=${notificationData.restaurantId}`;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Si hay una ventana abierta, enfocarla
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Si no, abrir nueva ventana
      return self.clients.openWindow(url);
    })
  );
});
