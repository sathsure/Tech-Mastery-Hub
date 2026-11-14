# React — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Fetch data with loading and error states
```jsx
function Users() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();               // cancel on unmount
    fetch("/api/users", { signal: controller.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(data => { setUsers(data); setStatus("done"); })
      .catch(err => { if (err.name !== "AbortError") setStatus("error"); });
    return () => controller.abort();
  }, []);

  if (status === "loading") return <p>Loading…</p>;
  if (status === "error") return <p>Something went wrong</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### 2. Custom hook: `useDebounce`
```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
```

### 3. Custom hook: `useLocalStorage`
```jsx
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? initial; } catch { return initial; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}
```

### 4. Controlled form
```jsx
function Login({ onSubmit }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <input name="email" value={form.email} onChange={change} />
      <input name="password" type="password" value={form.password} onChange={change} />
      <button>Log in</button>
    </form>
  );
}
```

### 5. Context for auth
```jsx
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, login: setUser, logout: () => setUser(null) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
```

### 6. useReducer for a todo list
```jsx
function reducer(todos, action) {
  switch (action.type) {
    case "add": return [...todos, { id: crypto.randomUUID(), text: action.text, done: false }];
    case "toggle": return todos.map(t => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "remove": return todos.filter(t => t.id !== action.id);
    default: return todos;
  }
}
const [todos, dispatch] = useReducer(reducer, []);
```

### 7. Lazy loading a page
```jsx
const Reports = lazy(() => import("./Reports"));
<Suspense fallback={<Spinner />}><Reports /></Suspense>
```

### 8. Error boundary
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() { return this.state.hasError ? <p>Something broke.</p> : this.props.children; }
}
```
