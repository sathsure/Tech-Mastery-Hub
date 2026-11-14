# TypeScript — Cheat Sheet

> **In one line:** JavaScript with types. Mistakes are caught while you write code; the types are removed when it runs.

## Basic types
- `string`, `number`, `boolean`, arrays `number[]`, tuples `[string, number]`.
- **`any`** — turns checking off. Avoid it.
- **`unknown`** — "could be anything"; you must check it before use. The safe `any`.
- **`never`** — a value that can't happen (a function that always throws).
- **`void`** — a function returns nothing.

```ts
let id: number = 5;
let names: string[] = ["A", "B"];
function log(msg: string): void { console.log(msg); }
```

## interface vs type
- **`interface`** — describes an object's shape. Can be extended and merged.
- **`type`** — can also describe unions, tuples and primitives.
- Simple rule: `interface` for objects, `type` for unions.

```ts
interface User { id: number; name: string; email?: string }   // ? = optional
type Status = "loading" | "success" | "error";                  // union of fixed values
```

## Narrowing
Checking a value so TypeScript knows its exact type.
- `typeof x === "string"`, `x instanceof Date`, `"email" in user`.
- **Discriminated union** — a shared field (like `kind`) tells the cases apart.

```ts
type Shape = { kind: "circle"; r: number } | { kind: "square"; side: number };
function area(s: Shape) {
  return s.kind === "circle" ? Math.PI * s.r ** 2 : s.side ** 2;
}
```

## Generics
Write once, keep the type.
```ts
function first<T>(items: T[]): T { return items[0]; }
first([1, 2]);      // TypeScript knows it's a number
```

## Utility types
- `Partial<T>` — all fields optional.
- `Required<T>` — all fields required.
- `Readonly<T>` — nothing can change.
- `Pick<T, "a">` — keep some fields. `Omit<T, "a">` — drop some fields.
- `Record<K, V>` — an object with keys `K` and values `V`.
- `ReturnType<typeof fn>` — the type a function returns.

```ts
type UserUpdate = Partial<User>;          // for PATCH requests
type Public = Omit<User, "email">;
```

## Classes
- `public`, `private`, `protected`, `readonly`, `abstract`.
- Short constructor: `constructor(private http: HttpClient) {}` (common in Angular).

## Other must-knows
- **Structural typing** — types match by shape, not by name.
- **Type assertion** `x as User` — you tell the compiler to trust you (no runtime check).
- **`as const`** — makes values fixed and read-only.
- **Enums** — named constants; a union of strings is often simpler.
- **`.d.ts` files** — types for JavaScript libraries (`@types/...`).
- **`tsconfig.json`** — compiler settings; turn on `"strict": true`.
