# Spring Boot — Cheat Sheet

> **In one line:** Spring creates and connects your objects for you; Spring Boot adds sensible defaults, so an app runs with almost no setup.

## IoC and dependency injection
- **IoC (Inversion of Control)** — Spring creates objects (called **beans**), not your code.
- **Dependency injection** — Spring hands each bean the other beans it needs.
- Use **constructor injection** (clear, testable, can't be forgotten).

```java
@Service
public class OrderService {
  private final PaymentClient payments;
  public OrderService(PaymentClient payments) { this.payments = payments; }
}
```

## What Spring Boot adds
- `@SpringBootApplication` = configuration + auto-configuration + component scanning.
- **Auto-configuration** — creates beans based on what's on the classpath (add a DB driver → you get a DataSource).
- **Starters** — dependency bundles: `spring-boot-starter-web`, `-data-jpa`, `-security`, `-test`.
- **Embedded server** — Tomcat inside the JAR; run with `java -jar app.jar`.

## Common annotations
- `@Component` — a general bean. `@Service` — business logic. `@Repository` — data access.
- `@RestController` — REST endpoints that return JSON.
- `@Configuration` + `@Bean` — create beans in code.
- `@Qualifier` / `@Primary` — choose between beans of the same type.
- `@Value("${app.timeout}")` — read one property. `@ConfigurationProperties` — read a group.
- `@Profile("dev")` — only in that environment.

## Bean scopes
- **singleton** (default) — one shared instance.
- **prototype** — new instance every time.
- **request** / **session** — one per HTTP request / user session.
- Lifecycle: create → inject → `@PostConstruct` → use → `@PreDestroy`.

## REST controller
```java
@RestController
@RequestMapping("/api/users")
class UserController {
  @GetMapping("/{id}")  User get(@PathVariable Long id) { … }
  @PostMapping ResponseEntity<User> create(@Valid @RequestBody UserDto dto) {
    return ResponseEntity.status(201).body(service.create(dto));
  }
}
```
- `@PathVariable` — from the URL path. `@RequestParam` — from `?page=2`. `@RequestBody` — the JSON body.
- `@Valid` + `@NotNull`, `@Email` — input validation.
- `@RestControllerAdvice` + `@ExceptionHandler` — one place for error responses.

## Spring Data JPA
- `interface UserRepo extends JpaRepository<User, Long>` — CRUD and paging for free.
- Query by method name: `findByEmail(String email)`. Custom: `@Query`.
- **Lazy loading** — related data loads only when used.
- **N+1 problem** — 1 query for parents + 1 per child. Fix with `JOIN FETCH` or `@EntityGraph`.

## Transactions
- `@Transactional` — all DB changes in the method succeed or all roll back.
- Rolls back on **unchecked** exceptions by default.
- **Propagation** — `REQUIRED` (join the current one, default), `REQUIRES_NEW` (always a new one).

## AOP (aspect-oriented programming)
Add the same behaviour (logging, security, transactions) to many methods without touching them. `@Before`, `@After`, `@Around` advice.

## Request flow
Request → **DispatcherServlet** → finds the controller → controller → service → repository → response turned into JSON by Jackson.
- **Filter** — runs before Spring MVC. **Interceptor** — runs around controllers.

## Ops & testing
- **Actuator** — `/actuator/health`, `/metrics` endpoints.
- Config priority: command line > environment variables > `application-{profile}.yml` > `application.yml`.
- Tests: `@SpringBootTest` (whole app), `@WebMvcTest` (controllers), `@DataJpaTest` (repositories).
- Extras: `@Async`, `@Scheduled`, `@Cacheable`.
