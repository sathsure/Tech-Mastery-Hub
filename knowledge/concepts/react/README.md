# React

## Definition

React is presented in the repository as a component-based UI library using function components, hooks, reconciliation, effects, and a rendering model that can support concurrent rendering and server-side rendering.

## Core Concepts

### Function vs Class Components
The source describes function components as the simpler modern approach using hooks. Class components use `this` and lifecycle methods.

### Hooks
Rules covered by the source:

1. Call hooks at the top level.
2. Call hooks only inside React function components or custom hooks.

Breaking hook ordering can cause React to associate state with the wrong hook.

### Reconciliation
The source describes React as building a virtual DOM tree and comparing old and new trees.

- Different element types can cause replacement.
- Same types lead to prop updates and recursive child comparison.
- Stable `key` values help React match list items.

### Keys
Stable IDs from the data are preferred. Array indexes and random values are described as problematic keys because they do not reliably represent item identity.

### Effects
`useEffect` is used for side effects such as API calls, subscriptions, DOM work, and timers.

The source highlights:

- stale values from missing dependencies
- unnecessary calls from excessive dependencies
- cleanup to avoid leaks

`useLayoutEffect` runs synchronously after DOM mutation and before paint and is positioned for DOM measurement or avoiding visual flicker.

### Memoization
- `useMemo`: memorizes computed values.
- `useCallback`: memoizes function references.

The source connects these to expensive calculations and reference equality.

### Concurrent Rendering
The source explains concurrent rendering as the ability to pause, resume, and discard renders and prioritize urgent work. It references `startTransition` and `Suspense`.

### Suspense
Suspense can display fallback UI while a child waits, including lazy-loaded components and supported data-loading patterns.

### SSR and Hydration
The source describes:

```text
Server → HTML
Client → Hydration + event listeners
```

Hydration problems can occur when server-rendered markup differs from the client render.

### Global State and Performance
The source lists React Context and state libraries such as Redux Toolkit, Zustand, Jotai, and Recoil. Performance topics include memoization, code splitting, list virtualization, avoiding unnecessary renders, and transitions.

## Learning Path

1. Components2. Hooks
3. Reconciliation and keys
4. Effects
5. Memoization
6. Concurrent rendering
7. Suspense
8. SSR/hydration
9. State management
10. Performance

## Repository Resources

- Interview: `interview/frontend/06-React.md`
- Roadmap: `roadmap/frontend/README.md`

## Source Boundary

This page consolidates the supplied React evidence and does not attempt to be a complete React reference.

