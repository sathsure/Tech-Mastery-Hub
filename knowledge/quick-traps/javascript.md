# JavaScript — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. `==` changes types
- ❌ `0 == "0"` → `true`, `null == undefined` → `true`
- ✅ Use `===`, which checks type and value.

### 2. `typeof null`
- ❌ `typeof null` → `"object"` (an old bug)
- ✅ Check with `x === null`.

### 3. `var` in a loop with timers
- ❌ `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i))` → `3 3 3`
- ✅ Use `let`: each loop gets its own `i` → `0 1 2`.

### 4. Using `let` before it's declared
- ❌ `console.log(x); let x = 1;` → ReferenceError
- ✅ `let`/`const` are hoisted but locked until their line runs (the "temporal dead zone").

### 5. Losing `this`
- ❌ `const f = obj.greet; f();` → `this` is `undefined`
- ✅ Use `obj.greet.bind(obj)` or an arrow function.

### 6. Default sort is text sort
- ❌ `[10, 1, 2].sort()` → `[1, 10, 2]`
- ✅ `[10, 1, 2].sort((a, b) => a - b)` → `[1, 2, 10]`

### 7. Floating point math
- ❌ `0.1 + 0.2 === 0.3` → `false`
- ✅ Compare with a small tolerance, or work in whole numbers (paise, cents).

### 8. `||` replaces 0 and ""
- ❌ `const qty = 0 || 10` → `10`
- ✅ `const qty = 0 ?? 10` → `0` (`??` only replaces `null`/`undefined`).

### 9. Promise order
- ❌ Expecting `setTimeout(…, 0)` to run before a promise.
- ✅ Promise callbacks (microtasks) always run first.

### 10. `await` inside `forEach`
- ❌ `items.forEach(async i => await save(i))` — doesn't wait.
- ✅ Use `for (const i of items) await save(i)` or `await Promise.all(items.map(save))`.

### 11. `const` objects can still change
- ❌ Thinking `const user = {}` makes it read-only.
- ✅ `const` only stops re-assignment. Use `Object.freeze` to stop changes.

### 12. Copying nested objects
- ❌ `const b = {...a}; b.address.city = "X"` also changes `a`.
- ✅ Spread copies one level only; use `structuredClone(a)` for a deep copy.

### 13. `["1","2","3"].map(parseInt)`
- ❌ → `[1, NaN, NaN]` (map passes the index as the second argument)
- ✅ `.map(Number)` or `.map(s => parseInt(s, 10))`.

### 14. `NaN` isn't equal to itself
- ❌ `NaN === NaN` → `false`
- ✅ Use `Number.isNaN(x)`.
