### ❓ What are some commonly used Spring annotations and what are they used for?

**Level:** 🟡 Intermediate

### 📝 Answer

![SpringAnnotations Image](/src/assets/backend/spring-annotations.png)

Spring's most used annotations fall into six groups — each has its own question below:

- **Bean Creation (Stereotype Annotations)** — What are the Spring stereotype annotations (`@Component`, `@Service`, `@Repository`)?
- **Dependency Injection Annotations** — Which annotations are used for dependency injection in Spring?
- **Bean Lifecycle Annotations** — Which annotations control a Spring bean's lifecycle and scope?
- **Transaction & AOP Annotations** — Which annotations handle transactions and AOP in Spring?
- **Web & REST Annotations** — Which annotations are used to build REST APIs in Spring?
- **Spring Boot Core Annotations** — What are the core Spring Boot annotations?

---

### ❓ What are the Spring stereotype annotations (`@Component`, `@Service`, `@Repository`)?

**Level:** 🟡 Intermediate

### 📝 Answer

Stereotype annotations mark a class as a **Spring bean**, so component scanning finds it and Spring creates it. The specific ones also say which **layer** the class belongs to.

| Annotation    | Where It Is Used | Explanation                                          |
| ------------- | ---------------- | ---------------------------------------------------- |
| `@Component`  | Class level      | Marks a class as a Spring bean (generic stereotype). |
| `@Service`    | Class level      | Marks service/business logic class.                  |
| `@Repository` | Class level      | Marks DAO class; enables DB exception translation.   |

#### ↳ Follow-up: Is there a functional difference between `@Component` and `@Service`?

↪ No — `@Service` is a `@Component` with a clearer name. Only `@Repository` adds behaviour: it translates database exceptions into Spring's `DataAccessException`.

---

### ❓ Which annotations are used for dependency injection in Spring?

**Level:** 🟡 Intermediate

### 📝 Answer

These annotations tell Spring **which bean to hand in** where. Prefer constructor injection; with a single constructor, `@Autowired` isn't even needed.

| Annotation   | Where It Is Used             | Explanation                                                                                         |
| ------------ | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `@Autowired` | Field / Constructor / Setter | Injects dependency automatically by **type**.                                                       |
| `@Qualifier` | Field / Parameter            | Specifies which bean to inject when multiple beans of same type exist.                              |
| `@Primary`   | Class level (on bean)        | Marks a bean as the default choice when multiple candidates exist.                                  |
| `@Resource`  | Field / Setter               | Injects dependency by **name** (Java standard annotation).                                          |
| `@Inject`    | Field / Constructor / Setter | Similar to `@Autowired` (from JSR-330); injects by type.                                            |
| `@Lookup`    | Method level                 | Tells Spring to return a new bean instance dynamically (used for prototype beans inside singleton). |

#### ↳ Follow-up: Two beans implement the same interface. How does Spring choose?

↪ Mark one `@Primary` (the default), or name the one you want with `@Qualifier("beanName")` at the injection point.

---

### ❓ Which annotations control a Spring bean's lifecycle and scope?

**Level:** 🟡 Intermediate

### 📝 Answer

Lifecycle annotations run your code **after a bean is created** and **before it is destroyed**; scope annotations decide **how many instances** exist.

| Annotation                   | Where It Is Used                   | Explanation                                                                                  |
| ---------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `@PostConstruct`             | Method level                       | Runs once after bean creation and dependency injection; used for initialization logic.       |
| `@PreDestroy`                | Method level                       | Runs before bean is destroyed; used for cleanup logic.                                       |
| `InitializingBean`           | Class level (implements interface) | Provides `afterPropertiesSet()` method for initialization (alternative to `@PostConstruct`). |
| `DisposableBean`             | Class level (implements interface) | Provides `destroy()` method for cleanup (alternative to `@PreDestroy`).                      |
| `@Bean(initMethod="...")`    | Method level                       | Specifies a custom initialization method for a bean.                                         |
| `@Bean(destroyMethod="...")` | Method level                       | Specifies a custom destroy method for a bean.                                                |
| `@Lazy`                      | Class / Method level               | Delays bean initialization until it is first requested.                                      |
| `BeanPostProcessor`          | Class level (implements interface) | Allows custom logic before and after bean initialization.                                    |
| `@Scope("singleton")`        | Class / `@Bean` method level       | Single shared instance for the entire application (default scope).                           |
| `@Scope("prototype")`        | Class / `@Bean` method level       | Creates a new bean instance every time it is requested.                                      |
| `@RequestScope`              | Class level                        | One bean instance per HTTP request (web applications only).                                  |
| `@SessionScope`              | Class level                        | One bean instance per HTTP session (per user session).                                       |
| `@ApplicationScope`          | Class level                        | One bean per ServletContext (shared across the whole web app).                               |

#### ↳ Follow-up: Why might `@PreDestroy` not run on a prototype bean?

↪ Spring creates prototype beans but doesn't manage them afterwards, so it never calls their destroy callbacks.

---

### ❓ Which annotations handle transactions and AOP in Spring?

**Level:** 🟡 Intermediate

### 📝 Answer

`@Transactional` wraps a method in a database transaction; the AOP annotations add cross-cutting behaviour (logging, timing, security) around methods. Both work through **proxies**.

| Annotation                     | Where It Is Used                  | Explanation                                                               |
| ------------------------------ | --------------------------------- | ------------------------------------------------------------------------- |
| `@Transactional`               | Class / Method level              | Manages DB transactions: commit on success, rollback on **unchecked** exceptions (checked ones commit unless `rollbackFor` is set). |
| `@EnableTransactionManagement` | Class level (Configuration class) | Enables Spring’s annotation-driven transaction management.                |
| `@Aspect`                      | Class level                       | Marks a class as an Aspect (contains cross-cutting logic).                |
| `@EnableAspectJAutoProxy`      | Class level (Configuration class) | Enables AOP proxy support in Spring.                                      |
| `@Before`                      | Method level (inside Aspect)      | Runs advice before the target method executes.                            |
| `@After`                       | Method level (inside Aspect)      | Runs advice after the method finishes (success or exception).             |
| `@AfterReturning`              | Method level (inside Aspect)      | Runs after method returns successfully.                                   |
| `@AfterThrowing`               | Method level (inside Aspect)      | Runs when method throws an exception.                                     |
| `@Around`                      | Method level (inside Aspect)      | Wraps method execution (can control before & after, even skip execution). |
| `@Pointcut`                    | Method level (inside Aspect)      | Defines reusable method execution expressions.                            |
| `@Order`                       | Class level (Aspect class)        | Defines execution order when multiple aspects exist.                      |

#### ↳ Follow-up: Why doesn't `@Transactional` work when a method calls another method in the same class?

↪ The call doesn't go through the Spring proxy, so no transaction (or aspect) is applied. Move the method to another bean.

---

### ❓ Which annotations are used to build REST APIs in Spring?

**Level:** 🟡 Intermediate

### 📝 Answer

These map HTTP requests to controller methods and read parts of the request (path, query, body, headers).

| Annotation              | Where It Is Used         | Explanation                                           |
| ----------------------- | ------------------------ | ----------------------------------------------------- |
| `@RestController`       | Class level              | Combines `@Controller + @ResponseBody` for REST APIs. |
| `@Controller`           | Class level              | Marks a web controller that returns views or data.    |
| `@RequestMapping`       | Class / Method level     | Maps HTTP requests (URL + method) to handler methods. |
| `@GetMapping`           | Method level             | Handles HTTP GET requests (fetch data).               |
| `@PostMapping`          | Method level             | Handles HTTP POST requests (create data).             |
| `@PutMapping`           | Method level             | Handles HTTP PUT requests (update data).              |
| `@PatchMapping`         | Method level             | Handles partial updates.                              |
| `@DeleteMapping`        | Method level             | Handles HTTP DELETE requests.                         |
| `@PathVariable`         | Method parameter         | Extracts values from URL path.                        |
| `@RequestParam`         | Method parameter         | Reads query parameters from URL.                      |
| `@RequestBody`          | Method parameter         | Converts JSON/XML request body into Java object.      |
| `@ResponseBody`         | Method level             | Sends return value directly as HTTP response body.    |
| `@ResponseStatus`       | Method / Exception class | Sets custom HTTP status code.                         |
| `@CrossOrigin`          | Class / Method level     | Enables CORS for cross-origin requests.               |
| `@RequestHeader`        | Method parameter         | Reads HTTP header values.                             |
| `@CookieValue`          | Method parameter         | Reads cookie values from request.                     |
| `@ExceptionHandler`     | Method level             | Handles exceptions inside controller.                 |
| `@RestControllerAdvice` | Class level              | Global exception handling for REST APIs.              |

#### ↳ Follow-up: `@PathVariable` vs `@RequestParam`?

↪ `/users/7` → `@PathVariable` (identifies the resource); `/users?page=2` → `@RequestParam` (filters, paging).

---

### ❓ What are the core Spring Boot annotations?

**Level:** 🟢 Beginner

### 📝 Answer

These start the application, turn on auto-configuration, read properties, and create beans only when conditions are met.

| Annotation                       | Where It Is Used                | Explanation                                                                                    |
| -------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `@SpringBootApplication`         | Class level                     | Main entry point. Combines `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. |
| `@EnableAutoConfiguration`       | Class level                     | Automatically configures beans based on dependencies in classpath.                             |
| `@ComponentScan`                 | Class level                     | Scans packages for Spring components (beans).                                                  |
| `@Configuration`                 | Class level                     | Defines configuration class that declares beans.                                               |
| `@Bean`                          | Method level                    | Creates and registers a bean manually inside a `@Configuration` class.                         |
| `@ConfigurationProperties`       | Class level                     | Binds application properties to a POJO.                                                        |
| `@EnableConfigurationProperties` | Class level                     | Enables support for `@ConfigurationProperties` beans.                                          |
| `@Value`                         | Field / Constructor / Parameter | Injects property value from `application.properties` or `application.yml`.                     |
| `@PropertySource`                | Class level                     | Loads external `.properties` file into Spring Environment.                                     |
| `@Profile`                       | Class / Method level            | Activates beans only for specific environments (dev, prod, etc.).                              |
| `@Conditional`                   | Class / Method level            | Loads bean only if certain condition is met.                                                   |
| `@ConditionalOnProperty`         | Class / Method level            | Creates bean only if a property exists or has a specific value.                                |
| `@ConditionalOnMissingBean`      | Class / Method level            | Creates bean only if another bean is not already defined.                                      |
| `@Import`                        | Class level                     | Imports other configuration classes.                                                           |
| `@EnableScheduling`              | Class level                     | Enables scheduled task execution.                                                              |
| `@EnableAsync`                   | Class level                     | Enables asynchronous method execution.                                                         |

#### ↳ Follow-up: How does `@ConditionalOnMissingBean` let you override auto-configuration?

↪ The auto-configured bean is created only if you haven't defined one yourself — so your own bean always wins.

---
