# 🅰️ Angular Interview Prep — Part 2: Change Detection, Build System & Advanced Topics


---

# Part 1 — Change Detection & Zones

### ❓ How does Angular's change detection mechanism work, and how did it evolve from AngularJS?

### 📝 Answer

Angular's change detection is the process by which the framework figures out **what changed in your data** and **updates the DOM accordingly**. The mechanism has evolved significantly — from AngularJS's "dirty checking with digest cycles" to today's **Zone-based detection** and the newer **Signal-based reactivity**.

---

#### 🔹 Current Default Strategy (Zone-based)

The Angular runtime uses **zone.js** — a library that monkey-patches all asynchronous browser APIs.

**What zone.js observes:**

| Async Source | Examples |
|--------------|----------|
| DOM Events | `click`, `input`, `submit` |
| Timers | `setTimeout`, `setInterval` |
| Promises | `.then()`, `async/await` |
| HTTP | `XMLHttpRequest`, `fetch` (when configured) |
| WebSocket | `onmessage`, `onopen` |

**The flow looks like this:**

```
User clicks button
   ↓
zone.js intercepts the event
   ↓
NgZone is notified — "Something async happened, run CD"
   ↓
Angular starts from the root component
   ↓
Traverses the entire component tree (top → down)
   ↓
Compares current binding values vs previous
   ↓
Updates only the bindings that changed
   ↓
DOM reflects the changes
```

> 💡 **Mental model:** Zone.js is like a tap on Angular's shoulder saying _"hey, something might have changed."_ Angular then verifies by walking the tree.

---

#### ⚠️ What Angular Does **NOT** Auto-Track

Pure mutations to objects/arrays do **not** trigger change detection by themselves — they only get picked up because they happen *inside* a tracked async event:

```ts
this.items.push('C');                  // Mutation alone — invisible
this.count++;                          // Mutation alone — invisible
this.user.name = 'David';              // Mutation alone — invisible
this.items = [...this.items, 'C'];     // Spread — still invisible alone
```

> 📌 **Rule of thumb:** Mutations that happen *inside* a click handler, HTTP callback, or `setTimeout` are seen — because the **wrapper** is tracked, not the mutation itself.

> ⚠️ **Common myth:** Spread operator triggers change detection. **Wrong.** It only helps `OnPush` strategy detect a *new reference*, but it doesn't run CD on its own.

---

#### 🚀 Signals (Angular 16+) — The New Reactivity Model

Signals fundamentally change *how* Angular knows what to update.

| Aspect | Zone-based CD | Signal-based |
|--------|---------------|--------------|
| Trigger | Any async event | Specific signal mutation |
| Scope | Whole tree traversed | Only affected nodes |
| Performance | Coarse-grained | Fine-grained |
| Tooling | zone.js | Built-in primitives |

**How signals avoid full traversal:**

1. When you create a `signal()`, Angular registers it.
2. When that signal is read in a template (or in `computed`/`effect`), Angular records the dependency — building a **dependency graph**.
3. When the signal mutates, Angular knows **exactly which nodes** to refresh — and skips the rest.

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

count.set(5);   // ✅ Only doubled() and templates that read count() refresh
```

> 💡 **Future direction:** Angular is moving toward "zoneless" apps where Signals replace zone.js entirely (`provideExperimentalZonelessChangeDetection`).

---

#### ✅ Key Takeaway

- **Zone.js → tells Angular *when* to check.**
- **Signals → tell Angular *what* to update.**
- Default Zone strategy is reliable but coarse; Signals are surgical and faster.

---

# Part 2 — The Angular Build System

### ❓ Explain Angular's building tools and how they have evolved.

### 📝 Answer

Modern Angular's build pipeline is a coordinated effort of **5 things** working together:

> **🧩 Bundler + Dev Server + Compiler + Change Detection + Reload Strategy**

Together they decide how your app is **built, served, updated, and rendered** — both in development and production.

---

## 🔹 Bundlers & Dev Servers

### Webpack (Pre-v17 Angular default)

| Component | Role |
|-----------|------|
| Webpack Bundler | Takes JS/TS/CSS/assets → produces optimized bundles |
| Webpack Dev Server | Local server that reloads/updates the browser |

> 📌 Used by Angular versions before v17.

---

### Vite (Angular v17+ default)

| Component | Role |
|-----------|------|
| Vite Dev Server | Uses **native ES modules** — boots instantly with no upfront bundling |
| Vite Build Tool | Uses **esbuild** for fast dev transforms; **Rollup** for production builds |

> 💡 **Why Vite is faster:** It serves ES modules directly to the browser during development, so there's no big bundle to compile up front. The browser fetches modules as needed.

---

### 📅 Angular Build Tooling Timeline

```
Angular 8   →  View Engine  +  Webpack
Angular 9   →  Ivy          +  Webpack
Angular 16  →  Ivy          +  esbuild (partial)
Angular 17+ →  Ivy          +  Vite + esbuild
Angular 19  →  Ivy          +  Vite + esbuild + Rollup
```

---

# Part 3 — Compilers: Ivy, View Engine, AOT & JIT

### Rendering Engines

| Engine | Status | Used In |
|--------|--------|---------|
| **View Engine** | ❌ Old | Pre-Angular 9 |
| **Ivy** | ✅ Current | Angular 9 → present |

### Compilation Modes

| Mode | When | Use Case |
|------|------|----------|
| **JIT** (Just-In-Time) | Compiles in the browser at runtime | Development |
| **AOT** (Ahead-Of-Time) | Compiles during build | Production ✅ |

---

### 🆚 View Engine vs Ivy

| Feature | View Engine | Ivy |
|---------|-------------|-----|
| AOT support | ✅ | ✅ |
| JIT support | ✅ | ✅ |
| Tree-shaking | ❌ Poor | ✅ Excellent |
| Build speed | ❌ Slower | ✅ Faster |
| Bundle size | ❌ Larger | ✅ Smaller |
| Debugging | ❌ Harder | ✅ Easier (locality of code) |
| Future features | ❌ None planned | ✅ Standalone, Signals, etc. |

> 💡 **Why Ivy matters:** Ivy's "locality" principle means each component compiles independently — enabling better tree-shaking, faster incremental builds, and standalone components.

---

# Part 4 — HMR & Dev Server Internals

### ❓ Can you walk me through how HMR works and how Angular integrates it into the dev server?

### 📝 Answer

**HMR** updates code in the browser **without a full page reload** — preserving app state like form inputs, scroll position, and component state.

| Tool | HMR Support |
|------|-------------|
| Webpack Dev Server | ✅ Yes |
| Vite Dev Server | ✅ Yes (much faster) |

---

### 🔄 What happens when you save a file?

#### Webpack

1. Rebuilds the dependency graph
2. Creates a new bundle/chunk
3. Pushes updates via WebSocket to the browser
4. Browser swaps the affected module

#### Vite

1. The file is already an ES module
2. Vite sends only that single module
3. Browser updates instantly — **no rebundling**

> 📌 That's why Vite feels near-instant during development, especially in large apps.

---

#### ↳ Follow-up: How do the Compiler and Bundler work together?

### 📝 Answer

There are **two distinct phases**:

#### 🥇 Phase 1 — Ivy Compiler runs first

- Compiles templates → render functions
- Removes Angular decorators (`@Component`, `@Injectable`, etc.)
- Generates Angular instructions (`ɵɵelementStart`, `ɵɵproperty`, etc.)
- **Output:** pure JavaScript

#### 🥈 Phase 2 — esbuild/Rollup runs next

- Bundles the JS with other modules
- Removes unused code (tree-shaking)
- Splits chunks for lazy loading
- Optimizes imports and minifies

```
Source (.ts + .html) ──► Ivy Compiler ──► Pure JS ──► esbuild ──► Final bundles
```

> 📌 **Important:** Ivy understands Angular and templates; esbuild does **not** understand decorators. By the time esbuild runs, the HTML/decorators are gone — replaced by pure JS instructions.

---

### 🎯 Quick Interview Lightning Round

| ❓ Question | 💬 30-Second Answer |
|------------|---------------------|
| Webpack vs Vite? | Vite is faster — it doesn't bundle everything upfront. |
| Ivy vs View Engine? | Ivy is faster, smaller, and more flexible. |
| AOT vs JIT? | AOT for production, JIT for development. |
| Dirty checking? | Angular checks bindings on every change detection cycle. |
| HMR? | Updates modules without reloading the page. |

---

# Part 5 — Form State Persistence

### ❓ How do you preserve form data on refresh but clear it on browser close?

### 📝 Answer

Use **`sessionStorage`** — perfect for this exact behavior.

```ts
// On every form value change
this.form.valueChanges.subscribe(value => {
  sessionStorage.setItem("formData", JSON.stringify(value));
});

// On component init
ngOnInit() {
  const saved = sessionStorage.getItem("formData");
  if (saved) {
    this.form.patchValue(JSON.parse(saved));
  }
}
```

#### 📊 Storage Comparison

| Feature | `sessionStorage` | `localStorage` | `cookies` |
|---------|------------------|----------------|-----------|
| Survives refresh | ✅ | ✅ | ✅ |
| Cleared on tab close | ✅ | ❌ | Configurable |
| Sent with HTTP requests | ❌ | ❌ | ✅ |
| Size limit | ~5MB | ~5MB | ~4KB |

> 💡 **Pro tip:** Always wrap `JSON.parse` in a `try/catch` — corrupt session data shouldn't crash your form.

---

#### ↳ Follow-up: How do you preserve form data on refresh based on user role?

### 📝 Answer

The pattern is: **decode JWT → check role → restore or clear**.

```ts
ngOnInit() {
  const user = this.decodeJwt(this.authService.getToken());

  if (user.role === "developer") {
    // Restore form data
    const saved = sessionStorage.getItem("formData");
    if (saved) this.form.patchValue(JSON.parse(saved));
  } else {
    // Clear it for everyone else
    sessionStorage.removeItem("formData");
  }
}
```

> ⚠️ **Security note:** Never trust the JWT payload for **authorization** decisions on the server. This pattern is fine for *UX*, but the API must independently verify role-based permissions.

---

# Part 6 — Architecture & API Concerns

### ❓ How do you hide backend endpoints from the browser's Network tab?

### 📝 Answer

**🚫 You can't hide them — and that's a fundamental constraint.**

The browser **must** know the endpoint to call it. Anyone with DevTools can see every request URL, header, and payload. There's no way around this.

But what you **can** do is make endpoints look uniform and avoid leaking your **microservice topology**:

#### ✅ Solution: API Gateway

| ❌ Without Gateway (leaks topology) | ✅ With Gateway (clean & uniform) |
|---|---|
| `/user-service/users` | `/api/users` |
| `/order-service/orders` | `/api/orders` |
| `/payment-service/checkout` | `/api/checkout` |

```
Angular ──► /api/users ──► API Gateway ──► User Microservice
                                       ──► Order Microservice
                                       ──► Payment Microservice
```

#### Benefits

- Single entry point for the frontend
- Microservice URLs/ports stay internal
- Centralized auth, rate limiting, logging
- Easier to refactor backend without touching the frontend

> 💡 **Related pattern:** A **Backend-for-Frontend (BFF)** goes one step further — it tailors responses for each client (web/mobile/IoT), aggregating multiple microservices into one optimized payload. (See `09-Web_Architecture.md` for the full deep-dive.)

---

# Part 7 — Version Migration & Deprecated Concepts

### ❓ Can we jump from Angular 5 → Angular 19 directly?

### 📝 Answer

**🚫 Not recommended — and almost guaranteed to break things.**

Each major Angular version has breaking changes — especially around RxJS pipeable operators, lazy loading syntax, Ivy migration, and standalone components. Skipping versions means you skip the migration schematics that auto-fix these.

#### ✅ The Official Path

```
5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16 → 17 → 18 → 19
```

Use the official tool at every hop:

```bash
ng update @angular/core@N @angular/cli@N
```

Where `N` is the next major version number.

> 💡 **Use the [Angular Update Guide](https://update.angular.io/)** — it generates an exact step-by-step migration checklist tailored to your `from → to` versions.

> 📌 **Pro tip:** Update **one major version at a time**, run all tests, fix any deprecation warnings, then update again.

---

### ❓ Name some deprecated/removed concepts from Angular 5 → 19.

### 📝 Answer

Here's a concise migration cheat-sheet:

| 🗓 Era | What Changed |
|--------|--------------|
| Angular 9 | View Engine → **Ivy** |
| Angular 9+ | `Http` → **`HttpClient`** |
| Angular 4+ | `Renderer` → **`Renderer2`** |
| Angular 9 | `entryComponents` removed (Ivy doesn't need them) |
| Angular 14+ | NgModules → **Standalone components** |
| Angular 17+ | Webpack → **Vite + esbuild** |
| Angular 11+ | TSLint → **ESLint** |
| Angular 12+ | **Strict mode** enabled by default |
| Angular 13 | Differential loading removed |
| Angular 6+ | RxJS chained operators → **pipeable operators** (`.pipe(map(), filter())`) |
| Angular 15+ | Lazy loading syntax: `loadChildren: () => import('./...').then(m => m.X)` |
| Angular 16+ | **Signals** introduced |
| Angular 17+ | New control flow: `*ngIf` → `@if`, `*ngFor` → `@for`, `*ngSwitch` → `@switch` |
| Angular 18+ | **Functional HTTP interceptors** preferred over class-based |

#### 🥇 Biggest practical impacts when upgrading

- **RxJS pipeable operators** — old `.map().filter()` chains break
- **Lazy loading syntax** — string-based `loadChildren` is gone
- **Standalone components** — modules become optional
- **Strict TypeScript checks** — `null`/`undefined` handling tightens
- **Zone optimizations & Signals** (Angular 16+)

> 💡 **Run `ng update` between every major version** — Angular ships *schematics* that automatically rewrite your code to the new patterns. They're free upgrades you should never skip.

---

## 🎓 Final Cheat Sheet

| Concept | Quick Recall |
|---------|--------------|
| Zone.js | Tells Angular *when* to run CD |
| Signals | Tell Angular *what* to update (granular) |
| OnPush | Skip CD unless `@Input` reference changes |
| Ivy | Current compiler; locality + tree-shaking |
| AOT | Compile at build time (production) |
| JIT | Compile in browser (dev only) |
| HMR | Update modules without page reload |
| `sessionStorage` | Refresh-safe, tab-scoped |
| API Gateway | Hide microservice topology, single entry |

---

> 🚀 **You've got this!** Master these internals and you'll handle any Angular architecture or performance question with confidence.
