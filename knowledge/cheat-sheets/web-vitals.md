# Web Vitals & Performance — Cheat Sheet

> **In one line:** Google's three numbers for how a page *feels*: does it load fast, react fast, and stay still?

## The three Core Web Vitals
| Metric | Question it answers | Good |
|---|---|---|
| **LCP** — Largest Contentful Paint | When does the main content (big image or text) show? | ≤ 2.5 s |
| **INP** — Interaction to Next Paint | After a click or tap, how fast does the screen react? | ≤ 200 ms |
| **CLS** — Cumulative Layout Shift | How much does content jump around? | ≤ 0.1 |

- **INP replaced FID** in March 2024.
- Google uses the **75th percentile** of real visitors.

## Other useful numbers
- **TTFB** — time until the server sends the first byte.
- **FCP** — time until anything appears.
- **TBT** — total time the main thread was blocked (a lab stand-in for INP).

## Lab vs field data
- **Lab** — one test run on your machine (Lighthouse, DevTools). Good for finding causes.
- **Field** — real users' data (PageSpeed Insights, Chrome UX Report, the `web-vitals` library). This is what Google ranks on.

## How to improve LCP (loading)
- Faster server and a CDN.
- Preload the main image; give it `fetchpriority="high"`.
- Don't lazy-load the main image.
- Smaller images (WebP/AVIF, right size).
- Less render-blocking CSS/JS (`defer` scripts).
- Server-side rendering so content is in the first HTML.

## How to improve INP (responsiveness)
- Split long JavaScript tasks (> 50 ms) into smaller ones.
- Ship less JavaScript (code splitting, remove unused libraries).
- Move heavy work to a **Web Worker**.
- Show feedback first, do the heavy work after.

## How to improve CLS (stability)
- Always set `width`/`height` (or `aspect-ratio`) on images, videos and ads.
- Reserve space for banners and embeds.
- Load fonts well (`font-display: swap`, preload).
- Animate with `transform`, not `top` or `height`.

## General speed tips
- Compression (Brotli/gzip), HTTP/2 or HTTP/3, caching with hashed file names.
- Lazy-load images and routes; `preconnect` to other domains you'll call.
- **Critical rendering path** — HTML → DOM, CSS → CSSOM → layout → paint. Less blocking = faster first paint.

## Tools
Lighthouse, PageSpeed Insights, DevTools Performance panel, WebPageTest, Search Console.
