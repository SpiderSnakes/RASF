/// <reference lib="webworker" />

/* eslint-disable no-restricted-globals */

type ManifestEntry = {
  url: string;
  revision?: string | null;
  integrity?: string;
};

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: ManifestEntry[];
};

const manifestEntries = self.__SW_MANIFEST || [];

const manifestVersion = (() => {
  const base = manifestEntries.map((entry) => entry.revision ?? entry.url).join("|");
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
})();

const PRECACHE = `serwist-precache-${manifestVersion}`;
const RUNTIME = {
  fonts: "serwist-runtime-fonts",
  static: "serwist-runtime-static",
  apiMenus: "serwist-runtime-api-menus",
  apiSettings: "serwist-runtime-api-settings",
};

const precacheUrls = manifestEntries.map((entry) => new URL(entry.url, self.location.origin).href);
const precacheUrlSet = new Set(precacheUrls);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      await cache.addAll(precacheUrls);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const expectedCaches = new Set([PRECACHE, ...Object.values(RUNTIME)]);
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!expectedCaches.has(cacheName)) {
            return caches.delete(cacheName);
          }
          return Promise.resolve(true);
        })
      );
      await self.clients.claim();
    })()
  );
});

const fontHosts = new Set(["fonts.googleapis.com", "fonts.gstatic.com"]);
const fontExt = /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i;
const imageExt = /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i;

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Precache: cache-first
  if (precacheUrlSet.has(request.url) || precacheUrlSet.has(url.pathname)) {
    event.respondWith(cacheFirst(request, PRECACHE));
    return;
  }

  // Fonts
  if (fontHosts.has(url.hostname) || fontExt.test(url.pathname)) {
    event.respondWith(cacheFirst(request, RUNTIME.fonts));
    return;
  }

  // Images
  if (imageExt.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME.static));
    return;
  }

  // API settings / menus -> network-first
  if (url.pathname.startsWith("/api/settings")) {
    event.respondWith(networkFirst(request, RUNTIME.apiSettings));
    return;
  }
  if (url.pathname.startsWith("/api/menus")) {
    event.respondWith(networkFirst(request, RUNTIME.apiMenus));
    return;
  }
});

async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached ?? new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request: Request, cacheName: string): Promise<Response> {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached ?? new Response("Offline", { status: 503 }));
  return cached ?? fetchPromise;
}

async function networkFirst(request: Request, cacheName: string): Promise<Response> {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw error;
  }
}

export {};

