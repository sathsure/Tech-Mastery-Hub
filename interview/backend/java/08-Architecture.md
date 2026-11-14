## Angular

### ❓ Our data table loads very slowly when there are thousands of rows. How would you improve its performance?

**Level:** 🟡 Intermediate

### 📝 Answer

I would use `virtual scrolling` so only visible rows are rendered. I’d also enable `OnPush change detection` to avoid unnecessary re-renders and load data using `pagination` instead of fetching everything at once.

---

### ❓ Scrolling the data table feels laggy. What would you check first?

**Level:** 🟡 Intermediate

### 📝 Answer

First, I’d check if the table is rendering too many DOM elements. I’d use `cdk-virtual-scroll-viewport` and make sure `trackBy` is used in `*ngFor` to reduce DOM updates.

---

### ❓ Sorting and filtering freeze the UI for a moment. How would you fix this?

**Level:** 🟡 Intermediate

### 📝 Answer

I would move heavy operations like sorting and filtering to the backend or use `Web Workers`. On the UI side, I’d debounce inputs using `RxJS debounceTime`.

- **Why it freezes:** JavaScript runs on one main thread, so sorting 50,000 rows blocks clicks and scrolling until it finishes.
- **Web Worker:** runs the sort on a background thread and posts the result back, so the UI stays responsive.
- **Debounce:** `debounceTime(300)` waits until the user stops typing, so "angular" triggers 1 filter instead of 7.

---

### ❓ After adding a data-table library, the bundle size increased a lot. What would you do?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d analyze the bundle using `source-map-explorer` or `webpack-bundle-analyzer`. Then I’d import only required modules and remove unused features using `tree-shaking`.

---

### ❓ The data table is not needed on the home page, but it still affects load time. How would you handle this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `lazy loading` so the table module loads only when the user navigates to that page. This keeps the initial bundle small.

- Example route: `{ path: 'reports', loadComponent: () => import('./reports.component') }` — the table code is downloaded only when `/reports` opens.
- For a table lower down the same page, Angular's `@defer (on viewport)` delays it until the user scrolls to it.

---

### ❓ The table works fine locally but is slow in production. How would you debug this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d check if `production mode` is enabled and verify network performance. I’d also confirm that `GZip` compression is enabled on the server and inspect API response sizes in DevTools.

---

### ❓ API responses are very large and slow down table loading. What would you suggest?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d reduce payload size by sending only required fields and enable `GZip` compression. I’d also add `server-side pagination` to avoid sending all rows at once.

- Example: `GET /orders?page=0&size=50&sort=date,desc` returns 50 rows plus a total count, instead of 20,000 rows.
- The table then asks the server for the next page, sort or filter, and stays fast however large the data grows.

---

### ❓ How would you verify if GZip compression is working?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d open browser DevTools → Network tab and check the response headers for `content-encoding: gzip`. I’d also compare response size before and after compression.

---

### ❓ Two users see different data in the table at the same time. How would you handle this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d make sure data comes from a centralized backend and handle updates using `WebSockets` or periodic polling. I’d avoid sharing table state in global memory without isolation.

---

### ❓ Filters applied by one user should not affect another user. How would you ensure this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d keep filters in `component-level state` or `route query params`, not in shared services. Each user session should manage its own state.

- Each browser runs its own copy of the Angular app, so the real risk is **shared state on the server** (a static field or cache keyed without the user ID).
- Query params also make filters shareable and survive refresh: `/orders?status=open&page=2`.

---

### ❓ The table data reloads again and again when navigating back. How would you optimize this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d cache data in a service using `RxJS shareReplay` or a state manager like `NgRx`. This avoids unnecessary API calls.

- `shareReplay(1)` keeps the last API result, so returning to the page reuses it instead of calling the API again.
- Add a way to refresh (a button or a short expiry), otherwise users may see stale data.

```ts
orders$ = this.http.get<Order[]>('/api/orders').pipe(shareReplay(1));
```

---

### ❓ How would you decide between using a table library or building your own?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d check requirements like performance, customization, and bundle size. If needs are simple, I’d build a custom table. For complex features, I’d choose a well-optimized library.

---

### ❓ A table library causes performance issues but is used across the app. What would you do?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d first profile it using `Angular DevTools`. If issues persist, I’d wrap it with `OnPush`, disable unused features, or plan a phased replacement.

- **Profile first:** Angular DevTools shows which component re-renders most and how long change detection takes.
- **Wrap it:** put the library behind your own `<app-table>` component, so you can swap it later in one place instead of 40 screens.

---

### ❓ The table shows user-generated content. How would you keep it secure?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d rely on Angular’s built-in `XSS protection` and avoid using `innerHTML`. If needed, I’d carefully use `DomSanitizer`.

- Angular escapes `{{ value }}` by default, so `<script>alert(1)</script>` shows as plain text instead of running.
- `bypassSecurityTrustHtml` turns this protection off — use it only for HTML you trust.
- The backend should also validate input; frontend protection alone is not enough.

---

### ❓ How would you measure table performance in real user environments?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `browser performance APIs`, add custom metrics, and monitor using tools like `Lighthouse` or real-user monitoring dashboards.

- **Lighthouse** tests in a lab (one machine); **real-user monitoring** (RUM) shows what actual users on slow phones experience.
- Custom timing example: `performance.mark('table-start')` … `performance.measure('table-render', 'table-start')`, then send the result to your analytics.
- Track Core Web Vitals like INP (how fast the page responds to clicks).

---

### ❓ A fix for table performance needs major refactoring. How would you plan it?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d break it into phases, start with high-impact fixes like `lazy loading` and `virtual scroll`, and align changes with business priorities to reduce risk.

- Measure before and after each phase (for example, render time from 4s → 1s), so the gains are visible.
- Ship each phase separately behind a feature flag, so a problem can be switched off without a rollback.

---

## 🌐 REST API & Controller Design

### ❓ Our REST API is getting hard to maintain as features grow. How would you structure controllers better?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d keep controllers thin and move logic to `Service` classes. Each controller should handle only request/response mapping using `@RestController`.

- Typical layers: **Controller** (HTTP in/out) → **Service** (business rules) → **Repository** (database).
- Split controllers by resource (`OrderController`, `PaymentController`), not one giant controller.
- Thin controllers are also easier to test, because the business logic in services can be tested without HTTP.

---

### ❓ Multiple controllers are returning different response formats. How would you standardize this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d create a common response wrapper and use `ResponseEntity`. For errors, I’d centralize handling using `@ControllerAdvice`.

- Example error shape every endpoint returns: `{ "status": 404, "error": "NOT_FOUND", "message": "Order 42 not found" }`.
- Spring Boot 3 supports the standard **ProblemDetail** (RFC 7807) format for errors out of the box.
- One format means the frontend writes error handling once.

---

### ❓ One controller method is doing validation, business logic, and DB calls. How would you fix this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d separate concerns: validation with `@Valid`, business logic in `Service`, and DB access in `Repository`. Controllers should stay lightweight.

```java
@PostMapping("/orders")
public ResponseEntity<OrderDto> create(@Valid @RequestBody CreateOrderRequest req) {
    return ResponseEntity.status(201).body(orderService.create(req)); // logic lives in the service
}
```

- Each layer now has one reason to change, and each can be tested on its own.

---

## 🚀 Performance & Scalability (Spring Boot)

### ❓ Our API becomes slow when traffic increases. What would you check first?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d check DB queries, add `indexes`, and monitor thread usage. I’d also review connection pooling using `HikariCP`.

- Under load the usual bottleneck is the **database**: slow queries or all pool connections busy (callers wait for a free one).
- Use metrics, not guesses: Actuator/Prometheus show response times, active DB connections and thread counts.
- If the app itself is the limit, scale out with more instances behind a load balancer and cache frequent reads.

---

### ❓ A single API call returns a very large response and affects performance. How would you optimize it?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d introduce `pagination`, return only required fields using DTOs, and enable `GZip` compression at the server level.

- Example: `GET /orders?page=0&size=20` instead of returning 50,000 orders at once.
- In Spring Data, a `Pageable` parameter adds `LIMIT`/`OFFSET` to the query for you.
- Smaller responses mean less memory on the server, faster transfer and quicker rendering in the UI.

---

### ❓ How would you reduce repeated database calls for the same data?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d add caching using `@Cacheable` with tools like `Redis` or in-memory cache to reduce DB load.

```java
@Cacheable(value = "products", key = "#id")
public Product getProduct(Long id) { return repo.findById(id).orElseThrow(); }
```

- The first call hits the DB; later calls with the same `id` come from the cache.
- Clear the entry on updates with `@CacheEvict`, and enable caching with `@EnableCaching`.

---

## 📦 Spring Boot Configuration & Production Readiness

### ❓ Our application behaves differently in local and production environments. How would you manage this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `Spring Profiles` with separate configs like `application-dev.yml` and `application-prod.yml`.

- Activate a profile with `spring.profiles.active=prod` (or the `SPRING_PROFILES_ACTIVE` environment variable).
- Common settings stay in `application.yml`; each profile file overrides only what differs (DB URL, log level).
- Keep secrets out of the files: pass them as environment variables or from a secret manager.

---

### ❓ How would you make sure debug logs don’t affect production performance?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d control logging using `logback` levels and disable unnecessary logs in the `prod` profile.

- Example: `logging.level.root=INFO` in prod, `DEBUG` only for one package while investigating.
- Use placeholders, `log.debug("Order {}", id)`, so the message is not built when DEBUG is off.
- Too many logs cost disk, network and log-tool money, not just CPU.

---

### ❓ The app startup time increased after adding new modules. How would you improve it?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d review unnecessary `@ComponentScan`, reduce auto-configurations, and enable `lazy initialization` if needed.

- `spring.main.lazy-initialization=true` creates beans only when first used, so startup is faster (but errors appear later).
- The Actuator `/startup` endpoint (with `BufferingApplicationStartup` enabled) shows which beans take the longest to start.
- For very fast startup (serverless, scale-to-zero), Spring Boot supports GraalVM native images.

---

## 🔐 Security & Validation

### ❓ How do you protect REST APIs from invalid or malicious input?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `Bean Validation` with `@NotNull`, `@Size`, and `@Valid`. I’d also sanitize inputs and rely on Spring’s security filters.

```java
public record CreateUserRequest(@NotBlank String name, @Email String email, @Size(max = 200) String bio) {}
```

- `@Valid` on the controller parameter rejects bad input with **400 Bad Request** before your code runs.
- Use parameterized queries (JPA does this) to block SQL injection, and add rate limiting against abuse.

---

### ❓ How would you secure APIs so only authorized users can access them?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `Spring Security` with `JWT` or `OAuth2`, and secure endpoints using `@PreAuthorize`.

- **Authentication** checks who you are (a valid JWT); **authorization** checks what you may do (role or ownership).
- Example: `@PreAuthorize("hasRole('ADMIN')")` on a delete endpoint; enable it with `@EnableMethodSecurity`.
- Always check ownership too: user 5 must not read `/orders/99` if order 99 belongs to user 7.

---

## 🧠 Exception Handling & Reliability (Spring Boot)

### ❓ When an exception happens, users see different error messages. How would you fix this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d centralize exception handling using `@ControllerAdvice` and return consistent error responses.

```java
@RestControllerAdvice
class GlobalErrors {
    @ExceptionHandler(OrderNotFoundException.class)
    ResponseEntity<ProblemDetail> notFound(OrderNotFoundException e) {
        return ResponseEntity.status(404).body(ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage()));
    }
}
```

- Never send stack traces to users; log them on the server instead.

---

### ❓ How would you handle checked and unchecked exceptions in services?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d convert low-level exceptions into meaningful custom exceptions and handle them globally.

- Example: catch a low-level `SQLException` and throw `OrderNotFoundException` — the caller understands it.
- Spring prefers **unchecked** exceptions; by default `@Transactional` rolls back only on unchecked ones.
- Keep the original as the cause (`new MyException("msg", e)`) so the real reason stays in the logs.

---

## 👥 Concurrent Users & Data Consistency (Spring Boot & SQL)

### ❓ Two users update the same record at the same time. How would you handle this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `optimistic locking` with `@Version` to avoid data conflicts.

- A `@Version` column is checked on every update: `UPDATE ... WHERE id=1 AND version=3`.
- If someone else saved first, the version no longer matches, and the second save fails with `OptimisticLockException`.
- The app then tells the user "this record changed, please reload" instead of silently overwriting their work.

```java
@Entity
class Product {
  @Id Long id;
  @Version private Long version;   // JPA increments it on every update
}
```

- Best when conflicts are **rare** — nothing is locked while users read. On `OptimisticLockException`, retry or ask the user to reload.
- When conflicts are **frequent and costly** (last seat, last item in stock), use pessimistic locking instead (see below).

---

### ❓ How do you ensure thread safety in a Spring Boot application?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d keep beans `stateless`, avoid shared mutable data, and rely on Spring’s default singleton behavior carefully.

- Spring beans are **singletons** by default: one instance shared by all request threads.
- So never keep request data in a bean field; use local variables or method parameters instead.
- When shared state is needed, use thread-safe types like `ConcurrentHashMap` or `AtomicInteger`.

---

## 🧪 Testing & Monitoring

### ❓ How would you test REST controllers properly?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `@WebMvcTest` with `MockMvc` to test controllers independently from services.

```java
@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired MockMvc mvc;
    @MockitoBean OrderService service;   // @MockBean before Spring Boot 3.4

    @Test void returnsOrder() throws Exception {
        when(service.find(1L)).thenReturn(new OrderDto(1L, "OPEN"));
        mvc.perform(get("/orders/1")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("OPEN"));
    }
}
```

- `@WebMvcTest` loads only the web layer, so tests are fast; check status codes, JSON and validation errors.

---

### ❓ How would you monitor API performance in production?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `Spring Actuator` for health and metrics, and integrate with monitoring tools like `Prometheus`.

- Add `micrometer-registry-prometheus`; Actuator then exposes `/actuator/prometheus` with request counts and timings.
- **Grafana** draws dashboards from Prometheus and sends alerts (for example, when p95 latency > 500 ms).
- Distributed tracing (OpenTelemetry) shows which service in a chain made a request slow.

---

## 🧭 Managerial & Design Decisions (Leadership)

### ❓ The team is divided between quick fixes and long-term refactoring. How would you decide?

**Level:** 🔴 Advanced

### 📝 Answer

I’d prioritize business impact, fix critical issues first, and plan refactoring in phases to reduce risk.

- Use data: how often does this area cause bugs or slow down new features?
- A common compromise: ship the quick fix now, and book refactoring time in the next sprints (for example, 20% of capacity).
- Write the decision down so the team agrees and the debt is tracked.

---

### ❓ How would you explain a REST API performance issue to a non-technical manager?

**Level:** 🔴 Advanced

### 📝 Answer

I’d explain it in terms of slow data fetching and system load, then outline clear steps and timelines to fix it.

- Use simple impact: "The orders page takes 8 seconds; 30% of users leave before it loads."
- Use an analogy: "Every request waits in one queue at the database, like a single billing counter."
- End with a plan: what we fix, how long it takes, and the expected result (8s → under 1s).

---

### ❓ If a breaking change is required in an API, how would you manage it?

**Level:** 🔴 Advanced

### 📝 Answer

I’d version the API using `/v1` and `/v2`, communicate changes early, and support backward compatibility.

- **Breaking** = removing or renaming a field, or changing its type; adding an optional field is not breaking.
- Run `/v1` and `/v2` side by side, announce a deprecation date, and track which clients still call `/v1`.
- The `Deprecation` and `Sunset` HTTP headers tell clients when the old version goes away.

---

## 🗄️ Database Design & Access (Spring Boot + SQL / MySQL)

### ❓ Our database tables are growing very fast and queries are getting slow. What would you check first?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d first analyze slow queries using `EXPLAIN` and add proper `indexes`. I’d also check if queries are fetching unnecessary columns.

- In the `EXPLAIN` output, `type: ALL` means a full table scan — a sign of a missing index.
- Avoid `SELECT *`; read only the columns you need.
- For very large tables, archive old rows or partition by date (for example, one partition per month).

---

### ❓ A single API call is hitting the database multiple times. How would you optimize this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d check for `N+1 query` issues and fix them using `JOIN FETCH` or proper `@EntityGraph` usage.

- **N+1 example:** 1 query loads 100 orders, then 100 more queries load each order's customer.
- Fix with one query: `SELECT o FROM Order o JOIN FETCH o.customer`.
- Turn on SQL logging (`spring.jpa.show-sql=true`) in development to spot it early.

---

### ❓ The same data is being read again and again from MySQL. How would you reduce DB load?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d add caching using `@Cacheable` with tools like `Redis` or in-memory cache to avoid repeated DB hits.

- Cache **read-heavy, rarely changing** data: product catalog, country list, configuration.
- Set an expiry (TTL) and evict on update, so users don't see stale data for long.
- Redis is shared by all app instances; an in-memory cache (Caffeine) is faster but separate on each instance.

---

## ⚙️ JPA / Hibernate Performance (Spring Boot & SQL)

### ❓ Our API is slow even though the database is fast. What could be the issue?

**Level:** 🟡 Intermediate

### 📝 Answer

It could be inefficient ORM usage. I’d review `lazy vs eager fetching`, unnecessary entity mappings, and excessive object creation by `Hibernate`.

- Each query may be fast, but the app may run **too many** of them (N+1), or load whole object graphs when only a few fields are needed.
- Other suspects: slow external calls, heavy JSON serialization, or waiting for a free pool connection.
- Measure where the time goes with tracing or the Actuator timing metrics.

---

### ❓ How do you decide between `Lazy` and `Eager` fetching?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d default to `FetchType.LAZY` and fetch data explicitly when needed to avoid loading unnecessary relations.

- **Lazy:** related data loads only when you access it. **Eager:** always loaded with the parent.
- `@ManyToOne` is EAGER by default in JPA, so set `fetch = FetchType.LAZY` explicitly.
- When a screen needs the relation, load it on purpose with `JOIN FETCH` or `@EntityGraph`.

---

### ❓ Large result sets are causing memory issues. How would you handle this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `pagination` with `LIMIT / OFFSET` and stream results when possible instead of loading everything into memory.

- Loading 1 million rows into a `List` can cause `OutOfMemoryError`.
- For exports or batch jobs, process in chunks (for example, 1,000 rows at a time) or use a `Stream<T>` query inside a transaction.
- For deep pages, keyset pagination (`WHERE id > :lastId LIMIT 50`) is faster than a large `OFFSET`.

---

## 🔄 Transactions & Data Consistency (Spring Boot & SQL)

### ❓ Multiple DB operations must succeed or fail together. How would you handle this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d wrap the logic in a `@Transactional` service method to ensure atomicity.

- Example: in a money transfer, the debit and credit commit together, or both roll back.
- `@Transactional` rolls back on unchecked exceptions by default; use `rollbackFor = Exception.class` for checked ones.
- It works through a proxy: calling the method from **inside the same class** skips the transaction.

---

### ❓ When would you use pessimistic locking?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use it only for critical updates where conflicts are costly, using `SELECT FOR UPDATE`.

- Example: booking the last seat or reducing stock, where two buyers must not both succeed.
- In JPA: `@Lock(LockModeType.PESSIMISTIC_WRITE)` on the repository method; other transactions wait until the lock is released.
- Keep these transactions short; long locks slow everyone down and can cause deadlocks.

---

## 👥 Concurrent Users & Scalability (Spring Boot & SQL)

### ❓ Under high traffic, DB connections are getting exhausted. How would you fix this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d tune the connection pool using `HikariCP` and make sure connections are released properly.

- A pool keeps a fixed set of open connections (HikariCP default: 10); requests wait when all are busy.
- A bigger pool is not always better: the database can handle only so many connections well.
- Usually the real fix is shorter transactions, faster queries, and no slow HTTP calls inside a transaction.

---

### ❓ How do you make sure multiple users don’t affect each other’s data?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d enforce data isolation using proper `WHERE` clauses, user-level filters, and avoid shared mutable state.

- Take the user ID from the security context (the JWT), never from a request field the client can change.
- Example: `SELECT * FROM orders WHERE id = ? AND user_id = ?`, so user 5 can't read user 7's order.
- Hibernate filters or database row-level security can apply this rule everywhere automatically.

---

## 📦 Query Design & DTO Usage (Spring Boot & SQL)

### ❓ Entities are large but APIs need only a few fields. What would you do?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `DTO projections` or `JPQL constructor expressions` instead of returning full entities.

- Example: `record OrderSummary(Long id, String status) {}` with `List<OrderSummary> findByUserId(Long userId);` — Spring Data selects only those columns.
- Fewer columns mean less DB work, less memory and smaller JSON responses.

---

### ❓ Why should controllers not return JPA entities directly?

**Level:** 🟡 Intermediate

### 📝 Answer

Because entities can expose unwanted data and cause `lazy loading` issues. DTOs give better control and performance.

- **Data leaks:** fields like `passwordHash` get serialized to JSON by mistake.
- **Errors:** lazy relations can throw `LazyInitializationException`, or loop forever in bidirectional mappings.
- **Coupling:** renaming a DB column would silently break the API contract.

---

## 🚀 Production Issues & Debugging (SQL & Observability)

### ❓ Queries work fine locally but are slow in production. How would you debug this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d check real data size, indexes, execution plans, and enable `slow query logs` in MySQL.

- Local DBs have 100 rows; production has millions, so a missing index only hurts there.
- MySQL: set `slow_query_log = ON` and `long_query_time = 1` to log queries slower than 1 second.
- Run `EXPLAIN` on the slow query with production-like data to see if it uses an index.

---

### ❓ After a release, database CPU usage increased suddenly. What would you check?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d review new queries, check missing indexes, and inspect Hibernate-generated SQL logs.

- Compare top queries before and after the release (MySQL Performance Schema or `SHOW PROCESSLIST`).
- Common causes: a new query without an index, an N+1 loop, or a removed cache.
- If users are hurt, roll back first, then investigate.

---

## 🔐 Data Safety & Integrity (SQL)

### ❓ How do you prevent invalid data from being saved in MySQL?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `Bean Validation` annotations and database constraints like `NOT NULL` and `UNIQUE`.

- Validate in **two places**: Bean Validation gives friendly errors to users; DB constraints are the final safety net.
- Example: `email VARCHAR(255) NOT NULL UNIQUE` blocks duplicates even if two requests arrive at the same moment.
- `FOREIGN KEY` and `CHECK (amount > 0)` constraints also protect data written by other apps or scripts.

---

### ❓ How do you handle soft deletes instead of hard deletes?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use a status flag like `is_deleted` and filter records at query level instead of deleting rows.

- Hibernate can apply it automatically: `@SQLDelete(sql = "UPDATE users SET is_deleted = true WHERE id = ?")` plus `@SQLRestriction("is_deleted = false")`.
- Soft delete keeps history and allows "undo", but unique constraints and table size need care.
- Laws like GDPR may still require deleting personal data for real.

---

## 🧪 Testing & Migration

### ❓ How do you manage database schema changes safely?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `Flyway` or `Liquibase` for versioned DB migrations instead of manual changes.

- Flyway runs versioned SQL files in order (`V1__create_users.sql`, `V2__add_phone.sql`) and records what already ran.
- Every environment gets the same schema, and changes are reviewed in Git like code.
- For zero downtime, make changes backward compatible: add a new column first, remove the old one in a later release.

---

### ❓ How would you test database logic without affecting real data?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `Testcontainers` or an in-memory DB for integration testing.

- **Testcontainers** starts a real MySQL in Docker for the test and throws it away afterwards.
- An in-memory DB like H2 is faster, but its SQL differs from MySQL, so some bugs slip through.
- `@DataJpaTest` tests only the repository layer and rolls back each test by default.

---

## 🧭 Managerial / Architectural Decisions (Leadership)

### ❓ When would you avoid using JPA and write native SQL instead?

**Level:** 🟡 Intermediate

### 📝 Answer

When performance is critical or queries are complex, I’d use `native queries` for better control.

- Examples: reporting queries with window functions, bulk updates of millions of rows, or database-specific features.
- In Spring Data: `@Query(value = "SELECT ...", nativeQuery = true)`.
- Trade-off: native SQL is tied to one database and loses JPA's entity tracking.

---

### ❓ How would you explain a database performance issue to management?

**Level:** 🔴 Advanced

### 📝 Answer

I’d explain it as inefficient data access and show how indexing, caching, and query optimization will reduce response time.

- Use an analogy: an index is like a book's index — without it, the database reads every page.
- Show numbers: "The report takes 12s; after adding an index it takes 0.3s."
- Give the cost and risk: effort, downtime (if any) and how you will verify it.

---

### ❓ If database refactoring is risky, how would you plan it?

**Level:** 🔴 Advanced

### 📝 Answer

I’d plan phased changes, add monitoring, test with real data volume, and roll out gradually.

- Use **expand → migrate → contract**: add the new column, copy data and write to both, then remove the old column later.
- Take a backup and test the rollback before starting.
- Run heavy changes on huge tables in batches or with online tools, so the table isn't locked for hours.

---

## 🔁 End-to-End System Thinking (System Design)

### ❓ A screen loads slowly, but it’s unclear whether the issue is frontend, API, or DB. How would you approach this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d break it down layer by layer: Angular network timing, REST API response time, and DB query time. I’d use `browser DevTools`, `Spring logs`, and DB metrics to isolate the bottleneck.

---

### ❓ Frontend says backend is slow, backend says frontend is inefficient. How would you resolve this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d rely on data, not opinions. I’d capture `API response times`, payload size, and DB execution time, then align both teams on facts.

- The browser Network tab splits each request: **Waiting (TTFB)** is server time, **Content download** is transfer time.
- Example: TTFB 3s → look at the backend; TTFB 100ms but the page still takes 4s → look at frontend rendering.
- Share one dashboard so both teams look at the same numbers.

---

## 🌐 API Design & Communication (REST API)

### ❓ Frontend needs frequent API changes, but backend releases are slower. How would you manage this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d design APIs to be flexible using `DTOs`, optional fields, and backward compatibility. I’d also version APIs when breaking changes are needed.

- Agree on the contract first (OpenAPI), so the frontend can build against a mock server before the backend is ready.
- Adding optional fields never breaks existing clients, so many changes need no new version.
- Feature flags let the backend ship code early and switch it on when the frontend is ready.

---

### ❓ Angular team requests more data “just in case.” How would you respond?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d push back politely and return only required fields. Over-fetching increases `payload size`, memory usage, and response time.

- Extra fields also widen what can leak (personal data) and become a contract you must keep forever.
- Offer a cheap way to get more later: a separate details endpoint, or optional fields (`?include=items`).
- Example: the list screen gets `id, name, status`; the details page calls `/orders/42` for everything else.

---

## 📦 Deployment & Release Management (DevOps)

### ❓ A backend change breaks the Angular app after deployment. How would you prevent this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d add `contract testing`, validate APIs before release, and use feature flags or backward-compatible responses.

- **Contract testing** (for example, Pact): the frontend writes down what it expects, and the backend build fails if it breaks that.
- An OpenAPI spec can also generate typed Angular clients, so mismatches show up at compile time.
- Rule of thumb: add fields freely; never remove or rename one without versioning.

---

### ❓ How would you roll out a risky backend change safely?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `API versioning`, deploy gradually, monitor errors, and keep rollback ready.

- **Canary release:** send 5% of traffic to the new version, watch error rates, then increase step by step.
- **Feature flag:** deploy the code switched off, then turn it on for a few users first.
- Know the rollback steps (and test them) before you deploy.

---

## ⚙️ Configuration & Environment Issues (DevOps)

### ❓ Everything works locally but fails in staging or production. What would you check?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d verify `Spring Profiles`, environment variables, DB configs, and security settings. Most issues come from config mismatch.

- Check that the expected profile is active: the startup log prints "The following profiles are active".
- Other common causes: missing environment variables, wrong DB credentials, CORS settings, firewalls and SSL certificates.
- Compare the effective config with `/actuator/env` (secured!) on both environments.

---

### ❓ How do you ensure Angular points to the correct backend per environment?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use Angular `environment.ts` files and avoid hardcoding URLs.

- Build-time files: `environment.ts` (dev) and `environment.prod.ts`, swapped by `fileReplacements` in `angular.json`.
- Use them in code: `http.get(`${environment.apiUrl}/orders`)`.
- To build once and deploy everywhere, load a `config.json` at startup instead, so the URL changes without rebuilding.

---

## 🧠 State, Caching & Data Freshness

### ❓ Cached data improves performance but users see outdated data. How would you balance this?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d apply `cache TTL`, invalidate cache on updates, and cache only read-heavy data.

- **TTL** sets how long data stays cached (for example, prices 30 seconds, country list 1 day).
- **Evict on update:** when an admin changes a product, remove it from the cache (`@CacheEvict`).
- Choose per data type: never cache data that must always be exact, like an account balance.

---

### ❓ When should data be cached on frontend vs backend?

**Level:** 🟡 Intermediate

### 📝 Answer

Frontend cache is good for UI speed. Backend cache is better for DB load reduction. I choose based on usage patterns.

- **Frontend** (browser memory, `shareReplay`, HTTP cache): per-user data for one session, like dropdown values.
- **Backend** (Redis): data shared by all users, like a product catalog — one cache serves everyone.
- Many apps use both: CDN/browser for static files, Redis for API data.

---

## 🔐 Security & Data Exposure

### ❓ Angular needs user-specific data. How do you ensure users see only their own data?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d enforce authorization in the backend using user context, not rely on frontend filtering.

- Anything in the browser can be changed, so frontend filtering is not security.
- The backend reads the user ID from the JWT and filters by it: `findByIdAndOwnerId(orderId, currentUserId)`.
- Return **404 or 403** when the record belongs to someone else.

---

### ❓ How do you prevent sensitive DB fields from reaching the UI?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d use `DTOs` and avoid exposing JPA entities directly.

- A DTO lists only the safe fields: `record UserDto(Long id, String name, String email) {}` — no `passwordHash`.
- New entity columns then don't leak by accident, because the DTO must be changed on purpose.
- `@JsonIgnore` works too, but it is easy to forget on a new field.

---

## 🧪 Testing & Quality

### ❓ Bugs keep appearing at integration points. How would you improve quality?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d strengthen `integration tests`, mock fewer things, and test Angular ↔ API flows together.

- Integration points are where two parts meet: Angular ↔ API, API ↔ DB, service ↔ service.
- Mocks show how you **think** the other side works; real tests (Testcontainers, a test environment) show how it actually works.
- Add a few end-to-end tests (Cypress or Playwright) for the most important user journeys.

---

### ❓ How do you ensure performance does not degrade over time?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d add baseline performance metrics and monitor API response time and DB query execution regularly.

- Record a baseline, for example "p95 latency for `/orders` = 200 ms", and alert when it goes past it.
- Run load tests (JMeter, Gatling or k6) in CI for key endpoints before releases.
- Check performance after every release, not only when users complain.

---

## 👥 Team & Ownership Questions (Leadership)

### ❓ A feature works but is poorly designed. Do you ship or refactor?

**Level:** 🔴 Advanced

### 📝 Answer

I’d ship only if risk is low and plan refactoring immediately. Technical debt should be tracked, not ignored.

- Ask: will this design cause bugs, or slow down the next features in this area?
- If you ship, create a ticket for the refactor with a reason and a planned sprint.
- Tests around the feature make the later refactor safe.

---

### ❓ A junior developer wrote a slow query. How would you handle it?

**Level:** 🔴 Advanced

### 📝 Answer

I’d review it together, explain indexing and query design, and treat it as a learning opportunity.

- Show the problem together: run `EXPLAIN` and compare before and after adding an index.
- Give feedback privately and focus on the code, not the person.
- Prevent it next time with a code review checklist item or slow-query alerts.

---

### ❓ How do you make sure frontend and backend teams stay aligned?

**Level:** 🔴 Advanced

### 📝 Answer

I’d encourage early API discussions, shared contracts, and regular syncs before implementation.

- **API-first:** agree on an OpenAPI contract before coding; the frontend can build against a mock server meanwhile.
- Share the spec in Git so changes are reviewed by both teams.
- Short regular syncs and a shared demo environment catch mismatches early.

---

## 🚨 Production Incident Handling (Observability)

### ❓ Production is slow and users are complaining. What are your first 3 actions?

**Level:** 🟡 Intermediate

### 📝 Answer

Check monitoring dashboards, identify the slow layer, and reduce impact first before deep fixes.

1. **Look:** dashboards and logs — error rate, latency, CPU, DB connections. Did a release just happen?
2. **Find the layer:** frontend, API, database or an external service.
3. **Reduce impact:** roll back, scale up or turn off the failing feature; find the root cause after users are fine.

- Keep stakeholders updated during the incident, and write a blameless postmortem afterwards.

---

### ❓ A hotfix is needed quickly. How do you balance speed and safety?

**Level:** 🟡 Intermediate

### 📝 Answer

I’d apply the smallest safe change, test critical paths, deploy fast, and monitor closely.

- Branch from the production version, change only what fixes the bug, and get at least one quick review.
- Run the automated tests and check the main flows (login, checkout) before deploying.
- Merge the fix back into the main branch, and add a test so the bug can't return.

---

## 🧭 Architectural Judgment (System Design)

### ❓ When would you split a monolithic Spring Boot app?

**Level:** 🔴 Advanced

### 📝 Answer

When independent scaling, deployment speed, or ownership becomes a problem—not just because it’s trendy.

- Good reasons: one part needs much more scaling, teams block each other's releases, or one module's failures take down everything.
- First build a **modular monolith** with clear module boundaries; splitting later is then much easier.
- Microservices add network calls, distributed data and more ops work, so the benefit must be worth that cost.

---

### ❓ How do you decide if a problem should be solved in Angular or backend?

**Level:** 🔴 Advanced

### 📝 Answer

UI logic stays in Angular. Data validation, security, and performance-critical logic stay in backend.

- Angular: display, form hints, navigation and UI state — things that make the screen fast and friendly.
- Backend: rules that must **always** hold, because users can bypass the browser (for example, by calling the API with curl).
- Validation often lives in both: the frontend for quick feedback, the backend for safety.

---

### ❓ What challenges you encountered while upgrading Spring or Java?

**Level:** 🔴 Advanced

### 📝 Answer

While upgrading Spring Boot / Java, I faced **compatibility and breaking changes**.

**Common Challenges & Solutions**

🔹 1. Dependency Incompatibility

❌ **Problem**

- Older libraries not supported

✅ **Solution**

- Upgrade dependencies
- Use Spring BOM (dependency management)

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>3.2.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

🔹 2. Java & Jakarta Changes (Java 8 → 17, Spring Boot 2 → 3)

❌ **Problem**

- **Java 11** removed the bundled Java EE modules (JAXB, JAX-WS, `javax.annotation`) → add them as dependencies
- **Spring Boot 3** moved to **Jakarta EE 9+**, which renamed packages `javax.persistence`, `javax.servlet`, `javax.validation` → `jakarta.*`
- Boot 3 requires **Java 17** as the minimum

✅ **Solution**

- Migrated imports to `jakarta.*` (OpenRewrite recipes can do this automatically)

```java
// Old
import javax.persistence.Entity;

// New
import jakarta.persistence.Entity;
```

🔹 3. Spring Security Changes

❌ **Problem**

- `WebSecurityConfigurerAdapter` was removed (Spring Security 6)
- `antMatchers` / `authorizeRequests` replaced; chained `.and()` style deprecated

✅ **Solution**

- A `SecurityFilterChain` bean with the **lambda DSL**

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())                    // was: http.csrf().disable()
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()  // was: antMatchers(...)
            .anyRequest().authenticated());
    return http.build();
}
```

🔹 4. Failing Tests After Upgrade

❌ **Problem**

- Mock failures / context load issues

✅ **Solution**

- Updated Mockito & JUnit versions
- Fixed deprecated annotations

🔹 5. Configuration Changes

❌ **Problem**

- Properties renamed or removed

✅ **Solution**

- Checked Spring Boot migration guide
- Updated `application.yml`

> Upgrading needs dependency alignment, code refactoring, and proper testing.

---

### ❓ What is Idempotency?

**Level:** 🟡 Intermediate

### 📝 Answer

Idempotency means: If you send the same request again and again, the final result stays the same.

| Action                   | Idempotent?        | Reason                                             |
| ------------------------ | ------------------ | -------------------------------------------------- |
| Read data (GET)          | ✅ Yes             | only reads data, does not change anything          |
| Update full data (PUT)   | ✅ Yes             | replaces a resource, No Addition, Same final state |
| Delete something         | ✅ Yes             | removes a resource, Same final state               |
| Create new record (POST) | ❌ No (by default) | Different result each time, Multiple side effects  |

> `GET` reads, `PUT` replaces, `DELETE` removes
> Repeating them doesn’t change the final result.
