# Java — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Thread-safe singleton
```java
public enum AppConfig {                    // simplest: safe from reflection and serialization
  INSTANCE;
  private final Properties props = load();
  public String get(String key) { return props.getProperty(key); }
}

// Alternative: holder idiom (lazy, thread-safe, no locks)
public final class Registry {
  private Registry() {}
  private static class Holder { static final Registry INSTANCE = new Registry(); }
  public static Registry get() { return Holder.INSTANCE; }
}
```

### 2. Immutable class
```java
public final class Money {
  private final BigDecimal amount;
  private final List<String> tags;
  public Money(BigDecimal amount, List<String> tags) {
    this.amount = amount;
    this.tags = List.copyOf(tags);         // defensive copy
  }
  public BigDecimal amount() { return amount; }
  public List<String> tags() { return tags; }   // already unmodifiable
}
// Java 16+: public record Money(BigDecimal amount, List<String> tags) { … }
```

### 3. equals and hashCode
```java
@Override public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof User u)) return false;
  return id == u.id && Objects.equals(email, u.email);
}
@Override public int hashCode() { return Objects.hash(id, email); }
```

### 4. LRU cache
```java
class LruCache<K, V> extends LinkedHashMap<K, V> {
  private final int capacity;
  LruCache(int capacity) { super(16, 0.75f, true); this.capacity = capacity; }  // true = access order
  @Override protected boolean removeEldestEntry(Map.Entry<K, V> eldest) { return size() > capacity; }
}
```

### 5. Stream favourites
```java
// count by department
Map<String, Long> byDept = emps.stream().collect(groupingBy(Employee::dept, counting()));
// highest salary per department
Map<String, Optional<Employee>> top = emps.stream().collect(groupingBy(Employee::dept, maxBy(comparing(Employee::salary))));
// 2nd highest salary
Optional<Integer> second = emps.stream().map(Employee::salary).distinct().sorted(reverseOrder()).skip(1).findFirst();
// first non-repeated character
Character c = s.chars().mapToObj(ch -> (char) ch)
    .collect(groupingBy(identity(), LinkedHashMap::new, counting()))
    .entrySet().stream().filter(e -> e.getValue() == 1).map(Map.Entry::getKey).findFirst().orElse(null);
// frequency of words
Map<String, Long> freq = Arrays.stream(text.split("\\s+")).collect(groupingBy(identity(), counting()));
```

### 6. Producer–consumer with BlockingQueue
```java
BlockingQueue<Order> queue = new ArrayBlockingQueue<>(100);

Runnable producer = () -> {
  try { for (Order o : orders) queue.put(o); }                 // waits if the queue is full
  catch (InterruptedException e) { Thread.currentThread().interrupt(); }
};
Runnable consumer = () -> {
  try { while (true) process(queue.take()); }                  // waits if the queue is empty
  catch (InterruptedException e) { Thread.currentThread().interrupt(); }
};
ExecutorService pool = Executors.newFixedThreadPool(2);
pool.submit(producer);
pool.submit(consumer);
```

### 7. CompletableFuture: call two services in parallel
```java
CompletableFuture<User> user = CompletableFuture.supplyAsync(() -> userClient.get(id), pool);
CompletableFuture<List<Order>> orders = CompletableFuture.supplyAsync(() -> orderClient.list(id), pool);
Profile profile = user.thenCombine(orders, Profile::new)
                      .orTimeout(2, TimeUnit.SECONDS)
                      .exceptionally(ex -> Profile.empty())
                      .join();
```

### 8. Custom exception + try-with-resources
```java
public class InsufficientFundsException extends RuntimeException {
  public InsufficientFundsException(String msg) { super(msg); }
}

try (BufferedReader br = Files.newBufferedReader(path)) {   // closed automatically
  return br.lines().count();
}
```

### 9. Deadlock (to explain) and the fix
```java
// Thread 1: lock(a) then lock(b)   Thread 2: lock(b) then lock(a)  → deadlock
// Fix 1: every thread locks in the same order (always a, then b).
// Fix 2: give up instead of waiting forever:
if (lockA.tryLock(1, TimeUnit.SECONDS)) {
  try {
    if (lockB.tryLock(1, TimeUnit.SECONDS)) {
      try { work(); } finally { lockB.unlock(); }
    }
  } finally { lockA.unlock(); }
}
```
