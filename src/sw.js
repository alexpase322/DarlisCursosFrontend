// Service Worker custom: combina precache de Workbox + handlers de Web Push.
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

self.skipWaiting();
self.addEventListener('activate', () => self.clients.claim());

// ---------- Precache ----------
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// ---------- Runtime caching ----------
const apiPrefixes = ['/auth', '/users', '/courses', '/posts', '/chat', '/notifications', '/payment', '/affiliate', '/admin', '/quizzes', '/leaderboard', '/push', '/engagement'];
const isApi = ({ url }) => apiPrefixes.some(p => url.pathname.startsWith(p));

registerRoute(
    isApi,
    new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 5,
        plugins: [
            new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 5 }),
            new CacheableResponsePlugin({ statuses: [0, 200] })
        ]
    })
);

registerRoute(
    ({ url }) => /^https:\/\/res\.cloudinary\.com\//.test(url.href),
    new CacheFirst({
        cacheName: 'cloudinary-images',
        plugins: [
            new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
            new CacheableResponsePlugin({ statuses: [0, 200] })
        ]
    })
);

// SPA navigation fallback (excluye rutas de API)
const navDenylist = apiPrefixes.map(p => new RegExp(`^${p}`));
registerRoute(new NavigationRoute(
    ({ event }) => fetch('/index.html').catch(() => caches.match('/index.html')),
    { denylist: navDenylist }
));

// ---------- Push notifications ----------
self.addEventListener('push', (event) => {
    let data = { title: 'Arquitecta', body: 'Tienes una notificación', url: '/' };
    if (event.data) {
        try { data = { ...data, ...event.data.json() }; }
        catch { data.body = event.data.text(); }
    }
    const options = {
        body: data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        data: { url: data.url || '/' },
        tag: data.tag || undefined,
        renotify: !!data.tag,
        vibrate: [120, 60, 120]
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || '/';
    event.waitUntil((async () => {
        const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const c of allClients) {
            if (c.url.includes(targetUrl) && 'focus' in c) return c.focus();
        }
        if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })());
});
