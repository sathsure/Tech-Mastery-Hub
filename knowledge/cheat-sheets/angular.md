# Angular — Cheat Sheet

> **In one line:** Google's TypeScript framework for building large web apps from components, with routing, forms, HTTP and dependency injection built in.

## Building blocks
- **Component** — a piece of UI: a class + an HTML template + styles.
- **Service** — shared logic or data (API calls), injected where needed.
- **Directive** — adds behaviour to an element.
- **Pipe** — formats a value in the template: `{{ price | currency }}`.
- **Standalone components** — the default now; no `NgModule` needed.

```ts
@Component({
  selector: 'app-hello',
  standalone: true,
  template: `<h1>Hello {{ name }}</h1>`,
})
export class HelloComponent { @Input() name = ''; }
```

## Data binding
- `{{ value }}` — show a value.
- `[disabled]="isBusy"` — set a property.
- `(click)="save()"` — listen to an event.
- `[(ngModel)]="name"` — two-way: the input and the field stay in sync.

## Talking between components
- **Parent → child:** `@Input()` (or `input()`).
- **Child → parent:** `@Output()` + `EventEmitter` (or `output()`).
- **Unrelated components:** a shared service (with a signal or `BehaviorSubject`).

## Lifecycle hooks (most used)
- `constructor` — inject services only.
- `ngOnInit` — load data; inputs are ready.
- `ngOnChanges` — an input changed.
- `ngAfterViewInit` — the child views are ready.
- `ngOnDestroy` — clean up (unsubscribe, clear timers).

## Template control flow
```html
@if (user) { <p>Hi {{ user.name }}</p> } @else { <p>Please log in</p> }
@for (item of items; track item.id) { <li>{{ item.name }}</li> }
```
- `@defer` — load part of the page later (when visible, when idle).

## Dependency injection (DI)
- Angular creates services and hands them to whoever asks.
- `@Injectable({ providedIn: 'root' })` — one shared instance for the whole app.
- Get one with `inject(HttpClient)` or the constructor.

## Change detection
How Angular knows when to update the screen.
- **Default** — checks every component after any event.
- **OnPush** — checks a component only when its inputs change, an event happens inside it, or its signals/async pipes update. Faster.
- With OnPush, replace objects/arrays instead of changing them.

## Signals
Simple reactive values; the screen updates when they change.
```ts
count = signal(0);
double = computed(() => this.count() * 2);
add() { this.count.update(c => c + 1); }
```

## RxJS in Angular
- `HttpClient` returns Observables.
- `async` pipe — subscribes and unsubscribes for you: `{{ users$ | async }}`.
- Search box: `debounceTime` → `distinctUntilChanged` → `switchMap(http call)`.

## Routing
- `routes` → `<router-outlet>`; links with `routerLink`.
- **Lazy loading** — load a page's code only when visited: `loadComponent: () => import(...)`.
- **Guards** — allow or block a route (`canActivate`). **Resolvers** — load data first.

## Forms
- **Template-driven** — `ngModel`, good for simple forms.
- **Reactive** — `FormGroup` + `FormControl` + `Validators` in the class; better for complex forms.

## HTTP interceptors
Code that runs on every request/response: add auth tokens, handle errors, show a loader.

## Performance tips
OnPush, signals, `track` in `@for`, lazy routes, `@defer`, pipes instead of method calls in templates, AOT build, SSR.
