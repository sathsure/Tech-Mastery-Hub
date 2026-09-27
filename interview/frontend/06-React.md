### ❓ What are the main differences between React class components and function components?

### 📝 Answer

- Function components are simpler, use hooks, and are now the recommended approach.
- Class components use `this`, lifecycle methods (`componentDidMount`, etc.).
- Hooks let you share logic more easily than HOCs/render props.

💻 **Code Example**

```jsx
// Function component with hook
function Counter() {
  const [count, setCount] = React.useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

---

### ❓ Explain React Hooks rules. What happens if you break them?

### 📝 Answer

- Only call hooks:

  1. At the top level (not in loops, conditions, nested functions).
  2. Only inside React function components or custom hooks.

- If you break them, hook order changes between renders and React will read wrong internal state → bugs or runtime errors.

💻 **Code Example**

```jsx
// ✅ Correct
function MyComponent({ show }) {
  const [value, setValue] = React.useState(0); // always first hook
  const [text, setText] = React.useState(""); // always second hook
  // ...
}
```

---

### ❓ How does React’s reconciliation (diffing) algorithm work?

### 📝 Answer

- React builds a virtual DOM tree.
- On update, it compares old vs new tree:

  - Different types → replace node.
  - Same type → update props and recursively diff children.

- For lists, `key` helps React match items and avoid unnecessary re-renders.

💻 **Code Example**

```jsx
{
  items.map((item) => <Todo key={item.id} item={item} />);
}
```

---

### ❓ Why are keys important in lists? What are bad keys?

### 📝 Answer

- Keys identify elements between renders to keep state correctly.
- Bad keys: array index, random values (because they change or don’t reflect item identity).
- Good keys: stable ID from data.

💻 **Code Example**

```jsx
// ❌ Bad
items.map((item, index) => <Row key={index} />);

// ✅ Good
items.map((item) => <Row key={item.id} />);
```

---

### ❓ What is `useEffect` and common pitfalls?

### 📝 Answer

- `useEffect` runs side-effects after render (API calls, subscriptions, DOM, timers).
- Pitfalls:

  - Missing dependencies (stale values).
  - Too many dependencies → unnecessary calls.
  - Not cleaning up (memory leaks).

💻 **Code Example**

```jsx
useEffect(() => {
  const id = setInterval(() => {
    console.log("tick");
  }, 1000);
  return () => clearInterval(id); // cleanup
}, []); // run once
```

---

### ❓ What’s the difference between `useEffect` and `useLayoutEffect`?

### 📝 Answer

- `useEffect` runs after paint (async, non-blocking).
- `useLayoutEffect` runs synchronously after DOM mutation but before paint (blocks painting).
- Use `useLayoutEffect` only when you must measure DOM or avoid flicker.

💻 **Code Example**

```jsx
useLayoutEffect(() => {
  const rect = ref.current.getBoundingClientRect();
  // sync layout calculations
}, []);
```

---

### ❓ Explain `useMemo` and `useCallback`. When to use them?

### 📝 Answer

- `useMemo`: memoizes expensive computed values.
- `useCallback`: memoizes function references.
- Use when:

  - Expensive calculations.
  - Passing functions/objects to children that depend on reference equality.

💻 **Code Example**

```jsx
const filtered = useMemo(() => list.filter((item) => item.active), [list]);

const handleClick = useCallback(() => {
  console.log("clicked");
}, []);
```

---

### ❓ What is React’s Strict Mode and why might effects run twice in dev?

### 📝 Answer

- `<React.StrictMode>` helps find side-effect issues.
- In React 18 dev, React intentionally mounts, unmounts, and re-mounts components to detect unsafe effects.
- This makes `useEffect` run twice in dev (but not in production).

💻 **Code Example**

```jsx
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### ❓ Explain React 18 concurrent rendering in simple terms.

### 📝 Answer

- Concurrent rendering lets React pause, resume, and discard renders.
- It makes updates more responsive by splitting work and prioritizing urgent updates (like typing) over non-urgent ones.
- You opt in with features like `startTransition`, `Suspense` for data, etc.

💻 **Code Example**

```jsx
import { startTransition, useState } from "react";

const [value, setValue] = useState("");
const [results, setResults] = useState([]);

function onChange(e) {
  const next = e.target.value;
  setValue(next); // urgent
  startTransition(() => {
    setResults(expensiveSearch(next)); // non-urgent
  });
}
```

---

### ❓ What is `Suspense` and how is it used?

### 📝 Answer

- `Suspense` lets you show a fallback while some child “waits” (lazy-loaded component, or data with React 18 libs).
- The component throws a promise; React shows fallback until it resolves.

💻 **Code Example**

```jsx
const UserProfile = React.lazy(() => import("./UserProfile"));

<Suspense fallback={<div>Loading...</div>}>
  <UserProfile />
</Suspense>;
```

---

### ❓ How does server-side rendering (SSR) work with React?

### 📝 Answer

- Server renders React components to HTML.
- Client hydrates that HTML with event listeners.
- Benefits: faster first paint, SEO.
- Tools: Next.js, Remix, or `react-dom/server` directly.

💻 **Code Example**

```js
import { renderToString } from "react-dom/server";

const html = renderToString(<App />);
res.send(`<!doctype html><div id="root">${html}</div>`);
```

---

### ❓ What is hydration and what can go wrong?

### 📝 Answer

- Hydration attaches event listeners to existing server-rendered HTML.
- Problems when server-rendered markup doesn’t match client render (different data, random IDs, time-based values).
- React logs hydration mismatch warnings.

💻 **Code Example**

```jsx
// Avoid non-deterministic values at render time on server
function Now() {
  const [now] = useState(() => Date.now()); // initialized once
  return <span>{now}</span>;
}
```

---

### ❓ How do you manage global state in a large React app?

### 📝 Answer

- Options:

  - React Context for simple global state.
  - Libraries: Redux Toolkit, Zustand, Jotai, Recoil, etc.

- Choose based on complexity, dev tooling, and performance needs.

💻 **Code Example**

```jsx
const ThemeContext = React.createContext();

function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Button() {
  const { theme } = React.useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

---

### ❓ What are common performance optimization techniques in React?

### 📝 Answer

- Memoization: `React.memo`, `useMemo`, `useCallback`.
- Split code: `React.lazy`, dynamic imports.
- Virtualize long lists.
- Avoid unnecessary re-renders by proper props structure and `key`.
- Use `useTransition` for non-urgent updates.

💻 **Code Example**

```jsx
const ListItem = React.memo(function ListItem({ item }) {
  console.log("render", item.id);
  return <li>{item.label}</li>;
});
```

---

### ❓ Explain controlled vs uncontrolled components in forms.

### 📝 Answer

- Controlled: React state is the single source of truth; input value comes from state.
- Uncontrolled: DOM holds value; use refs to read it.
- Controlled gives better validation and control; uncontrolled is simpler for basic forms.

💻 **Code Example**

```jsx
// Controlled
const [name, setName] = useState("");
<input value={name} onChange={(e) => setName(e.target.value)} />;

// Uncontrolled
const ref = useRef();
<input ref={ref} defaultValue="John" />;
```

---

### ❓ How do you handle errors in React components?

### 📝 Answer

- Use error boundaries (class components) to catch render/runtime errors in child components.
- For async (e.g., fetch), handle in promises/try-catch and show fallback UI.

💻 **Code Example**

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}
```

---

### ❓ How do you test React components?

### 📝 Answer

- Unit/integration tests with:

  - React Testing Library (preferred).
  - Jest/Vitest as test runner.

- Focus on behavior and output, not implementation details.

💻 **Code Example**

```jsx
// Component
function Greeting({ name }) {
  return <h1>Hello {name}</h1>;
}

// Test
import { render, screen } from "@testing-library/react";

test("shows greeting", () => {
  render(<Greeting name="Dev" />);
  expect(screen.getByText(/Hello Dev/i)).toBeInTheDocument();
});
```

---

### ❓ What are custom hooks and why use them?

### 📝 Answer

- Custom hooks are functions that use hooks and start with `use`.
- They encapsulate reusable stateful logic (fetching, subscriptions).
- They keep components smaller and easier to test.

💻 **Code Example**

```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}
```

---

### ❓ How do you handle authentication flows in React?

### 📝 Answer

- Store auth state (token/user) in context or global store.
- Protect routes with wrappers (e.g., `<PrivateRoute>`).
- Avoid putting tokens in localStorage if possible; prefer http-only cookies.

💻 **Code Example**

```jsx
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
```

---

### ❓ How to avoid prop drilling?

### 📝 Answer

- Use:

  - Context API.
  - Global state libraries.
  - Colocate state closer to where it’s used.
  - Component composition instead of deep nesting.

💻 **Code Example**

```jsx
const UserContext = React.createContext();

function App() {
  const [user] = useState({ name: "Dev" });
  return (
    <UserContext.Provider value={user}>
      <Page />
    </UserContext.Provider>
  );
}

function Header() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

---

### ❓ Explain “lifting state up” with an example.

### 📝 Answer

- When two or more components need to share state, move that state to their closest common parent and pass down via props.

💻 **Code Example**

```jsx
function Parent() {
  const [value, setValue] = useState("");
  return (
    <>
      <Input value={value} onChange={setValue} />
      <Preview value={value} />
    </>
  );
}
```

---

### ❓ What is `React.forwardRef` and when to use it?

### 📝 Answer

- `forwardRef` lets a component pass a ref to a child DOM node or another component.
- Useful for reusable input components, focusing, imperative APIs.

💻 **Code Example**

```jsx
const TextInput = React.forwardRef(function TextInput(props, ref) {
  return <input ref={ref} {...props} />;
});

const ref = useRef();
<TextInput ref={ref} />;
```

---

### ❓ What is the difference between `useRef` and `useState`?

### 📝 Answer

- `useRef`:

  - Stores a mutable value `.current`.
  - Updating it doesn’t trigger re-render.

- `useState`:

  - Stores state.
  - Updating triggers re-render.

💻 **Code Example**

```jsx
const countRef = useRef(0);

function handleClick() {
  countRef.current += 1; // no re-render
}
```

---

### ❓ How do you handle large lists efficiently in React?

### 📝 Answer

- Use windowing/virtualization (only render visible rows) with libraries like `react-window`, `react-virtualized`.
- Avoid heavy DOM for off-screen items.

💻 **Code Example**

```jsx
import { FixedSizeList as List } from "react-window";

<List height={400} itemCount={10000} itemSize={35} width={300}>
  {({ index, style }) => <div style={style}>Row {index}</div>}
</List>;
```

---

### ❓ How do you ensure accessibility (a11y) in React apps?

### 📝 Answer

- Use semantic HTML (`<button>`, `<nav>`, `<header>`).
- Add ARIA attributes only when necessary.
- Manage focus properly.
- Ensure keyboard navigation and proper labels.

💻 **Code Example**

```jsx
<button aria-label="Close dialog" onClick={onClose}>
  ✕
</button>
```

---

### ❓ How do you prevent unnecessary re-renders in child components?

### 📝 Answer

- Use `React.memo` to memoize child component.
- Use stable props (memoized callbacks/objects).
- Avoid creating new objects/functions in JSX without memo if performance is an issue.

💻 **Code Example**

```jsx
const Child = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>Child</button>;
});

const onClick = useCallback(() => {
  console.log("click");
}, []);
```

---

### ❓ What’s the difference between `ReactDOM.render` and `createRoot`?

### 📝 Answer

- `ReactDOM.render` is legacy (React 17).
- `createRoot` (React 18+) enables concurrent features and strict mode behaviors.

💻 **Code Example**

```jsx
// React 18
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

---

### ❓ How do you organize a large-scale React project?

### 📝 Answer

- Feature-based folder structure (by domain, not by type).
- Separate UI components, hooks, services, and types.
- Use index files for re-exports.
- Keep components small and focused.

💻 **Code Example**

```text
src/
  features/
    auth/
      components/
      hooks/
      api/
      authSlice.ts
```

---

### ❓ How do you handle side effects like API calls in React?

### 📝 Answer

- Use `useEffect` for fire-and-forget.
- Or use data fetching libraries (React Query, SWR) for caching, retries, and stale data.
- Keep side effects outside of render logic.

💻 **Code Example**

```jsx
useEffect(() => {
  let ignore = false;
  async function fetchData() {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (!ignore) setUsers(data);
  }
  fetchData();
  return () => {
    ignore = true;
  };
}, []);
```

---

### ❓ Explain a “trick” question: Why doesn’t this state update immediately?

```jsx
const [count, setCount] = useState(0);
setCount(count + 1);
console.log(count); // ?
```

### 📝 Answer

- `setCount` schedules an update; it doesn’t change `count` immediately in the same render.
- `console.log` prints the old value.
- React batches updates and re-renders with new state afterward.

💻 **Code Example**

```jsx
useEffect(() => {
  console.log("count changed", count);
}, [count]);
```

---

### ❓ Trick: What’s wrong with this effect?

```jsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

### 📝 Answer

- Infinite loop: `setCount` updates `count`, which re-triggers the effect, forever.
- Use conditional logic or remove `setCount` from `useEffect` if not needed.

💻 **Code Example**

```jsx
useEffect(() => {
  if (count === 0) setCount(1);
}, [count]);
```

---

### ❓ Trick: Why is this component re-rendering even with `React.memo`?

```jsx
const List = React.memo(function List({ items }) { ... });
<List items={[]} />
```

### 📝 Answer

- `items={[]}` creates a new array every render; shallow compare sees a new reference, so memo fails.
- Fix: memoize the array or pass stable data.

💻 **Code Example**

```jsx
const memoItems = useMemo(() => [], []);
<List items={memoItems} />;
```

---

### ❓ How do you type React components and hooks with TypeScript?

### 📝 Answer

- Use `React.FC` or explicit props type.
- Type hooks’ return and params.
- Use generics when needed.

💻 **Code Example**

```tsx
type ButtonProps = {
  onClick: () => void;
  label: string;
};

const Button: React.FC<ButtonProps> = ({ onClick, label }) => (
  <button onClick={onClick}>{label}</button>
);
```

---

### ❓ How do you implement code-splitting in React?

### 📝 Answer

- Use `React.lazy` and `Suspense` to lazy-load components.
- Or dynamic imports in routing (e.g., React Router, Next.js).

💻 **Code Example**

```jsx
const Settings = React.lazy(() => import("./Settings"));

<Suspense fallback={<div>Loading...</div>}>
  <Settings />
</Suspense>;
```

---

### ❓ How do you debounce or throttle events in React?

### 📝 Answer

- Wrap handler with debounce/throttle (e.g., lodash).
- Use `useCallback` to keep stable reference.

💻 **Code Example**

```jsx
import { debounce } from "lodash-es";

const handleSearch = useCallback(
  debounce((term) => {
    // API call
  }, 300),
  []
);

<input onChange={(e) => handleSearch(e.target.value)} />;
```

---

### ❓ How do you make a reusable modal component in React?

### 📝 Answer

- Create a `Modal` component with props (`isOpen`, `onClose`).
- Use portals to render on top-level.
- Control visibility from parent.

💻 **Code Example**

```jsx
import ReactDOM from "react-dom";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

---

### ❓ How do you implement dark/light theme toggling?

### 📝 Answer

- Store `theme` in context or global store.
- Apply class on `html/body`.
- Persist in localStorage if needed.

💻 **Code Example**

```jsx
const [theme, setTheme] = useState("light");

useEffect(() => {
  document.documentElement.dataset.theme = theme;
}, [theme]);

<button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
  Toggle
</button>;
```

---

### ❓ How do you handle file uploads in React?

### 📝 Answer

- Use `<input type="file" />`.
- Read `event.target.files`.
- Send `FormData` via fetch/axios.

💻 **Code Example**

```jsx
function Upload() {
  const handleChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    await fetch("/upload", { method: "POST", body: formData });
  };
  return <input type="file" onChange={handleChange} />;
}
```

---

### ❓ How do you secure a React app against XSS?

### 📝 Answer

- Never inject unsanitized HTML.
- Avoid `dangerouslySetInnerHTML` unless content is sanitized.
- Rely on React’s default escaping of values.

💻 **Code Example**

```jsx
// Safe: React escapes
<div>{userInput}</div>;

// Dangerous: ensure `sanitizedHtml` is sanitized
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
```

---

### ❓ How do you debug React performance issues?

### 📝 Answer

- Use React DevTools Profiler to see slow components.
- Check frequent re-renders (high commit count).
- Optimize with memoization, splitting components, virtualization.
- Check for unnecessary computations in render.

💻 **Code Example**

```jsx
// Add <React.Profiler> around suspicious subtree in dev
<React.Profiler
  id="App"
  onRender={(id, phase, actualDuration) => {
    console.log(id, phase, actualDuration);
  }}
>
  <App />
</React.Profiler>
```

---
