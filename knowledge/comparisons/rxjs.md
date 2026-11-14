# RxJS — Comparisons

> The classic "X vs Y" questions, side by side.

## Observable vs Promise
| | Promise | Observable |
|---|---|---|
| Values | one | many |
| Starts | immediately | on subscribe |
| Cancel | ❌ | ✅ |
| Operators | few | many |

## `switchMap` vs `mergeMap` vs `concatMap` vs `exhaustMap`
| | New value while busy → | Use for |
|---|---|---|
| `switchMap` | cancel the old one | search, route params |
| `mergeMap` | run both in parallel | independent requests |
| `concatMap` | queue it | ordered saves |
| `exhaustMap` | ignore it | submit/login buttons |

## Subject types
| | Initial value | New subscriber gets |
|---|---|---|
| `Subject` | ❌ | future values only |
| `BehaviorSubject` | ✅ | the latest value |
| `ReplaySubject(n)` | ❌ | the last n values |
| `AsyncSubject` | ❌ | the last value, on complete |

## Cold vs hot
| | Cold | Hot |
|---|---|---|
| Each subscriber gets | its own run | the shared stream |
| Example | `http.get` | mouse clicks, Subjects |

## `combineLatest` vs `forkJoin` vs `zip`
| | Emits when | Like |
|---|---|---|
| `combineLatest` | any source emits (after all emitted once) | live form values |
| `forkJoin` | all sources complete, once | `Promise.all` |
| `zip` | each source has a new value, paired | pairing items |

## `debounceTime` vs `throttleTime`
| | Lets a value through |
|---|---|
| `debounceTime` | after a quiet pause |
| `throttleTime` | first one per time window |

## `share` vs `shareReplay`
| | Late subscribers get past values |
|---|---|
| `share()` | ❌ |
| `shareReplay(1)` | ✅ the last one |

## `take(1)` vs `first()`
| | Empty stream completes without value |
|---|---|
| `take(1)` | completes quietly |
| `first()` | throws an error |
