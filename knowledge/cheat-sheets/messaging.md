# Kafka & RabbitMQ — Cheat Sheet

> **In one line:** message systems let one service send work or events to others without waiting for them.

## Why use messaging?
- Services don't depend on each other being up.
- Absorbs traffic spikes (messages wait in line).
- One event can reach many services.
- **Queue** — each message goes to one worker. **Pub/Sub** — each message goes to every subscriber.

## Kafka vs RabbitMQ
| | Kafka | RabbitMQ |
|---|---|---|
| Think of it as | a log you can re-read | a post office that delivers and forgets |
| After reading | message stays (for days) | message is deleted |
| Replay old messages | ✅ | ❌ |
| Speed | very high | high |
| Routing | by topic and key | flexible (exchanges) |
| Use for | event streams, analytics, logs | task queues, complex routing |

## Kafka words
- **Topic** — a named stream (e.g. `orders`).
- **Partition** — a topic is split into partitions; order is kept *inside* each one.
- **Key** — messages with the same key go to the same partition (so they stay in order).
- **Broker** — a Kafka server. Partitions are copied to several brokers.
- **Consumer group** — consumers sharing the work; each partition goes to one consumer in the group.
- **Offset** — a consumer's position in a partition.
- **Retention** — how long messages are kept.

```
Topic "orders" (3 partitions)  →  group "billing": C1 reads P0+P1, C2 reads P2
```

## Delivery guarantees
- **At most once** — may lose messages.
- **At least once** (common) — may get duplicates → make consumers **idempotent**.
- **Exactly once** — Kafka transactions + idempotent producer (inside Kafka only).
- Producer `acks=all` — wait until copies are saved (safest).

## RabbitMQ words
- Producer → **Exchange** → (routing key + binding) → **Queue** → Consumer.
- Exchange types: **direct** (exact key), **topic** (pattern like `order.*`), **fanout** (everyone), **headers**.
- **Ack** — consumer confirms it's done; unacked messages are redelivered.
- **Prefetch** — how many unacked messages a consumer may hold.

## Common patterns
- **Dead letter queue (DLQ)** — where failing messages go after N tries.
- **Retry with backoff** — try again later, not instantly.
- **Outbox pattern** — publish reliably together with a DB write.
- **Consumer lag** — how far behind consumers are (watch it in Kafka).
- **Schema registry** — keep message formats compatible (Avro/Protobuf).

## In Spring
```java
kafkaTemplate.send("orders", order.id(), order);
@KafkaListener(topics = "orders", groupId = "billing") void on(Order o) { … }

rabbitTemplate.convertAndSend("emails", "welcome", msg);
@RabbitListener(queues = "emails") void on(Email e) { … }
```

## Other tools
AWS SQS/SNS, Google Pub/Sub, ActiveMQ, NATS, Redis Streams.
