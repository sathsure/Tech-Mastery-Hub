# System Design — Comparisons

> The classic "X vs Y" questions, side by side.

## Vertical vs horizontal scaling
| | Vertical | Horizontal |
|---|---|---|
| How | bigger machine | more machines |
| Limit | hardware ceiling | almost none |
| Needs stateless app | ❌ | ✅ |

## SQL vs NoSQL (design view)
| | SQL | NoSQL |
|---|---|---|
| Pick when | relations, transactions | huge scale, simple access patterns |
| Example | orders, payments | sessions, feeds, IoT data |

## Strong vs eventual consistency
| | Strong | Eventual |
|---|---|---|
| Reads see latest write | always | after a short delay |
| Latency | higher | lower |
| Example | bank balance | likes count |

## CP vs AP (CAP)
| | CP | AP |
|---|---|---|
| During a partition | refuse some requests | answer, maybe stale |
| Example | ZooKeeper, HBase | Cassandra, DynamoDB (default) |

## Push vs pull (fan-out)
| | Fan-out on write (push) | Fan-out on read (pull) |
|---|---|---|
| Work happens | when posting | when reading |
| Good for | normal users | celebrities |

## L4 vs L7 load balancer
| | L4 | L7 |
|---|---|---|
| Sees | IP, port | HTTP path, headers |
| Speed | faster | smarter routing |

## Cache vs CDN
| | Cache (Redis) | CDN |
|---|---|---|
| Stores | app data | static files/media |
| Location | near your servers | near users |

## Queue vs stream
| | Queue (SQS, RabbitMQ) | Stream (Kafka) |
|---|---|---|
| After reading | removed | kept |
| Replay | ❌ | ✅ |

## Polling vs WebSocket vs SSE
| | Direction | Cost |
|---|---|---|
| Polling | client asks | wasteful |
| WebSocket | both ways | one open connection |
| SSE | server → client | one open connection |

## Token bucket vs sliding window
| | Allows bursts | Precision |
|---|---|---|
| Token bucket | ✅ | good |
| Sliding window | ❌ | high |

## Leader–follower vs leaderless replication
| | Writes go to | Example |
|---|---|---|
| Leader–follower | one leader | MySQL, Postgres |
| Leaderless | any node (quorum) | Cassandra |
