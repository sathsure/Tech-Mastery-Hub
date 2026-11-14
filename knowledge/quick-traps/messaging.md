# Kafka & RabbitMQ — Quick Traps

> Tricky spots interviewers love: what goes wrong, a tiny example, and the right answer.

### 1. More consumers than partitions
- ❌ 3 partitions, 6 consumers in a group → "6× faster".
- ✅ Only 3 work; the rest sit idle. Partitions limit parallelism.

### 2. Ordering across a topic
- ❌ Expecting global order in a multi-partition topic.
- ✅ Order is per partition. Use the same key (e.g. order id) for related events.

### 3. Adding partitions later
- ❌ Increasing partitions on a keyed topic.
- ✅ Keys map to new partitions → ordering per key breaks for a while. Plan partitions up front.

### 4. "Exactly once" everywhere
- ❌ "Kafka guarantees exactly-once, so my DB won't get duplicates."
- ✅ Exactly-once covers Kafka-to-Kafka. With external systems, make consumers idempotent.

### 5. Committing before processing
- ❌ Auto-commit, then the consumer crashes → message lost.
- ✅ Process first, then commit (at-least-once).

### 6. Kafka as a queue
- ❌ Expecting to delete or ack single messages in Kafka.
- ✅ Kafka keeps messages until retention ends; consumers just move their offset.

### 7. Poison messages
- ❌ One bad message retried forever blocks the partition/queue.
- ✅ Retry a few times, then send it to a dead letter queue.

### 8. Messages lost on RabbitMQ restart
- ❌ Non-durable queue or non-persistent messages.
- ✅ Durable (or quorum) queues + persistent messages + publisher confirms.

### 9. No prefetch limit
- ❌ One RabbitMQ consumer grabs thousands of messages and others starve.
- ✅ Set a prefetch count (e.g. 10–50).

### 10. Messaging is the same as the DB write
- ❌ Saving to the DB then sending — assuming both always succeed.
- ✅ Use the outbox pattern.
