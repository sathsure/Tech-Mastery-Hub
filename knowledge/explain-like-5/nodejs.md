# Node.js — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Event loop
🧑‍🍳 One waiter in a restaurant: takes an order, passes it to the kitchen, serves another table, and brings food when the kitchen rings.
**Really:** one thread handles many requests by never waiting on slow I/O.

## Non-blocking I/O
🧺 Starting the washing machine and doing homework instead of watching it spin.
**Really:** start I/O and keep working; handle the result when it's ready.

## Blocking the event loop
🚧 The waiter stops to cook a five-course meal himself — every table waits.
**Really:** long synchronous work freezes every request.

## Streams
🚿 Drinking from a tap instead of waiting for the whole tank to be delivered.
**Really:** process data piece by piece.

## Backpressure
🍽️ Telling the waiter "slow down, I'm still eating".
**Really:** a slow consumer signals the producer to pause.

## Middleware
🏭 An assembly line: each worker does one step, then passes it on (`next()`).
**Really:** functions that run in order for every request.

## Cluster
🧑‍🍳🧑‍🍳 Hiring more waiters so every table gets served faster.
**Really:** run one Node process per CPU core.
