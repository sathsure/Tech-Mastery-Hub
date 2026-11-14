# Caching & Redis — One-liners

> The most asked questions, each answered in one sentence.

1. **What is caching?** — Keeping a copy of data in a faster place to avoid repeating slow work.
2. **What is cache-aside?** — The app checks the cache, and on a miss reads the database and fills the cache.
3. **Write-through vs write-behind?** — Write-through writes cache and DB together; write-behind writes the DB later.
4. **What is a TTL?** — Time to live: how long an entry stays before it expires.
5. **What is LRU eviction?** — Removing the least recently used entries when the cache is full.
6. **LRU vs LFU?** — LRU removes the oldest-used; LFU removes the least often used.
7. **What is a cache stampede?** — Many requests hit the database at once when a popular key expires.
8. **What is cache penetration?** — Repeated requests for keys that don't exist, always missing the cache.
9. **What is a cache avalanche?** — Many keys expiring at the same time, overloading the database.
10. **How do you invalidate on update?** — Update the database, then delete the cache key.
11. **Local vs distributed cache?** — A local cache lives in one app instance; a distributed cache (Redis) is shared by all.
12. **Why is Redis fast?** — Data is in memory and commands run on a single thread without lock overhead.
13. **What Redis data types are there?** — Strings, hashes, lists, sets, sorted sets, streams, bitmaps and HyperLogLog.
14. **What are sorted sets used for?** — Leaderboards and rankings.
15. **RDB vs AOF?** — RDB saves periodic snapshots; AOF logs every write.
16. **What is Redis Sentinel?** — A system that watches Redis and fails over to a replica automatically.
17. **What is Redis Cluster?** — Redis data split across nodes using 16,384 hash slots.
18. **How do you make a Redis lock?** — `SET key token NX EX 30`, and delete it only if the token matches.
19. **Redis vs Memcached?** — Redis has rich data types, persistence and replication; Memcached is a simple multi-threaded string cache.
20. **What does `Cache-Control: no-cache` mean?** — The browser may store it but must revalidate before using it.
