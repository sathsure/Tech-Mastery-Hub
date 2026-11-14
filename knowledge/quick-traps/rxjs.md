# RxJS — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Nothing happens
- ❌ `this.http.get(url).pipe(map(...))` with no subscribe.
- ✅ Observables are lazy. Subscribe, or use the `async` pipe.

### 2. Nested subscribes
- ❌ `a$.subscribe(a => b$(a).subscribe(...))` — hard to cancel, leaks.
- ✅ Use `switchMap` / `mergeMap` / `concatMap`.

### 3. Wrong flattening operator
- ❌ `mergeMap` for a search box → old, slow results can arrive last.
- ✅ `switchMap` cancels the old request. Use `exhaustMap` for submit buttons (stops double submits).

### 4. One error kills the stream
- ❌ `clicks$.pipe(switchMap(() => http.get(url)), catchError(...))` → after one error, clicks stop working.
- ✅ Put `catchError` **inside** the `switchMap`: `switchMap(() => http.get(url).pipe(catchError(() => of([]))))`.

### 5. `combineLatest` stays silent
- ❌ Expecting output while one source hasn't emitted yet.
- ✅ It waits until **every** source has emitted at least once (`startWith` helps).

### 6. `forkJoin` never emits
- ❌ `forkJoin([interval(1000), http$])`
- ✅ It waits for every source to **complete**. Use only with things that finish (HTTP), or add `take(1)`.

### 7. Two subscribes = two HTTP calls
- ❌ `users$ | async` used twice in a template → two requests.
- ✅ Share it with `shareReplay(1)`, or subscribe once (`@if (users$ | async; as users)`).

### 8. Leaking subscriptions
- ❌ `fromEvent(window, 'resize').subscribe(...)` in a component, never stopped.
- ✅ Use `takeUntilDestroyed()` or the `async` pipe.

### 9. Exposing a Subject
- ❌ `public user$ = new BehaviorSubject(null)` — anyone can call `next()`.
- ✅ Keep the Subject private; expose `user$.asObservable()`.

### 10. `debounceTime` vs `throttleTime`
- ❌ Mixing them up.
- ✅ `debounceTime` waits for a pause (typing). `throttleTime` lets one through per time window (scroll).
