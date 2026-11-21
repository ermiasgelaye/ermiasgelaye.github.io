/* ARC-NATURE PHOTOGRAPHY — service worker (offline support & faster repeat visits).
 *
 * Strategy
 *   - Pages, CSS, JS, data: network-first (always fresh online), cache fallback offline.
 *   - Gallery thumbnails & small images: cache-first, capped at MAX_IMAGES entries.
 *   - Fonts/icons/map library from CDNs: stale-while-revalidate.
 *   - Never cached: full-size originals, payments, downloads API, contact form, AI chat, map tiles.
 * Bump VERSION when changing this file's caching rules. */
const VERSION = 'v2';
const CORE = `arc-core-${VERSION}`;
const IMAGES = `arc-img-${VERSION}`;
const CDN = `arc-cdn-${VERSION}`;
const MAX_IMAGES = 400;

const PRECACHE = [
    './Home.html',
    './manifest.webmanifest',
    './assets/css/main.css',
    './assets/js/core.js',
    './assets/js/data/photos.js',
    './assets/js/data/places.js',
    './assets/js/downloads.js',
    './assets/js/gallery.js',
    './assets/js/map.js',
    './assets/js/chat/knowledge/site.js',
    './assets/js/chat/knowledge/fundamentals.js',
    './assets/js/chat/knowledge/composition-light.js',
    './assets/js/chat/knowledge/techniques.js',
    './assets/js/chat/knowledge/gear-editing.js',
    './assets/js/chat/knowledge/general.js',
    '../assets/shared/chat/engine.js',
    '../assets/shared/chat/ui.js',
    '../assets/shared/chat/chat.css',
    './assets/js/app.js',
    './images/optimized/logo-256.png',
    './images/optimized/favicon-64.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CORE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keep = new Set([CORE, IMAGES, CDN]);
        for (const key of await caches.keys()) if (!keep.has(key)) await caches.delete(key);
        await self.clients.claim();
    })());
});

const NEVER = /photo-backend|formspree|paypal|stripe|basemaps|arcgisonline|tile\.openstreetmap/;
const CDN_HOSTS = /fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com/;

async function trimImages() {
    const cache = await caches.open(IMAGES);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - MAX_IMAGES; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (NEVER.test(url.href)) return;

    // CDN assets: stale-while-revalidate
    if (CDN_HOSTS.test(url.host)) {
        event.respondWith((async () => {
            const cache = await caches.open(CDN);
            const hit = await cache.match(req);
            const net = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => hit);
            return hit || net;
        })());
        return;
    }
    if (url.origin !== self.location.origin) return;

    // Thumbnails & small optimised images: cache-first
    if (/\/images\/(thumbs|thumbs-sm|optimized)\//.test(url.pathname)) {
        event.respondWith((async () => {
            const cache = await caches.open(IMAGES);
            const hit = await cache.match(req);
            if (hit) return hit;
            const res = await fetch(req);
            if (res.ok) { cache.put(req, res.clone()); trimImages(); }
            return res;
        })());
        return;
    }
    // Full-size originals: straight to network (too large to cache)
    if (/\/images\//.test(url.pathname) && !/background\d\.jpeg$/.test(url.pathname)) return;

    // Pages, CSS, JS, backgrounds: network-first, cache fallback
    event.respondWith((async () => {
        const cache = await caches.open(CORE);
        try {
            const res = await fetch(req);
            if (res.ok) cache.put(req, res.clone());
            return res;
        } catch {
            const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
            if (hit) return hit;
            if (req.mode === 'navigate') return cache.match('./Home.html');
            throw new Error('offline');
        }
    })());
});
