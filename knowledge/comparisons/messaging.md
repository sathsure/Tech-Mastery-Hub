# Kafka & RabbitMQ — Comparisons

> The classic "X vs Y" questions, side by side.

## Kafka vs RabbitMQ
| | Kafka | RabbitMQ |
|---|---|---|
| Model | distributed log | message broker |
| After consumption | kept (retention) | deleted |
| Replay | ✅ | ❌ |
| Ordering | per partition | per queue |
| Routing | topic + key | exchanges (direct, topic, fanout) |
| Consumers | pull | push |
| Best for | event streams, analytics | task queues, routing |

## Queue vs pub/sub
| | Queue | Pub/Sub |
|---|---|---|
| Each message goes to | one consumer | every subscriber |
| Example | email jobs | "order placed" event |

## At-most-once vs at-least-once vs exactly-once
| | Lost messages | Duplicates |
|---|---|---|
| At most once | possible | ❌ |
| At least once | ❌ | possible |
| Exactly once | ❌ | ❌ (within Kafka) |

## Direct vs topic vs fanout exchange
| | Routes by |
|---|---|
| Direct | exact routing key |
| Topic | pattern (`order.*`, `#`) |
| Fanout | nothing — all bound queues |
| Headers | message headers |

## `acks=0` vs `acks=1` vs `acks=all`
| | Waits for | Durability |
|---|---|---|
| `0` | nothing | lowest |
| `1` | the leader | medium |
| `all` | all in-sync replicas | highest |

## Kafka vs SQS
| | Kafka | SQS |
|---|---|---|
| Hosting | self-managed / MSK / Confluent | fully managed |
| Replay | ✅ | ❌ |
| Ordering | per partition | FIFO queues only |

## Auto-commit vs manual commit
| | Auto | Manual |
|---|---|---|
| Control | low | high |
| Risk | lose messages on crash | must remember to commit |
