/* Offline cache for the Atlas. Always fetches the latest file; the cached copy is used only when offline,
 * so an update is never hidden behind an old copy. Live feeds (other origins) are never cached here.
 * Bump CACHE when the file list changes. */
const CACHE = "atlas-v11";
const CORE = ["welcome.html", "theme-boot.js", "atlas-ui.js", "welcome.js", "IT_Roles_Terminology_Atlas.html", "IT_Roles_Terminology_Atlas.css", "IT_Roles_Terminology_Atlas.js", "it-atlas-data.js", "pay-tax.js", "pay-tax-ui.js", "glossary-cards.js", "role-test-data.js", "role-test-data-2.js", "role-test-data-3.js", "role-test-data-4.js", "role-test-data-5.js", "role-test-engine.js", "role-test-ui.js", "icon.svg", "manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async (c) => {
    try {
      const r = await fetch(req, { cache: "no-cache" });
      if (r.ok) c.put(req, r.clone());
      return r;
    } catch {
      // Offline: the exact address first, then the same file without ?embed=1.
      return (await c.match(req)) || (await c.match(req, { ignoreSearch: true })) || Response.error();
    }
  }));
});
