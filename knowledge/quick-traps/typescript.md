# TypeScript — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. `any` hides bugs
- ❌ `let data: any = fetchData(); data.nmae;` compiles fine.
- ✅ Use `unknown` and check the value first, or give it a real type.

### 2. Types don't exist at runtime
- ❌ `if (x instanceof User)` when `User` is an interface → error.
- ✅ Interfaces disappear after compiling. Check a field instead (`"email" in x`) or use a class.

### 3. `as` doesn't convert anything
- ❌ `const n = "5" as unknown as number; n + 1` → `"51"`
- ✅ `as` only silences the compiler. Convert for real: `Number("5")`.

### 4. Optional isn't the same as `| undefined`
- ❌ Thinking `name?: string` and `name: string | undefined` are equal.
- ✅ With `?` the field can be left out; with `| undefined` it must be written (even as `undefined`).

### 5. The `!` operator
- ❌ `user!.name` when `user` really is `null` → crash at runtime.
- ✅ `!` is a promise to the compiler, not a check. Use `user?.name` or an `if`.

### 6. `{}` and `Object` mean "almost anything"
- ❌ `function f(x: {})` accepts `5` and `"hi"`.
- ✅ For a plain object use `Record<string, unknown>`.

### 7. Numeric enums accept any number
- ❌ `enum Role { Admin, User }` → `const r: Role = 99` compiles.
- ✅ Prefer a string union: `type Role = "admin" | "user"`.

### 8. Extra fields on object literals
- ❌ `const u: User = { id: 1, name: "A", age: 3 }` → error (extra field).
- ✅ Literal objects are checked strictly; the same object passed through a variable is not.

### 9. Without `strict`, `null` slips through
- ❌ `let name: string = null` compiles when `strictNullChecks` is off.
- ✅ Turn on `"strict": true` in `tsconfig.json`.

### 10. `interface` vs `type` merging
- ❌ Declaring `type User` twice → error.
- ✅ Two `interface User` declarations merge into one (useful for extending library types).
