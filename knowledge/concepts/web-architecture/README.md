# Web Architecture

## Overview

Web architecture describes how a modern web application is structured across the frontend, backend, APIs, data stores, security boundaries, infrastructure, and operational concerns.

This repository's Web Architecture material is primarily grounded in the MEAN-stack interview/system-design source. The canonical page consolidates the major architecture concepts identified in that source while preserving the detailed interview questions and examples in the original material.

**Concept ID:** `web.architecture`

---

## 1. MEAN Architecture Fundamentals

The source covers the high-level architecture of a MEAN application:

- MongoDB
- Express
- Angular
- Node.js

The architecture also considers the complete request lifecycle through the frontend, backend/API layer, and database.

The source specifically covers:

- High-level MEAN architecture
- Complete request lifecycle
- Express middleware execution order

### Architectural perspective

A web request should be understood as a flow across multiple layers rather than as an isolated frontend or backend operation.

Typical architectural concerns include:

- Request entry
- Middleware processing
- Authentication and authorization
- Application/business processing
- Data access
- Response generation
- Frontend rendering and state handling

The detailed request lifecycle and middleware behavior remain in the interview source.

---

## 2. Authentication, Authorization & API Security

The source treats authentication and authorization as separate architectural concerns.

Topics covered include:

- Authentication in MEAN applications
- Authorization and role management
- API security beyond authentication
- XSS and injection prevention
- CORS
- Environment configuration

### Authentication vs authorization

**Authentication** establishes who the caller is.

**Authorization** determines what the authenticated caller is allowed to access.

A production architecture should therefore consider identity, access control, API protection, and browser security together rather than treating authentication as the entire security model.

### CORS

Cross-Origin Resource Sharing is an important browser/API boundary.

The source specifically includes configuring CORS correctly as part of API security.

### Environment configuration

Environment-specific configuration is also treated as an architectural concern, particularly when applications move across development, test, and production environments.

Detailed implementation examples remain in the interview source.

---

## 3. Backend Design Patterns

The source addresses structuring a large Node.js backend.

The architectural concern is maintaining clear separation and organization as backend complexity grows.

Important considerations include:

- Backend structure
- API organization
- Separation of responsibilities
- Maintainability as the application grows

The source's detailed Node.js backend structure should remain the authoritative reference for the specific organization discussed there.

---

## 4. Backend-for-Frontend (BFF)

Backend-for-Frontend is covered as a dedicated architecture pattern.

A BFF provides a backend layer tailored to the needs of a particular frontend client.

The source includes:

- BFF architecture
- A mobile-app home-screen example
- BFF vs API Gateway
- When to use a BFF
- When not to use a BFF
- Avoiding a BFF becoming a "god service"
- Preventing BFF drift
- Handling slow downstream services
- Authentication placement across gateway, BFF, and microservices

### BFF vs API Gateway

These are related but different architectural roles.

An API Gateway is generally concerned with an entry point and cross-cutting gateway responsibilities.

A BFF is specifically shaped around the needs of a particular frontend/client experience.

The source provides the detailed comparison and examples.

### BFF architectural risks

The source explicitly identifies concerns around:

- Excessive business logic in the BFF
- Multiple BFFs drifting apart
- Slow downstream dependencies
- Unclear authentication boundaries

These concerns should be considered when introducing BFF architecture.

---

## 5. Frontend Performance

The source covers Angular performance as part of the overall web architecture.

Frontend architecture is not isolated from backend and infrastructure architecture because frontend performance depends on:

- Request behavior
- API performance
- Rendering
- Data loading
- Application structure

The source also covers Angular route guards as part of application routing and access control.

Detailed Angular-specific material belongs primarily with the Angular concept and the original interview source.

---

## 6. Node.js Internals & Concurrency

The source addresses why Node.js is suitable for high-concurrency systems.

It also explicitly covers:

- Node.js event-loop behavior
- What can block the event loop
- Long-running or computationally heavy jobs

### Architectural consideration

Node.js applications must account for work that can interfere with the event loop.

Heavy or long-running work therefore requires appropriate architectural handling rather than simply being placed into the normal request-processing path.

The detailed scenarios and solutions remain in the Node.js interview source.

---

## 7. Scalable APIs

The source covers scalable API design as a dedicated architecture concern.

Important topics include:

- API scalability
- Idempotency
- Caching

### Idempotency

Idempotency is particularly important when an operation can be retried.

The architecture should consider whether repeating the same request can unintentionally produce repeated side effects.

The source provides a concrete example of where ignoring idempotency can cause problems.

### Caching

Caching is covered as a mechanism for improving API behavior and reducing unnecessary repeated work.

Caching decisions should be considered together with:

- Data freshness
- Invalidation
- Request patterns
- System scale

The detailed implementation discussion remains in the source material.

---

## 8. MongoDB Architecture & Performance

MongoDB is treated as an important part of the MEAN architecture.

The source covers:

- MongoDB performance optimization
- Schema changes

Database design therefore forms part of the broader application architecture rather than being an isolated implementation detail.

The repository's SQL/database concepts should not be used as a substitute for the MongoDB-specific material here.

---

## 9. Resilience & Failure Handling

The source covers multiple production failure scenarios:

- Secure file uploads
- API abuse
- Accidental data leaks
- Partial failures in distributed systems
- MongoDB failures
- Node.js production crashes

### Distributed failure

A production architecture should account for failures that affect only part of the system rather than assuming every dependency succeeds simultaneously.

### Production failure scenarios

The source explicitly asks what happens when:

- MongoDB goes down
- Node.js crashes
- A distributed operation partially fails

These scenarios are useful for evaluating whether an architecture has considered recovery and resilience rather than only the normal success path.

---

## 10. Observability, Deployment & High Availability

The source treats operational architecture as part of web architecture.

Topics include:

- Production logging
- Logging vs monitoring
- Secure secrets management
- Deployments
- High availability
- Debugging slow APIs
- Frontend protection
- Traffic spikes

### Logging and monitoring

Logging and monitoring are related but distinct operational concerns.

The source explicitly separates these concepts and discusses production logging.

### High availability

The source includes high-availability design as an architectural concern.

### Traffic spikes

Capacity planning must consider traffic patterns that exceed normal operating levels.

The source includes designing for traffic spikes as part of the system-design discussion.

---

## 11. System Design

The source culminates in a system-design exercise:

> Design a MEAN system for 1 million users.

The exercise includes:

- Architecture overview
- Core principles
- First bottlenecks to address
- Capacity reasoning

This is an **example system-design scenario**, not a universal architecture prescription.

The detailed architecture, bottleneck analysis, and capacity reasoning remain in the original interview source.

---

## 12. Relationship to Other Concepts

| Concept | Relationship |
|---|---|
| Angular | Frontend framework used in the MEAN architecture |
| Node.js | Backend runtime and concurrency model |
| REST API | API communication mechanism |
| MongoDB | Database layer in the MEAN stack |
| Web Vitals | Frontend performance concerns |
| Microservices | Distributed architecture concerns discussed in failure handling |
| Spring Cloud | Separate Java/Spring implementation ecosystem |
| DevOps | Deployment and operational concerns |
| Security | Authentication, authorization, API and browser protection |

---

## Repository Resources

### Primary Source

- [Web Architecture Interview Material](../../../interview/frontend/09-Web_Architecture.md)

### Related Canonical Concepts

- [Angular](../angular/README.md)
- [Node.js](../nodejs/README.md)
- [REST API](../rest-api/README.md)
- [Microservices](../microservices/README.md)
- [DevOps](../devops/README.md)

### Related Interview Material

- [Node.js Security](../../../interview/backend/node/06-Node-security.md)
- [Microservice Architecture Example](../../../interview/architecture/microservice-architecture.md)

---

## Source Boundary

This canonical page is derived from:

`interview/frontend/09-Web_Architecture.md`

The source contains detailed interview questions, follow-ups, examples, and a complete MEAN system-design exercise. Those details remain in the original source.

This page consolidates the architectural concepts represented by that source. It does not claim that the repository's Web Architecture material is an exhaustive treatment of all web-architecture topics.

**Canonical status:** complete for the currently identified repository evidence.
