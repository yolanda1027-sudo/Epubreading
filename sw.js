// 墨頁閱讀器的離線快取。改了網站檔案之後把版本號加一，舊快取就會被換掉。
const VERSION = 'moye-v7';
const SHARED = 'moye-shared';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './vendor/jszip.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== SHARED).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 從手機「分享」選單送進來的 EPUB：先放進快取，再把頁面導回首頁讓它自己打開。
async function receiveShare(request) {
  try {
    const form = await request.formData();
    const file = form.get('book');
    if (file && typeof file !== 'string' && file.size) {
      const cache = await caches.open(SHARED);
      await cache.put('shared-book', new Response(file, {
        headers: {
          'content-type': file.type || 'application/epub+zip',
          'x-name': encodeURIComponent(file.name || 'book.epub'),
        },
      }));
    }
  } catch {}
  return Response.redirect('./?shared=1', 303);
}

// 先給快取裡的版本（離線也能開），同時在背景抓新的，下次開啟就是新版。
async function staleWhileRevalidate(request, opts) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(request, opts);
  const fresh = fetch(request)
    .then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(request, res.clone()).catch(() => {});
      return res;
    })
    .catch(() => null);
  if (cached) return cached;
  const res = await fresh;
  return res || new Response('目前離線，而且這個檔案還沒有快取過。', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method === 'POST' && url.origin === location.origin && url.pathname.endsWith('/share')) {
    e.respondWith(receiveShare(req));
    return;
  }
  if (req.method !== 'GET') return;
  if (url.origin === location.origin) {
    e.respondWith(staleWhileRevalidate(req, req.mode === 'navigate' ? { ignoreSearch: true } : undefined));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(staleWhileRevalidate(req));
  }
});
