# 🅰️ Angular Interview Prep — Part 2: Change Detection, Build System & Advanced Topics


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

### esbuild + Vite (Angular v17+ default: the "application" builder)

| Component | Role |
|-----------|------|
| **esbuild** | Compiles and bundles the app — for `ng build` (production) and for the dev server |
| **Vite** | Used **only as the dev server** (`ng serve`): serves the esbuild output and handles reloads |

> 💡 **Why it's faster:** esbuild is written in Go and is many times faster than Webpack, and the dev server only rebuilds what changed. Angular does **not** use Vite's Rollup-based production build.

---

### 📅 Angular Build Tooling Timeline

```
Angular 8   →  View Engine  +  Webpack
Angular 9   →  Ivy          +  Webpack
Angular 16  →  Ivy          +  esbuild builder (developer preview)
Angular 17+ →  Ivy          +  esbuild (build) + Vite (dev server) — default for new projects
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
| **JIT** (Just-In-Time) | Compiles templates in the browser at runtime | Rare today (some tests, dynamic templates) |
| **AOT** (Ahead-Of-Time) | Compiles templates during the build | **Default for dev and production since Angular 9** ✅ |

> 💡 AOT catches template errors at build time, ships no compiler to the browser and starts faster.

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
| Webpack vs esbuild/Vite? | esbuild builds much faster; Vite serves it in development. |
| Ivy vs View Engine? | Ivy is faster, smaller, and more flexible. |
| AOT vs JIT? | AOT compiles templates at build time — the default everywhere since v9. |
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

> 💡 **Use the [Angular Update Guide](https://angular.dev/update-guide)** — it generates an exact step-by-step migration checklist tailored to your `from → to` versions.

> 📌 **Pro tip:** Update **one major version at a time**, run all tests, fix any deprecation warnings, then update again.

---

### ❓ Name some deprecated/removed concepts from Angular 5 → 19.

### 📝 Answer

A migration cheat-sheet:

| 🗓 Era | What Changed |
|--------|--------------|
| Angular 4 | `Renderer` → **`Renderer2`** |
| Angular 4.3 → 8 | `Http` → **`HttpClient`** (old `Http` removed in v8) |
| Angular 6 | RxJS 6: chained operators → **pipeable operators** (`.pipe(map(), filter())`) |
| Angular 8 | Lazy loading: string `loadChildren: './x#XModule'` → `loadChildren: () => import('./x').then(m => m.XModule)` |
| Angular 9 | View Engine → **Ivy**; `entryComponents` no longer needed |
| Angular 11–12 | TSLint → **ESLint** |
| Angular 12 | **Strict mode** on by default for new projects |
| Angular 13 | IE11 support and differential loading removed |
| Angular 14–15 | **Standalone components** (preview in 14, stable in 15); **functional guards & interceptors** |
| Angular 16 | **Signals** introduced |
| Angular 17 | New control flow: `*ngIf` → `@if`, `*ngFor` → `@for`, `*ngSwitch` → `@switch`; `@defer`; esbuild + Vite by default |
| Angular 19 | Standalone is the default (`standalone: true` no longer needed) |
| Angular 20–21 | Zoneless change detection stable (v20), default for new apps (v21) |

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
| OnPush | Check the component only when an `@Input` reference changes, it handles an event, an `async` pipe/signal it reads updates, or `markForCheck()` is called |
| Ivy | Current compiler; locality + tree-shaking |
| AOT | Compile at build time (production) |
| JIT | Compile in the browser (rarely used now) |
| HMR | Update modules without page reload |
| `sessionStorage` | Refresh-safe, tab-scoped |
| API Gateway | Hide microservice topology, single entry |

---

> 🚀 **You've got this!** Master these internals and you'll handle any Angular architecture or performance question with confidence.
