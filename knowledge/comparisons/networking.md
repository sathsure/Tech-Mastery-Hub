# Networking & HTTP — Comparisons

> The classic "X vs Y" questions, side by side.

## TCP vs UDP
| | TCP | UDP |
|---|---|---|
| Connection | ✅ handshake | ❌ |
| Reliable, ordered | ✅ | ❌ |
| Speed | slower | faster |
| Used for | web, email, DB | video, games, DNS |

## HTTP/1.1 vs HTTP/2 vs HTTP/3
| | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---|---|---|---|
| Transport | TCP | TCP | QUIC (UDP) |
| Many requests per connection | one at a time | ✅ multiplexed | ✅ |
| Head-of-line blocking | ✅ | at TCP level | ❌ |

## HTTP vs HTTPS
| | HTTP | HTTPS |
|---|---|---|
| Encrypted | ❌ | ✅ (TLS) |
| Default port | 80 | 443 |

## Symmetric vs asymmetric encryption
| | Symmetric | Asymmetric |
|---|---|---|
| Keys | one shared | public + private |
| Speed | fast | slow |
| TLS uses it for | the data | agreeing on keys |

## A vs AAAA vs CNAME vs MX
| Record | Points to |
|---|---|
| A | IPv4 address |
| AAAA | IPv6 address |
| CNAME | another name |
| MX | mail server |

## IPv4 vs IPv6
| | IPv4 | IPv6 |
|---|---|---|
| Size | 32-bit | 128-bit |
| Example | `192.168.1.1` | `2001:db8::1` |

## Switch vs router
| | Switch | Router |
|---|---|---|
| Connects | devices in one network | different networks |
| Uses | MAC addresses | IP addresses |

## Public vs private IP
| | Public | Private |
|---|---|---|
| Reachable from internet | ✅ | ❌ (needs NAT) |
| Ranges | everything else | `10.x`, `172.16–31.x`, `192.168.x` |

## Latency vs bandwidth vs throughput
| | Means |
|---|---|
| Latency | delay for one trip |
| Bandwidth | maximum capacity |
| Throughput | actual data rate achieved |

## OSI vs TCP/IP model
| | OSI | TCP/IP |
|---|---|---|
| Layers | 7 | 4 |
| Use | teaching | real networks |
