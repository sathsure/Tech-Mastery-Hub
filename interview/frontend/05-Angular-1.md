# 🅰️ Angular Interview Preparation — Part 1


---

# 🏛️ Part 1 — Angular Basics & Architecture

### ❓ How would you describe Angular to someone coming from AngularJS — what are the fundamental differences?

### 📝 Answer

| Feature         | **AngularJS (1.x)**         | **Angular (2+)**                          |
| --------------- | --------------------------- | ----------------------------------------- |
| Language        | JavaScript                  | TypeScript                                |
| Architecture    | MVC (Controllers + Scopes)  | Component-based                           |
| Change Detection| Dirty checking ($digest)    | Zone.js + Ivy (signals in v16+)           |
| Modules         | Angular modules + DI        | NgModules / Standalone Components         |
| Data Binding    | Two-way by default          | One-way + opt-in two-way                  |
| Performance     | Slower for large apps       | AOT compilation, tree-shakable            |
| Mobile          | Limited                     | Full mobile + SSR support                 |

> 💡 **Key takeaway**: Angular is a complete rewrite — not a version upgrade.

---

# 🧩 Part 2 — Components, Templates & Data Binding

### ❓ What types of data binding does Angular support?

### 📝 Answer

Angular has **four primary types of binding**, plus a custom two-way pattern.

#### 1️⃣ Interpolation `{{ }}` — Component → View

Display a value as text.

```ts
name = "Dev";
```

```html
<p>Hello {{ name }}</p>
```

#### 2️⃣ Property Binding `[prop]` — Component → View

Set DOM/component properties.

```ts
isDisabled = true;
```

```html
<button [disabled]="isDisabled">Submit</button>
```

#### 3️⃣ Event Binding `(event)` — View → Component

Listen to events.

```ts
handleClick() { console.log("Clicked"); }
```

```html
<button (click)="handleClick()">Click</button>
```

#### 4️⃣ Two-Way Binding `[(ngModel)]` — Both directions

Combines property + event binding (banana-in-a-box). Requires `FormsModule`.

```ts
username = "";
```

```html
<input [(ngModel)]="username" />
<p>{{ username }}</p>
```

#### 5️⃣ Custom Two-Way Binding `[(value)]` — `@Input` + `@Output`

For reusable components.

```ts
@Component({
  selector: "app-input",
  standalone: true,
  template: `<input [value]="value" (input)="onInput($event)" />`,
})
export class InputComponent {
  @Input() value!: string;
  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event) {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
```

```html
<app-input [(value)]="username"></app-input>
```

> 💡 Angular recognizes `[(name)]` automatically when there's an `@Input() name` paired with `@Output() nameChange`.

**Quick Summary**

| Syntax           | Direction          | Use            |
| ---------------- | ------------------ | -------------- |
| `{{ }}`          | Comp → View        | Display data   |
| `[prop]`         | Comp → View        | Set property   |
| `(event)`        | View → Comp        | Handle event   |
| `[(ngModel)]`    | Two-way            | Form sync      |
| `[(value)]`      | Two-way (custom)   | Custom comp    |

---

### ❓ Can you walk me through the difference between Components and Directives in Angular?

### 📝 Answer

A **Component** is essentially a **Directive with a template** — it controls a piece of UI.
A **Directive** modifies behavior or appearance of an existing element — **no template**.

| Feature              | Component             | Directive                   |
| -------------------- | --------------------- | --------------------------- |
| Has template         | ✅ Yes                | ❌ No                       |
| Creates UI           | ✅ Yes                | ❌ Modifies existing        |
| Decorator            | `@Component`          | `@Directive`                |
| Can use `<ng-content>` | ✅ Yes              | ❌ No                       |
| Always has selector  | ✅ Yes                | ✅ As attribute or `*`      |

**Component**

```ts
@Component({
  selector: "app-user",
  template: `<h2>Hello {{ name }}</h2>`,
})
export class UserComponent {
  name = "Dev";
}
```

**Directive (Attribute)**

```ts
@Directive({ selector: "[appHighlight]" })
export class HighlightDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = "yellow";
  }
}
```

```html
<p appHighlight>Highlighted</p>
```

**Directive (Structural)**

```html
<div *ngIf="isLoggedIn">Welcome</div>
<li *ngFor="let item of items">{{ item }}</li>
```

#### ↳ **Follow-up:** Is every component a directive?

↪ ✅ Yes — a component is a directive with a template.

#### ↳ **Follow-up:** Can directives have lifecycle hooks?

↪ ✅ Yes (`ngOnInit`, `ngOnChanges`, etc.)

#### ↳ **Follow-up:** Which directive manipulates DOM structure?

↪ Structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`).

---

### ❓ Can you explain ViewEncapsulation in Angular and the trade-offs between the available modes?

### 📝 Answer

`ViewEncapsulation` controls **how component styles are scoped and applied to the DOM**.

#### 1️⃣ Emulated (Default)

Angular **simulates** Shadow DOM by adding generated attributes.

```css
/* Source */
h1 { color: red; }

/* Compiled */
h1[_ngcontent-c0] { color: red; }
```

✅ Scoped to component
✅ Best balance of isolation + compatibility
❌ Not real Shadow DOM

#### 2️⃣ None

No encapsulation — styles are **global**.

✅ Useful for themes, layout overrides
❌ Risk of leaking and conflicts

#### 3️⃣ ShadowDom

Uses **real browser Shadow DOM**.

✅ True isolation — global styles can't penetrate
❌ Styling must be intentional (CSS variables, `::part()`)

---

#### 🤔 Common confusions

**↳ If two components use `h1 { color: red }`, will they conflict?**

| Encapsulation | Conflict? |
| ------------- | --------- |
| Emulated      | ❌ No     |
| None          | ✅ Yes    |
| ShadowDom     | ❌ No     |

**↳ Can `::ng-deep` override ShadowDom styles?**

↪ ❌ **No, never.** ShadowDom is enforced by the **browser**. Angular cannot bypass browser isolation.

**↳ Does `!important` or global CSS override ShadowDom?**

↪ ❌ **No.**

**↳ What ARE the ways to style a ShadowDom component from outside?**

1. **CSS Custom Properties** ✅ (recommended)
   ```css
   :root { --primary-color: red; }
   ```
2. **`::part()`** (if component exposes parts)
   ```css
   my-comp::part(button) { color: red; }
   ```
3. **`::slotted()`** (for projected content only)

---

### ❓ When would you use `::ng-deep` in Angular, and what are the risks of relying on it?

### 📝 Answer

To **override styles of child or third-party components** that use Emulated encapsulation.

| Fact                        | Status |
| --------------------------- | ------ |
| Breaks encapsulation        | ✅     |
| Officially deprecated       | ⚠️     |
| Still works in current Angular | ✅  |
| Works with ShadowDom        | ❌     |

**Common use cases**: Angular Material overrides, third-party UI libraries.

> 💡 Modern alternative: use library-provided theming APIs (CSS variables) instead of `::ng-deep`.

---

# ♻️ Part 3 — Lifecycle Hooks

### ❓ What are Angular lifecycle hooks?

### 📝 Answer

Lifecycle hooks let you tap into key moments in a component's life.

| Hook                    | When It Runs                                | Common Use                          |
| ----------------------- | ------------------------------------------- | ----------------------------------- |
| `ngOnChanges`           | Whenever an `@Input()` value changes        | React to parent updates             |
| `ngOnInit`              | Once after first `ngOnChanges`              | Initialization, API calls           |
| `ngDoCheck`             | Every change detection cycle                | Custom change detection (rare)      |
| `ngAfterContentInit`    | Once after `<ng-content>` projected         | Access projected content            |
| `ngAfterContentChecked` | After every projected content check         | React to content changes            |
| `ngAfterViewInit`       | Once after view + child views initialized   | Access DOM via `@ViewChild`         |
| `ngAfterViewChecked`    | After every view check                      | Measure layout (use sparingly)      |
| `ngOnDestroy`           | Just before component is destroyed          | Cleanup subscriptions, intervals    |

**Execution order:**

```text
ngOnChanges
   ↓
ngOnInit
   ↓
ngDoCheck
   ↓
ngAfterContentInit  → ngAfterContentChecked
   ↓
ngAfterViewInit     → ngAfterViewChecked
   ↓
(repeat DoCheck → AfterContentChecked → AfterViewChecked on each CD)
   ↓
ngOnDestroy
```

![Angular_Lifecycle Image](/src/assets/angular-lifecycle.png)

---

#### ↳ Follow-up: Can you walk through a comprehensive lifecycle example?

### 📝 Answer

**`child.component.ts`**

```ts
@Component({
  selector: "app-child",
  templateUrl: "./child.component.html",
})
export class ChildComponent
  implements OnChanges, OnInit, DoCheck, AfterContentInit,
             AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

  @Input() value!: number;

  // static: true → available in ngOnInit
  @ViewChild("box", { static: true }) box!: ElementRef;

  // Projected content queries
  @ContentChild("title") title!: ElementRef;

  private intervalId!: number;
  private subscription!: Subscription;

  ngOnChanges(changes: SimpleChanges) {
    console.log("Input changed:", changes["value"].currentValue);
  }

  ngOnInit() {
    // ✅ Correct place for: HTTP calls, NgRx dispatch, init state
    // this.http.get(...).subscribe(...);
    this.intervalId = window.setInterval(() => {}, 1000);
  }

  ngDoCheck() {
    // Runs every CD cycle — use for CUSTOM change detection only
  }

  ngAfterContentInit() {
    console.log(this.title.nativeElement.textContent);
    // Projected content via <ng-content> is now accessible
  }

  ngAfterViewInit() {
    // ✅ Safe DOM access for component template + child views
    console.log(this.box.nativeElement);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.subscription?.unsubscribe();
    // Cleanup: intervals, subscriptions, event listeners
  }
}
```

**`child.component.html`**

```html
<div #box>Child View Element</div>

<ng-content select="h1"></ng-content>      <!-- element selector -->
<ng-content select=".desc"></ng-content>   <!-- class selector -->
<ng-content select="#footer"></ng-content> <!-- id selector -->

<p>Input value: {{ value }}</p>
```

**`parent.component.html`**

```html
<app-child [value]="count">
  <h1 #title>Projected Title from Parent</h1>
  <p class="desc">Projected Description</p>
  <div id="footer">Projected Footer</div>
</app-child>
```

> ⚠️ **Important Rules**
>
> - Do DOM access only in `ngAfterViewInit` (view is fully initialized)
> - HTTP calls, dispatch actions in `ngOnInit`
> - **Always clean up** subscriptions/intervals in `ngOnDestroy`

---

# 🎯 Part 4 — Directives

### ❓ How do `*ngIf` and `*ngFor` work conceptually?

### 📝 Answer

Both are **structural directives** — they manipulate the DOM by adding/removing elements.

The `*` is syntactic sugar for `<ng-template>`:

```html
<div *ngIf="show">Hello</div>

<!-- desugars to -->
<ng-template [ngIf]="show">
  <div>Hello</div>
</ng-template>
```

#### Internal mechanism

- They use `TemplateRef` (the template) + `ViewContainerRef` (where to insert)
- `*ngIf` adds/removes a single view
- `*ngFor` creates one view per item in the collection

---

#### ↳ Follow-up: Why is `trackBy` important when rendering lists with `*ngFor`?

### 📝 Answer

**Without `trackBy`**, Angular tracks items by **object identity**. When the array reference changes (e.g., after API call), Angular destroys ALL DOM nodes and recreates them.

**With `trackBy`**, Angular uses a **stable identifier** to know which items truly changed and reuses unchanged DOM nodes.

```html
<li *ngFor="let user of users; trackBy: trackById">
  {{ user.name }}
</li>
```

```ts
trackById(index: number, user: User): number {
  return user.id;
}
```

> 💡 **Performance impact**: HUGE for long lists (1000+ items) or frequently-updated data (live feeds, dashboards).

**Comparison Summary**

| Feature          | `*ngIf`                         | `*ngFor`                |
| ---------------- | ------------------------------- | ----------------------- |
| Type             | Structural directive            | Structural directive    |
| DOM behavior     | Add/remove single view          | Create one view per item |
| Lifecycle impact | Destroy & recreate              | Recreate unless `trackBy` |
| Change detection | Condition-based                 | Collection-based         |

---

### ❓ How do attribute directives work internally?

### 📝 Answer

Attribute directives modify an element's appearance or behavior — they don't change the DOM structure.

```ts
@Directive({ selector: "[appHighlight]" })
export class HighlightDirective {
  @Input("appHighlight") color!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, "backgroundColor", this.color);
  }
}
```

```html
<p appHighlight="yellow">Highlighted Text</p>
```

> 💡 **Use `Renderer2` over `ElementRef.nativeElement`** for safe, platform-independent DOM access (works in SSR, Web Workers).

---

### ❓ What are the new control flow blocks `@if`, `@for`, `@switch`?
### 📝 Answer

Angular 17+ introduced **built-in control flow** — replacing `*ngIf`, `*ngFor`, and `*ngSwitch` with cleaner syntax.

```html
<!-- New @if block -->
@if (user) {
  <p>Hello {{ user.name }}</p>
} @else if (loading) {
  <p>Loading...</p>
} @else {
  <p>Please log in</p>
}

<!-- New @for block (trackBy is required) -->
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items</li>
}

<!-- New @switch block -->
@switch (status) {
  @case ("loading") { <spinner /> }
  @case ("error")   { <error-msg /> }
  @default          { <content /> }
}
```

✅ **Advantages**

- No need to import `CommonModule`
- ~30-90% faster runtime than `*ngIf` / `*ngFor`
- Better type narrowing in templates
- Built-in `@empty` block for empty collections

---

# 📦 Part 5 — Modules & Standalone APIs

### ❓ How do Standalone Components differ from NgModules?

### 📝 Answer

| Feature              | NgModules                         | Standalone Components            |
| -------------------- | --------------------------------- | -------------------------------- |
| Boilerplate          | Module file + declarations array  | Just the component               |
| Imports              | At module level                   | At component level (per file)    |
| Lazy loading         | Module-based (`loadChildren`)     | Component-based (`loadComponent`) |
| Tree-shaking         | OK                                | ✅ Better                        |
| Default in new apps  | ❌ (since v17)                    | ✅                               |

**Standalone example:**

```ts
@Component({
  selector: "app-user",
  standalone: true,
  imports: [CommonModule, FormsModule, OtherComponent],
  template: `<input [(ngModel)]="name" />`,
})
export class UserComponent {
  name = "";
}
```

> 💡 **Recommendation (2024+)**: use standalone components by default. Use NgModules only for large legacy apps or when grouping is genuinely useful.

---

# 👁️ Part 6 — View & DOM Interaction

### ❓ How does `@ViewChild` work, and when would you use it over other approaches to access child elements?

### 📝 Answer

`@ViewChild` lets a component directly access something in its **own template** — a DOM element, child component, or directive.

> 💡 **Use it only when data binding isn't enough** and you need imperative control (focus, scroll, third-party library integration).

```ts
@Component({
  template: `
    <input #emailInput />
    <input #nameInput />
  `,
})
export class MyComponent {
  // static: true → available in ngOnInit (only if not inside @if/@for)
  @ViewChild("emailInput", { static: true })
  emailInput!: ElementRef<HTMLInputElement>;

  // static: false (default) → available in ngAfterViewInit
  @ViewChild("nameInput")
  nameInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.emailInput.nativeElement.focus();    // ✅ Works (static: true)
    // this.nameInput.nativeElement.focus();   // ❌ undefined
  }

  ngAfterViewInit() {
    this.nameInput.nativeElement.focus();     // ✅ Works
    this.emailInput.nativeElement.focus();    // ✅ Also works here
  }
}
```

> 📌 **Rule**:
>
> - `static: true` → resolved before change detection → use in `ngOnInit`
> - `static: false` → resolved after view init → use in `ngAfterViewInit`

---

### ❓ Why is direct DOM manipulation via `ElementRef` discouraged? Use `Renderer2` instead?

### 📝 Answer

**Problems with `el.nativeElement.style.color = "red"`:**

- ❌ Exposes app to XSS attacks
- ❌ Tightly coupled to browser DOM
- ❌ Breaks Server-Side Rendering (SSR)
- ❌ Doesn't work in Web Workers

**`Renderer2`** provides a **safe, platform-independent** abstraction.

```ts
@Directive({ selector: "[appHighlight]" })
export class HighlightDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, "color", "red");
    this.renderer.addClass(this.el.nativeElement, "active");
    this.renderer.listen(this.el.nativeElement, "click", () => { /* ... */ });
  }
}
```

> 💡 Renderer2 is an **abstraction layer** — Angular decides how/where DOM updates happen, keeping the app secure and platform-independent.

---

# 🔄 Part 7 — Pipes

### ❓ What are Angular pipes? Pure vs Impure?

### 📝 Answer

**Pipes** transform data in templates without changing the original value.

| Type        | When It Runs                                 | Performance |
| ----------- | -------------------------------------------- | ----------- |
| **Pure** (default) | Only when input **reference** changes | ✅ Fast     |
| **Impure**  | On **every** change detection cycle          | ⚠️ Slow     |

**Pure pipe example:**

```ts
@Pipe({ name: "double", pure: true })
export class DoublePipe implements PipeTransform {
  transform(value: number) {
    return value * 2;
  }
}
```

```html
{{ 5 | double }}    <!-- 10 -->
```

---

#### ↳ Follow-up: Why are pure pipes preferred?

### 📝 Answer

Pure pipes are **skipped unless Angular detects a reference change** — making them cheap and predictable.

```ts
numbers = [1, 2, 3];

// ❌ Pipe NOT triggered (mutation, not reference change)
this.numbers.push(4);

// ✅ Pipe IS triggered (new reference)
this.numbers = [...this.numbers, 4];
```

> 💡 Pure pipes work best with **immutable patterns** (spread, `Object.assign`, `Array.from`).

---

#### ↳ Follow-up: When would you use an impure pipe?

### 📝 Answer

Use impure pipes when data is **mutated directly** or depends on external values like time, locale, or storage.

```ts
@Pipe({ name: "now", pure: false })
export class NowPipe implements PipeTransform {
  transform() {
    return Date.now();
  }
}
```

> ⚠️ **Performance risk**: impure pipes execute on **every** change detection cycle, similar to `ngDoCheck`.

---

#### ↳ Follow-up: How do you create a custom pipe?

### 📝 Answer

```ts
@Pipe({ name: "capitalize", standalone: true })
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return "";
    return value[0].toUpperCase() + value.slice(1);
  }
}
```

```html
{{ 'angular' | capitalize }}    <!-- Angular -->
```

> 💡 By default, all custom pipes are **pure** unless explicitly marked `pure: false`.

---

#### ↳ Follow-up: Should pipes perform async operations or API calls?

### 📝 Answer

❌ **No.** Pipes must be **synchronous and side-effect free**.

For async logic:
- Handle in **services** with Observables
- Use the **`async` pipe** in templates

```html
{{ users$ | async }}
```

---

#### ↳ Follow-up: Is the `async` pipe pure or impure, and why is it safe?

### 📝 Answer

**`AsyncPipe` is impure** (`pure: false`) — it must react to Observable/Promise emissions that happen without reference changes.

```html
{{ users$ | async }}
```

```ts
users$ = this.userService.getUsers();   // Observable
```

**Why it must be impure:**

- The `users$` reference never changes
- The Observable emits values **over time**
- Angular has no other way to know when emissions happen

If `AsyncPipe` were pure → it would run only once → UI would never update.

✅ **Safety**: `async` pipe automatically subscribes AND unsubscribes on component destroy → **no memory leaks**.

---

# 🏗️ Part 8 — Dependency Injection (DI)

### ❓ How does Angular's DI system and hierarchy work?

### 📝 Answer

Providers can be registered:

- At **root level** with `providedIn: 'root'`
- At **module level** in `NgModule.providers`
- At **component level** in `@Component({ providers: [...] })`

The **injector tree mirrors the component/module tree**. A child injector falls back to parent injectors when resolving dependencies.

```text
Root Injector
   ↓
Module Injector (lazy module = own injector)
   ↓
Component Injector (one per component instance)
```

---

#### ↳ Follow-up: Difference between `providedIn: 'root'` vs `'any'` vs `'platform'`?

### 📝 Answer

| Scope        | Behavior                                                |
| ------------ | ------------------------------------------------------- |
| `'root'`     | **Single instance** shared across the entire app (eager + lazy modules) |
| `'any'`      | Eager modules share one instance; **each lazy module gets its own** |
| `'platform'` | Single instance shared across **multiple Angular apps** on the same page |
| `'self'`     | Provided only in the local component (no inheritance)    |

```ts
@Injectable({ providedIn: "root" })
export class UserService { /* ... */ }
```

---

#### ↳ Follow-up: Can you explain multi-providers in Angular and give a real-world scenario where you'd use one?

### 📝 Answer

A provider with `multi: true` tells Angular's DI to **collect all providers for a token into an array** instead of replacing them.

```ts
import { InjectionToken } from "@angular/core";

export const VALIDATORS = new InjectionToken<Validator[]>("validators");

// Register multiple validators with multi: true
providers: [
  { provide: VALIDATORS, useClass: EmailValidator,    multi: true },
  { provide: VALIDATORS, useClass: PasswordValidator, multi: true },
]

// Inject as array
constructor(@Inject(VALIDATORS) private validators: Validator[]) {
  console.log(this.validators);   // [EmailValidator, PasswordValidator]
}
```

> 💡 **Common use cases**: HTTP_INTERCEPTORS, ROUTES, NG_VALUE_ACCESSOR.

---

#### ↳ Follow-up: What are Injection Tokens, and why are they required?

### 📝 Answer

`InjectionToken` provides a **DI key for non-class dependencies** (config objects, primitives, interfaces).

You can't inject an interface directly because **interfaces don't exist at runtime** (they're erased after compilation).

```ts
import { InjectionToken } from "@angular/core";

export interface AppConfig {
  apiUrl: string;
  timeout: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>("APP_CONFIG");

// Provide
providers: [
  { provide: APP_CONFIG, useValue: { apiUrl: "https://api.com", timeout: 5000 } },
]

// Inject
constructor(@Inject(APP_CONFIG) private config: AppConfig) {}
```

---

#### ↳ Follow-up: If a service is provided in both root and a lazy-loaded module, how many instances exist?

### 📝 Answer

👉 **Two instances.**

Angular has **hierarchical DI**:

- `providedIn: 'root'` → one application-wide singleton
- A **lazy-loaded module** has its **own injector**
- If the same service is also provided in that lazy module → Angular creates **another instance** scoped to that module

❌ **Example: Two instances**

```ts
@Injectable({ providedIn: "root" })
export class LoggerService { id = Math.random(); }

@NgModule({
  providers: [LoggerService],          // ❌ creates a SECOND instance
})
export class LazyModule {}
```

✅ **Best Practice**: Don't provide root services in lazy modules.

```ts
@NgModule({
  // No providers array — uses the singleton from root
})
export class LazyModule {}
```

---

# 🚦 Part 9 — Routing

### ❓ What are the core concepts of Angular routing?

### 📝 Answer

- **Routes config** — array of route objects
- **`<router-outlet>`** — placeholder where matched component renders
- **`routerLink`** / **`routerLinkActive`** — navigation directives
- **Route guards** — control navigation
- **Lazy loading** — load modules/components on demand
- **Resolvers** — pre-fetch data before navigation
- **`ActivatedRoute`** — access current route info

```ts
const routes: Routes = [
  { path: "users",         component: UserListComponent },
  { path: "users/:id",     component: UserDetailsComponent },
  { path: "admin", canMatch: [adminGuard],
    loadComponent: () => import("./admin").then(m => m.AdminComponent) },
  { path: "",     redirectTo: "users", pathMatch: "full" },
  { path: "**",   component: NotFoundComponent },
];
```

---

#### ↳ Follow-up: What are route guards and what types exist?

### 📝 Answer

Guards control navigation by returning `boolean | UrlTree | Promise<...> | Observable<...>`.

| Guard           | Purpose                                       |
| --------------- | --------------------------------------------- |
| `CanActivate`   | Allow/deny entering a route                   |
| `CanDeactivate` | Allow/deny leaving a route (unsaved changes)  |
| `CanActivateChild` | Apply to all child routes                  |
| `Resolve`       | Pre-fetch data before route activates         |
| `CanMatch` (replaces `CanLoad`) | Decide if a route's config even matches |

---

#### ↳ Follow-up: Difference between `CanActivate`, `CanLoad`, and `CanMatch`?

### 📝 Answer

| Guard         | When It Runs                                | Effect on Lazy Module |
| ------------- | ------------------------------------------- | --------------------- |
| `CanActivate` | After module loads, before activation       | Module IS loaded      |
| `CanLoad` (deprecated) | Before lazy module loads          | Module NOT loaded     |
| `CanMatch` | Before the route is even considered a match | Module NOT loaded; allows alternate route to match |

> 💡 **`CanMatch`** is more powerful — if it returns false, the router moves on to try the **next route** in the config (great for role-based routing).

```ts
export const adminGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  return auth.isAdmin() ? true : inject(Router).parseUrl("/users");
};
```

---

#### ↳ Follow-up: How do you configure lazy-loaded modules or routes?

### 📝 Answer

**Module-based (older):**

```ts
{ path: "admin", loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule) }
```

**Standalone component (modern):**

```ts
{ path: "admin", loadComponent: () => import("./admin/admin.component").then(c => c.AdminComponent) }
```

Code is loaded **on demand** when user navigates to that route.

---

#### ↳ Follow-up: How do you access route parameters and query parameters?

### 📝 Answer

Using `ActivatedRoute`:

```ts
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  // Snapshot (one-time read)
  const id = this.route.snapshot.paramMap.get("id");

  // Observable (reacts to changes)
  this.route.paramMap.subscribe(params => {
    const id = params.get("id");
  });

  // Query params: ?search=foo
  this.route.queryParamMap.subscribe(params => {
    const search = params.get("search");
  });
}
```

> 💡 **Snapshot vs Observable**: Use snapshot when you don't expect the URL params to change while the component is alive. Use Observable when navigating between `/users/1` → `/users/2` reuses the same component instance.

---

# 📋 Part 10 — Angular Forms

### ❓ Differences between Template-driven and Reactive forms?

### 📝 Answer

| Feature             | Template-driven           | Reactive                    |
| ------------------- | ------------------------- | --------------------------- |
| Source of truth     | Template (HTML)           | Component class (TS)        |
| Setup               | `FormsModule` + `ngModel` | `ReactiveFormsModule` + `FormGroup` |
| Validation          | Directives in template    | Validators in component     |
| Async validation    | Awkward                   | First-class                 |
| Dynamic forms       | Hard                      | Easy                        |
| Testing             | Hard (DOM-dependent)      | Easy (pure TS)              |
| Best for            | Simple forms              | Complex/dynamic forms       |

**Reactive form example:**

```ts
form = new FormGroup({
  name:  new FormControl("", Validators.required),
  email: new FormControl("", [Validators.required, Validators.email]),
});

submit() {
  if (this.form.invalid) return;
  this.userService.save(this.form.value);
}
```

```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="name" />
  <input formControlName="email" />
  <button type="submit" [disabled]="form.invalid">Save</button>
</form>
```

---

### ❓ What happens when you mix `[(ngModel)]` with Reactive Forms?

### 📝 Answer

❌ **Don't do it.** It mixes paradigms and causes:
- Confusing data flow (two sources of truth)
- Unexpected validation behavior
- Difficult debugging

> 💡 **Stick to one approach** per form. Use Reactive for complex forms.

---

### ❓ How do you create a custom form control in Angular? (`ControlValueAccessor`)

### 📝 Answer

`ControlValueAccessor (CVA)` is the **bridge** between Angular's Forms API and your custom UI component.

**Without CVA**, Angular **cannot read from or write to** your custom component when used with `formControlName`.

#### What CVA must implement

| Method                         | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `writeValue(value)`            | Angular → Component (set value from form) |
| `registerOnChange(fn)`         | Component → Angular (notify value change) |
| `registerOnTouched(fn)`        | Component → Angular (mark as touched)     |
| `setDisabledState(isDisabled)` | Enable/disable control                    |

#### When to use CVA

When building **custom form components**: dropdowns, date pickers, toggles, OTP inputs, rich text editors, multi-selects.

#### 💻 Complete Example

**`custom-input.component.ts`**

```ts
@Component({
  selector: "app-custom-input",
  standalone: true,
  template: `
    <input
      [value]="value"
      [disabled]="isDisabled"
      (input)="onInput($event)"
      (blur)="onTouched()" />
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputComponent),
    multi: true,
  }],
})
export class CustomInputComponent implements ControlValueAccessor {
  value = "";
  isDisabled = false;

  private onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // Angular calls this when the form sets a value
  writeValue(value: any): void {
    this.value = value ?? "";
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }
}
```

**Usage:**

```html
<form [formGroup]="form">
  <app-custom-input formControlName="name"></app-custom-input>
</form>

<p>{{ form.value | json }}</p>
```

---

#### 🤔 Why each piece of the CVA boilerplate?

**1️⃣ Why `NG_VALUE_ACCESSOR`?**

When Angular sees `<app-custom-input formControlName="name">`, it asks:
> "Does this element know how to behave like a form control?"

It looks for a provider with the token `NG_VALUE_ACCESSOR`. If not found:
```text
Error: No value accessor for form control with name 'name'
```

**2️⃣ Why `useExisting`?**

Tells Angular to use **this component instance itself** as the value accessor — not a new instance, not some other class.

**3️⃣ Why `forwardRef()`?**

At the moment Angular processes `providers`, the class isn't fully defined yet:

```ts
useExisting: CustomInputComponent;          // ❌ class not ready yet
useExisting: forwardRef(() => CustomInputComponent);   // ✅ delayed
```

**4️⃣ Why `multi: true`? (CRITICAL)**

`NG_VALUE_ACCESSOR` is a **multi-provider token** — Angular expects an array of accessors (built-in `input`, `select`, `textarea`, plus your custom ones).

```ts
{
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomInputComponent),
  // ❌ multi missing → would OVERWRITE Angular's entire list
}
```

> 🚨 **Without `multi: true`** → you replace Angular's entire accessor list, breaking other form controls.

---

### ❓ How would you globally trim leading and trailing spaces from user input?

### 📝 Answer

**Approach 1: Sanitize in NgRx effect (if using NgRx):**

```ts
saveUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(saveUser),
    map(action => ({ ...action, user: trimStringsDeep(action.user) })),
    switchMap(action => this.userService.save(action.user)),
  )
);
```

**Approach 2: HTTP Interceptor (global, framework-agnostic):**

```ts
@Injectable()
export class TrimInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.body) {
      const sanitizedBody = trimStringsDeep(req.body);
      req = req.clone({ body: sanitizedBody });
    }
    return next.handle(req);
  }
}
```

```ts
providers: [
  { provide: HTTP_INTERCEPTORS, useClass: TrimInterceptor, multi: true },
]
```

> 💡 **Approach 3 (Modern)**: Use `inject(HTTP_INTERCEPTORS)` with functional interceptors via `provideHttpClient(withInterceptors([...]))`.

---

### ❓ What are Signals in Angular?
### 📝 Answer

**Signals** (Angular 16+) are a new reactivity primitive — values that **notify consumers** when they change.

```ts
import { signal, computed, effect } from "@angular/core";

@Component({
  template: `
    <p>Count: {{ count() }}</p>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  count = signal(0);

  // Derived value — auto-updates when count changes
  doubled = computed(() => this.count() * 2);

  constructor() {
    // Side effect — runs whenever any signal it reads changes
    effect(() => {
      console.log("Count changed to:", this.count());
    });
  }

  increment() {
    this.count.update(v => v + 1);
    // OR: this.count.set(this.count() + 1);
  }
}
```

✅ **Benefits over RxJS for state**

- Synchronous reads (no subscribe boilerplate)
- Fine-grained change detection (no full tree traversal)
- Better TypeScript inference
- Easier mental model for new developers

> 💡 **Signal vs RxJS**: signals are great for **state**. RxJS still wins for **streams of events** (HTTP, user input over time, WebSocket).

---
