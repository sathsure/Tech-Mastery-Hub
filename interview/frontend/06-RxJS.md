# 🌊 RxJS Interview Prep — Reactive Programming Mastery


---

# Part 1 — Core Concepts

### ❓ How would you explain RxJS to a developer who's never used reactive programming before?

### 📝 Answer

RxJS (Reactive Extensions for JavaScript) is a library for **reactive programming** using **Observables**. It lets you compose async and event-based programs using a functional, declarative pipeline of operators.

> 💡 **Mental model:** Promises are *one* future value. Observables are *many* future values over time — like a stream you can pipe, filter, and transform.

---

### ❓ Can you walk me through what an Observable is and how it differs from a Promise?

### 📝 Answer

A **lazy, push-based collection** that emits values over time and notifies observers via three kinds of notifications: `next`, `error`, and `complete`.

| Term | Meaning |
|------|---------|
| Lazy | Nothing happens until someone subscribes |
| Push | The producer pushes values to consumers (vs Iterators where consumer pulls) |
| Over time | Can emit 0, 1, many, or infinite values |

---

### ❓ What role does an Observer play in RxJS, and how does it interact with an Observable?

### 📝 Answer

An object with up to three callbacks that defines **how to react** to Observable emissions:

```ts
const observer = {
  next:     (value) => console.log(value),
  error:    (err)   => console.error(err),
  complete: ()      => console.log('Done'),
};

source$.subscribe(observer);
```

---

### ❓ What does a Subscription represent in RxJS, and why is managing it important?

### 📝 Answer

The object returned from `observable.subscribe(...)` that represents the **active execution**. You use it to **unsubscribe** and stop receiving values.

```ts
const sub = source$.subscribe(value => console.log(value));
// later...
sub.unsubscribe();
```

---

### ❓ Can you explain what an RxJS operator is and how operators are composed in a pipeline?

### 📝 Answer

A **pure function** that takes an Observable as input and returns a new Observable as output. Operators don't modify the source — they create a new stream.

Examples: `map`, `filter`, `switchMap`, `take`, `debounceTime`.

---

### ❓ What's the difference between Pipeable and Creation operators?

### 📝 Answer

| Type | Purpose | Examples |
|------|---------|----------|
| **Creation** | Create new Observables from scratch | `of`, `from`, `interval`, `timer`, `fromEvent`, `EMPTY` |
| **Pipeable** | Transform an existing Observable inside `.pipe()` | `map`, `filter`, `switchMap`, `catchError` |

```ts
// Creation
const numbers$ = of(1, 2, 3);

// Pipeable
const doubled$ = numbers$.pipe(map(n => n * 2));
```

---

### ❓ Is an Observable lazy or eager?

### 📝 Answer

**Lazy.** It does **not** start producing values until someone subscribes.

> 💡 **Why this matters:** If you build a pipeline but never subscribe, **none** of your operators run. No HTTP request, no timer, nothing.

---

### ❓ Can Observables be synchronous?

### 📝 Answer

**Yes.** They can be sync, async, or a mix — depending on how they're implemented.

```ts
of(1, 2, 3).subscribe(console.log);   // 1, 2, 3 — all synchronous
console.log('after');                 // prints 'after' AFTER 1, 2, 3
```

---

### ❓ What are the three notifications an Observable can emit?

### 📝 Answer

| Notification | Description | Terminal? |
|--------------|-------------|-----------|
| `next(value)` | A new value is emitted | ❌ No |
| `error(err)` | An error occurred — stream terminates | ✅ Yes |
| `complete()` | Stream finished cleanly | ✅ Yes |

> ⚠️ Once `error` or `complete` fires, the stream is **done** — no more values can be emitted.

---

### ❓ Can an Observable emit after `complete`?

### 📝 Answer

**No.** After `complete` or `error`, the stream is terminal — no further emissions are allowed by the contract.

---

# Part 2 — Cold vs Hot & Multicasting

### ❓ How would you describe a Cold Observable, and when does it matter whether an Observable is cold or hot?

### 📝 Answer

Each subscription gets its **own independent execution and source**.

Examples: `of`, `from`, `httpClient.get()`.

```ts
const cold$ = of(Math.random());
cold$.subscribe(console.log);  // 0.42
cold$.subscribe(console.log);  // 0.91 — DIFFERENT execution
```

> 💡 **Analogy:** Like Netflix — each viewer gets their own playback from the start.

---

#### ↳ Follow-up: How does a Hot Observable differ from a Cold one, and can you give a real-world example of each?

### 📝 Answer

The **source is shared**. New subscribers tap into an ongoing execution.

Examples: DOM events (`fromEvent`), WebSocket streams, Subjects.

> 💡 **Analogy:** Like a live TV broadcast — late joiners miss what aired earlier.

---

#### ↳ Follow-up: How do you convert a cold Observable to a hot one?

### 📝 Answer

Through **multicasting** — sharing one execution across multiple subscribers:

| Operator | Behavior |
|----------|----------|
| `share()` | Multicasts; ref-counted; restarts when subscribers drop to 0 |
| `shareReplay(n)` | Multicasts AND replays last `n` values to late subscribers |
| `publish().refCount()` | The legacy way (now use `share()`) |
| Wrap in `Subject` | Manual multicasting |

---

### ❓ `share()` vs `shareReplay()` — explain with example

### 📝 Answer

#### 🔹 `share()`

```ts
const src$ = of(0, 1, 2).pipe(share());

src$.subscribe(v => console.log("A:", v));

setTimeout(() => {
  src$.subscribe(v => console.log("B:", v));   // ❌ Misses 0,1,2
}, 1000);
```

**Output:**
```
A: 0
A: 1
A: 2
```
B subscribes too late and gets nothing.

---

#### 🔹 `shareReplay(1)`

```ts
const src$ = of(0, 1, 2).pipe(shareReplay(1));

src$.subscribe(v => console.log("A:", v));

setTimeout(() => {
  src$.subscribe(v => console.log("B:", v));   // ✅ Receives last value
}, 1000);
```

**Output:**
```
A: 0
A: 1
A: 2
B: 2 👈 REPLAYED
```

> 📌 **Use `shareReplay(1)` for HTTP caching** — late subscribers get the cached response without firing a new request.

---

### ❓ 🪤 Trick: What's a common memory leak pitfall with `shareReplay`?

### 📝 Answer

Using `shareReplay({ refCount: false })` (or the legacy signature) over an **infinite stream** keeps the source subscription alive **forever**, even when no consumers exist.

✅ **Modern safe usage:**

```ts
shareReplay({ bufferSize: 1, refCount: true })
```

`refCount: true` means: when subscribers drop to 0, unsubscribe from the source.

---

# Part 3 — Subjects

### ❓ Can you explain what a Subject is in RxJS and when you'd reach for it over a plain Observable?

### 📝 Answer

A `Subject` is **both an Observable and an Observer**. It can emit values to multiple subscribers (multicast).

```ts
const subject$ = new Subject<number>();

subject$.subscribe(v => console.log('A:', v));
subject$.next(1);                              // A: 1
subject$.subscribe(v => console.log('B:', v));
subject$.next(2);                              // A: 2, B: 2
```

---

#### ↳ Follow-up: Difference between `Subject`, `BehaviorSubject`, `ReplaySubject`, and `AsyncSubject`?

### 📝 Answer

| Type | Stores Value? | New Subscriber Receives | Use Case |
|------|---------------|--------------------------|----------|
| `Subject` | ❌ No | Only future emissions | Event bus, button clicks |
| `BehaviorSubject` | ✅ Yes (current) | Current + future | App state, current user |
| `ReplaySubject(n)` | ✅ Yes (last `n`) | Last `n` + future | Recent activity log |
| `AsyncSubject` | ✅ Last only | Final value on complete | One-shot result on completion |

#### Examples

```ts
// Subject
const s$ = new Subject<number>();
s$.next(1);
s$.subscribe(v => console.log(v));  // ❌ Receives nothing — value already lost

// BehaviorSubject
const b$ = new BehaviorSubject<number>(0);
b$.next(1);
b$.subscribe(v => console.log(v));  // ✅ Receives 1

// ReplaySubject(2)
const r$ = new ReplaySubject<number>(2);
r$.next(1); r$.next(2); r$.next(3);
r$.subscribe(v => console.log(v));  // ✅ Receives 2, 3
```

---

### ❓ 🪤 Trick: Does `BehaviorSubject` emit its current value immediately on subscription?

### 📝 Answer

**Yes** — synchronously, the moment you subscribe.

---

### ❓ 🪤 Trick: Can a `Subject` emit values before anyone subscribes?

### 📝 Answer

Yes — it can. But those values are **lost** (no replay). Future subscribers will only see emissions that happen *after* they subscribe.

---

### ❓ 🪤 Trick: What happens if you call `.next()` on a completed `Subject`?

### 📝 Answer

**Nothing happens.** Subscribers receive nothing after completion. The Subject is sealed.

---

### ❓ Why is exposing a `BehaviorSubject` directly from a service considered a design smell?

### 📝 Answer

Because **anyone with the reference can call `.next()`** — breaking encapsulation and making it hard to enforce invariants.

#### ❌ Smell

```ts
@Injectable({ providedIn: 'root' })
export class UserService {
  user$ = new BehaviorSubject<User | null>(null);  // ❌ Exposed, mutable
}
```

#### ✅ Fix

```ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _user$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this._user$.asObservable();          // ✅ Read-only

  setUser(u: User) {
    this._user$.next(u);                                // ✅ Controlled mutation
  }
}
```

> 📌 **Rule:** Keep writable subjects private; expose `asObservable()` or signals.

---

# Part 4 — Transformation Operators

### ❓ What does `map` do?

### 📝 Answer

Transforms each emitted value with a pure function.

```ts
of(1, 2, 3).pipe(map(n => n * 10)).subscribe(console.log);
// 10, 20, 30
```

---

#### ↳ Follow-up: What does `filter` do?

### 📝 Answer

Emits only values that satisfy a predicate.

```ts
of(1, 2, 3, 4).pipe(filter(n => n % 2 === 0)).subscribe(console.log);
// 2, 4
```

---

#### ↳ Follow-up: What does the `tap` operator do, and when would you use it in a real application?

### 📝 Answer

**Side effects only** — logging, debugging, triggering analytics — without changing the stream.

```ts
http.get('/api/users').pipe(
  tap(users => console.log('Got users:', users.length))
);
```

> ⚠️ `tap` does **not** change the values flowing through.

---

#### ↳ Follow-up: What does `scan` do?

### 📝 Answer

Like `Array.reduce`, but **emits every intermediate value** as it accumulates.

```ts
of(1, 2, 3).pipe(scan((acc, n) => acc + n, 0)).subscribe(console.log);
// 1, 3, 6
```

> 💡 **Use case:** Building a running total, or maintaining state from a stream of actions.

---

# Part 5 — Higher-Order Mapping (switchMap & friends)

### ❓ Difference between `map` and `switchMap`?

### 📝 Answer

| Operator | Purpose |
|----------|---------|
| `map` | Transforms a value into another **value** |
| `switchMap` | Transforms a value into another **Observable**, and *switches* to it (cancelling the previous) |

```ts
// map
input$.pipe(map(n => n * 2));

// switchMap
input$.pipe(switchMap(query => http.get(`/search?q=${query}`)));
```

---

### ❓ Explain `mergeMap` (a.k.a. `flatMap`)

### 📝 Answer

Maps each value to an inner Observable and **subscribes to all inner Observables concurrently**, merging their outputs.

> 💡 **Use case:** Independent parallel work — e.g., uploading multiple files at once.

---

#### ↳ Follow-up: Explain `concatMap`

### 📝 Answer

Queues inner Observables and subscribes to them **sequentially**. Each one waits for the previous to complete.

> 💡 **Use case:** Order-sensitive operations — e.g., processing a queue of POST requests where order matters.

---

#### ↳ Follow-up: Explain `exhaustMap`

### 📝 Answer

**Ignores new source values while an inner Observable is active**, and resumes listening only after it completes.

> 💡 **Use case:** Login button — ignore further clicks while a login request is in flight.

---

### 🧠 The Big Four — Visual Comparison

<img width="600" height="500" alt="RxJS Maps Image" src="/src/assets/rxjs-maps.png" />

| Operator | Concurrency | Cancels Previous? | When New Value Arrives |
|----------|-------------|-------------------|-------------------------|
| `switchMap` | One at a time | ✅ Yes | Cancels old, runs new |
| `mergeMap` | All in parallel | ❌ No | Runs new alongside old |
| `concatMap` | One at a time | ❌ No | Queues new, waits for old |
| `exhaustMap` | One at a time | ❌ No | **Ignores** new while old runs |

---

### ❓ 🪤 Trick: For autocomplete search, which operator is best?

### 📝 Answer

**`switchMap`** — when the user types a new query, cancel the previous in-flight HTTP request. We only care about the latest.

```ts
search$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(q => http.get(`/search?q=${q}`))
);
```

---

### ❓ 🪤 Trick: For a login button that must ignore double-clicks, which operator?

### 📝 Answer

**`exhaustMap`** — while the login request is in flight, all extra clicks are ignored.

```ts
loginClicks$.pipe(
  exhaustMap(() => authService.login(creds))
);
```

---

### ❓ 🪤 Trick: For a queue of tasks executed strictly in order, which operator?

### 📝 Answer

**`concatMap`** — preserves order; each task waits for the previous one to finish.

---

# Part 6 — Combination Operators

### ❓ Difference between `combineLatest` and `forkJoin`?

### 📝 Answer

| Operator | Emits When? | Completes When? | Use Case |
|----------|-------------|------------------|----------|
| `combineLatest` | **Any** source emits (after all have emitted at least once) | When **all** sources complete | Live form state, real-time dashboards |
| `forkJoin` | Once — when **all** sources complete | Same emission | Parallel HTTP calls (Promise.all-style) |

```ts
// combineLatest — live updates
combineLatest([name$, email$]).subscribe(([n, e]) => /* ... */);

// forkJoin — wait for all to finish
forkJoin([http.get('/a'), http.get('/b')]).subscribe(([a, b]) => /* ... */);
```

---

### ❓ Difference between `merge` and `concat`?

### 📝 Answer

| Operator | Behavior |
|----------|----------|
| `merge` | Subscribes to all sources concurrently and **interleaves** emissions |
| `concat` | Subscribes sequentially — second starts only after the first completes |

---

### ❓ What does `withLatestFrom` do?

### 📝 Answer

When the source emits, it combines that value with the **latest** values from other Observables.

```ts
formSubmit$.pipe(
  withLatestFrom(formValue$),
  map(([_, value]) => value)
).subscribe(submitted => api.save(submitted));
```

> 💡 **Pattern:** "When *this trigger* fires, give me the *latest value* from another stream."

---

### ❓ Use case for `race`?

### 📝 Answer

When you want to **listen to several Observables but only react to the one that emits first** (like `Promise.race`).

```ts
race(http.get('/cdn1'), http.get('/cdn2')).subscribe(/* fastest wins */);
```

---

### ❓ 🪤 Trick: Does `combineLatest([a$, b$])` emit if `a$` emits but `b$` has never emitted?

### 📝 Answer

**No.** It waits until **each** source has emitted at least once.

> 📌 If you need a default value, use `startWith()` on each source.

---

# Part 7 — Error Handling & Retry

### ❓ How does `catchError` work?

### 📝 Answer

Catches errors from upstream and lets you return a **new Observable** — a fallback, default value, or rethrow.

```ts
http.get('/users').pipe(
  catchError(err => {
    console.error(err);
    return of([]);          // fallback to empty array
  })
);
```

---

#### ↳ Follow-up: Where should `catchError` be placed — before or after `retry`?

### 📝 Answer

**Typically: `retry` first, `catchError` after.**

```ts
source$.pipe(
  retry(3),                      // try up to 3 times
  catchError(err => of(null))    // only fires after retries fail
);
```

> 💡 If you put `catchError` **before** `retry`, the error gets swallowed and `retry` never sees it.

---

#### ↳ Follow-up: What does `retry` do?

### 📝 Answer

Resubscribes to the source on **error**, a given number of times (or indefinitely).

```ts
retry(3)              // retry up to 3 times
retry({ count: 3, delay: 1000 })   //: with delay between retries
```

---

#### ↳ Follow-up: Difference between `retry` and `repeat`?

### 📝 Answer

| Operator | Re-subscribes On |
|----------|------------------|
| `retry` | **Error** |
| `repeat` | **Completion** |

---

#### ↳ Follow-up: What does `finalize` do in RxJS, and how does it compare to `catchError` for cleanup?

### 📝 Answer

To run **cleanup logic** when the stream completes OR errors. Perfect for hiding loading spinners.

```ts
this.loading = true;
http.get('/data').pipe(
  finalize(() => this.loading = false)
).subscribe(...);
```

---

### ❓ 🪤 Trick: If you `catchError` and return `EMPTY`, does the stream complete?

### 📝 Answer

**Yes.** `EMPTY` is an Observable that completes immediately with no emissions.

---

### ❓ 🪤 Trick: Can `catchError` swallow an error and keep the outer stream alive?

### 📝 Answer

**Yes**, if it returns a new Observable that doesn't error. This is the classic "fallback to empty array" pattern.

> ⚠️ **But beware** in `switchMap`/`mergeMap`: if the **inner** Observable errors and you don't catch *inside*, the outer stream dies. Place `catchError` inside the inner pipeline:

```ts
input$.pipe(
  switchMap(q => http.get(`/search?q=${q}`).pipe(
    catchError(() => of([]))     // ✅ Inner catch keeps outer alive
  ))
);
```

---

# Part 8 — Schedulers

### ❓ Can you explain what a Scheduler is in RxJS and when you'd need to explicitly specify one?

### 📝 Answer

A centralized way to control **when** and **in which execution context** Observable notifications are delivered.

| Scheduler | Use Case |
|-----------|----------|
| `asyncScheduler` | Defer to next macrotask (`setTimeout(0)`-like) |
| `asapScheduler` | Microtask (`Promise.resolve()`-like) |
| `queueScheduler` | Synchronous (current frame) |
| `animationFrameScheduler` | Tied to `requestAnimationFrame` |

---

### ❓ Why might you use `observeOn(asyncScheduler)`?

### 📝 Answer

To **make a synchronous stream async** — useful for:
- Avoiding "Expression has changed after it was checked" errors in Angular
- Deferring expensive sync work to free up the event loop
- Forcing predictable async timing in tests

---

# Part 9 — RxJS in Angular

### ❓ How does RxJS interact with Angular's Zones and Change Detection?

### 📝 Answer

Angular patches async APIs (including many RxJS sources) via **zone.js**. Emissions that run **inside** the Angular zone trigger change detection. You can use `NgZone.runOutsideAngular()` to run heavy streams outside the zone for performance, then re-enter the zone with `NgZone.run()` when you need to update the view.

---

### ❓ How does Angular's `HttpClient` use RxJS?

### 📝 Answer

It returns **cold Observables** that emit the response and then complete.

```ts
this.http.get<User[]>('/api/users').subscribe(users => /* ... */);
```

---

### ❓ 🪤 Trick: If you subscribe twice to the same `this.http.get(...)`, how many HTTP calls happen?

### 📝 Answer

**Two.** `HttpClient` Observables are cold — each subscription triggers a new request.

```ts
const req$ = this.http.get('/api/users');
req$.subscribe();   // Request #1
req$.subscribe();   // Request #2
```

---

### ❓ How do you avoid multiple HTTP calls when many components need the same data?

### 📝 Answer

**Share the stream using `shareReplay(1)`** in a service:

```ts
@Injectable({ providedIn: 'root' })
export class UserService {
  readonly users$ = this.http.get<User[]>('/api/users').pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
```

Now any component subscribing to `userService.users$` reuses the same HTTP response.

---

### ❓ What does the `async` pipe do?

### 📝 Answer

Subscribes to an Observable/Promise in a template, exposes the latest value, and **automatically unsubscribes on component destroy**.

```html
<div *ngIf="users$ | async as users">
  {{ users.length }} users
</div>
```

> 💡 **Best feature:** Zero memory-leak risk — Angular handles unsubscribe for you.

---

### ❓ When should you NOT use the `async` pipe?

### 📝 Answer

- When you need **imperative control** over subscription/timing
- When you need **side effects** (e.g., set component state on emission)
- When the value is shared across many places and one TS subscription is cleaner

---

### ❓ How would you model component state using RxJS?

### 📝 Answer

Use a `BehaviorSubject` (or `Subject` + `scan`) as a state store, expose it as a read-only Observable, and bind via `async` pipe.

```ts
private readonly _state$ = new BehaviorSubject<State>(initial);
readonly state$ = this._state$.asObservable();

updateName(name: string) {
  this._state$.next({ ...this._state$.value, name });
}
```

---

### ❓ Example: How to debounce a search input in Angular?

### 📝 Answer

```ts
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term))
).subscribe(results => this.results = results);
```

---

### ❓ How does RxJS fit into NgRx?

### 📝 Answer

NgRx Effects are pure RxJS streams that listen to action streams (`Actions` is an Observable):

```ts
loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadUsers),
    switchMap(() => this.api.getUsers().pipe(
      map(users => loadUsersSuccess({ users })),
      catchError(err => of(loadUsersFailure({ err })))
    ))
  )
);
```

Operators like `ofType`, `mergeMap`, `switchMap`, `catchError` are the building blocks.

---

# Part 10 — Memory Leaks & Unsubscribe Patterns

### ❓ How do memory leaks occur with RxJS in Angular?

### 📝 Answer

By **not unsubscribing** from long-lived or infinite Observables (e.g., `interval`, `fromEvent`, `WebSocket`) when the component is destroyed.

> ⚠️ The component goes away, but the subscription is still pushing values into a now-detached handler — leaking memory and potentially causing errors.

---

#### ↳ Follow-up: Ways to avoid manual `unsubscribe`?

### 📝 Answer

| Pattern | When to Use |
|---------|-------------|
| `async` pipe | Best — used in templates |
| `takeUntil(destroy$)` | Most flexible TS-side pattern |
| `take(1)`, `first()`, `takeWhile()` | Finite streams with known stop condition |
| **`takeUntilDestroyed()`** | Modern Angular (16+) — auto-cleanup |

---

#### ↳ Follow-up: The `takeUntil(destroy$)` pattern (classic)

```ts
private readonly destroy$ = new Subject<void>();

ngOnInit() {
  interval(1000).pipe(
    takeUntil(this.destroy$)
  ).subscribe(/* ... */);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

---

#### ↳ Follow-up: `takeUntilDestroyed()` — the modern way

Available in Angular 16+, this operator hooks into the component's `DestroyRef` automatically:

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Inside a component (must be in injection context, e.g., constructor or field initializer)
interval(1000).pipe(
  takeUntilDestroyed()
).subscribe(/* ... */);
```

> 💡 **Cleaner, less boilerplate.** No more `destroy$` subjects in every component.

---

#### ↳ Follow-up: Which streams generally do NOT need manual unsubscribe?

### 📝 Answer

- **Finite Observables** that complete on their own (e.g., a single HTTP call)
- Streams managed by the **`async` pipe**
- `take(n)` / `first()` — they auto-complete

---

### ❓ 🪤 Trick: Does a `BehaviorSubject` with no subscribers cause a memory leak by itself?

### 📝 Answer

**Not by itself.** But if the Subject is held by a long-lived service and stores large objects, those references stay in memory as long as the Subject is referenced.

---

### ❓ 🪤 Trick: Does `subscribe` return a Promise?

### 📝 Answer

**No.** It returns a `Subscription`. To get a Promise, use `firstValueFrom` or `lastValueFrom`:

```ts
const value = await firstValueFrom(this.http.get('/data'));
```

> ⚠️ The legacy `.toPromise()` is deprecated — use `firstValueFrom` / `lastValueFrom`.

---

### ❓ 🪤 Trick: If you call `unsubscribe()` on a completed stream, what happens?

### 📝 Answer

**Nothing special.** Completion already cleaned up. Calling `unsubscribe` again is a safe no-op.

---

# Part 11 — Trick Questions Round

### ❓ 🪤 Trick: Will `map` execute if no one subscribes?

### 📝 Answer

**No.** Operators are lazy — they only run when there's an active subscription.

---

### ❓ 🪤 Trick: Does `tap` change the emitted values?

### 📝 Answer

**No.** It's strictly for side effects; the original values pass through unchanged.

---

### ❓ 🪤 Trick: `interval(1000).pipe(take(0))` — does it emit anything?

### 📝 Answer

**No.** `take(0)` completes immediately with zero emissions.

---

### ❓ 🪤 Trick: `from([1,2,3]).pipe(switchMap(x => of(x)))` — can any values be cancelled?

### 📝 Answer

**No.** `of(x)` completes synchronously, so `switchMap` doesn't have time to cancel — every value emerges.

---

### ❓ 🪤 Trick: `share()` vs `shareReplay(1)` for HTTP caching?

### 📝 Answer

| | `share()` | `shareReplay(1)` |
|---|-----------|------------------|
| Late subscribers see last value | ❌ No | ✅ Yes |
| Good for HTTP cache | ❌ No | ✅ Yes |

---

# Part 12 — Real-World Mock Scenarios

### ❓ Mock: You have an infinite WebSocket stream. Some components need it; others don't. Design?

### 📝 Answer

Wrap the WebSocket inside an injectable service. Use a Subject (or `share`/`shareReplay`) to multicast. Manage the connection at the service level so consumers just subscribe and unsubscribe freely.

```ts
@Injectable({ providedIn: 'root' })
export class WsService {
  private socket = webSocket('wss://example.com');
  readonly messages$ = this.socket.pipe(
    share()                       // hot, multicast
  );
}
```

---

### ❓ Mock: File upload progress with cancel support. RxJS approach?

### 📝 Answer

Use `HttpClient` with `reportProgress: true`, map progress events to %, and combine with a `cancel$` Subject via `takeUntil`.

```ts
private readonly cancel$ = new Subject<void>();

upload(file: File) {
  const req = new HttpRequest('POST', '/upload', file, { reportProgress: true });

  return this.http.request(req).pipe(
    map(event => {
      if (event.type === HttpEventType.UploadProgress) {
        return Math.round(100 * event.loaded / (event.total ?? 1));
      }
      return null;
    }),
    takeUntil(this.cancel$)
  );
}

cancelUpload() { this.cancel$.next(); }
```

---

### ❓ Mock: Poll a backend every 10s, but stop on navigation away or error.

### 📝 Answer

```ts
timer(0, 10000).pipe(
  switchMap(() => this.http.get('/data')),
  takeUntil(this.routeDestroyed$),
  catchError(err => {
    console.error(err);
    return EMPTY;
  })
);
```

---

### ❓ Mock: Combine backend prefs + local UI overrides. Model with RxJS?

### 📝 Answer

```ts
combineLatest([this.backendPrefs$, this.uiOverrides$]).pipe(
  map(([backend, ui]) => ({ ...backend, ...ui }))
);
```

---

### ❓ Mock: Three dependent HTTP calls — B depends on A, C depends on B. Implementation?

### 📝 Answer

Chain with `switchMap` (or `concatMap`):

```ts
this.http.get<A>('/a').pipe(
  switchMap(a => this.http.get<B>(`/b/${a.id}`)),
  switchMap(b => this.http.get<C>(`/c/${b.id}`))
);
```

---

### ❓ Mock: Debounce keystrokes, but execute immediately on Enter key.

### 📝 Answer

Merge two streams — debounced typing + immediate Enter:

```ts
const debounced$ = this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()
);

const enter$ = this.enterKey$.pipe(
  withLatestFrom(this.searchControl.valueChanges),
  map(([_, val]) => val)
);

merge(debounced$, enter$).pipe(
  switchMap(term => this.api.search(term))
).subscribe(/* ... */);
```

---

### ❓ Mock: Wizard where each step depends on the previous result and can be retried. Operator choices?

### 📝 Answer

- **`concatMap`** — preserve step order
- **`catchError` + `retry`** — per-step retry logic
- **`scan`** — accumulate wizard state across steps

---

### ❓ You have two REST APIs:
> - `https://jsonplaceholder.typicode.com/users` → 10 user records
> - `https://jsonplaceholder.typicode.com/photos` → many photo records
> Both contain an `id` field. Fetch both, match users with photos by `id`, and merge matched photos into each user.

### 📝 Answer

```ts
import { Component, OnInit, inject } from "@angular/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { forkJoin } from "rxjs";

interface User { id: number; name: string; }
interface Photo { id: number; url: string; }

@Component({
  selector: "app-root",
  standalone: true,
  imports: [HttpClientModule],
  template: ``,
})
export class App implements OnInit {
  private http = inject(HttpClient);

  ngOnInit() {
    forkJoin({
      users:  this.http.get<User[]>("https://jsonplaceholder.typicode.com/users"),
      photos: this.http.get<Photo[]>("https://jsonplaceholder.typicode.com/photos"),
    }).subscribe(({ users, photos }) => {
      const merged = users.map(user => {
        const photo = photos.find(p => p.id === user.id);
        return { ...user, ...photo };
      });
      console.log(merged);
    });
  }
}
```

> 💡 **Why `forkJoin`?** Both APIs are independent — fetch in parallel, wait for both, merge once. Classic use case.

> ⚠️ **Performance note:** `photos.find` is O(N×M). For large datasets, build a `Map<id, Photo>` first to make it O(N+M).

---

# Part 13 — Modern Bridges: Signals ↔ RxJS

Angular 16+ introduced two interop helpers to bridge Signals and RxJS:

### `toSignal(observable$)` — Observable → Signal

Converts an Observable into a read-only Signal you can use anywhere (templates, computed, effects).

```ts
import { toSignal } from '@angular/core/rxjs-interop';

@Component({ /* ... */ })
export class UsersComponent {
  private http = inject(HttpClient);

  // Observable → Signal
  readonly users = toSignal(this.http.get<User[]>('/api/users'), {
    initialValue: []
  });
}
```

```html
<div>{{ users().length }} users</div>
```

---

### `toObservable(signal)` — Signal → Observable

Useful when you need RxJS operators (debounce, switchMap) on signal changes.

```ts
import { toObservable } from '@angular/core/rxjs-interop';

readonly query = signal('');

readonly results$ = toObservable(this.query).pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(q => this.api.search(q))
);
```

> 💡 **Mental model:** `toSignal` brings RxJS *into* Signal world; `toObservable` lets you escape *back* to RxJS for pipeline magic.

---

## 🎓 Final Cheat Sheet

| Concept | Quick Recall |
|---------|--------------|
| Observable | Lazy stream of 0+ values + error/complete |
| Subject | Multicast Observer + Observable |
| BehaviorSubject | Stores current value, replays on subscribe |
| Cold | Each subscription = new execution |
| Hot | Source shared across subscribers |
| `switchMap` | Cancel previous, run new (autocomplete) |
| `mergeMap` | All in parallel |
| `concatMap` | One at a time, in order |
| `exhaustMap` | Ignore new while busy (login button) |
| `combineLatest` | Latest of all, emit on any change |
| `forkJoin` | Wait for all, emit once at end |
| `shareReplay(1)` | HTTP caching pattern |
| `takeUntilDestroyed()` | Modern auto-unsubscribe (Angular 16+) |
| `toSignal` / `toObservable` | RxJS ↔ Signals bridges |

---

> 🚀 **You've internalized RxJS now!** From basic Observables to advanced patterns — go ace that interview.
