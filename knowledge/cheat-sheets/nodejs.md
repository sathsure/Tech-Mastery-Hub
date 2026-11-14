# Node.js — Cheat Sheet

> **In one line:** JavaScript running on the server. One main thread handles many requests at once by never waiting on I/O.

## How Node works
- **V8** runs your JavaScript; **libuv** handles files, network and timers.
- **Event loop** — your code runs on one thread; slow I/O happens in the background and its callback runs when done.
- A small **thread pool** (4 by default) does file system, DNS and crypto work.
- **Great for:** APIs, chat, streaming. **Not for:** heavy CPU work on the main thread.

## Event loop order
Each loop: **timers** (`setTimeout`) → **I/O callbacks** → **setImmediate** → close callbacks.
Between every step: `process.nextTick` first, then promise callbacks.

```js
setTimeout(() => console.log('timeout'));
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
// nextTick → promise → timeout
```

## Modules
- **CommonJS** — `require()` / `module.exports` (older default).
- **ES Modules** — `import` / `export`; turn on with `"type": "module"`.

## Async code
- Callbacks → Promises → **async/await** (use this).
- Run things in parallel: `await Promise.all([a(), b()])`.
- Always handle errors (`try/catch`, `.catch`).

## Streams
Handle big data piece by piece instead of all at once.
- Types: **Readable**, **Writable**, **Duplex**, **Transform**.
- `pipeline()` connects them and handles **backpressure** (slow receiver).
```js
await pipeline(fs.createReadStream('big.log'), zlib.createGzip(), fs.createWriteStream('big.log.gz'));
```

## Using all CPU cores
- **cluster** / **PM2** — several Node processes share one port.
- **worker_threads** — run CPU-heavy JS on other threads.
- **child_process** — run other programs.

## Express basics
```js
const app = express();
app.use(express.json());                         // middleware: parse JSON
app.get('/users/:id', async (req, res, next) => {
  try { res.json(await findUser(req.params.id)); }
  catch (err) { next(err); }                      // send to the error handler
});
app.use((err, req, res, next) => res.status(500).json({ error: 'Something went wrong' }));
```
- **Middleware** — `(req, res, next)` functions that run in order.
- Alternatives: **Fastify** (faster), **NestJS** (structured, Angular-like).

## Security
Validate input (zod/joi), parameterized DB queries, `helmet` for headers, rate limiting, secrets in env vars, `npm audit`.

## Performance
- Don't block the loop (no `readFileSync` or big loops in request handlers).
- Cache (Redis), use connection pools, compress responses.
- Debug: `node --inspect`, heap snapshots for memory leaks.

## npm
- `dependencies` (needed to run) vs `devDependencies` (needed to build/test).
- `package-lock.json` locks exact versions; use `npm ci` in CI.
- `^1.2.3` → allows 1.x updates; `~1.2.3` → allows 1.2.x only.
