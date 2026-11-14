# Caching & Redis — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Cache-aside with Redis (Java / Spring)
```java
public Product get(long id) {
  String key = "product:" + id;
  Product cached = redis.opsForValue().get(key);
  if (cached != null) return cached;                                 // hit
  Product p = repo.findById(id).orElseThrow();                       // miss → DB
  long ttl = 600 + ThreadLocalRandom.current().nextInt(60);          // jitter avoids avalanche
  redis.opsForValue().set(key, p, Duration.ofSeconds(ttl));
  return p;
}

public void update(Product p) {
  repo.save(p);
  redis.delete("product:" + p.getId());                              // delete, don't overwrite
}
```

### 2. Fixed-window rate limiter
```text
key = "rl:{userId}:{currentMinute}"
INCR key                 → count
if count == 1: EXPIRE key 60
if count > 100: reject with 429
```

### 3. Distributed lock
```text
SET lock:order:42 <random-token> NX EX 30      # only if absent, auto-expires
... do the work ...
# release only if we still own it (Lua keeps check + delete atomic)
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end" 1 lock:order:42 <random-token>
```

### 4. Leaderboard with a sorted set
```text
ZINCRBY leaderboard 50 "asha"          # add 50 points
ZREVRANGE leaderboard 0 9 WITHSCORES   # top 10
ZREVRANK leaderboard "asha"            # my position (0-based)
```

### 5. LRU cache from scratch (Python)
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity, self.data = capacity, OrderedDict()

    def get(self, key):
        if key not in self.data:
            return -1
        self.data.move_to_end(key)             # mark as recently used
        return self.data[key]

    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)      # remove least recently used
```

### 6. Stampede protection (single flight)
```java
private final ConcurrentHashMap<String, CompletableFuture<Product>> inFlight = new ConcurrentHashMap<>();

public Product getProtected(long id) {
  String key = "product:" + id;
  Product cached = redis.opsForValue().get(key);
  if (cached != null) return cached;
  // only the first caller loads from the DB; others wait for the same future
  return inFlight.computeIfAbsent(key, k -> CompletableFuture.supplyAsync(() -> loadAndCache(id)))
                 .whenComplete((r, e) -> inFlight.remove(key))
                 .join();
}
```

### 7. HTTP caching headers
```text
Cache-Control: public, max-age=31536000, immutable    # hashed static files (app.3f9a.js)
Cache-Control: no-cache                               # HTML: always revalidate
ETag: "v42"   →  client sends If-None-Match: "v42"  →  304 Not Modified
```
