# Spring Cloud — Cheat Sheet

> **In one line:** ready-made Spring tools for microservices: shared config, finding services, one front door, and surviving failures.

## The pieces
| Need | Spring Cloud tool |
|---|---|
| Config for all services in one place | **Config Server** |
| Find services by name | **Eureka** (service discovery) |
| One entry point for all APIs | **Spring Cloud Gateway** |
| Spread calls over instances | **Spring Cloud LoadBalancer** |
| Call other services easily | **OpenFeign** |
| Survive failures | **Resilience4j** |
| Follow one request across services | **Micrometer Tracing** + Zipkin/OpenTelemetry |
| Kafka/RabbitMQ with less code | **Spring Cloud Stream** |

Old names (now replaced): Hystrix → Resilience4j, Ribbon → LoadBalancer, Zuul → Gateway, Sleuth → Micrometer Tracing.

## Config Server
- Serves each service's settings from Git (or Vault).
- Change settings without redeploying: `@RefreshScope` + `/actuator/refresh`.

## Service discovery (Eureka)
- Each service **registers** itself and sends a **heartbeat** every 30 s.
- Callers use the name, not an IP: `http://order-service/orders`.
- On Kubernetes you usually don't need Eureka — K8s Services do this.

## API Gateway
The single front door: routing, auth checks, rate limiting, CORS, logging.
```yaml
spring.cloud.gateway.routes:
  - id: orders
    uri: lb://order-service          # lb = load-balanced by name
    predicates: [ Path=/api/orders/** ]
```
- **Route** — where to send. **Predicate** — when it matches. **Filter** — change the request/response.

## OpenFeign
Call another service like a Java interface:
```java
@FeignClient(name = "inventory-service")
interface InventoryClient {
  @GetMapping("/stock/{sku}") Stock get(@PathVariable String sku);
}
```

## Resilience patterns
- **Circuit breaker** — stop calling a failing service for a while. States: **Closed** (normal) → **Open** (fail fast) → **Half-open** (try a few).
- **Retry** — try again, with a growing wait (only for safe-to-repeat calls).
- **Timeout** — don't wait forever.
- **Bulkhead** — limit how many calls can run at once, so one slow service can't use every thread.
- **Rate limiter** — limit calls per second.
- **Fallback** — a default answer when the call fails.

```java
@CircuitBreaker(name = "inventory", fallbackMethod = "defaultStock")
public Stock check(String sku) { return client.get(sku); }
```

## Distributed tracing
- Each request gets a **trace id**; each step is a **span**.
- Put the trace id in logs → find one request across all services.
