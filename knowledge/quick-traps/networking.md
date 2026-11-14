# Networking & HTTP — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. HTTPS hides everything
- ❌ "Nobody can see which site I visit over HTTPS."
- ✅ The path and body are hidden, but the domain (SNI) and IP are visible.

### 2. DNS changes are instant
- ❌ Updating a record and expecting everyone to see it now.
- ✅ Old answers stay cached until the TTL ends. Lower the TTL before a migration.

### 3. UDP is "bad"
- ❌ "UDP is unreliable, so never use it."
- ✅ It's fast and simple; the app handles loss. Video calls, games, DNS and QUIC use it.

### 4. CORS protects the server
- ❌ "CORS stops attackers calling my API."
- ✅ CORS is enforced by browsers only; curl/Postman ignore it. Use real auth.

### 5. Preflight surprises
- ❌ "My PUT with JSON fails with a CORS error but GET works."
- ✅ It needs an `OPTIONS` preflight; the server must answer it with the right headers.

### 6. Latency vs bandwidth
- ❌ "More bandwidth will fix slow page loads."
- ✅ Many small requests are limited by latency (round trips), not bandwidth.

### 7. HTTP/2 needs bundling
- ❌ Merging all files into one giant bundle "for fewer requests".
- ✅ HTTP/2 sends many requests at once; split bundles for better caching.

### 8. WebSocket isn't HTTP
- ❌ "WebSockets don't use HTTP at all."
- ✅ They start as an HTTP request with `Upgrade: websocket` (status 101), then switch.

### 9. Ping fails = server down
- ❌ Concluding a host is down because `ping` fails.
- ✅ Many firewalls block ping (ICMP). Test the real port (`curl`, `nc`).
