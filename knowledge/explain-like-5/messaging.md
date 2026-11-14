# Kafka & RabbitMQ — Explain Like I'm 5

> Hard ideas as everyday pictures, then what they really mean.

## Message queue
📬 A post box: you drop a letter and walk away; the postman delivers it later.
**Really:** the sender doesn't wait for the receiver.

## Kafka
📓 A diary everyone can read. Pages are never torn out, and each reader keeps their own bookmark.
**Really:** a log that keeps messages; each consumer tracks its own offset.

## RabbitMQ
🏤 A post office: letters are sorted into boxes and handed out; once delivered, they're gone.
**Really:** a broker that routes messages to queues and deletes them after ack.

## Partition
🛣️ A highway with several lanes: cars in the same lane stay in order.
**Really:** order is kept within a partition, not across the topic.

## Consumer group
👷 A team sharing a pile of boxes: each box is handled by exactly one worker.
**Really:** each partition is read by one consumer in the group.

## Dead letter queue
📦 The "return to sender" shelf for parcels that can't be delivered.
**Really:** failed messages are parked for later inspection.

## Idempotent consumer
✅ Ticking a checklist item that's already ticked changes nothing.
**Really:** handling the same message twice causes no harm.
