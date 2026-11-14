# Angular — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Standalone component with signals and OnPush
```ts
@Component({
  selector: 'app-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button (click)="inc()">{{ count() }} (double: {{ double() }})</button>`,
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);
  inc() { this.count.update(c => c + 1); }
}
```

### 2. Service with HttpClient
```ts
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  getUsers() { return this.http.get<User[]>('/api/users'); }
}
```

### 3. Type-ahead search
```ts
results$ = this.searchCtrl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  filter(q => q.length > 1),
  switchMap(q => this.api.search(q).pipe(catchError(() => of([])))),
);
// template: @for (r of results$ | async; track r.id) { <li>{{ r.name }}</li> }
```

### 4. Auth interceptor (functional)
```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};
// app.config.ts: provideHttpClient(withInterceptors([authInterceptor]))
```

### 5. Route guard (functional)
```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};
// { path: 'admin', canActivate: [authGuard], loadComponent: () => import('./admin').then(m => m.AdminComponent) }
```

### 6. Reactive form with validation
```ts
form = inject(FormBuilder).nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
});
submit() {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  this.auth.login(this.form.getRawValue());
}
```

### 7. Unsubscribe automatically
```ts
constructor() {
  interval(1000).pipe(takeUntilDestroyed()).subscribe(t => this.tick.set(t));
}
```

### 8. Parent ↔ child
```ts
// child
name = input.required<string>();
saved = output<string>();
// parent template
<app-child [name]="user.name" (saved)="onSaved($event)" />
```
