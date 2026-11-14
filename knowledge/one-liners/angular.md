# Angular — One-liners

> The most asked questions, each answered in one sentence.

1. **What is a component?** — A piece of UI made of a TypeScript class, an HTML template and styles.
2. **What is a standalone component?** — A component that lists its own imports and doesn't need an `NgModule`.
3. **What is dependency injection?** — Angular creates services and gives them to classes that ask for them.
4. **What does `providedIn: 'root'` mean?** — One shared instance of the service for the whole app.
5. **`ngOnInit` vs constructor?** — The constructor injects services; `ngOnInit` runs after inputs are set, so load data there.
6. **What is `@Input` / `@Output`?** — `@Input` passes data from parent to child; `@Output` emits events from child to parent.
7. **What is change detection?** — The process where Angular checks components and updates the screen when data changes.
8. **Default vs OnPush?** — Default checks every component on every event; OnPush checks only on new inputs, events inside, or signal/async updates.
9. **What are signals?** — Reactive values (`signal`, `computed`, `effect`) that update exactly the parts of the screen that use them.
10. **What does the `async` pipe do?** — It subscribes to an Observable in the template and unsubscribes automatically.
11. **What is a pipe?** — A template helper that formats values, like `date` or `currency`.
12. **Pure vs impure pipe?** — A pure pipe reruns only when its input reference changes; an impure one runs on every check.
13. **What is lazy loading?** — Loading a route's code only when the user visits it.
14. **What is a route guard?** — A function that allows or blocks navigation, like `canActivate`.
15. **Template-driven vs reactive forms?** — Template-driven forms use `ngModel` in HTML; reactive forms build `FormGroup`s in the class.
16. **What is an HTTP interceptor?** — Code that runs on every HTTP request/response, e.g. to add an auth token.
17. **What is `@defer`?** — A template block that loads its content later, such as when it scrolls into view.
18. **What is `ng-content`?** — A slot that projects content from the parent into a child component.
19. **AOT vs JIT?** — AOT compiles templates at build time (faster, safer); JIT compiles them in the browser.
20. **Why use `track` in `@for`?** — It helps Angular reuse DOM rows when the list changes.
21. **What is Zone.js for?** — It detects async events so Angular knows when to run change detection (not needed in zoneless apps).
