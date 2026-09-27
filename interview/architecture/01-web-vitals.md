❓ 1. What is Largest Contentful Paint (LCP)?

### 📝 Answer

LCP measures how long it takes for the **largest visible content** (image, video, block of text) in the viewport to render. Good LCP ≤ **2.5s**.

💻 **Code Example**

(prioritize above-the-fold image)

```html
<!-- Use proper size + preload hero image -->
<link rel="preload" as="image" href="/img/hero.jpg" />

<img
  src="/img/hero.jpg"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
  alt="Hero"
/>
```

---

❓ 2. How to reduce CLS?

### 📝 Answer

CLS (Cumulative Layout Shift) is reduced by **reserving space** for elements (images, ads, fonts) so layout doesn’t jump while loading.

💻 **Code Example**

(reserve space for image + avoid layout shift)

```html
<!-- Set width/height OR aspect-ratio -->
<img
  src="/banner.jpg"
  alt="Banner"
  style="width: 100%; aspect-ratio: 16/9; object-fit: cover;"
/>

<!-- Avoid inserting DOM above existing content dynamically -->
<div id="toast-container"></div>
<script>
  function showToast(msg) {
    const el = document.createElement("div");
    el.textContent = msg;
    document.getElementById("toast-container").appendChild(el);
  }
</script>
```

---

❓ 3. How to reduce JS main-thread blocking time?

### 📝 Answer

Split and defer heavy JS: **code-splitting, async/defer scripts, web workers, and fewer big sync tasks** on the main thread.

💻 **Code Example**

(move heavy work to Web Worker)

```js
// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
};

// main.js
const worker = new Worker("/worker.js");
worker.postMessage({ count: 1000000 });
worker.onmessage = (e) => {
  console.log("Result from worker:", e.data);
};
```

And load non-critical script without blocking:

```html
<script src="/non-critical.js" defer></script>
```

---

❓ 4. How to implement image optimization?

### 📝 Answer

Serve **properly sized, compressed, next-gen** images (WebP/AVIF), use **responsive `<img srcset>`**, lazy-load below-the-fold images, and use CDNs.

💻 **Code Example**

(responsive + modern formats)

```html
<picture>
  <source srcset="/img/hero.avif" type="image/avif" />
  <source srcset="/img/hero.webp" type="image/webp" />
  <img
    src="/img/hero.jpg"
    srcset="
      /img/hero-480.jpg   480w,
      /img/hero-768.jpg   768w,
      /img/hero-1200.jpg 1200w
    "
    sizes="(max-width: 768px) 100vw, 1200px"
    loading="lazy"
    alt="Hero"
  />
</picture>
```

---

❓ 5. Server-side rendering vs client-side rendering performance.

### 📝 Answer

- **SSR:** HTML is rendered on the server → **faster first paint/TTFB**, better SEO, but more server load and possible slower navigation if not hydrated well.
- **CSR:** Browser receives a shell + JS, then renders → usually **slower first paint**, but can be very fast after initial load.

💻 **Code Example**

(very simplified Node SSR)

```js
// Node + Express example
import express from "express";
import { renderToString } from "react-dom/server";
import App from "./App.js";

const app = express();

app.get("*", (req, res) => {
  const html = renderToString(<App />);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head><title>SSR</title></head>
      <body>
        <div id="root">${html}</div>
        <script src="/client.bundle.js" defer></script>
      </body>
    </html>
  `);
});

app.listen(3000);
```

---

❓ 6. Lazy loading non-critical JS.

### 📝 Answer

Load non-essential JS **on demand** (after user interaction, viewport visibility, or idle time) using **dynamic import** or script injection.

💻 **Code Example**

(dynamic import on interaction)

```html
<button id="open-chat">Open Chat</button>

<script>
  document.getElementById("open-chat").addEventListener("click", async () => {
    const { initChatWidget } = await import("./chat-widget.js");
    initChatWidget();
  });

  // Or load when browser is idle
  if ("requestIdleCallback" in window) {
    requestIdleCallback(async () => {
      await import("./analytics.js");
    });
  }
</script>
```
