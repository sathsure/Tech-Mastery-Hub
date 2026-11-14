# Web Architecture — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. SSR is always faster
- ❌ "Switch to SSR and the page will be fast."
- ✅ SSR waits for your APIs; slow APIs → slow first byte. Cache or stream it.

### 2. CSR for a public blog
- ❌ A content site rendered only in the browser.
- ✅ Content and SEO pages suit SSG/SSR; CSR suits apps behind login.

### 3. Hydration mismatch
- ❌ Rendering `new Date()` or random values on both server and client.
- ✅ Server and client HTML must match; render changing values only on the client.

### 4. WebSockets with many servers
- ❌ User A on server 1, user B on server 2 → messages don't reach.
- ✅ Share messages via pub/sub (Redis, Kafka), or use sticky sessions.

### 5. WebSocket for one-way updates
- ❌ WebSockets just to push notifications.
- ✅ SSE is simpler for server → client only.

### 6. Caching HTML forever
- ❌ `Cache-Control: max-age=31536000` on `index.html` → users never get new releases.
- ✅ Long cache for hashed assets; short or no cache for HTML.

### 7. Micro-frontends for speed
- ❌ "Micro-frontends will make the app faster."
- ✅ They help teams work independently; they often add size. Use only when team scale needs it.

### 8. Reverse vs forward proxy
- ❌ Mixing them up.
- ✅ Reverse proxy sits in front of **servers** (Nginx). Forward proxy sits in front of **clients** (corporate proxy).
