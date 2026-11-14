# Interview question audit — technical topics (Nov 2026)

> **Status (14 Nov 2026): all done.**
> - Priority 1 + 2: 95 new questions, 37 Mermaid diagrams (all parse), 10 images.
> - Priority 3: 15 new questions, 3 diagrams, 1 more image (6 new images in total, credited in `knowledge/visual-notes/interview/CREDITS.md`).
> - Structural 1: the 44 untagged `08-Architecture.md` questions now have topics (section headings name their topic).
> - Structural 2: every technical question has a level — a `**Level:** 🟢 Beginner / 🟡 Intermediate / 🔴 Advanced` line under the question (read by the indexer, hidden from answers). 308 beginner · 926 intermediate · 61 advanced.
> - Structural 3: `04-Spring-annotation.md` is an overview plus 6 questions.
> - Structural 4: the near-duplicate pairs are merged.

**Scope:** every technical interview question in `interview/` and `practice/` — 1,182 questions in 56 files
(career, behavioral, leadership, agile and Under the Hood not included).
**Method:** read every question title, then grepped the answers for ~100 commonly asked interview concepts to tell apart:

- **Missing** — not in the notes at all.
- **Buried** — only mentioned inside another answer, with no question of its own. Search and question sets can't find it reliably, and an interviewer asks it directly.

## Verdict per topic

| Topic | Questions | Verdict | Biggest gap |
|---|---|---|---|
| RxJS | 60 | 🟢 Strong | — |
| Java (core + concurrency + output puzzles + coding) | ~165 | 🟢 Strong | HashMap internals and abstract class vs interface are buried; GC collectors and the Java memory model are missing |
| SQL & databases | ~70 | 🟢 Strong | ACID and clustered/composite index are buried |
| CSS | 47 | 🟢 Strong | animations/transitions, BEM / CSS architecture |
| React | 40 | 🟢 Strong | virtual DOM / reconciliation and Server Components missing |
| System design + distributed | 56 | 🟢 Strong | classic designs missing: YouTube, Uber, typeahead, web crawler, distributed cache |
| Spring Security + JWT | 37 | 🟢 Strong | OAuth2 flows (Authorization Code + PKCE, Client Credentials) missing |
| AI / LLM | 43 | 🟢 Strong | — |
| Design patterns | 24 | 🟢 Strong | — |
| Git, Observability, Terraform, Web Vitals, Testing | 13–20 each | 🟢 Good | small items only (see below) |
| JavaScript | 47 + 21 coding | 🟡 Good, gaps | event loop is buried; memory leaks / GC missing |
| Angular | 29 + 3 coding | 🟡 Gaps | change detection / OnPush, signals, interceptors, lazy loading are all buried |
| Spring Boot | 33 + 81 scenarios | 🟡 Gaps | no direct question for auto-configuration, `@SpringBootApplication`, DispatcherServlet request flow |
| Node.js | 29 | 🟡 Gaps | EventEmitter, graceful shutdown missing; `nextTick` vs `setImmediate` buried |
| Python | 23 | 🟡 Gaps | LEGB/closures, iterators, MRO missing |
| AWS | 31 | 🟡 Gaps | Multi-AZ vs read replica, shared responsibility, Lambda cold start missing |
| DevOps (Docker/K8s/CI) | 59 | 🟡 Gaps | container vs VM and blue-green/canary are buried; Docker networking missing |
| Caching & Redis | 16 | 🟡 Gaps | write-through / write-behind strategies, distributed lock missing |
| Networking | 14 | 🟡 Gaps | TCP vs UDP, TLS handshake and HTTP/1.1 vs 2 vs 3 are buried |
| Linux | 15 | 🟡 Gaps | hard vs soft links, cron, inodes missing |
| DSA | 40 + 25 LeetCode | 🟡 Gaps | hashing/collisions, greedy, union-find, bit manipulation missing |
| **TypeScript** | **10** | 🔴 Thin | only 10 questions — unions/narrowing, enums, conditional types, `satisfies`, `.d.ts`, tsconfig need their own questions |
| **Microservices** | **5** (+ Spring Cloud 23) | 🔴 Thin | CQRS and event sourcing missing; Saga, database-per-service, service discovery only buried |
| **Kafka & RabbitMQ** | **12** | 🔴 Thin | RabbitMQ exchange types missing; delivery guarantees, DLQ and rebalancing buried |

## What to add, in priority order

### 🔴 Priority 1 — asked in almost every interview, missing or buried

| Topic | Add these questions |
|---|---|
| JavaScript | Explain the event loop (call stack, microtasks, macrotasks) · What causes memory leaks in JS? |
| TypeScript | Union & intersection types · Type narrowing and type guards · Discriminated unions · Enum vs union of strings · `any` vs `unknown` · Conditional types and `infer` · `keyof` / `typeof` / indexed access · `satisfies` · `tsconfig` strict mode · Access modifiers & abstract classes |
| Angular | How does change detection work (Zone.js)? · Default vs OnPush · Signals: `signal`, `computed`, `effect` · Component communication (`@Input`, `@Output`, services) · HTTP interceptors · Lazy loading routes · `@defer` |
| Java | How does HashMap work internally? · Abstract class vs interface · Generics, wildcards and type erasure (PECS) · Garbage collectors (G1, ZGC) · Java memory model / happens-before |
| Spring Boot | How does auto-configuration work? · What is in `@SpringBootApplication`? · Spring MVC request flow (DispatcherServlet) · Constructor vs field injection · `@Component` vs `@Bean` |
| Microservices | Saga: choreography vs orchestration · Database per service · CQRS · Event sourcing · Service discovery · Strangler fig migration |
| Kafka & RabbitMQ | Kafka delivery guarantees (acks, idempotent producer, exactly-once) · Dead letter queues and retries · Consumer group rebalancing · RabbitMQ exchange types · Idempotent consumers · Ordering guarantees |
| Networking | TCP vs UDP · How does HTTPS / the TLS handshake work? · HTTP/1.1 vs HTTP/2 vs HTTP/3 · What happens when you type a URL? (exists only in Under the Hood — add a short interview version) |
| DevOps | Container vs virtual machine · Image vs container · Blue-green vs canary vs rolling deployments |

### 🟡 Priority 2 — common, worth adding

| Topic | Add these questions |
|---|---|
| AWS | RDS Multi-AZ vs read replica · Shared responsibility model · Security Group vs NACL (buried) · Lambda cold starts · Well-Architected pillars |
| Caching | Caching strategies: cache-aside, read-through, write-through, write-behind · Distributed lock with Redis |
| System design | Design YouTube (video streaming) · Design Uber (location matching) · Design typeahead/autocomplete · Design a web crawler · Design a distributed key-value cache · Sharding as its own question |
| Spring Security | OAuth2 flows: Authorization Code + PKCE, Client Credentials · Spring Security 6 `SecurityFilterChain` config · `@PreAuthorize` method security |
| Node.js | `process.nextTick` vs `setImmediate` · EventEmitter · Graceful shutdown · Unhandled promise rejections · Cluster vs worker threads |
| Python | LEGB scope and closures · Mutable default argument trap (buried) · Iterators vs iterables · MRO / multiple inheritance · `__new__` vs `__init__` |
| SQL | ACID (own question) · Clustered vs non-clustered index · Composite index & leftmost prefix · Covering index · MVCC |
| React | Virtual DOM & reconciliation · React Server Components · `useReducer` · Portals |
| DSA | How does a hash table handle collisions? · Heap / priority queue basics · Greedy pattern · Union-find · Bit manipulation basics · LeetCode: Trapping Rain Water, Word Break, House Robber, Longest Palindromic Substring, Rotting Oranges |
| Web architecture | CSR vs SSR vs SSG vs ISR (one comparison question) · Micro-frontends · PWA / Service Workers |

### 🟢 Priority 3 — nice to have

- **HTML:** forms and input validation · block vs inline · `<picture>`/`srcset`/lazy images · `iframe` sandbox
- **CSS:** transitions vs `@keyframes` · BEM / CSS Modules / Tailwind · reflow vs repaint (own question)
- **Linux:** hard vs soft links · inodes (`df -i`) · cron · `kill -9` vs `kill -15`
- **Docker:** Docker networking (bridge, host)
- **Testing:** contract testing with Pact (own question) · testing async code
- **AI:** LoRA / quantization · open-weight vs API models

## Structural issues found

1. **44 questions have no topic.** Every question in `interview/backend/java/08-Architecture.md` (data-table performance, REST structure, DB scaling, frontend–backend collaboration) has an empty topic list, so it never appears when browsing a topic or building a question set. Tag them (`spring`, `database/sql`, `angular`, `system-design`, `web-architecture`).
2. **Difficulty is set on only 136 of 1,182 questions (12%).** Level-based prep ("give me beginner Java") can't work well until most questions are tagged beginner / intermediate / advanced.
3. **`04-Spring-annotation.md` is one giant question.** Split it into one question per annotation group (stereotypes, web, config, JPA, transactions) so each can be found and asked on its own.
4. **Near-duplicates to merge:** "Two users update the same record at the same time" (System Design + twice in 08-Architecture) · "When would you avoid synchronous REST calls?" / "When would you avoid REST between services?" · "Why do we need a gateway?" / "Why do we need an API Gateway in microservices?" (Spring Cloud).
5. **Microservices file is a single case study.** `interview/architecture/microservice-architecture.md` has 5 questions, all about one payment design. Add a general microservices question file (Priority 1 list above).

## Bottom line

The notes are **strong for Java, SQL, RxJS, React, system design, Spring Security and AI** — deeper than most interview guides.
They are **not yet strong enough for TypeScript, microservices and messaging**, and several of the most asked questions in Angular, JavaScript, Spring Boot and networking are only buried inside other answers.
Adding the **Priority 1 list (about 60 questions)** and fixing **structural issues 1–3** would close the important gaps.
