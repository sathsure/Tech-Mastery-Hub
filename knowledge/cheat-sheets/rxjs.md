# RxJS — Cheat Sheet

> **In one line:** RxJS treats async data (clicks, HTTP, timers) as a **stream** you can filter, change and combine, like an array that arrives over time.

## Core pieces
- **Observable** — a stream of values. Lazy: nothing happens until you subscribe.
- **Subscribe** — start listening: `next` (a value), `error`, `complete`.
- **Subscription** — call `unsubscribe()` to stop.
- **Operator** — a function inside `pipe()` that changes the stream.

```ts
interval(1000).pipe(
  map(n => n * 2),
  take(3),
).subscribe(v => console.log(v));   // 0, 2, 4
```

## Observable vs Promise
| | Promise | Observable |
|---|---|---|
| Values | one | many |
| Starts | right away | when subscribed |
| Cancel | no | yes (`unsubscribe`) |

## Cold vs hot
- **Cold** — each subscriber gets its own run (each subscribe = new HTTP call).
- **Hot** — everyone shares one stream (mouse clicks).
- `shareReplay(1)` — share one result with many subscribers.

## Subjects (you can push values into them)
- **Subject** — new subscribers get only future values.
- **BehaviorSubject** — has a starting value; new subscribers get the latest one. Good for "current state".
- **ReplaySubject(n)** — new subscribers get the last `n` values.

## The 4 "switch" operators (most asked)
When each value starts another async call (like HTTP):
- **switchMap** — cancel the old call, keep only the newest. → search box.
- **mergeMap** — run all calls at the same time. → independent uploads.
- **concatMap** — run calls one after another, in order. → ordered saves.
- **exhaustMap** — ignore new clicks while busy. → login button.

```ts
searchInput$.pipe(
  debounceTime(300),            // wait until typing pauses
  distinctUntilChanged(),       // skip if text is the same
  switchMap(q => this.http.get(`/api?q=${q}`)),
);
```

## Other common operators
- **Change:** `map`, `scan` (running total).
- **Filter:** `filter`, `take`, `first`, `debounceTime`, `distinctUntilChanged`, `takeUntil`.
- **Combine:** `combineLatest` (latest of each), `forkJoin` (wait for all to finish, like `Promise.all`), `merge`, `withLatestFrom`.
- **Errors:** `catchError` (return a fallback), `retry(3)`.
- **Side effects:** `tap` (logging), `finalize` (like `finally`).
- **Create:** `of`, `from`, `interval`, `timer`, `fromEvent`.

## Unsubscribing (avoid memory leaks)
- HTTP finishes by itself; timers, events and Subjects don't.
- Ways: the `async` pipe, `takeUntilDestroyed()`, `take(1)`, `takeUntil(destroy$)`, or `unsubscribe()`.
