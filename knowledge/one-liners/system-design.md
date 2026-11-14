# System Design — One-liners

> The most asked questions, each answered in one sentence.

1. **Vertical vs horizontal scaling?** — Vertical uses a bigger machine; horizontal adds more machines.
2. **What does a load balancer do?** — Spreads traffic across servers and skips unhealthy ones.
3. **What is a CDN?** — A network of servers that delivers content from locations near users.
4. **What is the CAP theorem?** — During a network partition a system must choose consistency or availability.
5. **Strong vs eventual consistency?** — Strong means every read sees the latest write; eventual means reads catch up after a short delay.
6. **What is sharding?** — Splitting data across databases by a key.
7. **What is consistent hashing?** — A hashing scheme where adding or removing a node moves only a small share of keys.
8. **What is replication?** — Keeping copies of data on several machines for safety and read scale.
9. **Why use a message queue?** — To process work asynchronously, smooth spikes and decouple services.
10. **What is rate limiting?** — Limiting how many requests a client can make in a period.
11. **What is a token bucket?** — A rate-limit algorithm where requests spend tokens that refill at a steady rate.
12. **What is a single point of failure?** — One component whose failure takes the whole system down.
13. **What is a stateless service?** — A service that keeps no user session in memory, so any instance can serve any request.
14. **What is a reverse proxy?** — A server in front of your servers that handles TLS, caching and routing.
15. **What is a Bloom filter?** — A compact structure that says "definitely not present" or "maybe present".
16. **Fan-out on write vs on read?** — On write builds feeds when posts are made; on read builds them when users open the feed.
17. **How does a URL shortener make short codes?** — It encodes a unique id (from a counter or ID generator) in base62.
18. **What is a Snowflake ID?** — A unique id built from timestamp, machine id and a sequence number.
19. **What is a quorum?** — The minimum number of replicas that must agree, e.g. R + W > N.
20. **How do you estimate QPS?** — Daily requests ÷ ~100,000 seconds, then multiply by 2–3 for peak.
