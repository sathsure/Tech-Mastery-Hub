# Angular — Comparisons

> The classic "X vs Y" questions, side by side.

## Constructor vs `ngOnInit`
| | Constructor | `ngOnInit` |
|---|---|---|
| Runs | when the class is created | after inputs are set |
| Use for | injecting services | loading data, setup |

## Default vs OnPush change detection
| | Default | OnPush |
|---|---|---|
| Checks the component | after every event anywhere | only on new input refs, own events, signals/async pipe |
| Speed | slower in big apps | faster |
| Needs immutable updates | ❌ | ✅ |

## Signals vs Observables
| | Signals | Observables (RxJS) |
|---|---|---|
| Holds a current value | ✅ always | not necessarily |
| Subscriptions to clean up | ❌ | ✅ |
| Best for | UI state | async streams, HTTP, events |

## Template-driven vs reactive forms
| | Template-driven | Reactive |
|---|---|---|
| Defined in | HTML (`ngModel`) | the class (`FormGroup`) |
| Best for | simple forms | complex, dynamic forms |
| Easy to unit test | ❌ | ✅ |

## `Subject` vs `BehaviorSubject`
| | `Subject` | `BehaviorSubject` |
|---|---|---|
| Initial value | ❌ | ✅ |
| New subscribers get the last value | ❌ | ✅ |

## Pure vs impure pipe
| | Pure (default) | Impure |
|---|---|---|
| Re-runs | when input reference changes | on every change detection |

## AOT vs JIT
| | AOT | JIT |
|---|---|---|
| Templates compiled | at build time | in the browser |
| Bundle | smaller, faster start | bigger |

## Standalone components vs NgModules
| | Standalone | NgModule |
|---|---|---|
| Dependencies declared | in the component's `imports` | in the module |
| Default today | ✅ | legacy |

## Component vs directive
| | Component | Directive |
|---|---|---|
| Has a template | ✅ | ❌ |
| Purpose | a piece of UI | add behaviour to an element |

## `@ViewChild` vs `@ContentChild`
| | `@ViewChild` | `@ContentChild` |
|---|---|---|
| Finds elements in | the component's own template | content projected from the parent |
| Ready in | `ngAfterViewInit` | `ngAfterContentInit` |
