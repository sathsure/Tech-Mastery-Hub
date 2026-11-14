# Microservices — Cheat Sheet

> **In one line:** split one big app into small services that each do one business job, own their data, and can be deployed on their own.

## Monolith vs microservices
| | Monolith | Microservices |
|---|---|---|
| Deploy | everything together | each service alone |
| Scale | the whole app | only the busy part |
| Data | one database | one database per service |
| Hard part | big codebase | network, ops, consistency |
| Best for | small teams, new products | many teams, big systems |
- A **modular monolith** is often the best first step.

## How to split
- By **business capability** (orders, payments, inventory), not by layer (UI, DB).
- **Bounded context** (from DDD) — each service owns its own model and words.
- **Database per service** — no shared tables.
- **Strangler pattern** — move a monolith piece by piece.

## How services talk
- **Sync** — REST or gRPC. Simple, but a chain of calls is slow and fragile.
- **Async** — events via Kafka/RabbitMQ. Loosely coupled, more resilient.
- **API Gateway** — one front door: routing, auth, rate limits.
- **BFF** — a small backend shaped for one frontend (web, mobile).
- **Service discovery** — find services by name (Eureka, Kubernetes DNS).

## Keeping data consistent
No single transaction across services, so:
- **Saga** — a chain of local steps; if one fails, run **compensating** steps (refund, cancel).
  - *Choreography* — services react to each other's events.
  - *Orchestration* — one coordinator tells each service what to do.
- **Outbox pattern** — save the event in the same DB transaction, publish it after. No lost events.
- **Idempotent consumers** — handle the same message twice safely.
- **CQRS** — separate models for writing and reading.
- **Event sourcing** — store every change as an event; rebuild state from them.

```
Order → Pay ✅ → Reserve stock ❌ → Refund payment → Cancel order
```

## Staying up when things fail
Circuit breaker · retries with backoff · timeouts · bulkheads · rate limits · fallbacks · health checks.

## Seeing what's happening
- Central **logs** with a trace id, **metrics** (rate, errors, latency), **distributed tracing** (OpenTelemetry).

## Deploying
- Docker + Kubernetes, a CI/CD pipeline per service.
- **Rolling**, **blue-green**, **canary** releases; feature flags.
- **Service mesh** (Istio) — retries, mTLS and traffic control outside your code.

## Security
Check tokens at the gateway, pass identity along, **mTLS** between services, secrets in a vault.

## Testing
Unit → integration → **contract tests** (Pact) → a few end-to-end tests.
