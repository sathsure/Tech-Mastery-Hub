# JavaScript — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Debounce
```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);                       // restart the wait on every call
    timer = setTimeout(() => fn(...args), delay);
  };
}
const onSearch = debounce(q => fetchResults(q), 300);
```

### 2. Throttle
```js
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {              // at most once per interval
      last = now;
      fn(...args);
    }
  };
}
```

### 3. Deep clone (without `structuredClone`)
```js
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value);     // handles circular references
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}
```

### 4. Promise.all from scratch
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(value => {
        results[i] = value;                    // keep the original order
        if (++done === promises.length) resolve(results);
      }, reject);                              // first failure rejects all
    });
  });
}
```

### 5. Flatten an array
```js
const flatten = arr => arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []);
flatten([1, [2, [3, [4]]]]);   // [1, 2, 3, 4]   (built-in: arr.flat(Infinity))
```

### 6. Memoize
```js
function memoize(fn) {
  const cache = new Map();
  return arg => {
    if (!cache.has(arg)) cache.set(arg, fn(arg));
    return cache.get(arg);
  };
}
```

### 7. Curry
```js
const curry = fn => function curried(...args) {
  return args.length >= fn.length ? fn(...args) : (...more) => curried(...args, ...more);
};
const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);   // 6
```

### 8. Retry with backoff
```js
async function retry(fn, attempts = 3, delay = 500) {
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise(r => setTimeout(r, delay * 2 ** i));   // 500, 1000, 2000 ms
    }
  }
}
```

### 9. Event emitter
```js
class Emitter {
  #events = {};
  on(name, fn) { (this.#events[name] ??= []).push(fn); return () => this.off(name, fn); }
  off(name, fn) { this.#events[name] = (this.#events[name] ?? []).filter(f => f !== fn); }
  emit(name, ...args) { (this.#events[name] ?? []).forEach(fn => fn(...args)); }
}
```

### 10. Group by
```js
const groupBy = (items, key) =>
  items.reduce((acc, item) => ((acc[item[key]] ??= []).push(item), acc), {});
groupBy([{ dept: "IT" }, { dept: "HR" }, { dept: "IT" }], "dept");
// { IT: [..2], HR: [..1] }   (built-in: Object.groupBy)
```
