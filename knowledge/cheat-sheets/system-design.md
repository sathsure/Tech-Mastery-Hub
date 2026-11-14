# System Design — Cheat Sheet

> **In one line:** sketch how a big system works — its parts, how data flows, and how it handles lots of users and failures. Interviewers care about your reasoning and trade-offs.

## A simple 6-step plan (about 45 minutes)
1. **Requirements** — what must it do? How many users? How fast? Can data be slightly stale?
2. **Estimates** — requests per second, storage, bandwidth.
3. **API & data** — the main endpoints and tables.
4. **High-level design** — draw the boxes: client → load balancer → services → cache → database → queue.
5. **Deep dive** — the hardest part: scaling, bottlenecks, failures.
6. **Wrap up** — trade-offs, monitoring, what you'd improve.

## Quick numbers
- 1 day ≈ 100,000 seconds. **1 million requests/day ≈ 12 per second.**
- Peak traffic ≈ 2–3× the average.
- Memory ≈ 100 ns, SSD ≈ 100 µs, network in one region ≈ 0.5 ms, across the world ≈ 150 ms.

## Building blocks
- **Load balancer** — spreads traffic across servers and skips unhealthy ones.
- **CDN** — serves images/videos/files from near the user.
- **Cache (Redis)** — keeps hot data in memory.
- **SQL database** — relationships and transactions.
- **NoSQL database** — huge scale, flexible data, simple lookups.
- **Message queue (Kafka/SQS)** — do slow work later, smooth spikes.
- **Object storage (S3)** — files and media.
- **Search engine (Elasticsearch)** — full-text search.
- **API gateway** — auth, rate limits, routing.

## How to scale
- **Vertical** — a bigger machine. **Horizontal** — more machines (needs stateless servers).
- **Read replicas** — copies of the DB for reads.
- **Sharding** — split data across DBs by a key (e.g. user id).
- **Caching** at every level.
- **Async** — put slow work on a queue.
- **Rate limiting** — token bucket or sliding window per user.

## Trade-offs to talk about
- **CAP** — during a network split, choose **consistency** (everyone sees the same data) or **availability** (always answer). Banking → consistency; likes/feeds → availability.
- **Strong vs eventual consistency**.
- **SQL vs NoSQL**, **sync vs async**, **latency vs cost**.

## Reliability
No single point of failure · copies across zones · health checks and failover · timeouts and retries · circuit breakers · idempotency keys · backups.

## Classic designs — the key idea
- **URL shortener** — generate a short id (base62); key-value store; cache popular links.
- **Rate limiter** — token bucket in Redis per user; return 429.
- **News feed** — pre-build feeds when someone posts; for celebrities, build at read time.
- **Chat app** — WebSockets; store messages; deliver when the user comes online.
- **Notification system** — queues per channel (email/SMS/push), retries, user preferences.
- **Video streaming** — upload → convert to several qualities → serve via CDN.
- **File sync (Dropbox)** — split files into chunks; upload only changed chunks.
- **Ride sharing** — drivers send locations; find nearby ones with geohashing.
- **Payment system** — idempotency keys, a ledger, reconciliation.

## Distributed ideas
- **Consistent hashing** — adding a server moves only a small part of the keys.
- **Replication** — leader–follower copies.
- **Leader election** — Raft (etcd, ZooKeeper).
- **Bloom filter** — quickly says "definitely not present" using little memory.
