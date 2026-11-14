# TypeScript — Comparisons

> The classic "X vs Y" questions, side by side.

## `interface` vs `type`
| | `interface` | `type` |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Unions, tuples, primitives | ❌ | ✅ |
| Merge by declaring twice | ✅ | ❌ |
| Extend | `extends` | `&` |

## `any` vs `unknown` vs `never`
| | `any` | `unknown` | `never` |
|---|---|---|---|
| Meaning | anything, unchecked | anything, must check first | nothing can be here |
| Safe? | ❌ | ✅ | ✅ |
| Example | old JS code | `JSON.parse` result | function that always throws |

## Enum vs union of strings
| | `enum Role { Admin }` | `type Role = "admin"` |
|---|---|---|
| Creates runtime code | ✅ | ❌ |
| Numeric enums accept any number | ✅ (trap) | — |
| Usually preferred | | ✅ |

## Type assertion vs type annotation
| | Annotation `const u: User = …` | Assertion `… as User` |
|---|---|---|
| Checks the value fits | ✅ | ❌ (trusts you) |

## `Pick` vs `Omit`
| | `Pick<User, "id">` | `Omit<User, "password">` |
|---|---|---|
| Result | only listed fields | all fields except listed |

## Optional `?` vs `| undefined`
| | `name?: string` | `name: string \| undefined` |
|---|---|---|
| Field may be missing | ✅ | ❌ (must be written) |

## Structural vs nominal typing
| | Structural (TypeScript) | Nominal (Java) |
|---|---|---|
| Types match when | shapes match | names match |

## TypeScript vs JavaScript
| | TypeScript | JavaScript |
|---|---|---|
| Types | static, checked while coding | dynamic |
| Runs directly in browser | ❌ (compiled to JS) | ✅ |
| Catches typos early | ✅ | ❌ |
