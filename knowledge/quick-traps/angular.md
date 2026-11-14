# Angular — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. Calling the API in the constructor
- ❌ `constructor() { this.http.get(...) }` — inputs aren't set yet; hard to test.
- ✅ Inject in the constructor, load data in `ngOnInit`.

### 2. Forgetting to unsubscribe
- ❌ `interval(1000).subscribe(...)` in a component — keeps running after it's gone (memory leak).
- ✅ Use the `async` pipe, `takeUntilDestroyed()`, or unsubscribe in `ngOnDestroy`. (HTTP calls complete on their own.)

### 3. OnPush and mutation
- ❌ `this.items.push(x)` with OnPush — the screen doesn't update.
- ✅ Create a new array: `this.items = [...this.items, x]` (or use a signal).

### 4. Methods in templates
- ❌ `{{ getTotal() }}` — runs on every change detection.
- ✅ Use a pure pipe, a `computed()` signal, or a pre-calculated field.

### 5. Nested subscribes
- ❌ `route.params.subscribe(p => http.get(p.id).subscribe(...))`
- ✅ Chain with `switchMap`: `route.params.pipe(switchMap(p => http.get(p.id)))`.

### 6. `@ViewChild` read too early
- ❌ Using `@ViewChild` in `ngOnInit` → `undefined`.
- ✅ It's ready in `ngAfterViewInit` (or use `{ static: true }` if it's always there).

### 7. Service provided in a component
- ❌ Adding a service to a component's `providers` and expecting shared data.
- ✅ That creates a new instance per component. Use `providedIn: 'root'` for one shared instance.

### 8. `Subject` vs `BehaviorSubject`
- ❌ Using `Subject` for "current user" — late subscribers get nothing.
- ✅ `BehaviorSubject` gives the latest value to new subscribers.

### 9. Missing `track` in lists
- ❌ Re-rendering every row when the list refreshes.
- ✅ `@for (u of users; track u.id)` lets Angular reuse rows.

### 10. HTTP Observables are lazy
- ❌ `this.http.post(url, body);` — nothing is sent.
- ✅ Nothing happens until you subscribe (or use the `async` pipe).

### 11. Trusting HTML with `bypassSecurityTrustHtml`
- ❌ Passing user text to it — opens an XSS hole.
- ✅ Let Angular sanitize; only bypass for content you fully control.
