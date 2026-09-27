# 🔷 TypeScript Interview Preparation

---

# 🧱 Part 1 — Basics

### ❓ Difference between `const` and `as const`?

### 📝 Answer

| Keyword     | Variable can be reassigned? | Contents can be mutated? | Type inferred |
| ----------- | --------------------------- | ------------------------ | ------------- |
| `const`     | ❌ No                       | ✅ Yes (deep mutable)    | Wider type (`string`, `number[]`) |
| `as const`  | ❌ No                       | ❌ No (deeply readonly)  | **Literal** type (`"red"`, `readonly [1, 2]`) |

```ts
// const: variable is fixed, but contents are mutable
const mutableObj = { a: 1, b: 2 };
mutableObj.a = 100;                     // ✅ Allowed
// mutableObj = { ... };                // ❌ Cannot reassign

// as const: deeply readonly + literal types
const immutableObj = { x: 10, y: 20 } as const;
// immutableObj.x = 200;                // ❌ Error: read-only

// Type difference
const arr1 = [1, 2, 3];                 // type: number[]
const arr2 = [1, 2, 3] as const;        // type: readonly [1, 2, 3]
```

> 💡 **Use `as const` for**: enum-like literal unions, default props, Redux actions, route configs.

---

### ❓ How does TypeScript's type inference work?

### 📝 Answer

TypeScript automatically determines types when you don't specify them.

**Variable initialization:**

```ts
let s = "hello";        // inferred: string
let n = 123;            // inferred: number
let b = true;           // inferred: boolean
```

**Function return types:**

```ts
function add(a: number, b: number) {
  return a + b;          // inferred return: number
}
```

**Arrays and objects:**

```ts
const numbers = [1, 2, 3];                    // inferred: number[]
const user = { name: "Alice", age: 30 };       // inferred: { name: string; age: number }
```

> 💡 **Best practice**: let TS infer where possible — only annotate when it adds clarity (function parameters, exported APIs).

---

# 🆚 Part 2 — Types vs Interfaces

### ❓ Difference between `type` and `interface`. When do you use each?

### 📝 Answer

| Feature                  | `interface`                    | `type` alias                            |
| ------------------------ | ------------------------------ | --------------------------------------- |
| Object shape             | ✅ Yes                         | ✅ Yes                                  |
| Extension                | `extends`                      | Intersection (`&`)                      |
| Declaration merging      | ✅ **Yes** (auto-merges)       | ❌ No (duplicate identifier error)      |
| Unions / primitives      | ❌ No                          | ✅ Yes                                  |
| Tuples                   | ❌ Awkward                     | ✅ Clean                                |
| Computed / mapped types  | ❌ No                          | ✅ Yes                                  |

**Interface — for object shapes (extendable):**

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

interface Admin extends User {
  role: "admin";
}
```

**Type — flexible compositions:**

```ts
type ID = number;                                  // primitive alias
type Coordinates = [number, number];               // tuple
type Status = "success" | "error" | "loading";     // union
type Product = { name: string };
type DetailedProduct = Product & { price: number }; // intersection
```

**Declaration merging (interface only):**

```ts
interface Config { apiUrl: string; }
interface Config { timeout: number; }              // ✅ merges

const cfg: Config = { apiUrl: "...", timeout: 5000 };

// type aliases would error:
// type MyType = { a: string };
// type MyType = { b: number };  // ❌ Duplicate identifier
```

> 💡 **Rule of thumb**:
> - Use `interface` for **object shapes**, especially public APIs you might extend later
> - Use `type` for **unions, primitives, tuples, mapped types**, or anything not purely an object

---

# 🧬 Part 3 — Generics & Mapped Types

### ❓ Explain Generics with constraints

### 📝 Answer

**Generic** = placeholder type that makes code reusable for many types.
**Constraint** = limit on what types the generic can accept (using `extends`).

```ts
// T must have a 'length' property
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength("hello");        // ✅ string has length
getLength([1, 2, 3]);      // ✅ array has length
// getLength(10);          // ❌ number has no length
```

**Multiple type parameters:**

```ts
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const result = pair("age", 30);   // type: [string, number]
```

**Default type parameter:**
```ts
function createState<T = string>(initial: T): T {
  return initial;
}

const s = createState("hi");       // T = string
const n = createState<number>(42); // T = number
```

---

### ❓ What are mapped types?

### 📝 Answer

**Mapped types** apply a transformation to each property of an existing type to produce a new type.

```ts
type Person = { name: string; age: number };

// Make all properties optional
type PartialPerson = { [P in keyof Person]?: Person[P] };

const p1: PartialPerson = { name: "Alice" };       // ✅
const p2: PartialPerson = {};                       // ✅
```

**Modifiers:**
```ts
// Make all properties readonly
type Frozen<T> = { readonly [K in keyof T]: T[K] };

// Remove optional/readonly
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Required<T> = { [K in keyof T]-?: T[K] };
```

**Built-in `Partial`, `Required`, `Readonly` work this way.**

---

# 🛠️ Part 4 — Utility Types

### ❓ Explain `Partial`, `Pick`, `Omit`, `ReturnType`

### 📝 Answer

**1️⃣ `Partial<T>` — All properties become optional**

```ts
interface User { id: number; name: string; email: string; }

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

function updateProfile(fields: PartialUser) { /* ... */ }
updateProfile({ name: "Jane Doe" });    // ✅ Valid
```

**2️⃣ `Pick<T, K>` — Select specific properties**

```ts
interface Product { id: number; name: string; price: number; description: string; }

type ProductSummary = Pick<Product, "id" | "name">;
// { id: number; name: string; }
```

**3️⃣ `Omit<T, K>` — Remove specific properties**

```ts
interface UserDetails { id: number; username: string; email: string; passwordHash: string; }

type PublicUser = Omit<UserDetails, "passwordHash">;
// { id: number; username: string; email: string; }
```

**4️⃣ `ReturnType<T>` — Extract a function's return type**

```ts
const getUserData = () => ({ id: 1, name: "Alice", role: "admin" });

type UserData = ReturnType<typeof getUserData>;
// { id: number; name: string; role: string; }
```

---

### ❓ Other commonly-used utility types
### 📝 Answer

| Utility            | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `Required<T>`      | Make all properties required                      |
| `Readonly<T>`      | Make all properties readonly                      |
| `Record<K, T>`     | Object type with keys `K` and values `T`          |
| `Exclude<T, U>`    | Remove union members assignable to `U`            |
| `Extract<T, U>`    | Keep only union members assignable to `U`         |
| `NonNullable<T>`   | Remove `null` and `undefined` from union          |
| `Parameters<T>`    | Tuple of function parameter types                 |
| `Awaited<T>`       | Recursively unwrap Promise types                  |

```ts
// Record
type RoleMap = Record<"admin" | "user" | "guest", string[]>;
// { admin: string[]; user: string[]; guest: string[]; }

// Exclude / Extract
type Status = "loading" | "success" | "error";
type FinalStatus = Exclude<Status, "loading">;        // "success" | "error"
type LoadingOnly = Extract<Status, "loading">;        // "loading"

// NonNullable
type MaybeStr = string | null | undefined;
type DefStr = NonNullable<MaybeStr>;                  // string

// Parameters
function greet(name: string, age: number) { /* ... */ }
type GreetArgs = Parameters<typeof greet>;            // [string, number]

// Awaited (ES2022+)
type Result = Awaited<Promise<Promise<number>>>;      // number
```

---

# 🔍 Part 5 — Type Guards & Narrowing

### ❓ What are `never`, `unknown`, and `void`? When to use each?

### 📝 Answer

| Type        | Meaning                                            | Use Case                          |
| ----------- | -------------------------------------------------- | --------------------------------- |
| `never`     | Value that **never occurs** (function never returns) | Throw functions, exhaustive checks |
| `unknown`   | Safer alternative to `any` — must be type-checked  | API responses, third-party data    |
| `void`      | Function returns nothing                           | Side-effect functions              |
| `any`       | ⚠️ Disables type checking (avoid)                 | Migration from JS, escape hatch    |

```ts
// never: unreachable code
function fail(message: string): never {
  throw new Error(message);
}

// unknown: must narrow before use
let x: unknown = "hi";
// x.toUpperCase();              // ❌ Error
if (typeof x === "string") {
  x.toUpperCase();                // ✅ Narrowed to string
}

// void: no return value
function log(msg: string): void {
  console.log(msg);
}
```

> 💡 **`unknown` vs `any`**: both accept any value, but `unknown` forces you to **prove the type** before using it. Always prefer `unknown`.

---

#### ↳ Follow-up: How do you create custom type guards?

### 📝 Answer

A **custom type guard** is a function that returns a **type predicate** (`x is Type`), telling TypeScript how to narrow the type at runtime.

```ts
function isNumber(val: unknown): val is number {
  return typeof val === "number";
}

const input: unknown = 10;

if (isNumber(input)) {
  console.log(input.toFixed(2));   // ✅ 'input' is now number
}
```

**Real-world example:**
```ts
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(animal: Cat | Dog): animal is Cat {
  return "meow" in animal;
}

function speak(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow();         // TS knows it's Cat
  } else {
    animal.bark();         // TS knows it's Dog
  }
}
```

---

# 🎯 Part 6 — Discriminated Unions

#### ↳ Follow-up: What are discriminated unions?

### 📝 Answer

Discriminated unions group related types using a common **literal property** (the **discriminant**), allowing TypeScript to safely narrow the type.

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "square":    return shape.side ** 2;
    case "rectangle": return shape.width * shape.height;
  }
}
```

**Exhaustiveness check with `never`:**
```ts
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "square":    return shape.side ** 2;
    case "rectangle": return shape.width * shape.height;
    default:
      const _exhaustive: never = shape;       // ✅ Errors if a new shape is added
      return _exhaustive;
  }
}
```

> 💡 If you add a new variant to `Shape`, the `never` check **fails at compile time** — forcing you to handle it.

---

# 🧠 Part 7 — Advanced Concepts

#### ↳ Follow-up: Can you walk me through declaration merging in TypeScript and give a practical example?

### 📝 Answer

**Declaration merging** combines multiple declarations with the same name into a single definition. Works with `interface`, `namespace`, and `enum` — **but NOT `type`**.

```ts
interface Config { apiUrl: string; }
interface Config { timeout: number; }       // ✅ Merged

const cfg: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};

// Type aliases CANNOT merge:
// type MyType = { a: string };
// type MyType = { b: number };             // ❌ Duplicate identifier
```

> 💡 **Practical use**: extending third-party library types (e.g., adding properties to Express's `Request` interface).

```ts
// Augmenting Express's Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}
```

---

### ❓ Explain structural typing in TypeScript

### 📝 Answer

**Structural typing** = two types are compatible if their **shapes match**, regardless of their declared names.

> If the structure fits, the type fits. (Also called **"duck typing"**.)

```ts
interface Point { x: number; y: number; }

function printPoint(p: Point) {
  console.log(`x: ${p.x}, y: ${p.y}`);
}

const myCoords = { x: 10, y: 20 };
printPoint(myCoords);             // ✅ Works — same shape
```

> 💡 Contrast with **nominal typing** (Java/C#): `MyPoint` and `Point` would be incompatible even with the same shape. TypeScript is structural by default.

---

### ❓ What are decorators and how are they applied?

### 📝 Answer

**Decorators** are annotations that modify classes, methods, properties, or parameters at runtime.

> ⚠️ Currently a Stage 3 proposal. Enable in `tsconfig.json` with `"experimentalDecorators": true`.

```ts
function Logger(target: Function) {
  console.log(`Class loaded: ${target.name}`);
}

@Logger
class User {
  constructor(public name: string) {}
}
// Logs: "Class loaded: User"
```

**Method decorator example:**

```ts
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number) { return a + b; }
}
```

> 💡 **Common use**: Angular's `@Component`, `@Injectable`, `@Input` are all decorators.

---

# ✨ Part 8 — Modern TypeScript Features
#### ↳ Follow-up: How does the `satisfies` operator work and when would you use it over a type annotation?
### 📝 Answer

`satisfies` (TS 4.9+) checks that a value matches a type **without widening or narrowing the inferred type**.

```ts
type Color = { r: number; g: number; b: number };

// ❌ Without satisfies: value typed as Color (loses literal info)
const palette: Record<string, Color> = {
  red:   { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
};
palette.red.toString();   // works on any value, not just defined keys

// ✅ With satisfies: keeps literal types AND validates
const palette2 = {
  red:   { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
} satisfies Record<string, Color>;

palette2.red;             // ✅ Type-safe
palette2.blue;            // ❌ Error: doesn't exist
```

> 💡 Best of both worlds: type validation **without** losing inference.

---

#### ↳ Follow-up: What are Template Literal Types?
### 📝 Answer

**Template literal types** allow building string types using template syntax.

```ts
type Greeting = `Hello, ${string}!`;
const g1: Greeting = "Hello, World!";   // ✅
// const g2: Greeting = "Hi, World!";    // ❌

// More powerful: combine with unions
type Margin = `margin-${"top" | "right" | "bottom" | "left"}`;
// "margin-top" | "margin-right" | "margin-bottom" | "margin-left"

type CSSDirection = "row" | "column";
type FlexDirection = `${CSSDirection}${"" | "-reverse"}`;
// "row" | "row-reverse" | "column" | "column-reverse"
```

> 💡 Useful for typing event names, CSS properties, route paths.

---

#### ↳ Follow-up: How do `enum` and `as const` compare, and when would you prefer one over the other?
### 📝 Answer

```ts
// Traditional enum (generates JS object)
enum Status { Pending, Active, Done }
// Compiles to: var Status = { 0: "Pending", Pending: 0, ... }

// as const (literal union, zero runtime overhead)
const Status = {
  Pending: "PENDING",
  Active:  "ACTIVE",
  Done:    "DONE",
} as const;

type StatusType = typeof Status[keyof typeof Status];
// "PENDING" | "ACTIVE" | "DONE"
```

| Feature              | `enum`                  | `as const` object        |
| -------------------- | ----------------------- | ------------------------ |
| Generates JS code    | ✅ Yes                  | ❌ No (just a const)     |
| Tree-shakeable       | ❌ No                   | ✅ Yes                   |
| Reverse mapping      | ✅ (numeric enums)      | ❌                       |
| TypeScript-only      | ⚠️ Yes (not ECMAScript) | ✅ Standard JS           |

> 💡 **Modern preference**: use `as const` objects or string literal unions over `enum` — better tree-shaking, no runtime cost.

---

#### ↳ Follow-up: Can you explain `keyof` and `typeof` in TypeScript and show how they work together?
### 📝 Answer

**`typeof`** — get the **type** of a value.

```ts
const user = { name: "Dev", age: 30 };
type User = typeof user;            // { name: string; age: number }
```

**`keyof`** — get the **union of keys** of a type.

```ts
type UserKeys = keyof User;         // "name" | "age"
```

**Combined — type-safe property access:**

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Dev", age: 30 };
const n = get(user, "name");        // type: string
// const x = get(user, "email");    // ❌ Error: not a key
```

> 💡 The combination `T[keyof T]` extracts the union of all value types in `T`.

---
