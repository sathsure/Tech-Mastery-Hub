# REST API — One-liners

> The most asked questions, each answered in one sentence.

1. **What is REST?** — An API style where resources have URLs and are handled with standard HTTP methods.
2. **What does stateless mean?** — Each request carries everything needed; the server keeps no session between requests.
3. **PUT vs PATCH?** — PUT replaces the whole resource; PATCH changes only the fields sent.
4. **POST vs PUT?** — POST creates a new resource; PUT replaces a resource at a known URL.
5. **What is idempotency?** — Doing the same request many times has the same effect as doing it once.
6. **Which methods are idempotent?** — GET, PUT, DELETE, HEAD and OPTIONS.
7. **What is a safe method?** — One that doesn't change data, like GET and HEAD.
8. **200 vs 201 vs 204?** — 200 is success with a body, 201 means created, 204 is success with no body.
9. **401 vs 403?** — 401 means not authenticated; 403 means not allowed.
10. **400 vs 422?** — 400 is a malformed request; 422 is well-formed but fails validation.
11. **What does 409 mean?** — A conflict, such as a duplicate or a version clash.
12. **What does 429 mean?** — Too many requests; the client is rate-limited.
13. **502 vs 503 vs 504?** — 502 is a bad response from upstream, 503 is service unavailable, 504 is an upstream timeout.
14. **How do you version an API?** — Usually in the URL (`/v1/`), or in a header.
15. **Offset vs cursor pagination?** — Offset uses page numbers; cursor uses a pointer to the last item and is faster for big data.
16. **What is HATEOAS?** — Responses include links to the actions a client can take next.
17. **What is an idempotency key?** — A unique header value that lets the server safely ignore repeated POSTs.
18. **What is an ETag?** — A version tag used for caching (304) and safe updates (`If-Match`).
19. **REST vs GraphQL?** — REST has many endpoints with fixed responses; GraphQL has one endpoint where the client picks fields.
20. **What is OpenAPI?** — A standard format for describing an API, used by Swagger.
