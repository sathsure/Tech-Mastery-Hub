# Networking & HTTP — Cheat Sheet

> **In one line:** how data travels between computers (IP, TCP, DNS) and how the web talks on top of it (HTTP, HTTPS).

## Layers (simple view)
- **Application** — HTTP, DNS, SMTP, SSH (what apps speak).
- **Transport** — TCP, UDP (how data is delivered).
- **Network** — IP, routers (how data finds the way).
- **Link / Physical** — Ethernet, Wi-Fi, cables, MAC addresses.
- The **OSI model** splits these into 7 layers: Physical, Data link, Network, Transport, Session, Presentation, Application.

## TCP vs UDP
| | TCP | UDP |
|---|---|---|
| Connection | yes (handshake first) | no |
| Reliable, in order | yes | no |
| Speed | slower | faster |
| Used for | web, email, databases | video calls, games, DNS |
- **3-way handshake** — `SYN` → `SYN-ACK` → `ACK`.

## IP addresses & ports
- **IPv4** `192.168.1.10`; **IPv6** is much longer.
- **Private IPs** (`10.x`, `192.168.x`) stay inside a network; **NAT** lets them share one public IP.
- **DHCP** — gives devices an IP automatically.
- **Port** — which program on the machine: 22 SSH, 53 DNS, 80 HTTP, 443 HTTPS, 3306 MySQL, 5432 Postgres, 6379 Redis.

## DNS
Turns `example.com` into an IP. Order: browser cache → OS → resolver → root → `.com` server → the domain's own server.
- Records: **A** (IPv4), **AAAA** (IPv6), **CNAME** (alias), **MX** (email), **TXT** (verification).
- **TTL** — how long the answer may be cached.

## HTTP
- A request has a method, path, headers and maybe a body. A response has a status code, headers and a body.
- **Stateless** — each request stands alone; cookies add memory.
- **HTTP/1.1** — one request at a time per connection.
- **HTTP/2** — many requests at once over one connection.
- **HTTP/3** — runs over **QUIC** (UDP): faster setup, no blocking on lost packets.

## HTTPS / TLS
- Encrypts traffic and proves the server is real (via a **certificate** signed by a trusted authority).
- **Handshake** — agree on encryption using public/private keys, then switch to a fast shared key.
- **mTLS** — both sides show certificates (service to service).

## Cookies & CORS
- Cookie flags: `HttpOnly` (JavaScript can't read it), `Secure` (HTTPS only), `SameSite` (limits cross-site sending).
- **Same origin** = same scheme + host + port.
- **CORS** — the server says which other origins may call it. Some requests send a **preflight** `OPTIONS` first.

## Real-time options
- **Polling** — ask every few seconds.
- **Long polling** — the server holds the request until there's news.
- **SSE** — server pushes to the client over HTTP.
- **WebSocket** — open two-way connection.

## Devices & words
- **Switch** — connects devices in a network. **Router** — connects networks.
- **Firewall** — allows/blocks traffic. **Load balancer** — spreads traffic. **VPN** — encrypted tunnel.
- **Latency** — delay. **Bandwidth** — capacity. **Throughput** — what you actually get.

## Debug tools
`ping` · `traceroute` · `dig` / `nslookup` · `curl -v` · `ss` / `netstat` · Wireshark · browser DevTools Network tab.
