# Kafka & RabbitMQ — One-liners

> The most asked questions, each answered in one sentence.

1. **Why use a message broker?** — To decouple services, absorb spikes and process work asynchronously.
2. **Kafka vs RabbitMQ?** — Kafka is a replayable event log for high-volume streams; RabbitMQ is a broker for task queues and flexible routing.
3. **What is a Kafka topic?** — A named stream of events.
4. **What is a partition?** — A slice of a topic; order is kept within each partition.
5. **Why use a message key?** — Messages with the same key go to the same partition, so they stay in order.
6. **What is a consumer group?** — Consumers sharing a topic's partitions, each partition read by one member.
7. **What is an offset?** — A consumer's position within a partition.
8. **What is a rebalance?** — Reassigning partitions when consumers join or leave a group.
9. **What is the ISR?** — In-sync replicas: copies of a partition that are up to date with the leader.
10. **What does `acks=all` mean?** — The producer waits until all in-sync replicas have the message.
11. **At-least-once vs exactly-once?** — At-least-once may deliver duplicates; exactly-once uses transactions to avoid them within Kafka.
12. **What is log compaction?** — Keeping only the latest message for each key.
13. **What replaced ZooKeeper in Kafka?** — KRaft, Kafka's built-in metadata quorum.
14. **What is a RabbitMQ exchange?** — The component that receives messages and routes them to queues.
15. **Direct vs topic vs fanout exchange?** — Direct matches the exact key, topic matches patterns, fanout sends to every bound queue.
16. **What is a message ack?** — A consumer's confirmation that it finished a message.
17. **What is prefetch?** — The number of unacknowledged messages a RabbitMQ consumer may hold.
18. **What is a dead letter queue?** — Where messages go after failing too many times or expiring.
19. **What is an idempotent consumer?** — A consumer that handles the same message twice without bad effects.
20. **What is consumer lag?** — How far a consumer is behind the latest message.
