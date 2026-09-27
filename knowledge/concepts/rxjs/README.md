# RxJS

## Definition

RxJS (Reactive Extensions for JavaScript) is presented as a library for reactive programming using Observables. The source describes functional, declarative pipelines for asynchronous and event-based programs.

## Core Concepts

### Observable
An Observable is described as a lazy, push-based collection that can emit values over time.

It can emit:

- `next(value)`
- `error(err)`
- `complete()`

`error` and `complete` are terminal notifications.

### Promise vs Observable
The source's mental model is:

- Promise: one future value.
- Observable: many future values over time.

### Observer
An Observer can define `next`, `error`, and `complete` callbacks.

### Subscription
`subscribe()` returns a Subscription representing active execution. `unsubscribe()` stops receiving values.

### Operators
An operator is described as a pure function that takes an Observable and returns another Observable.

Examples include:

- `map`
- `filter`
- `switchMap`
- `take`
- `debounceTime`
- `catchError`

### Creation vs Pipeable Operators

| Type | Purpose | Examples |
|---|---|---|
| Creation | Create Observables | `of`, `from`, `interval`, `timer`, `fromEvent`, `EMPTY` |
| Pipeable | Transform existing Observables | `map`, `filter`, `switchMap`, `catchError` |

### Lazy Execution
The source emphasizes that an Observable does not start producing values until subscribed to. Building a pipeline without subscribing does not execute its operators.

### Cold vs Hot
- Cold: each subscription gets its own execution.
- Hot: the source execution is shared.

The source uses HTTP requests as a cold example and DOM events/WebSockets/Subjects as hot examples.

### Multicasting
The source covers:

- `share()`
- `shareReplay(n)`
- `publish().refCount()`
- Subjects

It specifically discusses replaying the latest values and the memory-leak risk of keeping an infinite source subscribed.

### Subjects
A Subject is both an Observable and an Observer and can multicast values.

Covered Subject types:

- `Subject`
- `BehaviorSubject`
- `ReplaySubject`
- `AsyncSubject`

### Higher-Order Mapping
The source continues into operators for transforming streams into streams, including `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap`, with different concurrency/cancellation behavior.

## Learning Path

1. Observable mental model
2. Observer and Subscription
3. Creation operators
4. Pipeable operators
5. Lazy execution
6. Cold and hot Observables
7. Multicasting
8. Subjects
9. Higher-order mapping
10. Error handling and combination
11. Angular integration

## Repository Resources

- Interview: `interview/frontend/06-RxJS.md`
- Roadmap: `roadmap/frontend/README.md`

## Source Boundary

This page is based on the supplied RxJS repository evidence and should not be treated as a complete RxJS operator reference.

