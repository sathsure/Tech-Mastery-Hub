# Caching & Redis — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Update the cache instead of deleting
- ❌ Update DB → set the new value in cache. Two writers race → cache keeps the older value.
- ✅ Update DB → **delete** the key; the next read loads fresh data.

### 2. No TTL
- ❌ Caching forever "because we delete on update".
- ✅ Always add a TTL as a safety net; some deletes will be missed.

### 3. Same TTL for everything
- ❌ 10,000 keys with TTL 3600 loaded at startup → all expire together (avalanche).
- ✅ Add random jitter to TTLs.

### 4. Caching data that must be exact
- ❌ Caching bank balances or stock counts for checkout.
- ✅ Cache only what can be slightly stale.

### 5. Redis is a database
- ❌ Storing the only copy of important data in Redis with no persistence.
- ✅ Turn on AOF/RDB, or treat Redis as a cache that can be rebuilt.

### 6. `KEYS *` in production
- ❌ Blocks Redis while it scans every key.
- ✅ Use `SCAN`.

### 7. Lock without expiry
- ❌ `SETNX lock 1` — the holder crashes → locked forever.
- ✅ `SET lock <token> NX EX 30`, and delete only if the token matches.

### 8. Local cache in a cluster
- ❌ In-app cache on 5 servers → users see different data.
- ✅ Use Redis, or accept staleness with short TTLs / invalidation events.

### 9. Caching null forever
- ❌ Caching "user not found" for an hour → a new user can't log in.
- ✅ Cache misses only briefly (seconds).

### 10. Huge values
- ❌ Storing 50 MB values in one key.
- ✅ Keep values small; Redis is single-threaded, so big values slow everyone.
