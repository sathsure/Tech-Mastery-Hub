# Caching & Redis — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Cache
🍪 Keeping biscuits in a jar on the table instead of walking to the shop each time.
**Really:** a fast copy of data close to where it's needed.

## Cache hit / miss
🫙 Jar has biscuits (hit) → eat now. Jar empty (miss) → go to the shop, refill the jar.
**Really:** data found in the cache, or fetched from the slow source and stored.

## TTL
🥛 Milk with an expiry date — after it, you throw it away and buy fresh.
**Really:** entries expire after a set time.

## LRU eviction
👕 A small wardrobe: when it's full, you give away the shirt you haven't worn for longest.
**Really:** remove the least recently used entry.

## Cache stampede
🏃 The shop opens and everyone rushes in at once because the jar just ran empty for everybody.
**Really:** many requests hit the database when a popular key expires.

## Redis
🧠 A super-fast notepad kept in memory that all your servers can read and write.
**Really:** an in-memory key-value store shared by your app servers.
