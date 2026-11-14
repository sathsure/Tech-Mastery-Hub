# Spring Cloud — One-liners

> The most asked questions, each answered in one sentence.

1. **What is Spring Cloud?** — A set of tools for common microservice needs like config, discovery, gateways and resilience.
2. **What is Config Server?** — A service that serves configuration for all services from Git or Vault.
3. **What does `@RefreshScope` do?** — It lets a bean reload configuration without restarting the app.
4. **What is service discovery?** — Services register themselves so others can find them by name instead of IP.
5. **What is Eureka?** — Netflix's service registry used with Spring Cloud.
6. **What is Eureka self-preservation?** — Eureka stops removing instances when many heartbeats fail at once, assuming a network problem.
7. **What is an API Gateway?** — A single entry point that routes requests and handles auth, rate limits and CORS.
8. **What are routes, predicates and filters?** — A route says where to send, a predicate says when it matches, a filter changes the request or response.
9. **What is client-side load balancing?** — The caller picks which instance to call (Spring Cloud LoadBalancer).
10. **What is OpenFeign?** — A declarative HTTP client: write an interface and Spring implements the calls.
11. **What is a circuit breaker?** — It stops calling a failing service for a while so failures don't spread.
12. **What are the circuit breaker states?** — Closed (normal), Open (fail fast) and Half-open (trial calls).
13. **What is a bulkhead?** — A limit on concurrent calls so one slow dependency can't use every thread.
14. **What is a fallback?** — A default response returned when a call fails.
15. **What replaced Hystrix?** — Resilience4j.
16. **What replaced Zuul and Ribbon?** — Spring Cloud Gateway and Spring Cloud LoadBalancer.
17. **What is distributed tracing?** — Following one request across services using a shared trace id.
18. **What is a span?** — One operation within a trace, like a single HTTP or DB call.
19. **What is Spring Cloud Stream?** — A way to write Kafka/RabbitMQ consumers and producers as simple functions.
20. **Do you need Eureka on Kubernetes?** — Usually not, because Kubernetes Services already provide discovery.
