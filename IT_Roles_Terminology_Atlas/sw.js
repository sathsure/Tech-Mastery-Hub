/* Offline cache for the Atlas. Serves cached files instantly and refreshes them in the background.
 * Live feeds (other origins) are never cached here. Bump CACHE when the file list changes. */
const CACHE = "atlas-v6";
const CORE = ["welcome.html", "welcome.js", "IT_Roles_Terminology_Atlas.html", "IT_Roles_Terminology_Atlas.css", "IT_Roles_Terminology_Atlas.js", "it-atlas-data.js", "pay-tax.js", "pay-tax-ui.js", "glossary-cards.js", "role-test-data.js", "role-test-data-2.js", "role-test-engine.js", "role-test-ui.js", "icon.svg", "manifest.webmanifest"];

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
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req)
      .then((r) => {
        if (r.ok) c.put(req, r.clone());
        return r;
      })
      .catch(() => hit);
    return hit || net;
  }));
});
