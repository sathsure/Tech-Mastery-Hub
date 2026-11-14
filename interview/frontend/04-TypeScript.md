# 🔷 TypeScript Interview Preparation

---

# 🧱 Part 1 — Basics

### ❓ Difference between `const` and `as const`?

### 📝 Answer

They do different jobs: `const` is about the **variable**; `as const` is about the **value's type**.

| | `const` (JavaScript) | `as const` (TypeScript assertion) |
| --- | --- | --- |
| Stops re-assigning the variable? | ✅ Yes | ❌ Not its job (`let x = [1] as const` can be reassigned) |
| Stops changing the contents? | ❌ No — objects/arrays stay mutable | ✅ Yes, deeply `readonly` (compile-time only) |
| Inferred type | Wider (`number[]`, `{ a: number }`) | **Literal** (`readonly [1, 2, 3]`, `{ readonly a: 1 }`) |

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

**Level:** 🟡 Intermediate

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

**Level:** 🟡 Intermediate

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
The default is used only when TypeScript **can't infer** `T` and you don't pass it:

```ts
class Store<T = string> {
  private items: T[] = [];
  add(item: T) { this.items.push(item); }
}

const names = new Store();          // T = string (default — nothing to infer from)
const ids = new Store<number>();    // T = number (given explicitly)
```

---

### ❓ What are mapped types?

**Level:** 🟡 Intermediate

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
type AllRequired<T> = { [K in keyof T]-?: T[K] };   // same as the built-in Required<T>
```

**Built-in `Partial`, `Required`, `Readonly` work this way.**

---

# 🛠️ Part 4 — Utility Types

### ❓ Explain `Partial`, `Pick`, `Omit`, `ReturnType`

**Level:** 🟡 Intermediate

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

**Level:** 🟡 Intermediate
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

// Awaited (TypeScript 4.5+)
type Result = Awaited<Promise<Promise<number>>>;      // number
```

---

# 🔍 Part 5 — Type Guards & Narrowing

### ❓ What are `never`, `unknown`, and `void`? When to use each?

**Level:** 🟡 Intermediate

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

**Decorators** are functions written as `@name` above a class, method or property. They run **once, when the class is defined**, and can add metadata or replace/wrap the decorated thing.

> ⚠️ There are **two versions**:
> - **Standard decorators** (TC39 proposal, supported by TypeScript 5.0+ with **no flag**) — classes, methods, accessors, fields.
> - **Legacy decorators** (`"experimentalDecorators": true`) — also support **parameter** decorators; used by Angular and NestJS. The examples below use this style.

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

// ❌ With a type annotation, the variable's type becomes exactly Record<string, Color>
const palette: Record<string, Color> = {
  red:   { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
};
palette.blue.r;           // ✅ compiles — any string key is allowed... but crashes at runtime (undefined)

// ✅ With satisfies: checked against the type, but keeps its own precise type
const palette2 = {
  red:   { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
} satisfies Record<string, Color>;

palette2.red.r;           // ✅ type-safe
palette2.blue;            // ❌ compile error: 'blue' doesn't exist
// and a typo like { r: 255, g: 0, bb: 0 } is still caught by the check
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

> 💡 **Modern preference**: use `as const` objects or string literal unions over `enum` — better tree-shaking, no runtime cost. Another reason: Node.js's built-in TypeScript support (type stripping) and TS 5.8's `erasableSyntaxOnly` option **don't allow `enum`**, because it isn't plain JavaScript with types removed.

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


## Core Type System (Intermediate)

### ❓ What are union and intersection types?

### 📝 Answer

- **Union `A | B`** — the value is **one of** the types.
- **Intersection `A & B`** — the value has **everything from both**.

```ts
type Id = string | number;                       // union
type Status = "loading" | "success" | "error";   // union of literal values

type Timestamps = { createdAt: Date };
type User = { id: number; name: string };
type SavedUser = User & Timestamps;              // intersection: id, name, createdAt
```

With a union you may only use what **all** members share, until you narrow it:

```ts
function show(id: Id) {
  id.toUpperCase();                                // ❌ number has no toUpperCase
  if (typeof id === "string") id.toUpperCase();    // ✅
}
```

#### ↳ Follow-up: What is `string & number`?

↪ `never` — no value can be both.

---

### ❓ What is type narrowing, and what are type guards?

### 📝 Answer

**Narrowing** means TypeScript learns a more exact type inside a block, from a check you write.

| Guard | Example |
|---|---|
| `typeof` | `typeof x === "string"` |
| `instanceof` | `err instanceof HttpError` |
| `in` | `"email" in user` |
| Equality / truthiness | `if (user)`, `x === null` |
| Custom guard (`is`) | `function isCat(p): p is Cat` |

```ts
interface Cat { meow(): void }
interface Dog { bark(): void }

function isCat(pet: Cat | Dog): pet is Cat {   // custom type guard
  return "meow" in pet;
}

function speak(pet: Cat | Dog) {
  if (isCat(pet)) pet.meow();   // Cat here
  else pet.bark();              // Dog here
}
```

#### ↳ Follow-up: What is an assertion function?

↪ `function assertIsString(x: unknown): asserts x is string { … }` — it throws if the check fails, and after the call TypeScript treats `x` as a string.

---

### ❓ What is a discriminated union, and why is it useful?

### 📝 Answer

A union where every member has the **same literal field** (the "tag", e.g. `kind` or `status`). Checking the tag narrows to exactly one member.

```ts
type Result =
  | { status: "ok"; data: User[] }
  | { status: "error"; message: string }
  | { status: "loading" };

function render(r: Result) {
  switch (r.status) {
    case "ok": return r.data.length;      // data exists here
    case "error": return r.message;       // message exists here
    case "loading": return "…";
    default: {
      const unreachable: never = r;       // compile error if a new case isn't handled
      return unreachable;
    }
  }
}
```

**Why it helps:** impossible states disappear (no `data` together with `error`), and the `never` check makes the compiler remind you when a new case is added.

#### ↳ Follow-up: Where is this used in real apps?

↪ API results, Redux/NgRx actions (the `type` field), form states, payment statuses.

---

### ❓ Enum vs union of string literals — which should you use?

### 📝 Answer

```ts
enum Role { Admin = "ADMIN", User = "USER" }   // generates a real JS object
type RoleU = "ADMIN" | "USER";                  // disappears after compiling
```

| | `enum` | String literal union |
|---|---|---|
| Runtime code | ✅ (an object) | ❌ (zero cost) |
| Loop over the values | ✅ `Object.values(Role)` | use an `as const` array |
| Numeric enums accept any number | ⚠️ yes | — |
| Works with plain JSON strings | needs mapping | ✅ directly |

Most teams prefer **unions**, plus an `as const` array when they need the list at runtime:

```ts
const ROLES = ["ADMIN", "USER"] as const;
type Role = typeof ROLES[number];   // "ADMIN" | "USER"
```

#### ↳ Follow-up: What is a `const enum`?

↪ An enum inlined at compile time (no object). It breaks with some build tools (`isolatedModules`), so many teams avoid it.

---

### ❓ What are conditional types and `infer`?

### 📝 Answer

A **conditional type** picks a type with a condition: `T extends X ? A : B`.
`infer` **pulls out** a type from inside another type.

```ts
type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<"hi">;                 // "yes"

type ElementOf<T> = T extends (infer E)[] ? E : T;
type B = ElementOf<number[]>;            // number

type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
type C = UnwrapPromise<Promise<User>>;   // User
```

Built-in utilities work this way: `ReturnType`, `Parameters`, `Awaited`, `Exclude`, `Extract`, `NonNullable`.

**Distributive:** on a union, a conditional type runs **per member** —
`Exclude<"a" | "b" | "c", "a">` → `"b" | "c"`.

#### ↳ Follow-up: How do you stop it from distributing?

↪ Wrap both sides in a tuple: `[T] extends [string] ? … : …`.

---

### ❓ What do `keyof`, `typeof` and indexed access types do?

### 📝 Answer

| Operator | Gives | Example |
|---|---|---|
| `keyof T` | a union of property names | `keyof User` → `"id" \| "name"` |
| `typeof value` | the type of a **value** | `typeof config` |
| `T[K]` | the type of one property | `User["name"]` → `string` |

```ts
const config = { apiUrl: "/api", retries: 3 };
type Config = typeof config;                 // { apiUrl: string; retries: number }
type ConfigKey = keyof Config;               // "apiUrl" | "retries"

function get<K extends keyof Config>(key: K): Config[K] {
  return config[key];
}
get("retries");   // number
```

#### ↳ Follow-up: How do you get a union of all value types?

↪ `T[keyof T]` — for example `Config[keyof Config]` → `string | number`.

---

### ❓ What does the `satisfies` operator do?

### 📝 Answer

`satisfies` **checks** a value against a type but **keeps the value's exact inferred type**. A normal annotation (`: Type`) widens it.

```ts
type Theme = Record<string, string | number[]>;

const a: Theme = { primary: "#06f", spacing: [4, 8] };
a.primary.toUpperCase();      // ❌ type is string | number[] — widened

const b = { primary: "#06f", spacing: [4, 8] } satisfies Theme;
b.primary.toUpperCase();      // ✅ still string
b.spacing.map(n => n * 2);    // ✅ still number[]
```

Use it for config objects and route maps: you get validation **and** precise types.

#### ↳ Follow-up: `satisfies` vs `as`?

↪ `as` silences the compiler (no check). `satisfies` really checks and errors if the value doesn't fit.

---

### ❓ What does `strict` mode in `tsconfig.json` turn on, and why use it?

### 📝 Answer

`"strict": true` turns on a family of checks. The most important:

| Option | Catches |
|---|---|
| `strictNullChecks` | using a value that may be `null` / `undefined` |
| `noImplicitAny` | parameters silently becoming `any` |
| `strictFunctionTypes` | unsafe function parameter types |
| `strictPropertyInitialization` | class fields that are never assigned |
| `useUnknownInCatchVariables` | `catch (e)` gives `unknown`, not `any` |

```ts
function len(s?: string) {
  return s.length;   // ❌ with strict: 's' is possibly 'undefined'
}
```

Other useful settings: `noUncheckedIndexedAccess` (array/map reads may be `undefined`), `target`, `module`, `paths` (import aliases), `outDir`.

#### ↳ Follow-up: How do you turn on strict in an old codebase?

↪ Turn on one flag at a time (`strictNullChecks` first is the biggest win) and fix errors folder by folder.

---

### ❓ How do access modifiers and abstract classes work in TypeScript?

### 📝 Answer

| Modifier | Accessible from |
|---|---|
| `public` (default) | anywhere |
| `protected` | the class and its subclasses |
| `private` | only the class (checked at compile time only) |
| `#field` | only the class — **real** JavaScript privacy at runtime |
| `readonly` | set only in the declaration or the constructor |

```ts
abstract class Shape {
  constructor(protected readonly name: string) {}   // parameter property
  abstract area(): number;                           // subclasses must implement it
  describe() { return `${this.name}: ${this.area()}`; }
}

class Circle extends Shape {
  constructor(private r: number) { super("circle"); }
  area() { return Math.PI * this.r ** 2; }
}

new Shape("x");   // ❌ cannot create an instance of an abstract class
```

#### ↳ Follow-up: `private` vs `#private`?

↪ `private` disappears after compiling (`(obj as any).x` still works). `#x` is enforced by JavaScript itself.

#### ↳ Follow-up: Abstract class vs interface?

↪ An interface is only a shape (no code). An abstract class can share code and state, but a class can extend only one.

---
