# System Design — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Drawing boxes first
- ❌ Starting with "We'll use Kafka and Cassandra."
- ✅ Ask about requirements and scale first; choose tools to fit them.

### 2. No numbers
- ❌ "It'll handle a lot of traffic."
- ✅ Estimate: 10M users × 20 requests/day ≈ 2,300/sec average, ~7,000 at peak.

### 3. Single point of failure
- ❌ One database, one load balancer.
- ✅ Replicas, multiple zones, failover.

### 4. Stateful servers
- ❌ Sessions stored in server memory → adding servers breaks logins.
- ✅ Keep servers stateless (sessions in Redis or tokens).

### 5. Over-engineering
- ❌ Microservices + sharding + multi-region for 1,000 users.
- ✅ Design for the given scale, then explain how you'd grow.

### 6. Ignoring the read/write ratio
- ❌ Same design for a read-heavy feed and a write-heavy logger.
- ✅ Read-heavy → caches and replicas. Write-heavy → queues, batching, sharding.

### 7. Hot shard
- ❌ Sharding tweets by `celebrity_id` → one shard melts.
- ✅ Choose keys that spread load; special-case hot keys.

### 8. Retries without idempotency
- ❌ Payment retry → charged twice.
- ✅ Idempotency keys for every write that may be retried.

### 9. Forgetting monitoring
- ❌ Ending without saying how you'd know it's broken.
- ✅ Mention metrics, logs, tracing and alerts.

### 10. CAP said wrong
- ❌ "We'll pick CA."
- ✅ Network splits will happen, so it's C or A during a split.
