# ⚡ Web Vitals & Frontend Performance

### ❓ What are Core Web Vitals?

### 📝 Answer

Three numbers Google uses to measure **real user experience** (and as a search ranking signal):

| Metric | Measures | Good | Poor |
|---|---|---|---|
| **LCP** — Largest Contentful Paint | **Loading:** when the main content appears | ≤ 2.5 s | > 4 s |
| **INP** — Interaction to Next Paint | **Responsiveness:** delay after a click/tap/key until the screen updates | ≤ 200 ms | > 500 ms |
| **CLS** — Cumulative Layout Shift | **Visual stability:** how much the page jumps around | ≤ 0.1 | > 0.25 |

A page "passes" when **75% of real visits** are in the good range.

**Measure them:** Chrome DevTools / Lighthouse (lab), PageSpeed Insights and Search Console (real users), or the `web-vitals` JS library in your own analytics.

#### ↳ Follow-up: What happened to FID?

↪ INP replaced FID (First Input Delay) in March 2024. FID only measured the first interaction's delay; INP looks at all interactions and the full time until the screen updates.

---

### ❓ What is Largest Contentful Paint (LCP) and how do you improve it?

### 📝 Answer

LCP is when the **largest visible element** (usually the hero image or main heading) finishes rendering. Good: **≤ 2.5 s**.

**Improve it:**

- Load the hero image **early and first**: `fetchpriority="high"`, never `loading="lazy"` on it.
- Make it **small**: right size, WebP/AVIF, served from a CDN.
- Reduce **render-blocking** CSS/JS in the `<head>`.
- Speed up the server response (caching, CDN, SSR/static HTML).

```html
<link rel="preload" as="image" href="/img/hero.jpg" fetchpriority="high" />

<img src="/img/hero.jpg" width="1200" height="600"
     fetchpriority="high" alt="Hero" />   <!-- no loading="lazy" on the LCP image -->
```

---

### ❓ How to reduce CLS?

### 📝 Answer

CLS (Cumulative Layout Shift) grows when content **moves after it appears** — e.g. an image loads and pushes text down while you're reading or about to tap. Fix it by **reserving space** before things load.

- Give images and videos `width` + `height` (or `aspect-ratio`).
- Reserve space for ads, embeds and banners (`min-height`).
- Don't insert content **above** existing content — show toasts and banners as overlays.
- Load fonts with `font-display: swap` plus a similar fallback font (or `size-adjust`) so text doesn't jump.

```html
<img src="/banner.jpg" alt="Banner"
     style="width: 100%; aspect-ratio: 16 / 9; object-fit: cover;" />

<!-- Toasts float above the page instead of pushing it down -->
<div id="toast-container" style="position: fixed; bottom: 16px; right: 16px;"></div>
```

> 💡 Changes within 500 ms after a user's click don't count — expected movement (opening an accordion) is fine.

---

### ❓ What is INP and how do you improve it?

### 📝 Answer

INP (Interaction to Next Paint) is the time from a user's **click, tap or key press** until the browser **paints the result**. Good: **≤ 200 ms**. It's slow when the **main thread is busy** with JavaScript.

**Improve it:**

- Break long tasks (> 50 ms) into smaller pieces and **yield** to the browser.
- Update the UI first, do heavy work after (or in a Web Worker).
- Debounce expensive handlers (search as you type).
- Avoid huge DOM updates; virtualise long lists.

```js
button.addEventListener("click", async () => {
  showSpinner();                                   // 1. quick visual feedback
  await new Promise(r => setTimeout(r, 0));        // 2. let the browser paint it
  doHeavyWork();                                   // 3. then the slow part
});
```

Newer browsers also offer `await scheduler.yield()` for step 2.

---

### ❓ How to reduce JS main-thread blocking time?

### 📝 Answer

The browser's main thread does JavaScript **and** layout **and** painting. Long JS tasks freeze the page. Ways to reduce them:

- **Ship less JS:** code-splitting, tree-shaking, remove unused libraries.
- **Don't block parsing:** `defer` or `async` on scripts.
- **Move heavy work off the main thread** with a Web Worker.
- **Split long tasks** and yield between chunks (see INP).

```js
// worker.js — runs on a separate thread
self.onmessage = (e) => self.postMessage(heavyComputation(e.data));

// main.js
const worker = new Worker("/worker.js");
worker.postMessage({ count: 1_000_000 });
worker.onmessage = (e) => console.log("Result from worker:", e.data);
```

```html
<script src="/non-critical.js" defer></script>
```

---

### ❓ How to implement image optimization?

### 📝 Answer

Send the **smallest image that still looks right**:

- **Modern formats:** AVIF / WebP (often 30–50% smaller than JPEG).
- **Right size per screen:** `srcset` + `sizes`, so phones don't download desktop images.
- **Lazy-load** images below the fold (`loading="lazy"`) — but never the LCP image.
- Always set `width`/`height` (prevents CLS) and serve from a **CDN**.

```html
<picture>
  <source srcset="/img/photo.avif" type="image/avif" />
  <source srcset="/img/photo.webp" type="image/webp" />
  <img
    src="/img/photo.jpg"
    srcset="/img/photo-480.jpg 480w, /img/photo-768.jpg 768w, /img/photo-1200.jpg 1200w"
    sizes="(max-width: 768px) 100vw, 1200px"
    width="1200" height="800"
    loading="lazy"
    alt="Product photo"
  />
</picture>
```

The browser picks the first format it supports, and the best width for the screen.

---

### ❓ Server-side rendering vs client-side rendering performance.

### 📝 Answer

| | SSR (server-side rendering) | CSR (client-side rendering) |
|---|---|---|
| What the browser gets | Ready HTML | An almost empty page + a JS bundle |
| First content visible (FCP/LCP) | **Faster** | Slower — waits for JS to download and run |
| Server response time (TTFB) | Slower (the server renders each page) | Faster (static files) |
| SEO | Better — content is in the HTML | Weaker unless pre-rendered |
| Interactivity | After **hydration** (JS attaches to the HTML) | After the app boots |
| Later navigation | Fast once hydrated | Fast |
| Server cost | Higher | Lower (CDN only) |

Middle grounds: **static site generation** (pre-render at build time), **streaming SSR**, and frameworks with partial hydration (Next.js, Angular SSR, Astro).

```jsx
// Very simplified React SSR with Express
app.get("*", (req, res) => {
  const html = renderToString(<App url={req.url} />);
  res.send(`<!DOCTYPE html><html><body>
      <div id="root">${html}</div>
      <script src="/client.bundle.js" defer></script>   <!-- hydrates the HTML -->
    </body></html>`);
});
```

---

### ❓ Lazy loading non-critical JS.

### 📝 Answer

Don't download code until it's needed: on **user action**, when it **scrolls into view**, or when the browser is **idle**. Use dynamic `import()`, which bundlers turn into a separate chunk.

```html
<button id="open-chat">Open Chat</button>

<script type="module">
  // Load the chat widget only when someone clicks
  document.getElementById("open-chat").addEventListener("click", async () => {
    const { initChatWidget } = await import("./chat-widget.js");
    initChatWidget();
  });

  // Load analytics when the browser has nothing else to do
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => import("./analytics.js"));
  }
</script>
```

In frameworks: React `lazy()` + `Suspense`, Angular `loadComponent` / `@defer` blocks.
