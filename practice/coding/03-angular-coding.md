# 🅰️ Angular Coding Interview Prep — Mock Tasks & Patterns


---

# Part 1 — User Management Mini-App (CRUD)

### ❓ Build a small Angular application that manages users. It should load initial data from an API, allow CRUD operations, use forms, routing, dialogs, caching, and some custom Angular features. Explain your design decisions.

### 📝 Answer

This is a **classic senior-level mock**. Interviewers want to see you cover:

- ✅ Component / service separation
- ✅ State management with `BehaviorSubject` (no double-fetching)
- ✅ Reactive forms with validation
- ✅ Dialog with unsaved-changes guard
- ✅ Custom pipe + custom directive
- ✅ Lazy-loaded admin route with `CanMatch` guard

Let's go through the design step-by-step.

---

## 1️⃣ User Model

```ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}
```

> 💡 **Tip:** Always start with the data model. It anchors the whole solution.

---

## 2️⃣ Data Service — API + Caching + State Retention

> 👉 **Key interview concept:** _"No refetch when navigating back"_

```ts
@Injectable({ providedIn: "root" })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  readonly users$ = this.usersSubject.asObservable();   // 🔒 Read-only stream

  private apiLoaded = false;                            // 🚦 Cache flag

  constructor(private http: HttpClient) {}

  loadUsers() {
    if (this.apiLoaded) return;                         // ✅ Skip if already loaded

    this.http
      .get<User[]>("https://jsonplaceholder.typicode.com/users")
      .subscribe((users) => {
        this.usersSubject.next(users);
        this.apiLoaded = true;
      });
  }

  addUser(user: User) {
    this.usersSubject.next([...this.usersSubject.value, user]);
  }

  updateUser(updated: User) {
    const users = this.usersSubject.value.map((u) =>
      u.id === updated.id ? updated : u,
    );
    this.usersSubject.next(users);
  }

  deleteUser(id: number) {
    this.usersSubject.next(this.usersSubject.value.filter((u) => u.id !== id));
  }

  getUserById(id: number): User | undefined {
    return this.usersSubject.value.find((u) => u.id === id);
  }
}
```

### 🧠 What to explain to the interviewer

| Decision | Why |
|----------|-----|
| `BehaviorSubject` | Stores the latest list; new subscribers get the current state immediately |
| `asObservable()` exposed | Prevents components from calling `.next()` and bypassing the service |
| `apiLoaded` flag | Avoids re-fetching when user navigates back to the list |
| `providedIn: 'root'` | Singleton across the app — state survives route changes |
| Optimistic updates (CUD) | Instant UI response; ideally rolled back on API failure |

> 📌 **Senior signal:** Explicitly call out **"the service is a singleton, so state survives navigation"** — interviewers love to hear this.

---

## 3️⃣ User List Component (Table + Routing)

```ts
@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
})
export class UserListComponent implements OnInit {
  users$ = this.userService.users$;

  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.userService.loadUsers();
  }

  trackById(_: number, user: User) {
    return user.id;                       // ✅ Stable identity = no re-render
  }

  goToDetails(user: User) {
    this.router.navigate(["/users", user.id]);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
  }

  editUser(user: User) {
    this.dialog.open(UserDialogComponent, {
      data: user,
    });
  }
}
```

**user-list.component.html**

```html
<div class="container">
  <h2>Users</h2>

  <button mat-raised-button color="primary" routerLink="/add">Add User</button>

  <table mat-table [dataSource]="users$ | async" class="mat-elevation-z8">
    <!-- ID -->
    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef>ID</th>
      <td mat-cell *matCellDef="let user">{{ user.id }}</td>
    </ng-container>

    <!-- Name -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef>Name</th>
      <td mat-cell *matCellDef="let user">{{ user.name }}</td>
    </ng-container>

    <!-- Email -->
    <ng-container matColumnDef="email">
      <th mat-header-cell *matHeaderCellDef>Email</th>
      <td mat-cell *matCellDef="let user">{{ user.email }}</td>
    </ng-container>

    <!-- Actions -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Actions</th>
      <td mat-cell *matCellDef="let user">
        <button mat-button (click)="goToDetails(user)">View</button>
        <button mat-button color="accent" (click)="editUser(user)">Edit</button>
        <button mat-button color="warn" (click)="deleteUser(user.id)">
          Delete
        </button>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="['id','name','email','actions']"></tr>
    <tr
      mat-row
      *matRowDef="let row; columns: ['id','name','email','actions']; trackBy: trackById"
    ></tr>
  </table>
</div>
```

> 💡 **Two perf wins on display here:**
> 1. **`async` pipe** → auto-subscribe + auto-unsubscribe (no memory leak)
> 2. **`trackBy: trackById`** → only re-render rows whose data actually changed

---

## 4️⃣ Reactive Form Component (Add User)

```ts
@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
})
export class UserFormComponent {
  form = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  submit() {
    if (this.form.invalid) {
      this.snackBar.open("Invalid form", "Close", { duration: 2000 });
      return;
    }

    this.userService.addUser({
      id: Date.now(),                     // ⚠️ For demo only — backend should assign ID
      ...this.form.value,
    } as User);

    this.snackBar.open("User added", "Close", { duration: 2000 });
    this.form.reset();
  }
}
```

**user-form.component.html**

```html
<div class="container">
  <h2>Add User</h2>

  <form [formGroup]="form" (ngSubmit)="submit()">
    <mat-form-field appearance="outline">
      <mat-label>Name</mat-label>
      <input matInput formControlName="name" />
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Email</mat-label>
      <input matInput formControlName="email" appInvalidHighlight />
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Phone</mat-label>
      <input matInput formControlName="phone" />
    </mat-form-field>

    <button mat-raised-button color="primary" type="submit">Save</button>
  </form>
</div>
```

> ⚠️ **Why Reactive Forms over Template-driven?**
> Reactive forms give you a typed, programmatic API — perfect for senior code with complex validation, dynamic controls, and unit tests.

---

## 5️⃣ Dialog Component (Edit User + Unsaved Changes Guard)

```ts
@Component({
  selector: "app-user-dialog",
  templateUrl: "./user-dialog.component.html",
})
export class UserDialogComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      name: [user.name, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone, Validators.required],
    });
  }

  save() {
    this.userService.updateUser({
      ...this.user,
      ...this.form.value,
    });
    this.dialogRef.close();
  }

  close() {
    if (this.form.dirty) {                          // ✅ Only prompt if changed
      if (!confirm("Discard changes?")) return;
    }
    this.dialogRef.close();
  }
}
```

**user-dialog.component.html**

```html
<h2 mat-dialog-title>Edit User</h2>

<form [formGroup]="form" mat-dialog-content>
  <mat-form-field appearance="outline">
    <mat-label>Name</mat-label>
    <input matInput formControlName="name" />
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Email</mat-label>
    <input matInput formControlName="email" />
  </mat-form-field>

  <mat-form-field appearance="outline">
    <mat-label>Phone</mat-label>
    <input matInput formControlName="phone" />
  </mat-form-field>
</form>

<mat-dialog-actions align="end">
  <button mat-button (click)="close()">Cancel</button>
  <button mat-raised-button color="primary" (click)="save()">Save</button>
</mat-dialog-actions>
```

> 💡 **`form.dirty`** is a built-in flag that flips to `true` the first time the user changes any field — perfect for unsaved-changes detection.

---

## 6️⃣ Details Page (No Extra API Call)

```ts
@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
})
export class UserDetailsComponent implements OnInit {
  user?: User;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.user = this.userService.getUserById(id);   // 📦 Read from cache
  }
}
```

**user-details.component.html**

```html
<div class="container" *ngIf="user">
  <h2>User Details</h2>

  <p><strong>ID:</strong> {{ user.id }}</p>
  <p><strong>Name:</strong> {{ user.name }}</p>
  <p><strong>Email:</strong> {{ user.email }}</p>
  <p><strong>Phone:</strong> {{ user.phone | phonePostal }}</p>

  <button mat-button routerLink="/users">Back</button>
</div>
```

**app.component.html**

```html
<mat-toolbar color="primary">
  <span>User Management</span>
</mat-toolbar>

<router-outlet></router-outlet>
```

> 📌 **Why `getUserById` instead of `users$ | async`?** This page only needs a snapshot, not a live stream. It's faster and simpler.

---

## 7️⃣ Custom Pipe (Phone Formatter)

```ts
@Pipe({ name: "phonePostal" })
export class PhonePostalPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return "";
    return `+91 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
  }
}
```

> 💡 **Pure pipes are memoized** — Angular only re-runs `transform` when the input reference changes.

---

## 8️⃣ Custom Directive (Invalid Highlight)

```ts
@Directive({
  selector: "[appInvalidHighlight]",
})
export class InvalidHighlightDirective {
  @HostBinding("style.border")
  get border() {
    return "1px solid red";
  }
}
```

Usage:

```html
<input formControlName="email" appInvalidHighlight />
```

> 🔧 **Better version:** Inject `NgControl` and only highlight when the control is `invalid && touched`. Mention this enhancement to the interviewer to score bonus points.

---

## 9️⃣ Routing Module

```ts
const routes: Routes = [
  { path: "users", component: UserListComponent },
  { path: "users/:id", component: UserDetailsComponent },
  { path: "add", component: UserFormComponent },

  {
    path: "admin",
    canMatch: [AdminCanMatchGuard],                  // ✅ Modern guard
    loadComponent: () =>
      import("./admin/admin.component").then((c) => c.AdminComponent),
  },

  { path: "", redirectTo: "users", pathMatch: "full" },
];
```

> 💡 **`canMatch` vs `canActivate`:** `canMatch` is checked **before** the route is even matched. If it returns false, Angular pretends the route doesn't exist — **the lazy chunk is never downloaded**. That's a perf + security win over the old `canLoad` and `canActivate`.

---

## 🔟 Auth Model & Service

```ts
// auth.model.ts
export type Role = "ADMIN" | "USER";
```

```ts
// auth.service.ts
@Injectable({ providedIn: "root" })
export class AuthService {
  private role: Role = "USER";   // change to ADMIN to allow access

  isAdmin(): boolean {
    return this.role === "ADMIN";
  }

  getRole(): Role {
    return this.role;
  }
}
```

---

## 1️⃣1️⃣ `CanMatch` Guard

```ts
// admin-can-match.guard.ts
@Injectable({ providedIn: "root" })
export class AdminCanMatchGuard implements CanMatch {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canMatch(): boolean | UrlTree {
    if (this.auth.isAdmin()) {
      return true;
    }
    return this.router.parseUrl("/users");          // 🔁 Redirect non-admins
  }
}
```

| Benefit | Why |
|---------|-----|
| ✅ Prevents lazy chunk loading | Code never downloads for non-admins |
| ✅ Redirects unauthorized users | Better UX than just blocking |
| ✅ Synchronous decision | Fast — no UI flicker |

> ⚠️ **Reminder:** Guards are **only for UX**. The backend must independently enforce admin access on every API call.

---

## 1️⃣2️⃣ Lazy-loaded Admin Component

```ts
// admin.component.ts
@Component({
  selector: "app-admin",
  standalone: true,
  template: `
    <div class="container">
      <h2>Admin Panel</h2>
      <p>Only admins can access this page.</p>
    </div>
  `,
})
export class AdminComponent {}
```

---

## ✅ Design Decisions Summary

| Decision | Reasoning |
|----------|-----------|
| `BehaviorSubject` in service | Single source of truth; instant access on subscribe |
| `apiLoaded` cache flag | Prevents re-fetch on back navigation |
| Dialog for edit (no separate route) | Faster UX for inline editing |
| Reactive forms | Programmatic, typed, testable |
| `CanMatch` guard | Prevents lazy chunk download for unauthorized users |
| Custom pipe + directive | Demonstrates extensibility knowledge |
| `trackBy` in `*ngFor` | Performance — avoid DOM re-renders |

---

# Part 2 — Search Autocomplete with Caching

### ❓ You are building a search autocomplete. You must debounce user input, avoid multiple API calls, cache results for 5 minutes, and cancel stale requests. How would you design this in Angular using RxJS?

### 📝 Answer

This is a **multi-concept question** — interviewers want to see all four in your code:

| Requirement | RxJS Tool |
|-------------|-----------|
| Debounce user input | `debounceTime(300)` |
| Avoid duplicate searches | `distinctUntilChanged()` |
| Cancel stale requests | `switchMap()` |
| Cache for 5 minutes | TTL-based in-memory cache |

---

## ✅ Full Implementation

```ts
import "zone.js";
import { Component, OnInit, inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { HttpClient, provideHttpClient } from "@angular/common/http";
import { Subject, of } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  tap,
} from "rxjs/operators";

interface User {
  id: number;
  name: string;
}

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <input type="text" placeholder="Search user" (input)="onInput($event)" />

    @if (filteredUsers.length) {
      <ul>
        @for (user of filteredUsers; track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
    }
  `,
})
export class App implements OnInit {
  private http = inject(HttpClient);

  private readonly CACHE_TTL = 5 * 60 * 1000;       // 5 minutes

  private cache: {
    users: User[] | null;
    timestamp: number;
  } = {
    users: null,
    timestamp: 0,
  };

  filteredUsers: User[] = [];
  search$ = new Subject<string>();

  ngOnInit() {
    this.initSearchStream();
  }

  private initSearchStream() {
    this.search$
      .pipe(
        debounceTime(300),                          // 1️⃣ Wait for 300ms pause
        distinctUntilChanged(),                     // 2️⃣ Skip if same as last
        switchMap((value) => this.searchUsers$(value)), // 3️⃣ Cancel stale
      )
      .subscribe((users) => {
        this.filteredUsers = users;
      });
  }

  private searchUsers$(value: string) {
    const search = value.trim().toLowerCase();

    // 1️⃣ Empty input → hide list
    if (!search) {
      return of([] as User[]);
    }

    // 2️⃣ Use cache if valid (within 5-min TTL)
    if (this.isCacheValid()) {
      return of(this.filterUsers(this.cache.users!, search));
    }

    // 3️⃣ Fetch, cache with TTL, then filter
    return this.http
      .get<User[]>("https://jsonplaceholder.typicode.com/users")
      .pipe(
        tap((users) => {
          this.cache = {
            users,
            timestamp: Date.now(),
          };
        }),
        map((users) => this.filterUsers(users, search)),
      );
  }

  private isCacheValid(): boolean {
    return (
      !!this.cache.users && Date.now() - this.cache.timestamp < this.CACHE_TTL
    );
  }

  private filterUsers(users: User[], search: string): User[] {
    return users.filter((u) => u.name.toLowerCase().includes(search));
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search$.next(value);
  }
}

bootstrapApplication(App, {
  providers: [provideHttpClient()],
});
```

---

## 🧠 Operator-by-Operator Explanation

| Operator | What it does | Why we need it |
|----------|--------------|----------------|
| `debounceTime(300)` | Waits 300ms after the last keystroke | Avoids firing on every key press |
| `distinctUntilChanged()` | Skips emissions equal to the previous one | User typing/deleting same letter = no duplicate work |
| `switchMap()` | Cancels the previous inner Observable | The user typed more — old API result is stale |
| `tap()` | Side effect (cache write) without changing the stream | Keeps cache logic out of `map` |
| `map()` | Transforms response into filtered list | Final shape for the UI |

---

## ⚠️ Common Pitfall — `mergeMap` vs `switchMap`

If you used `mergeMap` here, all in-flight requests resolve and **race condition city**: the slowest request might complete *last* and overwrite your fresh result. Use `switchMap` for autocomplete — period.

---

## 🎁 Bonus Improvements to Mention

- **`shareReplay(1)`** the HTTP call so multiple components share one fetch
- **Server-side filter** — pass `?q=value` to the API instead of fetching all users
- **Loading indicator** — toggle a `loading` flag in `tap`/`finalize`
- **Error handling** — `catchError(() => of([]))` to keep the stream alive on failures
- **`takeUntilDestroyed()`** — modern auto-unsubscribe (Angular 16+)

---

# Part 3 — Modern Signal-based Autocomplete

### ❓ Rebuild the autocomplete using Angular Signals + RxJS interop. How does it differ from the classic approach?

### 📝 Answer

In Angular 16+, you can mix **Signals** (for state) with **RxJS** (for stream operators) using `toObservable()` and `toSignal()`.

```ts
import { Component, signal, inject, computed } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { HttpClient } from "@angular/common/http";
import { debounceTime, distinctUntilChanged, switchMap, of, tap, map } from "rxjs";

interface User { id: number; name: string; }

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <input type="text" placeholder="Search user" 
           [value]="query()" 
           (input)="query.set($any($event.target).value)" />

    @if (results().length) {
      <ul>
        @for (user of results(); track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
    }
  `,
})
export class App {
  private http = inject(HttpClient);

  // 🟢 State as a signal
  readonly query = signal('');

  private readonly CACHE_TTL = 5 * 60 * 1000;
  private cache: { users: User[] | null; timestamp: number } = { users: null, timestamp: 0 };

  // 🔄 Bridge signal → observable for RxJS pipeline
  private readonly results$ = toObservable(this.query).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value) => this.search(value))
  );

  // 🔄 Bridge observable → signal for template binding
  readonly results = toSignal(this.results$, { initialValue: [] as User[] });

  private search(value: string) {
    const search = value.trim().toLowerCase();
    if (!search) return of([] as User[]);

    if (this.isCacheValid()) {
      return of(this.filter(this.cache.users!, search));
    }

    return this.http
      .get<User[]>("https://jsonplaceholder.typicode.com/users")
      .pipe(
        tap(users => { this.cache = { users, timestamp: Date.now() }; }),
        map(users => this.filter(users, search))
      );
  }

  private isCacheValid() {
    return !!this.cache.users && Date.now() - this.cache.timestamp < this.CACHE_TTL;
  }

  private filter(users: User[], q: string) {
    return users.filter(u => u.name.toLowerCase().includes(q));
  }
}
```

---

## 🆚 Classic vs Signal-based — What Changed?

| Aspect | Classic (Subject-based) | Signal-based |
|--------|--------------------------|-----------------|
| State holder | `Subject<string>` | `signal<string>('')` |
| Subscribe | Manual `.subscribe()` | `toSignal()` (auto cleanup) |
| Template binding | `(input)="search$.next(...)"` | Two-way: `[value]="query()"` + `query.set(...)` |
| Cleanup | Manual `takeUntil` | Automatic via `toSignal` |
| Ergonomics | Verbose | Cleaner — fewer moving parts |
| Mental model | "Push values into a stream" | "Reactively derive values" |

> 💡 **Best of both worlds:** Use Signals for **state**, RxJS for **stream operators** (`debounceTime`, `switchMap`, etc.) that Signals don't yet provide. Bridge with `toObservable` / `toSignal`.

---

## 🎁 Bonus: Why this matters in interviews

Showing the Signal-based version demonstrates that you:
- ✅ Know about Angular 16+ reactivity primitives
- ✅ Understand interop with existing RxJS code
- ✅ Can pick the right tool for each job (state vs stream)
- ✅ Stay current with the framework

---

## 🎓 Final Cheat Sheet

| Pattern | Quick Recall |
|---------|--------------|
| `BehaviorSubject` + `asObservable()` | State store with read-only stream |
| `apiLoaded` flag | Avoid re-fetch on back nav |
| `async` pipe + `trackBy` | Auto-unsubscribe + perf |
| `form.dirty` | Track unsaved changes |
| `CanMatch` guard | Prevent lazy chunk download |
| `debounce → distinct → switchMap` | Autocomplete trinity |
| `toSignal` / `toObservable` | Modern RxJS ↔ Signals bridge |

---

> 🚀 **You've got the patterns.** Now in your live coding round, narrate as you go: "First I'll set up the model… then a service with caching… now the form with reactive validation…" — interviewers love narration.
