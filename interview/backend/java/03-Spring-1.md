## Spring Core & Fundamentals

### ❓ What is Spring, Why it was introduced?

### 📝 Answer

Spring is a **lightweight, modular, inversion-of-control (IoC) based framework** that helps build loosely coupled, testable, enterprise Java applications.

**Core Principles**

- Inversion of Control (IoC)
  - Dependency Injection (DI)
  - Spring IoC Container
- Aspect-Oriented Programming (AOP)
- Declarative Transactions
- Modular Design

---

### ❓ What is Spring IoC and how is it implemented internally?

### 📝 Answer

**Inversion of Control (IoC)**

Control of **object creation is transferred** from the application code **to the Spring container**.

```java
// ❌ Without Spring:
Service service = new ServiceImpl();

// ✅ With Spring:
@Autowired
private Service service;
```

> IoC (in Spring) → Spring container controls object creation and lifecycle.
> DI (in Spring) → Spring injects required dependencies into those objects.

_a. **Dependency Injection (DI)** – Core IoC Implementation_

Spring implements IoC mainly using **Dependency Injection**, where dependencies are provided to an object rather than the object creating them itself.

Types of Dependency Injection:

| Types                     | Explanation                                        |
| ------------------------- | -------------------------------------------------- |
| **Constructor Injection** | Dependencies are injected via the constructor      |
| **Setter Injection**      | Dependencies are injected via setter methods       |
| **Field Injection**       | Dependencies are injected directly into its fields |

❌ Field Injection — Problems Explained with **One Simple Example**

```java
@Service
public class OrderService {

    @Autowired
    private PaymentService paymentService; // cannot be final. Object exists without its required dependency.

    public void placeOrder() {
        paymentService.pay();   // ❌ may be null
    }
}

OrderService service = new OrderService();   // Looks valid, but required dependency is invisible
service.placeOrder();   // ❌ NullPointerException
```

What Goes Wrong Here

- **Dependencies are hidden → class contract is unclear**
- **Object can be created in an invalid state**
- **No immutability (`final` not possible)**

```java
OrderService service = new OrderService();
// No way to inject mock without Spring or reflection
```

- **Failures occur at runtime, not at creation**

```java
service.placeOrder(); // ❌ fails during execution
```

✅ Constructor Injection — The Fix

```java
public class OrderService {

    private final PaymentService paymentService;

    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
}
```

- Immutable objects are thread-safe
- App fails during startup in case of missing dependency at compile-time
- Prevents Circular Dependency Bugs
- Works Perfectly with Spring Boot Auto-Configuration (Use `@RequiredArgsConstructor` - Lombok)

_b. Spring IoC Container (Core Implementation Mechanism)_

The **IoC container** is responsible for:

- Instantiating beans
- Injecting dependencies
- Managing lifecycle
- Handling scopes

![SpringBeanLifeCycle Image](/src/assets/backend/spring-bean-life-cycle.png)

Two Main IoC Containers

🔹 **BeanFactory (Basic Container)**

BeanFactory is the basic container in Spring used to **Creates objects (beans), Stores them, provide when needed**.

```java
BeanFactory factory = new ClassPathXmlApplicationContext("beans.xml");

MyService service = factory.getBean(MyService.class);

```

➡ Bean is created only when `getBean()` is called, makes it **lazy initialization**

🔹 **ApplicationContext (Advanced – Most Used)**

ApplicationContext is the advanced Spring container

- Creates **beans**
- Connects them together
- Prepares **everything in advance**
- Makes sure the application is ready to run

```java
ApplicationContext context =
        new AnnotationConfigApplicationContext(AppConfig.class);
```

➡ Bean is created at **application startup**, before `getBean()` is called, which makes it **eager initialization** .

```java
//  Spring Boot
@SpringBootApplication
public class MyApp {}


// ➡ Spring Boot automatically creates an ApplicationContext. You never see BeanFactory

// Spring (non-Boot)
AnnotationConfigApplicationContext context =
    new AnnotationConfigApplicationContext(AppConfig.class);


// ➡ Still ApplicationContext
```

> **Spring Boot always uses ApplicationContext**

---

### ❓ What are the different bean configuration approaches used to implement IoC in Spring?

### 📝 Answer

Spring provides multiple ways to define **what objects the container manages**.

🔹 **XML-Based Configuration (Legacy)**

```xml
<bean id="paymentService" class="com.app.PaymentService"/>
```

❌ Verbose, hard to maintain

🔹 **Annotation-Based Configuration (Most Common)**

Annotation-Based Configuration → Spring creates beans automatically by scanning classes

```java
@Component
@Service
@Repository
@Controller
```

```java
@Autowired
private PaymentService paymentService;
```

✅ Cleaner
✅ Modern standard

🔹 **Java-Based Configuration (Best Practice)**

Java-Based Configuration → Explicitly tell Spring how to create beans inside a configuration class.

```java
@Configuration
public class AppConfig {

    @Bean
    public PaymentService paymentService() {
        return new PaymentService();
    }
}
```

✅ Type-safe
✅ Refactoring-friendly
✅ Preferred in enterprise apps

---

### ❓ Common Spring Dependency Injection Errors – Why Do They Happen?

### 📝 Answer

🤔❓ My class is not getting injected. Spring says `NoSuchBeanDefinitionException`. Why?

❌ Spring does not know the class. Spring only creates objects for classes it knows about
✅ Mark the class with a stereotype annotation.

```java
@Component
public class EmailService {}
// using @Service is better practice.
```

🤔❓ I am getting `NullPointerException` when using a dependency. Why?

❌ Dependency is not injected.
✅ Use `@Autowired` (prefer **constructor injection**).

🤔❓ Spring throws `NoUniqueBeanDefinitionException`. Why?

❌ More than one implementation exists.

```java
public interface PaymentService {
    void pay();
}
@Service
public class CreditCardPaymentService implements PaymentService {
public void pay() {
System.out.println("Paid using Credit Card");
}
}
@Service
public class UpiPaymentService implements PaymentService {
public void pay() {
System.out.println("Paid using UPI");
}
}
@Service
public class CheckoutService {
    @Autowired
    private PaymentService paymentService; // ❌ Ambiguous. Spring does not know which implementation to inject.
}
```

✅ Use `@Qualifier` or `@Primary`.

```java
/* Qualifier on injection point */
@Component
public class CheckoutService {
    @Autowired
    @Qualifier("creditCardPaymentService") // ✅ Spring injects CreditCardPaymentService (defaults to class name with first letter lowercase)
    private PaymentService paymentService;
}
/* Custom qualifier name */
@Component("creditPayment")
public class CreditCardPaymentService implements PaymentService {
    public void pay() {}
}
@Autowired
@Qualifier("creditPayment")
private PaymentService paymentService;
/* using @Primary */
@Primary  // Spring will inject UpiPaymentService unless overridden by @Qualifier.
@Component
public class UpiPaymentService implements PaymentService {
    public void pay() {}
}
```

🤔❓ What happens if both `@Primary` and `@Qualifier` are used?

✅ `@Qualifier` overrides `@Primary`

🤔❓ Does `@Autowired` inject by type or name?

✅ By type first, then by name if needed

```
1. By Type
2. @Qualifier (if present)
3. @Primary
4. By Name
5. Exception
```

🤔❓ @Component vs @Bean

🔹 @Component

- Class-level
- Auto-scanned
- Used for your own classes

```java
@Component
public class MyService {}
```

🔹 @Bean

- Method-level
- Inside `@Configuration` class
- Used when you want manual object creation

```java
@Bean
public DataSource dataSource() {
   return new HikariDataSource();
}
```

🤔❓ What is the Return type of `@Bean`?

Return type = Object you want Spring to manage.

🤔❓ Can we have Multiple `@Bean`?

Use:

- Method name as bean name
- OR `@Bean(name="customName")`
- OR `@Qualifier`

🤔❓ I cannot add `@Component` to a library class. Third-party classes cannot be annotated.. How to create object?

✅ Define the bean using `@Bean` in the `@Configuration` class.

🤔❓ My application startup is slow because a specific bean is being initialized at launch. How to fix it?

✅Use `@Lazy`

```java
@Lazy
@Component
public class ReportService {
}
```

> Bean will be created only when needed.
> h. I need to execute a logic immediately after a bean is create. How can I do it?
> ✅Use `@PostConstruct`

```java
@PostConstruct
public void init() {
    System.out.println("Bean initialized");
}
```

```
Constructor
↓
@Autowired
↓
@PostConstruct
```

> Runs after dependencies are injected.
> i. I’m seeing resource leaks where **DB connections and threads** aren't closing on shutdown; how can I fix it?
> ✅ Use `@PreDestroy`

```java
@PreDestroy
public void cleanup() {
    System.out.println("Releasing resources");
}
```

> Runs just before bean destruction.
> j. I see that my DB changes aren't rolling back on exceptions. how can I fix this?
> ✅Use `@Transactional`

```java
@Transactional
public void saveOrder() {
    orderRepository.save(order);
    throw new RuntimeException("Error");
}
```

> Spring manages commit & rollback automatically

---

### ❓ Can you explain the different bean scopes in Spring?

### 📝 Answer

Spring controls **how many instances** of a bean exist.

| Scope         | Description                          |
| ------------- | ------------------------------------ |
| `singleton`   | One instance per container (default) |
| `prototype`   | New instance every request           |
| `request`     | One per HTTP request                 |
| `session`     | One per HTTP session                 |
| `application` | One per ServletContext               |

```java
@Scope("prototype")
@Component
public class ReportGenerator {}
```

---

### ❓ Explain the lifecycle of a Spring bean and how you can intervene at different stages of its initialization and destruction.

### 📝 Answer

🔹 JVM STARTS → `main()` METHOD

```java
@SpringBootApplication // Combines @Configuration, @EnableAutoConfiguration, @ComponentScan
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

- JVM loads `MyApplication`
- JVM calls `main()`
- Control enters Spring Boot

🔹 `SpringApplication.run()` runs and create `SpringApplication` object

```java
public static ConfigurableApplicationContext run(
        Class<?> primarySource, String... args)
```

```java
public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
    return new SpringApplication(primarySource).run(args);
}
```

- `run()` is static, only as an **entry point**
- Inside:
  - `new SpringApplication(primarySource)` → **object is created**
  - That object’s **non-static `run()` method** is called

✔ Static method → creates instance → instance drives everything

🔹 Application Type Detection (Servlet vs Reactive)

Inside the **SpringApplication constructor**, Spring checks the **classpath**, NOT annotations.

| Found on classpath                                   | Application Type             |
| ---------------------------------------------------- | ---------------------------- |
| `javax.servlet.Servlet`                              | SERVLET (Spring MVC, Tomcat) |
| `org.springframework.web.reactive.DispatcherHandler` | REACTIVE (WebFlux)           |
| None                                                 | NONE (CLI / Batch app)       |

This can be found in `pom.xml`
**pom.xml**

```xml
<dependency>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Classpath contains:

- javax.servlet.Servlet
- Tomcat / Jetty / Undertow

> ➡ Spring Boot chooses SERVLET

🔹 `run()` METHOD – High Level Flow

Once the `SpringApplication` object exists, its **instance `run()`** method executes:

1. Prepare environment
2. Create ApplicationContext
3. Load configuration classes
4. Refresh context
5. Create beans
6. Start web server

🔹 Environment Preparation (ONLY properties loading)

Spring loads configuration properties **before** creating the container.

**Properties are loaded from (priority order)**

- Command-line arguments
- `application.properties`
- `application.yml`
- `application-{profile}.properties`
- OS environment variables
- JVM system properties

✔ These values are stored
✔ Used later during bean creation
✔ No beans created here

🔹 ApplicationContext Creation

After environment is ready, Spring creates the container.

```java
// 1. Create a new ApplicationContext instance
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();

// 2. Register configuration classes or individual beans
context.register(AppConfig.class) // Optional in Spring Boot
```

It creates an empty Spring ApplicationContext object that is capable of:

- Accepting Java-based configuration (`@Configuration`, `@Component`)
- Creating and managing a `BeanFactory` later
- Starting the Spring lifecycle when `refresh()` is called

> At this point, Spring has NOT started yet

🔹 `refresh()` is called (the real work starts)

Spring now calls:

```java
context.refresh();
```

This is where **everything meaningful happens**.

- Create the REAL Container

```java
DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
```

> ✅ THIS is the IoC container

- Load Bean Definitions
  - `@SpringBootConfiguration`
  - `@ComponentScan`
  - `@EnableAutoConfiguration`

🔹 `@SpringBootConfiguration` or `@Configuration`?

```java
@SpringBootConfiguration
public class MyApplication {}

// Is internally equivalent to:
@Configuration
public class MyApplication {}
```

- Parses the class
- Finds `@Bean` methods
- Registers **bean definitions**

> ⚠️ No beans created yet

🔹 `@ComponentScan`

**Find components in packages**

- Scans packages
- Registers bean definitions for:
  - `@Component`
  - `@Service`
  - `@Repository`
  - `@Controller`

> ⚠️ Still no objects created

🔹 `@EnableAutoConfiguration`

- Reads a list of auto-configuration classes from:

  ```
  META-INF/spring.factories
  META-INF/spring/...AutoConfiguration.imports
  ```

- Loads **configuration classes**
- Applies conditions:
  - Class present?
  - Property enabled?
  - Bean already exists?

✔ Registers **conditional bean definitions**

Example:

- If `DataSource` class exists → register datasource beans
- If `spring.datasource.*` exists → enable DB auto config

> ⚠️ Still no objects created

🔹 **Beans are created ONLY after all configuration and scanning is complete**

**Trigger point**

```java
preInstantiateSingletons()
```

- Create object (constructor)
- Inject dependencies
- Call `@PostConstruct`
- Bean is ready

🤔❓ Is `@PostConstruct` called once or after all beans?

✅ Once per bean
❌ Not after all beans are created

🤔❓ What about @Lazy beans?

- Skipped in preInstantiateSingletons()
- Created later when first requested

🤔❓ What about prototype beans?

- NOT created in preInstantiateSingletons()
- Created every time they are requested

---

### ❓What is Spring Profile?

### 📝 Answer

A Spring Profile is a way to activate different configurations for different environments (like `dev`, `test`, `qa`, `prod`) without changing code.

1. **Using Profiles with `application.properties`**

**application-dev.properties**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/devdb
spring.datasource.username=devuser
spring.datasource.password=devpass
```

**application-prod.properties**

```properties
spring.datasource.url=jdbc:mysql://prod-server:3306/proddb
spring.datasource.username=produser
spring.datasource.password=securepass
```

**Activate Profile**

```properties
spring.profiles.active=dev

# Multiple Active Profiles
spring.profiles.active=prod,cloud
```

If **no profile is active**, Spring uses:

```text
default
```

You can define:

```properties
spring.profiles.default=dev
```

> 📌 **Only `dev` configuration loads**

2. **Using `@Profile` Annotation (Beans Level)**

**Dev Configuration**

```java
@Configuration
@Profile("dev")
public class DevConfig {

    @Bean
    public DataSource dataSource() {
        return new HikariDataSource();
    }
}
```

**Prod Configuration**

```java
@Configuration
@Profile("prod")
public class ProdConfig {

    @Bean
    public DataSource dataSource() {
        return new HikariDataSource();
    }
}
```

> 📌 Only **one DataSource bean** is created based on active profile.

3. **Profile-Specific Beans (Same Interface)**

```java
public interface NotificationService {
    void send(String message);
}
```

**Dev Implementation**

```java
@Service
@Profile("dev")
public class ConsoleNotificationService implements NotificationService {
    public void send(String message) {
        System.out.println("DEV: " + message);
    }
}
```

**Prod Implementation**

```java
@Service
@Profile("prod")
public class EmailNotificationService implements NotificationService {
    public void send(String message) {
        // Send real email
    }
}
```

> 📌 Spring injects the **correct implementation automatically**

🤔❓ Can multiple profiles be active at the same time?

✔️ Yes. Spring loads beans from **all active profiles**.

🤔❓ What happens if two profiles define the same bean?

⚠️ Bean conflict → Spring throws `NoUniqueBeanDefinitionException` unless qualified.

🤔❓ Difference between `@Profile` and `@Conditional`?

| `@Profile`        | `@Conditional`     |
| ----------------- | ------------------ |
| Environment-based | Custom logic-based |
| Simple            | More powerful      |

🤔❓ Are profiles evaluated at runtime?

❌ No.
✔️ Profiles are resolved **at application startup**.

🤔❓ Why `@Conditional` Is Used?

- When `@Profile` is not flexible enough
- When bean creation depends on:
  - Environment variables
  - Classpath availability
  - Configuration values
  - Custom runtime checks

```java
// Create a Condition
public class ProdCondition implements Condition {

    @Override
    public boolean matches(
        ConditionContext context,
        AnnotatedTypeMetadata metadata) {

        String env = context.getEnvironment()
                            .getProperty("spring.profiles.active");
        return "prod".equals(env);
    }
}

// Use @Conditional
@Configuration
public class AppConfig {

    @Bean
    @Conditional(ProdCondition.class)
    public DataSource prodDataSource() {
        return new HikariDataSource();
    }
}
```

> 📌 Bean is created only if condition returns true

---

### ❓What is Spring Boot Actuator?

### 📝 Answer

**Spring Boot Actuator** is a production-ready feature of Spring Boot that helps you **monitor, manage, and inspect your application** while it is running.

> Actuator answers How is my application behaving right now?

| Endpoint             | Purpose                      |
| -------------------- | ---------------------------- |
| `/actuator/health`   | Application health           |
| `/actuator/info`     | App metadata                 |
| `/actuator/metrics`  | JVM & custom metrics         |
| `/actuator/env`      | Environment properties       |
| `/actuator/beans`    | Spring beans                 |
| `/actuator/mappings` | Request mappings             |
| `/actuator/loggers`  | Change log levels at runtime |
| `/actuator/shutdown` | Graceful shutdown (optional) |

🔹 Step 1: Add Dependency

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

🔹 Step 2: Enable Endpoints

By default, only `/health` and `/info` are exposed.

```properties
# application.properties
management.endpoints.web.exposure.include=health,info,metrics
```

🤔❓ Is Spring Boot Actuator enabled by default in a Spring Boot application?

❌ **No.**

Spring Boot Actuator is **not enabled by default**.

You must add the dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

🤔❓ Difference between Actuator and Logging?

- **Logging** shows what happened.
- **Actuator** shows current system state.

🤔❓ Difference between Actuator and Swagger?

- **Actuator** is for operations & monitoring,
- **Swagger** is for API documentation & testing.

🤔❓ How do you enable only /health and /info endpoints in Spring Boot Actuator?

Configure it in `application.properties`:

```properties
management.endpoints.web.exposure.include=health,info
management.endpoints.web.exposure.exclude=*
```

![SpringActuator Image](/src/assets/backend/spring-actuator.png)

---

### ❓ What is Spring AOP, Why it was introduced?

### 📝 Answer

Spring AOP (Aspect-Oriented Programming) is a module of the Spring Framework that helps you **separate cross-cutting concerns** (like logging, security, transactions, monitoring) from your business logic.

> Spring AOP = Clean code + Reusable behavior + Less duplication

| Concept        | Simple Meaning                                       |
| -------------- | ---------------------------------------------------- |
| **Aspect**     | Class containing cross-cutting logic                 |
| **Advice**     | When the logic runs (`@Before`, `@After`, `@Around`) |
| **Join Point** | Method execution point                               |
| **Pointcut**   | Expression to match methods                          |
| **Weaving**    | Applying aspect to target                            |
| **Proxy**      | Wrapper object created by Spring                     |

**Types of Advice**

| Advice Type       | Runs When                      |
| ----------------- | ------------------------------ |
| `@Before`         | Before method execution        |
| `@After`          | After method (finally)         |
| `@AfterReturning` | After successful return        |
| `@AfterThrowing`  | On exception                   |
| `@Around`         | Before & after (most powerful) |

❌ **Without AOP (Logging mixed with business logic)**

```java
@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    public void placeOrder() {
        logger.info("placeOrder() started");

        System.out.println("Placing order..."); // Business logic

        logger.info("placeOrder() finished");
    }
}
```

❗ Problems

- Logging code repeated in every method
- Business logic is polluted
- Hard to maintain if logging changes

✅ **With AOP (Clean & Maintainable)**

1. Business Logic (NO logging code)

```java
@Service
public class OrderService {

    public void placeOrder() {
        System.out.println("Placing order...");
    }
}
```

2. Logging Aspect

```java
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.example.service.*.*(..))")
    public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {

        logger.info(joinPoint.getSignature() + " started");

        Object result = joinPoint.proceed(); // calls actual method

        logger.info(joinPoint.getSignature() + " finished");

        return result;
    }
}
```

🤔❓ How Spring AOP Works Internally

- Spring creates a proxy object
- Calls go through the proxy
- Proxy executes aspect logic
- Then calls actual method

🤔❓ Can Spring AOP intercept private methods?

    No. It works on public/protected methods via proxies.

🤔❓ Spring AOP vs AspectJ

| Spring AOP          | AspectJ                          |
| ------------------- | -------------------------------- |
| Runtime proxy       | Compile-time / load-time weaving |
| Method-level only   | Fields, constructors, methods    |
| Easy & lightweight  | Powerful but complex             |
| Used in Spring apps | Used for deep instrumentation    |

---

### ❓ What is Spring Modular Design?

### 📝 Answer

![ModularDesign Image](/src/assets/backend/spring-modular-design.png)

**Spring Modular Design** means the Spring Framework is built as a collection of independent, loosely coupled modules, where each module solves a specific concern (core container, web, data access, security, etc.).

> 👉 You only include what you need, keeping applications lightweight, maintainable, and scalable.

| Types                                | Responsibilities                                                        |
| ------------------------------------ | ----------------------------------------------------------------------- |
| **Spring Core Container**            | IoC Container, Bean lifecycle, Dependency Injection, Configuration Mgmt |
| **Spring Data Access / Integration** | JDBC, ORM (Hibernate, JPA), Transactions, Spring Data JPA               |
| **Spring Web Layer**                 | Spring MVC, Spring WebFlux (Reactive)                                   |
| **Spring Security**                  | Authentication, Authorization, CSRF protection, OAuth2, JWT             |
| **Spring AOP**                       | Logging, Security, Transactions, Auditing                               |

---

## Other Spring Concepts

### ❓ Spring HATEOAS

### 📝 Answer

❓ Problem Before

- REST APIs returned **only data**
- Client didn’t know **next actions / URLs**

✅ What it Solves

- Adds **hypermedia links**
- Makes API **self-discoverable**

🔁 What was used before

- Plain REST + hardcoded URLs

💡 Example

```java
EntityModel<User> model = EntityModel.of(user);
model.add(linkTo(methodOn(UserController.class).getAll()).withRel("all-users"));
```

🧠 In Short

> HATEOAS adds links to REST responses so clients know what to do next.

---

### ❓ Thymeleaf

### 📝 Answer

❓ Problem Before

- JSP had poor Spring integration
- Not HTML-friendly

✅ What it Solves

- **Server-side HTML rendering**
- Works naturally with Spring MVC

🔁 What was used before

- JSP, Velocity, FreeMarker

💡 Example

```html
<p th:text="${user.name}"></p>
```

```java
model.addAttribute("user", user);
```

🧠 In Short

> Thymeleaf is a server-side template engine used to render dynamic HTML in Spring Boot.

---

### ❓ application.properties vs application.yml?

### 📝 Answer

Both are used to **configure Spring Boot applications** (DB config, server port, logging, etc.).

| application.properties      | application.yml          |
| --------------------------- | ------------------------ |
| Key = value format          | YAML (indentation-based) |
| Easy for small configs      | Best for complex configs |
| Less readable for hierarchy | Very readable & clean    |
| No indentation              | Indentation is mandatory |

Spring Boot supports **both**, but **YAML is preferred** for large projects.

**Example**

application.properties

```properties
server.port=8081
spring.datasource.url=jdbc:mysql://localhost:3306/testdb
spring.datasource.username=root
spring.datasource.password=admin
```

application.yml

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/testdb
    username: root
    password: admin
```

> prefer `application.yml` for readability when configs grow.

---

### ❓ What Unit Testing technique you used in Java and Spring?

### 📝 Answer

**Tools Used**

- **JUnit 5** → Testing framework
- **Mockito** → Mock dependencies
- **Spring Boot Test** → Integration testing

**Unit Testing (Service Layer Example)**

Service Class

```java
@Service
public class UserService {

    public String getUserName() {
        return "Dev";
    }
}
```

Unit Test

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Test
    void testGetUserName() {
        assertEquals("Dev", userService.getUserName());
    }
}
```

**Mocking Dependencies (Real-world Example)**

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void testCreateOrder() {
        when(orderRepository.save(any()))
            .thenReturn(new Order(1L));

        Order order = orderService.createOrder(new Order());

        assertNotNull(order);
    }
}
```

**Spring Boot Integration Test**

```java
@SpringBootTest
class UserControllerTest {

    @Autowired
    private UserController controller;

    @Test
    void contextLoads() {
        assertNotNull(controller);
    }
}
```

> Write unit tests with Mockito and integration tests using `@SpringBootTest`.

---
