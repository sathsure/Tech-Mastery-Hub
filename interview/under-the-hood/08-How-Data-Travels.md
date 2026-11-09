# 📡 How Data Travels Across the Internet

## How data travels: packets, layers and DNS (networking, all languages)

### ❓ How does data travel from one computer to another?

Data is cut into small **packets**. Each packet is wrapped in layers of headers, like envelopes inside envelopes, sent through routers hop by hop, and reassembled at the other end.

The **TCP/IP model** has four layers:

| Layer | Job | Examples |
|---|---|---|
| **Application** | What the program says | HTTP, DNS, SMTP |
| **Transport** | Which program (port), reliable or not | TCP, UDP |
| **Internet** | Which computer (IP address), routing | IP |
| **Link** | The next hop on the local network | Ethernet, Wi-Fi |

![Packets flow down the layers on the sender, across routers, and up the layers on the receiver](https://upload.wikimedia.org/wikipedia/commons/c/c4/IP_stack_connections.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:IP_stack_connections.svg) · Kbrose · CC BY-SA 3.0_

**Analogy:** posting a parcel — the letter (HTTP) goes in an envelope with a flat number (port, TCP), inside a box with a street address (IP), carried by local delivery vans (Ethernet/Wi-Fi) from post office to post office (routers).

---

### ❓ How does DNS find a website's IP address?

DNS is the internet's phone book. When you type `shop.com`:

1. The browser and operating system check their **caches**.
2. If not found, a **resolver** (from your ISP, or 8.8.8.8 / 1.1.1.1) asks a **root server** → which points to the **`.com` server** → which points to **shop.com's own name server** → which returns the IP.
3. The answer is cached for its **TTL**, so most lookups take milliseconds.

![DNS resolution: the resolver asks the root, then the .com server, then the domain's own name server](https://upload.wikimedia.org/wikipedia/commons/a/a5/Example_of_an_iterative_DNS_resolver.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:An_example_of_theoretical_DNS_recursion.svg) · Lion Kimbro · Public domain_

**Common problems:** a DNS change "not working yet" is usually old cached answers waiting for their TTL to expire.

---

## TCP, UDP and HTTPS (networking, all languages)

### ❓ What is the difference between TCP and UDP?

- **TCP** — a **reliable conversation**. It sets up a connection first (the 3-way handshake), numbers every byte, re-sends anything lost, and delivers it **in order**. Used for web pages, APIs, email and databases.
- **UDP** — **fire and forget**. No connection, no guarantees, very little overhead. Used where speed beats perfection: video calls, games, DNS. HTTP/3 builds its own reliability on top of UDP (QUIC).

![TCP three-way handshake: SYN, SYN-ACK, ACK before any data is sent](https://upload.wikimedia.org/wikipedia/commons/9/98/Tcp-handshake.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tcp-handshake.svg) · CC BY-SA 3.0_

**Analogy:** TCP is a **registered parcel** with tracking and a signature; UDP is a **postcard** — usually arrives, but nobody checks.

---

### ❓ How does HTTPS keep data private (the TLS handshake)?

HTTPS is HTTP inside an encrypted **TLS** tunnel. Before any data is sent, the browser and server do a **TLS handshake**:

1. The browser says hello and lists the encryption methods it supports.
2. The server replies with its **certificate** (its public key, signed by a trusted Certificate Authority).
3. The browser **verifies** the certificate: trusted CA? right domain? not expired?
4. Both sides use **public-key cryptography** to agree on a shared secret **session key** — without ever sending it.
5. Everything after that is encrypted with that fast **symmetric** key.

![TLS handshake: hello messages, certificate, key exchange, then encrypted application data](https://upload.wikimedia.org/wikipedia/commons/d/d3/Full_TLS_1.2_Handshake.svg)

_Image: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Full_TLS_1.2_Handshake.svg) · Fleshgrinder · Public domain_

**Interview points:**
- Public-key crypto is slow, so it's used only to agree on the symmetric session key.
- The certificate proves you're talking to the real `bank.com`, not an impostor.
- TLS 1.3 (the current version) needs only one round trip for the handshake.
