# 🌱 Inside Spring Boot: Startup, Beans, Proxies and Request Handling

## Application startup and bean management (Java / Spring Boot)

### ❓ What happens internally when a Spring Boot application starts?

**Generic answer:** Spring Boot creates an ApplicationContext, scans for components, registers bean definitions, applies auto-configuration, creates the beans, starts the embedded server and signals that the app is ready.

**Under the hood:**

Imagine an app with 500 classes — controllers, services, repositories, configuration. You never write `new` for any of them, yet they're all created and wired when the app starts. Everything begins here:

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**Step 1: Bootstrap** — `SpringApplication.run()` decides the app type (servlet web, reactive or none) and prepares the **Environment** (properties, profiles, env vars).

**Step 2: Create the ApplicationContext** — the central container that will hold every bean.

**Step 3: Component scanning** — from the main class's package down, Spring finds `@Component`, `@Service`, `@Repository`, `@Controller`, `@Configuration`.

**Step 4: Bean definitions** — each found class becomes a **BeanDefinition**: a recipe (class, scope, dependencies), not an object yet.

**Step 5: Auto-configuration** — Boot evaluates its auto-config classes. Example: if the JDBC driver is on the classpath and you haven't defined a `DataSource`, it creates one.

**Step 6: Bean creation** — singletons are created, dependencies injected, **BeanPostProcessors** applied (this is where proxies appear).

**Step 7: Embedded server** — for a web app, Tomcat starts on port 8080.

**Step 8: Ready** — the context is refreshed, `ApplicationReadyEvent` fires, `CommandLineRunner`s run.

**Final understanding:** Spring isn't magic — it does **classpath inspection → configuration evaluation → bean registration → dependency resolution → lifecycle management → server start**.

---

### ❓ How does Spring Boot auto-configuration work internally?

**Generic answer:** Boot ships many `@AutoConfiguration` classes listed in a metadata file; each is guarded by `@Conditional` checks (class present, bean missing, property set), so only the relevant ones create beans.

**Under the hood:**

Imagine adding `spring-boot-starter-data-jpa` and suddenly having a DataSource, an EntityManagerFactory and a transaction manager — with zero configuration. Who decided to create them?

**Step 1: Find candidates** — `@EnableAutoConfiguration` (inside `@SpringBootApplication`) reads `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` from every jar: a list of ~150 auto-config classes.

**Step 2: Check conditions** — each class has guards:

```java
@AutoConfiguration
@ConditionalOnClass(DataSource.class)              // JDBC on the classpath?
@ConditionalOnMissingBean(DataSource.class)        // you didn't define one?
@EnableConfigurationProperties(DataSourceProperties.class)
class DataSourceAutoConfiguration { ... }
```

**Step 3: Only matching ones run** — classes whose conditions fail are skipped.

**Step 4: Your beans win** — because of `@ConditionalOnMissingBean`, defining your own bean switches the default off.

**Step 5: Properties tune it** — `spring.datasource.url` etc. bind into the properties class.

**See it:** run with `--debug` to print the **condition evaluation report** (which matched and why).

**Final understanding:** **Starter adds jars → candidate list → conditions check classpath, existing beans and properties → only fitting defaults are created → your own beans override them.**

---

### ❓ How does component scanning discover classes?

**Generic answer:** Spring walks the packages under your main class, reads each `.class` file's metadata (without loading it), and registers a bean definition for every class marked with a stereotype annotation.

**Under the hood:**

Imagine 500 classes across 40 packages. Spring must find the ~120 that are beans — without loading every class into memory.

**Step 1: Base package** — `@SpringBootApplication` includes `@ComponentScan` on its own package. Classes outside it are not found.

**Step 2: List class files** — Spring asks the class loader for resources matching `com/shop/**/*.class`.

**Step 3: Read metadata, not classes** — it reads each file's bytecode with ASM to check annotations, so non-beans are never loaded.

**Step 4: Match stereotypes** — `@Component` and anything meta-annotated with it (`@Service`, `@Repository`, `@Controller`, `@Configuration`).

**Step 5: Register definitions** — each match becomes a `BeanDefinition` named after the class (`orderService`).

**Common bug:** "No qualifying bean" because the class lives in a package outside the main class's package.

**Final understanding:** **Base package → scan class files → read annotations cheaply → stereotype found → bean definition registered.**

---

### ❓ How does Spring create and register beans?

**Generic answer:** Spring first registers bean definitions (recipes), then instantiates each bean, injects its dependencies, runs initialisation callbacks and post-processors, and stores singletons in a registry.

**Under the hood:**

Imagine a recipe book versus cooked dishes. Spring separates "how to make it" from "making it" so it can inspect and change recipes before cooking.

**Step 1: Collect recipes** — from scanning, `@Bean` methods, `@Import` and auto-config, Spring builds `BeanDefinition`s.

**Step 2: Let tools edit recipes** — **BeanFactoryPostProcessors** run, e.g. resolving `${...}` placeholders.

**Step 3: Instantiate** — call the constructor (with dependencies resolved) or the `@Bean` factory method.

**Step 4: Populate** — inject fields and setters (`@Autowired`, `@Value`).

**Step 5: Initialise** — `@PostConstruct`, `afterPropertiesSet()`, plus BeanPostProcessors (which may return a **proxy**).

**Step 6: Register** — singletons go into the **singleton cache** (a map from name to instance).

**Final understanding:** **Recipes (definitions) → edit recipes → construct → inject → initialise/proxy → cache.**

---

### ❓ How does the IoC container maintain and manage beans?

**Generic answer:** The ApplicationContext keeps a registry of bean definitions and a cache of singleton instances, creates beans on demand in dependency order, and destroys them on shutdown.

**Under the hood:**

Imagine a warehouse manager who knows every product's recipe, keeps one copy of popular items on the shelf, makes new ones on request, and clears the shelves at closing.

**Step 1: Definition registry** — `Map<String, BeanDefinition>`: every bean's recipe.

**Step 2: Singleton cache** — `Map<String, Object>`: one instance per singleton bean.

**Step 3: Lookups** — `getBean(OrderService.class)` → in the cache? return it. Otherwise create it (and its dependencies) first.

**Step 4: Type index** — Spring can find all beans of a type (for `List<PaymentProvider>` injection).

**Step 5: Lifecycle** — on shutdown, `@PreDestroy` and `destroy()` run in reverse dependency order.

**Step 6: Extras** — the context adds events, environment/profiles, i18n messages and resource loading on top of the basic `BeanFactory`.

**Final understanding:** **Know every recipe → keep singletons cached → create on demand in dependency order → clean up in reverse.**

---

### ❓ How does dependency injection work internally?

**Generic answer:** When creating a bean, Spring inspects its constructor (and any `@Autowired` fields or setters), finds a matching bean for each dependency by type, creates it first if needed, and passes it in.

**Under the hood:**

Imagine `OrderController(OrderService)`, `OrderService(PaymentClient, OrderRepository)`. Spring must create them in the right order and connect them correctly.

**Step 1: Read the constructor** — reflection shows the parameter types.

**Step 2: Resolve each dependency** — find beans whose type matches (`PaymentClient`).

**Step 3: Create dependencies first** — not created yet? Create them recursively (depth-first).

**Step 4: Inject** — call the constructor with the resolved beans.

**Step 5: Fields and setters** — `AutowiredAnnotationBeanPostProcessor` then fills `@Autowired` fields/setters.

```java
@Service
class OrderService {
    private final PaymentClient payments;
    OrderService(PaymentClient payments) { this.payments = payments; }   // one constructor: no @Autowired needed
}
```

**Final understanding:** **Read what a bean needs → find matching beans by type → build them first → hand them in.** Constructor injection makes dependencies explicit, final and test-friendly.

---

### ❓ What happens internally when `@Autowired` is used?

**Generic answer:** A BeanPostProcessor (`AutowiredAnnotationBeanPostProcessor`) finds `@Autowired` constructors, fields and setters, resolves each dependency by type (then qualifier, then name), and sets it via reflection.

**Under the hood:**

Imagine `@Autowired private PaymentClient client;`. The field is private — your code never sets it. Yet at runtime it's filled.

**Step 1: Collect injection points** — the post-processor scans the class once and caches every `@Autowired` member.

**Step 2: Resolve** — for each, ask the container for a bean of that type.

**Step 3: Narrow down if needed** — several candidates? Use `@Qualifier`, then `@Primary`, then the field name.

**Step 4: Inject** — reflection sets the private field (`field.setAccessible(true)`), or calls the setter.

**Step 5: Missing bean** — startup fails with `NoSuchBeanDefinitionException`, unless `@Autowired(required = false)` or `Optional<>`.

**Final understanding:** **Annotation marks the spot → post-processor finds it → resolves by type/qualifier/name → reflection injects it.** Prefer constructors — no reflection into private fields, easier tests.

---

### ❓ How does Spring resolve dependencies when multiple implementations exist?

**Generic answer:** Spring narrows candidates by type, then `@Qualifier`, then `@Primary`, then matching the parameter/field name; if still ambiguous it fails with `NoUniqueBeanDefinitionException`.

**Under the hood:**

Imagine `PaymentProvider` with two beans: `cardProvider` and `upiProvider`. A service asks for `PaymentProvider`. Which one?

**Step 1: Find by type** — two candidates.

**Step 2: `@Qualifier`** — `@Qualifier("upiProvider")` picks one.

**Step 3: `@Primary`** — otherwise, a bean marked `@Primary` wins.

**Step 4: Name match** — otherwise, a parameter named `upiProvider` matches that bean.

**Step 5: Still two** — startup fails: `NoUniqueBeanDefinitionException`.

**Step 6: Want all of them?**

```java
OrderService(List<PaymentProvider> providers) { ... }      // every implementation
OrderService(Map<String, PaymentProvider> byName) { ... }   // keyed by bean name
```

**Final understanding:** **Type → qualifier → primary → name → error**, or ask for a `List`/`Map` to get them all (great for the strategy pattern).

---

### ❓ What is the complete Spring bean lifecycle?

**Generic answer:** Definition → instantiate → populate dependencies → Aware callbacks → BeanPostProcessor before-init → `@PostConstruct`/`afterPropertiesSet`/init-method → BeanPostProcessor after-init (proxies) → in use → `@PreDestroy`/`destroy` on shutdown.

**Under the hood:**

Imagine a bean that needs a database connection after its properties are set, and must close it on shutdown. Spring needs well-defined moments to run such code.

**Step 1: Instantiate** — constructor runs.

**Step 2: Populate** — `@Autowired` fields/setters, `@Value`.

**Step 3: Aware callbacks** — `BeanNameAware`, `ApplicationContextAware` give the bean its name/context.

**Step 4: Before-init post-processing** — `postProcessBeforeInitialization` (this is where `@PostConstruct` is invoked).

**Step 5: Init** — `afterPropertiesSet()`, then custom `initMethod`.

**Step 6: After-init post-processing** — `postProcessAfterInitialization`: AOP proxies are created here.

**Step 7: In use.**

**Step 8: Destroy** — on context close: `@PreDestroy`, `destroy()`, `destroyMethod` (singletons only — Spring doesn't destroy prototypes).

```text
new → inject → Aware → BPP.before (@PostConstruct) → init → BPP.after (proxy) → use → @PreDestroy → destroy
```

**Final understanding:** **Create → wire → initialise → wrap → use → destroy** — each step a hook for your code or for frameworks.

---

### ❓ How do BeanPostProcessors work?

**Generic answer:** A BeanPostProcessor is a special bean that Spring calls before and after every other bean's initialisation; it can modify the bean or return a different object, such as a proxy.

**Under the hood:**

Imagine you want every bean with `@Transactional` to be wrapped in transaction logic — without touching those classes. You need a hook that sees every bean as it's created.

**Step 1: Registered first** — Spring creates all BeanPostProcessors before ordinary beans.

**Step 2: Called for every bean** — `postProcessBeforeInitialization(bean, name)` and `postProcessAfterInitialization(bean, name)`.

**Step 3: May replace the bean** — whatever it returns is what gets stored and injected.

```java
@Component
class TimingPostProcessor implements BeanPostProcessor {
    public Object postProcessAfterInitialization(Object bean, String name) {
        return needsTiming(bean) ? createTimingProxy(bean) : bean;
    }
}
```

**Step 4: Real examples** — `AutowiredAnnotationBeanPostProcessor` (injection), `CommonAnnotationBeanPostProcessor` (`@PostConstruct`), the AOP auto-proxy creator (`@Transactional`, `@Async`, `@Cacheable`).

**Final understanding:** **Need cross-cutting changes to many beans → a hook on every bean's creation → modify or swap in a proxy.** This is the engine behind most Spring "annotations magic".

---

### ❓ How does Spring manage singleton and prototype scopes?

**Generic answer:** A singleton bean is created once per container and cached; a prototype bean is created fresh on every request and Spring doesn't manage its destruction.

**Under the hood:**

Imagine a stateless `OrderService` used by every request — one copy is enough. But a `ReportBuilder` that collects data per report must not be shared.

**Step 1: Singleton (default)** — created at startup, stored in the singleton cache, the same instance injected everywhere. Must be **thread-safe** (no per-request fields).

**Step 2: Prototype** — `@Scope("prototype")`: `getBean()` creates a new instance every time; no cache; no destroy callbacks.

**Step 3: The trap** — injecting a prototype into a singleton gives it **one** prototype instance forever (injection happens once).

**Step 4: The fix** — inject `ObjectProvider<ReportBuilder>` and call `getObject()` each time, or use `@Lookup`.

**Step 5: Web scopes** — `request`, `session` use proxies so a singleton can call the current request's instance.

**Final understanding:** **Shared and stateless → singleton (cached once); per-use state → prototype (new each time) → use a provider to get fresh ones inside singletons.**

---

### ❓ How does lazy initialization work?

**Generic answer:** A lazy bean isn't created at startup; Spring creates it the first time it's needed, often by injecting a lazy proxy that builds the real bean on first method call.

**Under the hood:**

Imagine an app with a heavy `PdfReportEngine` that loads fonts for 3 seconds but is used once a day. Creating it at startup slows every deployment.

**Step 1: Default is eager** — singletons are created at startup, so errors surface early.

**Step 2: Mark it lazy** — `@Lazy` on the class (or `spring.main.lazy-initialization=true` for all).

**Step 3: Skip at startup** — Spring registers the definition but doesn't instantiate.

**Step 4: Injection gets a proxy** — a bean that depends on it receives a lazy proxy.

**Step 5: First call creates it** — the proxy asks the container to create the real bean, then forwards the call.

**Trade-off:** faster startup, but configuration errors appear later — at the first request.

**Final understanding:** **Expensive, rarely used bean → don't create at startup → proxy stands in → real bean built on first use.**

---

### ❓ How does Spring resolve circular dependencies?

**Generic answer:** For field/setter injection of singletons, Spring could expose an early, half-built reference from a third-level cache; constructor cycles can't be resolved. Since Boot 2.6 circular references are disallowed by default.

**Under the hood:**

Imagine `A` needs `B` and `B` needs `A`. To build A you need B, and to build B you need A — a chicken-and-egg problem.

**Step 1: Constructor injection** — impossible: neither constructor can run first. Startup fails with `BeanCurrentlyInCreationException`.

**Step 2: Field/setter injection — the old workaround** — Spring constructs A (empty), puts an **early reference** to it in a cache, starts injecting, creates B, injects the early A into B, finishes B, then injects B into A.

**Step 3: The three caches** — finished singletons, early references, and factories that can produce an early (possibly proxied) reference.

**Step 4: Boot 2.6+** — `spring.main.allow-circular-references=false` by default: the app fails fast.

**Step 5: The real fix** — redesign: extract the shared logic into a third bean, use events, or inject `ObjectProvider`/`@Lazy` on one side.

**Final understanding:** **A needs B needs A → constructors can't break the loop → early references could (with risks) → modern Boot forbids it → fix the design.**

---

### ❓ How does Spring handle application events?

**Generic answer:** A bean publishes an event through `ApplicationEventPublisher`; the multicaster finds all `@EventListener` methods for that event type and calls them — synchronously by default, or after commit with `@TransactionalEventListener`.

**Under the hood:**

Imagine `OrderService` must trigger an email, a loyalty update and an audit log. Calling all three directly couples it to every feature.

**Step 1: Publish**

```java
publisher.publishEvent(new OrderPlacedEvent(orderId));
```

**Step 2: Find listeners** — the `ApplicationEventMulticaster` keeps a list of listeners per event type (from `@EventListener` methods found at startup).

**Step 3: Call them** — by default **synchronously, on the same thread**; an exception in a listener reaches the publisher.

**Step 4: Async** — add `@Async` to the listener to run it on another thread.

**Step 5: After the transaction** — `@TransactionalEventListener(phase = AFTER_COMMIT)` runs only if the transaction commits, so you never email about a rolled-back order.

**Final understanding:** **Direct calls couple features → publish an event → multicaster dispatches to listeners → choose sync, async or after-commit.** In-process only — use Kafka for other services.

---

### ❓ How does Spring manage configuration properties?

**Generic answer:** Spring collects properties from many sources into the Environment in priority order, and binds them to `@Value` fields or `@ConfigurationProperties` classes, converting types and validating them.

**Under the hood:**

Imagine `payment.timeout=5s` in `application.yml`, overridden by an env var in production and by a command-line argument during a test. One value must win, and it must become a `Duration`.

**Step 1: Collect sources** — command-line args, env vars, `application-{profile}.yml`, `application.yml`, config server… each a `PropertySource`.

**Step 2: Order by priority** — higher sources override lower ones.

**Step 3: Relaxed names** — `PAYMENT_TIMEOUT`, `payment.timeout`, `payment-timeout` all match.

**Step 4: Bind to a class**

```java
@ConfigurationProperties(prefix = "payment")
@Validated
record PaymentProperties(@NotNull Duration timeout, int retries) {}
```

**Step 5: Convert and validate** — `"5s"` → `Duration`, validation fails startup early if a value is missing.

**Final understanding:** **Settings from many places → ordered sources → one Environment → typed, validated binding.**

---

## Spring AOP and proxies (Java / Spring)

### ❓ Why was aspect-oriented programming (AOP) introduced?

**Generic answer:** AOP lets you write cross-cutting logic — transactions, logging, security, caching — once and apply it to many methods, instead of copying it into each one.

**Under the hood:**

Imagine 200 service methods, each needing: start a transaction, log timing, check permissions, commit or roll back. The business logic is 5 lines; the boilerplate is 20, copied 200 times.

**Step 1: Spot the cross-cutting concern** — same code across unrelated classes.

**Step 2: Write it once as an aspect** — the **advice** (what to do).

**Step 3: Say where it applies** — a **pointcut** (which methods), e.g. "every method with `@Transactional`".

**Step 4: Weave it in** — Spring wraps matching beans in proxies that run the advice around the real method.

**Final understanding:** **Boilerplate scattered everywhere → write it once (advice) → choose where (pointcut) → apply automatically (proxy).**

---

### ❓ How does Spring AOP work internally?

**Generic answer:** At bean creation, an auto-proxy BeanPostProcessor checks each bean against all pointcuts; if any match, it returns a proxy that holds a chain of interceptors (advice) to run around the real method.

**Under the hood:**

Imagine `OrderService.placeOrder()` with `@Transactional` and a custom `@Timed` aspect. You call `placeOrder()` — but first a transaction starts and a timer runs. Who inserted that?

**Step 1: Collect advisors** — Spring gathers every aspect's advice + pointcut (including built-in ones for `@Transactional`, `@Async`, `@Cacheable`).

**Step 2: Check each bean** — after initialisation, the auto-proxy creator asks: does any pointcut match a method of this bean?

**Step 3: Create a proxy** — if yes, it creates a JDK or CGLIB proxy containing the target and the matching interceptors.

**Step 4: Inject the proxy** — other beans receive the proxy, not the raw object.

**Step 5: Call through the chain** — each call runs interceptor 1 → interceptor 2 → … → real method, then unwinds.

**Final understanding:** **Advice + pointcuts → checked at bean creation → matching beans replaced by proxies → calls flow through an interceptor chain.** Runtime proxies only — no bytecode weaving (that's full AspectJ).

---

### ❓ How does Spring create proxy objects?

**Generic answer:** `ProxyFactory` builds either a JDK dynamic proxy (when the bean implements interfaces and interface proxying is chosen) or a CGLIB subclass proxy (Spring Boot's default), both delegating to an interceptor chain.

**Under the hood:**

Imagine Spring must give callers an object that looks exactly like `OrderService` but runs extra logic first. Java offers two ways to make a look-alike: implement the same interface, or extend the class.

**Step 1: Decide the strategy** — Boot sets `proxyTargetClass=true`, so **CGLIB** is the default; JDK proxies are used if configured and interfaces exist.

**Step 2: JDK proxy** — `Proxy.newProxyInstance(...)` creates a class implementing the bean's interfaces; every call goes to one `InvocationHandler`.

**Step 3: CGLIB proxy** — generates a **subclass** of `OrderService` at runtime, overriding each non-final method to call the interceptors.

**Step 4: Hand it out** — the proxy is stored in the container instead of the target.

**Limits:** `final` classes/methods and `private` methods can't be proxied by CGLIB.

**Final understanding:** **Need a look-alike with extra behaviour → same interface (JDK) or subclass (CGLIB) → calls routed through interceptors.**

---

### ❓ How does a JDK dynamic proxy work internally?

**Generic answer:** At runtime the JDK generates a class that implements the given interfaces; every method on it calls a single `InvocationHandler.invoke(proxy, method, args)`, which decides what to do.

**Under the hood:**

Imagine you want to log every call on a `PaymentClient` interface without writing a wrapper class for each method.

**Step 1: Ask the JDK for a proxy**

```java
PaymentClient proxy = (PaymentClient) Proxy.newProxyInstance(
    loader, new Class<?>[]{PaymentClient.class},
    (p, method, args) -> {
        log.info("calling {}", method.getName());
        return method.invoke(realClient, args);          // forward to the real object
    });
```

**Step 2: Class generated** — the JDK writes bytecode for a class `$Proxy12 implements PaymentClient`.

**Step 3: Every method forwards** — each method calls `handler.invoke(...)` with the `Method` object and arguments.

**Step 4: Handler decides** — log, check, then call the real target by reflection.

**Limit:** only **interface** methods can be proxied; casting the proxy to the implementation class fails.

**Final understanding:** **Interface → generated implementing class → all calls funnel into one handler → handler adds behaviour and forwards.**

---

### ❓ How does CGLIB create proxy classes?

**Generic answer:** CGLIB (repackaged inside Spring) generates a subclass of your class at runtime, overriding each non-final method to call an interceptor that runs the advice and then `super`'s method on the target.

**Under the hood:**

Imagine `OrderService` has no interface. A JDK proxy can't help. But Java lets you **extend** a class and override its methods.

**Step 1: Generate a subclass** — bytecode for `OrderService$$SpringCGLIB$$0 extends OrderService`.

**Step 2: Override methods** — each non-final, non-private method calls a `MethodInterceptor`.

**Step 3: Interceptor runs advice** — e.g. start a transaction.

**Step 4: Call the target** — Spring's proxy delegates to the **separate target instance** (the real bean), not to `super` on itself.

**Step 5: Instantiate without your constructor running twice** — Spring uses Objenesis to create the proxy instance.

**Limits:** `final` classes and methods, and `private` methods, can't be overridden — advice on them silently does nothing.

**Final understanding:** **No interface → generate a subclass → overridden methods route to interceptors → delegate to the real bean.**

---

### ❓ How does a method invocation pass through a proxy?

**Generic answer:** The caller calls the proxy; the proxy builds a `MethodInvocation` with an ordered list of interceptors; each interceptor does its work and calls `proceed()`, and the last `proceed()` calls the real method.

**Under the hood:**

Imagine `orderService.placeOrder(o)` where the method has `@Transactional` and `@Timed`. Two pieces of advice plus your method must run in a well-defined order.

**Step 1: Caller holds the proxy** — not the real object.

**Step 2: Proxy collects interceptors** for this method (cached after the first call).

**Step 3: Chain starts** — `TimingInterceptor.invoke(inv)` starts a timer, calls `inv.proceed()`.

**Step 4: Next interceptor** — `TransactionInterceptor` begins a transaction, calls `proceed()`.

**Step 5: Real method** — the last `proceed()` calls `target.placeOrder(o)`.

**Step 6: Unwind** — transaction commits/rolls back, timer stops, result returns to the caller.

```text
caller → proxy → Timing → Transaction → target.placeOrder() → Transaction(commit) → Timing(stop) → caller
```

**Final understanding:** **Proxy → ordered interceptor chain → each wraps the next via `proceed()` → real method in the middle → unwinds outward.**

---

### ❓ How does Spring implement cross-cutting concerns?

**Generic answer:** Through AOP proxies: each concern (transactions, security, caching, async, retries, metrics) is an interceptor applied to matching beans by an annotation-based pointcut.

**Under the hood:**

Imagine a method needing security, caching, a transaction and metrics. Each is a separate concern owned by a different Spring module — yet they all stack on one method call.

**Step 1: Concern = interceptor**

| Annotation | Interceptor |
|---|---|
| `@Transactional` | `TransactionInterceptor` |
| `@Cacheable` | `CacheInterceptor` |
| `@Async` | `AnnotationAsyncExecutionInterceptor` |
| `@PreAuthorize` | method security interceptor |
| `@Retryable` | `RetryOperationsInterceptor` |

**Step 2: Annotation = pointcut** — the annotation marks where it applies.

**Step 3: One proxy, many interceptors** — all matching interceptors join one chain, ordered by `@Order`.

**Step 4: Your own** — `@Aspect` + `@Around("@annotation(Timed)")` adds a custom concern the same way.

**Final understanding:** **Each concern written once as an interceptor → annotations mark where → all stacked into one proxy chain.**

---

### ❓ How does `@Transactional` use Spring AOP?

**Generic answer:** `@Transactional` beans are wrapped in a proxy whose `TransactionInterceptor` asks the transaction manager to begin or join a transaction before the method, and commits or rolls back after it.

**Under the hood:**

Imagine:

```java
@Transactional
public void transferMoney() {
    accountRepository.deduct(1000);
    accountRepository.add(1000);
}
```

Both updates must be one transaction. But who starts it, commits it, rolls it back? Writing that by hand in every service would be repetitive and error-prone.

**Step 1: Proxy created** — at startup, Spring sees `@Transactional` and wraps the bean.

**Step 2: Call goes through the proxy** — another bean calls `transferMoney()`.

**Step 3: Begin or join** — the `TransactionInterceptor` reads the attributes (propagation, isolation, readOnly, timeout) and asks the `PlatformTransactionManager` to start a transaction or join an existing one.

**Step 4: Bind the connection** — the connection is bound to the **current thread**, so every repository call on that thread uses it.

**Step 5: Run the method** — both updates share the transaction.

**Step 6: Commit or roll back** — success → commit. Exception → rollback **for unchecked exceptions and `Error`s** by default; checked exceptions commit unless `rollbackFor` says otherwise.

**Final understanding:** **Repeated transaction code → proxy intercepts → manager begins/joins → thread-bound connection → method runs → commit or roll back.** No proxy in the call path = no transaction.

---

### ❓ Why does calling a transactional method from another method in the same class sometimes fail?

**Generic answer:** Because the internal call uses `this`, not the proxy, so the transaction interceptor never runs — the "self-invocation" problem.

**Under the hood:**

Imagine:

```java
public void process() {
    transferMoney();          // same class, direct call
}

@Transactional
public void transferMoney() { ... }
```

A controller calls `process()`. You expect `transferMoney()` to run in a transaction. It doesn't.

**Step 1: Caller → proxy** — the controller holds the proxy and calls `process()`; it has no `@Transactional`, so the proxy just forwards.

**Step 2: Inside the real object** — `process()` runs on the **target**, where `transferMoney()` means `this.transferMoney()`.

**Step 3: Proxy bypassed** — `this` is the raw object, so no interceptor and no transaction.

**Step 4: Fixes**
- Move `transferMoney()` to another bean (cleanest).
- Put `@Transactional` on the outer method.
- Inject the bean's own proxy (`@Lazy` self-injection) or use `TransactionTemplate`.

**Final understanding:** **Annotations work only through the proxy → internal `this` calls skip it → put the boundary on a method called from outside.** Same for `@Async`, `@Cacheable`, `@Retryable`.

---

### ❓ How does `@Async` work internally?

**Generic answer:** With `@EnableAsync`, `@Async` methods are proxied; the proxy submits the call as a task to a `TaskExecutor` and returns immediately (`void` or a `CompletableFuture`).

**Under the hood:**

Imagine sending a welcome email after sign-up that takes 2 seconds. The user shouldn't wait for it.

**Step 1: Enable** — `@EnableAsync` registers a post-processor that proxies `@Async` beans.

**Step 2: Call the proxy** — `emailService.sendWelcome(user)`.

**Step 3: Wrap as a task** — the interceptor wraps the real call in a `Callable`.

**Step 4: Submit to an executor** — the configured `TaskExecutor` (Boot: a `ThreadPoolTaskExecutor`, or virtual threads if enabled) runs it on another thread.

**Step 5: Return immediately** — `void`, or a `CompletableFuture<T>` the caller can wait on.

**Traps:** self-invocation skips it; exceptions in `void` methods go to an `AsyncUncaughtExceptionHandler`; the new thread has **no** transaction or security context of the caller.

**Final understanding:** **Slow side work → proxy turns the call into a task → executor runs it on another thread → caller continues.**

---

### ❓ How does `@Cacheable` work internally?

**Generic answer:** The `CacheInterceptor` builds a key from the method arguments, looks it up in the configured cache; on a hit it returns the cached value without calling the method, on a miss it calls the method and stores the result.

**Under the hood:**

Imagine `getProduct(42)` hitting the database 5,000 times a minute for data that changes daily.

```java
@Cacheable(cacheNames = "products", key = "#id")
public Product getProduct(long id) { ... }
```

**Step 1: Enable** — `@EnableCaching` + a `CacheManager` (ConcurrentMap, Caffeine, Redis).

**Step 2: Build the key** — from arguments (here `42`).

**Step 3: Look up** — `products::42` in the cache.

**Step 4: Hit** — return the cached value; **the method body never runs**.

**Step 5: Miss** — call the method, store the result, return it.

**Step 6: Keep it fresh** — `@CachePut` updates, `@CacheEvict` removes entries when data changes; TTLs come from the cache provider.

**Final understanding:** **Repeated expensive reads → key from arguments → cache hit skips the method → miss computes and stores → evict on change.**

---

### ❓ How does `@Retryable` work internally?

**Generic answer:** Spring Retry's interceptor wraps the method in a `RetryTemplate`: on a matching exception it waits per the backoff policy and calls again, up to `maxAttempts`, then calls a `@Recover` method or rethrows.

**Under the hood:**

Imagine a payment API that fails 1% of the time with a timeout but succeeds on a second try.

```java
@Retryable(retryFor = TimeoutException.class, maxAttempts = 3,
           backoff = @Backoff(delay = 500, multiplier = 2))
public Receipt charge(Order o) { ... }

@Recover
public Receipt chargeFailed(TimeoutException e, Order o) { return Receipt.pending(o); }
```

**Step 1: Enable** — `@EnableRetry` proxies `@Retryable` beans.

**Step 2: First attempt** — the interceptor calls the method inside a `RetryTemplate`.

**Step 3: Matching exception?** — `TimeoutException` → retry; others are rethrown at once.

**Step 4: Back off** — wait 500 ms, then 1,000 ms…

**Step 5: Give up** — after 3 attempts, call `@Recover` (or rethrow).

**Warning:** retry only **idempotent** operations (or use idempotency keys) — retrying a charge can charge twice. (Spring Framework 7 also adds built-in `@Retryable` in `spring-core`.)

**Final understanding:** **Transient failure → proxy catches it → wait with backoff → try again → recover after the limit.**

---

### ❓ What happens when multiple Spring AOP advices are applied to the same method?

**Generic answer:** They are combined into one interceptor chain ordered by `@Order` (lower runs first, outermost); each wraps the next, so the order decides behaviour, e.g. whether a retry includes a fresh transaction.

**Under the hood:**

Imagine a method with `@Retryable` and `@Transactional`. If the transaction is outside the retry, all attempts share one transaction — which is already marked rollback-only after the first failure. If retry is outside, each attempt gets a new transaction.

**Step 1: Collect** — all matching advisors for the method.

**Step 2: Sort** — by `@Order` / `Ordered`; lower value = higher priority = outermost.

**Step 3: Build the chain** — outermost first.

**Step 4: Within one aspect** — `@Around` → `@Before` → method → `@AfterReturning`/`@AfterThrowing` → `@After`.

**Step 5: Control order where it matters**

```text
Retry (outer) → Transaction (inner) → method      ✅ new transaction per attempt
Transaction (outer) → Retry (inner) → method      ❌ retries inside a failed transaction
```

Set `@EnableTransactionManagement(order = ...)` or `@Order` on aspects to arrange it.

**Final understanding:** **Several concerns on one method → one chain → order decides who wraps whom → set order explicitly when it matters.**

---

## Spring MVC and request processing (Java / Spring)

### ❓ How does Spring MVC process an HTTP request internally?

**Generic answer:** Tomcat passes the request through filters to DispatcherServlet, which finds a handler via HandlerMapping, runs interceptors, invokes the controller via HandlerAdapter (resolving arguments with message converters), and writes the return value back with a converter.

**Under the hood:**

Imagine Angular sends `GET /api/employees/101`. Somewhere, `getEmployee(@PathVariable Long id)` must run with `id = 101`, and its `Employee` must leave as JSON.

**Step 1:** **Tomcat** accepts the request and assigns a thread.

**Step 2:** **Servlet filters** run (security, CORS, logging).

**Step 3:** **DispatcherServlet** receives it.

**Step 4:** **HandlerMapping** finds the matching controller method.

**Step 5:** **HandlerInterceptors** `preHandle` run.

**Step 6:** **HandlerAdapter** resolves arguments (`@PathVariable`, `@RequestBody` via HttpMessageConverter, validation) and invokes the method.

**Step 7:** Controller → service → repository → database.

**Step 8:** The returned object is serialised to JSON by **HttpMessageConverter** (Jackson).

**Step 9:** Interceptors `afterCompletion`, filters finish, the response is sent.

```text
Angular → HTTP → Tomcat → Filters → DispatcherServlet → HandlerMapping → HandlerAdapter → Controller → Service → Repository → DB
```

**Final understanding:** **One front door (DispatcherServlet) → find handler → prepare arguments → invoke → convert result → respond.**

---

### ❓ What is DispatcherServlet, and why was it introduced?

**Generic answer:** DispatcherServlet is Spring MVC's front controller: one servlet receives every request and delegates to the right handler, so common work (mapping, conversion, errors, views) is done in one place.

**Under the hood:**

Imagine old servlet apps: one servlet class per URL, each parsing parameters, handling errors and writing responses its own way. Hundreds of servlets, duplicated plumbing.

**Step 1: One entry point** — Boot registers DispatcherServlet at `/`; every request arrives there.

**Step 2: Delegate, don't do** — it asks strategy components: `HandlerMapping` (who handles?), `HandlerAdapter` (how to call?), `HandlerExceptionResolver` (what if it fails?), `ViewResolver` (render HTML?).

**Step 3: Your code stays simple** — controllers are plain classes with annotations.

**Step 4: Pluggable** — every strategy is a bean you can replace or extend.

**Final understanding:** **Many servlets with duplicated plumbing → one front controller → delegates to pluggable strategies → controllers contain only your logic.**

---

### ❓ How does HandlerMapping identify the appropriate controller?

**Generic answer:** At startup `RequestMappingHandlerMapping` registers every `@RequestMapping`-style method with its conditions (path, HTTP method, headers, consumes/produces); at request time it finds all matches and picks the most specific one.

**Under the hood:**

Imagine `GET /api/employees/101` while you have `/api/employees`, `/api/employees/{id}` and `/api/employees/search`. Spring must pick exactly one.

**Step 1: Registry at startup** — scan controllers, build a map: condition → method.

**Step 2: Match the path** — using `PathPattern` (`/api/employees/{id}` matches `101`).

**Step 3: Match other conditions** — HTTP method `GET`, `Accept`/`Content-Type`, required params/headers.

**Step 4: Pick the most specific** — literal paths beat patterns; fewer wildcards win. Ties → error at startup or request time.

**Step 5: Return a handler chain** — the method plus any interceptors for that path.

**No match:** 404 (path) or 405 (method not allowed).

**Final understanding:** **Register all mappings at startup → match path and conditions per request → most specific wins → handler + interceptors returned.**

---

### ❓ How does HandlerAdapter invoke controller methods?

**Generic answer:** `RequestMappingHandlerAdapter` resolves each method parameter with an `HandlerMethodArgumentResolver`, calls the method by reflection, and processes the return value with a `HandlerMethodReturnValueHandler`.

**Under the hood:**

Imagine `create(@PathVariable Long deptId, @Valid @RequestBody EmployeeDto dto, Principal user)`. Three parameters from three different places: URL, body, security.

**Step 1: Inspect parameters** — annotations and types for each.

**Step 2: Resolve each** — a resolver per kind: path variables, request params, headers, `@RequestBody` (via converters), `Principal`, `Pageable`…

**Step 3: Convert and validate** — `"7"` → `Long`; `@Valid` triggers Bean Validation.

**Step 4: Invoke** — reflection calls the method with the arguments.

**Step 5: Handle the return value** — `@ResponseBody`/`ResponseEntity` → message converter; a `String` view name → view resolution.

**Final understanding:** **Different parameter sources → a resolver for each → convert, validate → invoke → return-value handler writes the response.**

---

### ❓ How does Spring convert JSON into Java objects?

**Generic answer:** For `@RequestBody`, Spring picks an HttpMessageConverter that can read the request's `Content-Type` into the parameter type — for JSON, `MappingJackson2HttpMessageConverter`, which uses Jackson's `ObjectMapper`.

**Under the hood:**

Imagine the body `{"name":"Asha","salary":50000}` arriving as bytes, while your method wants `EmployeeDto`.

**Step 1: Read `Content-Type`** — `application/json`.

**Step 2: Find a converter** — the first converter that `canRead(EmployeeDto, application/json)` — Jackson.

**Step 3: Jackson parses** — streams tokens (`{`, `"name"`, `"Asha"`…).

**Step 4: Jackson builds the object** — via constructor/setters or record components, converting types (`50000` → `BigDecimal`).

**Step 5: Errors** — malformed JSON or wrong types → `HttpMessageNotReadableException` → 400.

**Step 6: The reverse** — return values go through `canWrite` and are serialised the same way.

**Final understanding:** **Bytes + content type → matching converter → Jackson parses and maps fields → typed object (and back again for responses).**

---

### ❓ How does HttpMessageConverter work?

**Generic answer:** An HttpMessageConverter reads an HTTP body into a Java object or writes an object into a body for given media types; Spring tries its converters in order and uses the first that supports the type and media type.

**Under the hood:**

Imagine one endpoint that must return JSON to Angular, XML to a legacy client and plain text to a health checker.

**Step 1: A list of converters** — String, byte array, resource, form, Jackson JSON, (optional) XML…

**Step 2: Each declares what it supports** — `canRead(type, mediaType)` / `canWrite(type, mediaType)`.

**Step 3: Content negotiation** — for responses, Spring compares the client's `Accept` header with what the method `produces` and what converters can write.

**Step 4: First match wins** — that converter writes the body and sets `Content-Type`.

**Step 5: No match** — 406 Not Acceptable (response) or 415 Unsupported Media Type (request).

**Customise:** configure the `ObjectMapper` (dates, nulls) or add a converter via `WebMvcConfigurer`.

**Final understanding:** **Many formats → converters declare what they handle → negotiate with `Accept`/`Content-Type` → first fit reads or writes the body.**

---

### ❓ How does Spring validate incoming request objects?

**Generic answer:** `@Valid` on a parameter makes Spring run Bean Validation (Hibernate Validator) on the object after binding; violations throw `MethodArgumentNotValidException`, which becomes a 400 response.

**Under the hood:**

Imagine a request with an empty name and a negative salary. You don't want `if` checks for every field in every controller.

**Step 1: Declare rules on the DTO**

```java
record EmployeeDto(@NotBlank String name, @Positive BigDecimal salary, @Email String email) {}
```

**Step 2: Ask for validation** — `create(@Valid @RequestBody EmployeeDto dto)`.

**Step 3: Bind, then validate** — after Jackson builds the object, Spring calls the `Validator` (Hibernate Validator), which reads the constraint annotations and checks each field.

**Step 4: Collect violations** — all failures, not just the first.

**Step 5: Throw** — `MethodArgumentNotValidException` → 400 (customise the body with `@ControllerAdvice`).

**Also:** `@Validated` on a class enables validation of `@PathVariable`/`@RequestParam` and service methods (via a proxy).

**Final understanding:** **Rules as annotations → `@Valid` triggers the validator after binding → violations collected → 400 before your code runs.**

---

### ❓ How does `@ControllerAdvice` work internally?

**Generic answer:** At startup Spring finds `@ControllerAdvice` beans and indexes their `@ExceptionHandler`, `@ModelAttribute` and `@InitBinder` methods; when a controller throws, `ExceptionHandlerExceptionResolver` finds the closest matching handler and invokes it.

**Under the hood:**

Imagine 40 controllers that must all turn `EmployeeNotFoundException` into a 404 with the same JSON shape.

**Step 1: Discover** — `@RestControllerAdvice` beans are collected and ordered.

**Step 2: Index handlers** — a map of exception type → handler method.

**Step 3: Exception thrown** — DispatcherServlet catches it and asks its exception resolvers.

**Step 4: Find the best handler** — first in the controller itself, then in advice beans; the **closest** exception type in the hierarchy wins.

**Step 5: Invoke it** — like a controller method: its return value (e.g. `ProblemDetail`) is written by a message converter.

```java
@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(EmployeeNotFoundException.class)
    ProblemDetail notFound(EmployeeNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }
}
```

**Final understanding:** **Same error handling everywhere → one advice bean → indexed handlers → closest match invoked → consistent response.**

---

### ❓ How does Spring handle exceptions across controllers?

**Generic answer:** DispatcherServlet passes any exception to a chain of HandlerExceptionResolvers — `@ExceptionHandler` methods, `@ResponseStatus` on the exception, and default mappings for Spring's own exceptions — and the first one that handles it writes the response.

**Under the hood:**

Imagine three failures: your `OrderNotFoundException`, a bad JSON body, and an unexpected `NullPointerException`. Each needs a sensible HTTP status.

**Step 1: Catch** — DispatcherServlet catches anything thrown during handling.

**Step 2: Resolver 1 — `ExceptionHandlerExceptionResolver`** — your `@ExceptionHandler` methods (controller, then advice).

**Step 3: Resolver 2 — `ResponseStatusExceptionResolver`** — `@ResponseStatus` on the exception class, or `ResponseStatusException`.

**Step 4: Resolver 3 — `DefaultHandlerExceptionResolver`** — Spring's own exceptions (400 for bad body, 405, 415…).

**Step 5: Nobody handled it** — the servlet container's error handling → Boot's `/error` endpoint (500).

**Tip:** with `spring.mvc.problemdetails.enabled=true`, errors use the RFC 9457 `ProblemDetail` format.

**Final understanding:** **Exception escapes → resolvers tried in order → your handlers, then annotations, then defaults → last resort `/error`.**

---

### ❓ How do servlet filters work?

**Generic answer:** Filters are servlet-level components that wrap every request in a chain; each can inspect or change the request and response and must call `chain.doFilter()` to pass control on — before DispatcherServlet is even reached.

**Under the hood:**

Imagine needing a correlation ID on every request, CORS headers, and authentication — for all endpoints, including static files and errors, before Spring MVC knows which controller applies.

**Step 1: Register** — `@Component` filters or `FilterRegistrationBean` (with URL patterns and order).

**Step 2: Build the chain** — Tomcat orders filters and puts the DispatcherServlet at the end.

**Step 3: Before** — each filter runs code, then calls `chain.doFilter(req, res)`.

**Step 4: Short-circuit** — not calling `doFilter` stops the request (e.g. 401).

**Step 5: After** — code after `doFilter` runs on the way back.

```java
@Component
class CorrelationIdFilter extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        MDC.put("cid", Optional.ofNullable(req.getHeader("X-Correlation-Id")).orElse(UUID.randomUUID().toString()));
        try { chain.doFilter(req, res); } finally { MDC.clear(); }
    }
}
```

**Spring Security** is one filter (`DelegatingFilterProxy`) containing its own chain of ~15 security filters.

**Final understanding:** **Concerns for every request → servlet-level chain → each filter wraps the next → can stop or modify → DispatcherServlet at the end.**

---

### ❓ How do Spring MVC interceptors work?

**Generic answer:** HandlerInterceptors run inside DispatcherServlet around a chosen handler: `preHandle` before the controller (can stop it), `postHandle` after it, `afterCompletion` at the very end — and they know which controller method was selected.

**Under the hood:**

Imagine you want to log which controller method served each request and block access to `/admin/**` handlers based on a custom annotation. Filters can't see the handler; interceptors can.

**Step 1: Register** — `WebMvcConfigurer.addInterceptors(...)` with path patterns.

**Step 2: Mapping attaches them** — HandlerMapping returns the handler **plus** its interceptors.

**Step 3: `preHandle(req, res, handler)`** — runs before the controller; return `false` to stop.

**Step 4: Controller runs.**

**Step 5: `postHandle`** — after the controller, before the view (not called on exceptions; for `@ResponseBody`, the body is often already written).

**Step 6: `afterCompletion`** — always, even on errors — good for cleanup and timing.

**Final understanding:** **Need handler-aware logic → interceptors inside DispatcherServlet → pre / post / after-completion hooks.** Filters = servlet level, every request; interceptors = MVC level, knows the handler.

---

### ❓ How does Spring handle multipart file uploads?

**Generic answer:** For `multipart/form-data` requests, a `MultipartResolver` (the servlet container's parser in Boot) splits the body into parts, stores files in memory or temp files, and Spring binds them to `MultipartFile` parameters.

**Under the hood:**

Imagine uploading a 20 MB PDF plus a JSON description in one request. The body is one long stream with several parts separated by a boundary string.

**Step 1: Detect** — `Content-Type: multipart/form-data; boundary=----X`.

**Step 2: Parse** — the container's multipart support splits the stream at each boundary into parts (each with its own headers).

**Step 3: Store** — small parts in memory; big ones streamed to temp files on disk (`file-size-threshold`).

**Step 4: Enforce limits** — `spring.servlet.multipart.max-file-size` / `max-request-size` (defaults 1 MB / 10 MB) → error if exceeded.

**Step 5: Bind**

```java
@PostMapping(path = "/docs", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
void upload(@RequestPart MultipartFile file, @RequestPart DocMeta meta) { file.transferTo(path); }
```

**Step 6: Clean up** — temp files are deleted after the request.

**Security:** check the real file type (first bytes), not just the name; scan and store outside the web root.

**Final understanding:** **One body, many parts → split at boundaries → memory or temp files → size limits → bound to `MultipartFile`.**
