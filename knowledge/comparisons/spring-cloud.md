# Spring Cloud — Comparisons

> The classic "X vs Y" questions, side by side.

## Old Netflix stack vs today
| Need | Old | Today |
|---|---|---|
| Circuit breaker | Hystrix | Resilience4j |
| Load balancing | Ribbon | Spring Cloud LoadBalancer |
| Gateway | Zuul | Spring Cloud Gateway |
| Tracing | Sleuth | Micrometer Tracing |

## Eureka vs Kubernetes Service
| | Eureka | Kubernetes Service |
|---|---|---|
| Discovery | client registers itself | built into the cluster (DNS) |
| Load balancing | client-side | kube-proxy / mesh |
| Need on K8s | usually ❌ | ✅ |

## Client-side vs server-side load balancing
| | Client-side | Server-side |
|---|---|---|
| Who picks the instance | the caller | a load balancer in between |
| Example | Spring Cloud LoadBalancer | Nginx, AWS ALB |

## Feign vs RestClient/WebClient
| | OpenFeign | RestClient / WebClient |
|---|---|---|
| Style | interface, declarative | code, fluent |
| Reactive | ❌ | WebClient ✅ |

## Circuit breaker vs retry
| | Circuit breaker | Retry |
|---|---|---|
| Goal | stop calling a broken service | survive a brief glitch |
| Risk if misused | — | piles load on a failing service |

## Bulkhead vs rate limiter
| | Bulkhead | Rate limiter |
|---|---|---|
| Limits | concurrent calls | calls per time period |

## Config Server vs ConfigMap
| | Config Server | Kubernetes ConfigMap |
|---|---|---|
| Source | Git / Vault | Kubernetes API |
| Refresh at runtime | `@RefreshScope` | mounted files / restart |

## Gateway vs service mesh
| | API Gateway | Service mesh |
|---|---|---|
| Traffic | north-south (outside → in) | east-west (service ↔ service) |
| Example | Spring Cloud Gateway | Istio |
