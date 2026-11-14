# Web Vitals & Performance — One-liners

> The most asked questions, each answered in one sentence.

1. **What are the Core Web Vitals?** — LCP (loading), INP (responsiveness) and CLS (visual stability).
2. **What is LCP?** — The time until the largest image or text block on screen is shown; good is 2.5 s or less.
3. **What is INP?** — How long the page takes to react visually to clicks, taps and keys; good is 200 ms or less.
4. **What is CLS?** — A score for how much visible content jumps around; good is 0.1 or less.
5. **What replaced FID?** — INP, in March 2024.
6. **What is TTFB?** — The time until the browser receives the first byte from the server.
7. **What is FCP?** — The time until the first text or image appears.
8. **What is TBT?** — Total time the main thread was blocked by long tasks; a lab stand-in for INP.
9. **Lab vs field data?** — Lab data is a controlled test (Lighthouse); field data comes from real users (CrUX).
10. **Which percentile does Google use?** — The 75th percentile of real page loads.
11. **How do you improve LCP?** — Faster server/CDN, preload the main image, smaller images, less render-blocking CSS/JS.
12. **How do you improve INP?** — Break up long tasks, ship less JavaScript, and move heavy work to Web Workers.
13. **How do you improve CLS?** — Set image/video dimensions, reserve space for ads and banners, and load fonts carefully.
14. **What is a long task?** — Main-thread work longer than 50 ms.
15. **What is the critical rendering path?** — The steps from HTML and CSS to pixels: DOM, CSSOM, layout, paint.
16. **What does `fetchpriority="high"` do?** — It tells the browser to download that resource earlier.
17. **What is code splitting?** — Breaking JavaScript into smaller chunks loaded only when needed.
18. **Preload vs prefetch?** — Preload fetches something needed now; prefetch fetches something likely needed later.
19. **Which tools measure Web Vitals?** — Lighthouse, PageSpeed Insights, Chrome DevTools, Search Console and the `web-vitals` library.
20. **Why use `font-display: swap`?** — Text shows right away in a fallback font instead of staying invisible.
