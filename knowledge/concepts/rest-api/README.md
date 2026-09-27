# REST API

## Definition

The repository presents RESTful APIs as a backend API approach and connects REST with HTTP methods, status codes, Spring controllers, exception handling, and API documentation through Swagger/OpenAPI.

## Core Concepts

### HTTP Methods
The source emphasizes the semantic distinction between HTTP methods.

- `GET`: fetches data and is safe/idempotent in the source's discussion.
- `PUT`: updates/replaces data and is idempotent but not safe.

The source notes that a PUT endpoint could technically return records, but using PUT for retrieval violates the intended REST semantics and can affect caching/proxy behavior.

### GET Request Body
The source states that GET should not normally carry a request body. It notes that although the HTTP specification does not completely forbid one, servers, frameworks, and proxies may not handle it consistently.

The recommended pattern in the source is query parameters for retrieval criteria.

### HTTP Status Codes

| Class | Important source-covered codes |
|---|---|
| 1xx | `100 Continue` |
| 2xx | `200 OK`, `201 Created`, `204 No Content` |
| 3xx | `301`, `302`, `304` |
| 4xx | `400`, `401`, `403`, `404`, `409`, `429` |
| 5xx | `500`, `502`, `503`, `504` |

### Spring REST Controllers
The source covers `@RestController` as a common way to expose APIs and explains that it combines `@Controller` with `@ResponseBody`.

It also identifies alternatives such as:

- Spring WebFlux functional routing
- low-level Servlet implementations

### Global Exception Handling
The source recommends centralized handling through `@ControllerAdvice` / `@RestControllerAdvice`.

This can:

- map exceptions to HTTP status codes
- keep status handling out of individual controller methods
- avoid exposing stack traces
- log failures internally

### Layered and Custom Exceptions
The source advocates wrapping low-level technical exceptions into meaningful domain exceptions and creating business-specific exceptions such as `ResourceNotFoundException`.

### API Ecosystem
The backend roadmap explicitly lists:

- RESTful API
- GraphQL
- Swagger/OpenAPI documentation

It also lists related backend concerns such as validation, rate limiting, RBAC, file uploads, email, and WebSockets.

## Learning Path

1. HTTP and REST semantics
2. HTTP methods
3. Status codes
4. Request parameters and bodies
5. Spring REST Controllers
6. Exception handling
7. Global status handling
8. API documentation
9. Related backend API capabilities

## Repository Resources

- Interview: `interview/backend/java/02-REST-Api.md`
- Backend roadmap: `roadmap/backend/README.md`

## Source Boundary

The supplied REST evidence is primarily Spring/Java interview material plus the backend roadmap. This page therefore does not claim to be a complete REST or HTTP specification. Additional REST topics should be added only when repository evidence is collected.

