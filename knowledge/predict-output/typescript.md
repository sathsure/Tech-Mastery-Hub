# TypeScript — Predict the Output

> Read the code, guess what it prints (or whether it compiles), then tap to check.

### 1. Numeric enums
```ts
enum Color { Red, Green, Blue }
console.log(Color.Green, Color[0]);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `1 Red`

Numeric enums start at 0 and also map numbers back to names (reverse mapping).

</details>

### 2. `as` doesn't convert
```ts
const n = "5" as unknown as number;
console.log(n + 1);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `51`

`as` only changes what the compiler believes. At runtime it's still the string `"5"`.

</details>

### 3. `private` at runtime
```ts
class Account {
  private balance = 100;
}
const acc = new Account();
console.log((acc as any).balance);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `100`

TypeScript `private` is checked only while compiling. Use JavaScript `#balance` for real privacy.

</details>

### 4. Does it compile?
```ts
interface User { name: string }
const u: User = { name: "Asha", age: 30 };
```
<details class="reveal"><summary>Show answer</summary>

**Compile error:** "Object literal may only specify known properties".

Object literals get an extra check for unknown fields. Assigning the same object from a variable would compile.

</details>

### 5. `readonly` isn't frozen
```ts
const nums: readonly number[] = [1, 2];
(nums as number[]).push(3);
console.log(nums.length);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `3`

`readonly` is compile-time only. Use `Object.freeze` to block changes at runtime.

</details>

### 6. `??` vs `||`
```ts
const settings: { retries?: number } = { retries: 0 };
console.log(settings.retries || 3, settings.retries ?? 3);
```
<details class="reveal"><summary>Show answer</summary>

**Output:** `3 0`

`||` replaces any falsy value (including 0). `??` replaces only `null`/`undefined`.

</details>

### 7. Does it compile?
```ts
function len(x: string | number) {
  return x.length;
}
```
<details class="reveal"><summary>Show answer</summary>

**Compile error:** "Property 'length' does not exist on type 'number'".

Narrow first: `typeof x === "string" ? x.length : String(x).length`.

</details>
