# Spring Cloud — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Naming old Netflix tools
- ❌ "We use Hystrix, Ribbon and Zuul."
- ✅ They're retired. Say Resilience4j, Spring Cloud LoadBalancer and Spring Cloud Gateway.

### 2. Retrying everything
- ❌ Retrying a "charge card" POST → customer charged twice.
- ✅ Retry only idempotent calls, or send an idempotency key.

### 3. Retries without backoff
- ❌ Retrying instantly 5 times → hammers a struggling service.
- ✅ Exponential backoff + jitter, and a circuit breaker.

### 4. No timeouts
- ❌ Default (very long) timeouts → threads pile up, the caller dies too.
- ✅ Set connect and read timeouts on every remote call.

### 5. Blocking code in the Gateway
- ❌ JDBC call inside a Gateway filter.
- ✅ Gateway is reactive (Netty); blocking freezes it. Keep filters non-blocking.

### 6. Eureka on Kubernetes
- ❌ Running Eureka "because microservices need it" on K8s.
- ✅ Kubernetes Services already give discovery and load balancing.

### 7. `@RefreshScope` refreshes everything
- ❌ Expecting every bean to pick up new config.
- ✅ Only `@RefreshScope` / `@ConfigurationProperties` beans refresh.

### 8. Fallbacks that hide outages
- ❌ Fallback returns empty data silently forever.
- ✅ Log and alert when fallbacks fire; make them obviously "degraded".

### 9. Secrets in the config Git repo
- ❌ Plain passwords in `application.yml` in Git.
- ✅ Encrypt values (`{cipher}`), or use Vault / a secrets manager.
