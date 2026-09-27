# 🏗️ Web Architecture Interview Prep — MEAN, Scalability & System Design


---

# Part 1 — MEAN Architecture Fundamentals

### ❓ Explain the high-level MEAN stack architecture

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20200601200043/mean-stack-flow.png)

![Image](https://res.cloudinary.com/hevo/image/upload/v1712838834/Hevo%20Wordpress/Concept/architecture_wui9ol.png)

### 📝 Answer

The MEAN stack follows a clear **separation of responsibilities**:

| Layer | Tech | Responsibility |
|-------|------|----------------|
| Client | **Angular** | UI rendering, state management, user interaction |
| API Server | **Node.js + Express** | Routing, middleware, auth, business logic |
| Database | **MongoDB** | Document-based persistence (JSON-friendly) |

Angular communicates with the backend over **HTTP/HTTPS** using RESTful APIs. Node.js + Express acts as the application server, handling routing, middleware execution, authentication, validation, and business logic. MongoDB stores data in a document format that aligns naturally with JSON-based APIs.

This architecture is typically deployed in a **stateless** manner, allowing horizontal scaling behind a load balancer.

> 💡 **Why MEAN for large applications?** End-to-end JavaScript across the full stack speeds up development, simplifies hiring, and—when designed correctly—scales horizontally with ease.

---

### ❓ Explain the complete request lifecycle in a MEAN application

![Image](https://markovate.com/wp-content/uploads/2023/06/Understanding-the-MEAN-Stack.webp)

![Image](https://static.wixstatic.com/media/614965_b301077bc1a1455bb99b41fcd5239ea4~mv2.jpg/v1/fill/w_722%2Ch_406%2Cal_c%2Clg_1%2Cq_80/614965_b301077bc1a1455bb99b41fcd5239ea4~mv2.jpg)

### 📝 Answer

```
[User clicks button]
    ↓
[Angular Component → Service → HTTP Interceptor adds JWT]
    ↓
[Express middleware: Auth → Validate → Logger]
    ↓
[Controller → Service Layer → Repository → MongoDB]
    ↓
[Response flows back: Serialize → Middleware → Browser]
    ↓
[Angular updates view reactively]
```

A user action in Angular triggers an HTTP request through a service. Before the request leaves the browser, Angular **HTTP interceptors** attach headers like JWT tokens. The request reaches the Node.js server, where Express middleware processes it sequentially — authentication, authorization, validation, and logging. The controller invokes business services, which interact with MongoDB. The response flows back through middleware, is serialized as JSON, and Angular updates the UI reactively.

> 📌 **Key insight:** Failures should be intercepted as early as possible to avoid unnecessary processing.

---

### ❓ How does Express middleware execution order work?

![Image](https://media2.dev.to/dynamic/image/width%3D800%2Cheight%3D%2Cfit%3Dscale-down%2Cgravity%3Dauto%2Cformat%3Dauto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2F73eusy0bc095c9w8tstw.png)

![Image](https://d2mk45aasx86xg.cloudfront.net/Express_middleware_11zon_bf752a6bd4.webp)

### 📝 Answer

Express middleware executes **strictly in the order it is registered**. This makes ordering critical for both security and performance.

- **Authentication** must run before **authorization**
- **Validation** should run before hitting controllers (to reject bad data early)
- **Error-handling** middleware must be registered **last** to catch failures from all upstream layers

```js
app.use(authMiddleware);          // 1. Who are you?
app.use(authorizeRole);           // 2. Are you allowed?
app.use(validateRequest);         // 3. Is your input valid?
app.get("/api/orders", controller); // 4. Run business logic
app.use(globalErrorHandler);      // 5. Catch any error from above
```

> 💡 **Mental model:** Think of middleware as a **pipeline**, not just "functions." Each layer can short-circuit the request — saving CPU cycles and database hits.

---

# Part 2 — Authentication, Authorization & Security

### ❓ How do you implement authentication in MEAN applications?

![Image](https://docs.oracle.com/en/applications/jd-edwards/administration/9.2.x/eotsc/images/jwt_token.png)


### 📝 Answer

Authentication uses **JWT (JSON Web Token)** for **stateless** verification:

1. User logs in → backend generates an access token containing user identity + roles
2. Angular stores the token (memory or `localStorage`/`sessionStorage`)
3. Angular's HTTP interceptor attaches `Authorization: Bearer <token>` to every request
4. Backend validates the token signature on every request — **no server-side session needed**

```js
jwt.verify(token, process.env.JWT_SECRET);
```

> 💡 **Why JWT?** No server-side session = horizontally scalable. Any node can validate.

> ⚠️ **Why short-lived tokens?** To limit damage if a token is compromised. Use a separate **refresh token** (with longer lifetime, stored in httpOnly cookie) to rotate access tokens.

---

#### ↳ Follow-up: How do you handle authorization and role management?

### 📝 Answer

Authorization is enforced **strictly on the backend** using **Role-Based Access Control (RBAC)**:

- Roles are embedded inside JWT claims
- Middleware checks roles before executing controllers
- Frontend guards exist **only for UX** — never for security

```js
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).send("Forbidden");
    }
    next();
  };
}

app.delete('/api/users/:id', requireRole(['admin']), deleteUser);
```

> 📌 **Golden rule:** A determined attacker can bypass any frontend check by hitting your API directly. **Backend authorization is non-negotiable.**

---

### ❓ How do you secure APIs beyond authentication?

### 📝 Answer

Security is **multi-layered** — defense in depth:

| Layer | Tool/Technique |
|-------|----------------|
| Transport | HTTPS only (TLS 1.2+) |
| Headers | Helmet (CSP, HSTS, X-Frame-Options, etc.) |
| Brute force | Rate limiting (e.g., `express-rate-limit`) |
| Input | Schema validation (Joi, Zod, class-validator) |
| Trust | Backend never trusts frontend validation |

> 💡 **Trust nothing from the client.** Validate types, ranges, lengths, and formats on the backend — even if you already validated on the frontend.

---

### ❓ How do you prevent XSS and injection attacks?

### 📝 Answer

| Threat | Defense |
|--------|---------|
| **XSS** | Angular auto-escapes HTML in templates (`{{ }}`); avoid `innerHTML` and `bypassSecurityTrust*` unless absolutely needed |
| **NoSQL injection** | Use parameterized queries (Mongoose validates types); validate inputs against schema |
| **SQL injection** | Always parameterize; never concatenate user input into queries |
| **Command injection** | Avoid `eval`, `child_process.exec` with user input |

```js
// ✅ Safe — Mongoose parameterizes
User.findOne({ email: req.body.email });

// ❌ Dangerous — direct user input in query
User.findOne({ $where: `this.email === '${req.body.email}'` });
```

---

### ❓ Explain CORS and how you configure it correctly

![Image](https://mdn.github.io/shared-assets/images/diagrams/http/cors/fetching-page-cors.svg)

![Image](https://drek4537l1klr.cloudfront.net/hossain/Figures/04fig18_alt.jpg)

### 📝 Answer

**CORS (Cross-Origin Resource Sharing)** is a **browser** security mechanism, not a backend security feature. It controls which origins can make cross-origin requests to your API from a browser context.

The backend explicitly allows trusted origins, methods, and headers:

```js
app.use(cors({
  origin: ['https://app.example.com'],   // ✅ Whitelist specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

For unsafe operations (PUT/DELETE/custom headers), the browser sends a **preflight OPTIONS** request first to verify allowance.

> ⚠️ **Critical clarification:** CORS does **NOT** secure your API. It only restricts what *browsers* allow. Anyone with `curl` or Postman can call your API regardless of CORS settings. Real security comes from authentication + authorization.

---

### ❓ How do you manage environment configurations?

### 📝 Answer

Each environment (dev, QA, prod) has **isolated configuration**:

- Use `.env` files for local development (never commit them)
- Use **environment variables** in deployed environments
- Use **secret managers** (AWS Secrets Manager, HashiCorp Vault) for sensitive values
- This avoids leaks and enables safe CI/CD deployments

```js
const config = {
  dbUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  apiKey: process.env.STRIPE_KEY
};
```

> 📌 **Rule:** Secrets never live in source code, never in Docker images, never in logs.

---

# Part 3 — Backend Design Patterns

### ❓ How do you structure a large Node.js backend?

### 📝 Answer

I use a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────┐
│  Routes        (HTTP concerns)  │  → URL paths, HTTP methods
├─────────────────────────────────┤
│  Controllers   (orchestration)  │  → Parse request, call services, format response
├─────────────────────────────────┤
│  Services      (business logic) │  → Domain rules, workflows
├─────────────────────────────────┤
│  Repositories  (data access)    │  → MongoDB queries, abstracted
├─────────────────────────────────┤
│  Models        (schemas)        │  → Mongoose models
└─────────────────────────────────┘
```

**Benefits:**
- ✅ Testable — services can be unit-tested without HTTP
- ✅ Readable — each layer has one responsibility
- ✅ Maintainable — swapping the DB only touches the repository layer

---

# Part 4 — Backend-for-Frontend (BFF) Pattern

### ❓ Can you walk me through the Backend-for-Frontend pattern and describe a situation where you'd recommend it?

### 📝 Answer

The **Backend-for-Frontend (BFF)** pattern is an architectural style where you build a **dedicated backend service for each type of client** — one for the web app, another for the mobile app, perhaps a third for a smart-TV interface. Instead of every client talking to the same generic API, each gets its own purpose-built layer that aggregates data from downstream microservices and shapes it precisely for that client's screen and use cases.

The motivation is simple. As your system grows, microservices proliferate — `users`, `orders`, `inventory`, `recommendations`, `notifications` — each owning its own API. A single mobile screen might need data from five of them. Without a BFF, the mobile app makes five separate HTTP calls, on a slow network, often over a flaky connection. The web app, sitting on a fast desktop browser, has very different needs but ends up using the same APIs and pulling fields it doesn't care about. Both clients suffer: the mobile app is slow, the web app is bloated, and any change to a downstream service ripples through every client team.

A BFF solves this by sitting between the clients and the microservices. The mobile BFF takes one request from the mobile app, fans out to the relevant services in parallel, joins and trims the data, and returns one tidy payload optimized for that mobile screen. The web BFF does the same — but might return a richer, more verbose payload because the web client can handle it. Each BFF can be owned by the team that owns the client itself, which means frontend teams can move quickly without coordinating across multiple backend repos for every UI change.

> 💡 **Mental model:** API Gateway is a *router*. BFF is a *concierge* — it doesn't just forward requests, it composes responses tailored for one specific client.

---

#### 🌐 Concrete Example — A Mobile App Home Screen

Imagine a food-delivery app. The mobile home screen needs to show: the user's name and avatar, recent orders, recommended restaurants nearby, and any active promotions. In a microservices architecture, that data lives in four different services.

**Without a BFF**, the mobile app issues four parallel HTTP requests on a 4G connection — four DNS lookups, four TLS handshakes, four round-trips. The user sees a loading spinner for 2-3 seconds.

**With a Mobile BFF**, the mobile app issues a single request to `GET /mobile/home`. The Mobile BFF then makes four internal calls in parallel (over a fast internal network, with persistent connections), assembles the response, and returns:

```json
{
  "user":   { "name": "Asha", "avatar": "https://..." },
  "recent": [ /* last 3 orders, only fields the home screen displays */ ],
  "recommended": [ /* 5 nearby restaurants, with image URL pre-resized for mobile */ ],
  "promotions": [ /* 2 active promos */ ]
}
```

The mobile app gets exactly what it needs in one round-trip. The web BFF, in contrast, might return 20 recommended restaurants with full descriptions because the web home page has more screen real estate. Same downstream services, two different shapes of response — each optimized for its consumer.

---

#### 🆚 BFF vs API Gateway

These are often confused, but they solve different problems:

| Aspect | API Gateway | BFF |
|--------|-------------|-----|
| **Responsibility** | Routing, auth, rate-limiting | Composition, transformation |
| **Per-client?** | Usually shared across all clients | One per client type (web, mobile, IoT) |
| **Aggregates services?** | No — passes through | Yes — calls multiple, composes one response |
| **Owned by** | Platform/infra team | The team owning that client |
| **Logic inside** | Generic cross-cutting concerns | Client-specific business logic |

> 📌 **Often used together:** BFFs sit *behind* the API Gateway. Gateway handles auth + routing; the BFF handles composition.

---

#### ✅ When to use a BFF

- You have **multiple distinct clients** with different needs (web, mobile, smart TV, public API)
- Your microservices are too granular for clients to call individually
- You want **frontend teams to ship without waiting** for backend coordination
- Mobile clients are suffering from too many round-trips
- You need **per-client data shaping** (mobile = thin, web = rich)

#### ⚠️ When NOT to use a BFF

- You only have **one client** (a single web app) — extra layer adds complexity for no benefit
- Your microservices are coarse-grained and a thin gateway is enough
- Your team is small — one more service to maintain may not be worth it

---

#### ↳ **Follow-up:** How do you avoid the BFF becoming a "god service" with all the logic?

↪ Keep the BFF thin: composition, transformation, and client-specific shaping only. Real business rules belong in the downstream services, not the BFF. If your BFF starts validating orders or calculating prices, that's a smell — push it down.

#### ↳ **Follow-up:** How do you keep BFFs from drifting from each other?

↪ Share libraries for common concerns (auth helpers, error formats, logging) but resist the temptation to share business logic. Each BFF serves a different client and **should** diverge where the client diverges.

#### ↳ **Follow-up:** What's the failure mode if a downstream service is slow?

↪ The BFF needs **timeouts, circuit breakers, and graceful degradation**. If "recommendations" times out, return the home screen *without* recommendations rather than failing the whole request. The whole point of the BFF is to give the client a usable response — partial data beats no data.

#### ↳ **Follow-up:** Where does authentication happen — gateway, BFF, or microservices?

↪ Typically: **Gateway authenticates** (validates JWT signature, expiry). The **BFF passes the user identity downstream** (often as a header). **Microservices re-verify** for defense in depth.

---

#### ✅ Key Takeaway

A BFF is an architectural *opinion*: each client deserves an API tailored to its needs. It trades a bit of duplication for **dramatically better client performance and developer velocity**. The win is real on mobile, where round-trips are expensive and screens are small.

---

# Part 5 — Performance & Frontend Optimization

### ❓ How do you optimize Angular performance?

![Image](https://www.thinktecture.com/storage/2021/08/cd_default-1024x399.png)

![Image](https://dotnettrickscloud.blob.core.windows.net/article/angular/3720240602200739.com-png-to-webp-converter%20%281%29)

### 📝 Answer

A multi-pronged approach:

| Technique | Effect |
|-----------|--------|
| **Lazy-loaded modules/routes** | Reduce initial bundle size |
| **OnPush change detection** | Skip CD unless `@Input` reference changes |
| **`trackBy` in `*ngFor`** | Prevent re-rendering of unchanged list items |
| **Pure pipes** | Memoize transformations |
| **Signals (16+)** | Fine-grained reactivity, no full tree traversal |
| **`async` pipe** | Auto-unsubscribe + auto-marks for check |
| **Code splitting** | Split vendor and app chunks |
| **Image optimization** | `NgOptimizedImage`, lazy-loading, WebP/AVIF |

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

---

### ❓ Explain Angular route guards

### 📝 Answer

Route guards prevent unauthorized navigation and improve UX:

| Guard | Purpose |
|-------|---------|
| `CanActivate` | Allow/deny access to a route |
| `CanActivateChild` | Same, for child routes |
| `CanDeactivate` | Warn user about unsaved changes before leaving |
| `CanMatch` (modern) | Prevent route from matching at all (replaces `CanLoad`) |
| `Resolve` | Pre-fetch data before component loads |

> ⚠️ **Important:** Guards are **not security mechanisms**. Backend authorization is always mandatory. Anyone can disable JS or hit your API directly.

---

# Part 6 — Node.js Internals & Concurrency

### ❓ Why is Node.js suitable for high-concurrency systems?

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20200224050909/nodejs2.png)

![Image](https://miro.medium.com/1%2Ay8OTPaojQ9uRkxZK0Adc3Q.png)

### 📝 Answer

Node.js uses a **single-threaded event loop with non-blocking I/O**. It efficiently handles thousands of concurrent connections, especially for **I/O-bound workloads** like API gateways, real-time apps, and microservices.

**Why this matters:**
- No thread-per-request overhead (vs traditional servers)
- I/O happens asynchronously via libuv's thread pool
- One thread can multiplex thousands of sockets

> ⚠️ **The trade-off:** Node.js is **bad** for CPU-bound work — heavy computation blocks the entire event loop.

---

#### ↳ Follow-up: What blocks the Node.js event loop?

### 📝 Answer

**Synchronous and CPU-intensive operations** block the event loop, halting *all* other requests on that process.

```js
// ❌ Blocking — freezes everything
const data = fs.readFileSync('big-file.json');

// ✅ Non-blocking — yields to event loop
fs.readFile('big-file.json', (err, data) => { /* ... */ });

// ❌ Blocking — heavy CPU work
const result = bigSyncComputation();
```

**Common culprits:**
- `*Sync` file system APIs
- Heavy JSON parse/stringify
- Synchronous crypto operations (`bcrypt.hashSync`)
- Complex regex on large strings
- Loops over millions of items

**Solutions:** Move heavy work to **worker threads** (`worker_threads`) or **background services**.

---

#### ↳ Follow-up: How do you handle long-running or heavy jobs?

![Image](https://patrick.cloke.us/images/celery-architecture/celery-overview.png)

![Image](https://i.sstatic.net/DEeUQ.png)

### 📝 Answer

Delegate to **background queues** (Redis-backed: Bull, BullMQ, etc.). The API responds **immediately** (`202 Accepted`), and workers process jobs asynchronously.

```js
// API endpoint
queue.add({ jobId: report.id, type: 'export' });
res.status(202).send({ jobId: report.id, status: 'processing' });

// Separate worker process
queue.process(async (job) => {
  await generatePdfReport(job.data);
});
```

**Benefits:**
- Web tier stays responsive
- Workers scale independently
- Failed jobs can be retried automatically
- Progress can be reported via WebSocket or polling

---

# Part 7 — Scalable APIs & Caching

### ❓ How do you design scalable APIs?

### 📝 Answer

Scalable APIs follow these principles:

| Principle | Why |
|-----------|-----|
| **Stateless** | Any node can serve any request → horizontal scaling |
| **Idempotent (where appropriate)** | Safe retries on network failures |
| **Paginated** | Avoid returning massive result sets |
| **Cache-aware** | Use ETags, Cache-Control, CDN |
| **Versioned** | `/v1/` paths so clients don't break on upgrades |
| **Async where possible** | 202 + queues for heavy work |

> 📌 **Scale horizontally, not vertically.** Adding more nodes is cheaper and more resilient than buying bigger servers.

---

### ❓ How would you explain API idempotency, and can you give an example of where it could go wrong if ignored?

### 📝 Answer

**Idempotency** means: making the same request multiple times produces the **same result** as making it once.

| HTTP Method | Idempotent by spec? |
|-------------|---------------------|
| GET | ✅ Yes |
| PUT | ✅ Yes |
| DELETE | ✅ Yes |
| POST | ❌ No (typically creates) |

**Why it matters:** Network failures cause clients (and load balancers) to retry. If `POST /payments` charges twice on retry, that's a disaster.

**Solution: Idempotency Keys**

```http
POST /api/payments
Idempotency-Key: a8f3-9c2e-...

{ "amount": 100, "customerId": "cus_123" }
```

The server stores the key + result. A retry with the same key returns the cached result instead of charging again.

---

### ❓ How do you implement caching effectively?

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AopKChmV6oVr3aI2zaQIMVg.png)

![Image](https://blog.xapihub.io/img/posts/CachingStrategiesforRESTAPIs.png)

### 📝 Answer

A multi-tier caching strategy:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Browser** | Cache-Control / ETag | Avoid re-fetching unchanged resources |
| **CDN** | CloudFront, Cloudflare | Edge caching for static assets |
| **API Gateway** | Response cache | Reduce backend load |
| **App-tier cache** | Redis, Memcached | Hot reads, sessions, computed values |
| **Database query cache** | Mongoose lean + Redis | Avoid expensive aggregations |

```js
// Read-through cache pattern
async function getUser(id) {
  const cached = await redis.get(`user:${id}`);
  if (cached) return JSON.parse(cached);

  const user = await User.findById(id);
  await redis.setex(`user:${id}`, 60, JSON.stringify(user)); // TTL 60s
  return user;
}
```

**Cache invalidation strategies:**
- ⏰ **TTL-based** — simple, eventually consistent
- 🔔 **Event-driven** — invalidate on write (more accurate, more complex)

> 💡 *"There are only two hard things in computer science: cache invalidation and naming things."* — Phil Karlton

---

# Part 8 — MongoDB Best Practices

### ❓ How do you optimize MongoDB performance?

### 📝 Answer

| Optimization | How |
|--------------|-----|
| **Indexes** | Create on frequently queried fields; compound indexes for multi-field filters |
| **Pagination** | Use cursor-based pagination for large datasets (not skip/limit) |
| **Projections** | Return only the fields you need (`.select('name email')`) |
| **Aggregation pipelines** | Optimize order: `$match` → `$project` → `$group`; use `explain()` |
| **Avoid N+1** | Use `$lookup` or fetch in batches |
| **Read replicas** | Route reads to secondaries when consistency permits |
| **Sharding** | When data exceeds a single replica set's capacity |

```js
// ❌ Slow
db.orders.find({ userId, status: 'pending' });   // No index

// ✅ Fast
db.orders.createIndex({ userId: 1, status: 1 }); // Compound index
```

---

#### ↳ Follow-up: How do you manage schema changes in MongoDB?

### 📝 Answer

Schema changes must be **backward-compatible** during transitions. Both old and new formats coexist while data is migrated.

**Strategies:**
1. **Add new fields without removing old ones** (read both)
2. **Lazy migration** — convert documents on read
3. **Background migration scripts** — run in batches
4. **Versioned schemas** — store `schemaVersion` on each doc

```js
function getUser(doc) {
  if (doc.schemaVersion === 2) return doc;
  return migrateV1ToV2(doc); // Lazy migrate on read
}
```

---

# Part 9 — Resilience & Failure Handling

### ❓ How do you handle secure file uploads?

![Image](https://www.finra.org/sites/default/files/2022-03/large-file-service.png)

![Image](https://www.alter-solutions.com/hs-fs/hubfs/S3%20presigned%20URL%201.png?height=382&name=S3+presigned+URL+1.png&width=936)

### 📝 Answer

Production-grade file upload checklist:

- ✅ Validate **file size** (reject before reading)
- ✅ Validate **MIME type** AND magic bytes (don't trust extension)
- ✅ Scan for **malware** (ClamAV or similar)
- ✅ Store **outside application servers** (S3, GCS, Azure Blob)
- ✅ Use **signed URLs** for upload (browser → S3 directly)
- ✅ Use **signed URLs** for read (time-limited access)
- ✅ Strip metadata from images (EXIF can leak GPS)

```js
// Pre-signed URL pattern — direct browser → S3 upload
const uploadUrl = s3.getSignedUrl('putObject', {
  Bucket: 'uploads',
  Key: `user-${userId}/${uuid()}.jpg`,
  Expires: 60,
  ContentType: 'image/jpeg'
});

res.json({ uploadUrl });
```

> 💡 **Pre-signed URLs** keep large files off your application servers entirely — better performance, lower cost, simpler scaling.

---

### ❓ How do you prevent API abuse?

![Image](https://thealgoristsblob.blob.core.windows.net/thealgoristsimages/rate-limiter-sys-design-3.jpeg)

![Image](https://miro.medium.com/v2/resize%3Afit%3A1400/1%2AkHKqwQZRi_i0lX2L_X9ivg.png)

### 📝 Answer

**Rate limiting** at multiple levels:

| Level | Tool |
|-------|------|
| **Edge** | Cloudflare, AWS WAF |
| **API Gateway** | Kong, AWS API Gateway |
| **App layer** | `express-rate-limit` + Redis |

**Strategies:**
- **Token bucket** — smooth rate, allows bursts
- **Fixed window** — simple, can spike at boundaries
- **Sliding window** — more accurate

> 📌 **Auth endpoints get stricter limits** — 5 attempts/min for login vs 100/min for read APIs.

```js
const loginLimiter = rateLimit({ windowMs: 60_000, max: 5 });
app.post('/login', loginLimiter, loginHandler);
```

---

### ❓ How do you prevent accidental data leaks?

### 📝 Answer

APIs return only the fields they should — using **DTOs** or **MongoDB projections**:

```js
// ❌ Leaks password hash
const user = await User.findById(id);
res.json(user);

// ✅ Explicit projection
const user = await User.findById(id).select('-password -resetTokens');
res.json(user);

// ✅ DTO mapping
res.json(toUserDto(user));
```

> 📌 **Default to opacity:** sensitive fields excluded by default, opt-in to include. Never the other way around.

---

### ❓ How do you handle partial failures in distributed systems?

### 📝 Answer

The **resilience toolkit:**

| Tool | Purpose |
|------|---------|
| **Timeouts** | Don't wait forever; fail fast |
| **Retries with backoff** | Recover from transient failures |
| **Retry budgets** | Cap retries to avoid amplifying load |
| **Circuit breakers** | Stop hammering a failing service |
| **Bulkheads** | Isolate failures to one resource pool |
| **Fallbacks** | Return cached/default data when service is down |

> 💡 **Pattern:** Circuit breaker opens after N failures → all subsequent calls fail immediately for a cool-down period → after that, allow a trial request to check if the service recovered.

---

### ❓ What happens if MongoDB goes down?

### 📝 Answer

Graceful degradation:

1. The API attempts the call → fails fast (timeout)
2. **Circuit breaker opens** → subsequent calls fail without hitting MongoDB
3. **Fallback** to cached data where possible (Redis read-through)
4. **Alerts fire** → ops team is notified
5. For writes, queue them → process when DB recovers

> 📌 **Design assumption:** The DB *will* go down. Plan for it.

---

### ❓ What happens when Node.js crashes in production?

![Image](https://imagedelivery.betterstackcdn.com/xZXo0QFi-1_4Zimer-T0XQ/07356f0c-10cf-418a-5318-73b045db4f00/orig)

![Image](https://miro.medium.com/1%2A8wlzggvjXZWFvza1zO2nbw.png)

### 📝 Answer

A robust production setup absorbs crashes automatically:

- **Process manager** (PM2, systemd, Kubernetes) restarts crashed instances
- **Load balancer** redirects traffic to healthy nodes via health checks
- **Logs** capture the crash for postmortem
- **Stateless design** ensures no data loss when an instance dies

```js
process.on('uncaughtException', (err) => {
  logger.fatal(err);
  // Don't try to recover — let process manager restart
  process.exit(1);
});
```

> ⚠️ **Don't catch and ignore** unhandled errors. Exit cleanly and let the orchestrator restart you in a known-good state.

---

# Part 10 — Observability, Deployments & HA

### ❓ How do you design logging for production?

### 📝 Answer

Production logs are:

- **Structured** (JSON) — searchable, parseable
- **Centralized** — shipped to ELK, Datadog, Splunk
- **Correlated** — every log carries a `requestId` (and `userId`, `traceId`)
- **Leveled** — `debug`, `info`, `warn`, `error`, `fatal`
- **PII-safe** — no passwords, tokens, or full credit card numbers

```js
logger.info({
  msg: 'Order created',
  orderId: order.id,
  userId: req.user.id,
  requestId: req.id,
  durationMs: 45
});
```

---

#### ↳ Follow-up: Logs vs Monitoring — explain the difference

### 📝 Answer

| | Logs | Monitoring |
|---|------|-----------|
| **Tells you** | *What happened* | *That something is wrong* |
| **Granularity** | Per-request, per-event | Aggregated metrics |
| **Use for** | Debugging, audit trails | Alerts, dashboards, SLOs |
| **Tools** | ELK, Loki, Splunk | Prometheus, Datadog, New Relic |

> 📌 **Both are mandatory.** Monitoring tells you *something* broke; logs tell you *what* broke.

---

### ❓ How do you manage secrets securely?

### 📝 Answer

| ❌ Don't | ✅ Do |
|---------|------|
| Hardcode in source | Use env vars or secret managers |
| Commit `.env` | Add to `.gitignore` |
| Log secrets | Mask in log output |
| Bake into Docker images | Inject at runtime |

**Tools:** AWS Secrets Manager, HashiCorp Vault, Kubernetes Secrets, Azure Key Vault.

---

### ❓ How do you handle deployments?

### 📝 Answer

**Modern CI/CD pipeline:**

```
[Git push] → [Build & Test] → [Build artifact/image] → [Deploy to staging]
                ↓                       ↓                    ↓
           [Lint, type-check]      [Tag with SHA]       [Smoke tests]
                                                             ↓
                                                  [Deploy to prod (canary)]
                                                             ↓
                                                  [Monitor → Promote or Rollback]
```

**Deployment strategies:**
- **Blue/Green** — instant cutover; safe rollback
- **Canary** — gradual rollout (1% → 10% → 100%)
- **Rolling** — replace instances incrementally

> 📌 **Always have a rollback plan** before pressing deploy.

---

### ❓ How do you ensure high availability?

### 📝 Answer

**HA building blocks:**

- ✅ **Stateless services** → any node can serve any request
- ✅ **Health checks** → load balancer removes unhealthy nodes automatically
- ✅ **Auto-scaling** → handle load spikes
- ✅ **Redundancy across availability zones** → survive a data-center failure
- ✅ **Database replication** → primary + replicas
- ✅ **No single point of failure** in the critical path

> 💡 **Mental check:** "What's the *one thing* that takes down everything if it dies?" — find it, then add redundancy.

---

### ❓ How do you debug slow APIs in production?

### 📝 Answer

A systematic approach:

1. **Logs + traces** — find slow requests by `requestId`
2. **APM tools** (New Relic, Datadog) — identify the slow function/query
3. **Database** — `explain()` on slow queries; check for missing indexes
4. **Caching** — what's the cache hit rate?
5. **Network** — DNS, TLS, downstream service latency
6. **Resource saturation** — CPU, memory, file descriptors, connection pools

> 💡 **The fastest fix** is often: "Add an index" or "Add a Redis cache."

---

### ❓ How do you protect frontend applications?

### 📝 Answer

| Layer | Defense |
|-------|---------|
| **Auth** | Route guards (UX) + backend authorization (security) |
| **Headers** | Strict CSP, HSTS, X-Frame-Options |
| **Token storage** | Prefer httpOnly cookies for refresh tokens |
| **HTTP interceptors** | Attach JWT, retry on 401 |
| **Input** | Backend validation always — frontend is just UX |
| **Dependencies** | `npm audit`, Snyk, Dependabot |

---

### ❓ How do you design for traffic spikes?

### 📝 Answer

**Capacity playbook:**

- **Auto-scaling** (horizontal pod autoscaling, EC2 ASG)
- **Caching** (Redis, CDN) → reduce origin load
- **Throttling** at the edge → reject excess traffic before it hits app servers
- **Async queues** → smooth out write spikes
- **CDN for static assets** → offload bandwidth
- **Pre-warming** caches before known events (sales, launches)

> 📌 **Load test before the spike**, not during it.

---

# Part 11 — Final System Design Question

### ❓ Final Question: Design a MEAN system for 1 million users

![Image](https://evincedev.com/blog/wp-content/uploads/2021/08/Mean-Architecture-1.png)

![Image](https://docs.rightscale.com/img/cm-setup-diagrams.png)

### 📝 Answer

A blueprint for 1M users:

#### 🏗 Architecture Overview

```
[CDN] → [Load Balancer] → [API Gateway / BFF Layer]
                                ↓
               ┌────────────────┼────────────────┐
               ↓                ↓                ↓
        [Auth Service]   [Order Service]   [User Service]
               ↓                ↓                ↓
            [Redis] ←───── [MongoDB Replica Set] ─────→ [Read Replicas]
                                ↓
                        [Background Workers]
                                ↓
                       [Queue: Bull / SQS]
```

#### 🔑 Core Principles

| Principle | Implementation |
|-----------|----------------|
| **Stateless services** | JWT auth, no server sessions |
| **Horizontal scaling** | Containers behind load balancer; auto-scale on CPU/RPS |
| **Database scaling** | Replica sets for reads; consider sharding past 100GB |
| **Caching** | CDN for static; Redis for hot reads, sessions, rate limits |
| **Async processing** | Queues for emails, reports, exports, notifications |
| **Observability** | Centralized logs, metrics, tracing, alerts |
| **Resilience** | Circuit breakers, timeouts, retries, fallbacks |

#### 🚧 First Bottlenecks to Address

1. **Database** — partition early; cache aggressively
2. **Sessions** — use stateless JWTs, not in-memory sessions
3. **N+1 queries** — denormalize where read-heavy
4. **Synchronous heavy work** — push to background queues

#### 📈 Capacity Reasoning

- 1M users → ~50K daily active (5%) → ~5K concurrent (1%) → ~500 RPS at peak
- Modern Node.js can handle ~5K RPS per instance for I/O-bound work
- With caching, a small cluster (3-5 instances) handles this easily
- Bottleneck moves to: **DB connections, network egress, downstream services**

> 💡 **The honest answer in interviews:** "I'd start small, measure, and scale where the bottleneck actually is — guessing leads to over-engineering."

---

## 🎓 Final Cheat Sheet

| Concept | Quick Recall |
|---------|--------------|
| **MEAN Stack** | MongoDB + Express + Angular + Node |
| **JWT** | Stateless auth via signed token |
| **CORS** | Browser security; not API security |
| **API Gateway** | Routing, auth, rate limit |
| **BFF** | Per-client backend that aggregates microservices |
| **Idempotency** | Retries are safe |
| **Circuit Breaker** | Stop hammering a failing service |
| **Stateless** | Any node can serve any request |
| **OnPush + trackBy** | Angular perf basics |
| **Redis** | Hot reads, sessions, rate limit |
| **Pre-signed URL** | Direct browser ↔ S3 |

---

> 🚀 **You're now ready to architect at scale.** Master these patterns and you'll handle any system design interview with confidence.
