# TypeScript

## Definition

TypeScript adds a static type system to JavaScript. The repository material focuses heavily on type inference, object modeling, generics, mapped types, and utility types.

## Core Concepts

### Type Inference
TypeScript can infer types from initialization and function return expressions.

```ts
let s = "hello"; // string
let n = 123;     // number
let b = true;    // boolean
```

The source recommends allowing inference where it is clear and adding annotations where they improve clarity, such as function parameters and exported APIs.

### `type` vs `interface`

| Capability | `interface` | `type` |
|---|---|---|
| Object shape | Yes | Yes |
| Extension | `extends` | `&` intersection |
| declaration merging | Yes | No |
| Unions/primitives | No | Yes |
| Tuples | Less direct | Yes |
| Mapped/computed types | No | Yes |

The source rule of thumb is to use interfaces for extendable object shapes and types for unions, primitives, tuples, mapped types, and flexible compositions.

### Generics
A generic is a placeholder type that allows reusable code.

Constraints restrict accepted types:

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}
```

The source also covers multiple type parameters and default type parameters.

### Mapped Types
Mapped types transform properties of an existing type.

```ts
type Person = { name: string; age: number };
type PartialPerson = { [P in keyof Person]?: Person[P] };
```

The source covers property modifiers such as `readonly` and optional/required transformations.

### Utility Types
Source-covered utility types include:

- `Partial<T>`
- `Pick<T, K>`
- `Omit<T, K>`
- `ReturnType<T>`
- `Required<T>`
- `Readonly<T>`
- `Record<K, T>`
- `Exclude<T, U>`
- `Extract<T, U>`
- `NonNullable<T>`
- `Parameters<T>`
- `Awaited<T>`

### `const` vs `as const`
The source distinguishes variable reassignment from readonly/literal inference.

- `const` prevents variable reassignment but does not make object contents deeply readonly.
- `as const` produces readonly/literal types.

## Learning Path

1. Type inference
2. Types and interfaces
3. Generics
4. Constraints
5. Mapped types
6. Utility types
7. Advanced type composition

## Repository Resources

- Interview source: `interview/frontend/04-TypeScript.md`
- Roadmap foundations: `roadmap/foundations/README.md`

## Source Boundary

This page reflects the supplied repository evidence and does not claim to cover the full TypeScript language.

