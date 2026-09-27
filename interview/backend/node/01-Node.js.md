### ❓ What is Node.js and why was it created?

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

- Promise callbacks (`then`, `catch`) are executed as **microtasks**.
- Microtasks always run **before** the event loop proceeds to the next phase.
- Timers and I/O callbacks are **macrotasks**.

```js
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
```

**Output explanation:**

- `promise` executes first because microtasks have higher priority.

---

### ❓ Is Node.js single-threaded?

### 📝 Answer

- JavaScript execution in Node.js runs on a single main thread.
- Internally, Node.js uses a **thread pool** for CPU-intensive or blocking operations.
- This hybrid model allows high concurrency without blocking the event loop.

---

### ❓ What are Worker Threads and when should they be used?

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

1️⃣ Why Are Streams Important in Node.js?

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
```

Benefits:

- Data flows chunk by chunk
- Low memory usage
- Highly scalable

2️⃣ What Is a Buffer in Node.js?

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

3️⃣ Difference Between Streams and Buffer

| Aspect        | Streams                   | Buffer              |
| ------------- | ------------------------- | ------------------- |
| Data Handling | Chunk by chunk            | All at once         |
| Memory Usage  | Very low                  | High for large data |
| Performance   | Scales well               | Risky for big data  |
| Use Case      | Large files, network data | Small binary data   |
| Blocking Risk | Non-blocking              | Can block           |

6️⃣ When to Use Streams vs Buffer

✅ Use Streams When:

- File size is large
- Data comes from network
- You want scalability
- You need backpressure handling

✅ Use Buffer When:

- Data is small
- Entire payload is required at once
- Processing is quick and controlled

7️⃣ How does backpressure work in Node.js streams?

Streams handle **backpressure**, which means they automatically regulate the flow of data based on the consumer’s ability to process it.

- If the destination is slow to consume data
- The stream’s internal buffer fills up to a limit (`highWaterMark`)
- Once that limit is reached, the source is paused until the buffer drains

This prevents unbounded memory growth and keeps the event loop responsive.

In contrast, `Buffer` is just a memory container and provides **no built-in flow control**, which makes buffer-based approaches risky for large or continuous data in production systems.

---

### ❓ What is middleware in Express.js?

### 📝 Answer

- Middleware functions execute sequentially between the incoming request and outgoing response.
- Middleware is used for logging, authentication, validation, parsing, and error handling.
- This architecture promotes separation of concerns and reusability.

💡 Common Middleware Examples

- **Logging Middleware:** Morgan, Winston
- **File Upload Middleware:** Multer
- **Parsing Middleware:** `express.json()`, `express.urlencoded()`
- **Static Files:** `express.static()`

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

---

### ❓ How do you manage environment configuration?

### 📝 Answer

- Environment variables separate configuration from code.
- This allows different values for development, staging, and production.
- Tools like `dotenv` are commonly used.

---

### ❓ How does load balancing work in Node.js?

### 📝 Answer

- Load balancing distributes incoming requests across multiple application instances.
- This improves availability, scalability, and fault tolerance.
- Tools include NGINX, PM2 cluster mode, and cloud load balancers.

---

### ❓ Explain routing, route params, and query params.

### 📝 Answer

- Routing maps HTTP requests to handlers.
- Route parameters identify specific resources.
- Query parameters modify request behavior.

```js
app.get("/users/:id", (req, res) => {
  req.params.id;
  req.query.page;
});
```

---

### ❓ How do you profile Node.js applications?

### 📝 Answer

- Profiling identifies CPU bottlenecks and memory leaks.
- Tools include Chrome DevTools, Clinic.js, and Node’s inspector.

---

### ❓ How does logging work in production?

### 📝 Answer

- Logging captures application behavior over time.
- Libraries like Winston and Pino support log levels and persistence.
- Logging is critical for debugging and monitoring.

---

### ❓ Explain memory management and garbage collection.

### 📝 Answer

- Node.js uses V8’s garbage collector.
- Unused memory is reclaimed automatically.
- Memory leaks occur due to global variables, closures, or unremoved listeners.

---

### ❓ Compare npm, yarn, pnpm, and npx.

### 📝 Answer

- `npm` is the default and widely supported.
- `yarn` improves install speed and consistency.
- `pnpm` is disk-efficient and recommended for large monorepos.
- `npx` runs packages without installing them globally.

---

### ❓ What is the Node.js REPL?

### 📝 Answer

- REPL allows interactive execution of JavaScript.
- It is useful for debugging and experimentation.

---

### ❓ How does the File System module work?

### 📝 Answer

- The File System module provides APIs to interact with files.
- Asynchronous methods are preferred to avoid blocking the event loop.

---

### ❓ What is caching and why is it important?

### 📝 Answer

- Caching stores frequently accessed data for faster retrieval.
- It reduces database load and improves response time.
- Tools like **Redis** are commonly used.

---

### ❓ Does `async/await` create threads in Node.js?

### 📝 Answer

- No, `async/await` does **not** create new threads in Node.js.
- `async/await` is **syntactic sugar** built on top of JavaScript **Promises**, and it does not change how JavaScript is executed internally.
- When an `async` function is called, it starts executing synchronously until it reaches an `await` keyword.
- At the point of `await`, the function pauses execution and returns control back to the **event loop**, allowing other tasks to run.
- The awaited operation is handled asynchronously, often by the operating system or Node.js’s internal thread pool if it involves I/O.
- Once the awaited Promise is resolved or rejected, the remaining part of the function is placed in the **microtask queue**.
- The event loop then executes this continuation when it reaches the microtask processing step.

#Code Example### 💡 

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
