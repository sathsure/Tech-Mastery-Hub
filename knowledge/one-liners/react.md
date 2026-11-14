# React — One-liners

> The most asked questions, each answered in one sentence.

1. **What is React?** — A library for building user interfaces from reusable components.
2. **Props vs state?** — Props are read-only inputs from the parent; state is data the component owns and can change.
3. **What is JSX?** — HTML-like syntax in JavaScript that compiles to function calls creating elements.
4. **What is the virtual DOM?** — A lightweight copy of the UI that React compares with the previous one to update only what changed.
5. **Why are keys needed in lists?** — They let React match items between renders so it updates the right ones.
6. **What does `useState` do?** — It gives a component a state value and a function to update it.
7. **What does `useEffect` do?** — It runs side effects (fetching, subscriptions) after render, with optional cleanup.
8. **`useMemo` vs `useCallback`?** — `useMemo` remembers a computed value; `useCallback` remembers a function.
9. **What is `useRef` for?** — Holding a DOM element or a value that persists without causing re-renders.
10. **What is Context?** — A way to share data deep in the tree without passing props through every level.
11. **What does `React.memo` do?** — It skips re-rendering a component when its props haven't changed.
12. **Controlled vs uncontrolled input?** — Controlled inputs keep their value in React state; uncontrolled ones keep it in the DOM.
13. **What is lifting state up?** — Moving shared state to the nearest common parent.
14. **What are the rules of hooks?** — Call hooks only at the top level of components or custom hooks, never in loops or conditions.
15. **What is a custom hook?** — A function starting with `use` that reuses stateful logic.
16. **What is an error boundary?** — A component that catches render errors in its children and shows a fallback.
17. **What is code splitting?** — Loading parts of the app only when needed with `lazy()` and `Suspense`.
18. **What is reconciliation?** — React's process of comparing the new tree with the old one and applying the differences.
19. **When does a component re-render?** — When its state changes, its parent re-renders, or a context it reads changes.
20. **What are Server Components?** — Components that run only on the server and send no JavaScript to the browser.
21. **What is a Fragment?** — `<>…</>` groups elements without adding an extra DOM node.
