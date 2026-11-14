# REST API — Cheat Sheet

> **In one line:** a way to design web APIs where each *thing* has a URL and you act on it with HTTP methods, usually exchanging JSON.

## REST rules
- **Resources** — things with URLs: `/users/42`.
- **Stateless** — every request carries everything needed (like the auth token); the server keeps no session.
- **Standard methods** — GET, POST, PUT, PATCH, DELETE.
- **Cacheable** — responses say if they can be cached.

## HTTP methods
| Method | Does | Safe to repeat? |
|---|---|---|
| GET | read | ✅ |
| POST | create | ❌ (creates again) |
| PUT | replace the whole thing | ✅ |
| PATCH | change some fields | not always |
| DELETE | remove | ✅ |
- **Idempotent** — doing it many times has the same result as doing it once.

## Status codes to know
- **200** OK · **201** Created · **204** No Content (success, nothing to return)
- **301** moved permanently · **304** not modified (use your cache)
- **400** bad input · **401** not logged in · **403** not allowed · **404** not found · **409** conflict · **422** validation failed · **429** too many requests
- **500** server error · **502** bad gateway · **503** unavailable · **504** gateway timeout

## Good URL design
```
GET    /api/v1/users?status=active&page=2    list (filters in the query)
GET    /api/v1/users/42                      one user
POST   /api/v1/users                         create
PATCH  /api/v1/users/42                      update some fields
DELETE /api/v1/users/42                      delete
GET    /api/v1/users/42/orders               a user's orders
```
- Plural nouns, lowercase, no verbs (`/getUsers` ❌).

## Pagination
- **Offset** — `?page=3&size=20`. Simple; slow on huge tables.
- **Cursor** — `?after=abc123`. Fast and stable for feeds.

## Versioning
- In the URL (`/v1/`) — most common. Or a header.
- Adding fields is fine; removing/renaming needs a new version.

## Errors
Return the same shape every time, e.g.:
```json
{ "status": 422, "title": "Invalid input", "detail": "email is required" }
```

## Security
HTTPS always · tokens (OAuth2/JWT) · validate every input · rate limiting · CORS rules · check the user owns the data they ask for · never return stack traces.

## Reliability & speed
- **Idempotency key** — a header that makes retrying a POST (payment) safe.
- **ETag** — version tag for caching (304) and safe updates (412 if changed).
- Compression, caching headers, async jobs (`202 Accepted` + status URL).

## REST vs GraphQL vs gRPC
- **REST** — simple, cache-friendly; public APIs.
- **GraphQL** — one endpoint, the client picks exactly the fields it needs.
- **gRPC** — fast binary calls between services (Protobuf, HTTP/2).
- Also: **WebSocket** (two-way live), **Webhook** (server calls you when something happens).

## Docs & tests
OpenAPI/Swagger for documentation, Postman for manual tests, contract tests (Pact).
