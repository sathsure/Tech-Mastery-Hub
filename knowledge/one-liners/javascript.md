# JavaScript — One-liners

> The most asked questions, each answered in one sentence.

1. **What is a closure?** — A function that remembers the variables of the place it was created, even after that place has finished running.
2. **`let` vs `const` vs `var`?** — `let` and `const` are block-scoped (`const` can't be re-assigned); `var` is function-scoped and should be avoided.
3. **What is hoisting?** — Declarations are moved to the top of their scope before code runs; `var` starts as `undefined`, `let`/`const` stay locked until their line.
4. **`==` vs `===`?** — `==` converts types before comparing; `===` compares type and value, so use `===`.
5. **What is the event loop?** — It runs your code, then all promise callbacks (microtasks), then one timer/event task (macrotask), and repeats.
6. **What is a Promise?** — An object for a value that arrives later; it is pending, then fulfilled or rejected.
7. **What does `async/await` do?** — It lets you write promise code that reads like normal step-by-step code.
8. **What is `this`?** — The object a function was called on; arrow functions don't have their own and use the outer one.
9. **`call` vs `apply` vs `bind`?** — `call` and `apply` run the function now with a chosen `this` (args as a list vs an array); `bind` returns a new function with `this` fixed.
10. **What is prototypal inheritance?** — Objects inherit properties from another object through the prototype chain.
11. **What are the falsy values?** — `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` and `NaN`.
12. **`null` vs `undefined`?** — `undefined` means "not set yet"; `null` means "set to nothing on purpose".
13. **What is event delegation?** — One listener on a parent handles events from all its children using `event.target`.
14. **Debounce vs throttle?** — Debounce runs after activity stops; throttle runs at most once per time window.
15. **`map` vs `forEach`?** — `map` returns a new array; `forEach` just loops and returns nothing.
16. **Shallow vs deep copy?** — A shallow copy (`{...obj}`) copies one level; a deep copy (`structuredClone`) copies everything nested.
17. **What is a higher-order function?** — A function that takes or returns another function, like `map` or `filter`.
18. **What is currying?** — Turning `f(a, b)` into `f(a)(b)`, one argument at a time.
19. **`localStorage` vs `sessionStorage` vs cookies?** — `localStorage` persists, `sessionStorage` lasts for one tab, cookies are sent to the server with each request.
20. **What is the temporal dead zone?** — The time between entering a scope and the `let`/`const` line, when using the variable throws an error.
21. **`Promise.all` vs `Promise.allSettled`?** — `all` fails on the first rejection; `allSettled` waits for every promise and reports each result.
22. **What is a pure function?** — A function that always returns the same output for the same input and changes nothing outside itself.
