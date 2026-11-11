# Under the Hood: How Software Works Inside

## Purpose

Understand what really happens when code runs — explained simply, with an everyday analogy and a picture for each idea. Only the questions interviewers ask most.

**The big picture in one line:** data organised in **RAM** inside a running program is a **data structure**; data organised on **disk** is managed by a **database (DBMS)**; data collected across **many servers** for analysis lives in a **data warehouse**. Everything below explains how each layer works.

## Sections (and who they apply to)

| # | Section | Applies to |
|---|---|---|
| 1 | How code runs: compilers, interpreters, JIT, JVM and V8 | All languages (Java & JavaScript runtimes as examples) |
| 2 | Memory & data: RAM vs disk vs warehouse, stack vs heap, garbage collection, virtual memory | All languages |
| 3 | Processes & threads: context switching, concurrency vs parallelism, race conditions | Operating system — every language |
| 4 | Inside data structures: HashMap, ArrayList vs LinkedList, stacks/queues/heaps, B+ trees | Every language (Java examples) |
| 5 | Inside a database: pages, indexes, transactions and the log, MVCC, replication vs sharding | SQL databases |
| 6 | Inside the browser: URL to page, rendering, event loop, framework updates, storage | Frontend |
| 7 | Inside a web server: servers and ports, a request inside Spring Boot, dependency injection, connection pools | Backend (Spring Boot examples) |
| 8 | How data travels: TCP/IP layers, DNS, TCP vs UDP, HTTPS/TLS | Networking — every language |
| 9 | Virtual machines & containers: VM vs container, Docker images, Kubernetes, CI/CD | Cloud & DevOps |
| 10 | Many servers: scaling, caching, message queues, resilience, CAP | System design — every language |
| 11 | Bits, text and pictures: bits and bytes, data type sizes, 32 vs 64-bit, ASCII and Unicode, key codes, how images and icons are stored | Every computer |
| 12 | Inside the machine: why the CPU works from RAM, cores and GHz, booting, what an OS does, deleting and recovering files | Every computer |
| 13 | How the internet is connected: ISPs and backbones, fibre and undersea cables, light speed, Wi-Fi and mobile radio, modem vs router, IP vs MAC | Networking — everyone |
| 14 | How AI chatbots work: the full question-to-answer flow, tokens and embeddings, next-word prediction, fetching data (RAG, tools), GPUs | AI & LLMs — any language |
| 15 | Staying logged in: how sites remember you, cookies vs sessions vs JWT | Web — any backend |
| 16 | Config files in microservices: reading YAML, application.yml, manifest.yml, which file does what | Microservices (Spring Boot, Cloud Foundry, Kubernetes) |
| 17 | Local servers and finding devices: localhost, what ng serve really is, how servers are identified, how the internet finds your device (DHCP, NAT), firewalls | Frontend, backend and networking |
| 18 | Everyday tech: ZIP and JPEG compression, QR codes, password hashing, encryption and keys, sending an email, UPI payments, GPS, npm and Maven downloads | Everyone |

## How each answer is written

1. A one-line plain answer.
2. An everyday analogy.
3. A picture: a diagram or an image (Wikimedia Commons images are credited under each one).
4. The key points, then a small example.

## Where to Practise

- `interview/under-the-hood/` — 18 short files, one per section above.
