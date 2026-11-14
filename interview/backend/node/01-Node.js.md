### ❓ What is Node.js and why was it created?

**Level:** 🟢 Beginner

### 📝 Answer

- **Node.js** is a JavaScript runtime environment that allows JavaScript to run outside the browser, mainly on servers.
- Internally, Node.js uses the **V8 JavaScript engine**, which compiles JavaScript directly into machine code for fast execution.
- Node.js was created to solve the scalability problem of traditional server models where each incoming request required a new thread.
- Instead of using a blocking request-per-thread model, Node.js uses an **event-driven, non-blocking I/O model**.
- This design allows a single Node.js process to handle thousands of concurrent connections efficiently.

**Previously used approaches:**

- PHP, Java Servlets, ASP.NET used blocking I/O and thread-per-request models.

**Recommended today:**

- Node.js for APIs, real-time applications, microservices, and streaming systems.

![NodeJS Image](/src/assets/nodejs.png)

---

### ❓ What is Express.js and why do we need it?

**Level:** 🟢 Beginner

### 📝 Answer

- **Express.js** is a minimal web framework built on top of Node.js.
- Express.js simplifies HTTP server creation by providing routing, middleware handling, and request/response abstractions.
- Without Express.js, developers would need to manually handle headers, routes, and request parsing using Node’s core modules.
- Express.js follows a middleware-based architecture, which makes applications modular and maintainable.

**Where it is used:**

- REST APIs
- Backend services
- Server-side rendered applications

![ExpressFlow Image](/src/assets/express-flow.png)

---

### ❓ What does non-blocking I/O mean in Node.js?

**Level:** 🟡 Intermediate

### 📝 Answer

- Non-blocking I/O means Node.js does not wait for slow operations such as file reads or database queries to finish.
- Instead, Node.js delegates these operations to the operating system or libuv thread pool.
- Once the operation completes, a callback is queued for execution in the event loop.
- This allows Node.js to remain responsive even under heavy load.

_Example: Blocking vs Non-Blocking_

- ❌ Blocking (Traditional)

```js
const data = fs.readFileSync("file.txt");
console.log(data);
```

The server stops until the file is fully read.

- ✅ Non-Blocking (Node.js)

```js
fs.readFile("file.txt", (err, data) => {
  console.log(data);
});
```

The file read happens in the background, and Node.js continues executing other requests.

---

### ❓ Explain the Node.js Event Loop in detail.

**Level:** 🟡 Intermediate

### 📝 Answer

![NodeJSEventLoop Image](/src/assets/nodejs-eventloop.png)

- The Event Loop is the mechanism that allows Node.js to handle asynchronous operations using a single main JavaScript thread.
- Node.js relies on **libuv**, which manages the event loop and a background thread pool.
- The Event Loop processes tasks in **phases**, ensuring predictable execution order.

🔁 Event Loop Phases

![NodeJSEventLoop Image](/src/assets/nodejs-event-loop-phase.png)

- **Timers Phase**
  Executes callbacks scheduled by `setTimeout()` and `setInterval()` once their delay has expired.

- **Pending Callbacks Phase**
  Handles callbacks deferred from previous operations, such as some TCP errors.

- **Poll Phase**
  Retrieves new I/O events and executes I/O callbacks. If no callbacks are available, it may wait.

- **Check Phase**
  Executes callbacks scheduled using `setImmediate()`.

- **Close Callbacks Phase**
  Handles cleanup callbacks like closing sockets.

⚠️ Microtasks vs Macrotasks

- `process.nextTick` callbacks run **first**, then Promise callbacks (`then`, `catch`, code after `await`) — both are **microtasks**.
- Microtasks run **as soon as the current code finishes**, before the event loop moves to its next callback or phase.
- Timers, I/O callbacks and `setImmediate` are **macrotasks** (one callback per turn, from their phase).

```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
console.log("sync");
```

**Output:**

```text
sync
nextTick
promise
timeout      ← these two can swap when run from the main script
immediate
```

- Synchronous code runs first, then **all** microtasks (`nextTick` before promises), then the event loop phases.
- `setTimeout(…, 0)` vs `setImmediate`: from the main script the order depends on process timing. **Inside an I/O callback**, `setImmediate` always runs first, because the check phase comes right after the poll phase.

> ⚠️ A recursive `process.nextTick` (or endless promise chain) **starves** the event loop — I/O never gets a turn.

---

### ❓ Is Node.js single-threaded?

**Level:** 🟡 Intermediate

### 📝 Answer

**Your JavaScript runs on one main thread — but Node.js itself uses more threads.**

- **Network I/O** (HTTP, sockets, database drivers) uses the operating system's async features (epoll, kqueue, IOCP) — **no extra threads** needed.
- **libuv's thread pool** (4 threads by default, `UV_THREADPOOL_SIZE` up to 1024) runs work the OS can't do asynchronously: **file system**, `dns.lookup`, **crypto** (`pbkdf2`, `scrypt`), **zlib** compression.
- V8 also uses background threads for garbage collection and compiling.
- **Worker threads** let you run your own JavaScript in parallel when you need it.

So one slow CPU loop in your code blocks every request, while thousands of waiting network calls don't.

#### ↳ Follow-up: Why can many `bcrypt.hash` calls slow down file reads?

↪ Both use the same small libuv thread pool (4 threads by default). Heavy crypto fills it, and file system work waits in line.

---

### ❓ What are Worker Threads and when should they be used?

**Level:** 🟡 Intermediate

### 📝 Answer

- Worker Threads allow JavaScript code to run in parallel threads.
- They are designed specifically for CPU-intensive tasks that would otherwise block the event loop.
- Worker threads should be used for tasks such as encryption, image processing, or heavy computations.
- They should not be used for I/O-bound tasks.

💻 **Code Example**

1. **`main.js` (Main Thread)**

```js
import { Worker } from "worker_threads";

// Create worker and send input
const worker = new Worker("./worker.js", {
  workerData: 5,
});

// Receive result from worker
worker.on("message", (result) => {
  console.log("Result from worker:", result);
});

console.log("Main thread is NOT blocked");
```

2.  **`worker.js` (Worker Thread)**

```js
import { workerData, parentPort } from "worker_threads";

// Function that runs in worker thread
function calculate(number) {
  return number * 2;
}

// Execute function
const result = calculate(workerData);

// Send result back to main thread
parentPort.postMessage(result);
```

🔄 Worker Threads – Short Conceptual Workflow

- The application starts on the **`main thread`**, which runs the event loop and normal application logic.
- The main thread creates a **`Worker`**, which starts a new JavaScript thread separate from the main thread.
- The input value passed as **`workerData`** is sent once during Worker creation and becomes available to the worker thread.
- The worker thread begins executing **`worker.js`**, fully isolated from the main thread’s execution.
- The worker runs its own function using the provided **`workerData`**, and this logic executes only inside the worker thread.
- All CPU-intensive computation happens inside the worker thread, keeping the main thread free and responsive.
- After finishing its work, the worker sends the result back to the main thread using **`parentPort`**.
- The main thread listens for messages from the worker, receives the result asynchronously, and continues execution without blocking.
- While the **`Worker`** is running, the main thread continues handling other tasks, confirming that the event loop is not blocked.

---

### ❓ What are Streams and why are they important?

**Level:** 🟡 Intermediate

### 📝 Answer

![Image](/src/assets/nodejs-streams-buffer.png)

Streams are a **mechanism in Node.js that allow data to be processed incrementally, piece by piece**, instead of loading the entire data into memory at once.

In simple terms:

> **Streams let you read or write data continuously as it becomes available.**

Node.js streams are especially useful for handling:

- Large files
- Network data
- Real-time data processing

📌 **Types of Streams (High-Level)**

Node.js provides four main types of streams:

- **Readable** – used to read data (e.g., reading a file)
- **Writable** – used to write data (e.g., writing to a file)
- **Duplex** – both readable and writable (e.g., TCP sockets)
- **Transform** – modifies data while streaming (e.g., compression)

**Follow-up questions:**

#### ↳ Follow-up: Why Are Streams Important in Node.js?

📌 Memory Efficiency

Without streams, Node.js would need to:

- Load the entire file or payload into memory
- Process it
- Then send it forward

This becomes dangerous for:

- Large files (GBs)
- High-traffic APIs
- Concurrent users

Streams solve this by:

- Processing **small chunks**
- Releasing memory immediately after use
- Keeping the application responsive

📌 Performance and Scalability

Node.js is designed to handle **I/O-heavy workloads**.
Streams align perfectly with this design because they:

- Do not block the event loop
- Reduce memory pressure
- Allow backpressure handling

This is why streams are heavily used in:

- File uploads/downloads
- Video streaming
- API gateways
- Log processing
- Data pipelines

📌 Real-World Analogy

Think of:

- `Buffer` as downloading an entire movie before watching
- `Stream` as watching a movie while it is still downloading

💻 **Code Example**

❌ **Without Streams (Buffer-based – Risky)**

```js
import fs from "fs";

const data = fs.readFileSync("largeFile.txt");
fs.writeFileSync("copy.txt", data);
```

Problems:

- Entire file is loaded into memory
- Can crash for large files
- Blocks execution

✅ **With Streams (Recommended)**

```js
import fs from "fs";

const readStream = fs.createReadStream("largeFile.txt");
const writeStream = fs.createWriteStream("copy.txt");

readStream.pipe(writeStream);

// Better in production: pipeline() forwards errors and closes every stream
import { pipeline } from "stream/promises";
await pipeline(fs.createReadStream("largeFile.txt"), fs.createWriteStream("copy.txt"));
```

Benefits:

- Data flows chunk by chunk
- Low memory usage
- Highly scalable

#### ↳ Follow-up: What Is a Buffer in Node.js?

A `Buffer` is a temporary memory allocation used to store **binary data entirely in memory**.

Buffers are:

- Fixed-size
- Stored fully before processing
- Used for small, manageable data chunks

📌 When Buffers Are Commonly Used

Buffers are ideal when:

- Data size is small
- Immediate access to the entire data is required
- You need random access to bytes

Examples:

- Cryptographic operations
- Image processing
- Parsing small binary protocols

💻 **Code Example**

```js
const buffer = Buffer.from("Hello World");
console.log(buffer.toString());
```

This works well because the data is small and controlled.

**Difference Between Streams and Buffer**

| Aspect        | Streams                   | Buffer              |
| ------------- | ------------------------- | ------------------- |
| Data Handling | Chunk by chunk            | All at once         |
| Memory Usage  | Very low                  | High for large data |
| Performance   | Scales well               | Risky for big data  |
| Use Case      | Large files, network data | Small binary data   |
| Blocking Risk | Non-blocking              | Can block           |

**When to Use Streams vs Buffer**

✅ Use Streams When:

- File size is large
- Data comes from network
- You want scalability
- You need backpressure handling

✅ Use Buffer When:

- Data is small
- Entire payload is required at once
- Processing is quick and controlled

#### ↳ Follow-up: How does backpressure work in Node.js streams?

Streams handle **backpressure**, which means they automatically regulate the flow of data based on the consumer’s ability to process it.

- If the destination is slow to consume data
- The stream’s internal buffer fills up to a limit (`highWaterMark`)
- Once that limit is reached, the source is paused until the buffer drains

This prevents unbounded memory growth and keeps the event loop responsive.

In contrast, `Buffer` is just a memory container and provides **no built-in flow control**, which makes buffer-based approaches risky for large or continuous data in production systems.

---

### ❓ What is middleware in Express.js?

**Level:** 🟢 Beginner

### 📝 Answer

- Middleware functions execute sequentially between the incoming request and outgoing response.
- Middleware is used for logging, authentication, validation, parsing, and error handling.
- This architecture promotes separation of concerns and reusability.

💡 Common Middleware Examples

- **Logging Middleware:** Morgan, Winston
- **File Upload Middleware:** Multer
- **Parsing Middleware:** `express.json()`, `express.urlencoded()`
- **Static Files:** `express.static()`

A middleware is a function `(req, res, next)`. It can read or change the request, end the response, or call `next()` to pass control on. **Order matters** — they run in the order you register them.

```js
app.use(express.json());                          // parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // parse form bodies

// custom middleware: log every request and its duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => console.log(req.method, req.url, res.statusCode, `${Date.now() - start}ms`));
  next();                                         // forget this and the request hangs
});

// error-handling middleware has 4 parameters and goes last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});
```

---

### ❓ How do you manage environment configuration?

**Level:** 🟡 Intermediate

### 📝 Answer

Keep settings that change per environment (URLs, ports, keys) **outside the code** in environment variables, so the same build runs in dev, staging and production.

```js
// .env (local only — never commit it)
// PORT=3000
// DB_URL=postgres://localhost/shop

// Node 20.6+ can load it without a library: node --env-file=.env app.js
// or with the dotenv package: import "dotenv/config";

const port = Number(process.env.PORT ?? 3000);
if (!process.env.DB_URL) throw new Error("DB_URL is required");   // fail fast on missing config
```

- Validate config at startup (e.g. with `zod`) so a typo fails immediately, not at the first request.
- In production, real **secrets** come from a secret manager (AWS Secrets Manager, Vault) or the platform's secret store, not from a `.env` file in the image.

---

### ❓ How does load balancing work in Node.js?

**Level:** 🟡 Intermediate

### 📝 Answer

One Node.js process uses **one CPU core** for JavaScript. To use all cores and survive crashes, run **several instances** and spread requests across them.

| Level | How |
|---|---|
| One machine | **PM2 cluster mode** (`pm2 start app.js -i max`) or Node's `cluster` module — one worker per core sharing the same port |
| Many machines / containers | **NGINX**, a cloud load balancer (AWS ALB) or Kubernetes Services in front of the instances |

Because any instance can get the next request, keep the app **stateless**: sessions in Redis or JWTs, files in S3 — not in process memory.

---

### ❓ Explain routing, route params, and query params.

**Level:** 🟡 Intermediate

### 📝 Answer

- **Routing** maps a method + path to a handler.
- **Route params** are part of the path and **identify** a resource: `/users/42` → `req.params.id === "42"`.
- **Query params** come after `?` and **filter, sort or paginate**: `/users?page=2&role=admin`.

```js
// GET /users/42/orders?status=paid&page=2
app.get("/users/:id/orders", (req, res) => {
  const userId = req.params.id;          // "42"
  const { status, page = "1" } = req.query;   // "paid", "2" — always strings
  res.json({ userId, status, page: Number(page) });
});
```

> ⚠️ Both arrive as **strings** — convert and validate them (`Number(...)`, a schema validator) before use.

Group routes with `express.Router()` (e.g. `app.use("/users", usersRouter)`).

---

### ❓ How do you profile Node.js applications?

**Level:** 🟡 Intermediate

### 📝 Answer

Profiling finds **where time and memory go**.

- **CPU:** `node --cpu-prof app.js` writes a profile you open in Chrome DevTools, or `node --inspect app.js` and record live in `chrome://inspect`. Look for wide "flame" bars — functions that take the most time.
- **Memory leaks:** take two **heap snapshots** a few minutes apart (DevTools → Memory) and compare which objects keep growing.
- **Event loop delay:** `perf_hooks.monitorEventLoopDelay()` — high delay means something blocks the main thread.
- **Tools:** Clinic.js (`clinic doctor`, `clinic flame`), `0x` flame graphs, and APM tools (Datadog, New Relic) in production.

---

### ❓ How does logging work in production?

**Level:** 🟡 Intermediate

### 📝 Answer

In production, logs must be **structured, levelled and collected centrally**.

- Use a logger (**Pino** — very fast — or Winston), not `console.log`.
- Write **JSON** lines to stdout; a collector (CloudWatch, ELK, Loki, Datadog) ships and indexes them.
- Use **levels** (`error`, `warn`, `info`, `debug`) and set the level per environment.
- Add a **request/correlation ID** to every line, so one request can be traced across services.
- **Never log** passwords, tokens or card numbers (use redaction).

```js
import pino from "pino";
const log = pino({ level: process.env.LOG_LEVEL ?? "info", redact: ["req.headers.authorization"] });
log.info({ orderId: 42, ms: 120 }, "order created");
// {"level":30,"time":...,"orderId":42,"ms":120,"msg":"order created"}
```

---

### ❓ Explain memory management and garbage collection.

**Level:** 🟡 Intermediate

### 📝 Answer

V8 frees memory **automatically** when nothing references an object any more.

- The heap has a **young generation** (new, short-lived objects — collected often and quickly) and an **old generation** (objects that survived — collected less often).
- A **memory leak** is memory that's still **referenced** but no longer needed, so it can never be freed.

**Common leaks:**

| Cause | Example |
|---|---|
| Growing global/module-level caches | `const cache = {}` that only ever adds keys → use an LRU with a size limit |
| Event listeners never removed | `emitter.on(...)` on every request without `off` |
| Timers never cleared | `setInterval` holding references forever |
| Closures holding large objects | A callback that keeps a whole request/response alive |

Find them with heap snapshots (see profiling). Raise the old-space limit only when you truly need more: `node --max-old-space-size=4096 app.js`.

---

### ❓ Compare npm, yarn, pnpm, and npx.

**Level:** 🟡 Intermediate

### 📝 Answer

| Tool | What it is | Key point |
|---|---|---|
| `npm` | Default package manager, ships with Node | `package-lock.json`; `npm ci` for exact, clean CI installs |
| `yarn` | Alternative package manager | `yarn.lock`; Yarn 2+ adds Plug'n'Play (no `node_modules`) |
| `pnpm` | Fast, disk-efficient package manager | One global store, linked into projects; strict about undeclared dependencies; great for monorepos |
| `npx` | **Runs** a package's command, downloading it temporarily if needed | `npx create-react-app my-app`, `npx prisma migrate` |

All three managers read the same `package.json`; commit **one** lock file so everyone gets identical versions.

---

### ❓ What is the Node.js REPL?

**Level:** 🟢 Beginner

### 📝 Answer

**REPL** = **R**ead, **E**valuate, **P**rint, **L**oop — an interactive Node.js prompt. Run `node` with no file and type JavaScript; each line runs immediately and shows the result.

```text
$ node
> 2 + 3
5
> [1, 2, 3].map(x => x * 2)
[ 2, 4, 6 ]
> _            // the last result
[ 2, 4, 6 ]
> .exit
```

Useful for trying out an API quickly, testing a regex, or inspecting a library. Commands: `.help`, `.editor` (multi-line), `.load file.js`.

---

### ❓ How does the File System module work?

**Level:** 🟡 Intermediate

### 📝 Answer

The `fs` module reads, writes and watches files. It has three styles:

```js
import fs from "fs";
import { readFile, writeFile } from "fs/promises";

fs.readFileSync("a.txt", "utf8");              // 1. sync — blocks the event loop (OK at startup only)
fs.readFile("a.txt", "utf8", (err, text) => {}); // 2. callback
const text = await readFile("a.txt", "utf8");   // 3. promises — preferred in modern code
await writeFile("b.txt", text.toUpperCase());
```

- Async versions run on the **libuv thread pool**, so the main thread stays free.
- For **large files**, use streams (`fs.createReadStream`) instead of reading everything into memory.

---

### ❓ What is caching and why is it important?

**Level:** 🟢 Beginner

### 📝 Answer

Caching keeps a copy of frequently read data somewhere faster, so you don't hit the database (or a slow API) every time.

```js
// Cache-aside with Redis (node-redis v4)
async function getProduct(id) {
  const cached = await redis.get(`product:${id}`);
  if (cached) return JSON.parse(cached);                       // hit

  const product = await db.products.findById(id);              // miss
  await redis.set(`product:${id}`, JSON.stringify(product), { EX: 600 });  // keep 10 minutes
  return product;
}
```

- **In-process** (a `Map` or `lru-cache`): fastest, but each instance has its own copy.
- **Redis**: shared by all instances, survives restarts.
- Always set an **expiry (TTL)** and delete the key when the data changes. See the Caching & Redis notes for strategies and pitfalls.

---

### ❓ Does `async/await` create threads in Node.js?

**Level:** 🟡 Intermediate

### 📝 Answer

- No, `async/await` does **not** create new threads in Node.js.
- `async/await` is **syntactic sugar** built on top of JavaScript **Promises**, and it does not change how JavaScript is executed internally.
- When an `async` function is called, it starts executing synchronously until it reaches an `await` keyword.
- At the point of `await`, the function pauses execution and returns control back to the **event loop**, allowing other tasks to run.
- The awaited operation is handled asynchronously, often by the operating system or Node.js’s internal thread pool if it involves I/O.
- Once the awaited Promise is resolved or rejected, the remaining part of the function is placed in the **microtask queue**.
- The event loop then executes this continuation when it reaches the microtask processing step.

💡 **Code Example**

```js
async function fetchData() {
  console.log("Start");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("End");
}

fetchData();
```

**Execution explanation:**

- `"Start"` is logged immediately.
- The function pauses at `await`, and the event loop continues processing other tasks.
- After one second, the Promise resolves.
- `"End"` is executed as a microtask after the current event loop phase completes.

---


## Node.js Runtime Deep Dive (Intermediate)

### ❓ `process.nextTick` vs `setImmediate` vs `setTimeout(0)` — what's the order?

### 📝 Answer

```mermaid
flowchart LR
  T[timers<br/>setTimeout] --> P[poll<br/>I/O callbacks] --> C[check<br/>setImmediate] --> X[close] --> T
  N((nextTick queue,<br/>then promise microtasks)) -. "runs between every phase" .-> T
```

| API | Runs |
|---|---|
| `process.nextTick(fn)` | right after the current operation, **before** promises |
| `Promise.then` / `await` | after the nextTick queue |
| `setTimeout(fn, 0)` | next **timers** phase |
| `setImmediate(fn)` | next **check** phase (right after I/O) |

```js
setTimeout(() => console.log("timeout"));
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
// nextTick, promise, then timeout/immediate (order varies in the main module)
```

Inside an I/O callback, `setImmediate` **always** runs before `setTimeout(0)`.

#### ↳ Follow-up: Can `nextTick` starve the event loop?

↪ Yes — recursively calling `nextTick` never lets I/O run. Use `setImmediate` to yield.

---

### ❓ What is the EventEmitter, and how is it used?

### 📝 Answer

`EventEmitter` is Node's built-in **publish/subscribe** class. Streams, HTTP servers and sockets all extend it.

```js
import { EventEmitter } from "node:events";

class OrderEvents extends EventEmitter {}
const orders = new OrderEvents();

orders.on("placed", order => sendEmail(order));        // listener
orders.once("placed", () => console.log("first order!"));
orders.emit("placed", { id: 1, total: 500 });          // calls listeners synchronously, in order
```

| Method | Does |
|---|---|
| `on` / `addListener` | subscribe |
| `once` | subscribe for one call |
| `off` / `removeListener` | unsubscribe |
| `emit` | call every listener **synchronously** |

**Must know:**
- An `"error"` event with **no listener** crashes the process — always handle `"error"`.
- More than 10 listeners on one event prints a **possible memory leak** warning (listeners added but never removed).

#### ↳ Follow-up: Is `emit` async?

↪ No — listeners run immediately, inside the `emit` call.

---

### ❓ How do you shut down a Node.js server gracefully?

### 📝 Answer

When Kubernetes or PM2 stops your app, it sends **SIGTERM**. A graceful shutdown **stops taking new requests, finishes current ones, closes connections, then exits**.

```js
const server = app.listen(3000);

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);
  server.close(async () => {                 // stop accepting; wait for in-flight requests
    await db.end();                          // close DB pool, Redis, Kafka consumers…
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();   // force exit if it hangs
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);              // Ctrl+C
```

In Kubernetes, also fail the **readiness probe** first so no new traffic is routed, and keep the shutdown shorter than `terminationGracePeriodSeconds` (default 30 s).

#### ↳ Follow-up: Why does it matter?

↪ Without it, deploys cut off requests mid-way (failed payments, half-written data).

---

### ❓ How do you handle unhandled promise rejections and uncaught exceptions?

### 📝 Answer

Since **Node 15**, an unhandled promise rejection **crashes the process** by default.

```js
async function load() { throw new Error("DB down"); }
load();                      // ❌ no await / no .catch → process exits

await load();                // ✅ inside try/catch
load().catch(log);           // ✅
```

**Last-resort handlers** — log and exit, don't keep running in an unknown state:

```js
process.on("unhandledRejection", reason => { logger.fatal({ reason }, "unhandled rejection"); process.exit(1); });
process.on("uncaughtException", err => { logger.fatal(err, "uncaught exception"); process.exit(1); });
```

A process manager (Kubernetes, PM2, systemd) restarts it.

In Express 4, errors in `async` route handlers need `try/catch` + `next(err)`; **Express 5** forwards rejected promises to the error handler automatically.

#### ↳ Follow-up: Why exit instead of continuing?

↪ After an unexpected error the app may hold broken state (half-open connections, locks). Restarting clean is safer.

---

### ❓ `cluster` vs `worker_threads` — when do you use each?

### 📝 Answer

| | `cluster` | `worker_threads` |
|---|---|---|
| Creates | **processes** (one per core) | **threads** inside one process |
| Memory | separate | can share (`SharedArrayBuffer`) |
| Use for | serving more **HTTP requests** on all cores | **CPU-heavy** work without blocking the event loop |
| Example | a web server on an 8-core VM | image resizing, PDF generation, hashing |

```js
// cluster: one worker process per CPU core, all sharing port 3000
import cluster from "node:cluster";
import os from "node:os";
if (cluster.isPrimary) {
  os.cpus().forEach(() => cluster.fork());
  cluster.on("exit", () => cluster.fork());   // restart crashed workers
} else {
  app.listen(3000);
}
```

In containers, teams often skip `cluster` and run **one process per container**, letting Kubernetes scale the pods.

#### ↳ Follow-up: Doesn't the libuv thread pool already use threads?

↪ Only for built-in I/O (files, DNS, crypto). Your own JavaScript loops still run on the main thread — that's what `worker_threads` is for.

---
