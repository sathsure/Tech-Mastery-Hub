# Caching & Redis — Cheat Sheet

> **In one line:** keep a copy of data somewhere faster, so you don't fetch or calculate it again.

## Where caches live
Browser → CDN → reverse proxy → app memory → **Redis** → database.
- **Local cache** (in the app, e.g. Caffeine) — fastest, but each server has its own copy.
- **Shared cache** (Redis) — all servers see the same data.

## Caching strategies
- **Cache-aside** (most common) — app checks the cache; on a miss, reads the DB and saves to the cache.
- **Read-through** — the cache loads from the DB itself on a miss.
- **Write-through** — write to cache and DB together.
- **Write-behind** — write to cache now, DB later (fast, can lose data).
- **Write-around** — write only to the DB; the cache fills on the next read.

```java
User get(long id) {
  User u = cache.get(id);
  if (u == null) {                       // miss
    u = db.find(id);
    cache.set(id, u, Duration.ofMinutes(10));
  }
  return u;
}
```

## Keeping the cache fresh
- **TTL** — the entry expires after a time.
- **Delete on update** — update the DB, then delete the cache key.
- **Events** — publish "user changed" so caches drop it.

## Eviction (when the cache is full)
- **LRU** — remove what was used longest ago (most common).
- **LFU** — remove what's used least often.
- **FIFO** — remove the oldest.

## Classic problems
- **Stampede** — a popular key expires and thousands of requests hit the DB at once. *Fix:* one request refreshes (lock), others wait or get stale data.
- **Penetration** — requests for data that doesn't exist always miss. *Fix:* cache "not found" briefly, or a Bloom filter.
- **Avalanche** — many keys expire together. *Fix:* add random time to TTLs.
- **Hot key** — one key gets huge traffic. *Fix:* local cache in front, or copies.

## Redis basics
- In-memory, very fast (under 1 ms). Runs commands one at a time.
- Data types:
  - **String** — values, counters (`INCR`).
  - **Hash** — an object's fields.
  - **List** — queues, recent items.
  - **Set** — unique items.
  - **Sorted set** — leaderboards, rankings.
  - **Stream** — event log.
- `SET key value EX 60 NX` — set only if missing, expire in 60 s (used for **locks**).

## Keeping Redis safe
- **RDB** — snapshots. **AOF** — logs every write (safer).
- **Replication** — copies on other servers. **Sentinel** — automatic failover. **Cluster** — data split across servers.

## Common uses
Cache · login sessions · rate limiter · leaderboard · distributed lock · OTP with expiry · simple queue.

## HTTP caching
- `Cache-Control: max-age=3600` — browser/CDN may reuse for an hour. `no-store` — never cache.
- `ETag` — the browser asks "changed?"; the server answers `304 Not Modified`.

## In Spring
`@EnableCaching`, `@Cacheable("users")`, `@CacheEvict`, backed by Caffeine or Redis.
