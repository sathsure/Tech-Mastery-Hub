# JavaScript — Predict the Output

> Read the code, guess what it prints, then tap to check.

### 1. Event loop order
```js
console.log(1);
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `1 4 3 2`

Normal code runs first (1, 4). Then all promise callbacks (microtasks: 3). Then timers (2).

</details>

### 2. `var` in a loop
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i));
}
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `3 3 3`

There is only one `i` (function-scoped). The timers run after the loop ends, when `i` is 3. With `let` you'd get `0 1 2`.

</details>

### 3. Hoisting
```js
console.log(a);
var a = 5;
console.log(b);
let b = 6;
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `undefined`, then **ReferenceError**

`var a` is hoisted as `undefined`. `let b` is hoisted but locked (temporal dead zone) until its line.

</details>

### 4. `typeof` surprises
```js
console.log(typeof null, typeof [], typeof NaN, typeof function () {});
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `object object number function`

`null` → "object" is an old bug. Arrays are objects. `NaN` is a number.

</details>

### 5. Type coercion
```js
console.log("5" + 2, "5" - 2, [] + [], true + 1);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `52 3  2`

`+` with a string joins text ("52"). `-` converts to numbers (3). `[] + []` is an empty string. `true` becomes 1.

</details>

### 6. async/await order
```js
async function run() {
  console.log("A");
  await null;
  console.log("B");
}
console.log("1");
run();
console.log("2");
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `1 A 2 B`

An async function runs normally until its first `await`. The rest continues as a microtask after the current code.

</details>

### 7. Object references
```js
const a = { x: 1 };
const b = a;
b.x = 2;
const c = { ...a };
c.x = 3;
console.log(a.x, b.x, c.x);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `2 2 3`

`b` points to the same object as `a`. `c` is a copy, so changing it doesn't affect `a`.

</details>

### 8. Default sort
```js
console.log([10, 1, 5, 2].sort());
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[1, 10, 2, 5]`

Default sort compares as text. Use `.sort((a, b) => a - b)` for numbers.

</details>

### 9. `map(parseInt)`
```js
console.log(["1", "2", "3"].map(parseInt));
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `[1, NaN, NaN]`

`map` passes `(value, index)`. So it calls `parseInt("2", 1)` and `parseInt("3", 2)` — invalid bases/digits → `NaN`.

</details>

### 10. Closures
```js
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const c1 = makeCounter();
const c2 = makeCounter();
c1(); c1();
console.log(c1(), c2());
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `3 1`

Each call to `makeCounter` creates its own `count`.

</details>

### 11. Floating point
```js
console.log(0.1 + 0.2 === 0.3, (0.1 + 0.2).toFixed(2));
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `false 0.30`

`0.1 + 0.2` is `0.30000000000000004` in binary floating point.

</details>

### 12. `this` in a callback
```js
const user = {
  name: "Asha",
  greetLater() {
    setTimeout(function () { console.log(this === user); });
    setTimeout(() => console.log(this === user));
  },
};
user.greetLater();
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `false true`

A normal function loses `this` when called by `setTimeout`. The arrow function keeps `this` from `greetLater`.

</details>
