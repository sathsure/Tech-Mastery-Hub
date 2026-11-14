# Spring Boot — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## IoC container
🏨 A hotel: you don't build your bed or cook — the hotel provides everything when you arrive.
**Really:** Spring creates and manages your objects (beans).

## Dependency injection
🍕 You order pizza and it's delivered — you don't go find the ingredients.
**Really:** Spring hands each bean the other beans it needs.

## Auto-configuration
📱 A new phone that sets itself up when you insert a SIM card.
**Really:** Spring Boot creates sensible beans based on what's on the classpath.

## Starters
🧰 A ready-made toolkit box instead of buying each tool separately.
**Really:** dependency bundles for a feature (web, JPA, security).

## @Transactional
🏦 A bank transfer: money leaves one account and arrives in another — both happen or neither does.
**Really:** all DB changes in the method commit together or roll back together.

## Proxy (why self-calls skip @Transactional)
📞 A receptionist adds a note to every call that comes in through them — but if you call your own desk, there's no note.
**Really:** Spring's features run through a proxy; calls inside the same class bypass it.

## N+1 problem
🛒 Going to the shop once for the list, then once for each item, instead of buying everything in one trip.
**Really:** one query for parents plus one per child, instead of one joined query.
