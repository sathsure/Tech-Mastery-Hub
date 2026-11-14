# React — Cheat Sheet

> **In one line:** a library for building UIs from components. When data (state) changes, React updates the screen for you.

## Core ideas
- **Component** — a function that returns JSX (HTML-like code).
- **Props** — inputs from the parent. Read-only.
- **State** — data the component owns. Changing it re-renders the component.
- **One-way data flow** — data goes down through props; events go up through callbacks.

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## How rendering works
- **Virtual DOM** — React builds a light copy of the page, compares it with the last one, and changes only what's different.
- **Keys** — give list items a stable unique `key` so React can track them.
- **A component re-renders when** its state changes, its parent re-renders, or a context it uses changes.

## Hooks
- `useState` — local state.
- `useEffect` — run code after render (fetch data, subscriptions).
- `useRef` — keep a value or DOM element without re-rendering.
- `useMemo` — remember a calculated value.
- `useCallback` — remember a function.
- `useContext` — read shared data (theme, logged-in user).
- `useReducer` — state with many actions (like a mini Redux).
- **Rules** — call hooks at the top level only, never inside `if` or loops.

## useEffect
```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);   // cleanup
}, []);                              // [] = run once
```
- No array → runs after every render.
- `[]` → runs once.
- `[userId]` → runs when `userId` changes.

## State tips
- Updates are batched; use `setCount(c => c + 1)` when the new value depends on the old one.
- Never change state directly — make a copy: `setItems([...items, x])`.
- **Lifting state up** — move shared state to the nearest common parent.
- **Controlled input** — React holds the value (`value` + `onChange`).

## Sharing state
- **Context** — pass data deep without passing props through every level.
- **Redux Toolkit / Zustand** — global app state.
- **React Query / SWR** — cache data from APIs (loading, refetch, errors).

## Performance
- `React.memo` — skip re-render if props didn't change.
- `useMemo` / `useCallback` — keep values stable for memoized children.
- **Code splitting** — `lazy(() => import('./Page'))` + `<Suspense>`.
- Long lists → virtualization (render only visible rows).

## Patterns
- **Custom hook** — reuse logic: `useFetch(url)`, `useDebounce(value)`.
- **Composition** — build with `children` instead of inheritance.
- **Error boundary** — catches errors while rendering and shows a fallback.
- **Portal** — render a modal outside the parent's DOM. **Fragment** `<>…</>` — group without an extra div.

## Rendering on the server (Next.js)
- **CSR** — built in the browser. **SSR** — built on the server per request. **SSG** — built once at build time.
- **Server Components** — run only on the server and send no JS to the browser; `"use client"` marks interactive ones.
