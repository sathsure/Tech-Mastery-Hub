# Angular

## Definition

Angular is presented in the repository as a TypeScript-based, component-oriented framework with dependency injection, templates, data binding, lifecycle management, encapsulation, and application architecture.

## Core Concepts

### Angular vs AngularJS
The source contrasts AngularJS 1.x with Angular 2+:

- AngularJS: JavaScript, MVC/controllers/scopes, dirty checking.
- Angular: TypeScript, component-based architecture, modern change detection, NgModules/standalone components, AOT/tree-shaking, mobile and SSR support.

### Data Binding
The source identifies four primary forms plus custom two-way binding:

| Syntax | Direction | Use |
|---|---|---|
| `{{ }}` | Component → View | Display data |
| `[prop]` | Component → View | Set property |
| `(event)` | View → Component | Handle events |
| `[(ngModel)]` | Two-way | Form synchronization |
| `[(value)]` | Custom two-way | Reusable components |

Custom two-way binding uses an `@Input()` paired with an `@Output()` named `valueChange`.

### Components and Directives
A component is described as a directive with a template.

- Component: creates/controls UI and has a template.
- Directive: modifies behavior or appearance of an existing element without its own template.
- Structural directives manipulate DOM structure.

### View Encapsulation
The source covers:

- `Emulated`: Angular-style scoped attributes; default.
- `None`: global styles.
- `ShadowDom`: browser Shadow DOM isolation.

It also discusses `::ng-deep`, its deprecation, and its use with Emulated encapsulation.

### Lifecycle Hooks
The source covers lifecycle hooks including `ngOnChanges`, `ngOnInitP, and `ngDoCheck`, with their timing and common uses.

## Learning Path

1. Angular architecture
2. Components and templates
3. Data binding
4. Directives
5. View encapsulation
6. Lifecycle hooks
7. Dependency injection
8. Routing
9. Forms
10. Change detection/signals
11. Standalone APIs
12. Angular performance/build tooling
13. Angular coding practice

## Repository Resources

- Interview: `interview/frontend/05-Angular-1.md`
- Interview: `interview/frontend/05-Angular-2.md`
- Coding: `practice/coding/03-angular-coding.md`
- Roadmap: `roadmap/frontend/README.md`

## Source Boundary

This page is a canonical consolidation of repository evidence. It does not replace the detailed interview files; those remain the deeper question-and-answer source.

