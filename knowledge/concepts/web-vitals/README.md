# Web Vitals & Web Performance

## Overview

Web performance focuses on how quickly a web application becomes usable, how stable the page remains during loading, and how efficiently frontend resources are delivered.

This repository source covers practical Web Vitals and frontend performance topics including LCP, CLS, main-thread blocking, image optimization, SSR vs CSR, and lazy loading.

**Concept ID:** `web.performance`

---

## 1. Largest Contentful Paint (LCP)

**Largest Contentful Paint (LCP)** measures the rendering time of the largest visible content element in the viewport.

The source identifies:

- A good LCP target of **2.5 seconds or less**
- Large visible content as the element that can dominate the perceived loading experience
- Preloading important hero images as one optimization technique

### Optimization

For an important hero image, the source demonstrates using preload so the browser can discover the resource earlier.

The goal is to reduce the time required for the largest visible content to become available.

---

## 2. Cumulative Layout Shift (CLS)

**Cumulative Layout Shift (CLS)** concerns unexpected movement of content while a page is loading.

The source recommends reserving space for elements before they load.

Examples include specifying:

- `width`
- `height`
- `aspect-ratio`

### Preventing layout shifts

The source also recommends avoiding insertion of new DOM content above content that the user is already viewing.

The architectural goal is to make the page visually stable during loading.

---

## 3. JavaScript Main-Thread Blocking

Large synchronous JavaScript tasks can block the browser's main thread.

The source identifies several techniques for reducing this problem:

- Code splitting
- `async` / `defer`
- Web Workers
- Reducing large synchronous tasks

### Architectural consideration

Frontend performance is affected not only by the amount of JavaScript but also by when and where that JavaScript executes.

Long synchronous tasks can delay other browser work and affect responsiveness.

---

## 4. Image Optimization

Images can have a significant impact on web performance.

The source recommends:

- Using an appropriate image size
- Compressing images
- Using modern formats such as WebP or AVIF
- Using responsive `srcset`
- Lazy-loading images below the fold
- Using CDNs

### Principle

Do not send unnecessarily large image resources to the browser.

Image dimensions, format, loading behavior, and delivery infrastructure all contribute to the resulting performance.

---

## 5. SSR vs CSR

The source compares **Server-Side Rendering (SSR)** and **Client-Side Rendering (CSR)**.

### SSR

With SSR:

- HTML is rendered on the server
- The browser receives rendered HTML
- It can provide faster initial rendering
- It can improve SEO
- It introduces additional server-side workload

The source also associates SSR with faster first paint / initial response behavior.

### CSR

With CSR:

- The browser initially receives an application shell
- JavaScript executes in the browser
- The application renders on the client
- Initial rendering can be slower
- Once the application has loaded, subsequent interaction can be fast

### Architectural trade-off

SSR and CSR involve different trade-offs between:

- Initial rendering
- Server workload
- Client-side processing
- SEO
- Application interaction after loading

The appropriate rendering strategy depends on the application's requirements.

---

## 6. Lazy Loading Non-Critical JavaScript

Non-critical JavaScript does not always need to be loaded during the initial page load.

The source describes loading JavaScript later using mechanisms such as:

- Dynamic imports
- Script injection
- User interaction
- Viewport visibility
- Browser idle time

### Principle

Critical resources should receive priority during initial loading.

Non-critical functionality can be deferred until it becomes relevant.

---

## 7. Performance Optimization Checklist

Based on the repository source:

### LCP

- Keep important visible content fast
- Optimize hero resources
- Consider preloading important hero images
- Target LCP of 2.5 seconds or less

### CLS

- Reserve space for images/content
- Define dimensions or aspect ratios
- Avoid inserting content above already-visible content

### JavaScript

- Split large bundles
- Use `async` / `defer` where appropriate
- Move suitable work to Web Workers
- Reduce large synchronous tasks

### Images

- Use appropriate dimensions
- Compress images
- Prefer WebP/AVIF where applicable
- Use responsive `srcset`
- Lazy-load below-the-fold images
- Consider CDNs

### Rendering

- Evaluate SSR vs CSR based on application requirements
- Consider initial rendering and SEO requirements
- Account for server workload when using SSR

### Non-critical JavaScript

- Defer functionality that is not required immediately
- Use dynamic imports
- Load based on interaction, viewport visibility, or idle time when appropriate

---

## Repository Resources

### Primary Source

- [Web Vitals Interview Material](../../../interview/architecture/01-web-vitals.md)

### Related Concepts

- [Angular](../angular/README.md)
- [Web Architecture](../web-architecture/README.md)

### Related Roadmap

- [Architecture Roadmap](../../../roadmap/architecture/README.md)

---

## Source Boundary

This canonical page is derived from:

`interview/architecture/01-web-vitals.md`

The source contains six focused interview questions covering:

1. LCP
2. CLS
3. JavaScript main-thread blocking
4. Image optimization
5. SSR vs CSR
6. Lazy loading non-critical JavaScript

This page consolidates those source-backed topics. It does not claim to be an exhaustive reference for all Core Web Vitals, browser performance APIs, or web-performance techniques.

**Canonical status:** complete for the currently identified repository evidence.
