# Spring Cloud — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Service discovery
📒 A phone book that updates itself as people move house.
**Really:** services register themselves; callers find them by name.

## API Gateway
🏢 The reception desk of an office: every visitor checks in there and is sent to the right floor.
**Really:** one entry point that routes, authenticates and rate-limits.

## Config Server
📌 One notice board for the whole school instead of a note in every classroom.
**Really:** central configuration for all services.

## Circuit breaker
⚡ The fuse box at home: if a wire shorts, the fuse trips so the house doesn't burn; later you try switching it back.
**Really:** stop calling a failing service for a while, then test it again.

## Retry with backoff
📞 If a friend doesn't answer, call again in 1 minute, then 2, then 4 — not 100 times in a row.
**Really:** retry after growing delays.

## Bulkhead
🚢 A ship has separate compartments, so one leak doesn't sink the whole ship.
**Really:** limit resources per dependency so one failure can't take everything.

## Distributed tracing
📦 A parcel tracking number you can follow through every sorting centre.
**Really:** one trace id follows a request across all services.
