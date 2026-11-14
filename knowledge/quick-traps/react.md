# React — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. State isn't updated right away
- ❌ `setCount(count + 1); console.log(count);` → still the old value.
- ✅ The new value shows in the next render. Use `useEffect` or compute it yourself.

### 2. Multiple updates from the old value
- ❌ `setCount(count + 1); setCount(count + 1);` → only +1.
- ✅ `setCount(c => c + 1)` twice → +2.

### 3. Changing state directly
- ❌ `items.push(x); setItems(items);` → no re-render (same array).
- ✅ `setItems([...items, x])`.

### 4. Infinite effect loop
- ❌ `const options = { page: 1 }; useEffect(() => { load(options).then(setData) }, [options]);` → runs forever.
- ✅ Objects in the dependency list are new every render. Use `useMemo`, or depend on simple values.

### 5. Missing dependencies
- ❌ `useEffect(() => load(userId), [])` → never reloads when `userId` changes.
- ✅ List every value the effect uses: `[userId]`.

### 6. `0` shows on screen
- ❌ `{items.length && <List />}` → prints `0` when empty.
- ✅ `{items.length > 0 && <List />}`.

### 7. Index as key
- ❌ `items.map((it, i) => <Row key={i} />)` with reordering → wrong rows keep old state.
- ✅ Use a stable id: `key={it.id}`.

### 8. Hooks inside conditions
- ❌ `if (loggedIn) { useState(...) }`
- ✅ Hooks must run in the same order every render. Put the `if` inside the hook or component.

### 9. Effects run twice in development
- ❌ "My API is called twice!"
- ✅ Strict Mode does it on purpose to find missing cleanups. Production runs once.

### 10. Stale values in timers
- ❌ `setInterval(() => setCount(count + 1), 1000)` with `[]` → stuck at 1.
- ✅ `setCount(c => c + 1)`, or keep the latest value in a `useRef`.

### 11. Error boundaries don't catch everything
- ❌ Expecting them to catch errors in `onClick` or `fetch`.
- ✅ They only catch errors while rendering. Use `try/catch` in handlers and async code.

### 12. `useMemo` everywhere
- ❌ Wrapping every value "for speed".
- ✅ Memoizing has a cost. Use it for slow calculations or to keep props stable for `React.memo` children.
