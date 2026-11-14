# TypeScript — One-liners

> The most asked questions, each answered in one sentence.

1. **What is TypeScript?** — JavaScript with static types that are checked while coding and removed when compiled.
2. **`interface` vs `type`?** — Both describe shapes; `type` can also make unions and tuples, while `interface` can be extended and merged.
3. **`any` vs `unknown`?** — `any` turns off checking; `unknown` forces you to check the type before using it.
4. **What is `never`?** — A type for values that can never happen, like a function that always throws.
5. **What are generics?** — Type parameters (`<T>`) that let one function or class work with many types while keeping type safety.
6. **What is a union type?** — A value that can be one of several types, like `string | number`.
7. **What is narrowing?** — Checking a value (`typeof`, `instanceof`, `in`) so TypeScript knows its exact type inside that block.
8. **What is a discriminated union?** — A union where each member has a shared literal field (like `kind`) that tells them apart.
9. **What does `Partial<T>` do?** — Makes every property of `T` optional.
10. **`Pick` vs `Omit`?** — `Pick` keeps the listed properties; `Omit` removes them.
11. **What is `Record<K, V>`?** — An object type whose keys are `K` and values are `V`.
12. **What does `keyof` do?** — Gives a union of an object type's property names.
13. **What is a type assertion?** — `value as Type`, which tells the compiler to trust you without any runtime check.
14. **What is the `!` operator?** — A non-null assertion saying a value is not `null` or `undefined`.
15. **What is structural typing?** — Types are compatible if their shapes match, regardless of their names.
16. **What is `as const`?** — It makes a value read-only and keeps its exact literal types.
17. **What are `.d.ts` files?** — Files that only describe types, often for JavaScript libraries.
18. **What does `strict` mode turn on?** — Strong checks such as `strictNullChecks` and `noImplicitAny`.
19. **Enum vs union of strings?** — An enum creates runtime code; a string union is lighter and usually simpler.
20. **What does `satisfies` do?** — It checks a value against a type but keeps the value's more precise inferred type.
