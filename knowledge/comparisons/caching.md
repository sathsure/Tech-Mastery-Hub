# Caching & Redis — Comparisons

> The classic "X vs Y" questions, side by side.

## Caching strategies
| | Read path | Write path | Risk |
|---|---|---|---|
| Cache-aside | app loads on miss | app writes DB, deletes key | stale data briefly |
| Read-through | cache loads on miss | — | needs provider support |
| Write-through | — | cache + DB together | slower writes |
| Write-behind | — | cache now, DB later | data loss on crash |
| Write-around | — | DB only | first read is a miss |

## LRU vs LFU vs FIFO
| | Removes first |
|---|---|
| LRU | used longest ago |
| LFU | used least often |
| FIFO | added first |

## Local vs distributed cache
| | Local (Caffeine) | Distributed (Redis) |
|---|---|---|
| Speed | fastest | ~1 ms network hop |
| Shared by servers | ❌ | ✅ |
| Consistency across servers | ❌ | ✅ |

## Redis vs Memcached
| | Redis | Memcached |
|---|---|---|
| Data types | many | strings |
| Persistence | ✅ | ❌ |
| Replication / cluster | ✅ | client-side only |
| Threads | single (commands) | multi |

## RDB vs AOF
| | RDB | AOF |
|---|---|---|
| Saves | snapshots | every write |
| Data loss on crash | minutes | ~1 second |
| File size | small | larger |

## Stampede vs penetration vs avalanche
| | What | Fix |
|---|---|---|
| Stampede | hot key expires, many miss at once | lock / refresh early |
| Penetration | keys that never exist | cache nulls, Bloom filter |
| Avalanche | many keys expire together | random TTL jitter |

## `no-cache` vs `no-store`
| | `no-cache` | `no-store` |
|---|---|---|
| Stored | ✅ | ❌ |
| Must revalidate | ✅ | — |

## Sentinel vs Cluster
| | Sentinel | Cluster |
|---|---|---|
| Gives | failover | failover + sharding |
| Data split | ❌ | ✅ |
