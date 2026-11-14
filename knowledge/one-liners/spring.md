# Spring Boot — One-liners

> The most asked questions, each answered in one sentence.

1. **What is IoC?** — The container creates and manages objects instead of your code doing it.
2. **What is dependency injection?** — Spring passes a bean the other beans it needs, usually through the constructor.
3. **Why prefer constructor injection?** — Dependencies are required, final and easy to test.
4. **What does `@SpringBootApplication` include?** — `@Configuration`, `@EnableAutoConfiguration` and `@ComponentScan`.
5. **What is auto-configuration?** — Spring Boot creates beans automatically based on the classpath and properties.
6. **What is a starter?** — A dependency bundle like `spring-boot-starter-web` that brings everything a feature needs.
7. **`@Component` vs `@Service` vs `@Repository`?** — All create beans; `@Service` marks business logic and `@Repository` adds DB exception translation.
8. **`@Controller` vs `@RestController`?** — `@RestController` returns data (JSON) directly; `@Controller` usually returns views.
9. **What is the default bean scope?** — Singleton: one instance per container.
10. **`@Bean` vs `@Component`?** — `@Bean` creates a bean in a config method (good for third-party classes); `@Component` marks your own class.
11. **What does `@Transactional` do?** — It runs the method in a database transaction that commits or rolls back as a whole.
12. **When does `@Transactional` roll back?** — On unchecked exceptions by default.
13. **Why does self-invocation skip `@Transactional`?** — Calls inside the same class bypass the Spring proxy.
14. **What is the N+1 problem?** — One query for parents plus one per child; fix with fetch joins or entity graphs.
15. **`@PathVariable` vs `@RequestParam`?** — `@PathVariable` reads from the URL path; `@RequestParam` reads from the query string.
16. **How do you handle errors globally?** — `@RestControllerAdvice` with `@ExceptionHandler` methods.
17. **What is Spring Boot Actuator?** — Built-in endpoints for health, metrics and info.
18. **What are profiles?** — Environment-specific settings activated with `spring.profiles.active`.
19. **What is AOP?** — Adding cross-cutting behaviour (logging, transactions) around methods without changing them.
20. **What is the DispatcherServlet?** — The front controller that routes every request to the right controller.
21. **Filter vs interceptor?** — A filter runs before Spring MVC at the servlet level; an interceptor runs around controller calls.
22. **What is `@ConfigurationProperties`?** — It binds a group of properties to a type-safe class.
