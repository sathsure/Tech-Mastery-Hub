# REST API — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. 401 vs 403
- ❌ 403 for a missing token.
- ✅ 401 = who are you? (not logged in). 403 = I know you, but no.

### 2. PUT vs PATCH
- ❌ `PUT /users/1 { "name": "A" }` expecting other fields to stay.
- ✅ PUT replaces the whole resource (missing fields get wiped). PATCH changes only what you send.

### 3. 200 with an error inside
- ❌ `200 OK { "error": "not found" }`
- ✅ Use the right status code (404). Clients and monitoring rely on it.

### 4. Verbs in URLs
- ❌ `POST /createUser`, `GET /getOrders`
- ✅ `POST /users`, `GET /orders` — the method is the verb.

### 5. Retrying POST
- ❌ Network timeout → client retries → two orders.
- ✅ Send an `Idempotency-Key` header; the server ignores repeats.

### 6. GET that changes data
- ❌ `GET /users/1/delete`
- ✅ GET must be safe — crawlers and prefetching may call it. Use DELETE.

### 7. Returning everything
- ❌ `GET /orders` returning 1 million rows.
- ✅ Always paginate, with a max page size.

### 8. Trusting the id in the URL
- ❌ `GET /orders/123` returns any user's order (IDOR).
- ✅ Check the logged-in user owns order 123.

### 9. "REST means JSON over HTTP"
- ❌ Any HTTP+JSON API is REST.
- ✅ REST is about resources, standard methods, statelessness and cacheability.

### 10. 201 without a location
- ❌ `201 Created` with no way to find the new item.
- ✅ Return a `Location: /users/43` header (and usually the body).
