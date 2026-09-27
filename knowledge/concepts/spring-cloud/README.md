# Spring Cloud

## Purpose

Canonical Spring Cloud knowledge consolidated from the repository's Spring Cloud interview material.

## Relationship to Microservices

Microservices is the architecture concept.

Spring Cloud represents Spring-specific capabilities and patterns used to address distributed-system concerns in a microservices environment.

## Core Topics

### Spring Boot and Microservices
- Spring Boot in microservices
- Spring Boot compared with plain Spring

### Service Discovery
- Service discovery
- Service-to-service discovery

### Communication
- Synchronous communication
- Asynchronous communication
- REST between services
- When synchronous communication should be avoided

### Configuration Management
- Configuration across environments
- Configuration across many microservices
- Changing configuration without redeployment

### Load Balancing
- Load balancing in Spring-based services

### API Gateway
- Gateway routing
- Gateway responsibilities
- Traffic routing

### Fault Tolerance and Resilience
- Fault tolerance
- Retry
- Circuit breaker
- Service failure handling
- Preventing system-wide failure

### Security
- Service-to-service security
- Zero-trust model

### Data Consistency
- Transactions across services
- Distributed consistency

### Observability
- Debugging production issues across multiple services
- Monitoring distributed systems

### Kubernetes
- Kubernetes traffic routing
- Kubernetes impact on microservices design

## Visual Notes

- `knowledge/visual-notes/backend/spring-cloud.png`

## Interview Source

- `interview/backend/java/06-Spring-Cloud.md`

## Related Concepts

- [Spring](../spring/README.md)
- [Microservices](../microservices/README.md)
- [Spring Security](../spring-security/README.md)

## Source Boundary

This page focuses on Spring-specific material represented in the repository. General microservices architecture concepts are maintained separately in the Microservices concept.
