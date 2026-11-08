# ⚡ Caching & Redis Interview Preparation

## Caching Basics

### ❓ What is caching and why use it?

### 📝 Answer

A cache keeps a **copy of frequently used data in fast storage** (memory) so you don't fetch or compute it again.

- Database query: ~5–50 ms. Redis: ~0.5 ms. In-process memory: microseconds.
- Benefits: faster responses, less load on the database, lower cost.
- Cost: the copy can become **stale** (out of date) — keeping it fresh is the hard part.

**Where caches live:** browser → CDN → API gateway → application (in-memory or Redis) → database buffer pool.

---

### ❓ What are cache hit, cache miss and hit ratio?

### 📝 Answer

- **Hit** — the data is in the cache → fast.
- **Miss** — not in the cache → read the database (then usually store it).
- **Hit ratio** = hits ÷ total requests. 95% means 95 of 100 requests never touch the database.

A low hit ratio means the cache isn't helping: wrong data cached, TTL too short, or cache too small.

---

### ❓ What are the caching strategies (cache-aside, write-through, write-behind)?

### 📝 Answer

| Strategy | How it works | Good for |
|---|---|---|
| **Cache-aside (lazy loading)** | App checks cache → on miss reads DB and puts it in cache | Most read-heavy apps (default choice) |
| **Read-through** | Cache itself loads from DB on a miss | Same as above, logic inside the cache library |
| **Write-through** | Write to cache **and** DB together | Data read right after being written |
| **Write-behind (write-back)** | Write to cache; DB updated later in batches | Very high write rates; risk of losing data |
| **Write-around** | Write only to DB; cache fills on next read | Data rarely read after writing |

**Cache-aside in code:**

```java
public Product get(long id) {
    Product p = redis.get("product:" + id);
    if (p != null) return p;                       // hit
    p = db.findById(id);                           // miss
    redis.set("product:" + id, p, Duration.ofMinutes(10));
    return p;
}

public void update(Product p) {
    db.save(p);
    redis.delete("product:" + p.id());             // invalidate, next read reloads
}
```

#### ↳ Follow-up: On update, should you update the cache or delete the key?

↪ Usually **delete**. Updating can leave wrong data if two writes race; deleting just makes the next read load fresh data.

---

### ❓ What are cache eviction policies?

### 📝 Answer

When the cache is full, something must be removed.

| Policy | Removes | Note |
|---|---|---|
| **LRU** — Least Recently Used | Item not used for the longest time | Most common default |
| **LFU** — Least Frequently Used | Item used the fewest times | Keeps long-term popular items |
| **FIFO** | Oldest added item | Simple, ignores usage |
| **TTL** | Items past their expiry time | Combine with any of the above |

Redis setting: `maxmemory-policy allkeys-lru` (or `allkeys-lfu`, `volatile-ttl`...).

---

### ❓ What is cache invalidation and why is it hard?

### 📝 Answer

Invalidation = removing or updating cached data when the source changes. It's hard because the cache and database are **two separate systems**: a crash, a race between two writers, or a missed event can leave old data in the cache.

Practical approach:

1. Always set a **TTL** so stale data eventually expires.
2. **Delete the key** on update (cache-aside).
3. For many app instances, publish change events (Kafka/Redis Pub/Sub) so all of them evict.

> 💡 "There are only two hard things in computer science: cache invalidation and naming things." — Phil Karlton

---

## Cache Problems

### ❓ What are cache stampede, cache penetration and cache avalanche?

### 📝 Answer

| Problem | What happens | Fix |
|---|---|---|
| **Stampede (thundering herd)** | A popular key expires; 10,000 requests miss at once and all hit the DB | Lock so only one request reloads; or refresh early in the background |
| **Penetration** | Requests for keys that **don't exist** (e.g. id = -1) always miss and hit the DB | Cache the "not found" result briefly; use a Bloom filter; validate input |
| **Avalanche** | Many keys expire at the **same moment** (or the cache restarts) | Add random jitter to TTLs; warm the cache; keep replicas |

```java
Duration ttl = Duration.ofMinutes(10).plusSeconds(random.nextInt(60)); // jitter
```

---

### ❓ Local (in-memory) cache vs distributed cache?

### 📝 Answer

| Local (Caffeine, Guava, a `Map`) | Distributed (Redis, Memcached) |
|---|---|
| Inside the app process — fastest | Separate server — small network hop |
| Each instance has its **own copy** → may disagree | One shared copy for all instances |
| Lost on restart | Survives app restarts |
| Limited by app memory | Scales on its own |

Common combo: a small local cache (seconds) in front of Redis (minutes) — a **two-level cache**.

---

## Redis

### ❓ What is Redis and why is it so fast?

### 📝 Answer

Redis is an **in-memory key-value data store** used as a cache, session store, message broker, rate-limit counter and more.

Why fast:

- Data lives in **RAM**.
- Simple data structures with O(1) operations for most commands.
- One main thread runs commands (no lock overhead) with efficient non-blocking networking.

It can also save to disk (persistence), so data can survive a restart.

---

### ❓ What data types does Redis support, with examples?

### 📝 Answer

| Type | Example use | Commands |
|---|---|---|
| **String** | Cache a JSON value, counters | `SET`, `GET`, `INCR`, `EXPIRE` |
| **Hash** | Object fields (user profile) | `HSET user:1 name Asha`, `HGET` |
| **List** | Queue, latest 10 items | `LPUSH`, `RPOP`, `LRANGE` |
| **Set** | Unique items (tags, online users) | `SADD`, `SISMEMBER` |
| **Sorted set** | Leaderboard by score | `ZADD board 1500 asha`, `ZREVRANGE board 0 9` |
| **Stream** | Event log with consumer groups | `XADD`, `XREADGROUP` |
| Bitmap / HyperLogLog | Daily active flags / approximate unique counts | `SETBIT`, `PFADD`, `PFCOUNT` |

```bash
SET session:abc "{...}" EX 1800      # string with 30-minute expiry
INCR page:home:views                 # atomic counter
ZADD leaderboard 980 "ravi" 1500 "asha"
ZREVRANGE leaderboard 0 2 WITHSCORES # top 3
```

---

### ❓ How does Redis persistence work (RDB vs AOF)?

### 📝 Answer

| RDB (snapshot) | AOF (append-only file) |
|---|---|
| Saves the whole dataset every N minutes | Logs every write command |
| Compact file, fast restart | More durable (lose ≤ 1 second with `everysec`) |
| Can lose the minutes since the last snapshot | Bigger file, slower restart |

Use both for important data, or none for a pure cache.

---

### ❓ What are TTL and key expiry in Redis?

### 📝 Answer

A **TTL** (time to live) makes a key delete itself after a time.

```bash
SET otp:9876 "4821" EX 300   # expires in 5 minutes
TTL otp:9876                 # seconds left
PERSIST otp:9876             # remove the expiry
```

Perfect for OTPs, sessions, rate-limit windows and cache entries.

---

### ❓ Is Redis single-threaded?

### 📝 Answer

Commands run **one at a time on one main thread**, which makes each command atomic and avoids locks. Since Redis 6, network I/O can use extra threads, but command execution stays single-threaded.

Consequence: a **slow command blocks everyone** — avoid `KEYS *` on large databases (use `SCAN`), and huge `LRANGE`/`SMEMBERS` calls.

---

### ❓ How do Redis replication, Sentinel and Cluster differ?

### 📝 Answer

- **Replication** — a primary copies data to replicas (read scaling, backups).
- **Sentinel** — watches the primary and **promotes a replica** automatically if it fails (high availability).
- **Cluster** — **splits data across many primaries** (16,384 hash slots) for more memory and throughput, each with replicas.

Rule: one machine's memory is enough → replication + Sentinel. Too much data → Cluster.

---

### ❓ How do you use Redis with Spring Boot?

### 📝 Answer

Add `spring-boot-starter-data-redis` and `spring-boot-starter-cache`, then:

```java
@EnableCaching
@SpringBootApplication
class App { }

@Service
class ProductService {
    @Cacheable(value = "products", key = "#id")
    public Product get(Long id) { return repo.findById(id).orElseThrow(); }  // DB only on a miss

    @CacheEvict(value = "products", key = "#p.id")
    public Product update(Product p) { return repo.save(p); }
}
```

```properties
spring.data.redis.host=localhost
spring.cache.redis.time-to-live=10m
```

> ⚠️ **Trap:** like `@Transactional`, `@Cacheable` works through a proxy — calling the method from **inside the same class** skips the cache.

---

## Tricky Questions

### ❓ Tricky: How do you store user sessions when you have many app servers?

### 📝 Answer

Put sessions in **Redis** (Spring Session) so every server reads the same session, or avoid server sessions entirely with **JWT** tokens. Sticky sessions on the load balancer also work but break when a server dies.

---

### ❓ Tricky: How do you build a leaderboard for millions of players?

### 📝 Answer

A Redis **sorted set**: `ZINCRBY board 50 player42` on each score, `ZREVRANGE board 0 9` for the top 10, `ZREVRANK board player42` for a player's position — all O(log n).

---

### ❓ Tricky: Redis vs Memcached?

### 📝 Answer

Memcached is a simple, multi-threaded string cache. Redis has rich data types, persistence, replication, Pub/Sub, Lua scripts and transactions. Choose Redis unless you only need a plain cache and want Memcached's simplicity.

---

### ❓ Tricky: Can Redis lose data?

### 📝 Answer

Yes. Without persistence, a restart loses everything; with AOF `everysec` you can lose about one second; replication is asynchronous, so a failover can lose the latest writes. Treat Redis as a cache or keep the source of truth in a database for anything critical.
