# TypeScript — Code Snippets

> Code interviewers ask you to write from memory. Short, commented, ready to explain.

### 1. Generic function with a constraint
```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
getProp({ id: 1, name: "Asha" }, "name");   // string
```

### 2. Discriminated union + exhaustive check
```ts
type Result =
  | { status: "ok"; data: string }
  | { status: "error"; message: string };

function show(r: Result): string {
  switch (r.status) {
    case "ok": return r.data;
    case "error": return r.message;
    default: { const never: never = r; return never; }   // compile error if a case is missing
  }
}
```

### 3. Write your own `Partial` and `Readonly`
```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
```

### 4. Type guard
```ts
interface Cat { meow(): void }
interface Dog { bark(): void }
function isCat(pet: Cat | Dog): pet is Cat {
  return "meow" in pet;
}
```

### 5. Unwrap a Promise type
```ts
type Awaited2<T> = T extends Promise<infer R> ? R : T;
type A = Awaited2<Promise<number>>;   // number
```

### 6. Typed API response
```ts
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };

async function getJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.ok ? { data: (await res.json()) as T, error: null } : { data: null, error: res.statusText };
}
const users = await getJson<User[]>("/api/users");
```

### 7. `as const` for safe constants
```ts
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = typeof ROLES[number];          // "admin" | "editor" | "viewer"
```
