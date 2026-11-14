# Java — Cheat Sheet

> **In one line:** an object-oriented language that compiles to bytecode and runs anywhere a JVM is installed. Widely used for backend services.

## JDK, JRE, JVM
- **JVM** — runs the compiled bytecode.
- **JRE** — JVM + standard libraries (to *run* Java).
- **JDK** — JRE + compiler and tools (to *build* Java).
- Flow: `.java` → `javac` → `.class` (bytecode) → JVM. The **JIT** compiles hot code to machine code for speed.

## OOP — the 4 pillars
- **Encapsulation** — hide data behind methods (private fields + getters).
- **Inheritance** — a class reuses another with `extends`.
- **Polymorphism** — one name, many forms: *overloading* (same method, different parameters) and *overriding* (child replaces parent's method).
- **Abstraction** — show what, hide how: `abstract class` or `interface`.
- **Abstract class vs interface** — abstract class can hold state, one parent only; a class can implement many interfaces.

## Key keywords
- `static` — belongs to the class, not to objects.
- `final` — variable can't change / method can't be overridden / class can't be extended.
- `this` — current object. `super` — parent class.
- `finally` — always runs after `try`.

## Strings
- `String` can't be changed (immutable); literals are shared in the **string pool**.
- `StringBuilder` — changeable and fast. `StringBuffer` — same but thread-safe (slower).
- `==` checks the same object; `.equals()` checks the same text.

## equals and hashCode
If two objects are `equals`, they must have the same `hashCode`. Override both, or `HashMap`/`HashSet` misbehave. (Records do it for you.)

## Collections
- **List** — ordered, duplicates allowed: `ArrayList` (fast read by index), `LinkedList` (fast add/remove at ends).
- **Set** — no duplicates: `HashSet` (no order), `LinkedHashSet` (insertion order), `TreeSet` (sorted).
- **Map** — key → value: `HashMap` (fast, no order), `LinkedHashMap` (insertion order), `TreeMap` (sorted keys).
- **ConcurrentHashMap** — thread-safe map.
- **How HashMap works** — key's `hashCode` picks a bucket; same bucket → a list (a tree after 8 items). Grows when 75% full.
- **Comparable** — the natural order inside the class (`compareTo`). **Comparator** — an external order you pass in.

## Java 8+ features
- **Lambda** — a short function: `x -> x * 2`.
- **Stream** — process collections step by step: `filter` → `map` → `collect`.
- **Optional** — a box that may be empty; avoids null checks.
- **Records** (16) — short immutable data classes. **Virtual threads** (21) — very cheap threads.

```java
List<String> names = users.stream()
    .filter(u -> u.age() > 18)
    .map(User::name)
    .toList();
```

## Exceptions
- **Checked** — must be handled or declared (`IOException`).
- **Unchecked** — `RuntimeException` and children (`NullPointerException`); not forced.
- **Error** — serious JVM problems (`OutOfMemoryError`); don't catch.
- `throw` raises one; `throws` declares one. **try-with-resources** closes files/connections automatically.

## Threads (basics)
- Create work with `Runnable`/`Callable` and run it on an `ExecutorService` (thread pool).
- `synchronized` — one thread at a time. `volatile` — every thread sees the latest value.
- `AtomicInteger` — safe counter without locks.
- `CompletableFuture` — chain async tasks.
- **Deadlock** — two threads wait for each other's lock forever.

## JVM memory
- **Heap** — all objects (young → old generation).
- **Stack** — one per thread: method calls and local variables.
- **Metaspace** — class information.
- **Garbage collector** — frees objects nothing points to (G1 is the default).

## Other common questions
- **Java is pass-by-value** — even object references are copied.
- **Immutable class** — `final` class, `private final` fields, no setters.
- **Generics** — type-safe collections; types are erased at runtime.
- **Serialization** — turn an object into bytes (`Serializable`).
