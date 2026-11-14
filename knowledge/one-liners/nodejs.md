# Node.js — One-liners

> The most asked questions, each answered in one sentence.

1. **What is Node.js?** — A runtime that runs JavaScript on the server using the V8 engine.
2. **Is Node single-threaded?** — Your JavaScript runs on one thread, but I/O is handled in the background by libuv and a thread pool.
3. **What is the event loop?** — The loop that runs callbacks when their I/O, timers or events are ready.
4. **What is libuv?** — The C library behind Node's event loop and async I/O.
5. **`process.nextTick` vs `setImmediate`?** — `nextTick` runs before the event loop continues; `setImmediate` runs in the next check phase.
6. **What is non-blocking I/O?** — Starting an I/O task and continuing other work until its result is ready.
7. **CommonJS vs ES Modules?** — CommonJS uses `require`; ES Modules use `import`/`export`.
8. **What is a stream?** — A way to process data piece by piece instead of loading it all at once.
9. **What is backpressure?** — When a writer is slower than the reader, so the flow must slow down.
10. **What is middleware in Express?** — A function `(req, res, next)` that runs in order for each request.
11. **How do you use all CPU cores?** — Run several processes with `cluster`/PM2, or use `worker_threads` for CPU work.
12. **`spawn` vs `exec`?** — `spawn` streams output (good for big output); `exec` buffers it all.
13. **What is the thread pool used for?** — File system, DNS, crypto and compression work.
14. **What is `EventEmitter`?** — A class for emitting named events and listening to them.
15. **What is a Buffer?** — A chunk of raw binary data.
16. **`dependencies` vs `devDependencies`?** — Dependencies are needed to run; devDependencies only to build or test.
17. **What does `package-lock.json` do?** — It locks exact dependency versions so installs are repeatable.
18. **`^` vs `~` in versions?** — `^1.2.3` allows minor and patch updates; `~1.2.3` allows only patch updates.
19. **How do you handle errors in async code?** — Use `try/catch` with `await` and `.catch()` on promises.
20. **What blocks the event loop?** — Long synchronous work like big loops, `JSON.parse` of huge data, or `*Sync` functions.
