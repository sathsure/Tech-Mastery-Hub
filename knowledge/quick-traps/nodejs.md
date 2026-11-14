# Node.js — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. "Node is single-threaded"
- ❌ "So it can only do one thing at a time."
- ✅ Your JS runs on one thread, but I/O runs in the background (libuv + thread pool).

### 2. Blocking the event loop
- ❌ `fs.readFileSync` or a big loop inside a request handler → every user waits.
- ✅ Use async APIs; move CPU work to `worker_threads`.

### 3. `await` in `forEach`
- ❌ `ids.forEach(async id => await save(id)); console.log('done')` → "done" prints first.
- ✅ `for (const id of ids) await save(id)` or `await Promise.all(ids.map(save))`.

### 4. Unhandled promise rejections
- ❌ Calling an async function without `await` or `.catch` → crash (newer Node versions).
- ✅ Always await or catch.

### 5. Errors in async Express routes
- ❌ `app.get('/', async () => { throw err })` → request hangs (Express 4).
- ✅ `try/catch` + `next(err)`, or Express 5 (handles rejected promises).

### 6. `process.nextTick` loops
- ❌ Recursive `nextTick` → I/O never runs.
- ✅ Use `setImmediate` to let the loop continue.

### 7. Loading a big file into memory
- ❌ `const data = await fs.readFile('10GB.csv')` → out of memory.
- ✅ Stream it.

### 8. `Promise.all` fails fast
- ❌ Expecting the other results when one fails.
- ✅ Use `Promise.allSettled` to get every result.

### 9. Middleware order
- ❌ `app.use(auth)` after the routes → routes aren't protected.
- ✅ Middleware runs in the order it's added.

### 10. Too many parallel calls
- ❌ `Promise.all(10000 requests)` → overloads the DB or API.
- ✅ Limit concurrency (`p-limit`) or batch.
