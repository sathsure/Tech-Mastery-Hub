# RxJS — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Type-ahead search
```ts
const results$ = fromEvent<InputEvent>(input, 'input').pipe(
  map(e => (e.target as HTMLInputElement).value.trim()),
  debounceTime(300),                 // wait for a pause in typing
  distinctUntilChanged(),            // skip same text
  filter(q => q.length > 1),
  switchMap(q => http.get(`/api/search?q=${q}`).pipe(catchError(() => of([])))),
);
```

### 2. State store with BehaviorSubject
```ts
@Injectable({ providedIn: 'root' })
export class CartStore {
  private items$ = new BehaviorSubject<Item[]>([]);
  readonly items = this.items$.asObservable();               // read-only for others
  readonly total = this.items.pipe(map(list => list.reduce((s, i) => s + i.price, 0)));
  add(item: Item) { this.items$.next([...this.items$.value, item]); }
}
```

### 3. Parallel calls, one result
```ts
forkJoin({ user: api.getUser(id), orders: api.getOrders(id) })
  .subscribe(({ user, orders }) => render(user, orders));
```

### 4. Polling every 5 s until done
```ts
timer(0, 5000).pipe(
  switchMap(() => api.getJobStatus(jobId)),
  takeWhile(status => status !== 'DONE', true),   // true = also emit the final DONE
).subscribe(status => show(status));
```

### 5. Retry with backoff
```ts
http.get(url).pipe(
  retry({ count: 3, delay: (_, attempt) => timer(500 * 2 ** (attempt - 1)) }),  // 500, 1000, 2000 ms
  catchError(err => { log(err); return of(null); }),
);
```

### 6. Cache an HTTP call
```ts
private config$ = this.http.get<Config>('/api/config').pipe(shareReplay(1));
getConfig() { return this.config$; }   // one request, many subscribers
```

### 7. Prevent double submit
```ts
fromEvent(saveBtn, 'click').pipe(
  exhaustMap(() => api.save(form.value)),   // ignore clicks while saving
).subscribe();
```

### 8. Clean up on destroy (Angular)
```ts
private destroy$ = new Subject<void>();
ngOnInit() { source$.pipe(takeUntil(this.destroy$)).subscribe(); }
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
// Newer: source$.pipe(takeUntilDestroyed()).subscribe();
```
