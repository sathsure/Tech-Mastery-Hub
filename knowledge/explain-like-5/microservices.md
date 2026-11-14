# Microservices — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Monolith vs microservices
🏬 A monolith is one big department store with one manager. Microservices are a food court: each stall cooks its own dish and can close for repairs without shutting the others.
**Really:** one deployable app vs many small independent services.

## Database per service
🍳 Each food stall has its own fridge — nobody takes ingredients from another stall's fridge.
**Really:** services don't share tables; they ask each other through APIs or events.

## Saga
✈️ Booking a trip: flight, hotel, car. If the car fails, you cancel the hotel and flight you already booked.
**Really:** a chain of steps with "undo" steps if one fails.

## Outbox pattern
📮 Writing the letter and putting it in your outbox in one go; the postman collects it later, so it's never forgotten.
**Really:** save the event with the data in one transaction, publish it later.

## Eventual consistency
📰 News reaches every village, but not at the same second.
**Really:** all services agree after a short delay.

## Circuit breaker
⚡ A fuse that trips so one faulty appliance doesn't burn the house.
**Really:** stop calling a failing service for a while.
