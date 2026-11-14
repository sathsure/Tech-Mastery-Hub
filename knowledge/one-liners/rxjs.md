# RxJS — One-liners

> The most asked questions, each answered in one sentence.

1. **What is an Observable?** — A lazy stream of values over time that starts when you subscribe.
2. **Observable vs Promise?** — A Promise gives one value and can't be cancelled; an Observable can give many and can be unsubscribed.
3. **What is a Subject?** — An Observable you can also push values into, shared by all subscribers.
4. **What is a BehaviorSubject?** — A Subject with a current value that new subscribers receive immediately.
5. **What is a ReplaySubject?** — A Subject that replays the last N values to new subscribers.
6. **Cold vs hot Observable?** — Cold starts a new run per subscriber; hot shares one running source.
7. **What does `switchMap` do?** — It cancels the previous inner Observable and switches to the newest one.
8. **What does `mergeMap` do?** — It runs all inner Observables at the same time.
9. **What does `concatMap` do?** — It runs inner Observables one after another, in order.
10. **What does `exhaustMap` do?** — It ignores new values while the current inner Observable is still running.
11. **What does `debounceTime` do?** — It emits a value only after a pause in emissions.
12. **`combineLatest` vs `forkJoin`?** — `combineLatest` emits whenever any source changes; `forkJoin` emits once when all sources complete.
13. **What does `catchError` do?** — It handles an error and returns a fallback Observable.
14. **What does `shareReplay(1)` do?** — It shares one subscription and gives the latest value to late subscribers.
15. **What does `tap` do?** — It runs a side effect (like logging) without changing the values.
16. **How do you avoid memory leaks?** — Use the `async` pipe, `takeUntilDestroyed`, `take(1)` or unsubscribe.
17. **What does `distinctUntilChanged` do?** — It skips values equal to the previous one.
18. **What is a marble diagram?** — A drawing of values on a timeline used to explain operators.
19. **What does `scan` do?** — It keeps a running accumulated value, like `reduce` over time.
20. **What does `takeUntil` do?** — It completes the stream when another Observable emits.
