# Microservices

## Purpose

Canonical microservices architecture knowledge consolidated from the repository's architecture and Spring Cloud interview material.

## Core Topics

### Architecture Choice
- Monolith vs microservices
- Problems introduced by microservices
- Criteria for splitting a monolith

### Service Boundaries
- Service boundaries
- Domain-Driven Design (DDD)
- Identifying service ownership

### Communication
- REST APIs between services
- Synchronous communication
- Asynchronous communication
- When to avoid synchronous REST

### Service Discovery
- Service discovery
- Why static service URLs become problematic
- Service-to-service discovery

### API Gateway
- Gateway purpose
- Routing
- Gateway responsibilities

### Configuration
- Configuration management
- Environment-specific configuration
- Configuration across many services

### Resilience
- Fault tolerance
- Retry
- Circuit breaker
- Partial failures
- Preventing cascading failures

### Security
- Service-to-service security
- Zero-trust considerations

### Data Consistency
- Transactions across services
- Distributed consistency

### Observability
- Production debugging
- Monitoring
- Observability across multiple services

### Scalability and Deployment
- Load balancing
- Kubernetes
- Traffic routing
- Microservice deployment and scalability

## Concrete Architecture Example

The repository also contains a concrete microservice architecture example:

- Dashboard service
- Credit-card service
- UPI service
- Separate databases for services
- Future wallet service

Source:

- `interview/architecture/microservice-architecture.md`

## Interview Sources

- `interview/backend/java/06-Spring-Cloud.md`
- `interview/frontend/09-Web_Architecture.md`
- `interview/architecture/microservice-architecture.md`

## Related Concepts

- [Spring](../spring/README.md)
- [Spring Cloud](../spring-cloud/README.md)
- [REST API](../rest-api/README.md)

## Source Boundary

This page describes microservices concepts represented in the repository. Spring-specific implementation details remain in the Spring Cloud concept.

