# REST API — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## REST API
🍽️ A restaurant menu: you order by name (URL) and say what you want done (GET to see, POST to order, DELETE to cancel).
**Really:** resources at URLs, acted on with HTTP methods.

## Stateless
🏪 A shop assistant who doesn't remember you — you show your membership card every visit.
**Really:** every request carries everything needed, like the auth token.

## Idempotent
🛗 Pressing the lift button five times still calls one lift.
**Really:** repeating the request has the same effect as doing it once.

## PUT vs PATCH
🖼️ PUT: replace the whole painting. PATCH: touch up one corner.
**Really:** PUT replaces the full resource; PATCH changes some fields.

## Status codes
🚦 Traffic lights for answers: 2xx green (all good), 4xx "you made a mistake", 5xx "we made a mistake".
**Really:** the first digit tells you who's at fault.

## Pagination
📖 A book split into pages instead of one endless scroll.
**Really:** return results in chunks.

## Idempotency key
🧾 A receipt number: if you hand over the same receipt twice, the cashier doesn't charge you twice.
**Really:** a unique key makes retried requests safe.
