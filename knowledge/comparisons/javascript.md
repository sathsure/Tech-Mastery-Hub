# JavaScript — Comparisons

> The classic "X vs Y" questions, side by side.

## `var` vs `let` vs `const`
| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | function | block | block |
| Re-assign | ✅ | ✅ | ❌ |
| Hoisted as | `undefined` | locked (TDZ) | locked (TDZ) |
| Use today? | no | when the value changes | by default |

## `==` vs `===`
| | `==` | `===` |
|---|---|---|
| Converts types first | ✅ | ❌ |
| `0 == "0"` | `true` | `false` |
| Use | almost never | always |

## `null` vs `undefined`
| | `null` | `undefined` |
|---|---|---|
| Meaning | empty on purpose | not set yet |
| `typeof` | `"object"` (old bug) | `"undefined"` |
| Set by | you | JavaScript |

## Arrow function vs normal function
| | Arrow `() => {}` | `function () {}` |
|---|---|---|
| Own `this` | ❌ (uses outer) | ✅ (depends on call) |
| `arguments` | ❌ | ✅ |
| Use with `new` | ❌ | ✅ |
| Best for | callbacks | methods, constructors |

## `map` vs `forEach` vs `filter` vs `reduce`
| | Returns | Use for |
|---|---|---|
| `map` | new array, same length | transform each item |
| `forEach` | nothing | side effects |
| `filter` | new array, fewer items | keep some items |
| `reduce` | one value | totals, grouping |

## Promise vs async/await
| | Promise `.then()` | `async/await` |
|---|---|---|
| Style | chained callbacks | reads like normal code |
| Errors | `.catch()` | `try/catch` |
| Same thing underneath? | ✅ | ✅ |

## Microtask vs macrotask
| | Microtask | Macrotask |
|---|---|---|
| Examples | Promise `.then`, `queueMicrotask` | `setTimeout`, I/O, clicks |
| When it runs | right after current code, all of them | one per loop turn |

## `localStorage` vs `sessionStorage` vs cookies
| | `localStorage` | `sessionStorage` | Cookies |
|---|---|---|---|
| Lasts | until cleared | until tab closes | until expiry |
| Size | ~5 MB | ~5 MB | ~4 KB |
| Sent to server | ❌ | ❌ | ✅ every request |

## Debounce vs throttle
| | Debounce | Throttle |
|---|---|---|
| Runs | after activity stops | at most once per interval |
| Example | search box | scroll / resize |

## Shallow vs deep copy
| | Shallow `{...obj}` | Deep `structuredClone(obj)` |
|---|---|---|
| Nested objects | shared | copied |

## `defer` vs `async` scripts
| | `defer` | `async` |
|---|---|---|
| Runs | after HTML is parsed | as soon as loaded |
| Order kept | ✅ | ❌ |
