# Node.js — Predict the Output

> Read the code, guess what it prints, then tap to check.

### 1. Queues in the main module
```js
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
console.log("sync");
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `sync → nextTick → promise →` then `timeout` and `immediate` in **either order**

`nextTick` runs before promises. In the main module, timeout vs immediate depends on process timing.

</details>

### 2. Inside an I/O callback
```js
fs.readFile(__filename, () => {
  setTimeout(() => console.log("timeout"), 0);
  setImmediate(() => console.log("immediate"));
});
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `immediate → timeout` (always)

After the I/O phase the loop reaches the check phase (`setImmediate`) before going back to timers.

</details>

### 3. Async file read
```js
console.log("start");
fs.readFile("a.txt", () => console.log("read done"));
console.log("end");
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `start → end → read done`

The read happens in the background; its callback runs later.

</details>

### 4. `async` inside `forEach`
```js
const wait = ms => new Promise(r => setTimeout(r, ms));
[1, 2].forEach(async n => { await wait(10); console.log(n); });
console.log("done");
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `done → 1 → 2`

`forEach` doesn't wait for async callbacks.

</details>

### 5. EventEmitter is synchronous
```js
const e = new EventEmitter();
e.on("ping", () => console.log("listener"));
console.log("before");
e.emit("ping");
console.log("after");
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `before → listener → after`

`emit` calls listeners immediately, in the same tick.

</details>

### 6. Module caching
```js
// counter.js
let count = 0;
module.exports = () => ++count;

// main.js
const a = require("./counter");
const b = require("./counter");
a(); a();
console.log(b());
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `3`

`require` caches the module, so `a` and `b` share the same `count`.

</details>

### 7. `Promise.all` fails fast
```js
Promise.all([
  Promise.resolve(1),
  Promise.reject(new Error("boom")),
  new Promise(r => setTimeout(() => r(3), 100)),
]).then(console.log).catch(err => console.log("caught", err.message));
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `caught boom`

`Promise.all` rejects as soon as one promise rejects. Use `allSettled` to get every result.

</details>
