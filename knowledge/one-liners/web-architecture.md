# Web Architecture — One-liners

> The most asked questions, each answered in one sentence.

1. **What happens when you type a URL?** — DNS lookup, TCP and TLS handshakes, HTTP request, server response, then the browser renders the page.
2. **CSR vs SSR?** — CSR builds the page in the browser with JavaScript; SSR builds HTML on the server for each request.
3. **What is SSG?** — Generating HTML pages once at build time.
4. **What is ISR?** — Static pages that are rebuilt in the background after a set time.
5. **What is hydration?** — Attaching JavaScript to server-rendered HTML so it becomes interactive.
6. **SPA vs MPA?** — An SPA swaps views with JavaScript; an MPA loads a new HTML page per URL.
7. **What are micro-frontends?** — Splitting a frontend into parts owned and deployed by different teams.
8. **What is a BFF?** — A backend built specifically for one frontend.
9. **WebSocket vs SSE?** — WebSockets are two-way; SSE only pushes from server to client.
10. **What is long polling?** — The server holds a request open until there is new data.
11. **What is a webhook?** — A server-to-server callback when an event happens.
12. **What is a Service Worker?** — A background script that can cache files, work offline and receive push messages.
13. **What is a PWA?** — A web app that can be installed and work offline like a native app.
14. **Reverse proxy vs forward proxy?** — A reverse proxy sits in front of servers; a forward proxy sits in front of clients.
15. **What is a CDN for?** — Serving static files from servers close to the user.
16. **Why hash asset file names?** — So they can be cached forever and change name when their content changes.
17. **What is server state vs client state?** — Server state is cached API data; client state is UI data owned by the app.
18. **What is the critical rendering path?** — HTML to DOM, CSS to CSSOM, then layout and paint.
19. **What is CORS?** — Browser rules that control which other origins can call an API.
20. **What does Content Security Policy do?** — Limits which scripts and resources the page may load, to block XSS.
