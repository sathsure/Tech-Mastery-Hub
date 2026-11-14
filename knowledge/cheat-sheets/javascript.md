# JavaScript — Cheat Sheet

> **In one line:** the language of the web. It runs one thing at a time and handles waiting (network, timers) with callbacks and promises.

## Variables & types
- **`let`** — can change, lives inside its `{ }` block.
- **`const`** — can't be re-assigned (but an object's insides can still change).
- **`var`** — old way; lives in the whole function. Avoid it.
- **Primitive types** — `string, number, boolean, null, undefined, bigint, symbol`. Everything else is an **object** (arrays and functions too).
- **`===`** — compares type and value. Always use it instead of `==`.
- **Falsy values** — `false, 0, "", null, undefined, NaN`. Everything else is truthy (even `[]` and `{}`).

## Functions & scope
- **Scope** — where a variable can be seen: global, function, or block.
- **Hoisting** — declarations are moved to the top before code runs.
- **Closure** — a function remembers the variables around it, even later.

```js
function counter() {
  let count = 0;
  return () => ++count;   // remembers count
}
const next = counter();
next(); next();           // 2
```

- **Arrow function** — short syntax `(a) => a * 2`; it has no own `this`.
- **Higher-order function** — takes or returns a function (`map`, `filter`).
- **Debounce** — wait until the user stops (search box). **Throttle** — at most once per N ms (scroll).

## `this`
- `obj.fn()` → `this` is `obj`.
- Plain `fn()` → `undefined` (strict mode).
- `new Fn()` → the new object.
- Arrow function → `this` of the code around it.
- `call` / `apply` run a function with a chosen `this`; `bind` returns a new function with it fixed.

## Objects & classes
- **Prototype** — objects inherit from another object; missing properties are looked up there.
- **`class`** — nicer syntax over prototypes. `extends` to inherit.
- **Copy** — `{...obj}` copies one level; `structuredClone(obj)` copies everything.

## Arrays
- `map` → new array, each item changed. `filter` → new array, some items. `reduce` → one value.
- `find` → first match. `some` / `every` → true/false.
- `slice` copies part (safe). `splice` and `sort` change the original.

```js
[1, 2, 3].map(n => n * 2);              // [2, 4, 6]
[1, 2, 3].reduce((sum, n) => sum + n, 0); // 6
```

## Modern syntax (ES6+)
- Destructuring `const { name } = user`, spread `[...a, ...b]`, template strings `` `Hi ${name}` ``.
- `user?.address?.city` — safe access. `x ?? "default"` — fallback only for `null`/`undefined`.
- `Map` (any key type), `Set` (unique values).
- Modules: `import` / `export`.

## Async & the event loop
- **Event loop** — runs your code, then all **microtasks** (promises), then one **task** (timers, clicks), and repeats.
- **Promise** — a value that arrives later: pending → fulfilled or rejected.
- **async/await** — write async code like normal code; use `try/catch` for errors.
- `Promise.all` — wait for all (fails on the first error). `Promise.allSettled` — wait for all, never fails.

```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);          // prints 1 4 3 2
```

## Browser
- **Event bubbling** — an event goes from the clicked element up to its parents.
- **Event delegation** — one listener on the parent handles all children.
- **Storage** — `localStorage` (stays), `sessionStorage` (one tab), cookies (sent to the server).
- **`defer`** script — runs after the page is parsed, in order. **`async`** — runs as soon as it loads.
- **Garbage collection** — memory that nothing points to is freed automatically.
