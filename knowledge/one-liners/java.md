# Java — One-liners

> The most asked questions, each answered in one sentence.

1. **JDK vs JRE vs JVM?** — The JVM runs bytecode, the JRE adds the libraries to run apps, and the JDK adds tools to build them.
2. **Why is Java platform-independent?** — Code compiles to bytecode that runs on any operating system with a JVM.
3. **What are the 4 OOP pillars?** — Encapsulation, inheritance, polymorphism and abstraction.
4. **Overloading vs overriding?** — Overloading is the same method name with different parameters; overriding is a subclass replacing a parent method.
5. **Abstract class vs interface?** — An abstract class can hold state and is extended once; a class can implement many interfaces.
6. **Why is `String` immutable?** — For safety, caching in the string pool, and thread safety.
7. **`String` vs `StringBuilder` vs `StringBuffer`?** — `String` can't change; `StringBuilder` can and is fast; `StringBuffer` can and is synchronized.
8. **`==` vs `equals()`?** — `==` checks if two references point to the same object; `equals()` checks content.
9. **What is the equals/hashCode contract?** — Equal objects must have equal hash codes.
10. **How does HashMap work?** — The key's hash picks a bucket; collisions form a list that becomes a tree after 8 entries.
11. **`ArrayList` vs `LinkedList`?** — `ArrayList` is fast for reading by index; `LinkedList` is fast for adding/removing at the ends.
12. **`HashMap` vs `ConcurrentHashMap`?** — `HashMap` isn't thread-safe; `ConcurrentHashMap` is, without locking the whole map.
13. **`Comparable` vs `Comparator`?** — `Comparable` defines a class's natural order; `Comparator` defines an external order.
14. **Checked vs unchecked exceptions?** — Checked ones must be handled or declared; unchecked ones (`RuntimeException`) don't have to be.
15. **What is a functional interface?** — An interface with exactly one abstract method, usable with lambdas.
16. **What is a stream?** — A pipeline for processing collections with steps like `filter`, `map` and `collect`.
17. **`map` vs `flatMap`?** — `map` turns each item into one item; `flatMap` turns each item into many and flattens them.
18. **What is `Optional` for?** — To represent a value that may be absent without returning `null`.
19. **`final` vs `finally` vs `finalize`?** — `final` prevents change, `finally` always runs after `try`, `finalize` is a deprecated GC hook.
20. **What does `volatile` do?** — It makes every thread see the latest value of a variable.
21. **What does `synchronized` do?** — It lets only one thread run the block at a time on the same lock.
22. **Heap vs stack?** — Objects live on the shared heap; each thread's stack holds method calls and local variables.
23. **What is garbage collection?** — Automatic freeing of objects that nothing references anymore.
24. **What is a record?** — A short, immutable data class with constructor, getters, `equals` and `hashCode` generated.
25. **What are virtual threads?** — Very lightweight threads (Java 21) that make blocking code scale to many concurrent tasks.
