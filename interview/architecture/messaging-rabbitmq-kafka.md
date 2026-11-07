# Messaging: RabbitMQ vs Kafka

## How They Work

### ❓ How does RabbitMQ deliver messages?

### 📝 Answer

RabbitMQ is a **message broker** that typically **pushes** messages to consumers:

1. A producer sends a message (to an exchange, which routes it to a queue).
2. The queue stores the message.
3. RabbitMQ delivers it to a consumer.
4. The consumer **acknowledges** it → RabbitMQ removes it from the queue.

If the consumer crashes before acknowledging, RabbitMQ **redelivers** the message to another consumer. A message is not deleted just because it was sent — it stays until it is acknowledged (or expires, or is dead-lettered by a configured rule). Queues and messages can be persisted to disk.

```text
Producer → Exchange → Queue → (push) → Consumer → ack → message removed
```

---

### ❓ How does Kafka deliver events?

### 📝 Answer

Kafka is a **distributed event log**; consumers **pull** events:

1. A producer publishes an event to a **topic** (split into partitions).
2. Kafka appends it to the partition's log and stores it.
3. Consumers **poll** Kafka and read events at their own pace.
4. Each consumer group tracks its position with an **offset**.
5. Events stay in Kafka for the configured **retention** period or size — even after they've been read.

```text
Producer → Topic (partitioned log) ← (poll) ← Consumer group A (offset 42)
                                    ← (poll) ← Consumer group B (offset 17)
```

Because events aren't removed on read, consumers can **replay** them by moving their offset back.

---

### ❓ How do Kafka consumer groups and partitions work?

### 📝 Answer

- **Different consumer groups** each receive **every** event independently (inventory, notifications and analytics can all read the same `OrderCreated` event).
- **Within one group**, the topic's partitions are divided among the consumers: each partition is read by **one consumer of the group at a time**, so the group shares the work.
- Ordering is guaranteed **within a partition**, not across a whole topic — events with the same key (e.g. `orderId`) go to the same partition and stay in order.
- More consumers than partitions in a group means the extra consumers sit idle.

---

### ❓ What is the difference between RabbitMQ and Kafka?

### 📝 Answer

| Concept | RabbitMQ | Kafka |
|---|---|---|
| Model | Message broker / queues | Distributed event log |
| Delivery | Typically push | Consumers pull (poll) |
| Stores messages? | Yes, until acknowledged | Yes, for the retention period |
| Removed after consumption? | Normally after acknowledgement | No — governed by retention |
| Several independent consumers of the same message | Yes, by routing copies to separate queues | Yes, with separate consumer groups |
| Replay old messages | Possible in some setups, not the usual model | Core capability |
| Strengths | Flexible routing, per-message acks, task queues | Very high throughput, durable streams, replay |

---

### ❓ What are common misconceptions about RabbitMQ and Kafka?

### 📝 Answer

| Statement | Correction |
|---|---|
| "RabbitMQ sends the work and forgets it." | It keeps the message until the consumer **acknowledges** it, and redelivers it if the consumer fails. |
| "Kafka passes the producer's event straight to consumers." | The producer publishes to **Kafka**, not to consumers. Consumers independently poll Kafka and read at their own pace. |
| "RabbitMQ doesn't store messages; only Kafka does." | Both store data. RabbitMQ stores messages in queues until acknowledged (and can persist them to disk); Kafka stores events in a log for a retention period, even after they've been read. |

## When to Use Which

### ❓ When should you use RabbitMQ (use cases)?

### 📝 Answer

Use RabbitMQ for **task-based communication** — one service hands work to another to be processed once.

- **Email and SMS notifications:** the Order Service queues a notification task; the Notification Service processes it; failures are retried or redelivered.
- **Background jobs:** a user uploads a document; a document-processing job is queued; a worker generates the PDF or thumbnail.
- **Payment processing:** payment requests are queued and processed asynchronously; acknowledgements and retries handle temporary failures.
- **Routing work to different workers** by type or priority using exchanges and routing keys.

---

### ❓ When should you use Kafka (use cases)?

### 📝 Answer

Use Kafka for **event streaming** — business events that must be stored and consumed by several independent systems, often at high volume.

- **E-commerce order events:** an `OrderCreated` event is published once; Inventory updates stock, Notification sends a confirmation, Analytics records the sale — each independently.
- **Real-time transaction monitoring:** banking transactions are published as events; fraud detection and spending analytics consume the same stream; events can be replayed within the retention window.
- **IoT and application logs:** thousands of devices or services publish events; monitoring and analytics process the same high-volume stream.

---

### ❓ How do you choose between RabbitMQ and Kafka for a requirement?

### 📝 Answer

| Requirement | Choose |
|---|---|
| Send an email task to a worker | RabbitMQ |
| Queue background jobs | RabbitMQ |
| Route tasks to different workers | RabbitMQ |
| Share order events with multiple services | Kafka |
| Process millions of events continuously | Kafka |
| Replay historical events | Kafka |
| Stream logs or IoT data | Kafka |

**Short rule:** RabbitMQ when a **task** should be done once by a worker; Kafka when an **event** should be kept and read by many.
