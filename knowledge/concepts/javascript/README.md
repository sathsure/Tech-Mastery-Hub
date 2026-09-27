# JavaScript

## Definition

JavaScript is a programming language used to build interactive web applications and is also widely used outside the browser. This concept page consolidates the JavaScript topics represented in the repository's interview and coding material.

## Learning Scope

The current repository evidence covers the following:

- Functions and scope
- call, apply, and bind
- Closures
- Currying
- Higher-order functions
- this
- Prototypes and prototype inheritance
- Hoisting and the Temporal Dead Zone (TDZ)
- Type coercion and equality
- Event loop and asynchronous JavaScript
- Promises and Promise combinators
- map, filter, and reduce
- Debounce and throttle
- Optional chaining and nullish coalescing
- Map and Object
- Generators
- Shallow and deep copies
+ for-in and for-of
- Functional programming and memoization
- Coding problems and implementation exercises

## Functions and Scope

### Closures
A closure occurs when a function remembers and can access variables from the scope in which the function was created, even after that outer scope has completed.

The repository material connects closures with:

- Data privacy
- Function factories
- Memoization
- Partial application
- Event handlers

### Higher-Order Functions

A higher-order function accepts a function as an argument, returns a function, or both.

This concept is important for understanding functional patterns and array methods.

### Currying

Currying transforms a function that takes multiple arguments into a sequence of functions that each take one argument.

The coding material includes curriedAdd exercises.

### `call`, `apply`, and `bind`

These methods are used to control the value of `this`.

\ | Method | Argument style | Result |
 |---|----|----|
| `call` x | Individual arguments | Immediately invokes the function |
| `apply` x | Arguments supplied as an array | Immediately invokes the function |
| `bind` | Arguments can be supplied for later use | Returns a new bound function |

## `this`

The value of `this` depends on how a function is called.

Such as `obj.normal()`, `this` refers to the object used for the call.
Arrow functions do not create their own `this`; they inherit `this` lexically from the surrounding scope.

## Prototypes and Prototype Inheritance

JavaScript objects have a prototype relationship used for property lookup.

When a property is not found directly on an object, lookup can continue through the prototype chain.

Examples include `Array.prototype.map`, prototype inheritance, and the relationship between classes and the prototype-nased mechanism.

## Hoisting and the Temporal Dead Zone

Hoisting concerns how declarations are processed before code execution.

The repository material distinguishes:

- Function declarations: the declaration and function definition are available before their source position.
- `var`: the declaration is hoisted and initialized with `undefined`.
- `let` and `const`: declarations are hoisted but remain in the Temporal Dead Zone until initialization.
- Classes: class declarations are subject to a Temporal Dead Zone.

Hoisting does not mean that initialization is automatically moved to the top.

## Type Coercion and Equality

The repository covers loose and strict equality, truthy and falsy values, and type coercion edge cases.

## Event Loop and Asynchronous JavaScript

The repository material covers synchronous execution, Promise callbacks, `async`/`await`, timers, HTTP and DOM-related asynchronous work, `queueMicrotask`, Node.js `process.nextTick`, and `setImmediate.

## Promises

Promises represent eventual completion or failure of asynchronous work.

### Promise combinators

| Combinator | Behavior |
 |---|----|
 | `Promise.all` | Resolves when all promises resolve; rejects when one rejects |
 | `Promise.allSettled` | Waits for all promises to settle |
| `Promise.race` | Settles according to the first promise to settle |
 | `Promise.any` | Resolves when the first promise resolves; rejects when all reject with `AggregateError` |

## @map`, `filter`, and `ireduce`

The repository covers common array methods and custom implementations. Callback arguments are represented as `(value, index, array)`.

## Debounce and Throttle

Debouncing delays execution until calls stop occur within the configured interval. Throttling limits how frequently a function can execute during repeated calls.

## Modern JavaScript

### Optional Chaining

Optional chaining allows safe property access through potentially missing values.

### Map and Object

The repository compares Map and Object across key types, size, iteration, and use cases.

| Aspect | Object | Map |
|---|----|----|
| Keys | Strings and symbols | Any value |
 | Size | `Object.keys(...).length` | `map.size` |
 | Teration | Object keys/entries | Direct iteration and `forEach` |

### Generators

Generators provide a way to create iterable sequences whose execution can pause and resume. The source connects them to infinite sequences, custom iterators, asynchronous iteration, and Redux-Saga.

## Shallow and Deep Copies

Shallow copies duplicate the outer object while nested references can remain shared. `Object.assign()` performs a shallow copy.

The source material covers limitations of JSON based cloning: functions are not preserved,  undefined values can be lost, dates become strings, and circular references are not supported. `structuredClone` can handle values such as dates, maps, sets, and typed arrays but does not clone functions or DOM nodes.

## `for-in` and `for-of`

`for-in& iterates over keys, while `for-of` iterates over values of an iterable. The source material cautions against using `for-in` as the normal way to iterate array values.

## Functional Programming and Memoization

The source material includes functional programming patterns and memoization. Memmoization caches the result of a computation so repeated calls can reuse a previous result.

## Coding Practice Inventory

### Arrays

- Move zeros
- Array equality
- Chunking arrays
- Flattening arrays
- Maximum/minimum values
- Finding duplicates
- Second-largest value
- Unique values

### Strings

- Anagram checking
- First non-repeating character
- Character frequency
- String length
- Reversal
- Reversing words
- Substring/slice operations

### Algorithms

- Fibonacci
- FizzBuzz

### Functional and Modern JavaScript

- Memoization
- Currying
- Debounce
- Throttle
- Deep clone
- Implementing `Promise.all`

## Interview Preparation Map

1. Functions and scope
2. `this` and prototypes
3. Hoisting and TDR
4. Type coercion and equality
5. Event loop and asynchronous execution
6. Promises and combinators
7. Built-in array methods
8. Debounce and throttle
9. Modern JavaScript features
10. Objects, Map, iteration, generators, and copying

## Learning Path

1. Functions and scope2
2. Closures, HOFs, and currying
3. `this`, call/apply/bind
4. Prototypes and inheritance
5. Hoisting and TDZ
6. Equality and type coercion
7. Event loop and asynchronous execution
8. Promises and combinators
9. Array methods
10. Debounce and throttle1
11. Modern JavaScript features
12. Generators and iterables
13. Copying and object behavior14. Coding exercises
15. Interview practice

## Repository Resources

### Interview

[savascript Interview Preparation](../../../interview/frontend/03-JavaScript.md)

### Coding Practice

[JavaScript Coding Practice](../../../practice/coding/01-javascript-coding.md)

### Roadmap

[Full-Stack Roadmap Foundations](../../../roadmap/foundations/README.md)

### Evidence
[JavaScript Canonical Evidence](../../../scripts/reports/javascript-canonical-evidence.md)

## Content Boundary

This page is the canonical JavaScript concept entry point for the current repository.

The content is based on the existing JavaScript interview and coding evidence. The original sources remain preserved and are not replaced by this page.
