# Microservices — One-liners

> The most asked questions, each answered in one sentence.

1. **What are microservices?** — Small services, each owning one business capability and its data, deployed independently.
2. **Monolith vs microservices?** — A monolith is one deployable app; microservices are many independent ones.
3. **When should you not use microservices?** — For small teams or early products, where a modular monolith is simpler.
4. **What is a bounded context?** — A clear boundary where one model and its terms apply.
5. **Why database per service?** — So services stay independent and can change their data without breaking others.
6. **Sync vs async communication?** — Sync (REST/gRPC) waits for a reply; async (events) doesn't.
7. **What is an API Gateway?** — The single entry point that routes requests and handles cross-cutting concerns.
8. **What is a BFF?** — A Backend for Frontend: an API layer built for one client type.
9. **What is the Saga pattern?** — A sequence of local transactions with compensating steps if one fails.
10. **Choreography vs orchestration?** — In choreography services react to events; in orchestration a central coordinator directs them.
11. **What is the outbox pattern?** — Saving an event in the same DB transaction as the data, then publishing it reliably.
12. **What is CQRS?** — Using separate models for writes and reads.
13. **What is event sourcing?** — Storing every change as an event and rebuilding state from them.
14. **What is eventual consistency?** — Data across services becomes consistent after a short delay.
15. **What is a circuit breaker?** — A guard that stops calls to a failing service for a while.
16. **What is a service mesh?** — Infrastructure (like Istio) that handles retries, mTLS and traffic between services.
17. **What is a distributed monolith?** — Services so tightly coupled they must be deployed together.
18. **What is the strangler fig pattern?** — Replacing a monolith piece by piece behind the same entry point.
19. **What are contract tests?** — Tests that check a provider still meets what its consumers expect.
20. **How do you trace a request across services?** — Pass a trace id through every call and collect spans with tracing tools.
