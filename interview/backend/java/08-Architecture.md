## Angular

### ❓ Our data table loads very slowly when there are thousands of rows. How would you improve its performance?

### 📝 Answer

I would use `virtual scrolling` so only visible rows are rendered. I’d also enable `OnPush change detection` to avoid unnecessary re-renders and load data using `pagination` instead of fetching everything at once.

---

### ❓ Scrolling the data table feels laggy. What would you check first?

### 📝 Answer

First, I’d check if the table is rendering too many DOM elements. I’d use `cdk-virtual-scroll-viewport` and make sure `trackBy` is used in `*ngFor` to reduce DOM updates.

---

### ❓ Sorting and filtering freeze the UI for a moment. How would you fix this?

### 📝 Answer

I would move heavy operations like sorting and filtering to the backend or use `Web Workers`. On the UI side, I’d debounce inputs using `RxJS debounceTime`.

---

### ❓ After adding a data-table library, the bundle size increased a lot. What would you do?

### 📝 Answer

I’d analyze the bundle using `source-map-explorer` or `webpack-bundle-analyzer`. Then I’d import only required modules and remove unused features using `tree-shaking`.

---

### ❓ The data table is not needed on the home page, but it still affects load time. How would you handle this?

### 📝 Answer

I’d use `lazy loading` so the table module loads only when the user navigates to that page. This keeps the initial bundle small.

---

### ❓ The table works fine locally but is slow in production. How would you debug this?

### 📝 Answer

I’d check if `production mode` is enabled and verify network performance. I’d also confirm that `GZip` compression is enabled on the server and inspect API response sizes in DevTools.

---

### ❓ API responses are very large and slow down table loading. What would you suggest?

### 📝 Answer

I’d reduce payload size by sending only required fields and enable `GZip` compression. I’d also add `server-side pagination` to avoid sending all rows at once.

---

### ❓ How would you verify if GZip compression is working?

### 📝 Answer

I’d open browser DevTools → Network tab and check the response headers for `content-encoding: gzip`. I’d also compare response size before and after compression.

---

### ❓ Two users see different data in the table at the same time. How would you handle this?

### 📝 Answer

I’d make sure data comes from a centralized backend and handle updates using `WebSockets` or periodic polling. I’d avoid sharing table state in global memory without isolation.

---

### ❓ Filters applied by one user should not affect another user. How would you ensure this?

### 📝 Answer

I’d keep filters in `component-level state` or `route query params`, not in shared services. Each user session should manage its own state.

---

### ❓ The table data reloads again and again when navigating back. How would you optimize this?

### 📝 Answer

I’d cache data in a service using `RxJS shareReplay` or a state manager like `NgRx`. This avoids unnecessary API calls.

---

### ❓ How would you decide between using a table library or building your own?

### 📝 Answer

I’d check requirements like performance, customization, and bundle size. If needs are simple, I’d build a custom table. For complex features, I’d choose a well-optimized library.

---

### ❓ A table library causes performance issues but is used across the app. What would you do?

### 📝 Answer

I’d first profile it using `Angular DevTools`. If issues persist, I’d wrap it with `OnPush`, disable unused features, or plan a phased replacement.

---

### ❓ The table shows user-generated content. How would you keep it secure?

### 📝 Answer

I’d rely on Angular’s built-in `XSS protection` and avoid using `innerHTML`. If needed, I’d carefully use `DomSanitizer`.

---

### ❓ How would you measure table performance in real user environments?

### 📝 Answer

I’d use `browser performance APIs`, add custom metrics, and monitor using tools like `Lighthouse` or real-user monitoring dashboards.

---

### ❓ A fix for table performance needs major refactoring. How would you plan it?

### 📝 Answer

I’d break it into phases, start with high-impact fixes like `lazy loading` and `virtual scroll`, and align changes with business priorities to reduce risk.

---

## 🌐 REST API & Controller Design

### ❓ Our REST API is getting hard to maintain as features grow. How would you structure controllers better?

### 📝 Answer

I’d keep controllers thin and move logic to `Service` classes. Each controller should handle only request/response mapping using `@RestController`.

---

### ❓ Multiple controllers are returning different response formats. How would you standardize this?

### 📝 Answer

I’d create a common response wrapper and use `ResponseEntity`. For errors, I’d centralize handling using `@ControllerAdvice`.

---

### ❓ One controller method is doing validation, business logic, and DB calls. How would you fix this?

### 📝 Answer

I’d separate concerns: validation with `@Valid`, business logic in `Service`, and DB access in `Repository`. Controllers should stay lightweight.

---

## 🚀 Performance & Scalability

### ❓ Our API becomes slow when traffic increases. What would you check first?

### 📝 Answer

I’d check DB queries, add `indexes`, and monitor thread usage. I’d also review connection pooling using `HikariCP`.

---

### ❓ A single API call returns a very large response and affects performance. How would you optimize it?

### 📝 Answer

I’d introduce `pagination`, return only required fields using DTOs, and enable `GZip` compression at the server level.

---

### ❓ How would you reduce repeated database calls for the same data?

### 📝 Answer

I’d add caching using `@Cacheable` with tools like `Redis` or in-memory cache to reduce DB load.

---

## 📦 Spring Boot Configuration & Production Readiness

### ❓ Our application behaves differently in local and production environments. How would you manage this?

### 📝 Answer

I’d use `Spring Profiles` with separate configs like `application-dev.yml` and `application-prod.yml`.

---

### ❓ How would you make sure debug logs don’t affect production performance?

### 📝 Answer

I’d control logging using `logback` levels and disable unnecessary logs in the `prod` profile.

---

### ❓ The app startup time increased after adding new modules. How would you improve it?

### 📝 Answer

I’d review unnecessary `@ComponentScan`, reduce auto-configurations, and enable `lazy initialization` if needed.

---

## 🔐 Security & Validation

### ❓ How do you protect REST APIs from invalid or malicious input?

### 📝 Answer

I’d use `Bean Validation` with `@NotNull`, `@Size`, and `@Valid`. I’d also sanitize inputs and rely on Spring’s security filters.

---

### ❓ How would you secure APIs so only authorized users can access them?

### 📝 Answer

I’d use `Spring Security` with `JWT` or `OAuth2`, and secure endpoints using `@PreAuthorize`.

---

## 🧠 Exception Handling & Reliability

### ❓ When an exception happens, users see different error messages. How would you fix this?

### 📝 Answer

I’d centralize exception handling using `@ControllerAdvice` and return consistent error responses.

---

### ❓ How would you handle checked and unchecked exceptions in services?

### 📝 Answer

I’d convert low-level exceptions into meaningful custom exceptions and handle them globally.

---

## 👥 Concurrent Users & Data Consistency

### ❓ Two users update the same record at the same time. How would you handle this?

### 📝 Answer

I’d use `optimistic locking` with `@Version` to avoid data conflicts.

---

### ❓ How do you ensure thread safety in a Spring Boot application?

### 📝 Answer

I’d keep beans `stateless`, avoid shared mutable data, and rely on Spring’s default singleton behavior carefully.

---

## 🧪 Testing & Monitoring

### ❓ How would you test REST controllers properly?

### 📝 Answer

I’d use `@WebMvcTest` with `MockMvc` to test controllers independently from services.

---

### ❓ How would you monitor API performance in production?

### 📝 Answer

I’d use `Spring Actuator` for health and metrics, and integrate with monitoring tools like `Prometheus`.

---

## 🧭 Managerial & Design Decisions

### ❓ The team is divided between quick fixes and long-term refactoring. How would you decide?

### 📝 Answer

I’d prioritize business impact, fix critical issues first, and plan refactoring in phases to reduce risk.

---

### ❓ How would you explain a REST API performance issue to a non-technical manager?

### 📝 Answer

I’d explain it in terms of slow data fetching and system load, then outline clear steps and timelines to fix it.

---

### ❓ If a breaking change is required in an API, how would you manage it?

### 📝 Answer

I’d version the API using `/v1` and `/v2`, communicate changes early, and support backward compatibility.

---

## 🗄️ Database Design & Access (Spring Boot + MySQL)

### ❓ Our database tables are growing very fast and queries are getting slow. What would you check first?

### 📝 Answer

I’d first analyze slow queries using `EXPLAIN` and add proper `indexes`. I’d also check if queries are fetching unnecessary columns.

---

### ❓ A single API call is hitting the database multiple times. How would you optimize this?

### 📝 Answer

I’d check for `N+1 query` issues and fix them using `JOIN FETCH` or proper `@EntityGraph` usage.

---

### ❓ The same data is being read again and again from MySQL. How would you reduce DB load?

### 📝 Answer

I’d add caching using `@Cacheable` with tools like `Redis` or in-memory cache to avoid repeated DB hits.

---

## ⚙️ JPA / Hibernate Performance

### ❓ Our API is slow even though the database is fast. What could be the issue?

### 📝 Answer

It could be inefficient ORM usage. I’d review `lazy vs eager fetching`, unnecessary entity mappings, and excessive object creation by `Hibernate`.

---

### ❓ How do you decide between `Lazy` and `Eager` fetching?

### 📝 Answer

I’d default to `FetchType.LAZY` and fetch data explicitly when needed to avoid loading unnecessary relations.

---

### ❓ Large result sets are causing memory issues. How would you handle this?

### 📝 Answer

I’d use `pagination` with `LIMIT / OFFSET` and stream results when possible instead of loading everything into memory.

---

## 🔄 Transactions & Data Consistency

### ❓ Multiple DB operations must succeed or fail together. How would you handle this?

### 📝 Answer

I’d wrap the logic in a `@Transactional` service method to ensure atomicity.

---

### ❓ Two users update the same record at the same time. How do you prevent data conflicts?

### 📝 Answer

I’d use `optimistic locking` with `@Version` to detect concurrent updates.

---

### ❓ When would you use pessimistic locking?

### 📝 Answer

I’d use it only for critical updates where conflicts are costly, using `SELECT FOR UPDATE`.

---

## 👥 Concurrent Users & Scalability

### ❓ Under high traffic, DB connections are getting exhausted. How would you fix this?

### 📝 Answer

I’d tune the connection pool using `HikariCP` and make sure connections are released properly.

---

### ❓ How do you make sure multiple users don’t affect each other’s data?

### 📝 Answer

I’d enforce data isolation using proper `WHERE` clauses, user-level filters, and avoid shared mutable state.

---

## 📦 Query Design & DTO Usage

### ❓ Entities are large but APIs need only a few fields. What would you do?

### 📝 Answer

I’d use `DTO projections` or `JPQL constructor expressions` instead of returning full entities.

---

### ❓ Why should controllers not return JPA entities directly?

### 📝 Answer

Because entities can expose unwanted data and cause `lazy loading` issues. DTOs give better control and performance.

---

## 🚀 Production Issues & Debugging

### ❓ Queries work fine locally but are slow in production. How would you debug this?

### 📝 Answer

I’d check real data size, indexes, execution plans, and enable `slow query logs` in MySQL.

---

### ❓ After a release, database CPU usage increased suddenly. What would you check?

### 📝 Answer

I’d review new queries, check missing indexes, and inspect Hibernate-generated SQL logs.

---

## 🔐 Data Safety & Integrity

### ❓ How do you prevent invalid data from being saved in MySQL?

### 📝 Answer

I’d use `Bean Validation` annotations and database constraints like `NOT NULL` and `UNIQUE`.

---

### ❓ How do you handle soft deletes instead of hard deletes?

### 📝 Answer

I’d use a status flag like `is_deleted` and filter records at query level instead of deleting rows.

---

## 🧪 Testing & Migration

### ❓ How do you manage database schema changes safely?

### 📝 Answer

I’d use `Flyway` or `Liquibase` for versioned DB migrations instead of manual changes.

---

### ❓ How would you test database logic without affecting real data?

### 📝 Answer

I’d use `Testcontainers` or an in-memory DB for integration testing.

---

## 🧭 Managerial / Architectural Decisions

### ❓ When would you avoid using JPA and write native SQL instead?

### 📝 Answer

When performance is critical or queries are complex, I’d use `native queries` for better control.

---

### ❓ How would you explain a database performance issue to management?

### 📝 Answer

I’d explain it as inefficient data access and show how indexing, caching, and query optimization will reduce response time.

---

### ❓ If database refactoring is risky, how would you plan it?

### 📝 Answer

I’d plan phased changes, add monitoring, test with real data volume, and roll out gradually.

---

## 🔁 End-to-End System Thinking

### ❓ A screen loads slowly, but it’s unclear whether the issue is frontend, API, or DB. How would you approach this?

### 📝 Answer

I’d break it down layer by layer: Angular network timing, REST API response time, and DB query time. I’d use `browser DevTools`, `Spring logs`, and DB metrics to isolate the bottleneck.

---

### ❓ Frontend says backend is slow, backend says frontend is inefficient. How would you resolve this?

### 📝 Answer

I’d rely on data, not opinions. I’d capture `API response times`, payload size, and DB execution time, then align both teams on facts.

---

## 🌐 API Design & Communication

### ❓ Frontend needs frequent API changes, but backend releases are slower. How would you manage this?

### 📝 Answer

I’d design APIs to be flexible using `DTOs`, optional fields, and backward compatibility. I’d also version APIs when breaking changes are needed.

---

### ❓ Angular team requests more data “just in case.” How would you respond?

### 📝 Answer

I’d push back politely and return only required fields. Over-fetching increases `payload size`, memory usage, and response time.

---

## 📦 Deployment & Release Management

### ❓ A backend change breaks the Angular app after deployment. How would you prevent this?

### 📝 Answer

I’d add `contract testing`, validate APIs before release, and use feature flags or backward-compatible responses.

---

### ❓ How would you roll out a risky backend change safely?

### 📝 Answer

I’d use `API versioning`, deploy gradually, monitor errors, and keep rollback ready.

---

## ⚙️ Configuration & Environment Issues

### ❓ Everything works locally but fails in staging or production. What would you check?

### 📝 Answer

I’d verify `Spring Profiles`, environment variables, DB configs, and security settings. Most issues come from config mismatch.

---

### ❓ How do you ensure Angular points to the correct backend per environment?

### 📝 Answer

I’d use Angular `environment.ts` files and avoid hardcoding URLs.

---

## 🧠 State, Caching & Data Freshness

### ❓ Cached data improves performance but users see outdated data. How would you balance this?

### 📝 Answer

I’d apply `cache TTL`, invalidate cache on updates, and cache only read-heavy data.

---

### ❓ When should data be cached on frontend vs backend?

### 📝 Answer

Frontend cache is good for UI speed. Backend cache is better for DB load reduction. I choose based on usage patterns.

---

## 🔐 Security & Data Exposure

### ❓ Angular needs user-specific data. How do you ensure users see only their own data?

### 📝 Answer

I’d enforce authorization in the backend using user context, not rely on frontend filtering.

---

### ❓ How do you prevent sensitive DB fields from reaching the UI?

### 📝 Answer

I’d use `DTOs` and avoid exposing JPA entities directly.

---

## 🧪 Testing & Quality

### ❓ Bugs keep appearing at integration points. How would you improve quality?

### 📝 Answer

I’d strengthen `integration tests`, mock fewer things, and test Angular ↔ API flows together.

---

### ❓ How do you ensure performance does not degrade over time?

### 📝 Answer

I’d add baseline performance metrics and monitor API response time and DB query execution regularly.

---

## 👥 Team & Ownership Questions (Very Managerial)

### ❓ A feature works but is poorly designed. Do you ship or refactor?

### 📝 Answer

I’d ship only if risk is low and plan refactoring immediately. Technical debt should be tracked, not ignored.

---

### ❓ A junior developer wrote a slow query. How would you handle it?

### 📝 Answer

I’d review it together, explain indexing and query design, and treat it as a learning opportunity.

---

### ❓ How do you make sure frontend and backend teams stay aligned?

### 📝 Answer

I’d encourage early API discussions, shared contracts, and regular syncs before implementation.

---

## 🚨 Production Incident Handling

### ❓ Production is slow and users are complaining. What are your first 3 actions?

### 📝 Answer

Check monitoring dashboards, identify the slow layer, and reduce impact first before deep fixes.

---

### ❓ A hotfix is needed quickly. How do you balance speed and safety?

### 📝 Answer

I’d apply the smallest safe change, test critical paths, deploy fast, and monitor closely.

---

## 🧭 Architectural Judgment

### ❓ When would you split a monolithic Spring Boot app?

### 📝 Answer

When independent scaling, deployment speed, or ownership becomes a problem—not just because it’s trendy.

---

### ❓ How do you decide if a problem should be solved in Angular or backend?

### 📝 Answer

UI logic stays in Angular. Data validation, security, and performance-critical logic stay in backend.

---

### ❓ What challenges you encountered while upgrading Spring or Java?

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

🔹 2. Java Version Issues (Java 8 → 17)

❌ **Problem**

- Removed APIs (e.g. `javax.*`)

✅ **Solution**

- Migrated to `jakarta.*`

```java
// Old
import javax.persistence.Entity;

// New
import jakarta.persistence.Entity;
```

🔹 3. Spring Security Changes

❌ **Problem**

- Deprecated `WebSecurityConfigurerAdapter`

✅ **Solution**

- Used `SecurityFilterChain`

```java
@Bean
SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf().disable()
        .authorizeHttpRequests(auth -> auth.anyRequest().authenticated());
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
