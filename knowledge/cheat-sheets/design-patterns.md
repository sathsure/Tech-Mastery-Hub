# SOLID & Design Patterns — Cheat Sheet

> **In one line:** proven ways to organise code so it's easy to change without breaking things. Examples in Java.

## SOLID
- **S — Single Responsibility** — a class does one job. *Smell:* `UserService` also sends emails and builds PDFs.
- **O — Open/Closed** — add new behaviour by adding code, not editing old code. *Smell:* a growing `if/else` on type.
- **L — Liskov Substitution** — a child class must work wherever its parent works. *Smell:* `Square extends Rectangle` breaks `setWidth`.
- **I — Interface Segregation** — small focused interfaces, not one huge one. *Smell:* methods that just throw "not supported".
- **D — Dependency Inversion** — depend on interfaces, not concrete classes. *Smell:* `new MySqlRepo()` inside business code.

```java
interface PaymentMethod { void pay(BigDecimal amount); }
class UpiPayment implements PaymentMethod { public void pay(BigDecimal a) { … } }

class Checkout {                          // works with any payment method
  private final PaymentMethod method;
  Checkout(PaymentMethod method) { this.method = method; }
}
```

## Other principles
**DRY** (don't repeat yourself) · **KISS** (keep it simple) · **YAGNI** (don't build it until you need it) · **composition over inheritance**.

## Creational — how objects are made
- **Singleton** — only one instance (config, logger). Spring beans are singletons by default.
- **Factory** — create objects without naming the exact class: `NotificationFactory.create("sms")`.
- **Builder** — build objects with many optional fields step by step: `User.builder().name("A").build()`.
- **Prototype** — make new objects by copying an existing one.

```java
public enum AppConfig { INSTANCE; }      // simplest thread-safe singleton
```

## Structural — how objects fit together
- **Adapter** — make one interface fit another (wrap an old SDK).
- **Decorator** — wrap an object to add behaviour: `new BufferedReader(new FileReader(f))`.
- **Proxy** — a stand-in that controls access (Spring `@Transactional`, lazy loading).
- **Facade** — one simple front for a complex system: `orderFacade.placeOrder()`.
- **Composite** — treat a group and a single item the same (folders and files).

## Behavioral — how objects work together
- **Strategy** — swap algorithms at runtime (payment methods, discount rules, `Comparator`).
- **Observer** — notify subscribers when something changes (event listeners).
- **Template method** — fixed steps; subclasses fill in some steps.
- **Chain of responsibility** — pass a request through handlers (servlet filters).
- **Command** — wrap an action as an object (undo, job queues).
- **State** — behaviour changes with state (order: NEW → PAID → SHIPPED).
- **Iterator** — walk through a collection.

```java
// Strategy: a map instead of if/else
Map<String, Discount> rules = Map.of("FESTIVE", new FestiveDiscount(), "NONE", amount -> amount);
BigDecimal total = rules.get(code).apply(amount);
```

## How to answer "explain pattern X"
1. The problem it solves. 2. How it works in one sentence. 3. A real example (Java/Spring). 4. When *not* to use it.
