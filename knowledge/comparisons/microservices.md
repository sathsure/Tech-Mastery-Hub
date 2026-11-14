# Microservices — Comparisons

> The classic "X vs Y" questions, side by side.

## Monolith vs modular monolith vs microservices
| | Monolith | Modular monolith | Microservices |
|---|---|---|---|
| Deploy | one unit | one unit | many units |
| Boundaries | weak | strong modules | separate services |
| Ops effort | low | low | high |
| Best for | small apps | most growing products | many teams, big scale |

## Sync vs async communication
| | Sync (REST/gRPC) | Async (events) |
|---|---|---|
| Caller waits | ✅ | ❌ |
| Coupling | tighter | looser |
| Consistency | immediate | eventual |

## Choreography vs orchestration (Saga)
| | Choreography | Orchestration |
|---|---|---|
| Control | each service reacts to events | a central orchestrator |
| Easy to follow | ❌ | ✅ |
| Single point of logic | ❌ | ✅ |

## 2PC vs Saga
| | 2PC | Saga |
|---|---|---|
| Consistency | strong | eventual |
| Blocking | ✅ (locks) | ❌ |
| Failure handling | rollback | compensating actions |

## API Gateway vs BFF
| | API Gateway | BFF |
|---|---|---|
| Serves | all clients | one client type |
| Focus | routing, auth, limits | shaping data for that UI |

## CQRS vs CRUD
| | CRUD | CQRS |
|---|---|---|
| Models | one for read and write | separate read and write models |
| Complexity | low | higher |

## Event sourcing vs state storage
| | State storage | Event sourcing |
|---|---|---|
| Stores | current state | every change |
| Full history / audit | ❌ | ✅ |

## Orchestration (K8s) vs service mesh
| | Kubernetes | Service mesh |
|---|---|---|
| Handles | running, scaling containers | traffic between services (mTLS, retries) |

## Contract tests vs end-to-end tests
| | Contract | End-to-end |
|---|---|---|
| Speed | fast | slow |
| Needs every service running | ❌ | ✅ |
