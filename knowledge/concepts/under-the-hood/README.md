# Under the Hood: How Software Works Internally

## Purpose

Understand how technologies work **internally**: what happens step by step, how it is implemented, why it was designed that way, and how to observe it yourself. The goal is understanding, not memorising definitions.

## How Every Answer Is Explained

1. **What is it?** — simple meaning, why it exists, what problem it solves.
2. **How does it work internally?** — step-by-step flow, components, how data moves.
3. **Visual** — a diagram with arrows, inputs, outputs, file types, memory areas or protocols.
4. **Internal implementation** — the real algorithms, data structures and mechanisms.
5. **Why is it designed this way?** — trade-offs, alternatives, performance.
6. **Language / framework differences** — how Java, JavaScript, Python, C/C++, Rust, Go, C# etc. differ.
7. **Practical example** — small, realistic (Java, Spring Boot, Angular, JavaScript, SQL first).
8. **How can I observe it?** — tools, commands and what the output means.

Rules: simple English, short paragraphs, diagrams over long text, no repetition, compile time vs runtime kept separate, version differences stated.

## Master Roadmap

✅ = written in the notes (all sections are complete).

### 1. Programming Languages, Compilers & Execution ✅

Notes: `interview/under-the-hood/01-Languages-Compilers-Execution.md`

- Source code → machine instructions
- Compiler, Interpreter, Assembler, Linker, Runtime
- Bytecode, IR, Assembly, Machine Code
- AOT vs JIT vs interpretation
- How JVM, CLR and JavaScript engines execute programs
- How languages interact with the CPU and memory
- How languages differ in compilation, execution and memory management
- Frontend languages and frameworks: source → browser → CPU
- Do backend frameworks compile code themselves?

### 2. Operating System, CPU & Memory ✅

Notes: `interview/under-the-hood/02-OS-CPU-Memory.md`

CPU instruction execution · registers, L1/L2/L3 cache, RAM, disk · stack vs heap · how programs reach objects in RAM · allocation and deallocation · garbage collection · processes and threads · context switching · running many apps at once · virtual memory, paging, memory protection.

### 3. Frontend & Browser Internals ✅

Notes: `interview/under-the-hood/03a-Browser-Internals.md` and `interview/under-the-hood/03b-Frontend-Framework-Internals.md`

Entering a URL · HTML/CSS/JS → pixels · DOM, CSSOM, render tree, layout, paint · JavaScript in the browser · call stack, event loop, microtasks, tasks · non-blocking async · deciding what to re-render · Angular, React, Vue change detection · frontend ↔ backend communication · bundlers, tree shaking, code splitting · cache, cookies, LocalStorage, SessionStorage, IndexedDB · tabs and Web Workers.
Angular: bootstrap and compilation, DI, lifecycle, change detection and Signals, router and lazy loading, HttpClient and interceptors.
React: virtual DOM, reconciliation, Fiber, hooks, rendering. Vue: reactivity, dependency tracking, Proxy-based reactivity, virtual DOM.

### 4. Backend & Server Internals ✅

Notes: `interview/under-the-hood/04-Backend-Server-Internals.md`

What a server is · localhost vs physical server vs VM · listening on IPs and ports · web server vs application server vs reverse proxy · Tomcat internals · embedded Tomcat in Spring Boot · an HTTP request inside Spring Boot · Spring DI · AOP, proxies and `@Transactional` · concurrent requests and threads · connection pooling · authentication and authorization · exceptions, retries, timeouts.
Compare: Spring Boot, Django, Flask, FastAPI, ASP.NET Core, Express.js, NestJS, Laravel, Ruby on Rails.

### 5. Database Internals ✅

Notes: `interview/under-the-hood/05-Database-Internals.md`

Records on disk · pages, blocks, rows · indexing · B-Tree vs B+ Tree · clustered, non-clustered, composite indexes · index seek vs table scan · query optimizer · JOIN internals: nested loop, hash, merge · concurrent transactions · ACID, locks, MVCC · write-ahead logging · crash recovery · database caching · replication, partitioning, sharding.

### 6. Data Structures & Algorithms – Internal Implementation ✅

Notes: `interview/under-the-hood/06-Data-Structures-Internals.md`

HashMap: hashing, buckets, collisions · why a hash can't be reversed · ArrayList vs LinkedList vs arrays · stack, queue, heap, priority queue · BST, AVL, Red-Black, B+ Tree · how HashSet ensures uniqueness · searching and sorting internals · complexity vs real performance.

### 7. Networking & Communication ✅

Notes: `interview/under-the-hood/07-Networking-Internals.md`

Data travelling between computers · IP, MAC, DNS, ports, routing · TCP vs UDP · TCP connections · HTTP/1.1 vs HTTP/2 vs HTTP/3 · HTTPS and the TLS handshake · public/private key cryptography · proving possession of a private key · certificates and CAs · WebSockets · load balancers, reverse proxies, API gateways.

### 8. Cloud, Virtualization & Deployment ✅

Notes: `interview/under-the-hood/08-Cloud-Virtualization-Deployment.md`

Virtual machines · hypervisors · Docker internals · containers vs VMs · images vs containers · Kubernetes scheduling · source code → production · CI/CD · cloud resource allocation · auto scaling and load balancing · secrets and configuration.

### 9. Storage, Caching & Message Processing ✅

Notes: `interview/under-the-hood/09-Storage-Caching-Messaging.md`

HDD vs SSD vs RAM · file systems · Redis internals · cache-aside, write-through, write-behind · Kafka storage and throughput · partitions, offsets, consumer groups · RabbitMQ exchanges, queues, bindings · acknowledgements, retries, dead-letter queues · message ordering · reliable processing.

### 10. Distributed Systems & Microservices ✅

Notes: `interview/under-the-hood/10-Distributed-Systems-Internals.md`

Service communication · service discovery · circuit breakers, retries, timeouts · idempotency · distributed transactions · Saga · consistency · replication and leader election · distributed locking · distributed tracing.

### 11. Language Implementation Comparisons ✅

Notes: `interview/under-the-hood/11-Language-Implementation-Comparisons.md` (concurrency, object creation, DI, async, exceptions). Compilation, memory management and GC are compared in Sections 1 and 2.

| Concept | Compare |
|---|---|
| Compilation and execution | Java, Python, JavaScript, C, C++, Rust, Go, C# |
| Memory management | Java, C++, Rust, Python, Go, C# |
| Garbage collection | Java, C#, Python, Go, JavaScript |
| Concurrency | Java, JavaScript, Python, Go, Rust, C# |
| Object creation | Java, C++, Python, JavaScript |
| Dependency injection | Java/Spring, C#/ASP.NET Core, Angular |
| Asynchronous execution | Java, JavaScript, Python, C#, Kotlin |
| Exception handling | Java, Python, C++, C#, JavaScript |

### 12. Tools to Observe Internals ✅

Notes: `interview/under-the-hood/11-Language-Implementation-Comparisons.md` (last question), plus part 8 of every answer.

| Area | Tools |
|---|---|
| Java / JVM | IntelliJ debugger, VisualVM, JConsole, JFR, `javap` |
| JavaScript / browser | Chrome DevTools |
| Angular | Angular DevTools |
| Database | Execution plans, `EXPLAIN`, statistics IO |
| Networking | Wireshark, browser Network tab |
| Memory | VisualVM, Java Flight Recorder |
| Operating system | Task Manager, Process Explorer |
| Docker | Docker CLI, Docker Desktop |
| Redis | `redis-cli` |
| Kafka | Kafka CLI and monitoring tools |

### 13. Method for Every Topic

1. **Internal working** — what happens step by step?
2. **Implementation** — which data structures, algorithms and components?
3. **Design reasoning** — why this way, and what are the alternatives?
4. **Observation** — how to reproduce, debug or measure it.

## Where to Practise

- `interview/under-the-hood/01-Languages-Compilers-Execution.md`
- `interview/under-the-hood/02-OS-CPU-Memory.md`
- `interview/under-the-hood/03a-Browser-Internals.md`
- `interview/under-the-hood/03b-Frontend-Framework-Internals.md`
- `interview/under-the-hood/04-Backend-Server-Internals.md`
- `interview/under-the-hood/05-Database-Internals.md`
- `interview/under-the-hood/06-Data-Structures-Internals.md`
- `interview/under-the-hood/07-Networking-Internals.md`
- `interview/under-the-hood/08-Cloud-Virtualization-Deployment.md`
- `interview/under-the-hood/09-Storage-Caching-Messaging.md`
- `interview/under-the-hood/10-Distributed-Systems-Internals.md`
- `interview/under-the-hood/11-Language-Implementation-Comparisons.md`
