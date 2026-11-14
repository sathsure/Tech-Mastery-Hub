# Node.js — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Express API with error handling
```js
import express from "express";
const app = express();
app.use(express.json());

app.get("/users/:id", async (req, res, next) => {
  try {
    const user = await db.findUser(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (err) {
    next(err);                                        // goes to the error handler
  }
});

app.use((err, req, res, next) => {                   // 4 args = error middleware
  console.error(err);
  res.status(500).json({ error: "Internal error" });
});

app.listen(3000);
```

### 2. Auth middleware
```js
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
app.get("/me", requireAuth, (req, res) => res.json(req.user));
```

### 3. Stream a big file
```js
import { pipeline } from "node:stream/promises";
import fs from "node:fs";
import zlib from "node:zlib";

await pipeline(fs.createReadStream("big.log"), zlib.createGzip(), fs.createWriteStream("big.log.gz"));
```

### 4. Simple in-memory rate limiter
```js
const hits = new Map();
function rateLimit(limit = 100, windowMs = 60_000) {
  return (req, res, next) => {
    const now = Date.now();
    const entry = hits.get(req.ip) ?? { count: 0, start: now };
    if (now - entry.start > windowMs) { entry.count = 0; entry.start = now; }
    entry.count++;
    hits.set(req.ip, entry);
    entry.count > limit ? res.status(429).send("Too many requests") : next();
  };
}
// In production use Redis so all instances share the counts.
```

### 5. Limit concurrency
```js
async function mapWithLimit(items, limit, fn) {
  const results = [];
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}
```

### 6. CPU work in a worker thread
```js
// main.js
import { Worker } from "node:worker_threads";
const worker = new Worker(new URL("./hash.js", import.meta.url), { workerData: bigInput });
worker.on("message", result => console.log(result));

// hash.js
import { parentPort, workerData } from "node:worker_threads";
parentPort.postMessage(expensiveHash(workerData));
```

### 7. Graceful shutdown
```js
const server = app.listen(3000);
process.on("SIGTERM", () => {
  server.close(async () => {          // stop taking new requests, finish current ones
    await db.close();
    process.exit(0);
  });
});
```
