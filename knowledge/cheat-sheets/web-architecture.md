# Web Architecture — Cheat Sheet

> **In one line:** how the pieces of a web app fit together — browser, servers, APIs, caches — and where the page gets built.

## What happens when you open a URL
1. **DNS** turns the name into an IP address.
2. **TCP + TLS** — open a secure connection.
3. The request goes through a CDN / load balancer to the server.
4. The server builds a response (often using a cache and a database).
5. The browser parses HTML and CSS, runs JavaScript, and paints the page.

## Where the page is built
- **CSR (client-side rendering)** — the browser builds the page with JavaScript. Great for apps behind login; slower first load, weaker SEO.
- **SSR (server-side rendering)** — the server builds HTML for each request. Fast first view, good SEO; more server work.
- **SSG (static site generation)** — HTML built once at build time. Fastest; needs a rebuild to change.
- **ISR** — static pages rebuilt in the background now and then.
- **Hydration** — JavaScript "wakes up" server-made HTML so it becomes interactive.

## Frontend structure
- **SPA** — one page; JavaScript switches views. **MPA** — a new page from the server for each URL.
- **Micro-frontends** — different teams own different parts of the UI.
- **State** — UI state (in a component), app state (a store), server state (cached API data, e.g. React Query).
- **BFF (Backend for Frontend)** — a small API made for one frontend.

## Backend styles
Layered (controller → service → repository) · monolith · microservices · serverless functions · event-driven.

## Ways to talk to the server
- **REST** — resources and HTTP methods.
- **GraphQL** — the client asks for exactly the fields it needs.
- **gRPC** — fast binary calls between services.
- **WebSocket** — two-way live connection (chat, games).
- **SSE** — server pushes updates one way (live scores, notifications).
- **Webhook** — a server calls your server when something happens.

## Caching layers
Browser cache → **Service Worker** → **CDN** → reverse proxy → app cache → Redis → database.
- Give static files hashed names (`app.3f9a.js`) and cache them for a long time.

## Scaling
- Stateless servers behind a **load balancer**; sessions in Redis or tokens.
- **Reverse proxy** (Nginx) — sits in front of servers: HTTPS, caching, routing.
- Replicas, sharding, queues for slow work.

## Security basics
HTTPS + HSTS · Content Security Policy (stops XSS) · CORS rules · secure cookies (`HttpOnly`, `Secure`, `SameSite`) · CSRF protection · OAuth2/OIDC login · rate limiting.

## Performance basics
Core Web Vitals (LCP, INP, CLS) · code splitting · lazy loading · optimized images · compression · HTTP/2–3.

## PWA (Progressive Web App)
A **Service Worker** caches files for offline use and enables push notifications; a manifest allows "install to home screen".
